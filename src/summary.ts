import type { ActivitySummary, TimelineGroup, TimelineRow } from "./types";

export function summarizeActivity(groups: TimelineGroup[]): ActivitySummary {
  const rows = groups.flatMap((group) => group.rows);
  const activeSegments = rows.flatMap((row) =>
    row.segments.filter((segment) => segment.active),
  );
  const totalActiveMs = activeSegments.reduce(
    (sum, segment) => sum + segment.durationMs,
    0,
  );
  const activeRows = rows.filter((row) => row.totalActiveMs > 0);
  const eventCount = activeSegments.length;
  const now = Date.now();
  const activeNowCount = rows.filter((row) =>
    row.segments.some(
      (segment) =>
        segment.active &&
        segment.start.getTime() <= now &&
        segment.end.getTime() >= now - 90000,
    ),
  ).length;
  const lastEvent = [...activeSegments].sort(
    (a, b) => b.start.getTime() - a.start.getTime(),
  )[0];
  const lastEventRow = lastEvent
    ? rows.find((row) => row.entity.entity_id === lastEvent.entity_id)
    : undefined;
  const mostActiveEntity = [...activeRows].sort(
    (a, b) => b.totalActiveMs - a.totalActiveMs,
  )[0];
  const mostActiveArea = [...groups]
    .filter((group) => group.totalActiveMs > 0)
    .sort((a, b) => b.totalActiveMs - a.totalActiveMs)[0];

  return {
    totalActiveMs,
    activeEntityCount: activeRows.length,
    eventCount,
    activeNowCount,
    lastEvent,
    lastEventRow,
    mostActiveEntity,
    mostActiveArea,
    peakBucketLabel: estimatePeakBucketLabel(activeSegments),
  };
}

function estimatePeakBucketLabel(
  segments: { start: Date; durationMs: number }[],
): string | undefined {
  if (!segments.length) return undefined;
  const buckets = new Array<number>(24).fill(0);
  for (const segment of segments) {
    const hour = segment.start.getHours();
    buckets[hour] = (buckets[hour] ?? 0) + segment.durationMs;
  }
  const max = Math.max(...buckets);
  const hour = buckets.indexOf(max);
  if (hour < 0) return undefined;
  return `${String(hour).padStart(2, "0")}:00 – ${String((hour + 1) % 24).padStart(2, "0")}:00`;
}
