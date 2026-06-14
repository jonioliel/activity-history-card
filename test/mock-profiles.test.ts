import { describe, expect, it } from "vitest";
import { buildActivityDashboardModel } from "../src/activity-dashboard-model";
import { groupRows } from "../src/filters";
import { intervalizeHistory } from "../src/intervalize";
import { getMockEntities, getMockHistory } from "../src/mock-data";
import type { ActivityHistoryCardConfig, TimeRange } from "../src/types";

const range: TimeRange = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-02T00:00:00.000Z"),
};

const config: ActivityHistoryCardConfig = {
  type: "custom:activity-history-card",
  mock_data: true,
  view_mode: "activity",
  max_total_rows: 18,
  max_visible_rows: 18,
};

describe("mock profiles", () => {
  it("mockup05_visual is static-layout only and does not generate mock entities", () => {
    expect(getMockEntities("mockup05_visual")).toEqual([]);
    expect(getMockHistory(range, "mockup05_visual")).toEqual({});
  });

  it("area_inventory keeps normal accessories in inventory without activity", () => {
    const entities = getMockEntities("area_inventory");
    const rows = intervalizeHistory(
      getMockHistory(range, "area_inventory"),
      entities,
      range,
      config,
      {},
    );
    const model = buildActivityDashboardModel(
      groupRows(
        rows.filter((row) => row.totalActiveMs > 0),
        "area",
      ),
      range,
      config,
      undefined,
      { inventoryRows: rows, groupBy: "area" },
    );

    const inventoryNames = model.groups.flatMap((group) =>
      group.inventoryItems.map((item) => item.name),
    );
    expect(inventoryNames).toContain("מדיח כלים");
    expect(inventoryNames).toContain("שקע שירות");
    expect(model.groups.some((group) => group.title === "בריכה")).toBe(true);
  });

  it("clean_activity_dashboard provides visible activity and density", () => {
    const entities = getMockEntities("clean_activity_dashboard");
    const rows = intervalizeHistory(
      getMockHistory(range, "clean_activity_dashboard"),
      entities,
      range,
      config,
      {},
    );
    const model = buildActivityDashboardModel(
      groupRows(rows, "area"),
      range,
      config,
      undefined,
      { inventoryRows: rows, groupBy: "area" },
    );

    expect(model.visibleRowsCount).toBeGreaterThan(3);
    expect(model.totalInventoryItemCount).toBe(entities.length);
    expect(model.densityBuckets.some((bucket) => bucket.intensity > 0)).toBe(
      true,
    );
  });
});
