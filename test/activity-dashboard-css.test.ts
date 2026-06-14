import { describe, expect, it } from "vitest";
import styles from "../src/styles.ts?raw";

describe("activity dashboard CSS", () => {
  it("styles the area dashboard structure emitted by the renderer", () => {
    [
      "--ahc-insights-width: 340px",
      "--ahc-dashboard-label-width: 230px",
      "--ahc-dashboard-row-height: 34px",
      "--ahc-dashboard-segment-height: 10px",
      "--ahc-dashboard-segment-min-width: 5px",
      "--ahc-dashboard-group-header-height: 42px",
      ".ahc__hero",
      ".ahc__toolbar",
      ".ahc__summary-strip",
      ".ahc__body",
      ".ahc__main",
      ".ahc__insights-panel",
      ".ahc-dashboard",
      ".ahc-dashboard__header",
      ".ahc-dashboard__density",
      ".ahc-dashboard__axis",
      ".ahc-dashboard__timeline",
      ".ahc-dashboard__scroll",
      ".ahc-dashboard-group",
      ".ahc-dashboard-group__header",
      ".ahc-dashboard-group__aggregate",
      ".ahc-dashboard-group__rows",
      ".ahc-dashboard-row",
      ".ahc-dashboard-row__label",
      ".ahc-dashboard-row__plot",
      ".ahc-dashboard-row__meta",
      ".ahc-dashboard-segment",
      ".ahc-area-inventory",
      ".ahc-inventory-chip",
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
