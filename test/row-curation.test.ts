import { describe, expect, it } from "vitest";
import { curateRows, isTechnicalRow } from "../src/row-curation";
import type { ActivityHistoryCardConfig, TimelineRow } from "../src/types";

function row(
  entityId: string,
  options: {
    name?: string;
    area?: string;
    totalActiveMs?: number;
    entityCategory?: string;
    deviceName?: string;
  } = {},
): TimelineRow {
  const totalActiveMs = options.totalActiveMs ?? 60_000;
  const active = totalActiveMs > 0;
  return {
    entity: {
      entity_id: entityId,
      name: options.name ?? entityId,
      domain: entityId.split(".")[0] ?? "switch",
      area: options.area ?? "Kitchen",
      entity_category: options.entityCategory,
      device_name: options.deviceName,
      config: { entity: entityId },
    },
    segments: active
      ? [
          {
            entity_id: entityId,
            state: "on",
            category: "on",
            active: true,
            start: new Date("2026-01-01T00:00:00.000Z"),
            end: new Date(1_767_225_600_000 + totalActiveMs),
            durationMs: totalActiveMs,
          },
        ]
      : [],
    totalActiveMs,
    eventCount: active ? 1 : 0,
    currentCategory: active ? "on" : "off",
  };
}

function config(
  overrides: Partial<ActivityHistoryCardConfig> = {},
): ActivityHistoryCardConfig {
  return {
    type: "custom:activity-history-card",
    ...overrides,
  };
}

describe("curateRows", () => {
  it("hides empty rows by default", () => {
    const result = curateRows(
      [row("switch.active"), row("switch.empty", { totalActiveMs: 0 })],
      config(),
    );

    expect(result.rows.map((item) => item.entity.entity_id)).toEqual([
      "switch.active",
    ]);
    expect(result.diagnostics.hiddenEmptyRows).toBe(1);
  });

  it("hides activity below min_row_active_seconds", () => {
    const result = curateRows(
      [row("switch.short", { totalActiveMs: 10_000 })],
      config({ min_row_active_seconds: 30 }),
    );

    expect(result.rows).toEqual([]);
    expect(result.diagnostics.hiddenMinDurationRows).toBe(1);
  });

  it("does not hide explicitly configured entities", () => {
    const result = curateRows(
      [row("switch.router_lan0", { name: "Router LAN0", totalActiveMs: 0 })],
      config({ entities: ["switch.router_lan0"] }),
    );

    expect(result.rows.map((item) => item.entity.entity_id)).toEqual([
      "switch.router_lan0",
    ]);
    expect(result.diagnostics.manualRowsProtected).toBe(1);
    expect(result.diagnostics.hiddenRows).toBe(0);
  });

  it("hides config, diagnostic and technical rows by default", () => {
    const result = curateRows(
      [
        row("switch.real_light", { name: "Real light" }),
        row("switch.option_extra_dry", { name: "Extra dry" }),
        row("switch.config_mode", { entityCategory: "config" }),
        row("sensor.router_uptime", { entityCategory: "diagnostic" }),
      ],
      config(),
    );

    expect(result.rows.map((item) => item.entity.entity_id)).toEqual([
      "switch.real_light",
    ]);
    expect(result.diagnostics.hiddenTechnicalRows).toBe(1);
    expect(result.diagnostics.hiddenConfigRows).toBe(1);
    expect(result.diagnostics.hiddenDiagnosticRows).toBe(1);
  });

  it("can show technical rows when configured", () => {
    const result = curateRows(
      [row("switch.router_lan0", { name: "Ruijie router LAN0" })],
      config({ show_technical_entities: true }),
    );

    expect(result.rows).toHaveLength(1);
  });

  it("applies per-group and total row limits to automatic rows", () => {
    const result = curateRows(
      [
        row("switch.a1", { area: "A", totalActiveMs: 60_000 }),
        row("switch.a2", { area: "A", totalActiveMs: 50_000 }),
        row("switch.b1", { area: "B", totalActiveMs: 40_000 }),
        row("switch.b2", { area: "B", totalActiveMs: 30_000 }),
      ],
      config({ max_rows_per_group: 1, max_total_rows: 2 }),
      { groupBy: "area" },
    );

    expect(result.rows.map((item) => item.entity.entity_id).sort()).toEqual([
      "switch.a1",
      "switch.b1",
    ]);
    expect(result.diagnostics.hiddenMaxRows).toBe(2);
  });

  it("showAll disables smart filtering for the current render", () => {
    const result = curateRows(
      [row("switch.empty", { totalActiveMs: 0 })],
      config(),
      { showAll: true },
    );

    expect(result.rows).toHaveLength(1);
    expect(result.diagnostics.showAll).toBe(true);
    expect(result.diagnostics.smartFilter).toBe(false);
  });
});

describe("isTechnicalRow", () => {
  it("detects noisy router and option rows", () => {
    expect(
      isTechnicalRow(row("switch.ruijie_router_lan0", { name: "LAN0" })),
    ).toBe(true);
    expect(
      isTechnicalRow(row("switch.dishwasher", { name: "Dishwasher" })),
    ).toBe(false);
  });
});
