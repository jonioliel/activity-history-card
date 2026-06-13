import { describe, expect, it } from "vitest";
import { summarizeActivity } from "../src/summary";
import type { TimelineGroup, TimelineRow } from "../src/types";

function row(entityId: string, name: string, totalActiveMs: number, start: string): TimelineRow {
  return {
    entity: {
      entity_id: entityId,
      name,
      domain: "switch",
      area: "סלון",
      config: { entity: entityId },
    },
    totalActiveMs,
    eventCount: totalActiveMs > 0 ? 1 : 0,
    currentState: "off",
    currentCategory: "off",
    segments:
      totalActiveMs > 0
        ? [
            {
              entity_id: entityId,
              state: "on",
              category: "on",
              active: true,
              start: new Date(start),
              end: new Date(new Date(start).getTime() + totalActiveMs),
              durationMs: totalActiveMs,
            },
          ]
        : [],
  };
}

describe("summarizeActivity", () => {
  it("uses friendly row names for last event and most active entity", () => {
    const rows = [
      row("switch.router_raw", "נתב סלון", 0, "2026-01-01T00:00:00.000Z"),
      row("switch.coffee", "מכונת קפה", 30 * 60 * 1000, "2026-01-01T01:00:00.000Z"),
    ];
    const group: TimelineGroup = {
      id: "living",
      title: "סלון",
      rows,
      totalActiveMs: rows.reduce((sum, item) => sum + item.totalActiveMs, 0),
    };

    const summary = summarizeActivity([group]);

    expect(summary.activeEntityCount).toBe(1);
    expect(summary.lastEventRow?.entity.name).toBe("מכונת קפה");
    expect(summary.mostActiveEntity?.entity.name).toBe("מכונת קפה");
  });
});
