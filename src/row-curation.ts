import { DEFAULT_CONFIG } from "./defaults";
import type {
  ActivityHistoryCardConfig,
  FilterState,
  RowCurationDiagnostics,
  RowCurationHiddenReason,
  TimelineRow,
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

const TECHNICAL_PATTERNS = [
  /(^|[\s._-])extra[\s._-]?dry($|[\s._-])/i,
  /(^|[\s._-])half[\s._-]?load($|[\s._-])/i,
  /(^|[\s._-])silence[\s._-]?on[\s._-]?demand($|[\s._-])/i,
  /(^|[\s._-])vario[\s._-]?speed($|[\s._-])/i,
  /(^|[\s._-])program($|[\s._-])/i,
  /(^|[\s._-])remote[\s._-]?start($|[\s._-])/i,
  /(^|[\s._-])child[\s._-]?lock($|[\s._-])/i,
  /(^|[\s._-])power[\s._-]?switch($|[\s._-])/i,
  /(^|[\s._-])firmware($|[\s._-])/i,
  /(^|[\s._-])update($|[\s._-])/i,
  /(^|[\s._-])diagnostic($|[\s._-])/i,
  /(^|[\s._-])battery($|[\s._-])/i,
  /(^|[\s._-])signal($|[\s._-])/i,
  /(^|[\s._-])rssi($|[\s._-])/i,
  /(^|[\s._-])router($|[\s._-])/i,
  /(^|[\s._-])lan($|[\s._-])/i,
  /(^|[\s._-])wlan($|[\s._-])/i,
  /(^|[\s._-])uptime($|[\s._-])/i,
  /(^|[\s._-])connection($|[\s._-])/i,
  /(^|[\s._-])cloud($|[\s._-])/i,
  /(^|[\s._-])bridge($|[\s._-])/i,
  /(^|[\s._-])hub($|[\s._-])/i,
  /(^|[\s._-])option($|[\s._-])/i,
  /(^|[\s._-])setting($|[\s._-])/i,
];

const TECHNICAL_EXACT_NAMES = new Set([
  "extra dry",
  "half load",
  "remote start",
  "child lock",
  "power",
  "program",
]);

export function curateRows(
  rows: TimelineRow[],
  config: ActivityHistoryCardConfig,
  options: CurateRowsOptions = {},
): CuratedRows {
  const showAll = options.showAll === true;
  const smartFilter = config.smart_filter !== false && !showAll;
  const hiddenReasons = new Map<string, RowCurationHiddenReason>();
  const manualEntityIds = explicitEntityIds(config);
  const minActiveMs =
    positiveNumber(config.min_row_active_seconds) ??
    DEFAULT_CONFIG.min_row_active_seconds;
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

    const reason = smartFilter
      ? hiddenReasonForRow(row, config, manual, minActiveMs * 1000)
      : undefined;

    if (reason) {
      hidden.push(row);
      hiddenReasons.set(row.entity.entity_id, reason);
    } else {
      visible.push(row);
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
      showAll,
      manualRowsProtected,
      maxRowsPerGroup,
      maxTotalRows,
    }),
  };
}

export function isTechnicalRow(row: TimelineRow): boolean {
  const haystack = [
    row.entity.entity_id,
    row.entity.name,
    row.entity.device_name,
    row.entity.device_manufacturer,
    row.entity.device_model,
    ...(row.entity.labels ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (TECHNICAL_PATTERNS.some((pattern) => pattern.test(haystack))) {
    return true;
  }

  const normalizedName = normalize(row.entity.name);
  return (
    row.entity.domain === "switch" && TECHNICAL_EXACT_NAMES.has(normalizedName)
  );
}

export function formatCurationSummary(
  diagnostics?: RowCurationDiagnostics,
): string {
  if (!diagnostics || diagnostics.totalRows === diagnostics.visibleRows) {
    return "";
  }

  const parts: string[] = [];
  if (diagnostics.hiddenEmptyRows) {
    parts.push(`${diagnostics.hiddenEmptyRows} ריקות`);
  }
  if (diagnostics.hiddenTechnicalRows) {
    parts.push(`${diagnostics.hiddenTechnicalRows} טכניות`);
  }
  if (diagnostics.hiddenConfigRows || diagnostics.hiddenDiagnosticRows) {
    parts.push(
      `${diagnostics.hiddenConfigRows + diagnostics.hiddenDiagnosticRows} אבחון/הגדרה`,
    );
  }
  if (diagnostics.hiddenMinDurationRows) {
    parts.push(`${diagnostics.hiddenMinDurationRows} קצרות`);
  }
  if (diagnostics.hiddenMaxRows) {
    parts.push(`${diagnostics.hiddenMaxRows} מעבר למגבלה`);
  }

  return `מוצג ${diagnostics.visibleRows} מתוך ${diagnostics.totalRows}${
    parts.length ? ` · הוסתרו ${parts.join(", ")}` : ""
  }`;
}

function hiddenReasonForRow(
  row: TimelineRow,
  config: ActivityHistoryCardConfig,
  manual: boolean,
  minActiveMs: number,
): RowCurationHiddenReason | undefined {
  if (manual) return undefined;
  if (
    row.entity.entity_category === "config" &&
    config.show_config_entities !== true
  ) {
    return "config";
  }
  if (
    row.entity.entity_category === "diagnostic" &&
    config.show_diagnostic_entities !== true
  ) {
    return "diagnostic";
  }
  if (config.show_technical_entities !== true && isTechnicalRow(row)) {
    return "technical";
  }
  if ((config.hide_empty_rows ?? DEFAULT_CONFIG.hide_empty_rows) !== false) {
    if (row.totalActiveMs <= 0) return "empty";
  }
  if (row.totalActiveMs > 0 && row.totalActiveMs < minActiveMs) {
    return "min_duration";
  }
  return undefined;
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
      b.totalActiveMs - a.totalActiveMs ||
      b.eventCount - a.eventCount ||
      Number(isActiveNow(b)) - Number(isActiveNow(a)) ||
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
    hiddenTechnicalRows: counts.technical ?? 0,
    hiddenConfigRows: counts.config ?? 0,
    hiddenDiagnosticRows: counts.diagnostic ?? 0,
    hiddenMinDurationRows: counts.min_duration ?? 0,
    hiddenMaxRows: counts.max_rows ?? 0,
    hiddenByReason: counts,
    smartFilter: input.smartFilter,
    showAll: input.showAll,
    manualRowsProtected: input.manualRowsProtected,
    maxRowsPerGroup: input.maxRowsPerGroup,
    maxTotalRows: input.maxTotalRows,
  };
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
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
