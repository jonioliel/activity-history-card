import { LitElement, html, nothing, type TemplateResult } from "lit";
import {
  CATEGORY_LABELS_HE,
  DEFAULT_CONFIG,
  DOMAIN_LABELS_HE,
} from "./defaults";
import {
  buildActivityDashboardModel,
  summarizeDashboardModel,
  type ActivityDashboardModel,
} from "./activity-dashboard-model";
import { formatEntityLine, formatSegmentSummary } from "./display-text";
import { resolveEntityMetasWithDiagnostics } from "./entity-resolver";
import { filterRows, groupRows } from "./filters";
import { createHassMoreInfoEvent } from "./hass-events";
import { buildHistoryCacheKey } from "./history-key";
import { fetchHistory, getHistoryRequestPlan } from "./history-client";
import { formatDuration, formatTime, isRtl, resolveTimeRange } from "./format";
import { intervalizeHistory } from "./intervalize";
import { getMockEntities, getMockHistory } from "./mock-data";
import { positionPopover } from "./popover-position";
import {
  normalizeRefreshIntervalSeconds,
  shouldRefreshFromHassSetter,
  type HistoryRefreshReason,
} from "./refresh-policy";
import { renderCorrelationPlaceholder } from "./renderers/correlation-renderer";
import { renderDetailPlaceholder } from "./renderers/detail-renderer";
import { renderHeatmapPlaceholder } from "./renderers/heatmap-renderer";
import {
  activityDashboardToMockup05Model,
  renderActivityDashboard,
} from "./renderers/activity-dashboard-renderer";
import { renderActivityTimeline } from "./renderers/activity-timeline-renderer";
import {
  renderMockup05Dashboard,
  renderMockup05Hero,
  renderMockup05Insights,
  renderMockup05Summary,
  renderMockup05Toolbar,
} from "./renderers/mockup05-layout";
import { renderSwimlaneTimeline } from "./renderers/swimlane-renderer";
import { curateRows, formatCurationSummary } from "./activity-curation";
import { activityHistoryCardStyles } from "./styles";
import { summarizeActivity } from "./summary";
import { resolveRendererMode, type RendererMode } from "./view-mode";
import { mockup05VisualModel } from "./mockup05/mockup05-model";
import "./activity-history-card-editor";
import type {
  ActivityHistoryCardConfig,
  ActivityDiagnostics,
  DesktopDensity,
  ActivitySummary,
  FilterState,
  HistoryStateRecord,
  HomeAssistant,
  RowCurationDiagnostics,
  StateMode,
  TimePreset,
  TimeRange,
  TimelineGroup,
  TimelineRow,
  TimelineSegment,
} from "./types";

const CARD_VERSION = "0.1.0";
type EmptyStateReason =
  | "no_entities_selected"
  | "no_resolved_entities"
  | "no_history_returned"
  | "history_unusable"
  | "all_entities_filtered"
  | "no_meaningful_activity";

interface SegmentPopoverState {
  row: TimelineRow;
  segment: TimelineSegment;
  x: number;
  y: number;
  placement: "floating" | "bottom";
}

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
      view_mode: "activity",
      hours_to_show: 24,
      group_by: "area",
    };
  }

  private _config!: ActivityHistoryCardConfig;
  private _hass?: HomeAssistant;
  private _rows: TimelineRow[] = [];
  private _visibleRows: TimelineRow[] = [];
  private _groups: TimelineGroup[] = [];
  private _dashboardModel?: ActivityDashboardModel;
  private _summary?: ActivitySummary;
  private _loading = false;
  private _error?: string;
  private _emptyReason?: EmptyStateReason;
  private _diagnostics?: ActivityDiagnostics;
  private _segmentPopover?: SegmentPopoverState;
  private _fullscreen = false;
  private _filterSheetOpen = false;
  private _usingMockData = false;
  private _showAllRows = false;
  private _debugLegacyView = false;
  private _expandedInventoryGroups = new Set<string>();
  private _collapsedInventoryGroups = new Set<string>();
  private _openInventoryAreaId?: string;
  private _curation?: RowCurationDiagnostics;
  private _fetchToken = 0;
  private _lastFetchKey = "";
  private _hasFetchedOnce = false;
  private _initialLoad = false;
  private _backgroundLoading = false;
  private _lastResolvedEntityKey = "";
  private _lastHistoryFetchAt = 0;
  private _loadedRange?: TimeRange;
  private _refreshTimer?: number;
  private _inFlightHistoryRequest?: Promise<void>;
  private _historyCache = new Map<
    string,
    Record<string, HistoryStateRecord[]>
  >();
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
      throw new Error(
        "Invalid card type. Expected custom:activity-history-card",
      );
    }

    const timePreset = this._initialTimePreset(config);
    const viewMode =
      config.view_mode ?? config.default_view ?? DEFAULT_CONFIG.view_mode;
    const displayMode = config.display_mode ?? DEFAULT_CONFIG.display_mode;
    const desktopDensity =
      config.desktop_density ??
      (displayMode === "panel" || viewMode === "activity"
        ? "compact"
        : DEFAULT_CONFIG.desktop_density);
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      display_mode: displayMode,
      desktop_density: desktopDensity,
      fullscreen_behavior:
        config.fullscreen_behavior ?? DEFAULT_CONFIG.fullscreen_behavior,
      view_mode: viewMode,
      group_by: config.group_by ?? DEFAULT_CONFIG.group_by,
      filters: {
        show: true,
        show_search: true,
        show_area_chips: false,
        show_domain_chips: false,
        show_state_mode: false,
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
    this._lastResolvedEntityKey = "";
    this._loadedRange = undefined;
    this._showAllRows = false;
    this._debugLegacyView = false;
    this._expandedInventoryGroups.clear();
    this._collapsedInventoryGroups.clear();
    this._openInventoryAreaId = undefined;
    this._historyCache.clear();
    this._syncRefreshTimer();
    this._requestHistoryRefresh(this._hasFetchedOnce ? "config" : "initial", {
      force: true,
    });
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    const shouldRefresh = shouldRefreshFromHassSetter({
      hasFetchedOnce: this._hasFetchedOnce,
      live: this._config?.live !== false,
      lastHistoryFetchAt: this._lastHistoryFetchAt,
      now: Date.now(),
      refreshIntervalSeconds: this._refreshIntervalSeconds(),
    });
    if (shouldRefresh) {
      this._requestHistoryRefresh(
        this._hasFetchedOnce ? "interval" : "initial",
      );
    } else {
      this.requestUpdate();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeHistory?.();
    this._unsubscribeHistory = undefined;
    this._fetchToken += 1;
    if (this._refreshTimer) window.clearTimeout(this._refreshTimer);
    this._refreshTimer = undefined;
    this._inFlightHistoryRequest = undefined;
    document.removeEventListener("keydown", this._onDocumentKeyDown);
    document.removeEventListener("fullscreenchange", this._onFullscreenChange);
    document.removeEventListener("pointerdown", this._onDocumentPointerDown);
  }

  getCardSize(): number {
    const rowCount =
      this._visibleRows.length ||
      this._rows.length ||
      (this._config?.entities?.length ?? 3);
    return Math.min(18, Math.max(5, Math.ceil(rowCount * 0.7) + 4));
  }

  getGridOptions() {
    return {
      columns:
        this._config?.display_mode === "panel" || this._fullscreen
          ? "full"
          : 12,
      min_columns: 6,
      rows: this._config?.display_mode === "panel" || this._fullscreen ? 12 : 8,
      min_rows: 5,
    };
  }

  protected override render(): TemplateResult {
    if (!this._config) return html``;

    const lang = this._hass?.locale?.language ?? this._hass?.language;
    const rtl = isRtl(
      this._config.direction ?? this._config.rtl ?? "auto",
      lang,
    );
    const classes = [
      "ahc",
      this._currentRendererMode() === "activity" ? "ahc--mockup05-shell" : "",
      this._isMockup05VisualPreview() ? "ahc--mockup05-preview" : "",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      `ahc--density-${this._desktopDensityClass()}`,
      this._usesFullscreenShell() ? "ahc--fullscreen" : "",
      this._fullscreen && this._config.fullscreen_behavior === "fixed_overlay"
        ? "ahc--fixed-overlay"
        : "",
      this._filterSheetOpen ? "ahc--sheet-open" : "",
      this._usingMockData ? "ahc--mock" : "",
      this._backgroundLoading ? "ahc--background-loading" : "",
      this._visibleRows.length > 70
        ? "ahc--ultra-dense"
        : this._visibleRows.length > 30
          ? "ahc--dense"
          : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <ha-card
        class=${classes}
        dir=${rtl ? "rtl" : "ltr"}
        tabindex=${this._fullscreen ? "0" : "-1"}
        aria-busy=${this._initialLoad ? "true" : "false"}
      >
        ${this._renderHeader()} ${this._renderFilters()}
        ${this._renderSummary()}
        ${this._config.debug ? this._renderDiagnostics() : nothing}
        ${this._renderBody()}
        ${this._segmentPopover ? this._renderSegmentPopover() : nothing}
        ${this._filterSheetOpen ? this._renderFilterSheet() : nothing}
      </ha-card>
    `;
  }

  private _isMockup05VisualPreview(): boolean {
    return (
      this._config?.mock_data === true &&
      this._config.mock_profile === "mockup05_visual" &&
      this._currentRendererMode() === "activity"
    );
  }

  private _desktopDensity(): DesktopDensity {
    return this._config.desktop_density ?? DEFAULT_CONFIG.desktop_density;
  }

  private _desktopDensityClass(): string {
    return this._desktopDensity().replace("_", "-");
  }

  private _usesFullscreenShell(): boolean {
    return (
      this._config.display_mode === "fullscreen" ||
      (this._fullscreen && this._config.fullscreen_behavior !== "card")
    );
  }

  private _renderBody(): TemplateResult {
    const showInsights = this._config.show_insights !== false;
    return html`
      <section
        class=${showInsights ? "ahc__body" : "ahc__body ahc__body--no-insights"}
      >
        <main class="ahc__main">${this._renderMainContent()}</main>
        ${showInsights
          ? html`<aside class="ahc__insights-panel" aria-label="תובנות חכמות">
              ${this._renderInsights()}
            </aside>`
          : nothing}
      </section>
    `;
  }

  private _renderHeader(): TemplateResult {
    if (this._isMockup05VisualPreview()) {
      return renderMockup05Hero(
        {
          ...mockup05VisualModel.hero,
          title: this._config.title ?? mockup05VisualModel.hero.title,
        },
        {
          onRefresh: this._manualRefresh,
          onFullscreen:
            this._config.show_fullscreen_button === false
              ? undefined
              : this._toggleFullscreen,
        },
      );
    }

    const subtitle = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "נתוני Home Assistant"}`;
    return html`
      <section class="ahc__hero ahc__topbar">
        <div class="ahc__title-block ahc__hero-main">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge ahc__hero-icon" aria-hidden="true"
              ><ha-icon icon="mdi:chart-timeline-variant"></ha-icon
            ></span>
            <h2 class="ahc__title ahc__hero-title">
              ${this._config.title ?? DEFAULT_CONFIG.title}
            </h2>
          </div>
          <p class="ahc__subtitle ahc__hero-subtitle">${subtitle}</p>
          ${this._renderLastEventPill()}
        </div>
        <div class="ahc__hero-actions">
          ${this._config.show_fullscreen_button === false
            ? nothing
            : html`
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${this._toggleFullscreen}
                  aria-pressed=${this._fullscreen ? "true" : "false"}
                >
                  <span aria-hidden="true"
                    >${this._fullscreen ? "×" : "⛶"}</span
                  >
                  <span>${this._fullscreen ? "צא ממסך מלא" : "מסך מלא"}</span>
                </button>
              `}
          <button
            class="ahc__button ahc__button--ghost"
            type="button"
            @click=${this._manualRefresh}
            ?disabled=${this._initialLoad || this._backgroundLoading}
          >
            <span aria-hidden="true">↻</span><span>רענן</span>
          </button>
          ${this._backgroundLoading
            ? html`<span class="ahc__refresh-indicator" role="status"
                >מעדכן...</span
              >`
            : nothing}
        </div>
      </section>
    `;
  }

  private _renderLastEventPill(): TemplateResult | typeof nothing {
    const summary = this._summary;
    const row = summary?.lastEventRow;
    const event = summary?.lastEvent;
    if (!row || !event) return nothing;
    return html`
      <div class="ahc-last-event">
        <span class="ahc-last-event__label">אירוע אחרון</span>
        <strong>${row.entity.name}</strong>
        <span
          >${formatTime(event.start)} · ${CATEGORY_LABELS_HE[event.category]} ·
          ${formatEntityLine(row, this._config.debug === true)}</span
        >
      </div>
    `;
  }

  private _renderFilters(): TemplateResult | typeof nothing {
    if (this._config.filters?.show === false) return nothing;
    if (this._isMockup05VisualPreview()) {
      return renderMockup05Toolbar(mockup05VisualModel.toolbar);
    }

    const curationSummary = formatCurationSummary(this._curation);
    const rendererMode = this._currentRendererMode();
    const activityDashboard = rendererMode === "activity";
    const canToggleSmartFilter = Boolean(
      activityDashboard
        ? this._canToggleAreaInventory()
        : this._curation?.hiddenRows || this._showAllRows,
    );
    const showAllLabel = activityDashboard
      ? this._showAllRows
        ? "פעילות בלבד"
        : "כל האביזרים"
      : this._showAllRows
        ? "הצג רק פעילות"
        : "הצג הכל";

    return html`
      <section class="ahc__toolbar ahc__filters" aria-label="מסננים">
        <div
          class="ahc__filter-row ahc__filter-row--primary ahc__toolbar-group"
        >
          <span class="ahc__filter-label">טווח זמן</span>
          ${this._renderChip("24 שעות", this._filter.timePreset === "24h", () =>
            this._setTimePreset("24h"),
          )}
          ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () =>
            this._setTimePreset("7d"),
          )}
          ${this._renderChip(
            "מותאם",
            this._filter.timePreset === "custom",
            () => this._setTimePreset("custom"),
          )}
          <span class="ahc__filter-label">קבץ לפי</span>
          <div class="ahc__segmented" aria-label="קיבוץ לפי">
            <button
              class="ahc__segmented-button"
              type="button"
              aria-pressed=${this._filter.groupBy === "area"}
              @click=${() => this._setGroupBy("area")}
            >
              אזור
            </button>
            <button
              class="ahc__segmented-button"
              type="button"
              aria-pressed=${this._filter.groupBy === "domain"}
              @click=${() => this._setGroupBy("domain")}
            >
              סוג
            </button>
            <button
              class="ahc__segmented-button"
              type="button"
              aria-pressed=${this._filter.groupBy === "none"}
              @click=${() => this._setGroupBy("none")}
            >
              ללא
            </button>
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
          <button
            class="ahc__button ahc__button--primary"
            type="button"
            @click=${this._openFilterSheet}
            aria-expanded=${this._filterSheetOpen ? "true" : "false"}
          >
            <span aria-hidden="true">▾</span><span>סינון</span>
          </button>
          ${canToggleSmartFilter
            ? html`<button
                class="ahc__button ahc__button--ghost"
                type="button"
                aria-pressed=${this._showAllRows ? "true" : "false"}
                @click=${this._toggleShowAllRows}
              >
                ${showAllLabel}
              </button>`
            : nothing}
          ${this._config.debug
            ? html`<button
                class="ahc__button ahc__button--ghost ahc__button--debug"
                type="button"
                aria-pressed=${this._debugLegacyView ? "true" : "false"}
                @click=${this._toggleDebugLegacyView}
              >
                תצוגת legacy
              </button>`
            : nothing}
          ${curationSummary
            ? html`<span class="ahc-curation-note">${curationSummary}</span>`
            : nothing}
        </div>
      </section>
    `;
  }

  private _renderChip(
    label: string,
    pressed: boolean,
    onClick: () => void,
  ): TemplateResult {
    const classes = [
      "ahc__chip",
      "ahc__filter-chip",
      pressed ? "ahc__filter-chip--active" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`<button
      class=${classes}
      type="button"
      aria-pressed=${pressed ? "true" : "false"}
      @click=${onClick}
    >
      ${label}
    </button>`;
  }

  private _renderSummary(): TemplateResult | typeof nothing {
    if (this._config.show_summary === false) return nothing;
    if (this._isMockup05VisualPreview()) {
      return renderMockup05Summary(mockup05VisualModel.summary);
    }
    if (this._dashboardModel && this._config.summary_scope !== "all") {
      return renderMockup05Summary(
        activityDashboardToMockup05Model(this._dashboardModel, this._config, {
          expandedInventoryGroups: this._expandedInventoryGroups,
          collapsedInventoryGroups: this._collapsedInventoryGroups,
          showAllInventory: this._showAllRows,
        }).summary,
      );
    }
    const summary = this._summary;
    const dashboard = this._dashboardModel;
    const visibleCount =
      dashboard?.visibleRowsCount ||
      this._visibleRows.length ||
      this._rows.length;
    const summaryScopeLabel =
      this._config.summary_scope === "all"
        ? "לפי כל הרכיבים שנמצאו"
        : "לפי הרכיבים שמוצגים";
    return html`
      <section
        class="ahc__summary-strip ahc__summary-grid"
        aria-label="סיכום פעילות"
      >
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value"
              >${summary?.activeNowCount ?? 0}</span
            >
            <span class="ahc__metric-subtitle">רכיבים שפועלים כרגע</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">רכיבים שפעלו</span>
            <span class="ahc__metric-value"
              >${summary?.activeEntityCount ?? 0}</span
            >
            <span class="ahc__metric-subtitle"
              >מתוך ${visibleCount} רכיבים מוצגים</span
            >
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">▣</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירועים</span>
            <span class="ahc__metric-value">${summary?.eventCount ?? 0}</span>
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive"
              >${formatDuration(summary?.totalActiveMs ?? 0)}</span
            >
            <span class="ahc__metric-subtitle">${summaryScopeLabel}</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◴</span>
        </article>
      </section>
    `;
  }

  private _renderDashboardSummary(
    dashboard: ActivityDashboardModel,
  ): TemplateResult {
    return html`
      <section
        class="ahc__summary-strip ahc__summary-grid"
        aria-label="סיכום פעילות"
      >
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive">
              ${formatDuration(dashboard.totalVisibleActiveMs)}
            </span>
            <span class="ahc__metric-subtitle">לפי התצוגה הנוכחית</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◴</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">רכיבים שפעלו</span>
            <span class="ahc__metric-value">${dashboard.visibleRowsCount}</span>
            <span class="ahc__metric-subtitle">
              מתוך
              ${dashboard.totalInventoryItemCount ||
              dashboard.totalRowsBeforeCuration}
              אביזרים
            </span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">▣</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירועים</span>
            <span class="ahc__metric-value"
              >${dashboard.visibleEventCount}</span
            >
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value">${dashboard.activeNowCount}</span>
            <span class="ahc__metric-subtitle">רכיבים שפועלים כרגע</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
      </section>
    `;
  }

  private _renderSummaryLegacy(): TemplateResult | typeof nothing {
    if (this._config.show_summary === false) return nothing;
    const summary = this._summary;
    const lastEventRow = summary?.lastEventRow;
    const lastEvent = summary?.lastEvent;
    return html`
      <section
        class="ahc__summary-strip ahc__summary-grid"
        aria-label="סיכום פעילות"
      >
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירוע אחרון</span>
            <span class="ahc__metric-value ahc__metric-value--compact"
              >${lastEventRow?.entity.name ?? "אין"}</span
            >
            <span class="ahc__metric-subtitle">
              ${lastEvent && lastEventRow
                ? `${formatTime(lastEvent.start)} · ${CATEGORY_LABELS_HE[lastEvent.category]} · ${formatEntityLine(lastEventRow, this._config.debug === true)}`
                : "לא נמצאו אירועים בטווח"}
            </span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">♪</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive"
              >${formatDuration(summary?.totalActiveMs ?? 0)}</span
            >
            <span class="ahc__metric-subtitle"
              >סכום פעילות על פני כל הרכיבים</span
            >
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◷</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירועים</span>
            <span class="ahc__metric-value">${summary?.eventCount ?? 0}</span>
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value"
              >${summary?.activeNowCount ?? 0}</span
            >
            <span class="ahc__metric-subtitle"
              >${summary?.activeEntityCount ?? 0} רכיבים פעלו בטווח</span
            >
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
      </section>
    `;
  }

  private _renderMainContent(): TemplateResult {
    if (this._isMockup05VisualPreview()) {
      return renderMockup05Dashboard(mockup05VisualModel, {
        config: this._config,
        onInventoryToggle: this._toggleInventoryGroup,
        onInventoryClose: this._closeInventoryDrawer,
        onInventoryItemClick: this._openInventoryMoreInfo,
        openInventoryGroupId: this._openInventoryAreaId,
      });
    }

    if (this._initialLoad && !this._rows.length) {
      return this._renderInitialLoading();
    }
    if (this._error && !this._rows.length) {
      return html`<div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">שגיאה בטעינת ההיסטוריה</h3>
          <p>${this._error}</p>
        </div>
      </div>`;
    }
    const hasDashboardContent = Boolean(
      this._dashboardModel &&
      (this._dashboardModel.visibleRowsCount ||
        this._dashboardModel.totalInventoryItemCount),
    );
    if (
      (this._emptyReason && !hasDashboardContent) ||
      (!this._groups.length && !hasDashboardContent)
    ) {
      return this._renderEmptyState(
        this._emptyReason ?? "no_resolved_entities",
      );
    }

    const range = this._displayRange();
    switch (this._currentRendererMode()) {
      case "heatmap":
        return renderHeatmapPlaceholder();
      case "detail":
        return renderDetailPlaceholder();
      case "correlation":
        return renderCorrelationPlaceholder();
      case "legacy_swimlane":
        return html`
          ${this._showAllRows && this._config.view_mode === "activity"
            ? html`<div class="ahc-legacy-warning">
                מצב הצגת הכל מיועד לבדיקה. התצוגה מציגה שורות גולמיות יותר
                ועלולה לכלול רכיבים רועשים.
              </div>`
            : nothing}
          ${renderSwimlaneTimeline({
            groups: this._groups,
            range,
            config:
              this._showAllRows && this._config.view_mode === "activity"
                ? {
                    ...this._config,
                    show_inactive_baselines: true,
                    max_visible_rows: Math.max(
                      this._config.max_visible_rows ?? 0,
                      80,
                    ),
                  }
                : this._config,
            summary: this._summary ?? summarizeActivity(this._groups),
            curation: this._curation,
            onSegmentClick: this._openSegmentPopover,
          })}
        `;
      case "activity_legacy":
        return renderActivityTimeline({
          groups: this._groups,
          range,
          config: this._config,
          summary: this._summary ?? summarizeActivity(this._groups),
          curation: this._curation,
          onSegmentClick: this._openSegmentPopover,
        });
      case "activity":
      default:
        return renderActivityDashboard({
          model:
            this._dashboardModel ??
            buildActivityDashboardModel(
              this._groups,
              range,
              this._config,
              this._curation,
              {
                inventoryRows: filterRows(this._rows, this._filter),
                selectedAreas: this._filter.areas,
                groupBy: this._filter.groupBy,
              },
            ),
          config: this._config,
          expandedInventoryGroups: this._expandedInventoryGroups,
          collapsedInventoryGroups: this._collapsedInventoryGroups,
          showAllInventory: this._showAllRows,
          onSegmentClick: this._openSegmentPopover,
          onInventoryToggle: this._toggleInventoryGroup,
          onInventoryClose: this._closeInventoryDrawer,
          onInventoryItemClick: this._openInventoryMoreInfo,
          openInventoryGroupId: this._openInventoryAreaId,
        });
    }
  }

  private _renderInitialLoading(): TemplateResult {
    const message =
      !this._hass && !this._usingMockData
        ? "ממתין לחיבור Home Assistant."
        : "מושך היסטוריה מה-Recorder.";
    return html`
      <section class="ahc-loading" aria-label="טעינת היסטוריה" aria-busy="true">
        <div class="ahc-loading__copy">
          <h3>טוען ציר זמן...</h3>
          <p>${message}</p>
        </div>
        <div class="ahc-loading__timeline" aria-hidden="true">
          ${Array.from({ length: 4 }).map(
            (_, groupIndex) => html`
              <div class="ahc-loading__group">
                <span></span>
                ${Array.from({ length: 5 }).map(
                  (__, rowIndex) =>
                    html`<i
                      style="--delay:${groupIndex + rowIndex}; --width:${42 +
                      ((groupIndex + rowIndex) % 4) * 12}%"
                    ></i>`,
                )}
              </div>
            `,
          )}
        </div>
      </section>
    `;
  }

  private _renderSegmentPopover(): TemplateResult {
    const popover = this._segmentPopover;
    if (!popover) return html``;
    const details = formatSegmentSummary(
      popover.row,
      popover.segment,
      this._config.debug === true,
    );
    return html`
      <aside
        class="ahc-popover"
        data-placement=${popover.placement}
        role="dialog"
        aria-label="פרטי מקטע פעילות"
        style=${`--ahc-popover-x:${popover.x}px; --ahc-popover-y:${popover.y}px`}
      >
        <button
          class="ahc-popover__close"
          type="button"
          aria-label="סגור"
          @click=${this._closeSegmentPopover}
        >
          ×
        </button>
        <h3 class="ahc-popover__title">${popover.row.entity.name}</h3>
        <dl class="ahc-popover__dl">
          ${details.map(
            ([label, value]) =>
              html`<dt class="ahc-popover__dt">${label}</dt>
                <dd class="ahc-popover__dd">${value}</dd>`,
          )}
        </dl>
      </aside>
    `;
  }

  private _openSegmentPopover = (
    event: Event,
    entityId: string,
    segmentIndex: number,
  ): void => {
    event.preventDefault();
    event.stopPropagation();
    const row =
      this._visibleRows.find((item) => item.entity.entity_id === entityId) ??
      this._rows.find((item) => item.entity.entity_id === entityId);
    const segment = row?.segments[segmentIndex];
    const target =
      event.currentTarget instanceof Element ? event.currentTarget : undefined;
    if (!row || !segment || !target) return;

    const rect = target.getBoundingClientRect();
    const point = positionPopover(rect, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this._segmentPopover = {
      row,
      segment,
      x: point.x,
      y: point.y,
      placement: point.placement,
    };
    document.addEventListener("pointerdown", this._onDocumentPointerDown);
    document.addEventListener("keydown", this._onDocumentKeyDown);
    this.requestUpdate();
  };

  private _closeSegmentPopover = (): void => {
    this._segmentPopover = undefined;
    document.removeEventListener("pointerdown", this._onDocumentPointerDown);
    if (!this._fullscreen && !this._filterSheetOpen) {
      document.removeEventListener("keydown", this._onDocumentKeyDown);
    }
    this.requestUpdate();
  };

  private _renderEmptyState(reason: EmptyStateReason): TemplateResult {
    const states: Record<
      EmptyStateReason,
      { title: string; body: string; yaml: string }
    > = {
      no_entities_selected: {
        title: "לא נבחרו רכיבים",
        body: "הפעל גילוי אוטומטי או הוסף רשימת entities ידנית. בלי אחד מהם הכרטיס לא יודע אילו רכיבים לטעון.",
        yaml: "type: custom:activity-history-card\nauto_discover: true\nmock_data: false",
      },
      no_resolved_entities: {
        title: "לא נמצאו רכיבים באזורים",
        body: "בדוק שהרכיבים משויכים לאזורים ב-Home Assistant, שהדומיינים שבחרת מתאימים, ושלא סיננת אותם באמצעות labels.",
        yaml: "type: custom:activity-history-card\nauto_discover: true\nmock_data: false\nexclude_labels:\n  - לא להצגה",
      },
      no_history_returned: {
        title: "Recorder לא החזיר היסטוריה",
        body: "נמצאו רכיבים, אבל Home Assistant לא החזיר עבורם רשומות בטווח הזמן. נסה להגדיל את הטווח או לבדוק שה-Recorder שומר את הישויות האלה.",
        yaml: "type: custom:activity-history-card\nauto_discover: true\nhours_to_show: 168",
      },
      history_unusable: {
        title: "היסטוריה לא תקינה להצגה",
        body: "התקבלו רשומות היסטוריה, אבל הן היו חסרות זמן/מצב או לא יצרו מקטעים תקינים. הפעל debug כדי לראות את מספר הרשומות והמקטעים.",
        yaml: "type: custom:activity-history-card\ndebug: true",
      },
      all_entities_filtered: {
        title: "כל הרכיבים סוננו",
        body: "יש נתונים, אבל המסננים הנוכחיים מסתירים הכל. נקה חיפוש, אזור, סוג ישות או מצב פעיל בלבד.",
        yaml: "type: custom:activity-history-card\nauto_discover: true\nfilters:\n  active_only: false",
      },
      no_meaningful_activity: {
        title: "לא נמצאה פעילות משמעותית בטווח הזה",
        body: "הכרטיס מצא רכיבים והיסטוריה, אבל הסינון החכם הסתיר שורות בלי פעילות אמיתית, רכיבים טכניים או מקטעים קצרים מאוד. אפשר להציג הכל לבדיקה או להגדיל את הטווח.",
        yaml: "type: custom:activity-history-card\nauto_discover: true\nactivity_mode: all\nshow_inactive_baselines: true",
      },
    };
    const state = states[reason];
    const discoveryWarnings =
      reason === "no_resolved_entities" &&
      this._diagnostics?.discovery?.unavailableReasons.length
        ? this._diagnostics.discovery.unavailableReasons.join(", ")
        : "";
    return html`
      <div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">${state.title}</h3>
          <p>${state.body}</p>
          ${discoveryWarnings
            ? html`<p>
                אזהרת discovery: ${discoveryWarnings}. אם האזורים לא זמינים, נסה
                להגדיר entities ידנית או להפעיל debug.
              </p>`
            : nothing}
          ${reason === "no_meaningful_activity" && this._config.debug
            ? html`<p class="ahc-debug__meta">
                ${formatCurationSummary(this._curation)}
              </p>`
            : nothing}
          <pre
            class="ahc-state-card__yaml"
            dir="ltr"
          ><code>${state.yaml}</code></pre>
          ${reason === "no_meaningful_activity"
            ? html`<div class="ahc-empty-actions">
                <button
                  class="ahc__button ahc__button--primary"
                  type="button"
                  @click=${this._toggleShowAllRows}
                >
                  הצג הכל
                </button>
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${() => this._setTimePreset("7d")}
                >
                  7 ימים
                </button>
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${this._openFilterSheet}
                >
                  פתח סינון
                </button>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderDiagnostics(): TemplateResult {
    const diagnostics = this._diagnostics;
    if (!diagnostics) {
      return html`<details class="ahc-debug" aria-label="אבחון">
        <summary>Debug · ממתין לטעינת נתונים...</summary>
      </details>`;
    }

    return html`
      <details class="ahc-debug" aria-label="אבחון">
        <summary class="ahc-debug__header">
          <strong>Debug</strong>
          <span
            >${diagnostics.fetchReason ?? "loaded"} ·
            ${diagnostics.cacheHit ? "cache hit" : "cache miss"}</span
          >
        </summary>
        <dl class="ahc-debug__grid">
          <div>
            <dt>רכיבים</dt>
            <dd>${diagnostics.resolvedEntityCount}</dd>
          </div>
          <div>
            <dt>רשומות</dt>
            <dd>${diagnostics.historyRecordCount}</dd>
          </div>
          <div>
            <dt>מקטעים</dt>
            <dd>${diagnostics.timelineSegmentCount}</dd>
          </div>
          <div>
            <dt>פעילים</dt>
            <dd>${diagnostics.activeTimelineSegmentCount}</dd>
          </div>
          <div>
            <dt>אחרי סינון</dt>
            <dd>${diagnostics.filteredRowCount}</dd>
          </div>
          <div>
            <dt>מוצגות</dt>
            <dd>${diagnostics.curation?.visibleRows ?? 0}</dd>
          </div>
          <div>
            <dt>הוסתרו חכם</dt>
            <dd>${diagnostics.curation?.hiddenRows ?? 0}</dd>
          </div>
          <div>
            <dt>קבוצות</dt>
            <dd>${diagnostics.renderedGroupCount}</dd>
          </div>
          <div>
            <dt>attributes</dt>
            <dd>
              ${diagnostics.attributesRequested.withAttributes}/${diagnostics
                .attributesRequested.withoutAttributes}
            </dd>
          </div>
          <div>
            <dt>registry</dt>
            <dd>
              ${diagnostics.discovery?.registryAvailable ? "זמין" : "fallback"}
            </dd>
          </div>
          <div>
            <dt>refresh</dt>
            <dd>
              ${diagnostics.refreshIntervalSeconds ??
              this._refreshIntervalSeconds()}s
            </dd>
          </div>
          <div>
            <dt>duration</dt>
            <dd>${diagnostics.fetchDurationMs ?? 0}ms</dd>
          </div>
          <div>
            <dt>mode</dt>
            <dd>
              ${diagnostics.initialLoad
                ? "initial"
                : diagnostics.backgroundLoading
                  ? "background"
                  : "idle"}
            </dd>
          </div>
          ${this._config.debug_timeline_geometry === true
            ? html`<div>
                <dt>plot width</dt>
                <dd>${this._timelinePlotWidthLabel()}</dd>
              </div>`
            : nothing}
        </dl>
        <p class="ahc-debug__meta" dir="ltr">
          ${diagnostics.historyRange
            ? `${diagnostics.historyRange.start.toISOString()} → ${diagnostics.historyRange.end.toISOString()}`
            : "no range"}
        </p>
        <p class="ahc-debug__meta" dir="ltr">
          last fetch: ${diagnostics.lastFetchTime?.toISOString() ?? "never"}
        </p>
        <p class="ahc-debug__meta" dir="ltr">
          history key: ${diagnostics.currentHistoryKey ?? "none"}
        </p>
        <p class="ahc-debug__meta">
          מסננים: ${JSON.stringify(diagnostics.activeFilters)}
        </p>
        ${diagnostics.curation
          ? html`<p class="ahc-debug__meta" dir="ltr">
              curation: ${JSON.stringify(diagnostics.curation.hiddenByReason)}
            </p>`
          : nothing}
        ${diagnostics.discovery?.unavailableReasons.length
          ? html`<p class="ahc-debug__meta">
              Registry warnings:
              ${diagnostics.discovery.unavailableReasons.join(", ")}
            </p>`
          : nothing}
      </details>
    `;
  }

  private _timelinePlotWidthLabel(): string {
    const plot = this.renderRoot?.querySelector(
      ".ahc-dashboard-row__plot",
    ) as HTMLElement | null;
    return plot?.clientWidth ? `${plot.clientWidth}px` : "pending";
  }

  private _renderInsights(): TemplateResult {
    if (this._isMockup05VisualPreview()) {
      return renderMockup05Insights(mockup05VisualModel.insights);
    }
    if (this._dashboardModel && this._config.summary_scope !== "all") {
      return renderMockup05Insights(
        activityDashboardToMockup05Model(this._dashboardModel, this._config, {
          expandedInventoryGroups: this._expandedInventoryGroups,
          collapsedInventoryGroups: this._collapsedInventoryGroups,
          showAllInventory: this._showAllRows,
        }).insights,
      );
    }
    const summary = this._summary;
    const mostActive = summary?.mostActiveEntity;
    const mostActiveArea = summary?.mostActiveArea;
    const hasData = Boolean(summary && summary.eventCount > 0);
    return html`
      <section class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title">
          <span>תובנות חכמות</span><span aria-hidden="true">✦</span>
        </h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value"
            >${mostActive?.entity.name ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${mostActive
              ? `${formatDuration(mostActive.totalActiveMs)} · ${formatEntityLine(mostActive, this._config.debug === true)}`
              : "צריך היסטוריה פעילה בטווח"}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value"
            >${mostActiveArea?.title ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${mostActiveArea
              ? `${formatDuration(mostActiveArea.totalActiveMs)} · ${mostActiveArea.subtitle ?? ""}`
              : "אין אזור עם פעילות משמעותית"}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value"
            >${summary?.peakBucketLabel ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle">לפי משך פעילות</span>
          <span class="ahc__spark" aria-hidden="true"
            >${[35, 48, 62, 44, 72, 54, 38].map(
              (value) => html`<i style="--bar:${hasData ? value : 12}%"></i>`,
            )}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">דפוס שימוש קצר</span>
          <span class="ahc__insight-value"
            >${hasData
              ? `${summary?.activeEntityCount ?? 0} רכיבים`
              : "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${hasData
              ? `נרשמו ${summary?.eventCount ?? 0} אירועים בטווח הנוכחי`
              : "נסה טווח זמן ארוך יותר או ודא שה-Recorder פעיל"}</span
          >
        </article>
      </section>
    `;
  }

  private _renderDashboardInsights(
    dashboard: ActivityDashboardModel,
  ): TemplateResult {
    const insights = dashboard.insights;
    const hasData = dashboard.visibleEventCount > 0;
    return html`
      <section class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title">
          <span>תובנות חכמות</span><span aria-hidden="true">✦</span>
        </h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value">
            ${insights.mostActiveEntity?.name ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">
            ${insights.mostActiveEntity
              ? `${formatDuration(
                  insights.mostActiveEntity.totalActiveMs,
                )} · ${insights.mostActiveEntity.secondary ?? ""}`
              : "רק רכיבים משמעותיים מוצגים כברירת מחדל"}
          </span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value">
            ${insights.mostActiveArea?.title ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">
            ${insights.mostActiveArea
              ? `${formatDuration(insights.mostActiveArea.totalActiveMs)} · ${
                  insights.mostActiveArea.rowCount
                } רכיבי פעילות מתוך ${insights.mostActiveArea.inventoryCount} אביזרים`
              : "אין אזור עם פעילות משמעותית"}
          </span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value">
            ${insights.peakBucketLabel ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">לפי צפיפות הפעילות המוצגת</span>
          <span class="ahc__spark" aria-hidden="true">
            ${dashboard.densityBuckets
              .slice(0, 12)
              .map(
                (bucket) =>
                  html`<i
                    style=${`--bar:${hasData ? Math.max(12, bucket.intensity * 100) : 12}%`}
                  ></i>`,
              )}
          </span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">דפוס שימוש קצר</span>
          <span class="ahc__insight-value">
            ${insights.shortUsePattern ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">
            ${insights.inventoryPattern ??
            (dashboard.hiddenRowsCount
              ? `${dashboard.hiddenRowsCount} רכיבים הוסתרו כדי לשמור על תצוגה נקייה`
              : "כל הפעילות המשמעותית מוצגת")}
          </span>
        </article>
      </section>
    `;
  }

  private _renderFilterSheet(): TemplateResult {
    const areas = this._availableAreas();
    const domains = this._availableDomains();
    const selectedRows = this._visibleRows;

    return html`
      <div
        class="ahc-filter-sheet-backdrop"
        @click=${this._closeFilterSheet}
      ></div>
      <section
        class="ahc-filter-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="סינון מתקדם"
      >
        <div class="ahc-filter-sheet__handle" aria-hidden="true"></div>
        <header class="ahc-filter-sheet__header">
          <button
            class="ahc__button ahc__button--ghost"
            type="button"
            @click=${this._closeFilterSheet}
            aria-label="סגור"
          >
            ×
          </button>
          <h3 class="ahc-filter-sheet__title">סינון מתקדם</h3>
        </header>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>טווח זמן</span><span aria-hidden="true">◷</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip(
              "24 שעות",
              this._filter.timePreset === "24h",
              () => this._setTimePreset("24h"),
            )}
            ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () =>
              this._setTimePreset("7d"),
            )}
            ${this._renderChip(
              "טווח מותאם",
              this._filter.timePreset === "custom",
              () => this._setTimePreset("custom"),
            )}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>אזורים</span><span aria-hidden="true">▦</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל האזורים", !this._filter.areas.length, () =>
              this._setAreas([]),
            )}
            ${areas.map((area) =>
              this._renderChip(area, this._filter.areas.includes(area), () =>
                this._toggleArea(area),
              ),
            )}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>סוגי רכיבים</span><span aria-hidden="true">▦</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל הסוגים", !this._filter.domains.length, () =>
              this._setDomains([]),
            )}
            ${domains.map((domain) =>
              this._renderChip(
                DOMAIN_LABELS_HE[domain] ?? domain,
                this._filter.domains.includes(domain),
                () => this._toggleDomain(domain),
              ),
            )}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>מצבים</span><span aria-hidden="true">⌁</span>
          </div>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._filter.stateMode === "active_only"}
            @click=${() => this._setStateMode("active_only")}
          >
            <span>רק פעילים</span><small>הצג רכיבים שהיו פעילים בטווח</small>
          </button>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._filter.stateMode === "all"}
            @click=${() => this._setStateMode("all")}
          >
            <span>כל המצבים</span><small>הצג גם זמני כבוי ולא זמין</small>
          </button>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._filter.stateMode === "currently_active"}
            @click=${() => this._setStateMode("currently_active")}
          >
            <span>פעילים עכשיו</span><small>התמקד ברכיבים שפועלים כעת</small>
          </button>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>תצוגה חכמה</span
            ><span>${this._curation?.visibleRows ?? selectedRows.length}</span>
          </div>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._showAllRows ? "true" : "false"}
            @click=${this._toggleShowAllRows}
          >
            <span>
              ${this._currentRendererMode() === "activity"
                ? this._showAllRows
                  ? "פעילות בלבד"
                  : "כל האביזרים"
                : this._showAllRows
                  ? "הצג רק פעילות"
                  : "הצג הכל"}
            </span>
            <small
              >${formatCurationSummary(this._curation) ||
              "הסתר שורות ריקות, טכניות וקצרות מאוד"}</small
            >
          </button>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>קבוצות וחיפוש</span><span aria-hidden="true">▤</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip(
              "קבץ לפי אזור",
              this._filter.groupBy === "area",
              () => this._setGroupBy("area"),
            )}
            ${this._renderChip(
              "קבץ לפי סוג",
              this._filter.groupBy === "domain",
              () => this._setGroupBy("domain"),
            )}
            ${this._renderChip(
              "ללא קיבוץ",
              this._filter.groupBy === "none",
              () => this._setGroupBy("none"),
            )}
          </div>
          <div class="ahc__search ahc__search--sheet">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input
              class="ahc__search-input"
              type="search"
              .value=${this._filter.search}
              placeholder="חיפוש רכיב או אזור"
              @input=${this._onSearchInput}
            />
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>רכיבים נבחרים</span><span>${selectedRows.length}</span>
          </div>
          <div class="ahc-entity-list">
            ${selectedRows.slice(0, 32).map(
              (row) => html`
                <span class="ahc-entity-list__item">
                  <span>${row.entity.name}</span>
                  <small
                    >${[
                      row.entity.area,
                      DOMAIN_LABELS_HE[row.entity.domain] ?? row.entity.domain,
                    ]
                      .filter(Boolean)
                      .join(" · ")}</small
                  >
                </span>
              `,
            )}
            ${selectedRows.length > 32
              ? html`<span class="ahc-entity-list__more"
                  >ועוד ${selectedRows.length - 32} רכיבים</span
                >`
              : nothing}
          </div>
        </div>

        <footer class="ahc-filter-sheet__footer">
          <button
            class="ahc__button ahc__button--ghost"
            type="button"
            @click=${this._clearFilters}
          >
            נקה סינון
          </button>
          <button
            class="ahc__button ahc__button--primary"
            type="button"
            @click=${this._closeFilterSheet}
          >
            החל סינון
          </button>
        </footer>
      </section>
    `;
  }

  private _openFilterSheet = (): void => {
    this._filterSheetOpen = true;
    document.addEventListener("keydown", this._onDocumentKeyDown);
    this.requestUpdate();
  };

  private _closeFilterSheet = (): void => {
    this._filterSheetOpen = false;
    if (!this._fullscreen) {
      document.removeEventListener("keydown", this._onDocumentKeyDown);
    }
    this.requestUpdate();
  };

  private _requestHistoryRefresh(
    reason: HistoryRefreshReason,
    options: { force?: boolean } = {},
  ): void {
    if (!this._config) return;
    if (this._inFlightHistoryRequest && !options.force) return;

    const request = this._fetchAndRender(reason, options.force === true);
    this._inFlightHistoryRequest = request;
    void request.finally(() => {
      if (this._inFlightHistoryRequest === request) {
        this._inFlightHistoryRequest = undefined;
      }
    });
  }

  private async _fetchAndRender(
    reason: HistoryRefreshReason,
    force: boolean,
  ): Promise<void> {
    if (!this._config) return;

    const startedAt = Date.now();
    const useMockData = this._config.mock_data === true;
    if (!this._hass && !useMockData) {
      this._usingMockData = false;
      this._initialLoad = !this._rows.length;
      this._loading = this._initialLoad;
      this._backgroundLoading = false;
      this._error = undefined;
      this._emptyReason = undefined;
      this.requestUpdate();
      return;
    }

    const token = ++this._fetchToken;
    const initialLoad = !this._hasFetchedOnce && !this._rows.length;
    this._initialLoad = initialLoad;
    this._loading = initialLoad;
    this._backgroundLoading = !initialLoad;
    this._error = undefined;
    if (!this._rows.length) this._emptyReason = undefined;
    this._usingMockData = useMockData;
    this.requestUpdate();

    const resolved = useMockData
      ? {
          entities: getMockEntities(this._config.mock_profile),
          diagnostics: undefined,
        }
      : await resolveEntityMetasWithDiagnostics(this._config, this._hass);
    if (token !== this._fetchToken) return;

    const entities = resolved.entities;
    const entityKey = buildEntityKey(entities);
    const range = this._resolveRange();
    const requestPlan = getHistoryRequestPlan(entities);
    const key = buildHistoryCacheKey({
      mock: useMockData,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      entityIds: entities.map((entity) => entity.entity_id),
      withAttributes: requestPlan.withAttributes.map(
        (entity) => entity.entity_id,
      ),
      withoutAttributes: requestPlan.withoutAttributes.map(
        (entity) => entity.entity_id,
      ),
      includeLabels: this._config.include_labels ?? [],
      excludeLabels: this._config.exclude_labels ?? [],
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response,
    });
    const bypassCache =
      force && ["manual", "timer", "interval", "config"].includes(reason);
    const entitySetChanged = Boolean(
      this._lastResolvedEntityKey && this._lastResolvedEntityKey !== entityKey,
    );
    const fetchReason =
      entitySetChanged && reason === "interval" ? "entities" : reason;
    const finishDiagnostics = (
      cacheHit: boolean,
      historyRecordCount: number,
      discovery = resolved.diagnostics,
    ): void => {
      this._loadedRange = range;
      this._lastResolvedEntityKey = entityKey;
      this._lastHistoryFetchAt = Date.now();
      this._hasFetchedOnce = true;
      this._setPostLoadState(
        historyRecordCount,
        range,
        requestPlan,
        cacheHit,
        useMockData,
        discovery,
        {
          reason: fetchReason,
          key,
          durationMs: Date.now() - startedAt,
        },
      );
      this._syncRefreshTimer();
    };

    if (!entities.length) {
      this._loadedRange = range;
      this._usingMockData = false;
      this._rows = [];
      this._visibleRows = [];
      this._groups = [];
      this._dashboardModel = undefined;
      this._summary = summarizeActivity([]);
      this._curation = curateRows([], this._config).diagnostics;
      this._emptyReason =
        this._config.auto_discover === false && !this._config.entities?.length
          ? "no_entities_selected"
          : "no_resolved_entities";
      this._setDiagnostics({
        resolvedEntityCount: 0,
        historyRecordCount: 0,
        timelineSegmentCount: 0,
        activeTimelineSegmentCount: 0,
        filteredRowCount: 0,
        renderedGroupCount: 0,
        activeFilters: { ...this._filter },
        historyRange: range,
        attributesRequested: { withAttributes: 0, withoutAttributes: 0 },
        cacheHit: false,
        mockData: useMockData,
        discovery: resolved.diagnostics,
        curation: this._curation,
        lastFetchTime: new Date(),
        fetchDurationMs: Date.now() - startedAt,
        fetchReason,
        currentHistoryKey: key,
        refreshIntervalSeconds: this._refreshIntervalSeconds(),
        initialLoad,
        backgroundLoading: false,
      });
      this._hasFetchedOnce = true;
      this._lastResolvedEntityKey = entityKey;
      this._lastHistoryFetchAt = Date.now();
      this._initialLoad = false;
      this._loading = false;
      this._backgroundLoading = false;
      this._error = undefined;
      this._syncRefreshTimer();
      this.requestUpdate();
      return;
    }

    if (!bypassCache && key === this._lastFetchKey) {
      const cached = this._historyCache.get(key);
      if (cached) {
        const historyRecordCount = countHistoryRecords(cached);
        this._rows = intervalizeHistory(
          cached,
          entities,
          range,
          this._config,
          this._hass?.states ?? {},
        );
        finishDiagnostics(true, historyRecordCount);
        this._initialLoad = false;
        this._loading = false;
        this._backgroundLoading = false;
        this._error = undefined;
        this._rebuildGroups();
        return;
      }
    }

    try {
      let history = bypassCache ? undefined : this._historyCache.get(key);
      if (!history) {
        history = useMockData
          ? getMockHistory(range, this._config.mock_profile)
          : await fetchHistory(
              this._hass as HomeAssistant,
              entities,
              range,
              this._config,
            );
        this._historyCache.set(key, history);
      }
      if (token !== this._fetchToken) return;
      const historyRecordCount = countHistoryRecords(history);
      this._rows = intervalizeHistory(
        history,
        entities,
        range,
        this._config,
        this._hass?.states ?? {},
      );
      finishDiagnostics(false, historyRecordCount);
      this._lastFetchKey = key;
      this._rebuildGroups();
    } catch (error) {
      this._error = error instanceof Error ? error.message : String(error);
      if (!this._rows.length) {
        this._visibleRows = [];
        this._groups = [];
        this._dashboardModel = undefined;
        this._summary = summarizeActivity([]);
        this._curation = curateRows([], this._config).diagnostics;
        this._emptyReason = undefined;
      }
    } finally {
      if (token === this._fetchToken) {
        this._initialLoad = false;
        this._loading = false;
        this._backgroundLoading = false;
        this.requestUpdate();
      }
    }
  }

  private _rebuildGroups(): void {
    const filtered = filterRows(this._rows, this._filter);
    const range = this._displayRange();
    const rendererMode = this._currentRendererMode();
    const showAllForCuration = rendererMode !== "activity" && this._showAllRows;
    const curated = curateRows(filtered, this._config, {
      showAll: showAllForCuration,
      groupBy: this._filter.groupBy,
    });
    this._visibleRows = curated.rows;
    this._curation = curated.diagnostics;
    this._groups = groupRows(curated.rows, this._filter.groupBy).filter(
      (group) =>
        this._config.hide_empty_groups === false || group.rows.length > 0,
    );
    this._dashboardModel =
      rendererMode === "activity"
        ? buildActivityDashboardModel(
            this._groups,
            range,
            this._config,
            curated.diagnostics,
            {
              inventoryRows: filtered,
              selectedAreas: this._filter.areas,
              groupBy: this._filter.groupBy,
            },
          )
        : undefined;
    this._summary =
      rendererMode === "activity" &&
      this._dashboardModel &&
      this._config.summary_scope !== "all"
        ? summarizeDashboardModel(this._dashboardModel)
        : summarizeActivity(
            this._config.summary_scope === "all"
              ? groupRows(filtered, this._filter.groupBy)
              : this._groups,
          );
    if (this._rows.length && !filtered.length) {
      this._emptyReason = "all_entities_filtered";
    } else if (filtered.length && !curated.rows.length) {
      this._emptyReason = "no_meaningful_activity";
    } else if (
      this._emptyReason === "all_entities_filtered" ||
      this._emptyReason === "no_meaningful_activity"
    ) {
      this._emptyReason = undefined;
    }
    if (this._diagnostics) {
      this._setDiagnostics({
        ...this._diagnostics,
        filteredRowCount: filtered.length,
        renderedGroupCount:
          this._dashboardModel?.groups.length ?? this._groups.length,
        curation: curated.diagnostics,
        activeFilters: { ...this._filter },
      });
    }
    this.requestUpdate();
  }

  private _setPostLoadState(
    historyRecordCount: number,
    range: TimeRange,
    requestPlan: ReturnType<typeof getHistoryRequestPlan>,
    cacheHit: boolean,
    mockData: boolean,
    discovery: ActivityDiagnostics["discovery"],
    fetchMeta: { reason: string; key: string; durationMs: number },
  ): void {
    const timelineSegmentCount = this._rows.reduce(
      (sum, row) => sum + row.segments.length,
      0,
    );
    const activeTimelineSegmentCount = this._rows.reduce(
      (sum, row) =>
        sum + row.segments.filter((segment) => segment.active).length,
      0,
    );

    if (historyRecordCount === 0 && activeTimelineSegmentCount === 0) {
      this._emptyReason = "no_history_returned";
    } else if (historyRecordCount > 0 && timelineSegmentCount === 0) {
      this._emptyReason = "history_unusable";
    } else {
      this._emptyReason = undefined;
    }

    this._setDiagnostics({
      resolvedEntityCount: this._rows.length,
      historyRecordCount,
      timelineSegmentCount,
      activeTimelineSegmentCount,
      filteredRowCount: this._rows.length,
      renderedGroupCount: 0,
      activeFilters: { ...this._filter },
      historyRange: range,
      attributesRequested: {
        withAttributes: requestPlan.withAttributes.length,
        withoutAttributes: requestPlan.withoutAttributes.length,
      },
      cacheHit,
      mockData,
      discovery,
      curation: this._curation,
      lastFetchTime: new Date(this._lastHistoryFetchAt || Date.now()),
      fetchDurationMs: fetchMeta.durationMs,
      fetchReason: fetchMeta.reason,
      currentHistoryKey: fetchMeta.key,
      refreshIntervalSeconds: this._refreshIntervalSeconds(),
      initialLoad: this._initialLoad,
      backgroundLoading: this._backgroundLoading,
    });
  }

  private _setDiagnostics(diagnostics: ActivityDiagnostics): void {
    this._diagnostics = diagnostics;
  }

  private _syncRefreshTimer(): void {
    if (this._refreshTimer) window.clearTimeout(this._refreshTimer);
    this._refreshTimer = undefined;
    if (!this._config || this._config.live === false) return;

    const intervalSeconds = this._refreshIntervalSeconds();
    this._refreshTimer = window.setTimeout(() => {
      this._refreshTimer = undefined;
      this._requestHistoryRefresh("timer", { force: true });
    }, intervalSeconds * 1000);
  }

  private _refreshIntervalSeconds(): number {
    return normalizeRefreshIntervalSeconds(
      this._config?.refresh_interval_seconds,
    );
  }

  private _displayRange(): TimeRange {
    return this._loadedRange ?? this._resolveRange();
  }

  private _resolveRange(): TimeRange {
    const end = this._roundedNow();
    if (this._filter.timePreset === "24h") {
      return resolveTimeRange(
        {
          ...this._config,
          start_time: undefined,
          end_time: end.toISOString(),
          hours_to_show: 24,
        },
        end,
      );
    }
    if (this._filter.timePreset === "7d") {
      return resolveTimeRange(
        {
          ...this._config,
          start_time: undefined,
          end_time: end.toISOString(),
          hours_to_show: 24 * 7,
        },
        end,
      );
    }
    return resolveTimeRange(this._config, end);
  }

  private _roundedNow(): Date {
    const now = Date.now();
    return new Date(Math.floor(now / 60000) * 60000);
  }

  private _availableDomains(): string[] {
    return [...new Set(this._rows.map((row) => row.entity.domain))]
      .filter(Boolean)
      .sort();
  }

  private _availableAreas(): string[] {
    return [
      ...new Set(
        this._rows
          .map((row) => row.entity.area)
          .filter((area): area is string => Boolean(area)),
      ),
    ].sort();
  }

  private _onSearchInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this._filter = { ...this._filter, search: input.value };
    this._rebuildGroups();
  };

  private _toggleArea(area: string): void {
    const areas = this._filter.areas.includes(area)
      ? this._filter.areas.filter((item) => item !== area)
      : [...this._filter.areas, area];
    this._setAreas(areas);
  }

  private _setAreas(areas: string[]): void {
    this._filter = { ...this._filter, areas };
    this._resetInventoryExpansion();
    this._rebuildGroups();
  }

  private _toggleDomain(domain: string): void {
    const domains = this._filter.domains.includes(domain)
      ? this._filter.domains.filter((item) => item !== domain)
      : [...this._filter.domains, domain];
    this._setDomains(domains);
  }

  private _setDomains(domains: string[]): void {
    this._filter = { ...this._filter, domains };
    this._resetInventoryExpansion();
    this._rebuildGroups();
  }

  private _setGroupBy(groupBy: FilterState["groupBy"]): void {
    this._filter = { ...this._filter, groupBy };
    this._resetInventoryExpansion();
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
    this._requestHistoryRefresh("range", { force: true });
  }

  private _clearFilters = (): void => {
    const previousTimePreset = this._filter.timePreset;
    const nextTimePreset = this._initialTimePreset(this._config);
    this._showAllRows = false;
    this._expandedInventoryGroups.clear();
    this._collapsedInventoryGroups.clear();
    this._openInventoryAreaId = undefined;
    this._filter = {
      search: "",
      areas: [],
      domains: [],
      stateMode: "all",
      groupBy: this._config.group_by ?? "area",
      timePreset: nextTimePreset,
    };
    this._rebuildGroups();
    if (previousTimePreset !== nextTimePreset) {
      this._lastFetchKey = "";
      this._requestHistoryRefresh("range", { force: true });
    }
  };

  private _toggleShowAllRows = (): void => {
    this._showAllRows = !this._showAllRows;
    this._expandedInventoryGroups.clear();
    this._collapsedInventoryGroups.clear();
    this._openInventoryAreaId = undefined;
    this._rebuildGroups();
  };

  private _toggleDebugLegacyView = (): void => {
    if (!this._config.debug) return;
    this._debugLegacyView = !this._debugLegacyView;
    this._rebuildGroups();
  };

  private _currentRendererMode(): RendererMode {
    if (this._config.debug && this._debugLegacyView) {
      return "legacy_swimlane";
    }
    return resolveRendererMode(this._config, this._showAllRows);
  }

  private _toggleInventoryGroup = (groupId: string): void => {
    if (this._shouldUseInventoryDrawer()) {
      this._openInventoryAreaId =
        this._openInventoryAreaId === groupId ? undefined : groupId;
      this.requestUpdate();
      return;
    }

    const defaultExpanded = this._isInventoryGroupDefaultExpanded();
    if (this._collapsedInventoryGroups.has(groupId)) {
      this._collapsedInventoryGroups.delete(groupId);
      this._expandedInventoryGroups.add(groupId);
    } else if (defaultExpanded || this._expandedInventoryGroups.has(groupId)) {
      this._expandedInventoryGroups.delete(groupId);
      this._collapsedInventoryGroups.add(groupId);
    } else {
      this._expandedInventoryGroups.add(groupId);
    }
    this.requestUpdate();
  };

  private _closeInventoryDrawer = (): void => {
    this._openInventoryAreaId = undefined;
    this.requestUpdate();
  };

  private _shouldUseInventoryDrawer(): boolean {
    return (
      this._currentRendererMode() === "activity" &&
      this._showAllRows === false &&
      this._config.area_inventory_mode !== "expanded" &&
      this._dashboardModel?.singleAreaFocused !== true
    );
  }

  private _openInventoryMoreInfo = (event: Event, entityId: string): void => {
    event.stopPropagation();
    this.dispatchEvent(createHassMoreInfoEvent(entityId));
  };

  private _resetInventoryExpansion(): void {
    this._showAllRows = false;
    this._expandedInventoryGroups.clear();
    this._collapsedInventoryGroups.clear();
    this._openInventoryAreaId = undefined;
  }

  private _canToggleAreaInventory(): boolean {
    if (
      this._config.show_area_inventory === false ||
      this._config.area_inventory_mode === "off"
    ) {
      return false;
    }
    return Boolean(
      this._showAllRows || this._dashboardModel?.totalInventoryItemCount,
    );
  }

  private _isInventoryGroupDefaultExpanded(): boolean {
    return (
      this._showAllRows ||
      this._config.area_inventory_mode === "expanded" ||
      this._dashboardModel?.singleAreaFocused === true
    );
  }

  private _manualRefresh = (): void => {
    this._historyCache.clear();
    this._lastFetchKey = "";
    this._requestHistoryRefresh("manual", { force: true });
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
      document.removeEventListener(
        "fullscreenchange",
        this._onFullscreenChange,
      );
      if (!this._filterSheetOpen) {
        document.removeEventListener("keydown", this._onDocumentKeyDown);
      }
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => undefined);
      }
    }
    this.requestUpdate();
  };

  private _onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    if (this._segmentPopover) {
      this._closeSegmentPopover();
      return;
    }
    if (this._filterSheetOpen) {
      this._closeFilterSheet();
      return;
    }
    if (this._fullscreen) {
      void this._toggleFullscreen();
    }
  };

  private _onDocumentPointerDown = (event: PointerEvent): void => {
    const path = event.composedPath();
    if (
      path.some(
        (item) =>
          item instanceof HTMLElement && item.classList.contains("ahc-popover"),
      )
    )
      return;
    if (this._segmentPopover) this._closeSegmentPopover();
  };

  private _onFullscreenChange = (): void => {
    if (!document.fullscreenElement && this._fullscreen) {
      this._fullscreen = false;
      document.removeEventListener(
        "fullscreenchange",
        this._onFullscreenChange,
      );
      if (!this._filterSheetOpen) {
        document.removeEventListener("keydown", this._onDocumentKeyDown);
      }
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

function countHistoryRecords(
  history: Record<string, HistoryStateRecord[]>,
): number {
  return Object.values(history).reduce(
    (sum, records) => sum + records.length,
    0,
  );
}

function buildEntityKey(
  rows: TimelineRow[] | Array<{ entity_id: string }>,
): string {
  return rows
    .map((row) => ("entity" in row ? row.entity.entity_id : row.entity_id))
    .sort()
    .join("|");
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

void CARD_VERSION;
