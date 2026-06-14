# Visual Acceptance Checklist

Use this checklist before adding new modes such as heatmap, drill-down, detail, or correlation.

## Desktop Panel

- The card has `ahc--mockup05-shell` in `view_mode: activity`.
- The shell order is hero, toolbar, summary strip, body.
- Hero stays compact and does not exceed 88px.
- Toolbar stays compact, horizontally scrolls when needed, and does not become a tall filter block.
- Summary strip stays around 86px and uses compact cards.
- Body uses `minmax(0, 1fr) var(--ahc-insights-width, 340px)` on desktop.
- Timeline is the dominant surface.
- Dashboard scroll happens inside `.ahc-dashboard__scroll`, not by growing the page.
- Insights are visible on desktop and move below the dashboard on smaller layouts.

## Mockup 05 Static Preview

- YAML with `mock_data: true` and `mock_profile: mockup05_visual` renders the static model.
- The first viewport shows hero, toolbar, summary, density, time axis, at least three area groups, and insights.
- Density uses 24 buckets.
- Axis shows six major labels without overlap.
- Area cards show friendly Hebrew names and compact metadata.
- Inventory chips are visible and stay compact.

## Real Data View

- Real `ActivityDashboardModel` maps to the same visual components as the static preview.
- Friendly names are shown before entity ids.
- Raw entity ids appear only when no friendly name exists, or in debug contexts.
- Groups with activity render aggregate bands and rows.
- Groups with no visible activity rows do not render a giant empty timeline block.
- Inventory-only groups render compact inventory previews.
- “כל האביזרים” expands inventory without refetching history.

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
