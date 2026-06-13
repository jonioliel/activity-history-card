import { DEFAULT_CONFIG } from "./defaults";
import type {
  ActivityHistoryCardConfig,
  TimeRange,
  TimelineRow,
  TimelineSegment,
} from "./types";

export interface ActivityDensityBucket {
  start: Date;
  end: Date;
  totalActiveMs: number;
  eventCount: number;
  activeEntityCount: number;
  intensity: number;
}

export function calculateActivityDensity(
  rows: TimelineRow[],
  range: TimeRange,
  config: ActivityHistoryCardConfig,
): ActivityDensityBucket[] {
  const bucketCount = resolveActivityDensityBucketCount(range, config);
  const buckets = createBuckets(range, bucketCount);
  const entityIdsByBucket = buckets.map(() => new Set<string>());

  for (const row of rows) {
    for (const segment of row.segments) {
      if (!segment.active) continue;
      for (let index = 0; index < buckets.length; index += 1) {
        const bucket = buckets[index];
        if (!bucket) continue;
        const overlapMs = overlapDurationMs(segment, bucket.start, bucket.end);
        if (overlapMs <= 0) continue;
        bucket.totalActiveMs += overlapMs;
        bucket.eventCount += segmentStartsInsideBucket(segment, bucket) ? 1 : 0;
        entityIdsByBucket[index]?.add(row.entity.entity_id);
      }
    }
  }

  const maxActiveMs = Math.max(
    1,
    ...buckets.map((bucket) => bucket.totalActiveMs),
  );
  return buckets.map((bucket, index) => ({
    ...bucket,
    activeEntityCount: entityIdsByBucket[index]?.size ?? 0,
    intensity: bucket.totalActiveMs / maxActiveMs,
  }));
}

export function resolveActivityDensityBucketCount(
  range: TimeRange,
  config: ActivityHistoryCardConfig,
): number {
  const configured = config.activity_density_buckets;
  if (
    typeof configured === "number" &&
    Number.isFinite(configured) &&
    configured > 0
  ) {
    return Math.max(1, Math.floor(configured));
  }

  const hours = Math.max(
    1,
    (range.end.getTime() - range.start.getTime()) / 3600000,
  );
  if (hours <= 30) return DEFAULT_CONFIG.activity_density_buckets || 24;
  if (hours <= 24 * 3) return 48;
  return 84;
}

function createBuckets(
  range: TimeRange,
  bucketCount: number,
): ActivityDensityBucket[] {
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();
  const rangeMs = Math.max(1, endMs - startMs);
  const bucketMs = rangeMs / bucketCount;
  return Array.from({ length: bucketCount }, (_, index) => {
    const start = startMs + index * bucketMs;
    const end = index === bucketCount - 1 ? endMs : start + bucketMs;
    return {
      start: new Date(start),
      end: new Date(end),
      totalActiveMs: 0,
      eventCount: 0,
      activeEntityCount: 0,
      intensity: 0,
    };
  });
}

function overlapDurationMs(
  segment: TimelineSegment,
  bucketStart: Date,
  bucketEnd: Date,
): number {
  const start = Math.max(segment.start.getTime(), bucketStart.getTime());
  const end = Math.min(segment.end.getTime(), bucketEnd.getTime());
  return Math.max(0, end - start);
}

function segmentStartsInsideBucket(
  segment: TimelineSegment,
  bucket: ActivityDensityBucket,
): boolean {
  const start = segment.start.getTime();
  return start >= bucket.start.getTime() && start < bucket.end.getTime();
}
