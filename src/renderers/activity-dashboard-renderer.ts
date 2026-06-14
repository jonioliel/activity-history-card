import { html, nothing, type TemplateResult } from "lit";
import type {
  ActivityDashboardGroup,
  ActivityDashboardModel,
  ActivityDashboardRow,
  ActivityDashboardSegment,
  AreaInventoryItem,
} from "../activity-dashboard-model";
import type { ActivityDensityBucket } from "../activity-density";
import {
  CATEGORY_LABELS_HE,
  DEFAULT_CONFIG,
  DOMAIN_LABELS_HE,
} from "../defaults";
import { formatDuration, formatTime } from "../format";
import type { ActivityHistoryCardConfig, TimeRange } from "../types";
import {
  buildTimelineAxis,
  type TimelineAxisModel,
  type TimelineTick,
} from "./timeline-axis";

export interface ActivityDashboardRendererOptions {
  model: ActivityDashboardModel;
  config: ActivityHistoryCardConfig;
  expandedInventoryGroups?: Set<string>;
  collapsedInventoryGroups?: Set<string>;
  showAllInventory?: boolean;
  onSegmentClick?: (
    event: Event,
    entityId: string,
    segmentIndex: number,
  ) => void;
  onInventoryToggle?: (groupId: string) => void;
  onInventoryItemClick?: (event: Event, entityId: string) => void;
}

export function renderActivityDashboard(
  options: ActivityDashboardRendererOptions,
): TemplateResult {
  const { model, config } = options;
  const axis = buildTimelineAxis(model.range, {
    maxMajorTicks: axisMajorTickCount(config),
  });
  const timelineStyle = config.timeline_height
    ? `--ahc-dashboard-height:${config.timeline_height};--ahc-timeline-height:${config.timeline_height}`
    : "";

  if (!model.visibleRowsCount && !model.totalInventoryItemCount) {
    return renderDashboardEmpty();
  }

  return html`
    <section
      class="ahc-dashboard"
      dir="rtl"
      aria-label="ציר זמן פעילות"
      style=${timelineStyle}
    >
      <header class="ahc-dashboard__header">
        <div class="ahc-dashboard__title-block">
          <h3>ציר זמן פעילות</h3>
          <p>
            ${model.visibleRowsCount} רכיבי פעילות מתוך
            ${model.totalInventoryItemCount || model.totalRowsBeforeCuration}
            אביזרים
            ${model.hiddenRowsCount
              ? html` · הוסתרו ${model.hiddenRowsCount} שורות רעש`
              : nothing}
          </p>
        </div>
        <div class="ahc-dashboard__range-pill">
          ${rangeLabelFor(model.range)}
        </div>
      </header>

      ${config.show_activity_density === false
        ? nothing
        : renderDensity(model.densityBuckets, axis, config)}

      <section
        class="ahc-dashboard__timeline"
        aria-label="פעילות לפי אזור ורכיב"
      >
        ${renderAxis(axis, config)}
        <div class="ahc-dashboard__scroll">
          ${model.groups.map((group) => renderGroup(group, options, axis))}
        </div>
      </section>

      ${model.hiddenRowsCount
        ? html`<p class="ahc-dashboard__hidden-note">
            התצוגה שומרת על ציר פעילות נקי. רכיבים ללא פעילות עדיין מופיעים
            במלאי האביזרים של האזור.
          </p>`
        : nothing}
    </section>
  `;
}

function renderGroup(
  group: ActivityDashboardGroup,
  options: ActivityDashboardRendererOptions,
  axis: TimelineAxisModel,
): TemplateResult {
  const inventoryEnabled =
    options.config.show_area_inventory !== false &&
    options.config.area_inventory_mode !== "off";
  const defaultExpanded =
    options.config.area_inventory_mode === "expanded" ||
    options.model.singleAreaFocused ||
    options.showAllInventory === true;
  const inventoryExpanded =
    options.collapsedInventoryGroups?.has(group.id) === true
      ? false
      : defaultExpanded ||
        options.expandedInventoryGroups?.has(group.id) === true;

  const extraActivityCount = Math.max(0, group.hiddenRowsCount);

  return html`
    <section
      class="ahc-area-card ahc-dashboard-group"
      data-has-activity=${group.activityRows.length ? "true" : "false"}
      data-inventory-expanded=${inventoryExpanded ? "true" : "false"}
    >
      <header class="ahc-area-card__header ahc-dashboard-group__header">
        <div class="ahc-area-card__title ahc-dashboard-group__title">
          ${renderIcon(group.icon, "mdi:home-outline")}
          <div class="ahc-area-card__title-copy">
            <strong>${group.title}</strong>
            <span>
              ${group.visibleActivityRowCount} פעילים בטווח ·
              ${group.inventoryItemCount} אביזרים
            </span>
          </div>
        </div>
        <div class="ahc-area-card__actions">
          <div class="ahc-area-card__meta ahc-dashboard-group__meta">
            ${formatDuration(group.totalActiveMs)} · ${group.eventCount} אירועים
          </div>
          ${inventoryEnabled && group.inventoryItemCount
            ? html`<button
                class="ahc-area-card__inventory-button"
                type="button"
                aria-expanded=${inventoryExpanded ? "true" : "false"}
                @click=${() => options.onInventoryToggle?.(group.id)}
              >
                ${inventoryExpanded
                  ? "סגור מלאי"
                  : `אביזרים ${group.inventoryItemCount}`}
              </button>`
            : nothing}
        </div>
      </header>

      <div
        class="ahc-area-card__aggregate ahc-dashboard-group__aggregate"
        dir="ltr"
        aria-label=${`פעילות מצטברת עבור ${group.title}`}
      >
        ${renderTimeGrid(
          axis,
          "aggregate",
          options.config,
          group.aggregateSegments.map((segment) =>
            renderSegment(segment, "aggregate", options.config),
          ),
        )}
      </div>

      <div class="ahc-area-card__content ahc-dashboard-group__body">
        <section class="ahc-area-card__activity" aria-label="פעילות באזור">
          ${group.activityRows.length
            ? html`<div class="ahc-dashboard-group__rows">
                ${group.activityRows.map((row) =>
                  renderRow(row, options, axis),
                )}
                ${extraActivityCount > 0
                  ? html`<p class="ahc-dashboard-group__more">
                      +${extraActivityCount} פעילויות נוספות
                    </p>`
                  : nothing}
              </div>`
            : html`<div class="ahc-area-card__quiet">
                אין פעילות משמעותית בטווח הנוכחי
              </div>`}
        </section>
        ${inventoryEnabled && group.inventoryItems.length && inventoryExpanded
          ? renderInventory(group, options, inventoryExpanded)
          : nothing}
      </div>
    </section>
  `;
}

function renderRow(
  row: ActivityDashboardRow,
  options: ActivityDashboardRendererOptions,
  axis: TimelineAxisModel,
): TemplateResult {
  return html`
    <div class="ahc-dashboard-row" dir="rtl">
      <div class="ahc-dashboard-row__label" dir="rtl">
        ${renderIcon(row.icon, fallbackIcon(row.domain))}
        <div>
          <strong title=${row.name}>${row.name}</strong>
          ${row.secondary
            ? html`<span title=${row.secondary}>${row.secondary}</span>`
            : nothing}
          <span class="ahc-dashboard-row__inline-meta">
            <strong>${formatDuration(row.totalActiveMs)}</strong>
            <span>${row.eventCount} אירועים</span>
          </span>
        </div>
      </div>

      <div
        class="ahc-dashboard-row__plot"
        dir="ltr"
        role="img"
        aria-label=${`פעילות עבור ${row.name}`}
      >
        ${renderTimeGrid(
          axis,
          "row",
          options.config,
          row.segments.map((segment, index) =>
            renderSegment(segment, "row", options.config, (event) =>
              options.onSegmentClick?.(
                event,
                row.entityId,
                segment.sourceIndex ?? index,
              ),
            ),
          ),
        )}
      </div>

      <div class="ahc-dashboard-row__meta">
        <strong>${formatDuration(row.totalActiveMs)}</strong>
        <span>${row.eventCount} אירועים</span>
      </div>
    </div>
  `;
}

function renderInventory(
  group: ActivityDashboardGroup,
  options: ActivityDashboardRendererOptions,
  expanded: boolean,
): TemplateResult {
  const limit = inventoryLimit(options.config);
  const items = expanded
    ? group.inventoryItems
    : group.inventoryItems.slice(0, limit);
  const hiddenCount = Math.max(0, group.inventoryItems.length - items.length);
  const groupedItems =
    options.config.area_inventory_group_by_domain === false
      ? [{ title: "", items }]
      : groupInventoryItems(items);

  return html`
    <section
      class="ahc-area-inventory"
      aria-label=${`אביזרים באזור ${group.title}`}
    >
      <header class="ahc-area-inventory__header">
        <span>אביזרים באזור</span>
        <small>
          ${group.inventoryItems.filter((item) => item.activeNow).length} פעילים
          עכשיו
        </small>
      </header>
      <div class="ahc-area-inventory__groups">
        ${groupedItems.map(
          (itemGroup) => html`
            <div class="ahc-area-inventory__domain">
              ${itemGroup.title
                ? html`<span class="ahc-area-inventory__domain-title"
                    >${itemGroup.title}</span
                  >`
                : nothing}
              <div class="ahc-area-inventory__chips">
                ${itemGroup.items.map((item) =>
                  renderInventoryItem(item, options.config, options),
                )}
              </div>
            </div>
          `,
        )}
      </div>
      ${hiddenCount
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

function renderInventoryItem(
  item: AreaInventoryItem,
  config: ActivityHistoryCardConfig,
  options: ActivityDashboardRendererOptions,
): TemplateResult {
  const showState =
    config.area_inventory_show_state ??
    DEFAULT_CONFIG.area_inventory_show_state;
  const showLastActivity =
    config.area_inventory_show_last_activity ??
    DEFAULT_CONFIG.area_inventory_show_last_activity;
  const stateTone =
    item.stateTone ??
    (item.activeNow
      ? "active"
      : item.hadActivityInRange
        ? "had_activity"
        : "inactive");
  const title = `${item.name} · ${domainLabel(item.domain)}${
    item.currentStateLabel ? ` · ${item.currentStateLabel}` : ""
  }`;

  return html`
    <button
      class="ahc-inventory-chip"
      type="button"
      data-active-now=${item.activeNow ? "true" : "false"}
      data-had-activity=${item.hadActivityInRange ? "true" : "false"}
      data-state-tone=${stateTone}
      data-state-category=${item.currentCategory ?? "none"}
      title=${title}
      aria-label=${title}
      @click=${(event: Event) =>
        options.onInventoryItemClick?.(event, item.entityId)}
    >
      ${renderIcon(item.icon, fallbackIcon(item.domain))}
      <span class="ahc-inventory-chip__copy">
        <span class="ahc-inventory-chip__status" aria-hidden="true"></span>
        <strong>${item.name}</strong>
        <small>
          ${showState && item.currentStateLabel
            ? item.currentStateLabel
            : domainLabel(item.domain)}
          ${showLastActivity && item.hadActivityInRange && item.totalActiveMs
            ? html` · ${formatDuration(item.totalActiveMs)}`
            : nothing}
        </small>
      </span>
    </button>
  `;
}

function renderSegment(
  segment: ActivityDashboardSegment,
  variant: "aggregate" | "row",
  config: ActivityHistoryCardConfig,
  onClick?: (event: Event) => void,
): TemplateResult {
  const classes = [
    "ahc-dashboard-segment",
    `ahc-dashboard-segment--${variant}`,
    segment.minVisible ? "ahc-dashboard-segment--min" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const style = `left:${segment.leftPct}%;width:${segment.widthPct}%;--segment-color:${segment.colorVar}`;
  const title =
    config.debug_timeline_geometry === true
      ? `${segment.label} · left ${segment.leftPct.toFixed(2)}% · width ${segment.widthPct.toFixed(2)}%`
      : segment.label;

  if (!onClick) {
    return html`<span
      class=${classes}
      data-category=${segment.category}
      style=${style}
      title=${title}
    ></span>`;
  }

  return html`
    <button
      class=${classes}
      type="button"
      data-category=${segment.category}
      style=${style}
      title=${title}
      aria-label=${title}
      @click=${onClick}
    >
      <span>${CATEGORY_LABELS_HE[segment.category]}</span>
    </button>
  `;
}

function renderTimeGrid(
  axis: TimelineAxisModel,
  variant: "aggregate" | "row" | "density",
  config: ActivityHistoryCardConfig,
  children: TemplateResult | TemplateResult[],
): TemplateResult {
  return html`
    <div class=${`ahc-timegrid ahc-timegrid--${variant}`} dir="ltr">
      ${renderGridLines(axis, config)}
      ${config.show_now_line === false ? nothing : renderNowMarker(axis)}
      <div class="ahc-timegrid__segments">${children}</div>
    </div>
  `;
}

function renderGridLines(
  axis: TimelineAxisModel,
  config: ActivityHistoryCardConfig,
): TemplateResult {
  return html`
    <div class="ahc-timegrid__grid" aria-hidden="true">
      ${axis.ticks.map((tick) => renderGridLine(tick, config))}
    </div>
  `;
}

function renderGridLine(
  tick: TimelineTick,
  config: ActivityHistoryCardConfig,
): TemplateResult {
  const title = config.debug_timeline_geometry
    ? `${tick.major ? tick.label || "major" : "minor"} · ${tick.percent.toFixed(2)}%`
    : tick.label;
  return html`<span
    class=${tick.major
      ? "ahc-timegrid__line ahc-timegrid__line--major"
      : "ahc-timegrid__line ahc-timegrid__line--minor"}
    style=${`left:${tick.percent}%`}
    title=${title}
  ></span>`;
}

function renderAxis(
  axis: TimelineAxisModel,
  config: ActivityHistoryCardConfig,
): TemplateResult {
  return html`
    <div class="ahc-dashboard__axis" dir="ltr" aria-hidden="true">
      ${renderGridLines(axis, config)}
      <div class="ahc-dashboard__axis-labels">
        ${axis.ticks
          .filter((tick) => tick.major)
          .map(
            (tick) =>
              html`<span
                class="ahc-dashboard__tick"
                style=${`left:${tick.percent}%`}
                title=${config.debug_timeline_geometry
                  ? `${tick.label} · ${tick.percent.toFixed(2)}%`
                  : tick.label}
                >${tick.label}</span
              >`,
          )}
        ${config.show_now_line === false
          ? nothing
          : renderNowMarker(axis, "label")}
      </div>
    </div>
  `;
}

function renderNowMarker(
  axis: TimelineAxisModel,
  labelMode: "line" | "label" = "line",
): TemplateResult | typeof nothing {
  if (axis.nowPercent === undefined) return nothing;
  return html`<span
    class=${labelMode === "label"
      ? "ahc-timegrid__now ahc-timegrid__now--label"
      : "ahc-timegrid__now"}
    style=${`left:${axis.nowPercent}%`}
    title="עכשיו"
    >${labelMode === "label"
      ? html`<span class="ahc-timegrid__now-label">עכשיו</span>`
      : nothing}</span
  >`;
}

function renderDensity(
  buckets: ActivityDensityBucket[],
  axis: TimelineAxisModel,
  config: ActivityHistoryCardConfig,
): TemplateResult {
  const labels = axis.ticks.filter((tick) => tick.major);
  return html`
    <section
      class="ahc-dashboard__density"
      dir="ltr"
      aria-label="צפיפות פעילות"
    >
      ${renderTimeGrid(
        axis,
        "density",
        { ...config, show_now_line: false },
        html`<div class="ahc-dashboard__density-bars">
          ${buckets.map((bucket) => {
            const active = bucket.totalActiveMs > 0;
            const title = `${formatTime(bucket.start)} - ${formatTime(
              bucket.end,
            )}: ${formatDuration(bucket.totalActiveMs)} · ${
              bucket.activeEntityCount
            } רכיבים`;
            return html`
              <span
                class="ahc-dashboard-density-bucket"
                data-active=${active ? "true" : "false"}
                title=${title}
              >
                <i
                  class="ahc-dashboard-density-fill"
                  style=${`--intensity:${bucket.intensity}`}
                ></i>
              </span>
            `;
          })}
        </div>`,
      )}
      <div class="ahc-dashboard__density-labels" aria-hidden="true">
        ${labels.map(
          (tick) =>
            html`<span style=${`left:${tick.percent}%`}>${tick.label}</span>`,
        )}
      </div>
    </section>
  `;
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

function renderIcon(
  icon: string | undefined,
  fallback: string,
): TemplateResult {
  return html`<span class="ahc-dashboard-icon" aria-hidden="true"
    ><ha-icon icon=${icon ?? fallback}></ha-icon
  ></span>`;
}

function groupInventoryItems(
  items: AreaInventoryItem[],
): Array<{ title: string; items: AreaInventoryItem[] }> {
  const groups = new Map<string, AreaInventoryItem[]>();
  for (const item of items) {
    const title = domainLabel(item.domain);
    groups.set(title, [...(groups.get(title) ?? []), item]);
  }
  return [...groups.entries()].map(([title, groupItems]) => ({
    title,
    items: groupItems,
  }));
}

function inventoryLimit(config: ActivityHistoryCardConfig): number {
  const configured = config.area_inventory_max_items;
  if (typeof configured === "number" && Number.isFinite(configured)) {
    return Math.max(1, Math.floor(configured));
  }
  return DEFAULT_CONFIG.area_inventory_max_items;
}

function domainLabel(domain: string): string {
  return DOMAIN_LABELS_HE[domain] ?? domain;
}

function fallbackIcon(domain: string): string {
  if (domain === "light") return "mdi:lightbulb-outline";
  if (domain === "climate") return "mdi:thermostat";
  if (domain === "media_player") return "mdi:music";
  if (domain === "cover") return "mdi:window-shutter";
  if (domain === "fan") return "mdi:fan";
  return "mdi:toggle-switch-outline";
}

function axisMajorTickCount(config: ActivityHistoryCardConfig): number {
  if (config.timeline_axis_density === "compact") return 6;
  if (config.timeline_axis_density === "auto") return 7;
  return 8;
}

function rangeLabelFor(range: TimeRange): string {
  const hours = Math.round(
    (range.end.getTime() - range.start.getTime()) / 3600000,
  );
  if (hours >= 24 * 7) return "7 ימים";
  if (hours >= 24) return `${Math.round(hours / 24)} ימים`;
  return `${hours} שעות`;
}
