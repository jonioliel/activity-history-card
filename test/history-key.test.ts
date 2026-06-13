import { describe, expect, it } from "vitest";
import { buildHistoryCacheKey } from "../src/history-key";

const base = {
  mock: false,
  start: "2026-01-01T00:00:00.000Z",
  end: "2026-01-02T00:00:00.000Z",
  entityIds: ["switch.test"],
  withAttributes: [],
  withoutAttributes: ["switch.test"],
  includeLabels: [],
  excludeLabels: [],
  significant: true,
  minimal: true,
};

describe("buildHistoryCacheKey", () => {
  it("is stable for filter-only UI changes that keep the same entity set and range", () => {
    expect(buildHistoryCacheKey(base)).toBe(buildHistoryCacheKey({ ...base }));
  });

  it("changes when the time range changes", () => {
    expect(buildHistoryCacheKey(base)).not.toBe(
      buildHistoryCacheKey({
        ...base,
        end: "2026-01-02T01:00:00.000Z",
      }),
    );
  });
});
