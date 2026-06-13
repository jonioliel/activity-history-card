# ChatGPT / Codex Continuation Notes

This file preserves the working context for future ChatGPT or Codex sessions.
Use it together with `AGENTS.md` and `CODEX_PROMPT.md`.

## Project

Repository: `jonioliel/activity-history-card`

Project root is the repository root. Do not work inside any nested handoff folder.

Card type:

```yaml
type: custom:activity-history-card
```

Technology:

- Lit
- TypeScript
- Vite
- Native Web Components
- Home Assistant Lovelace custom card APIs
- No React

## Current MVP Status

The first MVP is implemented and has been stabilized for real Home Assistant usage.

Implemented:

- `custom:activity-history-card` registration
- Home Assistant API surface:
  - `setConfig(config)`
  - `set hass(hass)`
  - `getCardSize()`
  - `getGridOptions()`
  - `disconnectedCallback()`
- Mock data mode with `mock_data: true`; mock data must not be used unless explicitly configured
- Automatic discovery with `auto_discover: true` for entities assigned to Home Assistant areas
- Label filtering with `include_labels` and `exclude_labels`
- Home Assistant history fetching via `history/history_during_period`
- Real Home Assistant discovery through area, device, entity, and label registries when available
- Graceful fallback and diagnostics when registries are unavailable
- Conservative mock behavior: `mock_data: false` never generates mock entities
- Default `activity` dashboard timeline grouped by area or domain
- Previous activity renderer remains available through `view_mode: activity_legacy`
- Legacy swimlane renderer remains available through `view_mode: legacy_swimlane`
- RTL-friendly Hebrew UI
- Chronological left-to-right timeline internals
- Filters:
  - time preset
  - area
  - domain/entity type
  - search query
  - all states / active-only / currently active
- Mobile overview styling based on `mockups/06-mobile-overview-rtl.png`
- Mobile advanced filter sheet based on `mockups/07-mobile-advanced-filter-sheet-rtl.png`
- Desktop/panel styling based on `mockups/05-desktop-fullscreen-rtl-panel.png`
- Full-screen mode using native Fullscreen API with CSS fallback
- Loading, error, and empty states
- Specific empty states for:
  - no entities selected
  - no resolved entities
  - no history returned
  - malformed/unusable history
  - all entities filtered out
- `debug: true` diagnostics panel with entity, history, timeline, filter, cache, range, attribute-request, and registry information
- Debounced history reloads, stale request protection, and range/entity/options cache
- Split history requests for entities that need attributes and entities that can use minimal history
- Controlled refresh lifecycle that avoids fetching on every `hass` setter call
- `refresh_interval_seconds` with quiet default of 300 seconds
- Background refresh indicator that keeps the existing timeline visible
- Manual refresh button
- Conservative auto-discovery defaults: `light`, `switch`, `climate`, `media_player`, `cover`, `fan`
- `include_entity_globs`, `exclude_entity_globs`, and `exclude_domains`
- Cover `open` is not counted as active by default; `opening` and `closing` are active
- Summary distinguishes summed entity-hours from active entity count
- Last-event summary and insights prefer friendly names
- Desktop filters are compact; mobile keeps the advanced filter bottom sheet
- Smart row curation is enabled by default with `smart_filter: true`
- `view_mode: activity` now separates `activityRows` from `inventoryItems`
- Each area card can show a compact accessory inventory including inactive normal entities
- Area inventory options are available through `show_area_inventory` and `area_inventory_*`
- Inventory chip clicks fire Home Assistant `hass-more-info`
- Empty rows, tiny activity rows, registry `config`/`diagnostic` rows, and noisy technical rows are hidden by default
- Manual `entities:` are protected from smart filtering unless explicitly excluded
- A session-level "כל האביזרים" / "פעילות בלבד" toggle expands area inventories without switching to legacy rows
- `debug: true` includes smart curation counts and hidden-reason diagnostics
- UI polish pass for the stable activity MVP:
  - body grid is rendered through a dedicated structure
  - desktop summary is limited to four cleaner cards
  - last event appears as a compact header pill
  - segment click/tap/focus opens a popover, not a drill-down page
  - timeline supports `max_visible_rows`, `timeline_height`, `collapse_groups`, and `default_collapsed_groups`
  - row density switches to dense/ultra-dense for long lists
  - insights use friendly names and show a short usage pattern card
- Placeholder renderers only for heatmap, detail, and correlation
- HACS custom repository metadata via `hacs.json`
- HACS-installable bundle at `dist/activity-history-card.js`

Do not implement heatmap, entity drill-down, or correlation mode until the MVP is stable in Home Assistant.

## Important Files

- `src/activity-history-card.ts` - main Lit card
- `src/mock-data.ts` - mock dataset for preview without Home Assistant history
- `src/history-client.ts` - Home Assistant history client
- `src/entity-resolver.ts` - entity config and HA state resolution
- `src/intervalize.ts` - pure history-to-segments logic
- `src/filters.ts` - filtering and grouping logic
- `src/summary.ts` - activity summary calculations
- `src/activity-dashboard-model.ts` - default activity dashboard data model
- `src/renderers/activity-dashboard-renderer.ts` - default activity dashboard renderer
- `src/renderers/activity-timeline-renderer.ts` - previous activity renderer, now `activity_legacy`
- `src/renderers/swimlane-renderer.ts` - legacy/debug timeline renderer
- `src/styles.ts` - visual baseline and responsive RTL styling
- `activity-history-card.css` - original CSS baseline reference
- `mockups/` - visual targets
- `sample-config.yaml` - example Lovelace YAML
- `hacs.json` - HACS metadata
- `dist/activity-history-card.js` - built JS bundle used by HACS

## Verified Commands

The Windows machine used for this work did not have `npm` on PATH. A temporary npm CLI was used with the bundled Codex Node runtime.

Expected project commands:

```bash
npm install
npm run typecheck
npm run test
npm run build
```

Latest verified results:

- `npm run typecheck` passed
- `npm run test` passed, 92 tests
- `npm run build` passed

The generated `dist/activity-history-card.js` is intentionally tracked for HACS. `dist/activity-history-card.js.map` remains ignored.

## Latest Activity Renderer Pass

The latest pass changed the default view from raw swimlane rows to a polished activity dashboard without adding heatmap/detail/correlation modes:

- `view_mode: activity` is the recommended default.
- `view_mode: activity_legacy` keeps the previous activity renderer for short-term comparison.
- `view_mode: legacy_swimlane` keeps the old dense/raw renderer for debugging.
- The activity dashboard shows a top density strip, compact area cards, aggregate group bands, active rows only, and active segments only.
- Area cards include a compact inventory section for all normal accessories in that area.
- The "כל האביזרים" toggle expands area inventories. Raw row inspection remains under `view_mode: legacy_swimlane`.
- Empty/off baselines are not rendered by default.
- Default `max_visible_rows`/`max_total_rows` is `18`, with `max_rows_per_group: 4` and `min_row_active_seconds: 10`.
- `show_activity_density: true` is enabled by default.

## HACS Install Path

Use HACS as a custom repository:

1. Open HACS.
2. Open Custom repositories.
3. Repository: `https://github.com/jonioliel/activity-history-card`
4. Category: Dashboard.
5. Download the card.
6. Add a Lovelace card with automatic area discovery:

```yaml
type: custom:activity-history-card
view_mode: activity
mock_data: false
auto_discover: true
display_mode: panel
hours_to_show: 24
smart_filter: true
activity_mode: meaningful
show_inactive_baselines: false
max_rows_per_group: 4
max_total_rows: 18
show_activity_density: true
show_area_inventory: true
area_inventory_mode: compact
area_inventory_include_inactive: true
exclude_labels:
  - לא להצגה
  - רכיבים מוגנים
```

For preview without Home Assistant Recorder data, explicitly use:

```yaml
type: custom:activity-history-card
mock_data: true
display_mode: panel
```

If the card shows generic areas such as סלון, מטבח, and חדרי ילדים that do not match the user's home, check for `mock_data: true` in the Lovelace YAML.

## Safe Continuation Prompt

Paste this into a new ChatGPT/Codex session when continuing development:

```text
Read AGENTS.md, CODEX_PROMPT.md, and docs/CHATGPT_CONTINUATION.md first.

Repository root is the project root. Do not work inside nested handoff folders.

Continue the Home Assistant Lovelace custom card custom:activity-history-card.
Preserve first-class RTL support and HACS compatibility.
Do not implement heatmap, drill-down, or correlation until the activity MVP is stable.

Before changing code, inspect git status, package.json, src/activity-history-card.ts, src/styles.ts, and the relevant mockups.
After changes, run npm run typecheck, npm run test, and npm run build.
Keep dist/activity-history-card.js updated because HACS installs it.
Preserve auto_discover and label filtering behavior unless the user asks to change it.
Summarize changed files and Home Assistant testing steps.
```

## Suggested Next Steps

1. Test the HACS installation inside Home Assistant.
2. Verify the card loads as a resource and renders with `mock_data: true`.
3. Test real `entities` from `sample-config.yaml`.
4. Test `debug: true` against a real Home Assistant instance when no data appears.
5. Test that repeated Home Assistant state updates do not flicker the card.
6. Verify that area inventory names match friendly names in real Home Assistant.
7. Improve tooltip/popover behavior for touch.
8. Add more tests for RTL chronological x positions and complex filter combinations.
9. Only after the MVP works in a real dashboard, plan drill-down/detail mode.
