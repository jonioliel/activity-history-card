import { describe, expect, it } from "vitest";
import { curateRows } from "../src/activity-curation";
import { buildActivityDashboardModel } from "../src/activity-dashboard-model";
import { groupRows } from "../src/filters";
import { intervalizeHistory } from "../src/intervalize";
import { getMockEntities, getMockHistory } from "../src/mock-data";
import type { ActivityHistoryCardConfig, TimeRange } from "../src/types";

const config: ActivityHistoryCardConfig = {
  type: "custom:activity-history-card",
  mock_data: true,
  mock_profile: "large_noisy_home",
  max_total_rows: 18,
  max_rows_per_group: 4,
  max_visible_rows: 18,
};

describe("large noisy mock profile", () => {
  it("curates a noisy home into a small meaningful default view", () => {
    const range: TimeRange = {
      start: new Date("2026-01-01T00:00:00.000Z"),
      end: new Date("2026-01-02T00:00:00.000Z"),
    };
    const entities = getMockEntities("large_noisy_home");
    const history = getMockHistory(range, "large_noisy_home");
    const rows = intervalizeHistory(history, entities, range, config, {});
    const curated = curateRows(rows, config, { groupBy: "area" });
    const model = buildActivityDashboardModel(
      groupRows(curated.rows, "area"),
      range,
      config,
      curated.diagnostics,
    );

    expect(entities.length).toBeGreaterThan(160);
    expect(model.visibleRowsCount).toBeGreaterThanOrEqual(8);
    expect(model.visibleRowsCount).toBeLessThanOrEqual(18);
    expect(
      model.groups.flatMap((group) => group.aggregateSegments).length,
    ).toBeGreaterThan(0);
    expect(model.densityBuckets.some((bucket) => bucket.intensity > 0)).toBe(
      true,
    );
    expect(curated.diagnostics.hiddenRows).toBeGreaterThan(100);
    expect(
      curated.diagnostics.hiddenTechnicalRows +
        curated.diagnostics.hiddenNoisyNameRows +
        curated.diagnostics.hiddenDiagnosticRows +
        curated.diagnostics.hiddenConfigRows,
    ).toBeGreaterThan(80);
  });
});
