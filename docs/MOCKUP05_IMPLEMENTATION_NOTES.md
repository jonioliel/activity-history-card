# Mockup 05 Implementation Notes

This note maps the current `view_mode: activity` dashboard to the desktop
fullscreen RTL mockup (`mockups/05-desktop-fullscreen-rtl-panel.png`).

## Shell

- Mockup panel shell: `.ahc`, `.ahc--panel`, `.ahc--fullscreen`
- Header and actions: `.ahc__hero`, `.ahc__topbar`, `.ahc__hero-actions`
- Compact filter row: `.ahc__toolbar`, `.ahc__filters`
- Summary strip: `.ahc__summary-strip`
- Main two-column body: `.ahc__body`, `.ahc__main`, `.ahc__insights-panel`

## Activity Dashboard

- Dashboard frame: `.ahc-dashboard`
- Dashboard header: `.ahc-dashboard__header`, `.ahc-dashboard__title-block`,
  `.ahc-dashboard__range-pill`
- Density histogram: `.ahc-dashboard__density`,
  `.ahc-dashboard__density-bars`, `.ahc-dashboard-density-bucket`,
  `.ahc-dashboard-density-fill`, `.ahc-dashboard__density-labels`
- Timeline viewport: `.ahc-dashboard__timeline`, `.ahc-dashboard__axis`,
  `.ahc-dashboard__axis-label`, `.ahc-dashboard__scroll`
- Shared grid primitives: `.ahc-timegrid`, `.ahc-timegrid__grid`,
  `.ahc-timegrid__segments`, `.ahc-timegrid__line`,
  `.ahc-timegrid__now`

## Area Rows

- Area card/group: `.ahc-area-card`, `.ahc-dashboard-group`
- Area header: `.ahc-area-card__header`, `.ahc-area-card__title`,
  `.ahc-area-card__meta`, `.ahc-area-card__inventory-button`
- Aggregate activity band: `.ahc-area-card__aggregate`,
  `.ahc-dashboard-group__aggregate`
- Entity rows: `.ahc-dashboard-row`, `.ahc-dashboard-row__label`,
  `.ahc-dashboard-row__plot`
- Activity bars: `.ahc-dashboard-segment`,
  `.ahc-dashboard-segment--row`, `.ahc-dashboard-segment--aggregate`,
  `.ahc-dashboard-segment--min`

## Area Inventory

- Inventory panel: `.ahc-area-inventory`
- Domain grouping: `.ahc-area-inventory__groups`,
  `.ahc-area-inventory__domain`, `.ahc-area-inventory__domain-title`
- Accessory chips: `.ahc-area-inventory__chips`, `.ahc-inventory-chip`,
  `.ahc-inventory-chip__copy`, `.ahc-inventory-chip__status`

## Current Decisions

- The timeline time axis remains chronological left-to-right.
- All labels, cards, filters, and inventory chips remain RTL-friendly.
- All-areas inventory is collapsed by default through renderer state; focused
  single-area dashboards expand inventory automatically.
- The dashboard renderer is the single source for the MVP activity view. Do not
  add heatmap, drill-down, detail, or correlation implementations in this pass.
