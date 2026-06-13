import { describe, expect, it } from "vitest";
import {
  getHistoryRequestPlan,
  normalizeHistoryResponse,
} from "../src/history-client";
import type { EntityMeta } from "../src/types";

describe("normalizeHistoryResponse", () => {
  it("returns empty history for malformed responses", () => {
    expect(normalizeHistoryResponse(null, ["switch.test"])).toEqual({});
    expect(
      normalizeHistoryResponse({ "switch.test": "bad" }, ["switch.test"]),
    ).toEqual({});
  });

  it("normalizes empty history arrays without throwing", () => {
    expect(normalizeHistoryResponse([[]], ["switch.test"])).toEqual({
      "switch.test": [],
    });
    expect(
      normalizeHistoryResponse({ "switch.test": [] }, ["switch.test"]),
    ).toEqual({ "switch.test": [] });
  });

  it("normalizes compact history records and drops unusable records", () => {
    const result = normalizeHistoryResponse(
      [
        [
          { s: "on", lc: "2026-01-01T00:00:00.000Z" },
          { entity_id: "switch.test", state: "off" },
          {
            entity_id: "switch.test",
            state: "off",
            last_changed: "2026-01-01T01:00:00.000Z",
          },
        ],
      ],
      ["switch.test"],
    );

    expect(result["switch.test"]).toEqual([
      {
        entity_id: "switch.test",
        state: "on",
        last_changed: "2026-01-01T00:00:00.000Z",
      },
      {
        entity_id: "switch.test",
        state: "off",
        last_changed: "2026-01-01T01:00:00.000Z",
      },
    ]);
  });
});

describe("getHistoryRequestPlan", () => {
  it("splits entities that need attributes from minimal history entities", () => {
    const entities: EntityMeta[] = [
      {
        entity_id: "switch.test",
        name: "Switch",
        domain: "switch",
        config: { entity: "switch.test" },
      },
      {
        entity_id: "climate.living_room",
        name: "AC",
        domain: "climate",
        config: { entity: "climate.living_room" },
      },
    ];

    const plan = getHistoryRequestPlan(entities);

    expect(plan.withoutAttributes.map((entity) => entity.entity_id)).toEqual([
      "switch.test",
    ]);
    expect(plan.withAttributes.map((entity) => entity.entity_id)).toEqual([
      "climate.living_room",
    ]);
  });
});
