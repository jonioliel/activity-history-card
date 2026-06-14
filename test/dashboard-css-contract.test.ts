import { describe, expect, it } from "vitest";
import rendererSource from "../src/renderers/activity-dashboard-renderer.ts?raw";
import layoutSource from "../src/renderers/mockup05-layout.ts?raw";
import styles from "../src/styles.ts?raw";

const requiredMockup05Classes = [
  "ahc--mockup05-shell",
  "ahc__hero",
  "ahc__hero-main",
  "ahc__hero-title",
  "ahc__hero-subtitle",
  "ahc__hero-icon",
  "ahc__hero-actions",
  "ahc__toolbar",
  "ahc__toolbar-group",
  "ahc__filter-chip",
  "ahc__filter-chip--active",
  "ahc__search",
  "ahc__summary-strip",
  "ahc__summary-card",
  "ahc__summary-card-icon",
  "ahc__body",
  "ahc__main",
  "ahc__insights-panel",
  "ahc-dashboard",
  "ahc-dashboard__header",
  "ahc-dashboard__title-block",
  "ahc-dashboard__range-pill",
  "ahc-dashboard__density",
  "ahc-dashboard__density-bars",
  "ahc-dashboard-density-bucket",
  "ahc-dashboard-density-fill",
  "ahc-dashboard__axis",
  "ahc-dashboard__axis-label",
  "ahc-dashboard__timeline",
  "ahc-dashboard__scroll",
  "ahc-area-card",
  "ahc-area-card__header",
  "ahc-area-card__title",
  "ahc-area-card__title-copy",
  "ahc-area-card__meta",
  "ahc-area-card__actions",
  "ahc-area-card__inventory-button",
  "ahc-area-card__aggregate",
  "ahc-area-card__activity",
  "ahc-area-card__inventory-preview",
  "ahc-dashboard-row",
  "ahc-dashboard-row__label",
  "ahc-dashboard-row__label-icon",
  "ahc-dashboard-row__label-copy",
  "ahc-dashboard-row__state",
  "ahc-dashboard-row__plot",
  "ahc-dashboard-segment",
  "ahc-dashboard-segment--on",
  "ahc-dashboard-segment--cooling",
  "ahc-dashboard-segment--heating",
  "ahc-dashboard-segment--playing",
  "ahc-dashboard-segment--open",
  "ahc-dashboard-segment--fan",
  "ahc-insight-card",
  "ahc-insight-card__title",
  "ahc-insight-card__value",
  "ahc-insight-card__caption",
  "ahc-inventory-chip",
  "ahc-inventory-chip__icon",
  "ahc-inventory-chip__copy",
  "ahc-inventory-chip__state",
] as const;

const legacyCompatibleClasses = [
  "ahc-dashboard-empty",
  "ahc-dashboard__groups",
  "ahc-dashboard-group",
  "ahc-dashboard-group__header",
  "ahc-dashboard-group__title",
  "ahc-dashboard-group__meta",
  "ahc-dashboard-group__aggregate",
  "ahc-dashboard-group__body",
  "ahc-dashboard-group__rows",
  "ahc-timegrid",
  "ahc-timegrid--density",
  "ahc-timegrid--aggregate",
  "ahc-timegrid--row",
  "ahc-timegrid__grid",
  "ahc-timegrid__segments",
  "ahc-timegrid__line",
  "ahc-timegrid__line--major",
  "ahc-timegrid__line--minor",
  "ahc-timegrid__now",
  "ahc-timegrid__now--label",
  "ahc-timegrid__now-label",
  "ahc-area-inventory",
  "ahc-area-inventory__header",
  "ahc-area-inventory__groups",
  "ahc-area-inventory__domain",
  "ahc-area-inventory__chips",
  "ahc-area-inventory__more",
  "ahc-dashboard-icon",
] as const;

const requiredVariables = [
  "--ahc-bg",
  "--ahc-surface",
  "--ahc-surface-2",
  "--ahc-border",
  "--ahc-text",
  "--ahc-muted",
  "--ahc-blue",
  "--ahc-green",
  "--ahc-purple",
  "--ahc-yellow",
  "--ahc-orange",
  "--ahc-teal",
  "--ahc-insights-width",
  "--ahc-dashboard-label-width",
  "--ahc-dashboard-row-height",
  "--ahc-dashboard-segment-height",
  "--ahc-dashboard-aggregate-height",
  "--ahc-dashboard-segment-min-width",
] as const;

function emittedClasses(): string[] {
  const source = `${layoutSource}\n${rendererSource}`;
  return [
    ...new Set(
      [
        ...source.matchAll(
          /ahc[A-Za-z0-9_-]+(?:__[A-Za-z0-9_-]+)?(?:--[A-Za-z0-9_-]+)?/g,
        ),
      ]
        .map((match) => match[0])
        .filter(
          (className) =>
            !className.endsWith("--") && !source.includes(`--${className}`),
        ),
    ),
  ];
}

describe("dashboard CSS contract", () => {
  it("styles every required mockup05 visual selector", () => {
    for (const className of [
      ...requiredMockup05Classes,
      ...legacyCompatibleClasses,
    ]) {
      expect(styles, `Missing selector for .${className}`).toContain(
        `.${className}`,
      );
    }
  });

  it("keeps required mockup05 variables available", () => {
    for (const variable of requiredVariables) {
      expect(styles, `Missing variable ${variable}`).toContain(variable);
    }
  });

  it("does not emit unstyled classes from the mockup05 renderers", () => {
    for (const className of emittedClasses()) {
      expect(styles, `Missing selector for emitted .${className}`).toContain(
        `.${className}`,
      );
    }
  });
});
