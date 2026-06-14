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
    expect(sample).toContain("timeline_height: calc(100svh - 320px)");
    expect(sample).toContain("timeline_axis_density: comfortable");
    expect(sample).toContain("debug_timeline_geometry: false");
  });

  it("uses a simple valid YAML shape", () => {
    const lines = sample
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+#.*$/, ""))
      .filter((line) => line.trim().length > 0);

    expect(sample).not.toContain("\t");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ")) continue;
      expect(trimmed).toMatch(/^[\w_]+:/);
    }
  });
});
