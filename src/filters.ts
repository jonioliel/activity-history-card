import type { FilterState, TimelineGroup, TimelineRow } from "./types";
import { DOMAIN_LABELS_HE } from "./defaults";

export function filterRows(rows: TimelineRow[], filter: FilterState): TimelineRow[] {
  const search = filter.search.trim().toLowerCase();
  return rows.filter((row) => {
    const { entity } = row;
    if (filter.areas.length && (!entity.area || !filter.areas.includes(entity.area))) return false;
    if (filter.domains.length && !filter.domains.includes(entity.domain)) return false;
    if (search) {
      const haystack = [entity.entity_id, entity.name, entity.area, entity.domain].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filter.stateMode === "active_only" && row.totalActiveMs <= 0) return false;
    if (filter.stateMode === "currently_active") {
      const now = Date.now();
      if (!row.segments.some((segment) => segment.active && segment.start.getTime() <= now && segment.end.getTime() >= now - 90000)) return false;
    }
    return true;
  });
}

export function groupRows(rows: TimelineRow[], groupBy: FilterState["groupBy"]): TimelineGroup[] {
  if (groupBy === "none" || groupBy === "entity") {
    return [toGroup("all", "כל הרכיבים", rows)];
  }

  const groups = new Map<string, TimelineRow[]>();
  for (const row of rows) {
    const key = groupBy === "area" ? row.entity.area || "ללא אזור" : row.entity.domain || "other";
    const current = groups.get(key) ?? [];
    current.push(row);
    groups.set(key, current);
  }

  return [...groups.entries()]
    .map(([key, groupRowsValue]) => toGroup(key, groupBy === "domain" ? DOMAIN_LABELS_HE[key] ?? key : key, groupRowsValue))
    .sort((a, b) => b.totalActiveMs - a.totalActiveMs || b.rows.length - a.rows.length || a.title.localeCompare(b.title, "he"));
}

function toGroup(id: string, title: string, rows: TimelineRow[]): TimelineGroup {
  const sortedRows = [...rows].sort(
    (a, b) =>
      b.totalActiveMs - a.totalActiveMs ||
      b.eventCount - a.eventCount ||
      Number(Boolean(b.currentCategory && b.currentCategory !== "off" && b.currentCategory !== "unknown")) -
        Number(Boolean(a.currentCategory && a.currentCategory !== "off" && a.currentCategory !== "unknown")) ||
      a.entity.name.localeCompare(b.entity.name, "he"),
  );
  const totalActiveMs = sortedRows.reduce((sum, row) => sum + row.totalActiveMs, 0);
  return {
    id,
    title,
    subtitle: `${sortedRows.length} רכיבים`,
    rows: sortedRows,
    totalActiveMs,
  };
}
