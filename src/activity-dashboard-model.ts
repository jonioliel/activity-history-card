import {
  calculateActivityDensity,
  type ActivityDensityBucket,
} from "./activity-density";
import {
  classifyEntityVisibility,
  formatCurationSummary,
  isTechnicalRow,
} from "./activity-curation";
import {
  CATEGORY_LABELS_HE,
  DEFAULT_COLORS,
  DEFAULT_CONFIG,
  DOMAIN_LABELS_HE,
} from "./defaults";
import { formatDuration, formatTime } from "./format";
import { summarizeActivity } from "./summary";
import { limitTimelineGroups } from "./timeline-layout";
import { segmentToGeometry } from "./timeline-geometry";
import type {
  ActivityHistoryCardConfig,
  ActivitySummary,
  EntityMeta,
  FilterState,
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
  totalInventoryItemCount: number;
  singleAreaFocused: boolean;
  densityBuckets: ActivityDensityBucket[];
  groups: ActivityDashboardGroup[];
  insights: ActivityDashboardInsights;
}

export interface ActivityDashboardGroup {
  id: string;
  title: string;
  icon?: string;
  area?: string;
  totalEntityCount: number;
  visibleActivityRowCount: number;
  inventoryItemCount: number;
  hiddenRowsCount: number;
  totalActiveMs: number;
  eventCount: number;
  activeNowCount: number;
  aggregateSegments: ActivityDashboardSegment[];
  activityRows: ActivityDashboardRow[];
  inventoryItems: AreaInventoryItem[];
}

export interface AreaInventoryItem {
  entityId: string;
  name: string;
  domain: string;
  area?: string;
  icon?: string;
  currentState?: string;
  currentStateLabel?: string;
  activeNow: boolean;
  hadActivityInRange: boolean;
  totalActiveMs?: number;
  eventCount?: number;
  entityCategory?: "config" | "diagnostic" | null;
  hiddenReason?: string;
  isTechnical?: boolean;
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
    inventoryCount: number;
  };
  peakBucketLabel?: string;
  shortUsePattern?: string;
  inventoryPattern?: string;
}

export interface ActivityDashboardSelection {
  groups: TimelineGroup[];
  totalRowCount: number;
  visibleRowCount: number;
  hiddenRowCount: number;
}

export interface BuildActivityDashboardModelOptions {
  inventoryRows?: TimelineRow[];
  selectedAreas?: string[];
  groupBy?: FilterState["groupBy"];
}

interface InventoryGroup {
  id: string;
  title: string;
  icon?: string;
  area?: string;
  rows: TimelineRow[];
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
  options: BuildActivityDashboardModelOptions = {},
): ActivityDashboardModel {
  const selection = selectActivityDashboardGroups(groups, config);
  const activityRows = selection.groups.flatMap((group) => group.rows);
  const inventoryRows =
    options.inventoryRows ?? groups.flatMap((group) => group.rows);
  const inventoryGroups = buildInventoryGroups(
    inventoryRows,
    config,
    options.groupBy,
  );
  const dashboardGroups = toDashboardGroups(
    groups,
    selection.groups,
    inventoryGroups,
    range,
  );
  const totalRowsBeforeCuration =
    curation?.totalRows ?? selection.totalRowCount;
  const hiddenRowsCount = Math.max(
    0,
    curation?.hiddenRows ?? 0,
    selection.hiddenRowCount,
    totalRowsBeforeCuration - selection.visibleRowCount,
  );
  const densityBuckets = calculateActivityDensity(activityRows, range, config);
  const totalVisibleActiveMs = activityRows.reduce(
    (sum, row) => sum + row.totalActiveMs,
    0,
  );
  const visibleEventCount = activityRows.reduce(
    (sum, row) => sum + row.eventCount,
    0,
  );
  const totalInventoryItemCount = dashboardGroups.reduce(
    (sum, group) => sum + group.inventoryItemCount,
    0,
  );
  const singleAreaFocused =
    options.selectedAreas?.length === 1 ||
    (dashboardGroups.length === 1 && options.groupBy !== "domain");

  return {
    range,
    totalRowsBeforeCuration,
    visibleRowsCount: selection.visibleRowCount,
    hiddenRowsCount,
    hiddenReasonSummary: formatCurationSummary(curation),
    totalVisibleActiveMs,
    visibleEventCount,
    activeNowCount: activityRows.filter(isActiveNow).length,
    totalInventoryItemCount,
    singleAreaFocused,
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
    subtitle: `${group.activityRows.length} רכיבי פעילות`,
    icon: group.icon,
    totalActiveMs: group.totalActiveMs,
    rows: group.activityRows.map((row) => ({
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

function toDashboardGroups(
  sourceGroups: TimelineGroup[],
  selectedGroups: TimelineGroup[],
  inventoryGroups: InventoryGroup[],
  range: TimeRange,
): ActivityDashboardGroup[] {
  const sourceMap = new Map(sourceGroups.map((group) => [group.id, group]));
  const selectedMap = new Map(selectedGroups.map((group) => [group.id, group]));
  const inventoryMap = new Map(
    inventoryGroups.map((group) => [group.id, group]),
  );
  const orderedIds = [
    ...new Set([...selectedMap.keys(), ...inventoryMap.keys()]),
  ]
    .map((id) => {
      const selected = selectedMap.get(id);
      const inventory = inventoryMap.get(id);
      return {
        id,
        totalActiveMs: selected?.totalActiveMs ?? 0,
        activityCount: selected?.rows.length ?? 0,
        inventoryCount: inventory?.rows.length ?? 0,
        title: selected?.title ?? inventory?.title ?? id,
      };
    })
    .filter((item) => item.activityCount > 0 || item.inventoryCount > 0)
    .sort(
      (a, b) =>
        b.totalActiveMs - a.totalActiveMs ||
        b.activityCount - a.activityCount ||
        b.inventoryCount - a.inventoryCount ||
        a.title.localeCompare(b.title, "he"),
    )
    .map((item) => item.id);

  return orderedIds.map((id) =>
    toDashboardGroup(
      selectedMap.get(id),
      sourceMap.get(id),
      inventoryMap.get(id),
      range,
    ),
  );
}

function toDashboardGroup(
  selectedGroup: TimelineGroup | undefined,
  sourceGroup: TimelineGroup | undefined,
  inventoryGroup: InventoryGroup | undefined,
  range: TimeRange,
): ActivityDashboardGroup {
  const group = selectedGroup ?? sourceGroup;
  const activityRows = (selectedGroup?.rows ?? []).map((row) =>
    toDashboardRow(row, range),
  );
  const inventoryItems = (inventoryGroup?.rows ?? [])
    .map(toInventoryItem)
    .sort(sortInventoryItems);
  const eventCount = activityRows.reduce((sum, row) => sum + row.eventCount, 0);
  const activeNowCount = activityRows.filter((row) => row.activeNow).length;
  const sourceActivityCount = sourceGroup?.rows.length ?? activityRows.length;

  return {
    id: selectedGroup?.id ?? inventoryGroup?.id ?? sourceGroup?.id ?? "all",
    title:
      selectedGroup?.title ??
      inventoryGroup?.title ??
      sourceGroup?.title ??
      "כל הרכיבים",
    icon: selectedGroup?.icon ?? inventoryGroup?.icon ?? sourceGroup?.icon,
    area: selectedGroup?.title ?? inventoryGroup?.area ?? sourceGroup?.title,
    totalEntityCount: inventoryItems.length,
    visibleActivityRowCount: activityRows.length,
    inventoryItemCount: inventoryItems.length,
    hiddenRowsCount: Math.max(0, sourceActivityCount - activityRows.length),
    totalActiveMs: activityRows.reduce(
      (sum, row) => sum + row.totalActiveMs,
      0,
    ),
    eventCount,
    activeNowCount,
    aggregateSegments: buildAggregateSegments(
      selectedGroup?.rows ?? [],
      range,
      group?.title ?? inventoryGroup?.title ?? "פעילות",
    ),
    activityRows,
    inventoryItems,
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

function buildInventoryGroups(
  rows: TimelineRow[],
  config: ActivityHistoryCardConfig,
  groupBy: FilterState["groupBy"] = "area",
): InventoryGroup[] {
  const domainFilter = normalizedList(
    config.area_inventory_domains?.length
      ? config.area_inventory_domains
      : config.domains,
  );
  const includeInactive =
    config.area_inventory_include_inactive ??
    DEFAULT_CONFIG.area_inventory_include_inactive;
  const groups = new Map<string, InventoryGroup>();

  for (const row of rows) {
    if (domainFilter.length && !domainFilter.includes(row.entity.domain)) {
      continue;
    }
    if (!includeInactive && row.totalActiveMs <= 0 && !isActiveNow(row)) {
      continue;
    }
    const classification = classifyEntityVisibility(row.entity, config);
    if (!classification.visible) continue;

    const key = inventoryGroupId(row.entity, groupBy);
    const current =
      groups.get(key) ??
      ({
        id: key,
        title: inventoryGroupTitle(row.entity, groupBy),
        icon: inventoryGroupIcon(row.entity, groupBy),
        area: row.entity.area,
        rows: [],
      } satisfies InventoryGroup);
    current.rows.push(row);
    groups.set(key, current);
  }

  return [...groups.values()].map((group) => ({
    ...group,
    rows: [...group.rows].sort(
      (a, b) =>
        Number(isActiveNow(b)) - Number(isActiveNow(a)) ||
        Number(b.totalActiveMs > 0) - Number(a.totalActiveMs > 0) ||
        a.entity.name.localeCompare(b.entity.name, "he"),
    ),
  }));
}

function toInventoryItem(row: TimelineRow): AreaInventoryItem {
  const entityCategory =
    row.entity.entity_category === "config" ||
    row.entity.entity_category === "diagnostic"
      ? row.entity.entity_category
      : null;
  return {
    entityId: row.entity.entity_id,
    name: row.entity.name,
    domain: row.entity.domain,
    area: row.entity.area,
    icon: row.entity.icon,
    currentState: row.currentState,
    currentStateLabel: currentStateLabel(row),
    activeNow: isActiveNow(row),
    hadActivityInRange: row.totalActiveMs > 0,
    totalActiveMs: row.totalActiveMs,
    eventCount: row.eventCount,
    entityCategory,
    isTechnical: isTechnicalRow(row),
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
  const rows = groups.flatMap((group) => group.activityRows);
  const inventoryCount = groups.reduce(
    (sum, group) => sum + group.inventoryItemCount,
    0,
  );
  const activeInventoryCount = groups.reduce(
    (sum, group) =>
      sum + group.inventoryItems.filter((item) => item.activeNow).length,
    0,
  );
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
    mostActiveArea:
      mostActiveArea && mostActiveArea.totalActiveMs > 0
        ? {
            title: mostActiveArea.title,
            totalActiveMs: mostActiveArea.totalActiveMs,
            eventCount: mostActiveArea.eventCount,
            rowCount: mostActiveArea.activityRows.length,
            inventoryCount: mostActiveArea.inventoryItemCount,
          }
        : undefined,
    peakBucketLabel:
      peakBucket && peakBucket.totalActiveMs > 0
        ? `${formatTime(peakBucket.start)} - ${formatTime(peakBucket.end)}`
        : undefined,
    shortUsePattern: rows.length
      ? `${rows.length} רכיבי פעילות · ${groups.length} אזורים`
      : undefined,
    inventoryPattern: inventoryCount
      ? `${inventoryCount} אביזרים במלאי · ${activeInventoryCount} פעילים עכשיו`
      : undefined,
  };
}

function sortInventoryItems(
  a: AreaInventoryItem,
  b: AreaInventoryItem,
): number {
  return (
    Number(b.activeNow) - Number(a.activeNow) ||
    Number(b.hadActivityInRange) - Number(a.hadActivityInRange) ||
    domainLabel(a.domain).localeCompare(domainLabel(b.domain), "he") ||
    a.name.localeCompare(b.name, "he")
  );
}

function inventoryGroupId(
  entity: EntityMeta,
  groupBy: FilterState["groupBy"],
): string {
  if (groupBy === "domain") return entity.domain || "other";
  if (groupBy === "none" || groupBy === "entity") return "all";
  return entity.area || "ללא אזור";
}

function inventoryGroupTitle(
  entity: EntityMeta,
  groupBy: FilterState["groupBy"],
): string {
  if (groupBy === "domain") return domainLabel(entity.domain);
  if (groupBy === "none" || groupBy === "entity") return "כל הרכיבים";
  return entity.area || "ללא אזור";
}

function inventoryGroupIcon(
  entity: EntityMeta,
  groupBy: FilterState["groupBy"],
): string | undefined {
  if (groupBy === "domain") return fallbackIcon(entity.domain);
  return undefined;
}

function currentStateLabel(row: TimelineRow): string | undefined {
  if (row.currentCategory) return CATEGORY_LABELS_HE[row.currentCategory];
  if (row.currentState) return row.currentState;
  if (row.totalActiveMs > 0) return "היתה פעילות";
  return "לא פעיל";
}

function domainLabel(domain: string): string {
  return DOMAIN_LABELS_HE[domain] ?? domain;
}

function normalizedList(value: string[] | undefined): string[] {
  return (value ?? [])
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.toLowerCase());
}

function fallbackIcon(domain: string): string {
  if (domain === "light") return "mdi:lightbulb-outline";
  if (domain === "climate") return "mdi:thermostat";
  if (domain === "media_player") return "mdi:music";
  if (domain === "cover") return "mdi:window-shutter";
  if (domain === "fan") return "mdi:fan";
  return "mdi:toggle-switch-outline";
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
