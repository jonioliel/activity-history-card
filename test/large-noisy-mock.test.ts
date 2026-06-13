import { describe, expect, it } from "vitest";
import { curateRows } from "../src/activity-curation";
import { intervalizeHistory } from "../src/intervalize";
import { getMockEntities, getMockHistory } from "../src/mock-data";
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

    expect(entities.length).toBeGreaterThan(160);
    expect(curated.rows.length).toBeGreaterThan(0);
    expect(curated.rows.length).toBeLessThanOrEqual(40);
    expect(curated.diagnostics.hiddenRows).toBeGreaterThan(100);
    expect(
      curated.diagnostics.hiddenTechnicalRows +
        curated.diagnostics.hiddenNoisyNameRows +
        curated.diagnostics.hiddenDiagnosticRows +
        curated.diagnostics.hiddenConfigRows,
    ).toBeGreaterThan(80);
  });
});
