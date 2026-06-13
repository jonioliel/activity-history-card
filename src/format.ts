import type {
  ActivityHistoryCardConfig,
  DirectionOption,
  TimeRange,
} from "./types";

const RTL_LANG_PREFIXES = ["ar", "fa", "he", "iw", "ur"];

export function getDomain(entityId: string): string {
  return entityId.includes(".")
    ? (entityId.split(".")[0] ?? entityId)
    : entityId;
}

export function normalizeEntityConfig(
  entity: string | { entity: string; [key: string]: unknown },
) {
  return typeof entity === "string" ? { entity } : entity;
}

export function resolveTimeRange(
  config: ActivityHistoryCardConfig,
  now = new Date(),
): TimeRange {
  if (config.start_time) {
    const start = new Date(config.start_time);
    const end = config.end_time ? new Date(config.end_time) : now;
    return { start, end };
  }

  const hours = config.hours_to_show ?? 24;
  const end = config.end_time ? new Date(config.end_time) : now;
  const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
  return { start, end };
}

export function isRtl(
  direction: DirectionOption | undefined,
  language?: string,
): boolean {
  if (direction === true || direction === "rtl") return true;
  if (direction === false || direction === "ltr") return false;
  const lang = (
    language ||
    document.documentElement.lang ||
    navigator.language ||
    ""
  ).toLowerCase();
  return RTL_LANG_PREFIXES.some(
    (prefix) => lang === prefix || lang.startsWith(`${prefix}-`),
  );
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0 דק׳";
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes)
    return `${hours}:${String(minutes).padStart(2, "0")} שעות`;
  if (hours) return `${hours} שעות`;
  return `${minutes} דק׳`;
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function timeToPercent(date: Date, range: TimeRange): number {
  const total = range.end.getTime() - range.start.getTime();
  if (total <= 0) return 0;
  return clamp(
    ((date.getTime() - range.start.getTime()) / total) * 100,
    0,
    100,
  );
}

export function humanizeEntityId(entityId: string): string {
  const [, objectId = entityId] = entityId.split(".");
  return objectId.replace(/_/g, " ");
}
