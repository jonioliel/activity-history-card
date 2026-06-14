import { formatTime, timeToPercent } from "../format";
import type { TimeRange } from "../types";

export interface TimelineTick {
  time: Date;
  label: string;
  percent: number;
  major: boolean;
}

export interface TimelineAxisModel {
  ticks: TimelineTick[];
  nowPercent?: number;
}

export interface TimelineAxisOptions {
  maxMajorTicks?: number;
  now?: Date;
}

interface MajorTickPlan {
  ticks: TimelineTick[];
  stepMs: number;
}

const HOUR_MS = 60 * 60 * 1000;
const HOUR_STEPS = [1, 2, 3, 4, 6, 8, 12, 24];
const MULTI_DAY_STEPS = [6, 12, 24, 48, 72, 96, 168];

export function buildTimelineAxis(
  range: TimeRange,
  options: TimelineAxisOptions = {},
): TimelineAxisModel {
  const maxMajorTicks = clampInteger(options.maxMajorTicks ?? 8, 2, 10);
  const majorPlan = buildMajorTicks(range, maxMajorTicks);
  const minorTicks = buildMinorTicks(range, majorPlan.stepMs, majorPlan.ticks);
  const ticks = [...minorTicks, ...majorPlan.ticks].sort(
    (a, b) => a.percent - b.percent || Number(b.major) - Number(a.major),
  );
  const now = options.now ?? new Date();
  const nowMs = now.getTime();
  const nowPercent =
    nowMs >= range.start.getTime() && nowMs <= range.end.getTime()
      ? timeToPercent(now, range)
      : undefined;

  return { ticks, nowPercent };
}

function buildMajorTicks(
  range: TimeRange,
  maxMajorTicks: number,
): MajorTickPlan {
  const durationMs = Math.max(1, range.end.getTime() - range.start.getTime());
  const durationHours = durationMs / HOUR_MS;
  const stepMs = chooseMajorStep(durationHours, maxMajorTicks);
  const candidates = [
    range.start,
    ...alignedDatesBetween(range, stepMs),
    range.end,
  ];
  const selected = pickReadableMajorTicks(
    candidates,
    range,
    maxMajorTicks,
    labelFormatter(durationHours),
  );

  return { ticks: selected, stepMs };
}

function chooseMajorStep(durationHours: number, maxMajorTicks: number): number {
  const candidates =
    durationHours <= 30
      ? HOUR_STEPS
      : durationHours <= 24 * 4
        ? MULTI_DAY_STEPS
        : [24, 48, 72, 96, 168, 336];
  const desiredInternalTicks = Math.max(0, maxMajorTicks - 2);

  for (const stepHours of candidates) {
    const count = Math.ceil(durationHours / stepHours) - 1;
    if (count <= desiredInternalTicks) return stepHours * HOUR_MS;
  }

  return (candidates[candidates.length - 1] ?? 24) * HOUR_MS;
}

function alignedDatesBetween(range: TimeRange, stepMs: number): Date[] {
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();
  const dates: Date[] = [];

  for (
    let date = nextLocalAlignedDate(range.start, stepMs);
    date.getTime() < endMs;
    date = addLocalStep(date, stepMs)
  ) {
    if (date.getTime() > startMs) dates.push(new Date(date));
  }

  return dates;
}

function nextLocalAlignedDate(date: Date, stepMs: number): Date {
  const stepHours = stepMs / HOUR_MS;
  if (!Number.isInteger(stepHours) || stepHours < 1) {
    return new Date(Math.ceil(date.getTime() / stepMs) * stepMs);
  }

  if (stepHours >= 24 && stepHours % 24 === 0) {
    const stepDays = stepHours / 24;
    const candidate = new Date(date);
    candidate.setHours(0, 0, 0, 0);
    if (candidate.getTime() <= date.getTime()) {
      candidate.setDate(candidate.getDate() + 1);
    }

    while (localDayIndex(candidate) % stepDays !== 0) {
      candidate.setDate(candidate.getDate() + 1);
    }
    return candidate;
  }

  const candidate = new Date(date);
  candidate.setMinutes(0, 0, 0);
  if (candidate.getTime() <= date.getTime()) {
    candidate.setHours(candidate.getHours() + 1);
  }

  const remainder = candidate.getHours() % stepHours;
  if (remainder !== 0) {
    candidate.setHours(candidate.getHours() + stepHours - remainder);
  }
  candidate.setMinutes(0, 0, 0);
  return candidate;
}

function addLocalStep(date: Date, stepMs: number): Date {
  const stepHours = stepMs / HOUR_MS;
  const next = new Date(date);

  if (Number.isInteger(stepHours) && stepHours >= 24 && stepHours % 24 === 0) {
    next.setDate(next.getDate() + stepHours / 24);
    return next;
  }

  next.setHours(next.getHours() + stepHours);
  return next;
}

function localDayIndex(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) /
      (24 * HOUR_MS),
  );
}

function pickReadableMajorTicks(
  candidates: Date[],
  range: TimeRange,
  maxMajorTicks: number,
  formatLabel: (date: Date) => string,
): TimelineTick[] {
  const uniqueCandidates = uniqueDates(candidates).sort(
    (a, b) => a.getTime() - b.getTime(),
  );
  const minGap = Math.max(7, Math.min(14, 72 / maxMajorTicks));
  const ticks: TimelineTick[] = [];

  for (const candidate of uniqueCandidates) {
    const percent = timeToPercent(candidate, range);
    const tick: TimelineTick = {
      time: candidate,
      label: formatLabel(candidate),
      percent,
      major: true,
    };
    const isStart = candidate.getTime() === range.start.getTime();
    const isEnd = candidate.getTime() === range.end.getTime();

    if (isStart) {
      ticks.push(tick);
      continue;
    }

    if (isEnd) {
      while (
        ticks.length > 1 &&
        percent - ticks[ticks.length - 1]!.percent < minGap
      ) {
        ticks.pop();
      }
      ticks.push(tick);
      continue;
    }

    const previous = ticks[ticks.length - 1];
    if (!previous || percent - previous.percent >= minGap) {
      ticks.push(tick);
    }
  }

  while (ticks.length > maxMajorTicks && ticks.length > 2) {
    ticks.splice(Math.floor(ticks.length / 2), 1);
  }

  return ticks;
}

function buildMinorTicks(
  range: TimeRange,
  majorStepMs: number,
  majorTicks: TimelineTick[],
): TimelineTick[] {
  const minorStepMs = majorStepMs / 2;
  if (minorStepMs < HOUR_MS || majorTicks.length < 2) return [];

  const majorTimes = new Set(
    majorTicks.map((tick) => Math.round(tick.time.getTime() / 1000)),
  );
  return alignedDatesBetween(range, minorStepMs)
    .filter((date) => !majorTimes.has(Math.round(date.getTime() / 1000)))
    .map((date) => ({
      time: date,
      label: "",
      percent: timeToPercent(date, range),
      major: false,
    }));
}

function labelFormatter(durationHours: number): (date: Date) => string {
  if (durationHours <= 48) return formatTime;
  return (date: Date) =>
    new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
}

function uniqueDates(dates: Date[]): Date[] {
  const seen = new Set<number>();
  const unique: Date[] = [];
  for (const date of dates) {
    const time = date.getTime();
    if (seen.has(time)) continue;
    seen.add(time);
    unique.push(date);
  }
  return unique;
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}
