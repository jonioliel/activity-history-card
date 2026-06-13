import "./activity-history-card";
import type { ActivityHistoryCardConfig } from "./types";

class DemoHaIcon extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["icon"];
  }

  connectedCallback(): void {
    this._render();
  }

  attributeChangedCallback(): void {
    this._render();
  }

  private _render(): void {
    const icon = this.getAttribute("icon") ?? "";
    const glyph = icon.includes("thermostat")
      ? "AC"
      : icon.includes("music")
        ? "♪"
        : icon.includes("fan")
          ? "F"
          : icon.includes("cover") || icon.includes("window")
            ? "▤"
            : icon.includes("home")
              ? "⌂"
              : icon.includes("light")
                ? "●"
                : "•";
    this.textContent = glyph;
  }
}

if (!customElements.get("ha-icon")) {
  customElements.define("ha-icon", DemoHaIcon);
}

const root = document.querySelector<HTMLElement>("#demo-root");

const cards: ActivityHistoryCardConfig[] = [
  {
    type: "custom:activity-history-card",
    title: "היסטוריית פעילות חכמה",
    mock_data: true,
    mock_profile: "large_noisy_home",
    display_mode: "panel",
    view_mode: "activity",
    group_by: "area",
    hours_to_show: 24,
    smart_filter: true,
    activity_mode: "meaningful",
    show_inactive_baselines: false,
    min_row_active_seconds: 10,
    max_rows_per_group: 4,
    max_total_rows: 18,
    max_visible_rows: 18,
    show_activity_density: true,
    show_area_inventory: true,
    area_inventory_mode: "compact",
    area_inventory_include_inactive: true,
    area_inventory_max_items: 16,
    show_insights: true,
    debug: false,
  },
  {
    type: "custom:activity-history-card",
    title: "תצוגה קומפקטית",
    mock_data: true,
    display_mode: "card",
    view_mode: "activity",
    hours_to_show: 24,
    max_total_rows: 12,
    max_visible_rows: 12,
    show_area_inventory: true,
    area_inventory_max_items: 10,
    show_insights: false,
  },
  {
    type: "custom:activity-history-card",
    title: "Legacy/debug",
    mock_data: true,
    mock_profile: "large_noisy_home",
    display_mode: "panel",
    view_mode: "legacy_swimlane",
    hours_to_show: 24,
    debug: true,
  },
];

for (const config of cards) {
  const card = document.createElement(
    "activity-history-card",
  ) as HTMLElement & {
    setConfig(config: ActivityHistoryCardConfig): void;
  };
  root?.append(card);
  card.setConfig(config);
}
