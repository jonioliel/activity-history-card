import { describe, expect, it } from "vitest";
import { formatEntityLine, formatSegmentSummary } from "../src/display-text";
import type { TimelineRow, TimelineSegment } from "../src/types";

const row: TimelineRow = {
  entity: {
    entity_id: "switch.raw_router_id",
    name: "נתב סלון",
    domain: "switch",
    area: "סלון",
    config: { entity: "switch.raw_router_id" },
  },
  segments: [],
  totalActiveMs: 0,
  eventCount: 0,
};

const segment: TimelineSegment = {
  entity_id: "switch.raw_router_id",
  state: "on",
  category: "on",
  active: true,
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-01T01:00:00.000Z"),
  durationMs: 60 * 60 * 1000,
};

describe("display text", () => {
  it("does not include raw entity ids unless debug is enabled", () => {
    expect(formatEntityLine(row, false)).not.toContain("switch.raw_router_id");
    expect(formatEntityLine(row, true)).toContain("switch.raw_router_id");

    const withoutDebug = formatSegmentSummary(row, segment, false).flat().join(" ");
    const withDebug = formatSegmentSummary(row, segment, true).flat().join(" ");
    expect(withoutDebug).not.toContain("switch.raw_router_id");
    expect(withDebug).toContain("switch.raw_router_id");
  });
});
