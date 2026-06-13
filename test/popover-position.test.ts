import { describe, expect, it } from "vitest";
import { positionPopover } from "../src/popover-position";

describe("positionPopover", () => {
  it("keeps a desktop popover inside the viewport", () => {
    const point = positionPopover({ left: 900, top: 20, width: 80, height: 20 }, { width: 1000, height: 700 }, 320, 220);

    expect(point.placement).toBe("floating");
    expect(point.x).toBeLessThanOrEqual(664);
    expect(point.y).toBeGreaterThanOrEqual(16);
  });

  it("uses bottom placement on narrow mobile viewports", () => {
    const point = positionPopover({ left: 10, top: 10, width: 80, height: 20 }, { width: 390, height: 760 }, 320, 220);

    expect(point).toEqual({ x: 12, y: 528, placement: "bottom" });
  });
});
