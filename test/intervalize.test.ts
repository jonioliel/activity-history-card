import { describe, expect, it } from "vitest";
import { filterRows } from "../src/filters";
import { intervalizeHistory } from "../src/intervalize";
import type { EntityMeta, HistoryStateRecord, TimeRange } from "../src/types";

const entity: EntityMeta = {
  entity_id: "switch.test",
  name: "בדיקה",
  domain: "switch",
  area: "סלון",
  config: { entity: "switch.test" },
};

const range: TimeRange = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-01T02:00:00.000Z"),
};

describe("intervalizeHistory", () => {
  it("creates active segments from state changes", () => {
    const history: Record<string, HistoryStateRecord[]> = {
      "switch.test": [
        { entity_id: "switch.test", state: "off", last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "switch.test", state: "on", last_changed: "2026-01-01T00:30:00.000Z" },
        { entity_id: "switch.test", state: "off", last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [entity], range, { type: "custom:activity-history-card" });
    expect(row?.segments.some((segment) => segment.active)).toBe(true);
    expect(row?.totalActiveMs).toBe(30 * 60 * 1000);
  });

  it("uses the current hass state when recorder history is empty", () => {
    const [row] = intervalizeHistory(
      {},
      [entity],
      range,
      { type: "custom:activity-history-card" },
      {
        "switch.test": {
          entity_id: "switch.test",
          state: "on",
          attributes: {},
          last_changed: "2025-12-31T22:00:00.000Z",
          last_updated: "2025-12-31T22:00:00.000Z",
        },
      },
    );

    expect(row?.segments).toHaveLength(1);
    expect(row?.totalActiveMs).toBe(2 * 60 * 60 * 1000);
  });

  it("returns an empty row safely when there is no history and no current state", () => {
    const [row] = intervalizeHistory({}, [entity], range, { type: "custom:activity-history-card" });

    expect(row?.segments).toHaveLength(0);
    expect(row?.totalActiveMs).toBe(0);
    expect(row?.eventCount).toBe(0);
  });

  it("classifies unknown and unavailable states as inactive unknown segments", () => {
    const history: Record<string, HistoryStateRecord[]> = {
      "switch.test": [
        { entity_id: "switch.test", state: "unknown", last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "switch.test", state: "unavailable", last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [entity], range, { type: "custom:activity-history-card" });

    expect(row?.segments.every((segment) => segment.category === "unknown" && !segment.active)).toBe(true);
    expect(row?.totalActiveMs).toBe(0);
  });

  it("deduplicates duplicate state records", () => {
    const history: Record<string, HistoryStateRecord[]> = {
      "switch.test": [
        { entity_id: "switch.test", state: "on", last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "switch.test", state: "on", last_changed: "2026-01-01T00:10:00.000Z" },
        { entity_id: "switch.test", state: "off", last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [entity], range, { type: "custom:activity-history-card" });

    expect(row?.segments.filter((segment) => segment.active)).toHaveLength(1);
    expect(row?.totalActiveMs).toBe(60 * 60 * 1000);
  });

  it("drops active segments shorter than min_duration_seconds", () => {
    const history: Record<string, HistoryStateRecord[]> = {
      "switch.test": [
        { entity_id: "switch.test", state: "on", last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "switch.test", state: "off", last_changed: "2026-01-01T00:00:10.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [entity], range, { type: "custom:activity-history-card", min_duration_seconds: 20 });

    expect(row?.segments.some((segment) => segment.active)).toBe(false);
    expect(row?.totalActiveMs).toBe(0);
  });

  it("merges adjacent same-state segments after attribute-only changes", () => {
    const mediaEntity: EntityMeta = {
      entity_id: "media_player.test",
      name: "מוזיקה",
      domain: "media_player",
      area: "סלון",
      config: { entity: "media_player.test" },
    };
    const history: Record<string, HistoryStateRecord[]> = {
      "media_player.test": [
        { entity_id: "media_player.test", state: "playing", attributes: { media_title: "A" }, last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "media_player.test", state: "playing", attributes: { media_title: "B" }, last_changed: "2026-01-01T00:30:00.000Z" },
        { entity_id: "media_player.test", state: "idle", last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [mediaEntity], range, { type: "custom:activity-history-card", merge_gap_seconds: 0 });

    expect(row?.segments.filter((segment) => segment.active)).toHaveLength(1);
    expect(row?.totalActiveMs).toBe(60 * 60 * 1000);
  });

  it("does not count cover open as active by default", () => {
    const coverEntity: EntityMeta = {
      entity_id: "cover.test",
      name: "תריס",
      domain: "cover",
      area: "סלון",
      config: { entity: "cover.test" },
    };
    const history: Record<string, HistoryStateRecord[]> = {
      "cover.test": [
        { entity_id: "cover.test", state: "open", last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "cover.test", state: "closing", last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [coverEntity], range, { type: "custom:activity-history-card" });

    expect(row?.segments.find((segment) => segment.state === "open")?.active).toBe(false);
    expect(row?.segments.find((segment) => segment.state === "closing")?.active).toBe(true);
  });

  it("allows cover open as active when overridden per entity", () => {
    const coverEntity: EntityMeta = {
      entity_id: "cover.test",
      name: "תריס",
      domain: "cover",
      area: "סלון",
      config: { entity: "cover.test", active_states: ["open"] },
    };
    const history: Record<string, HistoryStateRecord[]> = {
      "cover.test": [{ entity_id: "cover.test", state: "open", last_changed: "2026-01-01T00:00:00.000Z" }],
    };

    const [row] = intervalizeHistory(history, [coverEntity], range, { type: "custom:activity-history-card" });

    expect(row?.segments[0]?.active).toBe(true);
  });

  it("uses climate hvac_action before falling back to climate state", () => {
    const climateEntity: EntityMeta = {
      entity_id: "climate.test",
      name: "מזגן",
      domain: "climate",
      area: "סלון",
      config: { entity: "climate.test" },
    };
    const history: Record<string, HistoryStateRecord[]> = {
      "climate.test": [
        { entity_id: "climate.test", state: "cool", attributes: { hvac_action: "idle" }, last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "climate.test", state: "cool", attributes: { hvac_action: "cooling" }, last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [climateEntity], range, { type: "custom:activity-history-card" });

    expect(row?.segments[0]?.active).toBe(false);
    expect(row?.segments[1]?.active).toBe(true);
  });

  it("filters rows by area, domain, search and active-only mode", () => {
    const history: Record<string, HistoryStateRecord[]> = {
      "switch.test": [
        { entity_id: "switch.test", state: "on", last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "switch.test", state: "off", last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };
    const rows = intervalizeHistory(history, [entity], range, { type: "custom:activity-history-card" });

    const filtered = filterRows(rows, {
      search: "בדיקה",
      areas: ["סלון"],
      domains: ["switch"],
      stateMode: "active_only",
      groupBy: "area",
      timePreset: "24h",
    });

    expect(filtered).toHaveLength(1);
  });
});
