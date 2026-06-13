import { LitElement, html, nothing, type TemplateResult } from "lit";
import { DEFAULT_CONFIG, DOMAIN_LABELS_HE } from "./defaults";
import { resolveEntityMetas } from "./entity-resolver";
import { filterRows, groupRows } from "./filters";
import { fetchHistory } from "./history-client";
import { formatDuration, formatTime, isRtl, resolveTimeRange } from "./format";
import { intervalizeHistory } from "./intervalize";
import { getMockEntities, getMockHistory } from "./mock-data";
import { renderCorrelationPlaceholder } from "./renderers/correlation-renderer";
import { renderDetailPlaceholder } from "./renderers/detail-renderer";
import { renderHeatmapPlaceholder } from "./renderers/heatmap-renderer";
import { renderSwimlaneTimeline } from "./renderers/swimlane-renderer";
import { activityHistoryCardStyles } from "./styles";
import { summarizeActivity } from "./summary";
import "./activity-history-card-editor";
import type {
  ActivityHistoryCardConfig,
  ActivitySummary,
  FilterState,
  HistoryStateRecord,
  HomeAssistant,
  StateMode,
  TimePreset,
  TimeRange,
  TimelineGroup,
  TimelineRow,
} from "./types";

const CARD_VERSION = "0.1.0";

export class ActivityHistoryCard extends LitElement {
  static override styles = activityHistoryCardStyles;

  static getConfigElement(): HTMLElement {
    return document.createElement("activity-history-card-editor");
  }

  static getStubConfig(): ActivityHistoryCardConfig {
    return {
      type: "custom:activity-history-card",
      title: DEFAULT_CONFIG.title,
      auto_discover: true,
      display_mode: "panel",
      hours_to_show: 24,
      group_by: "area",
    };
  }

  private _config!: ActivityHistoryCardConfig;
  private _hass?: HomeAssistant;
  private _rows: TimelineRow[] = [];
  private _groups: TimelineGroup[] = [];
  private _summary?: ActivitySummary;
  private _loading = false;
  private _error?: string;
  private _fullscreen = false;
  private _filterSheetOpen = false;
  private _usingMockData = false;
  private _fetchToken = 0;
  private _lastFetchKey = "";
  private _fetchDebounce?: number;
  private _historyCache = new Map<string, Record<string, HistoryStateRecord[]>>();
  private _unsubscribeHistory?: () => void;

  private _filter: FilterState = {
    search: "",
    areas: [],
    domains: [],
    stateMode: "all",
    groupBy: "area",
    timePreset: "24h",
  };

  setConfig(config: ActivityHistoryCardConfig): void {
    if (!config || config.type !== "custom:activity-history-card") {
      throw new Error("Invalid card type. Expected custom:activity-history-card");
    }

    const timePreset = this._initialTimePreset(config);
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
      search: "",
      areas: this._config.filters?.default_areas ?? [],
      domains: this._config.filters?.default_domains ?? [],
      stateMode: this._config.filters?.active_only ? "active_only" : "all",
      groupBy: this._config.group_by ?? "area",
      timePreset,
    };

    this._lastFetchKey = "";
    this._historyCache.clear();
    this._scheduleFetch();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._scheduleFetch();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeHistory?.();
    this._unsubscribeHistory = undefined;
    if (this._fetchDebounce) window.clearTimeout(this._fetchDebounce);
    document.removeEventListener("keydown", this._onDocumentKeyDown);
    document.removeEventListener("fullscreenchange", this._onFullscreenChange);
  }

  getCardSize(): number {
    const rowCount = this._rows.length || (this._config?.entities?.length ?? 3);
    return Math.min(18, Math.max(5, Math.ceil(rowCount * 0.7) + 4));
  }

  getGridOptions() {
    return {
      columns: this._config?.display_mode === "panel" || this._fullscreen ? "full" : 12,
      min_columns: 6,
      rows: this._config?.display_mode === "panel" || this._fullscreen ? 12 : 8,
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
      this._filterSheetOpen ? "ahc--sheet-open" : "",
      this._usingMockData ? "ahc--mock" : "",
      this._rows.length > 40 ? "ahc--dense" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <ha-card class=${classes} dir=${rtl ? "rtl" : "ltr"} tabindex=${this._fullscreen ? "0" : "-1"}>
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
    const subtitle = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "נתוני Home Assistant"}`;
    return html`
      <header class="ahc__topbar">
        <div class="ahc__toolbar">
          ${this._config.show_fullscreen_button === false
            ? nothing
            : html`
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${this._toggleFullscreen}
                  aria-pressed=${this._fullscreen ? "true" : "false"}
                >
                  <span aria-hidden="true">${this._fullscreen ? "×" : "⛶"}</span>
                  <span>${this._fullscreen ? "צא ממסך מלא" : "מסך מלא"}</span>
                </button>
              `}
          <div class="ahc__segmented" aria-label="קיבוץ לפי">
            <button class="ahc__segmented-button" type="button" aria-pressed=${this._filter.groupBy === "area"} @click=${() => this._setGroupBy("area")}>אזור</button>
            <button class="ahc__segmented-button" type="button" aria-pressed=${this._filter.groupBy === "domain"} @click=${() => this._setGroupBy("domain")}>סוג</button>
          </div>
          <div class="ahc__search">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input
              class="ahc__search-input"
              type="search"
              .value=${this._filter.search}
              placeholder="חיפוש ישות או אזור..."
              @input=${this._onSearchInput}
            />
          </div>
          <button class="ahc__button ahc__button--ghost ahc__filter-toggle" type="button" @click=${this._openFilterSheet} aria-expanded=${this._filterSheetOpen ? "true" : "false"}>
            <span aria-hidden="true">▾</span><span>סינון</span>
          </button>
        </div>
        <div class="ahc__title-block">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge" aria-hidden="true">▥</span>
            <h2 class="ahc__title">${this._config.title ?? DEFAULT_CONFIG.title}</h2>
          </div>
          <p class="ahc__subtitle">${subtitle}</p>
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
          ${this._renderChip("24 שעות", this._filter.timePreset === "24h", () => this._setTimePreset("24h"))}
          ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () => this._setTimePreset("7d"))}
          ${this._renderChip("מותאם", this._filter.timePreset === "custom", () => this._setTimePreset("custom"))}
        </div>
        ${this._config.filters?.show_area_chips === false
          ? nothing
          : html`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">אזור</span>
                ${this._renderChip("הכל", !this._filter.areas.length, () => this._setAreas([]))}
                ${areas.map((area) => this._renderChip(area, this._filter.areas.includes(area), () => this._toggleArea(area)))}
              </div>
            `}
        ${this._config.filters?.show_domain_chips === false
          ? nothing
          : html`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">סוג ישות</span>
                ${this._renderChip("הכל", !this._filter.domains.length, () => this._setDomains([]))}
                ${domains.map((domain) => this._renderChip(DOMAIN_LABELS_HE[domain] ?? domain, this._filter.domains.includes(domain), () => this._toggleDomain(domain)))}
              </div>
            `}
        ${this._config.filters?.show_state_mode === false
          ? nothing
          : html`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">מצב</span>
                ${this._renderChip("כל המצבים", this._filter.stateMode === "all", () => this._setStateMode("all"))}
                ${this._renderChip("רק פעילים", this._filter.stateMode === "active_only", () => this._setStateMode("active_only"))}
                ${this._renderChip("פעילים עכשיו", this._filter.stateMode === "currently_active", () => this._setStateMode("currently_active"))}
              </div>
            `}
      </section>
    `;
  }

  private _renderChip(label: string, pressed: boolean, onClick: () => void): TemplateResult {
    return html`<button class="ahc__chip" type="button" aria-pressed=${pressed ? "true" : "false"} @click=${onClick}>${label}</button>`;
  }

  private _renderSummary(): TemplateResult | typeof nothing {
    if (this._config.show_summary === false) return nothing;
    const summary = this._summary;
    return html`
      <section class="ahc__summary-grid" aria-label="סיכום פעילות">
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">זמן פעילות</span>
            <span class="ahc__metric-value ahc__metric-value--positive">${formatDuration(summary?.totalActiveMs ?? 0)}</span>
            <span class="ahc__metric-subtitle">בטווח הנבחר</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◷</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">מספר אירועים</span>
            <span class="ahc__metric-value">${summary?.eventCount ?? 0}</span>
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value">${summary?.activeNowCount ?? 0}</span>
            <span class="ahc__metric-subtitle">רכיבים פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירוע אחרון</span>
            <span class="ahc__metric-value">${summary?.lastEvent ? formatTime(summary.lastEvent.start) : "אין"}</span>
            <span class="ahc__metric-subtitle">${summary?.lastEvent?.entity_id ?? "לא נמצאו אירועים"}</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">♫</span>
        </article>
      </section>
    `;
  }

  private _renderMainContent(): TemplateResult {
    if (this._loading) {
      const message = !this._hass && !this._usingMockData ? "ממתין לחיבור Home Assistant." : "מושך נתוני פעילות מ-Home Assistant.";
      return html`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">טוען היסטוריה...</h3><p>${message}</p></div></div>`;
    }
    if (this._error) {
      return html`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">שגיאה בטעינת ההיסטוריה</h3><p>${this._error}</p></div></div>`;
    }
    if (!this._groups.length) {
      return html`
        <div class="ahc-state-card">
          <div>
            <h3 class="ahc-state-card__title">אין נתונים להצגה</h3>
            <p>לא נמצאו ישויות פעילות באזורים שנבחרו. בדוק שהרכיבים משויכים לאזורים, או שנה דומיינים/לייבלים בעורך הכרטיס.</p>
          </div>
        </div>
      `;
    }

    const range = this._resolveRange();
    switch (this._config.view_mode ?? this._config.default_view ?? "swimlane") {
      case "heatmap":
        return renderHeatmapPlaceholder();
      case "detail":
        return renderDetailPlaceholder();
      case "correlation":
        return renderCorrelationPlaceholder();
      case "swimlane":
      default:
        return renderSwimlaneTimeline({
          groups: this._groups,
          range,
          config: this._config,
          summary: this._summary ?? summarizeActivity(this._groups),
        });
    }
  }

  private _renderInsights(): TemplateResult {
    const summary = this._summary;
    return html`
      <aside class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title"><span>תובנות חכמות</span><span aria-hidden="true">✦</span></h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value">${summary?.mostActiveEntity?.entity.name ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">${formatDuration(summary?.mostActiveEntity?.totalActiveMs ?? 0)}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value">${summary?.mostActiveArea?.title ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">${formatDuration(summary?.mostActiveArea?.totalActiveMs ?? 0)}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value">${summary?.peakBucketLabel ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">לפי משך פעילות</span>
        </article>
      </aside>
    `;
  }

  private _renderFilterSheet(): TemplateResult {
    const areas = this._availableAreas();
    const domains = this._availableDomains();

    return html`
      <div class="ahc-filter-sheet-backdrop" @click=${this._closeFilterSheet}></div>
      <section class="ahc-filter-sheet" role="dialog" aria-modal="true" aria-label="סינון מתקדם">
        <div class="ahc-filter-sheet__handle" aria-hidden="true"></div>
        <header class="ahc-filter-sheet__header">
          <button class="ahc__button ahc__button--ghost" type="button" @click=${this._closeFilterSheet} aria-label="סגור">×</button>
          <h3 class="ahc-filter-sheet__title">סינון מתקדם</h3>
        </header>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>טווח זמן</span><span aria-hidden="true">◷</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("24 שעות", this._filter.timePreset === "24h", () => this._setTimePreset("24h"))}
            ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () => this._setTimePreset("7d"))}
            ${this._renderChip("טווח מותאם", this._filter.timePreset === "custom", () => this._setTimePreset("custom"))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>אזורים</span><span aria-hidden="true">▦</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל האזורים", !this._filter.areas.length, () => this._setAreas([]))}
            ${areas.map((area) => this._renderChip(area, this._filter.areas.includes(area), () => this._toggleArea(area)))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>סוגי רכיבים</span><span aria-hidden="true">▦</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל הסוגים", !this._filter.domains.length, () => this._setDomains([]))}
            ${domains.map((domain) => this._renderChip(DOMAIN_LABELS_HE[domain] ?? domain, this._filter.domains.includes(domain), () => this._toggleDomain(domain)))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>מצבים</span><span aria-hidden="true">⌁</span></div>
          <button class="ahc-filter-option" type="button" aria-pressed=${this._filter.stateMode === "active_only"} @click=${() => this._setStateMode("active_only")}>
            <span>רק פעילים</span><small>הצג רכיבים שהיו פעילים בטווח</small>
          </button>
          <button class="ahc-filter-option" type="button" aria-pressed=${this._filter.stateMode === "all"} @click=${() => this._setStateMode("all")}>
            <span>כל המצבים</span><small>הצג גם זמני כבוי ולא זמין</small>
          </button>
          <button class="ahc-filter-option" type="button" aria-pressed=${this._filter.stateMode === "currently_active"} @click=${() => this._setStateMode("currently_active")}>
            <span>פעילים עכשיו</span><small>התמקד ברכיבים שפועלים כעת</small>
          </button>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>קבוצות וחיפוש</span><span aria-hidden="true">▤</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("קבץ לפי אזור", this._filter.groupBy === "area", () => this._setGroupBy("area"))}
            ${this._renderChip("קבץ לפי סוג", this._filter.groupBy === "domain", () => this._setGroupBy("domain"))}
            ${this._renderChip("ללא קיבוץ", this._filter.groupBy === "none", () => this._setGroupBy("none"))}
          </div>
          <div class="ahc__search ahc__search--sheet">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input class="ahc__search-input" type="search" .value=${this._filter.search} placeholder="חיפוש רכיב או אזור" @input=${this._onSearchInput} />
          </div>
        </div>

        <footer class="ahc-filter-sheet__footer">
          <button class="ahc__button ahc__button--ghost" type="button" @click=${this._clearFilters}>נקה סינון</button>
          <button class="ahc__button ahc__button--primary" type="button" @click=${this._closeFilterSheet}>החל סינון</button>
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

  private _scheduleFetch(): void {
    if (this._fetchDebounce) window.clearTimeout(this._fetchDebounce);
    this._fetchDebounce = window.setTimeout(() => {
      this._fetchDebounce = undefined;
      void this._fetchAndRender();
    }, 120);
  }

  private async _fetchAndRender(): Promise<void> {
    if (!this._config) return;

    const useMockData = this._config.mock_data === true;
    if (!this._hass && !useMockData) {
      this._usingMockData = false;
      this._loading = true;
      this._error = undefined;
      this.requestUpdate();
      return;
    }

    const entities = useMockData ? getMockEntities() : await resolveEntityMetas(this._config, this._hass);
    const range = this._resolveRange();
    const key = JSON.stringify({
      mock: useMockData,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      entities: entities.map((entity) => entity.entity_id),
      includeLabels: this._config.include_labels ?? [],
      excludeLabels: this._config.exclude_labels ?? [],
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response,
    });

    if (!entities.length) {
      this._usingMockData = false;
      this._rows = [];
      this._groups = [];
      this._summary = summarizeActivity([]);
      this._loading = false;
      this._error = undefined;
      this.requestUpdate();
      return;
    }

    if (key === this._lastFetchKey) {
      const cached = this._historyCache.get(key);
      if (cached) {
        this._rows = intervalizeHistory(cached, entities, range, this._config, this._hass?.states ?? {});
        this._rebuildGroups();
        return;
      }
    }

    const token = ++this._fetchToken;
    this._loading = !useMockData;
    this._error = undefined;
    this._usingMockData = useMockData;
    this.requestUpdate();

    try {
      let history = this._historyCache.get(key);
      if (!history) {
        history = useMockData ? getMockHistory(range) : await fetchHistory(this._hass as HomeAssistant, entities, range, this._config);
        this._historyCache.set(key, history);
      }
      if (token !== this._fetchToken) return;
      this._rows = intervalizeHistory(history, entities, range, this._config, this._hass?.states ?? {});
      this._lastFetchKey = key;
      this._rebuildGroups();
    } catch (error) {
      this._error = error instanceof Error ? error.message : String(error);
      this._rows = [];
      this._groups = [];
      this._summary = summarizeActivity([]);
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

  private _resolveRange(): TimeRange {
    const end = this._roundedNow();
    if (this._filter.timePreset === "24h") {
      return resolveTimeRange({ ...this._config, start_time: undefined, end_time: end.toISOString(), hours_to_show: 24 }, end);
    }
    if (this._filter.timePreset === "7d") {
      return resolveTimeRange({ ...this._config, start_time: undefined, end_time: end.toISOString(), hours_to_show: 24 * 7 }, end);
    }
    return resolveTimeRange(this._config, end);
  }

  private _roundedNow(): Date {
    const now = Date.now();
    return new Date(Math.floor(now / 60000) * 60000);
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

  private _setStateMode(stateMode: StateMode): void {
    this._filter = { ...this._filter, stateMode };
    this._rebuildGroups();
  }

  private _setTimePreset(timePreset: TimePreset): void {
    if (this._filter.timePreset === timePreset) return;
    this._filter = { ...this._filter, timePreset };
    this._lastFetchKey = "";
    this._scheduleFetch();
  }

  private _clearFilters = (): void => {
    this._filter = {
      search: "",
      areas: [],
      domains: [],
      stateMode: "all",
      groupBy: this._config.group_by ?? "area",
      timePreset: this._initialTimePreset(this._config),
    };
    this._lastFetchKey = "";
    this._scheduleFetch();
  };

  private _toggleFullscreen = async (): Promise<void> => {
    const next = !this._fullscreen;
    this._fullscreen = next;
    if (next) {
      document.addEventListener("keydown", this._onDocumentKeyDown);
      document.addEventListener("fullscreenchange", this._onFullscreenChange);
      try {
        await this.requestFullscreen();
      } catch {
        // Native Fullscreen may be blocked in HA iframes; the CSS overlay class remains active.
      }
      await this.updateComplete;
      (this.renderRoot.querySelector(".ahc") as HTMLElement | null)?.focus();
    } else {
      document.removeEventListener("keydown", this._onDocumentKeyDown);
      document.removeEventListener("fullscreenchange", this._onFullscreenChange);
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

  private _onFullscreenChange = (): void => {
    if (!document.fullscreenElement && this._fullscreen) {
      this._fullscreen = false;
      document.removeEventListener("keydown", this._onDocumentKeyDown);
      document.removeEventListener("fullscreenchange", this._onFullscreenChange);
      this.requestUpdate();
    }
  };

  private _initialTimePreset(config: ActivityHistoryCardConfig): TimePreset {
    if (config.start_time || config.end_time) return "custom";
    return (config.hours_to_show ?? 24) >= 168 ? "7d" : "24h";
  }

  private _timePresetLabel(preset: TimePreset): string {
    if (preset === "7d") return "7 ימים";
    if (preset === "custom") return "טווח מותאם";
    return "24 שעות אחרונות";
  }
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
if (!window.customCards.some((card) => card.type === "activity-history-card")) {
  window.customCards.push({
    type: "activity-history-card",
    name: "Activity History Card",
    description: "RTL/mobile-friendly Home Assistant activity history timeline",
    preview: true,
    documentationURL: "https://github.com/jonioliel/activity-history-card",
  });
}

// eslint-disable-next-line no-console
console.info(`%c ACTIVITY-HISTORY-CARD %c ${CARD_VERSION} `, "color:#38bdf8;font-weight:700", "color:#94a3b8");
