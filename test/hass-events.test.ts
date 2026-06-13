import { describe, expect, it } from "vitest";
import { createHassMoreInfoEvent } from "../src/hass-events";

describe("createHassMoreInfoEvent", () => {
  it("creates the Home Assistant more-info event for inventory chips", () => {
    const event = createHassMoreInfoEvent("switch.kitchen");

    expect(event.type).toBe("hass-more-info");
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(event.detail).toEqual({ entityId: "switch.kitchen" });
  });
});
