import { describe, expect, it } from "vitest";
import { curateRows } from "../src/activity-curation";
import { groupRows } from "../src/filters";
import { intervalizeHistory } from "../src/intervalize";
import { getMockEntities, getMockHistory } from "../src/mock-data";
import { prepareActivityTimeline } from "../src/renderers/activity-timeline-renderer";
import type { ActivityHistoryCardConfig, TimeRange } from "../src/types";

const config: ActivityHistoryCardConfig = {
  type: "custom:activity-history-card",
  mock_data: true,
  mock_profile: "large_noisy_home",
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
    const prepared = prepareActivityTimeline(
      groupRows(curated.rows, "area"),
      range,
      config,
    );

    expect(entities.length).toBeGreaterThan(160);
    expect(curated.rows.length).toBeGreaterThanOrEqual(10);
    expect(curated.rows.length).toBeLessThanOrEqual(24);
    expect(prepared.visibleRowCount).toBeGreaterThanOrEqual(10);
    expect(prepared.visibleRowCount).toBeLessThanOrEqual(24);
    expect(prepared.density.some((bucket) => bucket.intensity > 0)).toBe(true);
    expect(curated.diagnostics.hiddenRows).toBeGreaterThan(100);
    expect(
      curated.diagnostics.hiddenTechnicalRows +
        curated.diagnostics.hiddenNoisyNameRows +
        curated.diagnostics.hiddenDiagnosticRows +
        curated.diagnostics.hiddenConfigRows,
    ).toBeGreaterThan(80);
  });
});
