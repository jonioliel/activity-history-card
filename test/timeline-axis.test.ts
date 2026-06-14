import { describe, expect, it } from "vitest";
import { buildTimelineAxis } from "../src/renderers/timeline-axis";

describe("buildTimelineAxis", () => {
  it("uses comfortable density with no more than six major labels for 24h", () => {
    const axis = buildTimelineAxis(
      {
        start: new Date("2026-01-01T00:00:00.000Z"),
        end: new Date("2026-01-02T00:00:00.000Z"),
      },
      { maxMajorTicks: 6, now: new Date("2026-01-01T12:00:00.000Z") },
    );
    const majors = axis.ticks.filter((tick) => tick.major);

    expect(majors.length).toBeLessThanOrEqual(6);
    expect(majors.length).toBeGreaterThanOrEqual(4);
  });

  it("uses compact density with no more than eight major labels", () => {
    const axis = buildTimelineAxis(
      {
        start: new Date("2026-01-01T00:00:00.000Z"),
        end: new Date("2026-01-02T00:00:00.000Z"),
      },
      { maxMajorTicks: 8 },
    );
    const majors = axis.ticks.filter((tick) => tick.major);

    expect(majors.length).toBeLessThanOrEqual(8);
  });

  it("keeps a 24 hour axis readable with major and minor ticks", () => {
    const axis = buildTimelineAxis(
      {
        start: new Date("2026-01-01T00:00:00.000Z"),
        end: new Date("2026-01-02T00:00:00.000Z"),
      },
      { maxMajorTicks: 8, now: new Date("2026-01-01T12:00:00.000Z") },
    );
    const majors = axis.ticks.filter((tick) => tick.major);

    expect(majors.length).toBeGreaterThanOrEqual(6);
    expect(majors.length).toBeLessThanOrEqual(8);
    expect(axis.ticks.some((tick) => !tick.major)).toBe(true);
    expect(axis.nowPercent).toBe(50);
    expect(majors.every((tick) => tick.label.length > 0)).toBe(true);
    expect(majors.map((tick) => tick.percent)).toEqual(
      [...majors].map((tick) => tick.percent).sort((a, b) => a - b),
    );
    expect(axis.ticks.map((tick) => tick.percent)).toEqual(
      [...axis.ticks].map((tick) => tick.percent).sort((a, b) => a - b),
    );
    expect(axis.ticks.every((tick) => tick.percent >= 0)).toBe(true);
    expect(axis.ticks.every((tick) => tick.percent <= 100)).toBe(true);
  });

  it("uses a sparse readable axis for seven day ranges", () => {
    const axis = buildTimelineAxis(
      {
        start: new Date("2026-01-01T00:00:00.000Z"),
        end: new Date("2026-01-08T00:00:00.000Z"),
      },
      { maxMajorTicks: 8, now: new Date("2026-01-09T00:00:00.000Z") },
    );
    const majors = axis.ticks.filter((tick) => tick.major);

    expect(majors.length).toBeGreaterThanOrEqual(5);
    expect(majors.length).toBeLessThanOrEqual(8);
    expect(axis.nowPercent).toBeUndefined();
    expect(
      majors.every((tick) => tick.percent >= 0 && tick.percent <= 100),
    ).toBe(true);
  });

  it("does not place major labels on top of each other", () => {
    const axis = buildTimelineAxis(
      {
        start: new Date("2026-01-01T10:47:00.000Z"),
        end: new Date("2026-01-02T10:47:00.000Z"),
      },
      { maxMajorTicks: 8, now: new Date("2026-01-01T10:00:00.000Z") },
    );
    const majors = axis.ticks.filter((tick) => tick.major);

    for (let index = 1; index < majors.length; index += 1) {
      expect(
        majors[index]!.percent - majors[index - 1]!.percent,
      ).toBeGreaterThan(6);
    }
  });
});
