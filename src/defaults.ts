import type { ActivityHistoryCardConfig, StateCategory } from "./types";

export const DEFAULT_ACTIVE_STATES: Record<string, string[]> = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  input_boolean: ["on"],
  binary_sensor: ["on"],
  media_player: ["playing"],
  climate: ["cool", "heat", "heat_cool", "dry", "fan_only"],
  humidifier: ["on"],
  vacuum: ["cleaning", "returning"],
  cover: ["opening", "closing"],
  lock: ["locking", "unlocking"],
};

export const DEFAULT_ACTIVE_ATTRIBUTES: Record<
  string,
  Record<string, string[]>
> = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"],
  },
};

export const DEFAULT_COLORS: Record<StateCategory, string> = {
  on: "var(--ahc-on)",
  off: "var(--ahc-off)",
  cooling: "var(--ahc-cooling)",
  heating: "var(--ahc-heating)",
  drying: "var(--ahc-idle)",
  fan: "var(--ahc-idle)",
  playing: "var(--ahc-playing)",
  opening: "var(--ahc-opening)",
  closing: "var(--ahc-closing)",
  idle: "var(--ahc-idle)",
  unknown: "var(--ahc-unknown)",
  unavailable: "var(--ahc-unknown)",
};

export const DEFAULT_CONFIG: Required<
  Pick<
    ActivityHistoryCardConfig,
    | "title"
    | "auto_discover"
    | "debug"
    | "hours_to_show"
    | "live"
    | "display_mode"
    | "desktop_density"
    | "fullscreen_behavior"
    | "view_mode"
    | "group_by"
    | "show_summary"
    | "show_insights"
    | "show_now_line"
    | "show_legend"
    | "show_fullscreen_button"
    | "significant_changes_only"
    | "minimal_response"
    | "refresh_interval_seconds"
    | "min_duration_seconds"
    | "merge_gap_seconds"
    | "max_visible_rows"
    | "activity_density_buckets"
    | "show_activity_density"
    | "smart_filter"
    | "activity_mode"
    | "hide_empty_rows"
    | "hide_empty_groups"
    | "min_row_active_seconds"
    | "max_rows_per_group"
    | "max_total_rows"
    | "show_technical_entities"
    | "show_config_entities"
    | "show_diagnostic_entities"
    | "show_inactive_baselines"
    | "show_entity_id_when_name_missing"
    | "summary_scope"
    | "collapse_groups"
    | "show_area_inventory"
    | "area_inventory_mode"
    | "area_inventory_include_inactive"
    | "area_inventory_max_items"
    | "area_inventory_group_by_domain"
    | "area_inventory_show_state"
    | "area_inventory_show_last_activity"
    | "timeline_height"
    | "timeline_axis_density"
    | "debug_timeline_geometry"
    | "mobile_breakpoint"
  >
> = {
  title: "היסטוריית פעילות חכמה",
  auto_discover: true,
  debug: false,
  hours_to_show: 24,
  live: false,
  display_mode: "card",
  desktop_density: "compact",
  fullscreen_behavior: "fixed_overlay",
  view_mode: "activity",
  group_by: "area",
  show_summary: true,
  show_insights: true,
  show_now_line: true,
  show_legend: true,
  show_fullscreen_button: true,
  significant_changes_only: true,
  minimal_response: true,
  refresh_interval_seconds: 300,
  min_duration_seconds: 20,
  merge_gap_seconds: 15,
  max_visible_rows: 18,
  activity_density_buckets: 0,
  show_activity_density: true,
  smart_filter: true,
  activity_mode: "meaningful",
  hide_empty_rows: true,
  hide_empty_groups: true,
  min_row_active_seconds: 10,
  max_rows_per_group: 4,
  max_total_rows: 18,
  show_technical_entities: false,
  show_config_entities: false,
  show_diagnostic_entities: false,
  show_inactive_baselines: false,
  show_entity_id_when_name_missing: false,
  summary_scope: "visible",
  collapse_groups: false,
  show_area_inventory: true,
  area_inventory_mode: "compact",
  area_inventory_include_inactive: true,
  area_inventory_max_items: 12,
  area_inventory_group_by_domain: true,
  area_inventory_show_state: true,
  area_inventory_show_last_activity: true,
  timeline_height: "calc(100svh - 320px)",
  timeline_axis_density: "comfortable",
  debug_timeline_geometry: false,
  mobile_breakpoint: 760,
};

export const DOMAIN_LABELS_HE: Record<string, string> = {
  light: "תאורה",
  switch: "מתגים",
  binary_sensor: "חיישנים",
  input_boolean: "מתגים וירטואליים",
  climate: "מזגנים",
  media_player: "מוזיקה",
  cover: "תריסים",
  fan: "מאווררים",
  humidifier: "לחות",
  vacuum: "שואבים",
  lock: "מנעולים",
};

export const DEFAULT_DISCOVERY_DOMAINS = [
  "light",
  "switch",
  "climate",
  "media_player",
  "cover",
  "fan",
];

export const CATEGORY_LABELS_HE: Record<StateCategory, string> = {
  on: "דלוק",
  off: "כבוי",
  cooling: "קירור",
  heating: "חימום",
  drying: "ייבוש",
  fan: "מאוורר",
  playing: "מנגן",
  opening: "פתוח",
  closing: "נסגר",
  idle: "המתנה",
  unknown: "לא ידוע",
  unavailable: "לא זמין",
};
