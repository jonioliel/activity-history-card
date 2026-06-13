# Activity History Card - Codex Development Brief

## Goal

Build a Home Assistant Lovelace custom card that visualizes entity activity over a selected time range. The card should make it easy to understand when each component was active, in which area, and how activity overlaps across switches, lights, climate devices, media players and similar entities.

## Core UI modes

1. **Swimlane timeline** - one row per entity, grouped by area/type. Best MVP.
2. **Area heatmap** - one row per area, columns by hour or time bucket.
3. **Entity drill-down** - details for one entity, including durations, state transitions and optional numeric overlays.
4. **Correlation timeline** - grouped by domain/type with event log and overlap tooltip.

## Home Assistant data strategy

Use the Home Assistant frontend `hass` object from the custom card.

Recommended runtime calls:

```ts
// Fixed date range
hass.callWS({
  type: "history/history_during_period",
  entity_ids: entityIds,
  start_time: start.toISOString(),
  end_time: end.toISOString(),
  minimal_response: true,
  significant_changes_only: true,
  no_attributes: !needsAttributes(entityIds),
});
```

```ts
// Live rolling window
this._unsub = await hass.connection.subscribeMessage(
  (message) => this._handleHistory(message.states),
  {
    type: "history/stream",
    entity_ids: entityIds,
    start_time: start.toISOString(),
    end_time: end?.toISOString(),
    minimal_response: true,
    significant_changes_only: true,
    no_attributes: !needsAttributes(entityIds),
  },
  { resubscribe: false },
);
```

REST fallback for diagnostics only:

```text
GET /api/history/period/<start>?end_time=<end>&filter_entity_id=a,b,c&minimal_response&no_attributes&significant_changes_only
```

## Entity active-state defaults

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
  cover: ["opening", "closing"],
};

const CLIMATE_ACTIVE_ACTIONS = ["cooling", "heating", "drying", "fan"];
```

For `climate`, `humidifier`, `water_heater`, `person`, `device_tracker`, and any domain that needs state attributes, set `no_attributes: false` or selectively fetch with attributes. For `climate`, keep attributes such as `hvac_action`, `current_temperature`, `temperature`, `target_temp_low`, `target_temp_high`, `humidity`.

## Intervalization algorithm

1. Normalize HA history records into `{ entity_id, state, attributes, ts }`.
2. Sort by timestamp per entity.
3. Deduplicate sequential records with the same effective state.
4. For each record, create a segment from its timestamp to the next record timestamp.
5. Clamp segment start/end to the selected range.
6. Classify segment as active/inactive/unknown based on domain mapping and config overrides.
7. Merge adjacent segments with same classification if the gap is smaller than `merge_gap_seconds`.
8. Drop segments shorter than `min_duration_seconds` when configured.
9. Compute summaries: total active duration, activation count, longest run, last active.

## Suggested config schema

```yaml
type: custom:activity-history-card
title: היסטוריית פעילות הבית
hours_to_show: 24
live: true
group_by: area # area | domain | floor | custom | none
view_mode: swimlane # swimlane | heatmap | detail | correlation
bucket_minutes: 60
min_duration_seconds: 20
show_now_line: true
show_summary: true
significant_changes_only: true
entities:
  - entity: switch.kitchen_coffee_machine
    name: מכונת קפה
    area: מטבח
    active_states: ["on"]
  - entity: climate.living_room_ac
    name: מזגן סלון
    area: סלון
    active_states: ["cool", "heat"]
    active_attributes:
      hvac_action: ["cooling", "heating"]
    attributes: ["current_temperature", "temperature", "hvac_action"]
  - entity: media_player.living_room_spotify
    name: Spotify סלון
    area: סלון
    active_states: ["playing"]
colors:
  on: "var(--success-color)"
  cooling: "#38bdf8"
  heating: "#fb923c"
  playing: "#a78bfa"
```

## File structure for MVP

```text
src/
  activity-history-card.ts
  activity-history-card-editor.ts
  history-client.ts
  entity-resolver.ts
  intervalize.ts
  summary.ts
  renderers/
    swimlane-renderer.ts
    heatmap-renderer.ts
    detail-renderer.ts
    correlation-renderer.ts
  styles.ts
  types.ts
```

## Implementation notes

- Use a custom element, preferably Lit + TypeScript.
- Render with SVG for MVP; switch body rows to canvas only if many entities cause performance issues.
- Virtualize rows when entity count is high.
- Use `hass.formatEntityName` where available, and fall back to `friendly_name`.
- Use Home Assistant CSS variables so the card matches themes.
- Provide `getCardSize()` and `getGridOptions()`.
- Provide `window.customCards.push(...)`; for Home Assistant 2026.6+ include `getEntitySuggestion` so the card appears in the card picker when relevant.
- Add a visual editor later; MVP can be YAML-only.

## Acceptance criteria

- Works with 5-50 entities in a 24h window.
- Clearly shows active intervals for binary, climate and media entities.
- Shows group headers by area.
- Supports rolling `hours_to_show` and explicit `start_time`/`end_time`.
- Tooltips show entity name, area, state, start, end, duration and overlapping entities.
- Handles `unknown`/`unavailable` gracefully.
- Does not fetch attributes unless the domain requires them.
- Cleans WebSocket subscriptions in `disconnectedCallback()`.
