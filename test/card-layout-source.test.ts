import { describe, expect, it } from "vitest";
import source from "../src/activity-history-card.ts?raw";

describe("activity card body layout source", () => {
  it("keeps the main body and insights panel as explicit layout slots", () => {
    expect(source).toContain("ahc__hero ahc__topbar");
    expect(source).toContain("ahc__toolbar ahc__filters");
    expect(source).toContain("ahc__summary-strip ahc__summary-grid");
    expect(source).toContain("class=${showInsights");
    expect(source).toContain('class="ahc__main"');
    expect(source).toContain('class="ahc__insights-panel"');
    expect(source).toContain("this._renderInsights()");
  });
});
