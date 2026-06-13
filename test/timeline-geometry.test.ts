import { describe, expect, it } from "vitest";
import { segmentToGeometry } from "../src/timeline-geometry";
import type { TimeRange, TimelineSegment } from "../src/types";

const range: TimeRange = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-02T00:00:00.000Z"),
};

function segment(start: string, end: string): TimelineSegment {
  return {
    entity_id: "switch.test",
    state: "on",
    category: "on",
    active: true,
    start: new Date(start),
    end: new Date(end),
    durationMs: new Date(end).getTime() - new Date(start).getTime(),
  };
}

describe("segmentToGeometry", () => {
  it("maps the first hour of a 24h range to about 4.16 percent", () => {
    const geometry = segmentToGeometry(
      segment("2026-01-01T00:00:00.000Z", "2026-01-01T01:00:00.000Z"),
      range,
    );

    expect(geometry.leftPct).toBe(0);
    expect(geometry.widthPct).toBeCloseTo(100 / 24, 3);
  });

  it("maps a middle segment chronologically left to right", () => {
    const geometry = segmentToGeometry(
      segment("2026-01-01T12:00:00.000Z", "2026-01-01T13:00:00.000Z"),
      range,
    );

    expect(geometry.leftPct).toBeCloseTo(50, 3);
    expect(geometry.widthPct).toBeCloseTo(100 / 24, 3);
  });

  it("clamps a segment crossing the range start", () => {
    const geometry = segmentToGeometry(
      segment("2025-12-31T23:30:00.000Z", "2026-01-01T00:30:00.000Z"),
      range,
    );

    expect(geometry.leftPct).toBe(0);
    expect(geometry.widthPct).toBeCloseTo(100 / 48, 3);
  });

  it("clamps a segment crossing the range end", () => {
    const geometry = segmentToGeometry(
      segment("2026-01-01T23:30:00.000Z", "2026-01-02T01:00:00.000Z"),
      range,
    );

    expect(geometry.leftPct).toBeCloseTo(100 - 100 / 48, 3);
    expect(geometry.widthPct).toBeCloseTo(100 / 48, 3);
  });

  it("marks very short active segments for minimum visible width", () => {
    const geometry = segmentToGeometry(
      segment("2026-01-01T08:00:00.000Z", "2026-01-01T08:01:00.000Z"),
      range,
    );

    expect(geometry.widthPct).toBeGreaterThan(0);
    expect(geometry.minVisible).toBe(true);
  });

  it("does not reverse x-axis math for RTL layouts", () => {
    const geometry = segmentToGeometry(
      segment("2026-01-01T06:00:00.000Z", "2026-01-01T07:00:00.000Z"),
      range,
    );

    expect(geometry.leftPct).toBeCloseTo(25, 3);
  });
});
