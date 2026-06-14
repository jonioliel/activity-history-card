# Mockup 05 Implementation Notes

This pass introduces a mockup-first visual layer for the MVP `view_mode: activity` dashboard.

## Source Of Truth

- Static visual model: `src/mockup05/mockup05-model.ts`
- Shared visual renderer: `src/renderers/mockup05-layout.ts`
- Real data mapper: `activityDashboardToMockup05Model()` in `src/renderers/activity-dashboard-renderer.ts`
- Card integration: `src/activity-history-card.ts`
- CSS section: `/* Mockup 05 visual shell */` in `src/styles.ts`

## Static Preview

Use this YAML to render the static mockup 05 visual model:

```yaml
type: custom:activity-history-card
view_mode: activity
display_mode: panel
mock_data: true
mock_profile: mockup05_visual
```

This preview does not depend on Recorder history. It exists so layout, density, area cards, inventory chips, summary cards, and insights can be checked independently from Home Assistant data quality.

## Real Data Mapping

The real `ActivityDashboardModel` is mapped into the same visual shape:

- `summary` -> `renderMockup05Summary()`
- `densityBuckets` -> `renderMockup05Density()`
- `groups` -> `renderMockup05Group()`
- `activityRows` -> `renderMockup05Row()`
- `inventoryItems` -> `ahc-inventory-chip`
- `insights` -> `renderMockup05Insights()`

Groups with no visible activity rows no longer render a large empty timeline block. If they have inventory, they render as compact inventory cards only.

## Layout Contract

The desktop shell is:

```html
<ha-card class="ahc ahc--panel ahc--mockup05-shell">
  <section class="ahc__hero">...</section>
  <section class="ahc__toolbar">...</section>
  <section class="ahc__summary-strip">...</section>
  <section class="ahc__body">
    <main class="ahc__main">
      <section class="ahc-dashboard">...</section>
    </main>
    <aside class="ahc__insights-panel">...</aside>
  </section>
</ha-card>
```

Desktop expectations:

- hero max height: 88px
- toolbar max height: 56px
- summary strip max height: 86px
- body columns: `minmax(0, 1fr) var(--ahc-insights-width, 340px)`
- dashboard height: `calc(100svh - 310px)`
- timeline scrolls inside `.ahc-dashboard__scroll`
- first viewport should show hero, toolbar, summary, density, axis, several area groups, and insights

## Inventory Behavior

- All-areas view uses compact inventory previews.
- Single focused area expands inventory by default.
- “כל האביזרים” expands inventory without changing view mode and without refetching history.
- Inventory chip clicks fire Home Assistant `hass-more-info`.

## Tests

Relevant tests:

- `test/mockup05-model.test.ts`
- `test/activity-dashboard-visual-model.test.ts`
- `test/activity-dashboard-renderer.test.ts`
- `test/dashboard-css-contract.test.ts`
- `test/source-format-regression.test.ts`

Do not implement heatmap, drill-down, detail, or correlation in this pass.
