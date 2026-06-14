import { describe, expect, it } from "vitest";
import { calculateActivityDensity } from "../src/activity-density";
import type { TimeRange, TimelineRow } from "../src/types";

const range: TimeRange = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-02T00:00:00.000Z"),
};

function row(entityId: string, start: string, end: string): TimelineRow {
  return {
    entity: {
      entity_id: entityId,
      name: entityId,
      domain: "switch",
      area: "סלון",
    },
    segments: [
      {
        entity_id: entityId,
        state: "on",
        category: "on",
        active: true,
        start: new Date(start),
        end: new Date(end),
        durationMs: new Date(end).getTime() - new Date(start).getTime(),
      },
    ],
    totalActiveMs: new Date(end).getTime() - new Date(start).getTime(),
    eventCount: 1,
  };
}

describe("calculateActivityDensity", () => {
  it("uses 24 buckets for a 24h range by default", () => {
    const buckets = calculateActivityDensity([], range, {
      type: "custom:activity-history-card",
    });

    expect(buckets).toHaveLength(24);
  });

  it("aggregates active duration and active entity count per bucket", () => {
    const buckets = calculateActivityDensity(
      [
        row(
          "switch.one",
          "2026-01-01T00:00:00.000Z",
          "2026-01-01T01:00:00.000Z",
        ),
        row(
          "switch.two",
          "2026-01-01T00:30:00.000Z",
          "2026-01-01T01:30:00.000Z",
        ),
      ],
      range,
      { type: "custom:activity-history-card" },
    );

    expect(buckets[0]?.totalActiveMs).toBe(90 * 60 * 1000);
    expect(buckets[0]?.activeEntityCount).toBe(2);
    expect(buckets[0]?.intensity).toBe(1);
    expect(buckets[1]?.activeEntityCount).toBe(1);
    expect(buckets.some((bucket) => bucket.intensity > 0)).toBe(true);
  });

  it("uses a denser default for a seven day range", () => {
    const buckets = calculateActivityDensity(
      [],
      {
        start: new Date("2026-01-01T00:00:00.000Z"),
        end: new Date("2026-01-08T00:00:00.000Z"),
      },
      {
        type: "custom:activity-history-card",
      },
    );

    expect(buckets).toHaveLength(84);
  });
});
