import { describe, expect, it } from "vitest";
import { mockup05VisualModel } from "../src/mockup05/mockup05-model";

describe("mockup05VisualModel", () => {
  it("provides a complete desktop visual preview model", () => {
    expect(mockup05VisualModel.axisLabels).toHaveLength(6);
    expect(mockup05VisualModel.density).toHaveLength(24);
    expect(mockup05VisualModel.summary.length).toBeGreaterThanOrEqual(5);
    expect(mockup05VisualModel.groups.length).toBeGreaterThanOrEqual(4);
    expect(mockup05VisualModel.insights).toHaveLength(4);
  });

  it("keeps timeline percentages within the visible plot", () => {
    const segments = mockup05VisualModel.groups.flatMap((group) => [
      ...group.aggregateSegments,
      ...group.rows.flatMap((row) => row.segments),
    ]);

    expect(segments.length).toBeGreaterThan(12);
    for (const segment of segments) {
      expect(segment.leftPct).toBeGreaterThanOrEqual(0);
      expect(segment.leftPct).toBeLessThanOrEqual(100);
      expect(segment.widthPct).toBeGreaterThan(0);
      expect(segment.leftPct + segment.widthPct).toBeLessThanOrEqual(100);
    }
  });

  it("keeps inventory chips tied to friendly labels and real entity ids", () => {
    const chips = mockup05VisualModel.groups.flatMap(
      (group) => group.inventoryItems,
    );

    expect(chips.length).toBeGreaterThan(8);
    for (const chip of chips) {
      expect(chip.label).toBeTruthy();
      expect(chip.label).not.toContain(".");
      expect(chip.entityId).toContain(".");
    }
  });
});
