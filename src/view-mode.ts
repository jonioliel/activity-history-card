import { DEFAULT_CONFIG } from "./defaults";
import type { ActivityHistoryCardConfig, ViewMode } from "./types";

export type RendererMode =
  | "activity"
  | "legacy_swimlane"
  | "heatmap"
  | "detail"
  | "correlation";

export function resolveRendererMode(
  config: ActivityHistoryCardConfig,
  showAllRows = false,
): RendererMode {
  const viewMode: ViewMode =
    config.view_mode ?? config.default_view ?? DEFAULT_CONFIG.view_mode;

  if (showAllRows && viewMode === "activity") return "legacy_swimlane";
  if (viewMode === "legacy_swimlane") return "legacy_swimlane";
  if (viewMode === "swimlane" && config.timeline_style === "legacy") {
    return "legacy_swimlane";
  }
  if (viewMode === "heatmap") return "heatmap";
  if (viewMode === "detail") return "detail";
  if (viewMode === "correlation") return "correlation";
  return "activity";
}
