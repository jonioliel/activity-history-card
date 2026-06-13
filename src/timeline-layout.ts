import type { TimelineGroup } from "./types";

export type TimelineDensity = "normal" | "dense" | "ultra-dense";

export interface TimelineDisplayGroups {
  groups: TimelineGroup[];
  totalRowCount: number;
  visibleRowCount: number;
  hiddenRowCount: number;
  density: TimelineDensity;
}

export function getTimelineDensity(rowCount: number): TimelineDensity {
  if (rowCount > 70) return "ultra-dense";
  if (rowCount > 30) return "dense";
  return "normal";
}

export function limitTimelineGroups(groups: TimelineGroup[], maxVisibleRows?: number): TimelineDisplayGroups {
  const totalRowCount = groups.reduce((sum, group) => sum + group.rows.length, 0);
  const limit = Number.isFinite(maxVisibleRows) && maxVisibleRows && maxVisibleRows > 0 ? Math.floor(maxVisibleRows) : totalRowCount;
  let remaining = limit;
  const visibleGroups: TimelineGroup[] = [];

  for (const group of groups) {
    if (remaining <= 0) {
      visibleGroups.push({ ...group, rows: [] });
      continue;
    }
    const rows = group.rows.slice(0, remaining);
    remaining -= rows.length;
    visibleGroups.push({ ...group, rows });
  }

  const visibleRowCount = visibleGroups.reduce((sum, group) => sum + group.rows.length, 0);
  return {
    groups: visibleGroups,
    totalRowCount,
    visibleRowCount,
    hiddenRowCount: Math.max(0, totalRowCount - visibleRowCount),
    density: getTimelineDensity(visibleRowCount),
  };
}
