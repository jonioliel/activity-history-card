export type HistoryRefreshReason =
  | "initial"
  | "config"
  | "range"
  | "entities"
  | "interval"
  | "timer"
  | "manual";

export interface HassRefreshDecisionInput {
  hasFetchedOnce: boolean;
  live: boolean;
  lastHistoryFetchAt: number;
  now: number;
  refreshIntervalSeconds: number;
}

export function normalizeRefreshIntervalSeconds(
  value: number | undefined,
): number {
  if (!Number.isFinite(value) || !value) return 300;
  return Math.max(30, Math.floor(value));
}

export function shouldRefreshFromHassSetter(
  input: HassRefreshDecisionInput,
): boolean {
  if (!input.hasFetchedOnce) return true;
  if (!input.live) return false;
  const intervalMs =
    normalizeRefreshIntervalSeconds(input.refreshIntervalSeconds) * 1000;
  return input.now - input.lastHistoryFetchAt >= intervalMs;
}
