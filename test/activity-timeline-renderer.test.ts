import { describe, expect, it } from "vitest";
import { prepareActivityTimeline } from "../src/renderers/activity-timeline-renderer";
import { summarizeActivity } from "../src/summary";
import type { TimeRange, TimelineGroup, TimelineRow } from "../src/types";

const range: TimeRange = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-02T00:00:00.000Z"),
};

function row(entityId: string, activeMs: number): TimelineRow {
  const active = activeMs > 0;
  return {
    entity: {
      entity_id: entityId,
      name: entityId,
      domain: "switch",
      area: "סלון",
    },
    segments: active
      ? [
          {
            entity_id: entityId,
            state: "on",
            category: "on",
            active: true,
            start: new Date("2026-01-01T01:00:00.000Z"),
            end: new Date(
              new Date("2026-01-01T01:00:00.000Z").getTime() + activeMs,
            ),
            durationMs: activeMs,
          },
        ]
      : [],
    totalActiveMs: activeMs,
    eventCount: active ? 1 : 0,
  };
}

function group(id: string, rows: TimelineRow[]): TimelineGroup {
  return {
    id,
    title: id,
    rows,
    totalActiveMs: rows.reduce((sum, item) => sum + item.totalActiveMs, 0),
  };
}

describe("prepareActivityTimeline", () => {
  it("hides empty rows and empty groups in the activity dashboard model", () => {
    const prepared = prepareActivityTimeline(
      [
        group("סלון", [row("switch.active", 60_000), row("switch.empty", 0)]),
        group("ריק", [row("switch.empty_only", 0)]),
      ],
      range,
      { type: "custom:activity-history-card" },
    );

    expect(prepared.groups.map((item) => item.title)).toEqual(["סלון"]);
    expect(prepared.visibleRowCount).toBe(1);
    expect(prepared.hiddenRowCount).toBe(0);
  });

  it("limits visible rows for the default dashboard view", () => {
    const rows = Array.from({ length: 30 }, (_, index) =>
      row(`switch.${index}`, 60_000 + index),
    );
    const prepared = prepareActivityTimeline([group("סלון", rows)], range, {
      type: "custom:activity-history-card",
      max_visible_rows: 24,
    });

    expect(prepared.visibleRowCount).toBe(24);
    expect(prepared.hiddenRowCount).toBe(6);
  });

  it("lets summary metrics match the visible activity rows", () => {
    const rows = Array.from({ length: 30 }, (_, index) =>
      row(`switch.${index}`, 60_000),
    );
    const prepared = prepareActivityTimeline([group("׳¡׳׳•׳", rows)], range, {
      type: "custom:activity-history-card",
      max_visible_rows: 10,
    });

    const visibleSummary = summarizeActivity(prepared.groups);
    const allSummary = summarizeActivity([group("׳¡׳׳•׳", rows)]);

    expect(prepared.visibleRowCount).toBe(10);
    expect(visibleSummary.activeEntityCount).toBe(10);
    expect(allSummary.activeEntityCount).toBe(30);
  });
});
