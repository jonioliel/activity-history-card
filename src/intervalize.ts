import { DEFAULT_ACTIVE_ATTRIBUTES, DEFAULT_ACTIVE_STATES } from "./defaults";
import { getDomain } from "./format";
import type {
  ActivityHistoryCardConfig,
  EntityMeta,
  HassEntity,
  HistoryStateRecord,
  StateCategory,
  TimelineRow,
  TimelineSegment,
  TimeRange,
} from "./types";

export function intervalizeHistory(
  historyByEntity: Record<string, HistoryStateRecord[]>,
  entities: EntityMeta[],
  range: TimeRange,
  config: ActivityHistoryCardConfig,
  currentStates: Record<string, HassEntity> = {},
): TimelineRow[] {
  return entities.map((entity) => {
    const records = withCurrentStateBoundary(historyByEntity[entity.entity_id] ?? [], currentStates[entity.entity_id], range, entity.entity_id)
      .filter((record) => record.state != null && record.last_changed)
      .sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());

    const deduped = dedupeRecords(records);
    const segments = recordsToSegments(deduped, entity, range, config);
    const activeSegments = segments.filter((segment) => segment.active);

    return {
      entity,
      segments,
      totalActiveMs: activeSegments.reduce((sum, segment) => sum + segment.durationMs, 0),
      eventCount: activeSegments.length,
      currentState: segments.at(-1)?.state,
      currentCategory: segments.at(-1)?.category,
    } satisfies TimelineRow;
  });
}

function withCurrentStateBoundary(
  records: HistoryStateRecord[],
  current: HassEntity | undefined,
  range: TimeRange,
  entityId: string,
): HistoryStateRecord[] {
  const out = [...records];
  if (!current) return out;

  const currentChangedMs = new Date(current.last_changed || current.last_updated).getTime();
  const boundaryMs = Number.isFinite(currentChangedMs) ? Math.min(Math.max(currentChangedMs, range.start.getTime()), range.end.getTime()) : range.start.getTime();
  const last = out
    .filter((record) => record.entity_id === entityId)
    .sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime())
    .at(-1);

  if (!last || new Date(last.last_changed).getTime() < boundaryMs || last.state !== current.state) {
    out.push({
      entity_id: entityId,
      state: current.state,
      attributes: current.attributes,
      last_changed: new Date(boundaryMs).toISOString(),
      last_updated: current.last_updated,
    });
  }

  return out;
}

export function classifyState(
  entity: EntityMeta,
  state: string,
  attributes: Record<string, unknown> | undefined,
): { category: StateCategory; active: boolean } {
  if (state === "unknown" || state === "unavailable") return { category: "unknown", active: false };

  const domain = entity.domain || getDomain(entity.entity_id);
  const configActiveStates = entity.config?.active_states;
  const activeStates = configActiveStates ?? DEFAULT_ACTIVE_STATES[domain] ?? ["on"];
  const activeAttributes = entity.config?.active_attributes ?? DEFAULT_ACTIVE_ATTRIBUTES[domain] ?? {};

  for (const [attribute, values] of Object.entries(activeAttributes)) {
    const value = attributes?.[attribute];
    if (typeof value === "string" && values.includes(value)) {
      return { category: categoryFromState(domain, value), active: true };
    }
  }

  const active = activeStates.includes(state);
  return { category: categoryFromState(domain, state), active };
}

function recordsToSegments(
  records: HistoryStateRecord[],
  entity: EntityMeta,
  range: TimeRange,
  config: ActivityHistoryCardConfig,
): TimelineSegment[] {
  if (!records.length) return [];

  const segments: TimelineSegment[] = [];
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();

  for (let i = 0; i < records.length; i += 1) {
    const current = records[i];
    if (!current) continue;
    const next = records[i + 1];
    const rawStart = new Date(current.last_changed).getTime();
    const rawEnd = next ? new Date(next.last_changed).getTime() : endMs;
    const segStart = Math.max(rawStart, startMs);
    const segEnd = Math.min(rawEnd, endMs);
    if (segEnd <= segStart) continue;

    const classification = classifyState(entity, current.state, current.attributes);
    const durationMs = segEnd - segStart;

    segments.push({
      entity_id: entity.entity_id,
      state: current.state,
      category: classification.category,
      active: classification.active,
      start: new Date(segStart),
      end: new Date(segEnd),
      durationMs,
      attributes: current.attributes,
    });
  }

  const merged = mergeAdjacentSegments(segments, config.merge_gap_seconds ?? 0);
  return merged.filter((segment) => !segment.active || !config.min_duration_seconds || segment.durationMs >= config.min_duration_seconds * 1000);
}

function dedupeRecords(records: HistoryStateRecord[]): HistoryStateRecord[] {
  const out: HistoryStateRecord[] = [];
  for (const record of records) {
    const previous = out.at(-1);
    if (previous && previous.state === record.state && effectiveAttributesKey(previous) === effectiveAttributesKey(record)) {
      continue;
    }
    out.push(record);
  }
  return out;
}

function effectiveAttributesKey(record: HistoryStateRecord): string {
  // Keep this small for MVP. Codex should expand this to only significant attributes per domain.
  const attrs = record.attributes ?? {};
  const keyAttrs = {
    hvac_action: attrs.hvac_action,
    temperature: attrs.temperature,
    current_temperature: attrs.current_temperature,
    media_title: attrs.media_title,
  };
  return JSON.stringify(keyAttrs);
}

function mergeAdjacentSegments(segments: TimelineSegment[], mergeGapSeconds: number): TimelineSegment[] {
  if (!segments.length || mergeGapSeconds <= 0) return segments;
  const gapMs = mergeGapSeconds * 1000;
  const out: TimelineSegment[] = [];
  for (const segment of segments) {
    const previous = out.at(-1);
    if (
      previous &&
      previous.entity_id === segment.entity_id &&
      previous.category === segment.category &&
      previous.state === segment.state &&
      segment.start.getTime() - previous.end.getTime() <= gapMs
    ) {
      previous.end = segment.end;
      previous.durationMs = previous.end.getTime() - previous.start.getTime();
    } else {
      out.push({ ...segment });
    }
  }
  return out;
}

function categoryFromState(domain: string, state: string): StateCategory {
  if (state === "unknown" || state === "unavailable") return "unknown";
  if (["off", "closed", "idle", "paused", "standby"].includes(state)) return state === "idle" ? "idle" : "off";
  if (["cool", "cooling"].includes(state)) return "cooling";
  if (["heat", "heating"].includes(state)) return "heating";
  if (["playing"].includes(state)) return "playing";
  if (["opening", "open"].includes(state)) return "opening";
  if (["closing"].includes(state)) return "closing";
  if (domain === "climate" && ["drying", "fan", "fan_only", "dry"].includes(state)) return "idle";
  return "on";
}
