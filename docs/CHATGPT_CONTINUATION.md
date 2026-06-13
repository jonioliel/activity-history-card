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
- Swimlane timeline grouped by area or domain
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
- `src/renderers/swimlane-renderer.ts` - MVP timeline renderer
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
- `npm run test` passed, 18 tests
- `npm run build` passed

The generated `dist/activity-history-card.js` is intentionally tracked for HACS. `dist/activity-history-card.js.map` remains ignored.

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
mock_data: false
auto_discover: true
display_mode: panel
hours_to_show: 24
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
Do not implement heatmap, drill-down, or correlation until the swimlane MVP is stable.

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
5. Improve tooltip/popover behavior for touch.
6. Add more tests for RTL chronological x positions and complex filter combinations.
7. Only after the MVP works in a real dashboard, plan drill-down/detail mode.
