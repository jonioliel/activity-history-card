import type { TimeRange, TimelineSegment } from "./types";

export interface SegmentGeometry {
  leftPct: number;
  widthPct: number;
  minVisible: boolean;
}

const MIN_VISIBLE_WIDTH_PCT = 0.5;

export function segmentToGeometry(
  segment: TimelineSegment,
  range: TimeRange,
): SegmentGeometry {
  const rangeStart = range.start.getTime();
  const rangeEnd = range.end.getTime();
  const rangeMs = Math.max(1, rangeEnd - rangeStart);
  const segmentStart = Math.max(segment.start.getTime(), rangeStart);
  const segmentEnd = Math.min(segment.end.getTime(), rangeEnd);
  const clampedStart = Math.min(Math.max(segmentStart, rangeStart), rangeEnd);
  const clampedEnd = Math.min(Math.max(segmentEnd, rangeStart), rangeEnd);
  const durationMs = Math.max(0, clampedEnd - clampedStart);
  const leftPct = clampPercent(((clampedStart - rangeStart) / rangeMs) * 100);
  const widthPct = clampPercent((durationMs / rangeMs) * 100);

  return {
    leftPct,
    widthPct,
    minVisible:
      segment.active && durationMs > 0 && widthPct < MIN_VISIBLE_WIDTH_PCT,
  };
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}
