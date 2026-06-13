import { describe, expect, it } from "vitest";
import { resolveEntityMetas, resolveEntityMetasWithDiagnostics } from "../src/entity-resolver";
import type { HomeAssistant } from "../src/types";

function makeHass(): HomeAssistant {
  return {
    states: {
      "light.kitchen": {
        entity_id: "light.kitchen",
        state: "on",
        attributes: { friendly_name: "תאורת מטבח" },
        last_changed: "2026-01-01T00:00:00.000Z",
        last_updated: "2026-01-01T00:00:00.000Z",
      },
      "switch.safe": {
        entity_id: "switch.safe",
        state: "on",
        attributes: { friendly_name: "רכיב מוגן" },
        last_changed: "2026-01-01T00:00:00.000Z",
        last_updated: "2026-01-01T00:00:00.000Z",
      },
      "sensor.temperature": {
        entity_id: "sensor.temperature",
        state: "22",
        attributes: { friendly_name: "טמפרטורה" },
        last_changed: "2026-01-01T00:00:00.000Z",
        last_updated: "2026-01-01T00:00:00.000Z",
      },
    },
    callWS: async <T = unknown>({ type }: Record<string, unknown>): Promise<T> => {
      let result: unknown = [];
      if (type === "config/area_registry/list") {
        result = [{ area_id: "kitchen", name: "מטבח" }];
      }
      if (type === "config/device_registry/list") {
        result = [
          { id: "device-light", area_id: "kitchen", labels: [] },
          { id: "device-safe", area_id: "kitchen", labels: ["protected"] },
          { id: "device-sensor", area_id: "kitchen", labels: [] },
        ];
      }
      if (type === "config/entity_registry/list") {
        result = [
          { entity_id: "light.kitchen", device_id: "device-light", labels: ["show"] },
          { entity_id: "switch.safe", device_id: "device-safe", labels: [] },
          { entity_id: "sensor.temperature", device_id: "device-sensor", labels: [] },
        ];
      }
      if (type === "config/label_registry/list") {
        result = [
          { label_id: "show", name: "להצגה" },
          { label_id: "protected", name: "רכיבים מוגנים" },
        ];
      }
      return result as T;
    },
    connection: {
      subscribeMessage: async () => () => undefined,
    },
  };
}

describe("resolveEntityMetas", () => {
  it("does not auto-discover entities when auto_discover is false", async () => {
    const rows = await resolveEntityMetas({ type: "custom:activity-history-card", auto_discover: false }, makeHass());

    expect(rows).toEqual([]);
  });

  it("does not generate mock entities when mock_data is false", async () => {
    const rows = await resolveEntityMetas({ type: "custom:activity-history-card", mock_data: false }, undefined);

    expect(rows).toEqual([]);
  });

  it("discovers area-assigned supported entities and skips default sensor noise", async () => {
    const rows = await resolveEntityMetas({ type: "custom:activity-history-card", auto_discover: true }, makeHass());
    expect(rows.map((row) => row.entity_id)).toEqual(["light.kitchen", "switch.safe"]);
    expect(rows[0]?.area).toBe("מטבח");
  });

  it("excludes entities by label display name or id", async () => {
    const rows = await resolveEntityMetas(
      {
        type: "custom:activity-history-card",
        auto_discover: true,
        exclude_labels: ["רכיבים מוגנים"],
      },
      makeHass(),
    );

    expect(rows.map((row) => row.entity_id)).toEqual(["light.kitchen"]);
  });

  it("supports include labels for showing only selected groups", async () => {
    const rows = await resolveEntityMetas(
      {
        type: "custom:activity-history-card",
        auto_discover: true,
        include_labels: ["להצגה"],
      },
      makeHass(),
    );

    expect(rows.map((row) => row.entity_id)).toEqual(["light.kitchen"]);
  });

  it("reports registry fallback when Home Assistant registries are unavailable", async () => {
    const hass: HomeAssistant = {
      states: {
        "light.attribute_area": {
          entity_id: "light.attribute_area",
          state: "on",
          attributes: { friendly_name: "תאורה", area: "מטבח" },
          last_changed: "2026-01-01T00:00:00.000Z",
          last_updated: "2026-01-01T00:00:00.000Z",
        },
      },
      callWS: async () => {
        throw new Error("Registry unavailable");
      },
      connection: {
        subscribeMessage: async () => () => undefined,
      },
    };

    const { entities, diagnostics } = await resolveEntityMetasWithDiagnostics(
      { type: "custom:activity-history-card", auto_discover: true },
      hass,
    );

    expect(entities.map((row) => row.entity_id)).toEqual(["light.attribute_area"]);
    expect(diagnostics.fallbackUsed).toBe(true);
    expect(diagnostics.unavailableReasons).toContain("area_registry_unavailable");
    expect(diagnostics.unavailableReasons).toContain("entity_registry_unavailable");
  });
});
