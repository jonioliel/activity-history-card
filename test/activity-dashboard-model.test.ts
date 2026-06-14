import { describe, expect, it } from "vitest";
import { curateRows } from "../src/activity-curation";
import {
  buildActivityDashboardModel,
  selectActivityDashboardGroups,
  summarizeDashboardModel,
} from "../src/activity-dashboard-model";
import { groupRows } from "../src/filters";
import type {
  ActivityHistoryCardConfig,
  TimeRange,
  TimelineGroup,
  TimelineRow,
} from "../src/types";

const range: TimeRange = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-02T00:00:00.000Z"),
};

function row(
  entityId: string,
  options: {
    name?: string;
    area?: string;
    domain?: string;
    activeMs?: number;
    technical?: boolean;
    currentState?: string;
  } = {},
): TimelineRow {
  const start = new Date("2026-01-01T01:00:00.000Z");
  const activeMs = options.activeMs ?? 60 * 60 * 1000;
  const active = activeMs > 0;
  return {
    entity: {
      entity_id: entityId,
      name: options.name ?? entityId,
      domain: options.domain ?? "switch",
      area: options.area ?? "סלון",
      entity_category: options.technical ? "diagnostic" : undefined,
    },
    segments: active
      ? [
          {
            entity_id: entityId,
            state: "on",
            category: "on",
            active: true,
            start,
            end: new Date(start.getTime() + activeMs),
            durationMs: activeMs,
          },
        ]
      : [],
    totalActiveMs: activeMs,
    eventCount: active ? 1 : 0,
    currentState: options.currentState,
    currentCategory:
      options.currentState === "unavailable" ? "unknown" : undefined,
  };
}

function group(id: string, rows: TimelineRow[]): TimelineGroup {
  return {
    id,
    title: id,
    rows,
    totalActiveMs: rows.reduce((sum, item) => sum + item.totalActiveMs, 0),
  };
}

function config(
  overrides: Partial<ActivityHistoryCardConfig> = {},
): ActivityHistoryCardConfig {
  return {
    type: "custom:activity-history-card",
    smart_filter: true,
    max_total_rows: 18,
    max_rows_per_group: 4,
    ...overrides,
  };
}

describe("buildActivityDashboardModel", () => {
  it("returns visible groups only and creates aggregate activity bands", () => {
    const model = buildActivityDashboardModel(
      [
        group("סלון", [
          row("switch.active"),
          row("switch.empty", { activeMs: 0 }),
        ]),
        group("ריק", [row("switch.empty_only", { area: "ריק", activeMs: 0 })]),
      ],
      range,
      config(),
    );

    expect(model.groups.map((item) => item.title)).toEqual(["סלון", "ריק"]);
    expect(model.visibleRowsCount).toBe(1);
    expect(model.groups[0]?.aggregateSegments.length).toBeGreaterThan(0);
    expect(model.groups[1]?.activityRows).toEqual([]);
    expect(model.groups[1]?.inventoryItems).toHaveLength(1);
  });

  it("has rendered segments whenever visible active time is positive", () => {
    const model = buildActivityDashboardModel(
      [group("סלון", [row("switch.active", { activeMs: 90 * 60 * 1000 })])],
      range,
      config(),
    );
    const renderedSegments = model.groups.flatMap((item) =>
      item.activityRows.flatMap((dashboardRow) => dashboardRow.segments),
    );

    expect(model.totalVisibleActiveMs).toBeGreaterThan(0);
    expect(renderedSegments.length).toBeGreaterThan(0);
    expect(
      renderedSegments.every(
        (segment) => segment.widthPct > 0 || segment.minVisible === true,
      ),
    ).toBe(true);
    expect(model.densityBuckets.some((bucket) => bucket.intensity > 0)).toBe(
      true,
    );
  });

  it("caps visible rows to the clean dashboard default and counts hidden rows", () => {
    const rows = Array.from({ length: 24 }, (_, index) =>
      row(`switch.${index}`, { activeMs: 60_000 + index }),
    );
    const model = buildActivityDashboardModel(
      [group("סלון", rows)],
      range,
      config({ max_visible_rows: 18 }),
    );

    expect(model.visibleRowsCount).toBe(18);
    expect(model.hiddenRowsCount).toBe(6);
  });

  it("builds summary and insights from the visible model rows", () => {
    const model = buildActivityDashboardModel(
      [
        group("סלון", [
          row("switch.visible", {
            name: "תאורת סלון",
            activeMs: 2 * 60 * 60 * 1000,
          }),
        ]),
      ],
      range,
      config(),
    );
    const summary = summarizeDashboardModel(model);

    expect(summary.activeEntityCount).toBe(1);
    expect(summary.totalActiveMs).toBe(2 * 60 * 60 * 1000);
    expect(model.insights.mostActiveEntity?.name).toBe("תאורת סלון");
    expect(model.insights.mostActiveArea?.title).toBe("סלון");
  });

  it("keeps noisy diagnostic entities out of the default model", () => {
    const curated = curateRows(
      [
        row("switch.good", { name: "תאורת סלון" }),
        row("switch.router_lan", {
          name: "Router LAN",
          technical: true,
        }),
      ],
      config(),
      { groupBy: "area" },
    );
    const model = buildActivityDashboardModel(
      groupRows(curated.rows, "area"),
      range,
      config(),
      curated.diagnostics,
    );

    expect(
      model.groups
        .flatMap((item) => item.activityRows)
        .map((item) => item.name),
    ).toEqual(["תאורת סלון"]);
    expect(model.hiddenRowsCount).toBe(1);
  });

  it("keeps inactive normal accessories in the area inventory", () => {
    const inactive = row("switch.inactive", {
      name: "מנורת צד",
      activeMs: 0,
    });
    const active = row("switch.active", { name: "תאורה ראשית" });
    const model = buildActivityDashboardModel(
      groupRows([active], "area"),
      range,
      config(),
      undefined,
      { inventoryRows: [active, inactive], groupBy: "area" },
    );

    expect(model.visibleRowsCount).toBe(1);
    expect(model.totalInventoryItemCount).toBe(2);
    expect(model.groups[0]?.inventoryItems.map((item) => item.name)).toEqual([
      "תאורה ראשית",
      "מנורת צד",
    ]);
  });

  it("keeps every filtered area visible through inventory even without activity", () => {
    const active = row("switch.active", {
      name: "תאורה ראשית",
      area: "סלון",
    });
    const quietKitchen = row("switch.kitchen", {
      name: "שקע מטבח",
      area: "מטבח",
      activeMs: 0,
    });
    const quietPool = row("switch.pool", {
      name: "משאבה",
      area: "בריכה",
      activeMs: 0,
    });

    const model = buildActivityDashboardModel(
      groupRows([active], "area"),
      range,
      config(),
      undefined,
      { inventoryRows: [active, quietKitchen, quietPool], groupBy: "area" },
    );

    expect(model.groups.map((item) => item.title)).toEqual([
      "סלון",
      "בריכה",
      "מטבח",
    ]);
    expect(
      model.groups.slice(1).every((group) => !group.activityRows.length),
    ).toBe(true);
  });

  it("excludes hidden diagnostic inventory items by default", () => {
    const normal = row("switch.normal", { name: "תאורת מטבח" });
    const diagnostic = row("switch.router_lan", {
      name: "Router LAN",
      technical: true,
    });
    const model = buildActivityDashboardModel(
      groupRows([normal], "area"),
      range,
      config(),
      undefined,
      { inventoryRows: [normal, diagnostic], groupBy: "area" },
    );

    expect(model.totalInventoryItemCount).toBe(1);
    expect(model.groups[0]?.inventoryItems[0]?.name).toBe("תאורת מטבח");
  });

  it("marks a single selected area as focused for default inventory expansion", () => {
    const model = buildActivityDashboardModel(
      groupRows([row("switch.active", { area: "מטבח" })], "area"),
      range,
      config(),
      undefined,
      {
        inventoryRows: [row("switch.active", { area: "מטבח" })],
        selectedAreas: ["מטבח"],
        groupBy: "area",
      },
    );

    expect(model.singleAreaFocused).toBe(true);
  });

  it("can omit inactive accessories from inventory when configured", () => {
    const active = row("switch.active", { name: "תאורה" });
    const inactive = row("switch.inactive", {
      name: "שקע",
      activeMs: 0,
    });
    const model = buildActivityDashboardModel(
      groupRows([active], "area"),
      range,
      config({ area_inventory_include_inactive: false }),
      undefined,
      { inventoryRows: [active, inactive], groupBy: "area" },
    );

    expect(model.totalInventoryItemCount).toBe(1);
    expect(model.groups[0]?.inventoryItems.map((item) => item.name)).toEqual([
      "תאורה",
    ]);
  });

  it("marks unavailable inventory accessories for muted rendering", () => {
    const unavailable = row("switch.unavailable", {
      name: "שקע לא זמין",
      activeMs: 0,
      currentState: "unavailable",
    });
    const model = buildActivityDashboardModel(
      groupRows([], "area"),
      range,
      config(),
      undefined,
      { inventoryRows: [unavailable], groupBy: "area" },
    );

    expect(model.groups[0]?.inventoryItems[0]?.stateTone).toBe("unavailable");
  });

  it("respects explicitly configured technical entities", () => {
    const explicit = row("switch.router_lan", {
      name: "Router LAN",
      technical: true,
    });
    explicit.entity.config = { entity: "switch.router_lan" };
    const curated = curateRows(
      [explicit],
      config({ entities: ["switch.router_lan"] }),
      { groupBy: "area" },
    );
    const selection = selectActivityDashboardGroups(
      groupRows(curated.rows, "area"),
      config(),
    );

    expect(selection.visibleRowCount).toBe(1);
  });
});
