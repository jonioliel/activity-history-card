import { describe, expect, it } from "vitest";
import styles from "../src/styles.ts?raw";

describe("activity dashboard CSS", () => {
  it("styles the area dashboard structure emitted by the renderer", () => {
    [
      ".ahc-area-card__title",
      ".ahc-area-card__aggregate",
      ".ahc-area-card__content",
      ".ahc-area-card__activity",
      ".ahc-dashboard-row__inline-meta",
      ".ahc-inventory-chip__status",
      '[data-state-tone="active"]',
      '[data-state-tone="unavailable"]',
    ].forEach((selector) => {
      expect(styles).toContain(selector);
    });
  });
});
