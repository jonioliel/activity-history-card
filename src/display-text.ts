import { CATEGORY_LABELS_HE, DOMAIN_LABELS_HE } from "./defaults";
import { formatDuration, formatTime } from "./format";
import type { TimelineRow, TimelineSegment } from "./types";

export function formatEntityLine(
  row: TimelineRow | undefined,
  debug = false,
): string {
  if (!row) return "אין מספיק נתונים";
  return [
    row.entity.area,
    DOMAIN_LABELS_HE[row.entity.domain] ?? row.entity.domain,
    debug ? row.entity.entity_id : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatSegmentSummary(
  row: TimelineRow,
  segment: TimelineSegment,
  debug = false,
): Array<[string, string]> {
  const values: Array<[string, string]> = [
    ["רכיב", row.entity.name],
    ["אזור", row.entity.area ?? "ללא אזור"],
    ["סוג", DOMAIN_LABELS_HE[row.entity.domain] ?? row.entity.domain],
    ["מצב", CATEGORY_LABELS_HE[segment.category] ?? segment.state],
    ["התחלה", formatTime(segment.start)],
    ["סיום", formatTime(segment.end)],
    ["משך", formatDuration(segment.durationMs)],
  ];
  if (debug) values.push(["entity_id", row.entity.entity_id]);
  return values;
}
