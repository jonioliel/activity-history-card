import { describe, expect, it } from "vitest";
import { intervalizeHistory } from "../src/intervalize";
import type { EntityMeta, HistoryStateRecord, TimeRange } from "../src/types";

const entity: EntityMeta = {
  entity_id: "switch.test",
  name: "בדיקה",
  domain: "switch",
  area: "סלון",
  config: { entity: "switch.test" },
};

const range: TimeRange = {
  start: new Date("2026-01-01T00:00:00.000Z"),
  end: new Date("2026-01-01T02:00:00.000Z"),
};

describe("intervalizeHistory", () => {
  it("creates active segments from state changes", () => {
    const history: Record<string, HistoryStateRecord[]> = {
      "switch.test": [
        { entity_id: "switch.test", state: "off", last_changed: "2026-01-01T00:00:00.000Z" },
        { entity_id: "switch.test", state: "on", last_changed: "2026-01-01T00:30:00.000Z" },
        { entity_id: "switch.test", state: "off", last_changed: "2026-01-01T01:00:00.000Z" },
      ],
    };

    const [row] = intervalizeHistory(history, [entity], range, { type: "custom:activity-history-card" });
    expect(row?.segments.some((segment) => segment.active)).toBe(true);
    expect(row?.totalActiveMs).toBe(30 * 60 * 1000);
  });
});
