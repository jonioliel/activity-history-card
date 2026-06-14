import { describe, expect, it } from "vitest";
import type { ActivityDashboardModel } from "../src/activity-dashboard-model";
import {
  activityDashboardToMockup05Model,
  buildDashboardAxis,
} from "../src/renderers/activity-dashboard-renderer";

const range = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-02T00:00:00.000Z"),
};

function dashboardModel(): ActivityDashboardModel {
  return {
    range,
    totalRowsBeforeCuration: 2,
    visibleRowsCount: 1,
    hiddenRowsCount: 0,
    hiddenReasonSummary: "",
    totalVisibleActiveMs: 3_600_000,
    visibleEventCount: 2,
    activeNowCount: 0,
    totalInventoryItemCount: 2,
    singleAreaFocused: true,
    densityBuckets: [
      {
        start: range.start,
        end: new Date("2026-01-01T01:00:00.000Z"),
        totalActiveMs: 1_800_000,
        activeEntityCount: 1,
        eventCount: 1,
        intensity: 0.5,
      },
    ],
    groups: [
      {
        id: "living",
        title: "סלון",
        icon: "mdi:sofa-outline",
        area: "סלון",
        totalEntityCount: 2,
        visibleActivityRowCount: 1,
        inventoryItemCount: 2,
        hiddenRowsCount: 0,
        totalActiveMs: 3_600_000,
        eventCount: 2,
        activeNowCount: 0,
        aggregateSegments: [
          {
            start: range.start,
            end: new Date("2026-01-01T01:00:00.000Z"),
            category: "on",
            label: "סלון · פעילות",
            colorVar: "var(--ahc-on)",
            leftPct: 0,
            widthPct: 4.2,
            minVisible: false,
          },
        ],
        activityRows: [
          {
            entityId: "switch.living_room",
            name: "תאורת סלון",
            secondary: "סלון · מתג",
            icon: "mdi:lightbulb-outline",
            domain: "switch",
            area: "סלון",
            totalActiveMs: 3_600_000,
            eventCount: 2,
            activeNow: false,
            segments: [
              {
                start: range.start,
                end: new Date("2026-01-01T01:00:00.000Z"),
                category: "on",
                label: "תאורת סלון",
                colorVar: "var(--ahc-on)",
                leftPct: 0,
                widthPct: 4.2,
                minVisible: false,
                sourceIndex: 0,
              },
            ],
          },
        ],
        inventoryItems: [
          {
            entityId: "switch.living_room",
            name: "תאורת סלון",
            domain: "switch",
            area: "סלון",
            activeNow: false,
            hadActivityInRange: true,
            currentStateLabel: "דלוק",
          },
          {
            entityId: "switch.side_lamp",
            name: "מנורת צד",
            domain: "switch",
            area: "סלון",
            activeNow: false,
            hadActivityInRange: false,
            currentStateLabel: "כבוי",
          },
        ],
      },
    ],
    insights: {
      mostActiveEntity: {
        name: "תאורת סלון",
        secondary: "סלון · מתג",
        totalActiveMs: 3_600_000,
        eventCount: 2,
      },
      mostActiveArea: {
        title: "סלון",
        totalActiveMs: 3_600_000,
        eventCount: 2,
        rowCount: 1,
        inventoryCount: 2,
      },
      peakBucketLabel: "00:00 - 01:00",
      shortUsePattern: "1 רכיבי פעילות · 1 אזורים",
      inventoryPattern: "2 אביזרים במלאי · 0 פעילים עכשיו",
    },
  };
}

describe("activity dashboard visual model mapping", () => {
  it("maps real dashboard data into the mockup05 visual shape", () => {
    const visual = activityDashboardToMockup05Model(
      dashboardModel(),
      { type: "custom:activity-history-card" },
      {},
    );

    const majorAxisLabels = visual.axisLabels.filter(
      (label) => label.major !== false,
    );
    expect(majorAxisLabels.length).toBeGreaterThanOrEqual(4);
    expect(majorAxisLabels.length).toBeLessThanOrEqual(8);
    expect(visual.summary.map((item) => item.id)).toEqual([
      "active-now",
      "active-components",
      "events",
      "component-hours",
      "last-event",
    ]);
    expect(visual.groups[0]?.title).toBe("סלון");
    expect(visual.groups[0]?.rows[0]?.label).toBe("תאורת סלון");
    expect(visual.groups[0]?.rows[0]?.segments[0]?.tone).toBe("on");
    expect(visual.groups[0]?.inventoryItems[0]?.label).toBe("תאורת סלון");
    expect(visual.insights.map((item) => item.title)).toEqual([
      "הרכיב הפעיל ביותר",
      "האזור הפעיל ביותר",
      "שעות שיא",
      "דפוס שימוש קצר",
    ]);
  });

  it("expands inventory automatically for a focused single area", () => {
    const visual = activityDashboardToMockup05Model(
      dashboardModel(),
      { type: "custom:activity-history-card" },
      {},
    );

    expect(visual.groups[0]?.expandedInventory).toBe(true);
    expect(visual.groups[0]?.inventoryItems).toHaveLength(2);
  });

  it("keeps inventory-only groups compact instead of rendering empty rows", () => {
    const model = dashboardModel();
    model.visibleRowsCount = 0;
    model.groups[0]!.activityRows = [];
    model.groups[0]!.aggregateSegments = [];
    model.groups[0]!.visibleActivityRowCount = 0;

    const visual = activityDashboardToMockup05Model(
      model,
      { type: "custom:activity-history-card" },
      {},
    );

    expect(visual.groups[0]?.rows).toHaveLength(0);
    expect(visual.groups[0]?.inventoryItems.length).toBeGreaterThan(0);
  });

  it("builds a rolling 24h axis from real clock ticks and a real now position", () => {
    const rollingRange = {
      start: new Date("2026-01-01T10:47:00.000Z"),
      end: new Date("2026-01-02T10:47:00.000Z"),
    };
    const axis = buildDashboardAxis(
      rollingRange,
      {
        type: "custom:activity-history-card",
        timeline_axis_density: "comfortable",
      },
      rollingRange.end,
    );
    const majorLabels = axis.labels.filter(
      (label) => label.major && label.label,
    );
    const innerLabels = majorLabels.slice(1, -1).map((label) => label.label);

    expect(axis.nowPercent).toBe(100);
    expect(majorLabels.at(-1)?.label).toBe("עכשיו");
    expect(innerLabels.every((label) => !label.includes(":47"))).toBe(true);
  });
});
