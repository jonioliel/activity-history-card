import type { ActivityHistoryCardConfig, EntityMeta, HistoryStateRecord, HomeAssistant, TimeRange } from "./types";

export function needsAttributes(entity: EntityMeta): boolean {
  if (entity.config?.attributes?.length) return true;
  if (entity.config?.active_attributes && Object.keys(entity.config.active_attributes).length) return true;
  return ["climate", "humidifier", "water_heater"].includes(entity.domain);
}

export async function fetchHistory(
  hass: HomeAssistant,
  entities: EntityMeta[],
  range: TimeRange,
  config: ActivityHistoryCardConfig,
): Promise<Record<string, HistoryStateRecord[]>> {
  const withAttributes = entities.filter(needsAttributes);
  const withoutAttributes = entities.filter((entity) => !needsAttributes(entity));

  const batches = await Promise.all([
    withoutAttributes.length ? fetchHistoryBatch(hass, withoutAttributes, range, config, true) : Promise.resolve({}),
    withAttributes.length ? fetchHistoryBatch(hass, withAttributes, range, config, false) : Promise.resolve({}),
  ]);

  return Object.assign({}, ...batches);
}

async function fetchHistoryBatch(
  hass: HomeAssistant,
  entities: EntityMeta[],
  range: TimeRange,
  config: ActivityHistoryCardConfig,
  noAttributes: boolean,
): Promise<Record<string, HistoryStateRecord[]>> {
  const entityIds = entities.map((entity) => entity.entity_id);
  const response = await hass.callWS<unknown>({
    type: "history/history_during_period",
    entity_ids: entityIds,
    start_time: range.start.toISOString(),
    end_time: range.end.toISOString(),
    minimal_response: config.minimal_response ?? true,
    significant_changes_only: config.significant_changes_only ?? true,
    no_attributes: noAttributes,
  });

  return normalizeHistoryResponse(response, entityIds);
}

export function normalizeHistoryResponse(response: unknown, requestedEntityIds: string[]): Record<string, HistoryStateRecord[]> {
  const result: Record<string, HistoryStateRecord[]> = {};

  if (Array.isArray(response)) {
    response.forEach((entityHistory, index) => {
      if (!Array.isArray(entityHistory)) return;
      const fallbackEntityId = requestedEntityIds[index];
      const normalized = normalizeHistoryArray(entityHistory, fallbackEntityId);
      const entityId = normalized[0]?.entity_id ?? fallbackEntityId;
      if (entityId) result[entityId] = normalized;
    });
    return result;
  }

  if (response && typeof response === "object") {
    for (const [entityId, value] of Object.entries(response as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue;
      result[entityId] = normalizeHistoryArray(value, entityId);
    }
  }

  return result;
}

function normalizeHistoryArray(raw: unknown[], fallbackEntityId?: string): HistoryStateRecord[] {
  let lastEntityId = fallbackEntityId;
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return undefined;
      const record = item as Record<string, unknown>;
      const entityId = stringValue(record.entity_id) ?? lastEntityId;
      if (entityId) lastEntityId = entityId;
      const lastChanged = stringValue(record.last_changed) ?? stringValue(record.lc) ?? stringValue(record.last_updated) ?? stringValue(record.lu);
      const state = stringValue(record.state) ?? stringValue(record.s);
      if (!entityId || !state || !lastChanged) return undefined;
      const attrs = objectValue(record.attributes) ?? objectValue(record.a);
      const normalized: HistoryStateRecord = {
        entity_id: entityId,
        state,
        last_changed: lastChanged,
      };
      if (attrs) normalized.attributes = attrs;
      const lastUpdated = stringValue(record.last_updated) ?? stringValue(record.lu);
      if (lastUpdated) normalized.last_updated = lastUpdated;
      return normalized;
    })
    .filter((item): item is HistoryStateRecord => item !== undefined);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function objectValue(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}
