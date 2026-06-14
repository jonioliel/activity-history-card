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
  it("renders the compact dashboard shell, timeline scroll, aggregate bands, and row plots", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model(),
        config: { type: "custom:activity-history-card" },
      }),
    );

    expect(html).toContain("ahc-dashboard__density");
    expect(html).toContain("ahc-dashboard__timeline");
    expect(html).toContain("ahc-dashboard__axis");
    expect(html).toContain("ahc-dashboard__scroll");
    expect(html).toContain("ahc-timegrid");
    expect(html).toContain("ahc-timegrid--density");
    expect(html).toContain("ahc-timegrid--aggregate");
    expect(html).toContain("ahc-timegrid--row");
    expect(html).toContain("ahc-area-card");
    expect(html).toContain("ahc-area-card__title");
    expect(html).toContain("ahc-area-card__aggregate");
    expect(html).toContain("ahc-area-card__content");
    expect(html).toContain("ahc-area-card__activity");
    expect(html).toContain("ahc-dashboard-group__aggregate");
    expect(html).toContain("ahc-dashboard-group__body");
    expect(html).toContain("ahc-dashboard-row__plot");
    expect(html).toContain('dir="ltr"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("ahc-dashboard-segment--row");
  });

  it("adds geometry titles when timeline debug is enabled", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model(),
        config: {
          type: "custom:activity-history-card",
          debug_timeline_geometry: true,
        },
      }),
    );

    expect(html).toContain("left 0.00%");
    expect(html).toContain("width 4.20%");
  });

  it("collapses inventory by default for an all-areas dashboard", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model(),
        config: { type: "custom:activity-history-card" },
      }),
    );

    expect(html).toContain("data-inventory-expanded=false");
    expect(html).not.toContain("ahc-area-inventory");
    expect(html).toContain("אביזרים");
  });

  it("expands inventory by default for a single focused area", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model({ singleAreaFocused: true }),
        config: { type: "custom:activity-history-card" },
      }),
    );

    expect(html).toContain("data-inventory-expanded=true");
    expect(html).toContain("ahc-area-inventory");
    expect(html).toContain("data-state-tone=");
    expect(html).toContain("מנורת צד");
  });

  it("expands inventory when show all inventory is active without rendering legacy output", () => {
    const html = flattenTemplate(
      renderActivityDashboard({
        model: model(),
        config: { type: "custom:activity-history-card" },
        showAllInventory: true,
      }),
    );

    expect(html).toContain("data-inventory-expanded=true");
    expect(html).toContain("ahc-area-inventory");
    expect(html).not.toContain("ahc-timeline-card");
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
