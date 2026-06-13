import { describe, expect, it } from "vitest";
import { renderActivityDashboard } from "../src/renderers/activity-dashboard-renderer";
import type { ActivityDashboardModel } from "../src/activity-dashboard-model";

interface InspectableTemplate {
  strings: readonly string[];
  values?: readonly unknown[];
}

const range = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-02T00:00:00.000Z"),
};

function model(
  overrides: Partial<ActivityDashboardModel> = {},
): ActivityDashboardModel {
  return {
    range,
    totalRowsBeforeCuration: 1,
    visibleRowsCount: 1,
    hiddenRowsCount: 0,
    hiddenReasonSummary: "",
    totalVisibleActiveMs: 3_600_000,
    visibleEventCount: 1,
    activeNowCount: 0,
    totalInventoryItemCount: 2,
    singleAreaFocused: false,
    densityBuckets: [],
    groups: [
      {
        id: "living",
        title: "סלון",
        icon: "mdi:home-outline",
        area: "סלון",
        totalEntityCount: 2,
        visibleActivityRowCount: 1,
        inventoryItemCount: 2,
        totalActiveMs: 3_600_000,
        eventCount: 1,
        activeNowCount: 0,
        hiddenRowsCount: 0,
        aggregateSegments: [
          {
            start: range.start,
            end: new Date("2026-01-01T01:00:00.000Z"),
            category: "on",
            label: "סלון",
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
            eventCount: 1,
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
            totalActiveMs: 3_600_000,
            eventCount: 1,
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
    insights: {},
    ...overrides,
  };
}

function flattenTemplate(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => flattenTemplate(item)).join("");
  }
  if (value && typeof value === "object" && "strings" in value) {
    const template = value as InspectableTemplate;
    return template.strings
      .map(
        (part, index) => `${part}${flattenTemplate(template.values?.[index])}`,
      )
      .join("");
  }
  return "";
}

describe("renderActivityDashboard", () => {
  it("renders the dashboard shell, density area, aggregate bands, and row plots", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model(),
        config: { type: "custom:activity-history-card" },
      }),
    );

    expect(html).toContain("ahc-dashboard__overview");
    expect(html).toContain("ahc-area-card");
    expect(html).toContain("ahc-dashboard-group__aggregate");
    expect(html).toContain("ahc-dashboard-row__plot");
    expect(html).toContain("ahc-dashboard-segment--row");
    expect(html).toContain("ahc-area-inventory");
    expect(html).toContain("מנורת צד");
  });

  it("renders a compact dashboard empty state when no rows are visible", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model({
          visibleRowsCount: 0,
          totalInventoryItemCount: 0,
          groups: [],
        }),
        config: { type: "custom:activity-history-card" },
      }),
    );

    expect(html).toContain("ahc-dashboard-empty");
  });

  it("keeps the dashboard visible when there are inventory items but no activity rows", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model({
          visibleRowsCount: 0,
          visibleEventCount: 0,
          totalVisibleActiveMs: 0,
          groups: [
            {
              ...model().groups[0]!,
              totalActiveMs: 0,
              eventCount: 0,
              activeNowCount: 0,
              visibleActivityRowCount: 0,
              aggregateSegments: [],
              activityRows: [],
            },
          ],
        }),
        config: { type: "custom:activity-history-card" },
      }),
    );

    expect(html).toContain("ahc-area-card");
    expect(html).toContain("אין פעילות משמעותית בטווח הנוכחי");
  });
});
