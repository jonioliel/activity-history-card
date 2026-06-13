import { DEFAULT_CONFIG } from "./defaults";
import type {
  ActivityHistoryCardConfig,
  ActivityMode,
  EntityMeta,
  FilterState,
  RowCurationDiagnostics,
  RowCurationHiddenReason,
  StateCategory,
  TimelineRow,
  TimelineSegment,
} from "./types";

export interface CurateRowsOptions {
  showAll?: boolean;
  groupBy?: FilterState["groupBy"];
}

export interface CuratedRows {
  rows: TimelineRow[];
  hiddenRows: TimelineRow[];
  hiddenReasons: Map<string, RowCurationHiddenReason>;
  diagnostics: RowCurationDiagnostics;
}

export interface EntityVisibilityClassification {
  visible: boolean;
  reason?:
    | "hidden"
    | "disabled"
    | "config"
    | "diagnostic"
    | "technical"
    | "noisy_name";
  confidence: "registry" | "heuristic" | "explicit";
}

const NOISY_NAME_TERMS = [
  "extra dry",
  "half load",
  "silence on demand",
  "vario speed",
  "program",
  "progress",
  "finish",
  "remote start",
  "child lock",
  "power switch",
  "option",
  "setting",
  "config",
  "diagnostic",
  "firmware",
  "update",
  "battery",
  "signal",
  "rssi",
  "router",
  "lan",
  "wlan",
  "uptime",
  "connection",
  "cloud",
  "bridge",
  "hub",
  "תוכנית",
  "תכנית",
  "מצב תוכנית",
  "מצב תכנית",
  "התקדמות",
  "סיום",
  "שטיפה",
  "ייבוש",
  "חצי כמות",
  "מהירות",
  "שקט",
  "נעילה",
  "נעילת ילדים",
  "הגדרה",
  "אפשרות",
  "אבחון",
  "עדכון",
  "סוללה",
  "אות",
  "ראוטר",
  "רשת",
  "חיבור",
  "ענן",
  "גשר",
  "רכזת",
];

const TECHNICAL_TERMS = [
  "firmware",
  "update",
  "battery",
  "signal",
  "rssi",
  "router",
  "lan",
  "wlan",
  "uptime",
  "connection",
  "cloud",
  "bridge",
  "hub",
  "diagnostic",
  "אבחון",
  "עדכון",
  "סוללה",
  "אות",
  "ראוטר",
  "רשת",
  "חיבור",
  "ענן",
  "גשר",
  "רכזת",
];

const TECHNICAL_EXACT_SWITCH_NAMES = new Set([
  "power",
  "program",
  "extra dry",
  "half load",
  "remote start",
  "child lock",
  "נעילת ילדים",
  "חצי כמות",
]);

const INACTIVE_CATEGORIES = new Set<StateCategory>([
  "off",
  "idle",
  "unknown",
  "unavailable",
]);

export function curateRows(
  rows: TimelineRow[],
  config: ActivityHistoryCardConfig,
  options: CurateRowsOptions = {},
): CuratedRows {
  const showAll = options.showAll === true || config.activity_mode === "all";
  const activityMode = resolveActivityMode(config, showAll);
  const smartFilter =
    config.smart_filter !== false && activityMode === "meaningful" && !showAll;
  const showInactiveBaselines =
    config.show_inactive_baselines ?? DEFAULT_CONFIG.show_inactive_baselines;
  const hiddenReasons = new Map<string, RowCurationHiddenReason>();
  const manualEntityIds = explicitEntityIds(config);
  const minActiveMs =
    (positiveNumber(config.min_row_active_seconds) ??
      DEFAULT_CONFIG.min_row_active_seconds) * 1000;
  const maxRowsPerGroup =
    positiveInteger(config.max_rows_per_group) ??
    DEFAULT_CONFIG.max_rows_per_group;
  const maxTotalRows =
    positiveInteger(config.max_total_rows) ?? DEFAULT_CONFIG.max_total_rows;
  let manualRowsProtected = 0;

  const visible: TimelineRow[] = [];
  const hidden: TimelineRow[] = [];

  for (const row of rows) {
    const manual = manualEntityIds.has(row.entity.entity_id);
    if (manual) manualRowsProtected += 1;

    const decision = smartFilter
      ? curateMeaningfulRow(row, config, minActiveMs, manual)
      : { row };

    if (decision.reason) {
      hidden.push(row);
      hiddenReasons.set(row.entity.entity_id, decision.reason);
    } else if (decision.row) {
      visible.push(decision.row);
    }
  }

  const capped = smartFilter
    ? applyRowCaps(visible, hidden, hiddenReasons, {
        groupBy: options.groupBy ?? "area",
        manualEntityIds,
        maxRowsPerGroup,
        maxTotalRows,
      })
    : { rows: visible, hiddenRows: hidden };

  return {
    rows: capped.rows,
    hiddenRows: capped.hiddenRows,
    hiddenReasons,
    diagnostics: buildDiagnostics({
      totalRows: rows.length,
      visibleRows: capped.rows.length,
      hiddenRows: capped.hiddenRows.length,
      hiddenReasons,
      smartFilter,
      activityMode,
      showInactiveBaselines,
      showAll,
      manualRowsProtected,
      maxRowsPerGroup,
      maxTotalRows,
    }),
  };
}

export function classifyEntityVisibility(
  entity: EntityMeta,
  config: ActivityHistoryCardConfig,
): EntityVisibilityClassification {
  if (explicitEntityIds(config).has(entity.entity_id)) {
    return { visible: true, confidence: "explicit" };
  }

  if (entity.hidden_by) {
    return { visible: false, reason: "hidden", confidence: "registry" };
  }
  if (entity.disabled_by) {
    return { visible: false, reason: "disabled", confidence: "registry" };
  }
  if (
    entity.entity_category === "config" &&
    config.show_config_entities !== true
  ) {
    return { visible: false, reason: "config", confidence: "registry" };
  }
  if (
    entity.entity_category === "diagnostic" &&
    config.show_diagnostic_entities !== true
  ) {
    return { visible: false, reason: "diagnostic", confidence: "registry" };
  }

  if (config.show_technical_entities !== true) {
    const noisyName = isNoisyName(entity);
    if (isTechnicalEntity(entity)) {
      return { visible: false, reason: "technical", confidence: "heuristic" };
    }
    if (noisyName) {
      return { visible: false, reason: "noisy_name", confidence: "heuristic" };
    }
  }

  return { visible: true, confidence: "heuristic" };
}

export function isTechnicalRow(row: TimelineRow): boolean {
  return (
    isTechnicalEntity(row.entity) ||
    (row.entity.domain === "switch" && isNoisyName(row.entity))
  );
}

export function meaningfulSegments(
  row: TimelineRow,
  minActiveMs: number,
): TimelineSegment[] {
  return row.segments.filter(
    (segment) =>
      isMeaningfulSegment(segment) && segment.durationMs >= minActiveMs,
  );
}

export function formatCurationSummary(
  diagnostics?: RowCurationDiagnostics,
): string {
  if (!diagnostics) return "";
  if (diagnostics.showAll) {
    return "מצב הצגת הכל פעיל";
  }
  if (diagnostics.totalRows === diagnostics.visibleRows) {
    return "";
  }

  const parts: string[] = [];
  if (diagnostics.hiddenNoMeaningfulRows) {
    parts.push(`${diagnostics.hiddenNoMeaningfulRows} ללא פעילות`);
  }
  if (diagnostics.hiddenTooShortRows) {
    parts.push(`${diagnostics.hiddenTooShortRows} קצרות מדי`);
  }
  if (diagnostics.hiddenTechnicalRows || diagnostics.hiddenNoisyNameRows) {
    parts.push(
      `${
        diagnostics.hiddenTechnicalRows + diagnostics.hiddenNoisyNameRows
      } טכניות`,
    );
  }
  if (diagnostics.hiddenConfigRows || diagnostics.hiddenDiagnosticRows) {
    parts.push(
      `${diagnostics.hiddenConfigRows + diagnostics.hiddenDiagnosticRows} אבחון/הגדרה`,
    );
  }
  if (diagnostics.hiddenMaxRows) {
    parts.push(`${diagnostics.hiddenMaxRows} מעבר למגבלה`);
  }

  return `מציג ${diagnostics.visibleRows} רכיבים פעילים מתוך ${diagnostics.totalRows}${
    parts.length ? ` · הוסתרו ${parts.join(", ")}` : ""
  }`;
}

function curateMeaningfulRow(
  row: TimelineRow,
  config: ActivityHistoryCardConfig,
  minActiveMs: number,
  manual: boolean,
): { row?: TimelineRow; reason?: RowCurationHiddenReason } {
  const classification = classifyEntityVisibility(row.entity, config);
  if (!manual && !classification.visible) {
    return { reason: classification.reason ?? "technical" };
  }

  const segments = meaningfulSegments(row, minActiveMs);
  if (segments.length) {
    return { row: rewriteRowWithSegments(row, segments) };
  }

  if (manual) {
    return { row };
  }

  if ((config.hide_empty_rows ?? DEFAULT_CONFIG.hide_empty_rows) === false) {
    return { row };
  }

  if (!row.segments.length) {
    return { reason: "empty" };
  }

  const hadMeaningfulButTooShort = row.segments.some(
    (segment) =>
      isMeaningfulSegment(segment) && segment.durationMs < minActiveMs,
  );
  return {
    reason: hadMeaningfulButTooShort ? "too_short" : "no_meaningful_activity",
  };
}

function rewriteRowWithSegments(
  row: TimelineRow,
  segments: TimelineSegment[],
): TimelineRow {
  const totalActiveMs = segments.reduce(
    (sum, segment) => sum + segment.durationMs,
    0,
  );
  const currentCategory = row.currentCategory;
  return {
    ...row,
    segments,
    totalActiveMs,
    eventCount: segments.length,
    currentCategory:
      currentCategory && !INACTIVE_CATEGORIES.has(currentCategory)
        ? currentCategory
        : undefined,
  };
}

function isMeaningfulSegment(segment: TimelineSegment): boolean {
  return segment.active && !INACTIVE_CATEGORIES.has(segment.category);
}

function applyRowCaps(
  visibleRows: TimelineRow[],
  hiddenRows: TimelineRow[],
  hiddenReasons: Map<string, RowCurationHiddenReason>,
  options: {
    groupBy: FilterState["groupBy"];
    manualEntityIds: Set<string>;
    maxRowsPerGroup: number;
    maxTotalRows: number;
  },
): { rows: TimelineRow[]; hiddenRows: TimelineRow[] } {
  const manuallySelected = visibleRows.filter((row) =>
    options.manualEntityIds.has(row.entity.entity_id),
  );
  const automaticRows = visibleRows.filter(
    (row) => !options.manualEntityIds.has(row.entity.entity_id),
  );
  const grouped = new Map<string, TimelineRow[]>();

  for (const row of sortRowsByUsefulness(automaticRows)) {
    const key = groupKey(row, options.groupBy);
    const current = grouped.get(key) ?? [];
    if (current.length >= options.maxRowsPerGroup) {
      hiddenRows.push(row);
      hiddenReasons.set(row.entity.entity_id, "max_rows");
      continue;
    }
    current.push(row);
    grouped.set(key, current);
  }

  const cappedAutomatic = [...grouped.values()].flat();
  const protectedIds = new Set(
    manuallySelected.map((row) => row.entity.entity_id),
  );
  const candidates = [
    ...sortRowsByUsefulness(manuallySelected),
    ...sortRowsByUsefulness(cappedAutomatic),
  ];
  const capped: TimelineRow[] = [];

  for (const row of candidates) {
    const protectedManual = protectedIds.has(row.entity.entity_id);
    if (!protectedManual && capped.length >= options.maxTotalRows) {
      hiddenRows.push(row);
      hiddenReasons.set(row.entity.entity_id, "max_rows");
      continue;
    }
    capped.push(row);
  }

  return { rows: capped, hiddenRows };
}

function sortRowsByUsefulness(rows: TimelineRow[]): TimelineRow[] {
  return [...rows].sort(
    (a, b) =>
      Number(isActiveNow(b)) - Number(isActiveNow(a)) ||
      b.totalActiveMs - a.totalActiveMs ||
      b.eventCount - a.eventCount ||
      a.entity.name.localeCompare(b.entity.name, "he"),
  );
}

function isActiveNow(row: TimelineRow): boolean {
  const now = Date.now();
  return row.segments.some(
    (segment) =>
      segment.active &&
      segment.start.getTime() <= now &&
      segment.end.getTime() >= now - 90000,
  );
}

function groupKey(row: TimelineRow, groupBy: FilterState["groupBy"]): string {
  if (groupBy === "domain") return row.entity.domain || "other";
  if (groupBy === "none" || groupBy === "entity") return "all";
  return row.entity.area || "ללא אזור";
}

function buildDiagnostics(input: {
  totalRows: number;
  visibleRows: number;
  hiddenRows: number;
  hiddenReasons: Map<string, RowCurationHiddenReason>;
  smartFilter: boolean;
  activityMode: ActivityMode;
  showInactiveBaselines: boolean;
  showAll: boolean;
  manualRowsProtected: number;
  maxRowsPerGroup: number;
  maxTotalRows: number;
}): RowCurationDiagnostics {
  const counts: Partial<Record<RowCurationHiddenReason, number>> = {};
  for (const reason of input.hiddenReasons.values()) {
    counts[reason] = (counts[reason] ?? 0) + 1;
  }
  return {
    totalRows: input.totalRows,
    visibleRows: input.visibleRows,
    hiddenRows: input.hiddenRows,
    hiddenEmptyRows: counts.empty ?? 0,
    hiddenNoMeaningfulRows: counts.no_meaningful_activity ?? 0,
    hiddenTooShortRows: counts.too_short ?? 0,
    hiddenTechnicalRows: counts.technical ?? 0,
    hiddenNoisyNameRows: counts.noisy_name ?? 0,
    hiddenConfigRows: counts.config ?? 0,
    hiddenDiagnosticRows: counts.diagnostic ?? 0,
    hiddenHiddenRows: counts.hidden ?? 0,
    hiddenDisabledRows: counts.disabled ?? 0,
    hiddenMinDurationRows: counts.too_short ?? 0,
    hiddenMaxRows: counts.max_rows ?? 0,
    hiddenByReason: counts,
    smartFilter: input.smartFilter,
    activityMode: input.activityMode,
    showInactiveBaselines: input.showInactiveBaselines,
    showAll: input.showAll,
    manualRowsProtected: input.manualRowsProtected,
    maxRowsPerGroup: input.maxRowsPerGroup,
    maxTotalRows: input.maxTotalRows,
  };
}

function isTechnicalEntity(entity: EntityMeta): boolean {
  const haystack = normalizedHaystack(entity, true);
  return TECHNICAL_TERMS.some((term) => includesTerm(haystack, term));
}

function isNoisyName(entity: EntityMeta): boolean {
  const name = normalize(entity.name);
  const entityId = normalize(entity.entity_id);
  const haystack = `${name} ${entityId}`;
  if (entity.domain === "switch" && TECHNICAL_EXACT_SWITCH_NAMES.has(name)) {
    return true;
  }
  return NOISY_NAME_TERMS.some((term) => includesTerm(haystack, term));
}

function normalizedHaystack(entity: EntityMeta, includeDevice = false): string {
  return [
    entity.entity_id,
    entity.name,
    includeDevice ? entity.device_name : undefined,
    includeDevice ? entity.device_manufacturer : undefined,
    includeDevice ? entity.device_model : undefined,
    ...(entity.labels ?? []),
  ]
    .filter(Boolean)
    .map((value) => normalize(String(value)))
    .join(" ");
}

function includesTerm(haystack: string, term: string): boolean {
  const normalizedTerm = normalize(term);
  if (!normalizedTerm) return false;
  if (/^[a-z0-9 ]+$/i.test(normalizedTerm)) {
    const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\s)${escaped}(\\s|$)`, "i").test(haystack);
  }
  return haystack.includes(normalizedTerm);
}

function resolveActivityMode(
  config: ActivityHistoryCardConfig,
  showAll: boolean,
): ActivityMode {
  if (showAll) return "all";
  return config.activity_mode ?? DEFAULT_CONFIG.activity_mode;
}

function explicitEntityIds(config: ActivityHistoryCardConfig): Set<string> {
  return new Set(
    (config.entities ?? []).map((entry) =>
      typeof entry === "string" ? entry : entry.entity,
    ),
  );
}

function positiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function positiveInteger(value: unknown): number | undefined {
  const number = positiveNumber(value);
  return number ? Math.floor(number) : undefined;
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_./-]+/g, " ")
    .replace(/\s+/g, " ");
}
