import { html, type TemplateResult } from "lit";
import { CATEGORY_LABELS_HE } from "../defaults";
import { renderEntityIcon, renderGroupIcon } from "../entity-icons";
import { formatDuration, formatTime, timeToPercent } from "../format";
import { limitTimelineGroups } from "../timeline-layout";
import type { ActivityHistoryCardConfig, ActivitySummary, TimelineGroup, TimeRange } from "../types";

export interface SwimlaneRendererOptions {
  groups: TimelineGroup[];
  range: TimeRange;
  config: ActivityHistoryCardConfig;
  summary: ActivitySummary;
  onSegmentClick?: (event: Event, entityId: string, segmentIndex: number) => void;
}

export function renderSwimlaneTimeline(options: SwimlaneRendererOptions): TemplateResult {
  const display = limitTimelineGroups(options.groups, options.config.max_visible_rows);
  const ticks = buildTicks(options.range);
  const now = new Date();
  const nowPercent = timeToPercent(now, options.range);
  const showNow =
    options.config.show_now_line !== false &&
    now.getTime() >= options.range.start.getTime() &&
    now.getTime() <= options.range.end.getTime() + 90000;

  return html`
    <section
      class=${`ahc-timeline-card ahc-timeline-card--${display.density}`}
      aria-label="ציר זמן פעילות"
      style=${options.config.timeline_height ? `--ahc-timeline-height:${options.config.timeline_height}` : ""}
    >
      <div class="ahc-timeline-toolbar">
        <h3 class="ahc-timeline-title">ציר זמן פעילות</h3>
        <span class="ahc__metric-subtitle">
          ${formatTime(options.range.start)} – ${formatTime(options.range.end)}
          ${display.hiddenRowCount ? ` · מציג ${display.visibleRowCount} מתוך ${display.totalRowCount}` : ""}
        </span>
      </div>
      <div class="ahc-timeline-scroll">
        <div class="ahc-timeline">
          <div class="ahc-timeline__axis" aria-hidden="true">
            <div class="ahc-timeline__axis-spacer">רכיב / אזור</div>
            <div class="ahc-timeline__ticks">
              ${ticks.map(
                (tick) => html`<span class="ahc-timeline__tick" style="left:${tick.percent}%">${tick.label}</span>`,
              )}
            </div>
          </div>
          <div class="ahc-timeline__groups">
            ${display.groups.map((group) => {
              const collapsed = groupShouldStartCollapsed(group, options.config);
              return html`
                <details class="ahc-group" aria-label=${group.title} ?open=${!collapsed}>
                  <summary class="ahc-group__header">
                    <span class="ahc-group__title">${renderGroupIcon(group)}<span>${group.title}</span></span>
                    <span class="ahc-group__meta">${formatDuration(group.totalActiveMs)} • ${group.subtitle ?? ""}</span>
                  </summary>
                  ${group.rows.map(
                    (row) => html`
                      <div class="ahc-row">
                        <div class="ahc-row__label">
                          ${renderEntityIcon(row.entity)}
                          <span class="ahc-row__name" title=${options.config.debug ? row.entity.entity_id : row.entity.name}>${row.entity.name}</span>
                          ${row.currentCategory
                            ? html`<span class="ahc-row__state-chip" data-state=${row.currentCategory}>${CATEGORY_LABELS_HE[row.currentCategory]}</span>`
                            : null}
                        </div>
                        <div class="ahc-row__track">
                          <svg
                            class="ahc-row__svg"
                            viewBox="0 0 100 32"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label=${`ציר זמן עבור ${row.entity.name}`}
                          >
                            <line class="ahc-row__svg-track" x1="1" x2="99" y1="16" y2="16"></line>
                            ${row.segments.map((segment, index) => {
                              const left = timeToPercent(segment.start, options.range);
                              const right = timeToPercent(segment.end, options.range);
                              const width = Math.max(0.35, right - left);
                              if (!segment.active && segment.category !== "unknown" && segment.category !== "off" && segment.category !== "idle") return null;
                              const label = `${row.entity.name}, ${CATEGORY_LABELS_HE[segment.category]}, ${formatTime(segment.start)} עד ${formatTime(segment.end)}, ${formatDuration(segment.durationMs)}`;
                              return html`
                                <rect
                                  class=${segment.active ? "ahc-segment-svg" : "ahc-segment-svg ahc-segment-svg--inactive"}
                                  data-category=${segment.category}
                                  data-active=${segment.active ? "true" : "false"}
                                  x=${left}
                                  y=${segment.active ? "9" : "12"}
                                  width=${width}
                                  height=${segment.active ? "14" : "8"}
                                  rx=${segment.active ? "7" : "4"}
                                  tabindex="0"
                                  role="button"
                                  aria-label=${label}
                                  @click=${(event: Event) => options.onSegmentClick?.(event, row.entity.entity_id, index)}
                                  @keydown=${(event: KeyboardEvent) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      options.onSegmentClick?.(event, row.entity.entity_id, index);
                                    }
                                  }}
                                >
                                  <title>${label}</title>
                                </rect>
                              `;
                            })}
                          </svg>
                        </div>
                      </div>
                    `,
                  )}
                  ${!group.rows.length ? html`<div class="ahc-group__empty">אין שורות גלויות בקבוצה הזו</div>` : null}
                </details>
              `;
            })}
          </div>
          ${showNow
            ? html`<div class="ahc-now-line" style="left:${nowPercent}%"><span class="ahc-now-line__label">עכשיו</span></div>`
            : null}
        </div>
      </div>
      ${options.config.show_legend === false ? null : renderLegend()}
    </section>
  `;
}

function groupShouldStartCollapsed(group: TimelineGroup, config: ActivityHistoryCardConfig): boolean {
  const configured = new Set(config.default_collapsed_groups ?? []);
  if (configured.has(group.id) || configured.has(group.title)) return true;
  return Boolean(config.collapse_groups && group.totalActiveMs <= 0);
}

function renderLegend(): TemplateResult {
  const items: Array<[keyof typeof CATEGORY_LABELS_HE, string]> = [
    ["on", "var(--ahc-on)"],
    ["cooling", "var(--ahc-cooling)"],
    ["heating", "var(--ahc-heating)"],
    ["playing", "var(--ahc-playing)"],
    ["opening", "var(--ahc-opening)"],
    ["off", "var(--ahc-off)"],
    ["unknown", "var(--ahc-unknown)"],
  ];
  return html`<div class="ahc-legend" aria-label="מקרא">
    ${items.map(
      ([category, color]) => html`<span class="ahc-legend__item"><span class="ahc-legend__swatch" style="--swatch:${color}"></span>${CATEGORY_LABELS_HE[category]}</span>`,
    )}
  </div>`;
}

function buildTicks(range: TimeRange): Array<{ label: string; percent: number }> {
  const totalHours = Math.max(1, (range.end.getTime() - range.start.getTime()) / 3600000);
  const stepHours = totalHours <= 24 ? 3 : totalHours <= 72 ? 6 : 24;
  const ticks: Array<{ label: string; percent: number }> = [];
  const start = new Date(range.start);
  start.setMinutes(0, 0, 0);
  while (start < range.end) {
    if (start >= range.start) {
      ticks.push({ label: formatTime(start), percent: timeToPercent(start, range) });
    }
    start.setHours(start.getHours() + stepHours);
  }
  ticks.push({ label: formatTime(range.end), percent: 100 });
  return ticks;
}
