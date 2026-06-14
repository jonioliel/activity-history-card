# Mockup 05 Implementation Notes

This pass keeps the MVP in `view_mode: activity` and aligns the real data
dashboard with mockup 05 using a compact desktop swimlane layout.

## Source Of Truth

- Static visual model: `src/mockup05/mockup05-model.ts`
- Shared visual renderer: `src/renderers/mockup05-layout.ts`
- Real data mapper: `activityDashboardToMockup05Model()` in
  `src/renderers/activity-dashboard-renderer.ts`
- Card integration: `src/activity-history-card.ts`
- CSS section: `/* Mockup 05 visual shell */` in `src/styles.ts`

## Static Preview

Use this YAML to render the static mockup 05 visual model:

```yaml
type: custom:activity-history-card
view_mode: activity
display_mode: panel
desktop_density: compact
fullscreen_behavior: fixed_overlay
mock_data: true
mock_profile: mockup05_visual
```

This preview does not depend on Recorder history. It exists so layout,
density, compact area lanes, inactive area summaries, inventory drawer
behavior, summary cards, and insights can be checked independently from Home
Assistant data quality.

## Real Data Mapping

The real `ActivityDashboardModel` is mapped into the same visual shape:

- `summary` -> `renderMockup05Summary()`
- `densityBuckets` -> `renderMockup05Density()`
- `groups` -> compact `ahc-area-lane`
- `activityRows` -> `ahc-lane-row`
- `inventoryItems` -> `ahc-inventory-chip` inside the drawer or focused-area
  inline preview
- `insights` -> `renderMockup05Insights()`

Groups with visible activity render one compact area header, one aggregate
band, and up to four row lanes. Groups without visible activity render as
34-40px inactive summaries, with only the first few quiet areas visible before
a collapsed "more inactive areas" row.

## Layout Contract

The desktop shell is:

```html
<ha-card class="ahc ahc--panel ahc--mockup05-shell ahc--density-compact">
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

- default panel/activity density: `compact`
- hero max height: 72px in compact density
- toolbar max height: 52px in compact density
- summary strip max height: 78px in compact density
- body columns: `minmax(0, 1fr) var(--ahc-insights-width, 340px)`
- dashboard height: `calc(100svh - 310px)`
- timeline scrolls inside `.ahc-dashboard__scroll`
- active areas render as compact lanes with one aggregate band and up to four
  row lanes
- inactive areas render as short summary rows, not empty grids
- first viewport should show hero, toolbar, summary, density, axis, several
  area lanes, and insights

## Inventory Behavior

- All-areas view opens `ahc-inventory-drawer` from the "כל האביזרים" button.
- Single focused area can still show an inline inventory preview.
- Inventory drawer open/close changes only local UI state and must not refetch
  history.
- Inventory chip clicks fire Home Assistant `hass-more-info`.

## Fullscreen

`fullscreen_behavior: fixed_overlay` is the default. The fullscreen button
uses the browser Fullscreen API when available and also applies
`.ahc--fixed-overlay`, so the panel can visually cover Home Assistant chrome
when native fullscreen is blocked.

## Tests

Relevant tests:

- `test/mockup05-model.test.ts`
- `test/activity-dashboard-visual-model.test.ts`
- `test/activity-dashboard-renderer.test.ts`
- `test/dashboard-css-contract.test.ts`
- `test/source-format-regression.test.ts`

Do not implement heatmap, drill-down, detail, or correlation in this pass.
