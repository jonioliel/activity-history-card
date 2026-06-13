import { LitElement, html, nothing, type TemplateResult } from "lit";
import { activityHistoryCardStyles } from "./styles";
import { DEFAULT_CONFIG, DOMAIN_LABELS_HE } from "./defaults";
import { resolveEntityMetas } from "./entity-resolver";
import { filterRows, groupRows } from "./filters";
import { fetchHistory } from "./history-client";
import { formatDuration, isRtl, resolveTimeRange } from "./format";
import { intervalizeHistory } from "./intervalize";
import { summarizeActivity } from "./summary";
import { renderSwimlaneTimeline } from "./renderers/swimlane-renderer";
import { renderHeatmapPlaceholder } from "./renderers/heatmap-renderer";
import { renderDetailPlaceholder } from "./renderers/detail-renderer";
import { renderCorrelationPlaceholder } from "./renderers/correlation-renderer";
import type {
  ActivityHistoryCardConfig,
  ActivitySummary,
  FilterState,
  HistoryStateRecord,
  HomeAssistant,
  TimelineGroup,
  TimelineRow,
} from "./types";

const CARD_VERSION = "0.1.0";

export class ActivityHistoryCard extends LitElement {
  static override styles = activityHistoryCardStyles;

  private _config!: ActivityHistoryCardConfig;
  private _hass?: HomeAssistant;
  private _rows: TimelineRow[] = [];
  private _groups: TimelineGroup[] = [];
  private _summary?: ActivitySummary;
  private _loading = false;
  private _error?: string;
  private _fullscreen = false;
  private _filterSheetOpen = false;
  private _fetchToken = 0;
  private _lastFetchKey = "";
  private _historyCache = new Map<string, Record<string, HistoryStateRecord[]>>();
  private _unsubscribeHistory?: () => void;

  private _filter: FilterState = {
    search: "",
    areas: [],
    domains: [],
    stateMode: "all",
    groupBy: "area",
  };

  setConfig(config: ActivityHistoryCardConfig): void {
    if (!config || config.type !== "custom:activity-history-card") {
      throw new Error("Invalid card type. Expected custom:activity-history-card");
    }

    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      view_mode: config.view_mode ?? config.default_view ?? "swimlane",
      group_by: config.group_by ?? DEFAULT_CONFIG.group_by,
      filters: {
        show: true,
        show_search: true,
        show_area_chips: true,
        show_domain_chips: true,
        show_state_mode: true,
        active_only: false,
        ...(config.filters ?? {}),
      },
    };

    this._filter = {
      ...this._filter,
      domains: this._config.filters?.default_domains ?? [],
      areas: this._config.filters?.default_areas ?? [],
      stateMode: this._config.filters?.active_only ? "active_only" : "all",
      groupBy: this._config.group_by ?? "area",
    };

    this._lastFetchKey = "";
    this.requestUpdate();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    void this._fetchAndRender();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeHistory?.();
    this._unsubscribeHistory = undefined;
    document.removeEventListener("keydown", this._onDocumentKeyDown);
  }

  getCardSize(): number {
    const rowCount = this._rows.length || (this._config?.entities?.length ?? 3);
    return Math.min(18, Math.max(5, Math.ceil(rowCount * 0.7) + 4));
  }

  getGridOptions() {
    return {
      columns: this._config?.display_mode === "panel" ? "full" : 12,
      min_columns: 6,
      rows: this._config?.display_mode === "panel" ? 12 : 8,
      min_rows: 5,
    };
  }

  protected override render(): TemplateResult {
    if (!this._config) return html``;

    const lang = this._hass?.locale?.language ?? this._hass?.language;
    const rtl = isRtl(this._config.direction ?? this._config.rtl ?? "auto", lang);
    const classes = [
      "ahc",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      this._fullscreen || this._config.display_mode === "fullscreen" ? "ahc--fullscreen" : "",
      this._rows.length > 40 ? "ahc--dense" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <ha-card class=${classes} dir=${rtl ? "rtl" : "ltr"}>
        ${this._renderHeader()} ${this._renderFilters()} ${this._renderSummary()}
        <div class=${this._config.show_insights === false ? "ahc__body ahc__body--no-insights" : "ahc__body"}>
          <main class="ahc__main">${this._renderMainContent()}</main>
          ${this._config.show_insights === false ? nothing : this._renderInsights()}
        </div>
        ${this._filterSheetOpen ? this._renderFilterSheet() : nothing}
      </ha-card>
    `;
  }

  private _renderHeader(): TemplateResult {
    return html`
      <header class="ahc__topbar">
        <div class="ahc__toolbar">
          ${this._config.show_fullscreen_button === false
            ? nothing
            : html`<button class="ahc__button ahc__button--ghost" @click=${this._toggleFullscreen} aria-pressed=${this._fullscreen ? "true" : "false"}>
                <span aria-hidden="true">⛶</span><span>מסך מלא</span>
              </button>`}
          <div class="ahc__segmented" aria-label="קיבוץ לפי">
            <button class="ahc__segmented-button" aria-pressed=${this._filter.groupBy === "area"} @click=${() => this._setGroupBy("area")}>אזור</button>
            <button class="ahc__segmented-button" aria-pressed=${this._filter.groupBy === "domain"} @click=${() => this._setGroupBy("domain")}>רכיב</button>
          </div>
          <div class="ahc__search">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input
              class="ahc__search-input"
              type="search"
              .value=${this._filter.search}
              placeholder="חיפוש רכיב או אזור..."
              @input=${this._onSearchInput}
            />
          </div>
          <button class="ahc__button ahc__button--ghost" @click=${this._openFilterSheet} aria-expanded=${this._filterSheetOpen}>סינון</button>
        </div>
        <div class="ahc__title-block">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge" aria-hidden="true">▥</span>
            <h2 class="ahc__title">${this._config.title ?? DEFAULT_CONFIG.title}</h2>
          </div>
          <p class="ahc__subtitle">טווח זמן: ${this._config.hours_to_show ?? 24} שעות אחרונות • עודכן לפני דקה</p>
        </div>
      </header>
    `;
  }

  private _renderFilters(): TemplateResult | typeof nothing {
    if (this._config.filters?.show === false) return nothing;
    const domains = this._availableDomains();
    const areas = this._availableAreas();

    return html`
      <section class="ahc__filters" aria-label="מסננים">
        <div class="ahc__filter-row">
          <span class="ahc__filter-label">טווח זמן</span>
          ${this._renderChip("24 שעות", true, () => undefined)} ${this._renderChip("7 ימים", false, () => undefined)} ${this._renderChip("טווח מותאם", false, () => undefined)}
        </div>
        <div class="ahc__filter-row">
          <span class="ahc__filter-label">אזור</span>
          ${this._renderChip("הכל", !this._filter.areas.length, () => this._setAreas([]))}
          ${areas.map((area) => this._renderChip(area, this._filter.areas.includes(area), () => this._toggleArea(area)))}
        </div>
        <div class="ahc__filter-row">
          <span class="ahc__filter-label">סוג רכיב</span>
          ${this._renderChip("הכל", !this._filter.domains.length, () => this._setDomains([]))}
          ${domains.map((domain) => this._renderChip(DOMAIN_LABELS_HE[domain] ?? domain, this._filter.domains.includes(domain), () => this._toggleDomain(domain)))}
          ${this._renderChip("רק פעילים", this._filter.stateMode === "active_only", () => this._toggleActiveOnly())}
        </div>
      </section>
    `;
  }

  private _renderChip(label: string, pressed: boolean, onClick: () => void): TemplateResult {
    return html`<button class="ahc__chip" aria-pressed=${pressed ? "true" : "false"} @click=${onClick}>${label}</button>`;
  }

  private _renderSummary(): TemplateResult | typeof nothing {
    if (this._config.show_summary === false) return nothing;
    const summary = this._summary;
    return html`
      <section class="ahc__summary-grid" aria-label="סיכום פעילות">
        <article class="ahc__metric">
          <div class="ahc__metric-copy"><span class="ahc__metric-label">סה״כ זמן פעילות</span><span class="ahc__metric-value ahc__metric-value--positive">${formatDuration(summary?.totalActiveMs ?? 0)}</span><span class="ahc__metric-subtitle">בטווח הנבחר</span></div>
          <span class="ahc__metric-icon" aria-hidden="true">◷</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy"><span class="ahc__metric-label">מספר אירועים</span><span class="ahc__metric-value">${summary?.eventCount ?? 0}</span><span class="ahc__metric-subtitle">שינויי מצב פעילים</span></div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy"><span class="ahc__metric-label">פעילים כעת</span><span class="ahc__metric-value">${summary?.activeNowCount ?? 0}</span><span class="ahc__metric-subtitle">רכיבים פעילים</span></div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy"><span class="ahc__metric-label">אירוע אחרון</span><span class="ahc__metric-value">${summary?.lastEvent ? "לפני זמן קצר" : "אין"}</span><span class="ahc__metric-subtitle">${summary?.lastEvent?.entity_id ?? ""}</span></div>
          <span class="ahc__metric-icon" aria-hidden="true">♫</span>
        </article>
      </section>
    `;
  }

  private _renderMainContent(): TemplateResult {
    if (this._loading) return html`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">טוען היסטוריה...</h3><p>מושך נתונים מ-Home Assistant.</p></div></div>`;
    if (this._error) return html`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">שגיאה בטעינת היסטוריה</h3><p>${this._error}</p></div></div>`;
    if (!this._groups.length) return html`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">אין נתונים להצגה</h3><p>בחר רכיבים או ודא שה-Recorder שומר היסטוריה עבורם.</p></div></div>`;

    const range = resolveTimeRange(this._config);
    switch (this._config.view_mode ?? this._config.default_view ?? "swimlane") {
      case "heatmap":
        return renderHeatmapPlaceholder();
      case "detail":
        return renderDetailPlaceholder();
      case "correlation":
        return renderCorrelationPlaceholder();
      case "swimlane":
      default:
        return renderSwimlaneTimeline({ groups: this._groups, range, config: this._config, summary: this._summary ?? summarizeActivity(this._groups) });
    }
  }

  private _renderInsights(): TemplateResult {
    const summary = this._summary;
    return html`
      <aside class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title"><span>תובנות חכמות</span><span aria-hidden="true">✦</span></h3>
        <article class="ahc__insight-card"><span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span><span class="ahc__insight-value">${summary?.mostActiveEntity?.entity.name ?? "—"}</span><span class="ahc__insight-subtitle">${formatDuration(summary?.mostActiveEntity?.totalActiveMs ?? 0)}</span></article>
        <article class="ahc__insight-card"><span class="ahc__insight-kicker">האזור הפעיל ביותר</span><span class="ahc__insight-value">${summary?.mostActiveArea?.title ?? "—"}</span><span class="ahc__insight-subtitle">${formatDuration(summary?.mostActiveArea?.totalActiveMs ?? 0)}</span></article>
        <article class="ahc__insight-card"><span class="ahc__insight-kicker">שעות שיא</span><span class="ahc__insight-value">${summary?.peakBucketLabel ?? "—"}</span><span class="ahc__insight-subtitle">לפי משך פעילות</span></article>
      </aside>
    `;
  }

  private _renderFilterSheet(): TemplateResult {
    return html`
      <div class="ahc-filter-sheet-backdrop" @click=${this._closeFilterSheet}></div>
      <section class="ahc-filter-sheet" role="dialog" aria-modal="true" aria-label="סינון מתקדם">
        <div class="ahc-filter-sheet__handle" aria-hidden="true"></div>
        <header class="ahc-filter-sheet__header">
          <button class="ahc__button ahc__button--ghost" @click=${this._closeFilterSheet} aria-label="סגור">✕</button>
          <h3 class="ahc-filter-sheet__title">סינון מתקדם</h3>
        </header>
        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>מצבים</span><span aria-hidden="true">⌁</span></div>
          <button class="ahc__chip" aria-pressed=${this._filter.stateMode === "active_only"} @click=${this._toggleActiveOnly}>רק רכיבים פעילים</button>
          <button class="ahc__chip" aria-pressed=${this._filter.stateMode === "all"} @click=${() => this._setStateMode("all")}>כל המצבים</button>
        </div>
        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>קבוצות</span><span aria-hidden="true">▤</span></div>
          <button class="ahc__chip" aria-pressed=${this._filter.groupBy === "area"} @click=${() => this._setGroupBy("area")}>קבץ לפי אזור</button>
          <button class="ahc__chip" aria-pressed=${this._filter.groupBy === "domain"} @click=${() => this._setGroupBy("domain")}>קבץ לפי רכיב</button>
        </div>
        <footer class="ahc-filter-sheet__footer">
          <button class="ahc__button ahc__button--ghost" @click=${this._clearFilters}>נקה סינון</button>
          <button class="ahc__button ahc__button--primary" @click=${this._closeFilterSheet}>החל סינון</button>
        </footer>
      </section>
    `;
  }

  private _openFilterSheet = (): void => {
    this._filterSheetOpen = true;
    this.requestUpdate();
  };

  private _closeFilterSheet = (): void => {
    this._filterSheetOpen = false;
    this.requestUpdate();
  };

  private async _fetchAndRender(): Promise<void> {
    if (!this._config || !this._hass) return;
    const entities = resolveEntityMetas(this._config, this._hass);
    const range = resolveTimeRange(this._config);
    const key = JSON.stringify({
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      entities: entities.map((entity) => entity.entity_id),
      significant: this._config.significant_changes_only,
    });

    if (key === this._lastFetchKey && this._rows.length) {
      this._rebuildGroups();
      return;
    }

    const token = ++this._fetchToken;
    this._loading = true;
    this._error = undefined;
    this.requestUpdate();

    try {
      let history = this._historyCache.get(key);
      if (!history) {
        history = await fetchHistory(this._hass, entities, range, this._config);
        this._historyCache.set(key, history);
      }
      if (token !== this._fetchToken) return;
      this._rows = intervalizeHistory(history, entities, range, this._config);
      this._lastFetchKey = key;
      this._rebuildGroups();
    } catch (error) {
      this._error = error instanceof Error ? error.message : String(error);
    } finally {
      if (token === this._fetchToken) {
        this._loading = false;
        this.requestUpdate();
      }
    }
  }

  private _rebuildGroups(): void {
    const filtered = filterRows(this._rows, this._filter);
    this._groups = groupRows(filtered, this._filter.groupBy);
    this._summary = summarizeActivity(this._groups);
    this.requestUpdate();
  }

  private _availableDomains(): string[] {
    return [...new Set(this._rows.map((row) => row.entity.domain))].filter(Boolean).sort();
  }

  private _availableAreas(): string[] {
    return [...new Set(this._rows.map((row) => row.entity.area).filter((area): area is string => Boolean(area)))].sort();
  }

  private _onSearchInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this._filter = { ...this._filter, search: input.value };
    this._rebuildGroups();
  };

  private _toggleArea(area: string): void {
    const areas = this._filter.areas.includes(area) ? this._filter.areas.filter((item) => item !== area) : [...this._filter.areas, area];
    this._setAreas(areas);
  }

  private _setAreas(areas: string[]): void {
    this._filter = { ...this._filter, areas };
    this._rebuildGroups();
  }

  private _toggleDomain(domain: string): void {
    const domains = this._filter.domains.includes(domain) ? this._filter.domains.filter((item) => item !== domain) : [...this._filter.domains, domain];
    this._setDomains(domains);
  }

  private _setDomains(domains: string[]): void {
    this._filter = { ...this._filter, domains };
    this._rebuildGroups();
  }

  private _setGroupBy(groupBy: FilterState["groupBy"]): void {
    this._filter = { ...this._filter, groupBy };
    this._rebuildGroups();
  }

  private _setStateMode(stateMode: FilterState["stateMode"]): void {
    this._filter = { ...this._filter, stateMode };
    this._rebuildGroups();
  }

  private _toggleActiveOnly = (): void => {
    this._setStateMode(this._filter.stateMode === "active_only" ? "all" : "active_only");
  };

  private _clearFilters = (): void => {
    this._filter = { search: "", areas: [], domains: [], stateMode: "all", groupBy: this._config.group_by ?? "area" };
    this._rebuildGroups();
  };

  private _toggleFullscreen = async (): Promise<void> => {
    this._fullscreen = !this._fullscreen;
    if (this._fullscreen) {
      document.addEventListener("keydown", this._onDocumentKeyDown);
      try {
        await this.requestFullscreen?.();
      } catch {
        // CSS fallback remains active.
      }
    } else {
      document.removeEventListener("keydown", this._onDocumentKeyDown);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => undefined);
      }
    }
    this.requestUpdate();
  };

  private _onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this._fullscreen) {
      void this._toggleFullscreen();
    }
  };
}

if (!customElements.get("activity-history-card")) {
  customElements.define("activity-history-card", ActivityHistoryCard);
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "activity-history-card",
  name: "Activity History Card",
  description: "RTL/mobile-friendly Home Assistant activity history timeline",
  preview: true,
  documentationURL: "https://github.com/your-user/activity-history-card",
});

// eslint-disable-next-line no-console
console.info(`%c ACTIVITY-HISTORY-CARD %c ${CARD_VERSION} `, "color:#38bdf8;font-weight:700", "color:#94a3b8");
