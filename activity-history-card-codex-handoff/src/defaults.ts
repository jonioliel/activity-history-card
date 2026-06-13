import type { ActivityHistoryCardConfig, StateCategory } from "./types";

export const DEFAULT_ACTIVE_STATES: Record<string, string[]> = {
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

export const DEFAULT_ACTIVE_ATTRIBUTES: Record<string, Record<string, string[]>> = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"],
  },
};

export const DEFAULT_COLORS: Record<StateCategory, string> = {
  on: "var(--ahc-on)",
  off: "var(--ahc-off)",
  cooling: "var(--ahc-cooling)",
  heating: "var(--ahc-heating)",
  playing: "var(--ahc-playing)",
  opening: "var(--ahc-opening)",
  closing: "var(--ahc-closing)",
  idle: "var(--ahc-idle)",
  unknown: "var(--ahc-unknown)",
};

export const DEFAULT_CONFIG: Required<
  Pick<
    ActivityHistoryCardConfig,
    | "title"
    | "hours_to_show"
    | "live"
    | "display_mode"
    | "group_by"
    | "show_summary"
    | "show_insights"
    | "show_now_line"
    | "show_legend"
    | "show_fullscreen_button"
    | "significant_changes_only"
    | "minimal_response"
    | "min_duration_seconds"
    | "merge_gap_seconds"
    | "mobile_breakpoint"
  >
> = {
  title: "היסטוריית פעילות חכמה",
  hours_to_show: 24,
  live: true,
  display_mode: "card",
  group_by: "area",
  show_summary: true,
  show_insights: true,
  show_now_line: true,
  show_legend: true,
  show_fullscreen_button: true,
  significant_changes_only: true,
  minimal_response: true,
  min_duration_seconds: 20,
  merge_gap_seconds: 15,
  mobile_breakpoint: 760,
};

export const DOMAIN_LABELS_HE: Record<string, string> = {
  light: "תאורה",
  switch: "מתגים",
  climate: "מזגנים",
  media_player: "מוזיקה",
  cover: "תריסים",
  fan: "מאווררים",
  vacuum: "שואבים",
};

export const CATEGORY_LABELS_HE: Record<StateCategory, string> = {
  on: "דלוק",
  off: "כבוי",
  cooling: "קירור",
  heating: "חימום",
  playing: "מנגן",
  opening: "פתוח",
  closing: "נסגר",
  idle: "המתנה",
  unknown: "לא ידוע",
};
