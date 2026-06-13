import { describe, expect, it } from "vitest";
import {
  getTimelineDensity,
  limitTimelineGroups,
} from "../src/timeline-layout";
import { timeToPercent } from "../src/format";
import type { TimelineGroup, TimelineRow } from "../src/types";

function row(index: number): TimelineRow {
  return {
    entity: {
      entity_id: `switch.test_${index}`,
      name: `בדיקה ${index}`,
      domain: "switch",
      area: "סלון",
      config: { entity: `switch.test_${index}` },
    },
    segments: [],
    totalActiveMs: 0,
    eventCount: 0,
  };
}

function group(id: string, count: number): TimelineGroup {
  const rows = Array.from({ length: count }, (_, index) => row(index));
  return {
    id,
    title: id,
    rows,
    totalActiveMs: 0,
  };
}

describe("timeline layout", () => {
  it("limits visible rows across groups", () => {
    const result = limitTimelineGroups([group("a", 3), group("b", 4)], 5);

    expect(result.totalRowCount).toBe(7);
    expect(result.visibleRowCount).toBe(5);
    expect(result.hiddenRowCount).toBe(2);
    expect(result.groups.map((item) => item.rows.length)).toEqual([3, 2]);
  });

  it("selects dense and ultra-dense modes by row count", () => {
    expect(getTimelineDensity(12)).toBe("normal");
    expect(getTimelineDensity(31)).toBe("dense");
    expect(getTimelineDensity(71)).toBe("ultra-dense");
  });

  it("keeps the time axis chronological left to right", () => {
    const range = {
      start: new Date("2026-01-01T00:00:00.000Z"),
      end: new Date("2026-01-01T02:00:00.000Z"),
    };

    expect(timeToPercent(range.start, range)).toBe(0);
    expect(timeToPercent(new Date("2026-01-01T01:00:00.000Z"), range)).toBe(50);
    expect(timeToPercent(range.end, range)).toBe(100);
  });
});
