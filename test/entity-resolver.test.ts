import { describe, expect, it } from "vitest";
import {
  resolveEntityMetas,
  resolveEntityMetasWithDiagnostics,
} from "../src/entity-resolver";
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
      "binary_sensor.motion": {
        entity_id: "binary_sensor.motion",
        state: "on",
        attributes: { friendly_name: "תנועה" },
        last_changed: "2026-01-01T00:00:00.000Z",
        last_updated: "2026-01-01T00:00:00.000Z",
      },
      "lock.front_door": {
        entity_id: "lock.front_door",
        state: "unlocked",
        attributes: { friendly_name: "דלת כניסה" },
        last_changed: "2026-01-01T00:00:00.000Z",
        last_updated: "2026-01-01T00:00:00.000Z",
      },
      "switch.config_mode": {
        entity_id: "switch.config_mode",
        state: "off",
        attributes: { friendly_name: "מצב הגדרה" },
        last_changed: "2026-01-01T00:00:00.000Z",
        last_updated: "2026-01-01T00:00:00.000Z",
      },
      "switch.diagnostic_mode": {
        entity_id: "switch.diagnostic_mode",
        state: "off",
        attributes: { friendly_name: "מצב אבחון" },
        last_changed: "2026-01-01T00:00:00.000Z",
        last_updated: "2026-01-01T00:00:00.000Z",
      },
    },
    callWS: async <T = unknown>({
      type,
    }: Record<string, unknown>): Promise<T> => {
      let result: unknown = [];
      if (type === "config/area_registry/list") {
        result = [{ area_id: "kitchen", name: "מטבח" }];
      }
      if (type === "config/device_registry/list") {
        result = [
          { id: "device-light", area_id: "kitchen", labels: [] },
          { id: "device-safe", area_id: "kitchen", labels: ["protected"] },
          { id: "device-sensor", area_id: "kitchen", labels: [] },
          { id: "device-motion", area_id: "kitchen", labels: [] },
          { id: "device-lock", area_id: "kitchen", labels: [] },
          { id: "device-config", area_id: "kitchen", labels: [] },
          { id: "device-diagnostic", area_id: "kitchen", labels: [] },
        ];
      }
      if (type === "config/entity_registry/list") {
        result = [
          {
            entity_id: "light.kitchen",
            device_id: "device-light",
            labels: ["show"],
          },
          { entity_id: "switch.safe", device_id: "device-safe", labels: [] },
          {
            entity_id: "sensor.temperature",
            device_id: "device-sensor",
            labels: [],
          },
          {
            entity_id: "binary_sensor.motion",
            device_id: "device-motion",
            labels: [],
          },
          {
            entity_id: "lock.front_door",
            device_id: "device-lock",
            labels: [],
          },
          {
            entity_id: "switch.config_mode",
            device_id: "device-config",
            labels: [],
            entity_category: "config",
          },
          {
            entity_id: "switch.diagnostic_mode",
            device_id: "device-diagnostic",
            labels: [],
            entity_category: "diagnostic",
          },
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
    const rows = await resolveEntityMetas(
      { type: "custom:activity-history-card", auto_discover: false },
      makeHass(),
    );

    expect(rows).toEqual([]);
  });

  it("does not generate mock entities when mock_data is false", async () => {
    const rows = await resolveEntityMetas(
      { type: "custom:activity-history-card", mock_data: false },
      undefined,
    );

    expect(rows).toEqual([]);
  });

  it("discovers area-assigned supported entities and skips default sensor noise", async () => {
    const rows = await resolveEntityMetas(
      { type: "custom:activity-history-card", auto_discover: true },
      makeHass(),
    );
    expect(rows.map((row) => row.entity_id)).toEqual([
      "light.kitchen",
      "switch.safe",
    ]);
    expect(rows[0]?.area).toBe("מטבח");
  });

  it("allows noisy domains only when domains are explicitly configured", async () => {
    const rows = await resolveEntityMetas(
      {
        type: "custom:activity-history-card",
        auto_discover: true,
        domains: ["binary_sensor", "lock"],
      },
      makeHass(),
    );

    expect(rows.map((row) => row.entity_id)).toEqual([
      "binary_sensor.motion",
      "lock.front_door",
    ]);
  });

  it("skips config and diagnostic registry entities unless configured", async () => {
    const defaultRows = await resolveEntityMetas(
      { type: "custom:activity-history-card", auto_discover: true },
      makeHass(),
    );
    expect(defaultRows.map((row) => row.entity_id)).not.toContain(
      "switch.config_mode",
    );
    expect(defaultRows.map((row) => row.entity_id)).not.toContain(
      "switch.diagnostic_mode",
    );

    const expandedRows = await resolveEntityMetas(
      {
        type: "custom:activity-history-card",
        auto_discover: true,
        show_config_entities: true,
        show_diagnostic_entities: true,
      },
      makeHass(),
    );
    expect(expandedRows.map((row) => row.entity_id)).toEqual([
      "light.kitchen",
      "switch.safe",
      "switch.config_mode",
      "switch.diagnostic_mode",
    ]);
  });

  it("keeps explicitly configured config entities available for manual views", async () => {
    const rows = await resolveEntityMetas(
      {
        type: "custom:activity-history-card",
        auto_discover: false,
        entities: ["switch.config_mode"],
      },
      makeHass(),
    );

    expect(rows.map((row) => row.entity_id)).toEqual(["switch.config_mode"]);
    expect(rows[0]?.entity_category).toBe("config");
  });

  it("supports include and exclude entity globs", async () => {
    const rows = await resolveEntityMetas(
      {
        type: "custom:activity-history-card",
        auto_discover: true,
        include_entity_globs: ["*.kitchen", "switch.*"],
        exclude_entity_globs: ["switch.safe"],
      },
      makeHass(),
    );

    expect(rows.map((row) => row.entity_id)).toEqual(["light.kitchen"]);
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

  it("adds device context to generic switch names from the registry", async () => {
    const hass: HomeAssistant = {
      states: {
        "switch.dishwasher_power": {
          entity_id: "switch.dishwasher_power",
          state: "on",
          attributes: { friendly_name: "Power" },
          last_changed: "2026-01-01T00:00:00.000Z",
          last_updated: "2026-01-01T00:00:00.000Z",
        },
        "switch.blank_name": {
          entity_id: "switch.blank_name",
          state: "off",
          attributes: { friendly_name: "" },
          last_changed: "2026-01-01T00:00:00.000Z",
          last_updated: "2026-01-01T00:00:00.000Z",
        },
      },
      callWS: async <T = unknown>({
        type,
      }: Record<string, unknown>): Promise<T> => {
        let result: unknown = [];
        if (type === "config/area_registry/list")
          result = [{ area_id: "kitchen", name: "מטבח" }];
        if (type === "config/device_registry/list") {
          result = [
            { id: "dishwasher", area_id: "kitchen", name_by_user: "מדיח כלים" },
            { id: "blank-device", area_id: "kitchen", name: "מכונת כביסה" },
          ];
        }
        if (type === "config/entity_registry/list") {
          result = [
            {
              entity_id: "switch.dishwasher_power",
              device_id: "dishwasher",
              name: "",
              original_name: "Power",
            },
            {
              entity_id: "switch.blank_name",
              device_id: "blank-device",
              name: "",
              original_name: "",
            },
          ];
        }
        return result as T;
      },
      connection: {
        subscribeMessage: async () => () => undefined,
      },
    };

    const rows = await resolveEntityMetas(
      { type: "custom:activity-history-card", auto_discover: true },
      hass,
    );

    expect(
      rows.find((row) => row.entity_id === "switch.dishwasher_power")?.name,
    ).toBe("מדיח כלים - Power");
    expect(
      rows.find((row) => row.entity_id === "switch.blank_name")?.name,
    ).toBe("מכונת כביסה - blank name");
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

    expect(entities.map((row) => row.entity_id)).toEqual([
      "light.attribute_area",
    ]);
    expect(diagnostics.fallbackUsed).toBe(true);
    expect(diagnostics.unavailableReasons).toContain(
      "area_registry_unavailable",
    );
    expect(diagnostics.unavailableReasons).toContain(
      "entity_registry_unavailable",
    );
  });
});
