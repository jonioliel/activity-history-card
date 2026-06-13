import {
  calculateActivityDensity,
  type ActivityDensityBucket,
} from "./activity-density";
import { formatCurationSummary } from "./activity-curation";
import { CATEGORY_LABELS_HE, DEFAULT_COLORS } from "./defaults";
import { DOMAIN_LABELS_HE } from "./defaults";
import { formatDuration, formatTime } from "./format";
import { summarizeActivity } from "./summary";
import { limitTimelineGroups } from "./timeline-layout";
import { segmentToGeometry } from "./timeline-geometry";
import type {
  ActivityHistoryCardConfig,
  ActivitySummary,
  RowCurationDiagnostics,
  StateCategory,
  TimelineGroup,
  TimelineRow,
  TimelineSegment,
  TimeRange,
} from "./types";

export interface ActivityDashboardModel {
  range: TimeRange;
  totalRowsBeforeCuration: number;
  visibleRowsCount: number;
  hiddenRowsCount: number;
  hiddenReasonSummary: string;
  totalVisibleActiveMs: number;
  visibleEventCount: number;
  activeNowCount: number;
  densityBuckets: ActivityDensityBucket[];
  groups: ActivityDashboardGroup[];
  insights: ActivityDashboardInsights;
}

export interface ActivityDashboardGroup {
  id: string;
  title: string;
  icon?: string;
  area?: string;
  totalActiveMs: number;
  eventCount: number;
  activeNowCount: number;
  hiddenRowsCount: number;
  aggregateSegments: ActivityDashboardSegment[];
  rows: ActivityDashboardRow[];
}

export interface ActivityDashboardRow {
  entityId: string;
  name: string;
  secondary?: string;
  icon?: string;
  domain: string;
  area?: string;
  totalActiveMs: number;
  eventCount: number;
  activeNow: boolean;
  segments: ActivityDashboardSegment[];
}

export interface ActivityDashboardSegment {
  start: Date;
  end: Date;
  category: StateCategory;
  label: string;
  colorVar: string;
  leftPct: number;
  widthPct: number;
  minVisible: boolean;
  sourceIndex?: number;
}

export interface ActivityDashboardInsights {
  mostActiveEntity?: {
    name: string;
    secondary?: string;
    totalActiveMs: number;
    eventCount: number;
  };
  mostActiveArea?: {
    title: string;
    totalActiveMs: number;
    eventCount: number;
    rowCount: number;
  };
  peakBucketLabel?: string;
  shortUsePattern?: string;
}

export interface ActivityDashboardSelection {
  groups: TimelineGroup[];
  totalRowCount: number;
  visibleRowCount: number;
  hiddenRowCount: number;
}

const AGGREGATE_MERGE_GAP_MS = 60_000;

export function selectActivityDashboardGroups(
  groups: TimelineGroup[],
  config: ActivityHistoryCardConfig,
): ActivityDashboardSelection {
  const activeGroups = groups
    .map((group) => {
      const rows = group.rows
        .filter(rowHasVisibleActivity)
        .sort(
          (a, b) =>
            b.totalActiveMs - a.totalActiveMs ||
            b.eventCount - a.eventCount ||
            a.entity.name.localeCompare(b.entity.name, "he"),
        );
      return {
        ...group,
        rows,
        totalActiveMs: rows.reduce((sum, row) => sum + row.totalActiveMs, 0),
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
  const visibleRowCount = visibleGroups.reduce(
    (sum, group) => sum + group.rows.length,
    0,
  );

  return {
    groups: visibleGroups,
    totalRowCount: display.totalRowCount,
    visibleRowCount,
    hiddenRowCount: Math.max(0, display.totalRowCount - visibleRowCount),
  };
}

export function buildActivityDashboardModel(
  groups: TimelineGroup[],
  range: TimeRange,
  config: ActivityHistoryCardConfig,
  curation?: RowCurationDiagnostics,
): ActivityDashboardModel {
  const selection = selectActivityDashboardGroups(groups, config);
  const visibleRows = selection.groups.flatMap((group) => group.rows);
  const dashboardGroups = selection.groups.map((group) =>
    toDashboardGroup(group, range),
  );
  const totalRowsBeforeCuration =
    curation?.totalRows ?? selection.totalRowCount;
  const hiddenRowsCount = Math.max(
    0,
    curation?.hiddenRows ?? 0,
    selection.hiddenRowCount,
    totalRowsBeforeCuration - selection.visibleRowCount,
  );
  const densityBuckets = calculateActivityDensity(visibleRows, range, config);
  const totalVisibleActiveMs = visibleRows.reduce(
    (sum, row) => sum + row.totalActiveMs,
    0,
  );
  const visibleEventCount = visibleRows.reduce(
    (sum, row) => sum + row.eventCount,
    0,
  );

  return {
    range,
    totalRowsBeforeCuration,
    visibleRowsCount: selection.visibleRowCount,
    hiddenRowsCount,
    hiddenReasonSummary: formatCurationSummary(curation),
    totalVisibleActiveMs,
    visibleEventCount,
    activeNowCount: visibleRows.filter(isActiveNow).length,
    densityBuckets,
    groups: dashboardGroups,
    insights: buildDashboardInsights(dashboardGroups, densityBuckets),
  };
}

export function summarizeDashboardModel(
  model: ActivityDashboardModel,
): ActivitySummary {
  const groups = model.groups.map((group) => ({
    id: group.id,
    title: group.title,
    subtitle: `${group.rows.length} רכיבים`,
    icon: group.icon,
    totalActiveMs: group.totalActiveMs,
    rows: group.rows.map((row) => ({
      entity: {
        entity_id: row.entityId,
        name: row.name,
        domain: row.domain,
        area: row.area,
        icon: row.icon,
      },
      segments: row.segments.map((segment) => ({
        entity_id: row.entityId,
        state: segment.category,
        category: segment.category,
        active: true,
        start: segment.start,
        end: segment.end,
        durationMs: Math.max(
          0,
          segment.end.getTime() - segment.start.getTime(),
        ),
      })),
      totalActiveMs: row.totalActiveMs,
      eventCount: row.eventCount,
      currentCategory: row.activeNow
        ? row.segments.at(-1)?.category
        : undefined,
    })),
  }));

  return summarizeActivity(groups);
}

function toDashboardGroup(
  group: TimelineGroup,
  range: TimeRange,
): ActivityDashboardGroup {
  const rows = group.rows.map((row) => toDashboardRow(row, range));
  const eventCount = rows.reduce((sum, row) => sum + row.eventCount, 0);
  return {
    id: group.id,
    title: group.title,
    icon: group.icon,
    area: group.title,
    totalActiveMs: rows.reduce((sum, row) => sum + row.totalActiveMs, 0),
    eventCount,
    activeNowCount: rows.filter((row) => row.activeNow).length,
    hiddenRowsCount: 0,
    aggregateSegments: buildAggregateSegments(group.rows, range, group.title),
    rows,
  };
}

function toDashboardRow(
  row: TimelineRow,
  range: TimeRange,
): ActivityDashboardRow {
  const segments = row.segments
    .map((segment, sourceIndex) => ({ segment, sourceIndex }))
    .filter((item) => item.segment.active)
    .map(({ segment, sourceIndex }) =>
      toDashboardSegment(
        segment,
        range,
        `${row.entity.name} · ${CATEGORY_LABELS_HE[segment.category]} · ${formatTime(
          segment.start,
        )} עד ${formatTime(segment.end)} · ${formatDuration(segment.durationMs)}`,
        sourceIndex,
      ),
    )
    .filter((segment): segment is ActivityDashboardSegment =>
      Boolean(segment && segment.widthPct > 0),
    );

  return {
    entityId: row.entity.entity_id,
    name: row.entity.name,
    secondary: [row.entity.area, DOMAIN_LABELS_HE[row.entity.domain]]
      .filter(Boolean)
      .join(" · "),
    icon: row.entity.icon,
    domain: row.entity.domain,
    area: row.entity.area,
    totalActiveMs: row.totalActiveMs,
    eventCount: row.eventCount,
    activeNow: isActiveNow(row),
    segments,
  };
}

function buildAggregateSegments(
  rows: TimelineRow[],
  range: TimeRange,
  groupTitle: string,
): ActivityDashboardSegment[] {
  const activeSegments = rows
    .flatMap((row) => row.segments.filter((segment) => segment.active))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: TimelineSegment[] = [];

  for (const segment of activeSegments) {
    const previous = merged.at(-1);
    if (
      previous &&
      segment.start.getTime() <= previous.end.getTime() + AGGREGATE_MERGE_GAP_MS
    ) {
      previous.end = new Date(
        Math.max(previous.end.getTime(), segment.end.getTime()),
      );
      previous.durationMs = Math.max(
        0,
        previous.end.getTime() - previous.start.getTime(),
      );
      if (previous.category !== segment.category) previous.category = "on";
      continue;
    }
    merged.push({ ...segment });
  }

  return merged
    .map((segment) =>
      toDashboardSegment(
        segment,
        range,
        `${groupTitle} · פעילות מצטברת · ${formatTime(
          segment.start,
        )} עד ${formatTime(segment.end)} · ${formatDuration(segment.durationMs)}`,
      ),
    )
    .filter((segment): segment is ActivityDashboardSegment =>
      Boolean(segment && segment.widthPct > 0),
    );
}

function toDashboardSegment(
  segment: TimelineSegment,
  range: TimeRange,
  label: string,
  sourceIndex?: number,
): ActivityDashboardSegment | undefined {
  const geometry = segmentToGeometry(segment, range);
  if (geometry.widthPct <= 0) return undefined;
  return {
    start: segment.start,
    end: segment.end,
    category: segment.category,
    label,
    colorVar: DEFAULT_COLORS[segment.category],
    leftPct: geometry.leftPct,
    widthPct: geometry.widthPct,
    minVisible: geometry.minVisible,
    sourceIndex,
  };
}

function buildDashboardInsights(
  groups: ActivityDashboardGroup[],
  densityBuckets: ActivityDensityBucket[],
): ActivityDashboardInsights {
  const rows = groups.flatMap((group) => group.rows);
  const mostActiveEntity = [...rows].sort(
    (a, b) => b.totalActiveMs - a.totalActiveMs,
  )[0];
  const mostActiveArea = [...groups].sort(
    (a, b) => b.totalActiveMs - a.totalActiveMs,
  )[0];
  const peakBucket = [...densityBuckets].sort(
    (a, b) => b.totalActiveMs - a.totalActiveMs,
  )[0];

  return {
    mostActiveEntity: mostActiveEntity
      ? {
          name: mostActiveEntity.name,
          secondary: mostActiveEntity.secondary,
          totalActiveMs: mostActiveEntity.totalActiveMs,
          eventCount: mostActiveEntity.eventCount,
        }
      : undefined,
    mostActiveArea: mostActiveArea
      ? {
          title: mostActiveArea.title,
          totalActiveMs: mostActiveArea.totalActiveMs,
          eventCount: mostActiveArea.eventCount,
          rowCount: mostActiveArea.rows.length,
        }
      : undefined,
    peakBucketLabel:
      peakBucket && peakBucket.totalActiveMs > 0
        ? `${formatTime(peakBucket.start)} – ${formatTime(peakBucket.end)}`
        : undefined,
    shortUsePattern: rows.length
      ? `${rows.length} רכיבים משמעותיים · ${groups.length} אזורים פעילים`
      : undefined,
  };
}

function rowHasVisibleActivity(row: TimelineRow): boolean {
  return row.segments.some((segment) => segment.active);
}

function isActiveNow(row: TimelineRow): boolean {
  const now = Date.now();
  return row.segments.some(
    (segment) =>
      segment.active &&
      segment.start.getTime() <= now &&
      segment.end.getTime() >= now - 90_000,
  );
}
