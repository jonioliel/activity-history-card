import { describe, expect, it } from "vitest";
import sample from "../sample-config.yaml?raw";

describe("sample-config.yaml", () => {
  it("uses the activity dashboard as the production default", () => {
    expect(sample).toContain("view_mode: activity");
    expect(sample).toContain("mock_data: false");
    expect(sample).toContain("show_activity_density: true");
    expect(sample).toContain("show_area_inventory: true");
    expect(sample).toContain("area_inventory_mode: compact");
    expect(sample).toContain("area_inventory_max_items: 12");
    expect(sample).toContain("max_total_rows: 18");
    expect(sample).toContain("max_rows_per_group: 4");
  });
});
