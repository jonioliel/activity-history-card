# Activity History Card

Home Assistant Lovelace custom card for a Hebrew/RTL-friendly activity history dashboard.

The main MVP view is `view_mode: activity`: a compact desktop/mobile dashboard with a density strip, area swimlanes, meaningful activity rows, an area inventory drawer, and an insights panel. Mock data is never shown unless `mock_data: true` is configured explicitly.

Repository: <https://github.com/jonioliel/activity-history-card>

## Install With HACS

1. Open HACS.
2. Add this repository as a custom repository:

```text
https://github.com/jonioliel/activity-history-card
```

3. Choose category `Dashboard`.
4. Install the card.
5. If Home Assistant does not add the resource automatically, add:

```text
/hacsfiles/activity-history-card/activity-history-card.js
```

Resource type: `JavaScript Module`.

## Visual Test YAML

Use this first to verify that the desktop mockup 05 shell renders correctly, without relying on Home Assistant Recorder data:

```yaml
type: custom:activity-history-card
title: Mockup 05 visual preview
view_mode: activity
display_mode: panel
desktop_density: compact
fullscreen_behavior: fixed_overlay
mock_data: true
mock_profile: mockup05_visual
hours_to_show: 24
group_by: area
show_summary: true
show_insights: true
show_activity_density: true
show_area_inventory: true
area_inventory_mode: compact
timeline_height: calc(100svh - 310px)
timeline_axis_density: comfortable
```

This mode is a static visual reference. It is intended for layout QA only.

## Real Home Assistant YAML

Use this for real entities and real Recorder history:

```yaml
type: custom:activity-history-card
title: היסטוריית פעילות חכמה
view_mode: activity
display_mode: panel
desktop_density: compact
fullscreen_behavior: fixed_overlay
mock_data: false
auto_discover: true
live: false
refresh_interval_seconds: 300
hours_to_show: 24
group_by: area
smart_filter: true
activity_mode: meaningful
hide_empty_rows: true
hide_empty_groups: true
show_inactive_baselines: false
min_row_active_seconds: 10
max_rows_per_group: 4
max_total_rows: 18
max_visible_rows: 18
show_summary: true
show_insights: true
show_activity_density: true
show_area_inventory: true
area_inventory_mode: compact
area_inventory_include_inactive: true
area_inventory_max_items: 12
area_inventory_group_by_domain: true
area_inventory_show_state: true
area_inventory_show_last_activity: true
timeline_height: calc(100svh - 310px)
timeline_axis_density: comfortable
summary_scope: visible
debug: false
filters:
  show: true
  show_search: true
  show_area_chips: false
  show_domain_chips: false
  show_state_mode: false
domains:
  - light
  - switch
  - climate
  - media_player
  - cover
  - fan
exclude_labels:
  - לא להצגה
  - רכיבים מוגנים
```

Default auto discovery is conservative. If `domains` is not configured, the card defaults to:

```yaml
light
switch
climate
media_player
cover
fan
```

Noisy domains like `binary_sensor`, `sensor`, `input_boolean`, `lock`, `vacuum`, and router-style technical entities are not part of the first real-world default.

## Desktop Layout Options

Use `desktop_density` to control how close the desktop panel is to mockup 05:

```yaml
desktop_density: compact # comfortable | compact | ultra_compact
```

`compact` is the default for the activity/panel MVP. It keeps active areas short, shows up to four row lanes per area, renders quiet areas as small summaries, and opens all-area inventory in a side drawer instead of growing the timeline.

Fullscreen defaults to a fixed overlay:

```yaml
fullscreen_behavior: fixed_overlay # card | browser_fullscreen | fixed_overlay
```

The button still tries native browser fullscreen when available, but the overlay class lets the card visually cover Home Assistant chrome when the browser blocks fullscreen.

## Manual Entities

If you prefer full control, disable auto discovery:

```yaml
type: custom:activity-history-card
view_mode: activity
mock_data: false
auto_discover: false
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
  - entity: media_player.living_room
    name: רמקול סלון
    area: סלון
    active_states: ["playing"]
```

## Labels

You can include or exclude entities by Home Assistant labels:

```yaml
exclude_labels:
  - לא להצגה
  - רכיבים מוגנים
include_labels:
  - להצגה בלוח ראשי
```

`exclude_labels` wins over `include_labels`.

## Debug

If the card does not show real data, temporarily enable:

```yaml
debug: true
```

The diagnostics panel shows resolved entity count, history record count, timeline segment count, active filters, request range, cache hit/miss, fetch duration, refresh interval, and whether the card is in initial load or background refresh.

## Local Development

```bash
npm install
npm run demo
npm run format:check
npm run typecheck
npm run test
npm run build
```

`npm run demo` now includes:

- static `mockup05_visual` preview
- large noisy mock home
- single-area inventory preview
- legacy raw comparison

The HACS file is intentionally tracked:

```text
dist/activity-history-card.js
```

Run `npm run build` and commit the updated dist file after source changes.

## Current MVP Limits

- `activity` is the active MVP view.
- `activity_legacy` and `legacy_swimlane` remain for comparison/debugging.
- Heatmap, drill-down, detail, and correlation are still placeholders.
- The timeline axis remains chronological left-to-right; labels, filters, cards, tooltips, and mobile UI remain RTL-friendly.
- Real history depends on Home Assistant Recorder data for the selected entities.
