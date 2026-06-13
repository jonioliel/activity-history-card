# Implementation Spec — Activity History Card

## Product definition

`activity-history-card` is a Home Assistant Lovelace custom card that visualizes entity activity history over a time range. It is built for users who want to understand what was active, when, and where in the home.

The card should feel native to Home Assistant while offering a richer activity timeline than the built-in history graph.

## Primary MVP

The MVP is the **Swimlane timeline**:

- One row per entity.
- Rows grouped by area by default.
- Horizontal x-axis represents time.
- Colored rounded segments represent active states.
- Inactive track is subtle and visually quiet.
- Hover/focus/tap shows segment details.
- Summary cards show useful totals.
- Filters update the visible rows.

## Non-negotiable design constraints

1. **RTL-first UI** — Hebrew layout must be correct.
2. **Timeline stays chronological** — time math remains left-to-right internally.
3. **Mobile-first behavior** — mobile filter sheet and stacked area cards are required.
4. **Full-screen support** — the card must work well in `panel` dashboards and via its own full-screen button.
5. **Recorder-aware states** — empty/missing history must be explained gracefully.
6. **Efficient data fetching** — avoid repeated heavy history calls.

## Data model

### Input history state

Home Assistant history entries should normalize into:

```ts
interface HistoryStateRecord {
  entity_id: string;
  state: string;
  attributes?: Record<string, unknown>;
  last_changed: string;
  last_updated?: string;
}
```

### Output timeline segment

```ts
interface TimelineSegment {
  entity_id: string;
  state: string;
  category: StateCategory;
  active: boolean;
  start: Date;
  end: Date;
  durationMs: number;
  attributes?: Record<string, unknown>;
}
```

### Row and group

```ts
interface TimelineRow {
  entity: EntityMeta;
  segments: TimelineSegment[];
  totalActiveMs: number;
  eventCount: number;
  currentState?: string;
  currentCategory?: StateCategory;
}

interface TimelineGroup {
  id: string;
  title: string;
  subtitle?: string;
  rows: TimelineRow[];
  totalActiveMs: number;
}
```

## Home Assistant integration

### Custom card lifecycle

Implement:

- `setConfig(config)`
- `set hass(hass)`
- `getCardSize()`
- `getGridOptions()`
- `disconnectedCallback()`

### Data fetching

Use `hass.callWS` for fixed ranges:

```ts
hass.callWS({
  type: "history/history_during_period",
  entity_ids,
  start_time,
  end_time,
  minimal_response: true,
  significant_changes_only: true,
  no_attributes,
});
```

For live mode:

- Prefer `history/stream` subscription when available.
- Fall back to periodic refresh.
- Clean subscription on disconnect.

### Attribute strategy

Use `no_attributes: true` for simple domains.

Fetch attributes when:

- Domain is `climate`.
- Entity config includes `attributes`.
- Entity config includes `active_attributes`.
- State classification requires attributes.

A robust implementation should split requests into two batches when mixed entities are present.

## Intervalization details

### Boundary behavior

A state record means “this state was valid from `last_changed` until the next change.” Therefore:

- Segment start = current record time.
- Segment end = next record time, or selected range end.
- Clamp every segment to selected range.

### Edge cases

- First record starts before the selected range: clamp start to range start.
- No records in range: use current state only if it is known and reliable, or show no history state.
- `unknown` and `unavailable`: render subtly, do not count as active.
- Duplicate states: dedupe before segment creation.
- Very short segments: optionally hide visually, but do not corrupt raw history.
- Daylight saving time: use `Date` timestamps for math, local formatting only for labels.

## Rendering architecture

### Recommended approach

Use a hybrid DOM + SVG/absolute layout:

- DOM for header, filters, summaries, groups, labels.
- SVG or positioned elements for timeline bars.
- Use `ResizeObserver` to adapt axis width.
- Use CSS class names from `activity-history-card.css`.

### Why not only canvas for MVP

Canvas is fast but weaker for accessibility and tooltips. Start with SVG/DOM. Add canvas virtualization later if the row count becomes very high.

## Configuration defaults

Sensible defaults:

```ts
hours_to_show: 24;
live: true;
rtl: auto;
display_mode: card;
group_by: area;
show_summary: true;
show_insights: true;
show_now_line: true;
show_legend: true;
show_fullscreen_button: true;
significant_changes_only: true;
minimal_response: true;
min_duration_seconds: 20;
merge_gap_seconds: 15;
mobile_breakpoint: 760;
```

## Filter behavior

Filters should operate in two layers:

1. **Entity-level filters** — domain, area, entity list, search.
2. **Segment-level filters** — active-only, state categories, min duration.

Entity filters can reuse cached history. Time range changes require refetch.

## Insights calculations

Calculate:

- Total active duration.
- Count of active segments/events.
- Active now count.
- Last active event.
- Most active entity.
- Most active area.
- Peak time bucket.

Peak bucket can start simple: sum active duration by hour of segment start. Later, split segments across buckets for more accuracy.

## Full-screen implementation

When the user clicks “מסך מלא”:

1. Toggle internal full-screen state.
2. Try `requestFullscreen()`.
3. If browser rejects or does not support it, keep CSS overlay fallback.
4. Escape key exits.
5. Respect safe-area insets.

## Empty/error states

Show clear messages:

- No entities configured.
- No Recorder history found.
- Entity excluded from Recorder.
- History API failed.
- Time range invalid.

## Performance expectations

MVP target:

- 5-50 entities over 24h smoothly.
- 100 entities with dense mode acceptable.
- History requests debounced and cached.
- Avoid large rerenders on every HA state update.

## Future modes

### Heatmap

- Rows = areas or domains.
- Columns = time buckets.
- Color intensity = active duration/events.

### Detail

- One entity deep-dive.
- Active duration, cycles, longest run.
- Attribute overlays for climate/media.
- Event log.

### Correlation

- Show overlap between related entities.
- Useful for “AC + music + lights” patterns.
- Add event log alongside timeline.
