# Visual Acceptance Checklist

Use this checklist before adding new modes such as heatmap, drill-down, detail,
or correlation.

## Desktop Panel

- The card shell uses `ahc__hero`, `ahc__toolbar`, `ahc__summary-strip`, and
  `ahc__body`.
- The hero stays compact, with title/subtitle on the right and action buttons on
  the opposite side.
- The filter toolbar is one compact row with horizontal overflow instead of
  wrapping area/domain chips into a tall block.
- The summary strip stays in one row on desktop and does not exceed roughly
  88px.
- The body is a two-column layout on desktop:
  `minmax(0, 1fr) var(--ahc-insights-width)`.
- The timeline is the dominant visual surface and scrolls inside the dashboard
  panel, not by growing the browser page.
- The insights panel is desktop-only and aligns with the timeline height.

## Activity Dashboard

- The dashboard uses `ahc-dashboard__density`, `ahc-dashboard__timeline`,
  `ahc-dashboard__axis`, and `ahc-dashboard__scroll`.
- Density, aggregate bands, and row plots use the shared `.ahc-timegrid`
  structure and the same axis model.
- The time axis itself is `dir="ltr"` and remains chronological left to right,
  while labels, group names, controls, and cards remain RTL-friendly.
- A 24-hour range shows a readable number of major labels, roughly 6-8 in
  comfortable mode, without overlapping.
- A seven-day range uses readable day/date labels and avoids dense hourly
  labels.
- Major grid lines align across the density strip, aggregate bands, and every
  activity row; minor grid lines stay subtle.
- The current-time marker appears only when "now" is inside the active range and
  uses the label `עכשיו`.
- Activity rows use a right-side label column and a left-to-right plot column:
  time math remains chronological left to right.
- Inactive default rails are not visible as thick grey bars; the chart shows
  active segments and subtle grid lines.
- Row segments are visually readable at about 12px high; aggregate segments are
  slightly stronger at about 14px high.
- Short active events remain visible through minimum width styling and should
  read as small dots or pills instead of disappearing.
- Area group headers are compact, around 40-44px high.
- All-areas inventory is collapsed by default.
- Single-area inventory is expanded by default.
- Inventory chips are compact, scroll inside their drawer, and fire Home
  Assistant more-info on click.

## Mobile

- Top chips are horizontally scrollable.
- Advanced filters open as a bottom sheet and close reliably.
- Timeline rows remain horizontally scrollable when the label column plus plot
  cannot fit the viewport.
- Entity names remain visible; mobile must not collapse rows into icon-only
  labels.

## Validation

- `npm run format:check`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `dist/activity-history-card.js` is updated after build.
