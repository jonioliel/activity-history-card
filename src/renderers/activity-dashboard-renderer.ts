import { html, type TemplateResult } from "lit";
import type {
  ActivityDashboardGroup,
  ActivityDashboardModel,
  ActivityDashboardRow,
  ActivityDashboardSegment,
} from "../activity-dashboard-model";
import type { ActivityDensityBucket } from "../activity-density";
import { CATEGORY_LABELS_HE } from "../defaults";
import { formatDuration, formatTime, timeToPercent } from "../format";
import type { ActivityHistoryCardConfig, TimeRange } from "../types";

export interface ActivityDashboardRendererOptions {
  model: ActivityDashboardModel;
  config: ActivityHistoryCardConfig;
  onSegmentClick?: (
    event: Event,
    entityId: string,
    segmentIndex: number,
  ) => void;
}

export function renderActivityDashboard(
  options: ActivityDashboardRendererOptions,
): TemplateResult {
  const { model, config } = options;
  const ticks = buildTicks(model.range);

  if (!model.visibleRowsCount) {
    return renderDashboardEmpty();
  }

  return html`
    <section class="ahc-dashboard" dir="rtl" aria-label="ציר זמן פעילות">
      <header class="ahc-dashboard__header">
        <div class="ahc-dashboard__title-block">
          <h3>ציר זמן פעילות</h3>
          <p>
            מציג ${model.visibleRowsCount} רכיבים פעילים מתוך
            ${model.totalRowsBeforeCuration}
            ${model.hiddenRowsCount
              ? html` · הוסתרו ${model.hiddenRowsCount}`
              : null}
          </p>
        </div>
        <div class="ahc-dashboard__range-pill">
          ${rangeLabelFor(model.range)}
        </div>
      </header>

      <section class="ahc-dashboard__overview" aria-label="צפיפות פעילות">
        ${config.show_activity_density === false
          ? null
          : renderDensity(model.densityBuckets)}
        <div class="ahc-dashboard__axis" dir="ltr" aria-hidden="true">
          ${ticks.map(
            (tick) =>
              html`<span
                class="ahc-dashboard__tick"
                style=${`left:${tick.percent}%`}
                >${tick.label}</span
              >`,
          )}
        </div>
      </section>

      <section class="ahc-dashboard__groups">
        ${model.groups.map((group) => renderGroup(group, options))}
      </section>

      ${model.hiddenRowsCount
        ? html`<p class="ahc-dashboard__hidden-note">
            מציג תצוגת פעילות נקייה. ${model.hiddenRowsCount} רכיבים הוסתרו;
            “הצג הכל” מיועד לבדיקה ודיבוג.
          </p>`
        : null}
    </section>
  `;
}

function renderGroup(
  group: ActivityDashboardGroup,
  options: ActivityDashboardRendererOptions,
): TemplateResult {
  return html`
    <article class="ahc-dashboard-group">
      <header class="ahc-dashboard-group__header">
        <div class="ahc-dashboard-group__title">
          ${renderIcon(group.icon, "mdi:home-outline")}
          <div>
            <strong>${group.title}</strong>
            <span>${group.activeNowCount} פעילים עכשיו</span>
          </div>
        </div>
        <div class="ahc-dashboard-group__meta">
          ${group.rows.length} רכיבים · ${formatDuration(group.totalActiveMs)} ·
          ${group.eventCount} אירועים
        </div>
      </header>

      <div
        class="ahc-dashboard-group__aggregate"
        dir="ltr"
        aria-label=${`פעילות מצטברת עבור ${group.title}`}
      >
        ${group.aggregateSegments.map((segment) =>
          renderSegment(segment, "aggregate"),
        )}
      </div>

      <div class="ahc-dashboard-group__rows">
        ${group.rows.map((row) => renderRow(row, options))}
      </div>
    </article>
  `;
}

function renderRow(
  row: ActivityDashboardRow,
  options: ActivityDashboardRendererOptions,
): TemplateResult {
  return html`
    <div class="ahc-dashboard-row">
      <div class="ahc-dashboard-row__label" dir="rtl">
        ${renderIcon(row.icon, fallbackIcon(row.domain))}
        <div>
          <strong title=${row.name}>${row.name}</strong>
          ${row.secondary
            ? html`<span title=${row.secondary}>${row.secondary}</span>`
            : null}
        </div>
      </div>

      <div
        class="ahc-dashboard-row__plot"
        dir="ltr"
        role="img"
        aria-label=${`פעילות עבור ${row.name}`}
      >
        ${row.segments.map((segment, index) =>
          renderSegment(segment, "row", (event) =>
            options.onSegmentClick?.(
              event,
              row.entityId,
              segment.sourceIndex ?? index,
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

function renderSegment(
  segment: ActivityDashboardSegment,
  variant: "aggregate" | "row",
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

  if (!onClick) {
    return html`<span
      class=${classes}
      data-category=${segment.category}
      style=${style}
      title=${segment.label}
    ></span>`;
  }

  return html`
    <button
      class=${classes}
      type="button"
      data-category=${segment.category}
      style=${style}
      title=${segment.label}
      aria-label=${segment.label}
      @click=${onClick}
    >
      <span>${CATEGORY_LABELS_HE[segment.category]}</span>
    </button>
  `;
}

function renderDensity(buckets: ActivityDensityBucket[]): TemplateResult {
  return html`
    <div class="ahc-dashboard__density" dir="ltr">
      ${buckets.map((bucket) => {
        const active = bucket.totalActiveMs > 0;
        const title = `${formatTime(bucket.start)} – ${formatTime(
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
    </div>
  `;
}

function renderDashboardEmpty(): TemplateResult {
  return html`
    <section class="ahc-dashboard ahc-dashboard-empty" dir="rtl">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>נסה להגדיל את טווח הזמן, להציג את כל הרכיבים, או לפתוח סינון מתקדם.</p>
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

function fallbackIcon(domain: string): string {
  if (domain === "light") return "mdi:lightbulb-outline";
  if (domain === "climate") return "mdi:thermostat";
  if (domain === "media_player") return "mdi:music";
  if (domain === "cover") return "mdi:window-shutter";
  if (domain === "fan") return "mdi:fan";
  return "mdi:toggle-switch-outline";
}

function buildTicks(
  range: TimeRange,
): Array<{ label: string; percent: number }> {
  const totalHours = Math.max(
    1,
    (range.end.getTime() - range.start.getTime()) / 3600000,
  );
  const stepHours = totalHours <= 24 ? 3 : totalHours <= 72 ? 6 : 24;
  const ticks: Array<{ label: string; percent: number }> = [];
  const start = new Date(range.start);
  start.setMinutes(0, 0, 0);

  while (start < range.end) {
    if (start >= range.start) {
      ticks.push({
        label: formatTime(start),
        percent: timeToPercent(start, range),
      });
    }
    start.setHours(start.getHours() + stepHours);
  }

  ticks.push({ label: formatTime(range.end), percent: 100 });
  return ticks;
}

function rangeLabelFor(range: TimeRange): string {
  const hours = Math.round(
    (range.end.getTime() - range.start.getTime()) / 3600000,
  );
  if (hours >= 24 * 7) return "7 ימים";
  if (hours >= 24) return `${Math.round(hours / 24)} ימים`;
  return `${hours} שעות`;
}
