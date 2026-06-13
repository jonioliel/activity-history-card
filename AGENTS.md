# Activity History Card — Codex Instructions

Build a production-ready Home Assistant Lovelace custom card named `activity-history-card`.

Use:
- TypeScript
- Lit
- Vite
- Native Web Components
- Home Assistant Lovelace custom card APIs

Do not use React.

Main priorities:
1. Reliable Home Assistant custom card behavior.
2. Full RTL support, especially Hebrew.
3. Excellent mobile layout.
4. Swimlane activity timeline grouped by area.
5. Filtering by time, area, entity type, entity list, active-only, and search.
6. Full-screen / panel-view-friendly mode.
7. Clean dark Home Assistant design based on the provided mockups.

Required Home Assistant card methods:
- setConfig(config)
- set hass(hass)
- getCardSize()
- getGridOptions()
- disconnectedCallback()

MVP scope:
- mock data mode
- real history client architecture
- swimlane timeline
- RTL layout
- mobile overview
- mobile advanced filter sheet
- loading, error, empty states
- build must pass

Do not implement heatmap, entity drill-down, or correlation mode until the MVP works.
