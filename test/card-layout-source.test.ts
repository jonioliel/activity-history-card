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
    expect(source).toContain("ahc--fixed-overlay");
    expect(source).toContain("ahc--density-${this._desktopDensityClass()}");
  });

  it("keeps rendering tied to the loaded history range", () => {
    expect(source).toContain("private _loadedRange?: TimeRange");
    expect(source).toContain("private _displayRange(): TimeRange");
    expect(source).toContain(
      "return this._loadedRange ?? this._resolveRange()",
    );
    expect(source).toContain("const range = this._displayRange()");
  });
});
