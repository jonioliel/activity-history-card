import { describe, expect, it } from "vitest";
import { groupRows } from "../src/filters";
import type { TimelineRow } from "../src/types";

function row(entityId: string, area: string, totalActiveMs: number, eventCount = totalActiveMs > 0 ? 1 : 0): TimelineRow {
  return {
    entity: {
      entity_id: entityId,
      name: entityId,
      domain: entityId.split(".")[0] ?? "switch",
      area,
      config: { entity: entityId },
    },
    segments: [],
    totalActiveMs,
    eventCount,
    currentCategory: totalActiveMs > 0 ? "on" : "off",
  };
}

describe("groupRows", () => {
  it("orders active groups and active rows first", () => {
    const groups = groupRows(
      [
        row("switch.inactive", "סלון", 0),
        row("switch.active", "סלון", 30_000),
        row("light.kitchen", "מטבח", 120_000),
      ],
      "area",
    );

    expect(groups.map((group) => group.title)).toEqual(["מטבח", "סלון"]);
    expect(groups[1]?.rows.map((item) => item.entity.entity_id)).toEqual(["switch.active", "switch.inactive"]);
  });
});
