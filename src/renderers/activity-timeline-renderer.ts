import { html, type TemplateResult } from "lit";
import {
  calculateActivityDensity,
  type ActivityDensityBucket,
} from "../activity-density";
import { formatCurationSummary } from "../activity-curation";
import { CATEGORY_LABELS_HE } from "../defaults";
import { renderEntityIcon, renderGroupIcon } from "../entity-icons";
import { formatDuration, formatTime, timeToPercent } from "../format";
import { limitTimelineGroups } from "../timeline-layout";
import { segmentToGeometry } from "../timeline-geometry";
import type {
  ActivityHistoryCardConfig,
  ActivitySummary,
  RowCurationDiagnostics,
  TimelineGroup,
  TimelineRow,
  TimeRange,
} from "../types";

export interface ActivityTimelineRendererOptions {
  groups: TimelineGroup[];
  range: TimeRange;
  config: ActivityHistoryCardConfig;
  summary: ActivitySummary;
  curation?: RowCurationDiagnostics;
  onSegmentClick?: (
    event: Event,
    entityId: string,
    segmentIndex: number,
  ) => void;
}

export interface PreparedActivityTimeline {
  groups: TimelineGroup[];
  density: ActivityDensityBucket[];
  totalRowCount: number;
  visibleRowCount: number;
  hiddenRowCount: number;
}

export function renderActivityTimeline(
  options: ActivityTimelineRendererOptions,
): TemplateResult {
  const prepared = prepareActivityTimeline(
    options.groups,
    options.range,
    options.config,
  );
  const ticks = buildTicks(options.range);
  const curationSummary = formatCurationSummary(options.curation);
  const rangeLabel = rangeLabelFor(options.range);

  if (!prepared.visibleRowCount) {
    return renderActivityEmpty();
  }

  return html`
    <section class="ahc-activity" aria-label="ציר זמן פעילות">
      <header class="ahc-activity__header">
        <div class="ahc-activity__heading">
          <h3>ציר זמן פעילות</h3>
          <p>
            מציג ${prepared.visibleRowCount} רכיבים פעילים מתוך
            ${options.curation?.totalRows ?? prepared.totalRowCount}
            ${prepared.hiddenRowCount
              ? html` · ${prepared.hiddenRowCount} נוספים הוסתרו מהתצוגה`
              : null}
            ${curationSummary ? html` · ${curationSummary}` : null}
          </p>
        </div>
        <div class="ahc-activity__range">${rangeLabel}</div>
      </header>

      ${options.config.show_activity_density === false
        ? null
        : renderDensityStrip(prepared.density)}

      <div class="ahc-activity__axis" dir="ltr" aria-hidden="true">
        ${ticks.map(
          (tick) =>
            html`<span class="ahc-activity__tick" style="left:${tick.percent}%"
              >${tick.label}</span
            >`,
        )}
      </div>

      <div class="ahc-activity__groups">
        ${prepared.groups.map((group) =>
          renderActivityGroup(group, options.range, options),
        )}
      </div>

      ${prepared.hiddenRowCount
        ? html`<p class="ahc-activity__more">
            + ${prepared.hiddenRowCount} רכיבים נוספים הוסתרו. אפשר ללחוץ “הצג
            הכל” למצב legacy/debug.
          </p>`
        : null}
    </section>
  `;
}

export function prepareActivityTimeline(
  groups: TimelineGroup[],
  range: TimeRange,
  config: ActivityHistoryCardConfig,
): PreparedActivityTimeline {
  const activeGroups = groups
    .map((group) => {
      const rows = group.rows.filter(rowHasActiveSegments);
      const totalActiveMs = rows.reduce(
        (sum, row) => sum + row.totalActiveMs,
        0,
      );
      return {
        ...group,
        rows,
        totalActiveMs,
        subtitle: `${rows.length} רכיבים`,
      };
    })
    .filter((group) => group.rows.length > 0)
    .sort(
      (a, b) =>
        b.totalActiveMs - a.totalActiveMs ||
        b.rows.length - a.rows.length ||
        a.title.localeCompare(b.title, "he"),
    );

  const display = limitTimelineGroups(
    activeGroups,
    config.max_visible_rows ?? config.max_total_rows,
  );
  const visibleGroups = display.groups.filter((group) => group.rows.length > 0);
  const visibleRows = visibleGroups.flatMap((group) => group.rows);

  return {
    groups: visibleGroups,
    density: calculateActivityDensity(visibleRows, range, config),
    totalRowCount: display.totalRowCount,
    visibleRowCount: visibleRows.length,
    hiddenRowCount: Math.max(0, display.totalRowCount - visibleRows.length),
  };
}

function renderActivityGroup(
  group: TimelineGroup,
  range: TimeRange,
  options: ActivityTimelineRendererOptions,
): TemplateResult {
  return html`
    <article class="ahc-activity-group" aria-label=${group.title}>
      <header class="ahc-activity-group__header">
        <span class="ahc-activity-group__title">
          ${renderGroupIcon(group)}<strong>${group.title}</strong>
        </span>
        <span class="ahc-activity-group__meta">
          ${group.rows.length} רכיבים · ${formatDuration(group.totalActiveMs)}
        </span>
      </header>
      <div class="ahc-activity-group__rows">
        ${group.rows.map((row) => renderActivityRow(row, range, options))}
      </div>
    </article>
  `;
}

function renderActivityRow(
  row: TimelineRow,
  range: TimeRange,
  options: ActivityTimelineRendererOptions,
): TemplateResult {
  return html`
    <div class="ahc-activity-row">
      <div class="ahc-activity-row__label" dir="rtl">
        ${renderEntityIcon(row.entity)}
        <span class="ahc-activity-row__name" title=${row.entity.name}>
          ${row.entity.name}
        </span>
      </div>
      <div
        class="ahc-activity-row__plot"
        dir="ltr"
        role="img"
        aria-label=${`ציר זמן עבור ${row.entity.name}`}
      >
        ${row.segments.map((segment, index) => {
          if (!segment.active) return null;
          const geometry = segmentToGeometry(segment, range);
          if (geometry.widthPct <= 0) return null;
          const label = `${row.entity.name}, ${
            CATEGORY_LABELS_HE[segment.category]
          }, ${formatTime(segment.start)} עד ${formatTime(segment.end)}, ${formatDuration(
            segment.durationMs,
          )}`;
          return html`
            <button
              class="ahc-activity-segment"
              type="button"
              data-category=${segment.category}
              data-min-visible=${geometry.minVisible ? "true" : "false"}
              style=${`left:${geometry.leftPct}%;width:max(var(--ahc-activity-segment-min-width), ${geometry.widthPct}%);`}
              aria-label=${label}
              @click=${(event: Event) =>
                options.onSegmentClick?.(event, row.entity.entity_id, index)}
            >
              <span>${CATEGORY_LABELS_HE[segment.category]}</span>
            </button>
          `;
        })}
      </div>
    </div>
  `;
}

function renderDensityStrip(buckets: ActivityDensityBucket[]): TemplateResult {
  return html`
    <div
      class="ahc-activity__density-strip"
      dir="ltr"
      aria-label="צפיפות פעילות לאורך הזמן"
    >
      ${buckets.map(
        (bucket) => html`
          <span
            class="ahc-activity__density-bar"
            style=${`--intensity:${bucket.intensity}`}
            title=${`${formatTime(bucket.start)} - ${formatTime(
              bucket.end,
            )}: ${formatDuration(bucket.totalActiveMs)}`}
          ></span>
        `,
      )}
    </div>
  `;
}

function renderActivityEmpty(): TemplateResult {
  return html`
    <section class="ahc-activity ahc-activity-empty">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>נסה להגדיל את טווח הזמן, להציג את כל הרכיבים, או לפתוח סינון מתקדם.</p>
    </section>
  `;
}

function rowHasActiveSegments(row: TimelineRow): boolean {
  return row.segments.some((segment) => segment.active);
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
