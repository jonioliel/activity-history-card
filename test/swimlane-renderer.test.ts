import { describe, expect, it } from "vitest";
import {
  renderSwimlaneTimeline,
  shouldRenderTimelineSegment,
} from "../src/renderers/swimlane-renderer";
import { summarizeActivity } from "../src/summary";
import type { TimelineGroup, TimelineSegment } from "../src/types";

const inactiveSegment: TimelineSegment = {
  entity_id: "switch.pool_power",
  state: "off",
  category: "off",
  active: false,
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-01T01:00:00.000Z"),
  durationMs: 3_600_000,
};

const activeSegment: TimelineSegment = {
  ...inactiveSegment,
  state: "on",
  category: "on",
  active: true,
};

describe("shouldRenderTimelineSegment", () => {
  it("hides inactive baselines by default", () => {
    expect(
      shouldRenderTimelineSegment(inactiveSegment, {
        type: "custom:activity-history-card",
      }),
    ).toBe(false);
  });

  it("renders inactive baselines only when configured", () => {
    expect(
      shouldRenderTimelineSegment(inactiveSegment, {
        type: "custom:activity-history-card",
        show_inactive_baselines: true,
      }),
    ).toBe(true);
  });

  it("always renders active segments", () => {
    expect(
      shouldRenderTimelineSegment(activeSegment, {
        type: "custom:activity-history-card",
      }),
    ).toBe(true);
  });

  it("keeps the legacy swimlane renderer available", () => {
    const group: TimelineGroup = {
      id: "living",
      title: "Living",
      rows: [
        {
          entity: {
            entity_id: "switch.test",
            name: "Test switch",
            domain: "switch",
          },
          segments: [activeSegment],
          totalActiveMs: activeSegment.durationMs,
          eventCount: 1,
        },
      ],
      totalActiveMs: activeSegment.durationMs,
    };
    const result = renderSwimlaneTimeline({
      groups: [group],
      range: {
        start: activeSegment.start,
        end: activeSegment.end,
      },
      config: {
        type: "custom:activity-history-card",
        view_mode: "legacy_swimlane",
      },
      summary: summarizeActivity([group]),
    }) as unknown as { strings: readonly string[] };

    expect(result.strings.join("")).toContain("ahc-timeline-toolbar");
  });
});
