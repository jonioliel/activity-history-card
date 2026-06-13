import { describe, expect, it } from "vitest";
import { resolveRendererMode } from "../src/view-mode";

describe("resolveRendererMode", () => {
  it("defaults to the activity dashboard renderer", () => {
    expect(resolveRendererMode({ type: "custom:activity-history-card" })).toBe(
      "activity",
    );
  });

  it("keeps legacy_swimlane available for debug views", () => {
    expect(
      resolveRendererMode({
        type: "custom:activity-history-card",
        view_mode: "legacy_swimlane",
      }),
    ).toBe("legacy_swimlane");
  });

  it("supports legacy timeline style for swimlane configs", () => {
    expect(
      resolveRendererMode({
        type: "custom:activity-history-card",
        view_mode: "swimlane",
        timeline_style: "legacy",
      }),
    ).toBe("legacy_swimlane");
  });

  it("uses legacy styling for show-all troubleshooting without a fetch signal", () => {
    expect(
      resolveRendererMode(
        { type: "custom:activity-history-card", view_mode: "activity" },
        true,
      ),
    ).toBe("legacy_swimlane");
  });
});
