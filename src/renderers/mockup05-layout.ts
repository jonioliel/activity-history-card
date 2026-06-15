import { html, nothing, type TemplateResult } from "lit";
import type {
  Mockup05AxisLabel,
  Mockup05DensityBucket,
  Mockup05Group,
  Mockup05Hero,
  Mockup05Insight,
  Mockup05InventoryItem,
  Mockup05Model,
  Mockup05Row,
  Mockup05Segment,
  Mockup05SegmentTone,
  Mockup05SummaryCard,
  Mockup05Toolbar,
} from "../mockup05/mockup05-model";
import type { ActivityHistoryCardConfig } from "../types";

export interface Mockup05RenderOptions {
  config?: ActivityHistoryCardConfig;
  nowPercent?: number | null;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  onSegmentClick?: (
    event: Event,
    entityId: string,
    segmentIndex: number,
  ) => void;
  onInventoryToggle?: (groupId: string) => void;
  onInventoryClose?: () => void;
  onInventoryItemClick?: (event: Event, entityId: string) => void;
  openInventoryGroupId?: string;
}

const SEGMENT_TONE_CLASSES: Record<Mockup05SegmentTone, string> = {
  on: "ahc-dashboard-segment--on",
  cooling: "ahc-dashboard-segment--cooling",
  heating: "ahc-dashboard-segment--heating",
  playing: "ahc-dashboard-segment--playing",
  open: "ahc-dashboard-segment--open",
  fan: "ahc-dashboard-segment--fan",
};

export function renderMockup05Shell(
  model: Mockup05Model,
  options: Mockup05RenderOptions = {},
): TemplateResult {
  return html`
    ${renderMockup05Hero(model.hero, options)}
    ${renderMockup05Toolbar(model.toolbar)}
    ${renderMockup05Summary(model.summary)}
    <section class="ahc__body">
      <main class="ahc__main">${renderMockup05Dashboard(model, options)}</main>
      <aside class="ahc__insights-panel">
        ${renderMockup05Insights(model.insights)}
      </aside>
    </section>
  `;
}

export function renderMockup05Hero(
  hero: Mockup05Hero,
  options: Mockup05RenderOptions = {},
): TemplateResult {
  return html`
    <section class="ahc__hero" dir="rtl">
      <div class="ahc__hero-main">
        <span class="ahc__hero-icon" aria-hidden="true">
          <ha-icon icon=${hero.icon}></ha-icon>
        </span>
        <div>
          <h2 class="ahc__hero-title">${hero.title}</h2>
          <p class="ahc__hero-subtitle">${hero.subtitle}</p>
        </div>
      </div>
      <div class="ahc__hero-actions">
        ${hero.status
          ? html`<span class="ahc__status-pill">${hero.status}</span>`
          : nothing}
        ${options.onRefresh
          ? html`<button
              class="ahc__button ahc__button--ghost"
              type="button"
              @click=${options.onRefresh}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
              <span>רענן</span>
            </button>`
          : nothing}
        ${options.onFullscreen
          ? html`<button
              class="ahc__button ahc__button--icon"
              type="button"
              aria-label="מסך מלא"
              @click=${options.onFullscreen}
            >
              <ha-icon icon="mdi:fullscreen"></ha-icon>
            </button>`
          : nothing}
      </div>
    </section>
  `;
}

export function renderMockup05Toolbar(
  toolbar: Mockup05Toolbar,
): TemplateResult {
  return html`
    <section class="ahc__toolbar" dir="rtl" aria-label="סינון פעילות">
      <div class="ahc__toolbar-group" role="group" aria-label="טווח זמן">
        <span class="ahc__toolbar-label">טווח זמן</span>
        ${toolbar.timePresets.map((item) =>
          renderToolbarChip(item.label, item.active),
        )}
      </div>
      <div class="ahc__toolbar-group" role="group" aria-label="קיבוץ לפי">
        <span class="ahc__toolbar-label">קבץ לפי</span>
        ${toolbar.groupBy.map((item) =>
          renderToolbarChip(item.label, item.active),
        )}
      </div>
      <label class="ahc__search" aria-label="חיפוש">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input type="search" placeholder=${toolbar.searchPlaceholder} />
      </label>
      <button class="ahc__button ahc__filter-chip" type="button">
        <ha-icon icon="mdi:tune-variant"></ha-icon>
        <span>${toolbar.filtersLabel}</span>
      </button>
    </section>
  `;
}

export function renderMockup05Summary(
  summary: Mockup05SummaryCard[],
): TemplateResult {
  return html`
    <section class="ahc__summary-strip" dir="rtl" aria-label="סיכום פעילות">
      ${summary.map(
        (card) => html`
          <article
            class="ahc__metric ahc__summary-card"
            data-tone=${card.tone ?? "idle"}
          >
            <span
              class="ahc__metric-icon ahc__summary-card-icon"
              aria-hidden="true"
            >
              <ha-icon icon=${card.icon}></ha-icon>
            </span>
            <div class="ahc__metric-copy">
              <span>${card.label}</span>
              <strong>${card.value}</strong>
              <small>${card.caption}</small>
            </div>
          </article>
        `,
      )}
    </section>
  `;
}

export function renderMockup05Dashboard(
  model: Mockup05Model,
  options: Mockup05RenderOptions = {},
): TemplateResult {
  if (!model.groups.length) return renderDashboardEmpty();
  const renderOptions = { ...options, nowPercent: model.nowPercent };
  const activeGroups = model.groups.filter((group) => groupHasActivity(group));
  const inactiveGroups = model.groups.filter(
    (group) => !groupHasActivity(group),
  );
  const visibleInactiveGroups = inactiveGroups.slice(0, 3);
  const hiddenInactiveCount = Math.max(
    0,
    inactiveGroups.length - visibleInactiveGroups.length,
  );
  const openInventoryGroup = options.openInventoryGroupId
    ? model.groups.find((group) => group.id === options.openInventoryGroupId)
    : undefined;

  return html`
    <section
      class="ahc-dashboard"
      dir="rtl"
      aria-label="ציר זמן פעילות"
      style=${dashboardStyle(options.config)}
    >
      <header class="ahc-dashboard__header">
        <div class="ahc-dashboard__title-block">
          <h3>ציר זמן פעילות</h3>
          <p>${model.groups.length} אזורים · ${model.rangeLabel}</p>
        </div>
        <div class="ahc-dashboard__range-pill">${model.rangeLabel}</div>
      </header>

      ${options.config?.show_activity_density === false
        ? nothing
        : renderMockup05Density(model.density)}

      <section
        class="ahc-dashboard__timeline"
        aria-label="פעילות לפי אזור ורכיב"
      >
        ${renderAxis(model.axisLabels, options.config, model.nowPercent)}
        <div class="ahc-dashboard__scroll">
          <div class="ahc-dashboard__groups ahc-dashboard__lanes">
            ${activeGroups.map((group) =>
              renderMockup05Group(group, model.axisLabels, renderOptions),
            )}
            ${visibleInactiveGroups.map((group) =>
              renderInactiveAreaSummary(group, renderOptions),
            )}
            ${hiddenInactiveCount > 0
              ? renderHiddenInactiveSummary(hiddenInactiveCount)
              : nothing}
          </div>
        </div>
        ${openInventoryGroup
          ? renderInventoryDrawer(openInventoryGroup, renderOptions)
          : nothing}
      </section>
    </section>
  `;
}

export function renderMockup05Density(
  density: Mockup05DensityBucket[],
): TemplateResult {
  const buckets = density.length ? density : emptyDensityBuckets();

  return html`
    <section
      class="ahc-dashboard__density"
      dir="ltr"
      aria-label="צפיפות פעילות"
    >
      <div class="ahc-timegrid ahc-timegrid--density" dir="ltr">
        <div
          class="ahc-dashboard__density-bars"
          style=${`--bucket-count:${buckets.length}`}
        >
          ${buckets.map(
            (bucket) => html`
              <span
                class="ahc-dashboard-density-bucket"
                data-active=${bucket.active ? "true" : "false"}
                title=${`${bucket.label} · ${bucket.value}`}
              >
                <i
                  class="ahc-dashboard-density-fill"
                  style=${`--intensity:${bucket.intensity}`}
                ></i>
              </span>
            `,
          )}
        </div>
      </div>
    </section>
  `;
}

function groupHasActivity(group: Mockup05Group): boolean {
  return group.rows.length > 0 || group.aggregateSegments.length > 0;
}

export function renderMockup05Group(
  group: Mockup05Group,
  axisLabels: Mockup05AxisLabel[] = [],
  options: Mockup05RenderOptions = {},
): TemplateResult {
  const expanded = group.expandedInventory === true;
  const hasRows = group.rows.length > 0;
  const hasActivity = hasRows || group.aggregateSegments.length > 0;
  const hasInventory = group.inventoryItems.length > 0;
  const rowLimit = options.config?.desktop_density === "ultra_compact" ? 3 : 4;
  const visibleRows = group.rows.slice(0, rowLimit);
  const hiddenRowCount = Math.max(0, group.rows.length - visibleRows.length);
  const inlineInventory = expanded && hasInventory;

  return html`
    <section
      class="ahc-area-lane ahc-area-lane--active ahc-area-card ahc-dashboard-group"
      data-has-activity=${hasActivity ? "true" : "false"}
      data-inventory-expanded=${expanded ? "true" : "false"}
    >
      <header
        class="ahc-area-lane__header ahc-area-card__header ahc-dashboard-group__header"
      >
        <div
          class="ahc-area-lane__title ahc-area-card__title ahc-dashboard-group__title"
        >
          ${renderIcon(group.icon, "ahc-dashboard-icon")}
          <div class="ahc-area-card__title-copy">
            <strong>${group.title}</strong>
            <span class="ahc-area-lane__meta">${group.meta}</span>
          </div>
        </div>
        <div class="ahc-area-card__actions">
          <div class="ahc-area-card__meta ahc-dashboard-group__meta">
            ${group.activityLabel}
          </div>
          ${hasInventory
            ? html`<button
                class="ahc-area-lane__inventory-trigger ahc-area-card__inventory-button"
                type="button"
                aria-expanded=${expanded ? "true" : "false"}
                @click=${() => options.onInventoryToggle?.(group.id)}
              >
                ${expanded ? "צמצם" : group.inventoryLabel}
              </button>`
            : nothing}
        </div>
      </header>

      ${hasActivity || group.aggregateSegments.length
        ? html`<div
            class="ahc-area-lane__aggregate ahc-area-card__aggregate ahc-dashboard-group__aggregate"
            dir="ltr"
            aria-label=${`פעילות מצטברת עבור ${group.title}`}
          >
            ${renderTimeGrid(
              axisLabels,
              "aggregate",
              group.aggregateSegments.map((segment) =>
                renderSegment(segment, "aggregate", options.config),
              ),
              options.config,
              options.nowPercent,
            )}
          </div>`
        : nothing}

      <div
        class="ahc-area-lane__content ahc-area-card__content ahc-dashboard-group__body"
      >
        ${hasRows
          ? html`<section
              class="ahc-area-card__activity"
              aria-label=${`פעילות באזור ${group.title}`}
            >
              <div class="ahc-area-lane__rows ahc-dashboard-group__rows">
                ${visibleRows.map((row) =>
                  renderMockup05Row(row, axisLabels, options),
                )}
                ${hiddenRowCount > 0
                  ? html`<div
                      class="ahc-area-lane__empty-summary ahc-dashboard-group__more"
                    >
                      עוד ${hiddenRowCount} רכיבים פעילים
                    </div>`
                  : nothing}
              </div>
            </section>`
          : nothing}
        ${inlineInventory ? renderInventoryPreview(group, options) : nothing}
      </div>
    </section>
  `;
}

function renderInactiveAreaSummary(
  group: Mockup05Group,
  options: Mockup05RenderOptions,
): TemplateResult {
  const hasInventory = group.inventoryItems.length > 0;

  return html`
    <section
      class="ahc-area-lane ahc-area-lane--inactive ahc-area-card ahc-dashboard-group"
      data-has-activity="false"
      data-inventory-expanded="false"
    >
      <header
        class="ahc-area-lane__header ahc-area-card__header ahc-dashboard-group__header"
      >
        <div
          class="ahc-area-lane__title ahc-area-card__title ahc-dashboard-group__title"
        >
          ${renderIcon(group.icon, "ahc-dashboard-icon")}
          <div class="ahc-area-card__title-copy">
            <strong>${group.title}</strong>
            <span class="ahc-area-lane__meta">${group.meta}</span>
          </div>
        </div>
        <div class="ahc-area-card__actions">
          <div
            class="ahc-area-lane__empty-summary ahc-area-card__meta ahc-dashboard-group__meta"
          >
            אין פעילות בטווח
          </div>
          ${hasInventory
            ? html`<button
                class="ahc-area-lane__inventory-trigger ahc-area-card__inventory-button"
                type="button"
                aria-expanded="false"
                @click=${() => options.onInventoryToggle?.(group.id)}
              >
                ${group.inventoryLabel}
              </button>`
            : nothing}
        </div>
      </header>
    </section>
  `;
}

function renderHiddenInactiveSummary(hiddenCount: number): TemplateResult {
  return html`
    <section
      class="ahc-area-lane ahc-area-lane--inactive ahc-area-lane--more ahc-area-card ahc-dashboard-group"
      data-has-activity="false"
      data-inventory-expanded="false"
    >
      <div class="ahc-area-lane__empty-summary">
        עוד ${hiddenCount} אזורים ללא פעילות
      </div>
    </section>
  `;
}

export function renderMockup05Row(
  row: Mockup05Row,
  axisLabels: Mockup05AxisLabel[] = [],
  options: Mockup05RenderOptions = {},
): TemplateResult {
  return html`
    <div class="ahc-lane-row ahc-dashboard-row" dir="rtl">
      <div class="ahc-lane-row__label ahc-dashboard-row__label" dir="rtl">
        ${renderIcon(row.icon, "ahc-dashboard-row__label-icon")}
        <div class="ahc-dashboard-row__label-copy">
          <strong class="ahc-lane-row__name" title=${row.label}>
            ${row.label}
          </strong>
          ${row.secondary
            ? html`<span title=${row.secondary}>${row.secondary}</span>`
            : nothing}
          ${row.totalLabel
            ? html`<small class="ahc-lane-row__duration">
                ${row.totalLabel}
              </small>`
            : nothing}
          <span
            class="ahc-dashboard-row__state"
            data-state-tone=${row.stateTone ?? "idle"}
          >
            ${row.state}
          </span>
        </div>
      </div>

      <div
        class="ahc-lane-row__plot ahc-dashboard-row__plot"
        dir="ltr"
        role="img"
        aria-label=${`פעילות עבור ${row.label}`}
      >
        ${renderTimeGrid(
          axisLabels,
          "row",
          row.segments.map((segment, index) =>
            renderSegment(segment, "row", options.config, (event) => {
              if (!row.entityId) return;
              options.onSegmentClick?.(
                event,
                row.entityId,
                segment.sourceIndex ?? index,
              );
            }),
          ),
          options.config,
          options.nowPercent,
        )}
      </div>
    </div>
  `;
}

export function renderMockup05Insights(
  insights: Mockup05Insight[],
): TemplateResult {
  return html`
    <section class="ahc__insights" dir="rtl" aria-label="תובנות חכמות">
      <header class="ahc__insights-header">
        <h3>תובנות חכמות</h3>
        <ha-icon icon="mdi:star-four-points"></ha-icon>
      </header>
      ${insights.map(
        (insight) => html`
          <article class="ahc__insight-card ahc-insight-card">
            <div class="ahc-insight-card__title">
              ${insight.icon
                ? html`<ha-icon icon=${insight.icon}></ha-icon>`
                : nothing}
              <span>${insight.title}</span>
            </div>
            <strong class="ahc-insight-card__value">${insight.value}</strong>
            <small class="ahc-insight-card__caption">${insight.caption}</small>
          </article>
        `,
      )}
    </section>
  `;
}

function renderToolbarChip(label: string, active = false): TemplateResult {
  return html`
    <button
      class=${active
        ? "ahc__filter-chip ahc__filter-chip--active"
        : "ahc__filter-chip"}
      type="button"
      aria-pressed=${active ? "true" : "false"}
    >
      ${label}
    </button>
  `;
}

function renderInventoryPreview(
  group: Mockup05Group,
  options: Mockup05RenderOptions,
): TemplateResult {
  const expanded = group.expandedInventory === true;
  const items = expanded
    ? group.inventoryItems
    : group.inventoryItems.slice(0, 4);
  const hiddenCount =
    group.hiddenInventoryCount ??
    Math.max(0, group.inventoryTotal - group.inventoryItems.length);

  return html`
    <section
      class="ahc-area-card__inventory-preview ahc-area-inventory"
      aria-label=${`אביזרים באזור ${group.title}`}
    >
      <header class="ahc-area-inventory__header">
        <span>${group.inventoryLabel}</span>
        <small>${group.inventoryTotal} אביזרים</small>
      </header>
      <div class="ahc-area-inventory__groups">
        <div class="ahc-area-inventory__domain">
          <div class="ahc-area-inventory__chips">
            ${items.map((item) => renderInventoryItem(item, options))}
          </div>
        </div>
      </div>
      ${!expanded && hiddenCount > 0
        ? html`<button
            class="ahc-area-inventory__more"
            type="button"
            @click=${() => options.onInventoryToggle?.(group.id)}
          >
            עוד ${hiddenCount} אביזרים
          </button>`
        : nothing}
    </section>
  `;
}

function renderInventoryDrawer(
  group: Mockup05Group,
  options: Mockup05RenderOptions,
): TemplateResult {
  const items = group.inventoryItems;

  return html`
    <aside
      class="ahc-inventory-drawer"
      dir="rtl"
      aria-label=${`כל האביזרים · ${group.title}`}
    >
      <header class="ahc-inventory-drawer__header">
        <div>
          <strong class="ahc-inventory-drawer__title">
            כל האביזרים · ${group.title}
          </strong>
          <span class="ahc-inventory-drawer__meta">
            ${group.inventoryTotal} רכיבים באזור
          </span>
        </div>
        <button
          class="ahc-inventory-drawer__close"
          type="button"
          aria-label="סגור"
          @click=${() => options.onInventoryClose?.()}
        >
          ×
        </button>
      </header>
      <div class="ahc-inventory-drawer__items">
        ${items.map((item) => renderInventoryItem(item, options))}
      </div>
    </aside>
  `;
}

function renderInventoryItem(
  item: Mockup05InventoryItem,
  options: Mockup05RenderOptions,
): TemplateResult {
  const title = [item.label, item.secondary, item.state]
    .filter(Boolean)
    .join(" · ");

  return html`
    <button
      class="ahc-inventory-chip"
      type="button"
      data-active-now=${item.activeNow ? "true" : "false"}
      data-had-activity=${item.hadActivity ? "true" : "false"}
      data-state-tone=${item.stateTone ?? "idle"}
      title=${title}
      aria-label=${title}
      @click=${(event: Event) =>
        item.entityId
          ? options.onInventoryItemClick?.(event, item.entityId)
          : undefined}
    >
      ${renderIcon(item.icon, "ahc-inventory-chip__icon")}
      <span class="ahc-inventory-chip__copy">
        <strong>${item.label}</strong>
        <small class="ahc-inventory-chip__state">${item.state}</small>
      </span>
    </button>
  `;
}

function renderSegment(
  segment: Mockup05Segment,
  variant: "aggregate" | "row",
  config?: ActivityHistoryCardConfig,
  onClick?: (event: Event) => void,
): TemplateResult {
  const classes = [
    "ahc-dashboard-segment",
    `ahc-dashboard-segment--${variant}`,
    SEGMENT_TONE_CLASSES[segment.tone],
    segment.minVisible ? "ahc-dashboard-segment--min" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const style = `left:${segment.leftPct}%;width:${segment.widthPct}%`;
  const title =
    config?.debug_timeline_geometry === true
      ? `${segment.label} · left ${segment.leftPct.toFixed(2)}% · width ${segment.widthPct.toFixed(2)}%`
      : segment.label;

  if (!onClick) {
    return html`<span
      class=${classes}
      data-category=${segment.tone}
      style=${style}
      title=${title}
    ></span>`;
  }

  return html`
    <button
      class=${classes}
      type="button"
      data-category=${segment.tone}
      style=${style}
      title=${title}
      aria-label=${title}
      @click=${onClick}
    >
      <span>${segment.label}</span>
    </button>
  `;
}

function renderTimeGrid(
  axisLabels: Mockup05AxisLabel[],
  variant: "aggregate" | "row" | "density",
  children: TemplateResult | TemplateResult[],
  config?: ActivityHistoryCardConfig,
  nowPercent?: number | null,
): TemplateResult {
  return html`
    <div class=${`ahc-timegrid ahc-timegrid--${variant}`} dir="ltr">
      ${renderGridLines(axisLabels)}
      ${config?.show_now_line === false
        ? nothing
        : renderNowMarker(axisLabels, "line", nowPercent)}
      <div class="ahc-timegrid__segments">${children}</div>
    </div>
  `;
}

function renderAxis(
  axisLabels: Mockup05AxisLabel[],
  config?: ActivityHistoryCardConfig,
  nowPercent?: number | null,
): TemplateResult {
  return html`
    <div class="ahc-dashboard__axis" dir="ltr" aria-hidden="true">
      ${renderGridLines(axisLabels)}
      <div class="ahc-dashboard__axis-labels">
        ${axisLabels
          .filter((label) => label.label.trim())
          .map(
            (label) => html`
              <span
                class="ahc-dashboard__tick ahc-dashboard__axis-label"
                data-edge=${tickEdge(label.percent)}
                style=${`left:${label.percent}%`}
                >${label.label}</span
              >
            `,
          )}
        ${config?.show_now_line === false
          ? nothing
          : renderNowMarker(axisLabels, "label", nowPercent)}
      </div>
    </div>
  `;
}

function renderGridLines(axisLabels: Mockup05AxisLabel[]): TemplateResult {
  const labels = axisLabels.length ? axisLabels : defaultAxisLabels();

  return html`
    <div class="ahc-timegrid__grid" aria-hidden="true">
      ${labels.map(
        (label) => html`
          <span
            class=${label.major === false
              ? "ahc-timegrid__line ahc-timegrid__line--minor"
              : "ahc-timegrid__line ahc-timegrid__line--major"}
            style=${`left:${label.percent}%`}
          ></span>
        `,
      )}
    </div>
  `;
}

function renderNowMarker(
  axisLabels: Mockup05AxisLabel[],
  labelMode: "line" | "label" = "line",
  nowPercent?: number | null,
): TemplateResult | typeof nothing {
  if (!axisLabels.length) return nothing;
  if (nowPercent === null) return nothing;
  const fallbackPercent = axisLabels.at(-1)?.percent ?? 86;
  const percent = Math.min(98, Math.max(2, nowPercent ?? fallbackPercent));

  return html`<span
    class=${labelMode === "label"
      ? "ahc-timegrid__now ahc-timegrid__now--label"
      : "ahc-timegrid__now"}
    style=${`left:${percent}%`}
    title="עכשיו"
    >${labelMode === "label"
      ? html`<span class="ahc-timegrid__now-label">עכשיו</span>`
      : nothing}</span
  >`;
}

function renderIcon(icon: string, extraClass = ""): TemplateResult {
  return html`<span
    class=${["ahc-dashboard-icon", extraClass].filter(Boolean).join(" ")}
    aria-hidden="true"
    ><ha-icon icon=${icon}></ha-icon
  ></span>`;
}

function renderDashboardEmpty(): TemplateResult {
  return html`
    <section class="ahc-dashboard ahc-dashboard-empty" dir="rtl">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>
        נסה להגדיל את טווח הזמן, להציג את כל האביזרים, או לפתוח סינון מתקדם.
      </p>
    </section>
  `;
}

function dashboardStyle(config?: ActivityHistoryCardConfig): string {
  return config?.timeline_height
    ? `--ahc-dashboard-height:${config.timeline_height};--ahc-timeline-height:${config.timeline_height}`
    : "";
}

function defaultAxisLabels(): Mockup05AxisLabel[] {
  return [
    { label: "00:00", percent: 0 },
    { label: "04:00", percent: 20 },
    { label: "08:00", percent: 40 },
    { label: "12:00", percent: 60 },
    { label: "16:00", percent: 80 },
    { label: "20:00", percent: 100 },
  ];
}

function emptyDensityBuckets(): Mockup05DensityBucket[] {
  return Array.from({ length: 24 }, (_, index) => ({
    id: `empty-density-${index}`,
    label: `${index}:00`,
    value: "אין פעילות",
    intensity: 0,
    active: false,
  }));
}

function tickEdge(percent: number): "start" | "end" | "middle" {
  if (percent <= 0.5) return "start";
  if (percent >= 99.5) return "end";
  return "middle";
}
