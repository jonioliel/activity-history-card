import { describe, expect, it } from "vitest";
import {
  classifyEntityVisibility,
  curateRows,
  isTechnicalRow,
} from "../src/activity-curation";
import type {
  ActivityHistoryCardConfig,
  TimelineRow,
  TimelineSegment,
} from "../src/types";

function row(
  entityId: string,
  options: {
    name?: string;
    area?: string;
    totalActiveMs?: number;
    entityCategory?: string;
    deviceName?: string;
    hiddenBy?: string;
    disabledBy?: string;
    segments?: TimelineSegment[];
  } = {},
): TimelineRow {
  const totalActiveMs = options.totalActiveMs ?? 60_000;
  const active = totalActiveMs > 0;
  const segments =
    options.segments ??
    (active
      ? [
          {
            entity_id: entityId,
            state: "on",
            category: "on",
            active: true,
            start: new Date("2026-01-01T00:00:00.000Z"),
            end: new Date(1_767_225_600_000 + totalActiveMs),
            durationMs: totalActiveMs,
          } satisfies TimelineSegment,
        ]
      : []);
  return {
    entity: {
      entity_id: entityId,
      name: options.name ?? entityId,
      domain: entityId.split(".")[0] ?? "switch",
      area: options.area ?? "Kitchen",
      entity_category: options.entityCategory,
      device_name: options.deviceName,
      hidden_by: options.hiddenBy,
      disabled_by: options.disabledBy,
      config: { entity: entityId },
    },
    segments,
    totalActiveMs,
    eventCount: segments.length,
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
    expect(result.diagnostics.hiddenNoisyNameRows).toBe(1);
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

  it("rewrites visible rows to meaningful active segments only", () => {
    const offSegment: TimelineSegment = {
      entity_id: "switch.kettle",
      state: "off",
      category: "off",
      active: false,
      start: new Date("2026-01-01T00:00:00.000Z"),
      end: new Date("2026-01-01T01:00:00.000Z"),
      durationMs: 3_600_000,
    };
    const activeSegment: TimelineSegment = {
      entity_id: "switch.kettle",
      state: "on",
      category: "on",
      active: true,
      start: new Date("2026-01-01T01:00:00.000Z"),
      end: new Date("2026-01-01T01:10:00.000Z"),
      durationMs: 600_000,
    };

    const result = curateRows(
      [
        row("switch.kettle", {
          totalActiveMs: 600_000,
          segments: [offSegment, activeSegment],
        }),
      ],
      config(),
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.segments).toEqual([activeSegment]);
    expect(result.rows[0]?.totalActiveMs).toBe(600_000);
  });

  it("hides rows that only contain inactive baselines", () => {
    const result = curateRows(
      [
        row("switch.baseline", {
          totalActiveMs: 0,
          segments: [
            {
              entity_id: "switch.baseline",
              state: "off",
              category: "off",
              active: false,
              start: new Date("2026-01-01T00:00:00.000Z"),
              end: new Date("2026-01-02T00:00:00.000Z"),
              durationMs: 86_400_000,
            },
          ],
        }),
      ],
      config(),
    );

    expect(result.rows).toEqual([]);
    expect(result.diagnostics.hiddenNoMeaningfulRows).toBe(1);
  });

  it("detects noisy Hebrew labels and registry hidden entities", () => {
    const result = curateRows(
      [
        row("switch.washer_half_load", { name: "חצי כמות" }),
        row("switch.hidden", { hiddenBy: "user" }),
        row("switch.disabled", { disabledBy: "integration" }),
      ],
      config(),
    );

    expect(result.rows).toEqual([]);
    expect(result.diagnostics.hiddenNoisyNameRows).toBe(1);
    expect(result.diagnostics.hiddenHiddenRows).toBe(1);
    expect(result.diagnostics.hiddenDisabledRows).toBe(1);
  });

  it("activity_mode all disables smart filtering", () => {
    const result = curateRows(
      [row("switch.empty", { totalActiveMs: 0 })],
      config({ activity_mode: "all" }),
    );

    expect(result.rows).toHaveLength(1);
    expect(result.diagnostics.activityMode).toBe("all");
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

describe("classifyEntityVisibility", () => {
  it("returns explicit confidence for configured entities", () => {
    const item = row("switch.router_lan0", { name: "Router LAN0" }).entity;

    expect(
      classifyEntityVisibility(
        item,
        config({ entities: ["switch.router_lan0"] }),
      ),
    ).toEqual({ visible: true, confidence: "explicit" });
  });
});
