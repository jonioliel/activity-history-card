# Codex Prompt — Home Assistant Activity History Card

You are building a production-quality Home Assistant Lovelace custom card named `activity-history-card`.

The user wants a smart, clean, RTL-aware activity-history visualization for Home Assistant that shows when each device/entity was active over a selected time range. The card must work well both as a normal Lovelace card and as a full-screen/panel-style dashboard card, and it must be excellent on mobile.

Use the visual mockups in `mockups/` as the design target. The most important references are:

- `mockups/05-desktop-fullscreen-rtl-panel.png` — desktop/full-screen RTL layout.
- `mockups/06-mobile-overview-rtl.png` — mobile overview layout.
- `mockups/07-mobile-advanced-filter-sheet-rtl.png` — mobile filter bottom sheet.
- `mockups/08-mobile-entity-detail-rtl.png` — mobile entity drill-down.
- `mockups/01-desktop-swimlanes-original.png` — original MVP swimlane concept.

## Core goal

Create a Home Assistant custom card:

```yaml
type: custom:activity-history-card
```

It should fetch entity history from Home Assistant, convert state records into timeline segments, and render a clear, beautiful, interactive activity timeline. The card must support Hebrew and right-to-left interfaces, but the timeline itself should remain chronologically left-to-right so time reads naturally from start to end.

## Technology requirements

Use:

- TypeScript
- Lit / LitElement
- SVG for the swimlane timeline MVP
- Home Assistant frontend custom-card APIs
- No React
- No large charting library for MVP
- No external CDN runtime dependencies

Implement the project as a Vite-based custom card package.

Required files/modules:

```text
src/
  activity-history-card.ts
  activity-history-card-editor.ts      # optional but create a basic shell if time allows
  history-client.ts
  entity-resolver.ts
  intervalize.ts
  summary.ts
  filters.ts
  format.ts
  types.ts
  styles.ts
  renderers/
    swimlane-renderer.ts
    heatmap-renderer.ts                # placeholder or basic implementation
    detail-renderer.ts                 # placeholder or basic implementation
    correlation-renderer.ts            # placeholder or basic implementation
```

Required public API / custom-card methods:

- `setConfig(config)` with validation and defaults.
- `set hass(hass)` to receive Home Assistant state and fetch data when relevant inputs change.
- `disconnectedCallback()` to clean WebSocket subscriptions and event listeners.
- `getCardSize()` for Masonry dashboards.
- `getGridOptions()` for Sections dashboards; support full-width layout.
- `window.customCards.push(...)` registration metadata.

## Home Assistant history fetching

Use the Home Assistant `hass` object from the custom card.

For fixed ranges:

```ts
await hass.callWS({
  type: "history/history_during_period",
  entity_ids: entityIds,
  start_time: start.toISOString(),
  end_time: end.toISOString(),
  minimal_response: true,
  significant_changes_only: config.significant_changes_only ?? true,
  no_attributes: !needsAttributes(entityIds, config),
});
```

For live rolling mode, use `hass.connection.subscribeMessage` with `history/stream` where supported. If `history/stream` is not available or fails, fall back to periodic refresh using `history/history_during_period`.

Important optimization: `no_attributes` should be `true` by default, but for domains like `climate` and for configured `active_attributes`, fetch attributes. If only some entities require attributes, split the history request into two batches: one with `no_attributes: true`, one with `no_attributes: false`.

Do not fetch history on every `hass` setter call. Debounce, cache by range/entities/options, and refetch only when the selected range, entity list, filter, or live boundary changes.

## Entity classification defaults

Implement a domain/state classification layer. Default active-state map:

```ts
const DEFAULT_ACTIVE_STATES = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  input_boolean: ["on"],
  media_player: ["playing"],
  climate: ["cool", "heat", "heat_cool", "dry", "fan_only"],
  humidifier: ["on"],
  vacuum: ["cleaning", "returning"],
  cover: ["opening", "closing", "open"],
};

const DEFAULT_ACTIVE_ATTRIBUTES = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"],
  },
};
```

Handle states:

- `unknown`
- `unavailable`
- empty history
- missing attributes
- duplicate consecutive states
- very short segments
- DST/timezone edges

State category examples for rendering:

- `on`
- `off`
- `cooling`
- `heating`
- `playing`
- `opening`
- `closing`
- `idle`
- `unknown`

## Intervalization algorithm

Create a pure, tested function in `intervalize.ts`:

1. Normalize HA history records into `{ entity_id, state, attributes, last_changed, last_updated }`.
2. Sort records by time per entity.
3. Deduplicate sequential records with same effective state and relevant attributes.
4. Add current `hass.states[entity_id]` as an end boundary when needed.
5. Convert each record into a segment ending at the next record timestamp.
6. Clamp each segment to the selected range.
7. Classify the segment using state and configured active states/attributes.
8. Merge adjacent segments with same state/category when gap <= `merge_gap_seconds`.
9. Drop active visual segments shorter than `min_duration_seconds` only if config asks; keep raw data for tooltips/summaries.
10. Return grouped rows ready for rendering.

## UI/UX requirements

### Desktop/full-screen

Match the direction of `mockups/05-desktop-fullscreen-rtl-panel.png`.

Desktop layout should include:

- Title and subtitle in Hebrew.
- Top controls for grouping, full-screen, search.
- Filter chips for time range, entity type/domain, and area.
- Summary strip with total active time, number of events, active-now entities, last event.
- Main swimlane timeline grouped by area.
- Sticky or visually clear area headers.
- Right-side insights panel with:
  - most active entity
  - most active area
  - peak hours
  - daily pattern summary
- Bottom legend in Hebrew.
- Full-screen action button.

### Mobile

Mobile is not an afterthought. Implement a first-class responsive layout inspired by:

- `mockups/06-mobile-overview-rtl.png`
- `mockups/07-mobile-advanced-filter-sheet-rtl.png`
- `mockups/08-mobile-entity-detail-rtl.png`

Mobile requirements:

- Use `@media (max-width: 760px)` and/or ResizeObserver container logic.
- Compact header and sticky top actions.
- Horizontal scrollable chips with touch-friendly spacing.
- Summary cards in 2-column grid.
- Area groups as stacked cards.
- Timeline can be horizontally scrollable within each area card, but labels and controls must remain readable.
- Advanced filter UI should open as a bottom sheet/full-screen sheet, not a crowded desktop toolbar.
- Entity drill-down should be optimized for phone: summary metrics, timeline, details, related entities, event log, bottom action row.
- Touch targets must be at least 44px high/wide.
- Tooltips must work on touch: use tap/focus popover, not hover only.

### RTL requirements

RTL must be built into the implementation, not patched at the end.

- Add `dir="rtl"` to the card root when `rtl: true`, when `direction: rtl`, or when Home Assistant language/direction indicates RTL.
- Use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`, etc.) wherever possible.
- Use `text-align: start/end`, not hard-coded left/right, except for the timeline graph internals.
- Timeline graph should use `direction: ltr` internally for time math and x coordinates.
- Labels, chips, legends, tooltips, menus, and cards should be RTL in Hebrew.
- Do not flip chronological time unless a specific config option requests it.
- Icons should have sensible placement for RTL.

### Filtering requirements

The card must allow filtering entities clearly and quickly.

Filter dimensions:

- time range: `hours_to_show`, preset chips, custom `start_time`/`end_time`
- area(s)
- domain/type(s): light, switch, climate, media_player, cover, fan, etc.
- state mode: all states / only active segments / only currently active entities
- search text over entity ID, friendly name, area, domain
- explicit include/exclude entity lists
- optional groups: group by area, domain/entity type, floor, custom group, or none

Filtering should update the rendered rows immediately using cached history when possible. Refetch only when entity list or time range changes.

## Configuration schema

Support this YAML:

```yaml
type: custom:activity-history-card
title: היסטוריית פעילות חכמה
hours_to_show: 24
live: true
rtl: auto # auto | true | false
display_mode: panel # card | panel | fullscreen
default_view: swimlane # swimlane | heatmap | detail | correlation
group_by: area # area | domain | floor | entity | none
show_summary: true
show_insights: true
show_now_line: true
show_legend: true
show_fullscreen_button: true
significant_changes_only: true
minimal_response: true
min_duration_seconds: 20
merge_gap_seconds: 15
mobile_breakpoint: 760
filters:
  show: true
  show_search: true
  show_area_chips: true
  show_domain_chips: true
  show_state_mode: true
  default_domains:
    - light
    - switch
    - climate
    - media_player
    - cover
  default_areas: []
  active_only: false
entities:
  - entity: light.living_room_main
    name: תאורת סלון
    area: סלון
    active_states: ["on"]
  - entity: climate.living_room_ac
    name: מזגן סלון
    area: סלון
    active_states: ["cool", "heat", "dry", "fan_only"]
    active_attributes:
      hvac_action: ["cooling", "heating", "drying", "fan"]
    attributes:
      - current_temperature
      - temperature
      - hvac_action
  - entity: media_player.living_room_spotify
    name: Spotify סלון
    area: סלון
    active_states: ["playing"]
exclude_entities:
  - sensor.*
colors:
  on: "var(--success-color)"
  off: "var(--disabled-text-color)"
  cooling: "#38bdf8"
  heating: "#fb923c"
  playing: "#a78bfa"
  opening: "#facc15"
  idle: "#64748b"
  unknown: "#94a3b8"
```

Also support a shorthand entity list:

```yaml
entities:
  - light.living_room_main
  - climate.living_room_ac
  - media_player.living_room_spotify
```

If `entities` is omitted, allow optional `domains` and `areas` auto-discovery, but do not accidentally load hundreds of entities by default. Use a sane warning/empty state.

## Full-screen behavior

Implement two modes:

1. Native Fullscreen API for supported browsers.
2. CSS overlay fallback using `.ahc--fullscreen` with `position: fixed; inset: 0; z-index: 2147483640;`.

When full-screen is active:

- Escape key exits.
- Focus is managed inside the card.
- Mobile safe areas are respected with `env(safe-area-inset-*)`.
- Timeline resizes correctly using `ResizeObserver`.

## Accessibility requirements

- Every interactive chip/button must be a real `button` or have correct ARIA role and keyboard handling.
- Use `aria-pressed` for toggle chips.
- Use `aria-expanded` for area groups and filter sheet.
- Timeline SVG needs `role="img"` and a concise `aria-label`.
- Each segment should be keyboard discoverable where practical, or represented in a parallel accessible event list.
- Tooltip/popover content must appear on focus and click, not hover only.
- Use visible focus rings.
- Respect `prefers-reduced-motion`.
- Respect high contrast / forced-colors mode.
- Do not rely on color alone: show text/state chips/legend labels.

## Styling requirements

Use the provided `activity-history-card.css` and `src/styles.ts` as the design baseline. Preserve Home Assistant theme compatibility by relying on HA CSS variables with dark fallback values.

The implementation should look like the mockups:

- dark navy glass surface
- rounded cards
- soft borders
- blue accent controls
- green active duration metrics
- purple music/activity states
- blue climate/cooling states
- orange heating/coffee/appliance states
- yellow open/light state accents where appropriate
- clean Hebrew typography

Do not hard-code a font file. Use HA/theme font variables and system fonts.

## Rendering details

Swimlane MVP:

- Render group headers and entity rows.
- Render x-axis ticks based on range length.
- Render activity segments with rounded rectangles.
- Render inactive state track as subtle background line.
- Render `now` marker when the selected range contains current time.
- Support dense mode for many entities.
- Use `ResizeObserver` to recalculate width.
- Use virtualization or row clipping if more than 80 rows.

Tooltip/popover content:

- entity name
- area
- domain/type
- state/category
- start time
- end time
- duration
- attributes for climate/media when available
- overlapping active entities in same area where possible

Insights:

- total active duration
- event count
- active-now count
- last event
- most active entity
- most active area
- peak time bucket

## Testing requirements

Add unit tests for pure functions:

- intervalization from records into segments
- active-state classification
- merging gaps
- filtering by domain/area/search
- summary duration calculations
- RTL timeline keeps chronological x positions
- unknown/unavailable handling

Add at least simple visual/demo data so the card can be previewed in development without HA.

## Acceptance criteria

A good first implementation is accepted when:

1. It builds with `npm run build`.
2. It registers as `custom:activity-history-card`.
3. It renders a swimlane timeline for 5-50 entities over 24h.
4. It supports Hebrew RTL layout.
5. It supports mobile overview and mobile filter sheet behavior.
6. It supports full-screen/panel display.
7. It filters by entity search, domain/type, area, and active-only/all states.
8. It fetches Home Assistant history efficiently and does not refetch unnecessarily.
9. It cleans subscriptions on disconnect.
10. It handles empty history, unknown, unavailable, and missing Recorder history gracefully.
11. It uses Home Assistant theme CSS variables.
12. It includes clear comments for any non-obvious Home Assistant API behavior.

## Important product behavior

This is not just a pretty chart. It should help the user answer:

- מה היה דולק?
- מתי זה היה דולק?
- באיזה אזור בבית?
- כמה זמן זה פעל?
- מה חפף עם מה?
- איך מסננים מהר רק מזגנים / מוזיקה / אזור מסוים?

Implement the card so that these questions are obvious from the UI.
