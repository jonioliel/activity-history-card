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

  it("keeps the previous activity renderer available as activity_legacy", () => {
    expect(
      resolveRendererMode({
        type: "custom:activity-history-card",
        view_mode: "activity_legacy",
      }),
    ).toBe("activity_legacy");
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

  it("maps old swimlane configs to the raw legacy renderer", () => {
    expect(
      resolveRendererMode({
        type: "custom:activity-history-card",
        view_mode: "swimlane",
      }),
    ).toBe("legacy_swimlane");
  });

  it("keeps show-all inside the activity dashboard inventory view", () => {
    expect(
      resolveRendererMode(
        { type: "custom:activity-history-card", view_mode: "activity" },
        true,
      ),
    ).toBe("activity");
  });
});
