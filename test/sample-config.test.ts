import { describe, expect, it } from "vitest";
import sample from "../sample-config.yaml?raw";

describe("sample-config.yaml", () => {
  it("uses the activity dashboard as the production default", () => {
    expect(sample).toContain("view_mode: activity");
    expect(sample).toContain("show_activity_density: true");
    expect(sample).toContain("max_total_rows: 18");
    expect(sample).toContain("max_rows_per_group: 4");
  });
});
