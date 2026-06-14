import { type TemplateResult } from "lit";
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
import type { ActivityHistoryCardConfig, StateCategory } from "../types";
import {
  mockup05VisualModel,
  type Mockup05DensityBucket,
  type Mockup05Group,
  type Mockup05Insight,
  type Mockup05InventoryItem,
  type Mockup05Model,
  type Mockup05Row,
  type Mockup05Segment,
  type Mockup05SegmentTone,
  type Mockup05StateTone,
  type Mockup05SummaryCard,
} from "../mockup05/mockup05-model";
import {
  renderMockup05Dashboard,
  type Mockup05RenderOptions,
} from "./mockup05-layout";
import { buildTimelineAxis } from "./timeline-axis";

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
  onInventoryClose?: () => void;
  onInventoryItemClick?: (event: Event, entityId: string) => void;
  openInventoryGroupId?: string;
}

export function renderActivityDashboard(
  options: ActivityDashboardRendererOptions,
): TemplateResult {
  return renderMockup05Dashboard(
    activityDashboardToMockup05Model(options.model, options.config, options),
    toMockupOptions(options),
  );
}

export function activityDashboardToMockup05Model(
  model: ActivityDashboardModel,
  config: ActivityHistoryCardConfig,
  options: Pick<
    ActivityDashboardRendererOptions,
    "expandedInventoryGroups" | "collapsedInventoryGroups" | "showAllInventory"
  > = {},
): Mockup05Model {
  const axis = buildDashboardAxis(model.range, config);
  const groups = model.groups
    .map((group) => toVisualGroup(group, model, config, options))
    .filter((group): group is Mockup05Group => Boolean(group));
  const summary = toVisualSummary(model);

  return {
    hero: {
      ...mockup05VisualModel.hero,
      subtitle: `Home Assistant · ${rangeLabelFor(model.range)} · ${model.totalInventoryItemCount} רכיבים`,
    },
    toolbar: mockup05VisualModel.toolbar,
    summary,
    rangeLabel: rangeLabelFor(model.range),
    axisLabels: axis.labels,
    nowPercent: axis.nowPercent,
    density: toVisualDensity(model.densityBuckets),
    groups,
    insights: toVisualInsights(model),
  };
}

export function buildDashboardAxis(
  range: { start: Date; end: Date },
  config: ActivityHistoryCardConfig = { type: "custom:activity-history-card" },
  now = new Date(),
): {
  labels: Array<{ label: string; percent: number; major?: boolean }>;
  nowPercent?: number | null;
} {
  const axis = buildTimelineAxis(range, {
    maxMajorTicks: axisMajorTickLimit(config),
    now,
  });

  return {
    labels: axis.ticks.map((tick) => ({
      label: tick.major ? formatDashboardAxisLabel(tick.time, range, now) : "",
      percent: tick.percent,
      major: tick.major,
    })),
    nowPercent: axis.nowPercent ?? null,
  };
}

function toMockupOptions(
  options: ActivityDashboardRendererOptions,
): Mockup05RenderOptions {
  return {
    config: options.config,
    onSegmentClick: options.onSegmentClick,
    onInventoryToggle: options.onInventoryToggle,
    onInventoryClose: options.onInventoryClose,
    onInventoryItemClick: options.onInventoryItemClick,
    openInventoryGroupId: options.openInventoryGroupId,
  };
}

function toVisualSummary(model: ActivityDashboardModel): Mockup05SummaryCard[] {
  const latest = latestSegment(model.groups);
  const latestCaption = latest
    ? [
        categoryLabel(latest.segment.category),
        latest.row.area,
        formatTime(latest.segment.end),
      ]
        .filter(Boolean)
        .join(" · ")
    : "לא נמצאו אירועים";

  return [
    {
      id: "active-now",
      label: "פעילים עכשיו",
      value: String(model.activeNowCount),
      caption: "רכיבים במצב פעיל",
      icon: "mdi:circle-medium",
      tone: model.activeNowCount ? "on" : "idle",
    },
    {
      id: "active-components",
      label: "רכיבים שפעלו",
      value: String(model.visibleRowsCount),
      caption: `מתוך ${model.totalInventoryItemCount || model.totalRowsBeforeCuration} רכיבים שנבחרו`,
      icon: "mdi:toggle-switch-outline",
      tone: "cooling",
    },
    {
      id: "events",
      label: "אירועים",
      value: String(model.visibleEventCount),
      caption: "שינויי מצב פעילים",
      icon: "mdi:timeline-clock-outline",
      tone: "playing",
    },
    {
      id: "component-hours",
      label: "סה״כ שעות־רכיב",
      value: formatDuration(model.totalVisibleActiveMs),
      caption: "סכום פעילות על פני כל הרכיבים",
      icon: "mdi:clock-outline",
      tone: "heating",
    },
    {
      id: "last-event",
      label: "אירוע אחרון",
      value: latest?.row.name ?? "אין",
      caption: latestCaption,
      icon: "mdi:music-note-eighth",
      tone: latest ? categoryToStateTone(latest.segment.category) : "idle",
    },
  ];
}

function toVisualDensity(
  density: ActivityDensityBucket[],
): Mockup05DensityBucket[] {
  if (!density.length) {
    return Array.from({ length: 24 }, (_, index) => ({
      id: `density-${index}`,
      label: `${index}:00`,
      value: "אין פעילות",
      intensity: 0,
      active: false,
    }));
  }

  return density.map((bucket, index) => ({
    id: `density-${index}`,
    label: formatTime(bucket.start),
    value: `${formatDuration(bucket.totalActiveMs)} · ${bucket.activeEntityCount} רכיבים`,
    intensity: bucket.intensity,
    active: bucket.totalActiveMs > 0,
  }));
}

function toVisualGroup(
  group: ActivityDashboardGroup,
  model: ActivityDashboardModel,
  config: ActivityHistoryCardConfig,
  options: Pick<
    ActivityDashboardRendererOptions,
    "expandedInventoryGroups" | "collapsedInventoryGroups" | "showAllInventory"
  >,
): Mockup05Group | undefined {
  const inventoryEnabled =
    config.show_area_inventory !== false &&
    config.area_inventory_mode !== "off";
  const hasActivity = group.activityRows.length > 0;
  const hasInventory = inventoryEnabled && group.inventoryItems.length > 0;

  if (!hasActivity && !hasInventory) return undefined;

  const defaultExpanded =
    config.area_inventory_mode === "expanded" ||
    model.singleAreaFocused ||
    options.showAllInventory === true;
  const expanded =
    options.collapsedInventoryGroups?.has(group.id) === true
      ? false
      : defaultExpanded ||
        options.expandedInventoryGroups?.has(group.id) === true;
  const inventoryItems = hasInventory
    ? group.inventoryItems.map(toVisualInventoryItem)
    : [];
  const previewLimit = inventoryLimit(config);
  const previewCount = expanded
    ? inventoryItems.length
    : Math.min(4, previewLimit, inventoryItems.length);
  const hiddenInventoryCount = Math.max(
    0,
    group.inventoryItemCount - previewCount,
  );

  return {
    id: group.id,
    title: group.title,
    icon: group.icon ?? "mdi:home-outline",
    meta: `${group.inventoryItemCount} רכיבים · ${formatDuration(group.totalActiveMs)}`,
    activityLabel: hasActivity
      ? `${group.visibleActivityRowCount} פעילים · ${group.eventCount} אירועים`
      : "אין פעילות בטווח",
    inventoryLabel: "כל האביזרים",
    aggregateSegments: group.aggregateSegments.map(toVisualSegment),
    rows: group.activityRows.map(toVisualRow),
    inventoryItems,
    inventoryTotal: group.inventoryItemCount,
    hiddenInventoryCount,
    expandedInventory: expanded,
  };
}

function toVisualRow(row: ActivityDashboardRow): Mockup05Row {
  const latest = latestRowSegment(row);
  const stateTone = latest
    ? categoryToStateTone(latest.category)
    : row.activeNow
      ? "on"
      : "idle";

  return {
    id: row.entityId,
    entityId: row.entityId,
    label: row.name,
    secondary: row.secondary,
    state: latest
      ? categoryLabel(latest.category)
      : row.activeNow
        ? "פעיל"
        : "לא פעיל",
    stateTone,
    icon: row.icon ?? fallbackIcon(row.domain),
    totalLabel: formatDuration(row.totalActiveMs),
    eventLabel: `${row.eventCount} אירועים`,
    segments: row.segments.map(toVisualSegment),
  };
}

function toVisualSegment(segment: ActivityDashboardSegment): Mockup05Segment {
  return {
    leftPct: segment.leftPct,
    widthPct: segment.widthPct,
    tone: categoryToSegmentTone(segment.category),
    label: segment.label,
    minVisible: segment.minVisible,
    sourceIndex: segment.sourceIndex,
  };
}

function toVisualInventoryItem(item: AreaInventoryItem): Mockup05InventoryItem {
  return {
    id: item.entityId,
    entityId: item.entityId,
    label: item.name,
    secondary: domainLabel(item.domain),
    state: item.currentStateLabel ?? domainLabel(item.domain),
    stateTone: inventoryTone(item),
    icon: item.icon ?? fallbackIcon(item.domain),
    activeNow: item.activeNow,
    hadActivity: item.hadActivityInRange,
  };
}

function toVisualInsights(model: ActivityDashboardModel): Mockup05Insight[] {
  const mostActiveEntity = model.insights.mostActiveEntity;
  const mostActiveArea = model.insights.mostActiveArea;

  return [
    {
      id: "most-active-entity",
      title: "הרכיב הפעיל ביותר",
      value: mostActiveEntity?.name ?? "אין נתונים",
      caption: mostActiveEntity
        ? `${mostActiveEntity.secondary ?? "רכיב"} · ${formatDuration(mostActiveEntity.totalActiveMs)} · ${mostActiveEntity.eventCount} אירועים`
        : "לא נמצאה פעילות בטווח הנוכחי",
      icon: "mdi:star-four-points",
    },
    {
      id: "most-active-area",
      title: "האזור הפעיל ביותר",
      value: mostActiveArea?.title ?? "אין נתונים",
      caption: mostActiveArea
        ? `${mostActiveArea.rowCount} רכיבים · ${formatDuration(mostActiveArea.totalActiveMs)} · ${mostActiveArea.eventCount} אירועים`
        : "לא נמצאו אזורים פעילים",
      icon: "mdi:home-lightning-bolt-outline",
    },
    {
      id: "peak-hours",
      title: "שעות שיא",
      value: model.insights.peakBucketLabel ?? "אין נתונים",
      caption: "לפי משך פעילות",
      icon: "mdi:chart-bar",
    },
    {
      id: "short-pattern",
      title: "דפוס שימוש קצר",
      value: model.insights.shortUsePattern ?? "אין נתונים",
      caption: model.insights.inventoryPattern ?? "לפי התצוגה הנוכחית",
      icon: "mdi:lightning-bolt-outline",
    },
  ];
}

function latestSegment(
  groups: ActivityDashboardGroup[],
):
  | { row: ActivityDashboardRow; segment: ActivityDashboardSegment }
  | undefined {
  return groups
    .flatMap((group) =>
      group.activityRows.flatMap((row) =>
        row.segments.map((segment) => ({ row, segment })),
      ),
    )
    .sort((a, b) => b.segment.end.getTime() - a.segment.end.getTime())[0];
}

function latestRowSegment(
  row: ActivityDashboardRow,
): ActivityDashboardSegment | undefined {
  return [...row.segments].sort((a, b) => b.end.getTime() - a.end.getTime())[0];
}

function categoryToSegmentTone(category: StateCategory): Mockup05SegmentTone {
  if (category === "cooling") return "cooling";
  if (category === "heating") return "heating";
  if (category === "playing") return "playing";
  if (category === "fan" || category === "drying") return "fan";
  if (category === "opening" || category === "closing") return "open";
  return "on";
}

function categoryToStateTone(category: StateCategory): Mockup05StateTone {
  if (category === "off" || category === "idle") return "idle";
  if (category === "unknown" || category === "unavailable")
    return "unavailable";
  return categoryToSegmentTone(category);
}

function inventoryTone(item: AreaInventoryItem): Mockup05StateTone {
  if (item.stateTone === "unavailable") return "unavailable";
  if (item.currentCategory) return categoryToStateTone(item.currentCategory);
  if (item.activeNow) return "on";
  return item.hadActivityInRange ? "idle" : "idle";
}

function categoryLabel(category: StateCategory): string {
  return CATEGORY_LABELS_HE[category] ?? category;
}

function domainLabel(domain: string): string {
  return DOMAIN_LABELS_HE[domain] ?? domain;
}

function inventoryLimit(config: ActivityHistoryCardConfig): number {
  const configured = config.area_inventory_max_items;
  if (typeof configured === "number" && Number.isFinite(configured)) {
    return Math.max(1, Math.floor(configured));
  }
  return DEFAULT_CONFIG.area_inventory_max_items;
}

function fallbackIcon(domain: string): string {
  if (domain === "light") return "mdi:lightbulb-outline";
  if (domain === "climate") return "mdi:thermostat";
  if (domain === "media_player") return "mdi:music";
  if (domain === "cover") return "mdi:window-shutter";
  if (domain === "fan") return "mdi:fan";
  return "mdi:toggle-switch-outline";
}

function rangeLabelFor(range: { start: Date; end: Date }): string {
  const now = new Date();
  const durationHours = Math.max(
    1,
    Math.round((range.end.getTime() - range.start.getTime()) / 3600000),
  );
  return `${formatDashboardAxisLabel(range.start, range, now)} - ${formatDashboardAxisLabel(range.end, range, now)} · ${durationLabel(durationHours)}`;
}

function rangeLabelForLegacy(range: { start: Date; end: Date }): string {
  const durationHours = Math.max(
    1,
    Math.round((range.end.getTime() - range.start.getTime()) / 3600000),
  );
  const duration =
    durationHours >= 24
      ? `${Math.round(durationHours / 24)} ימים`
      : `${durationHours} שעות`;

  return `${formatTime(range.start)} - ${formatTime(range.end)} · ${duration}`;
}

function buildSixAxisLabels(range: { start: Date; end: Date }): Array<{
  label: string;
  percent: number;
}> {
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();
  const durationMs = Math.max(1, endMs - startMs);

  return Array.from({ length: 6 }, (_, index) => {
    const percent = index * 20;
    const timestamp = startMs + durationMs * (percent / 100);
    return {
      label: formatTime(new Date(timestamp)),
      percent,
    };
  });
}

function durationLabel(durationHours: number): string {
  return durationHours >= 24
    ? `${Math.round(durationHours / 24)} ימים`
    : `${durationHours} שעות`;
}

function axisMajorTickLimit(config: ActivityHistoryCardConfig): number {
  if (
    config.desktop_density === "compact" ||
    config.desktop_density === "ultra_compact"
  ) {
    return 6;
  }
  if (config.timeline_axis_density === "compact") return 6;
  if (config.timeline_axis_density === "comfortable") return 8;
  return 8;
}

function formatDashboardAxisLabel(
  date: Date,
  range: { start: Date; end: Date },
  now: Date,
): string {
  if (sameMinute(date, range.end) && rangeEndsNearNow(range, now)) {
    return "עכשיו";
  }

  const durationHours = Math.max(
    1,
    (range.end.getTime() - range.start.getTime()) / 3600000,
  );
  if (durationHours > 48) {
    return new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  }

  const duplicatedEndpointTime =
    sameClockTime(range.start, range.end) &&
    (sameMinute(date, range.start) || sameMinute(date, range.end));
  if (duplicatedEndpointTime) {
    return new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return formatTime(date);
}

function rangeEndsNearNow(range: { end: Date }, now: Date): boolean {
  return Math.abs(now.getTime() - range.end.getTime()) <= 5 * 60 * 1000;
}

function sameClockTime(a: Date, b: Date): boolean {
  return a.getHours() === b.getHours() && a.getMinutes() === b.getMinutes();
}

function sameMinute(a: Date, b: Date): boolean {
  return Math.abs(a.getTime() - b.getTime()) < 60_000;
}
