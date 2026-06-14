# Visual Acceptance Checklist

Use this checklist before adding new modes such as heatmap, drill-down,
detail, or correlation.

## Desktop Panel

- The card has `ahc--mockup05-shell` in `view_mode: activity`.
- The card has one density class: `ahc--density-comfortable`,
  `ahc--density-compact`, or `ahc--density-ultra-compact`.
- Panel/activity defaults to compact density.
- The shell order is hero, toolbar, summary strip, body.
- Hero stays compact and does not exceed 72px in compact density.
- Toolbar stays compact, horizontally scrolls when needed, and does not become
  a tall filter block.
- Summary strip stays around 78px in compact density and uses compact cards.
- Body uses `minmax(0, 1fr) var(--ahc-insights-width, 340px)` on desktop.
- Timeline is the dominant surface.
- Dashboard scroll happens inside `.ahc-dashboard__scroll`, not by growing the
  page.
- Insights are visible on desktop and move below the dashboard on smaller
  layouts.

## Timeline Lanes

- A single global axis is shown at the top of the timeline.
- Active areas render as `ahc-area-lane ahc-area-lane--active`.
- Active area height in compact density stays close to 120px.
- Each active area has one aggregate band and up to four compact row lanes.
- Row labels show friendly entity names; labels must not collapse to icons.
- Inactive areas render as `ahc-area-lane--inactive` short summaries.
- Only the first few inactive areas are shown before a collapsed "more inactive
  areas" row.
- Segment bars are thin but still clickable.

## Mockup 05 Static Preview

- YAML with `mock_data: true` and `mock_profile: mockup05_visual` renders the
  static model.
- The first viewport shows hero, toolbar, summary, density, time axis, active
  area lanes, inactive summaries, and insights.
- Density uses 24 buckets.
- Compact desktop axis shows no more than six major labels.
- Area lanes show friendly Hebrew names and compact metadata.

## Real Data View

- Real `ActivityDashboardModel` maps to the same visual components as the
  static preview.
- Friendly names are shown before entity ids.
- Raw entity ids appear only when no friendly name exists, or in debug contexts.
- Groups with activity render aggregate bands and rows.
- Groups with no visible activity rows do not render a giant empty timeline
  block.
- Inventory drawer open/close does not refetch history.
- Filtering by area/domain/search should not refetch history unless the
  selected entity set or time range actually changes.

## Inventory

- All-areas view opens `ahc-inventory-drawer` from the "כל האביזרים" button.
- The drawer is 320-380px wide on desktop and scrolls internally.
- Drawer chips open Home Assistant more-info.
- Focused single-area mode may show inline inventory up to about 260px.

## Fullscreen

- Fullscreen button applies `.ahc--fixed-overlay` when
  `fullscreen_behavior: fixed_overlay`.
- Escape exits fullscreen cleanly.
- Button click exits fullscreen cleanly.

## Mobile

- At narrow widths, the body becomes one column.
- Toolbar chips remain horizontally scrollable.
- Summary cards wrap or scroll without clipping text.
- Timeline rows can scroll horizontally if the label plus plot cannot fit.
- Entity names remain visible; the row label must not collapse to icons only.
- Advanced filter sheet continues to open and close reliably.

## Validation

Run all of these before shipping:

```bash
npm run format
npm run format:check
npm run typecheck
npm run test
npm run build
```

`dist/activity-history-card.js` must be updated after build.
