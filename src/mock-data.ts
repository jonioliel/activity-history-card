import type { EntityMeta, HistoryStateRecord, TimeRange } from "./types";

interface MockEntitySeed {
  entity_id: string;
  name: string;
  area: string;
  domain: string;
  icon: string;
  pattern: Array<{ startHour: number; endHour: number; state: string; attributes?: Record<string, unknown> }>;
}

const MOCK_ENTITIES: MockEntitySeed[] = [
  {
    entity_id: "light.living_room_main",
    name: "תאורת סלון",
    area: "סלון",
    domain: "light",
    icon: "💡",
    pattern: [
      { startHour: -22, endHour: -20, state: "on" },
      { startHour: -15, endHour: -13, state: "on" },
      { startHour: -5, endHour: -1, state: "on" },
    ],
  },
  {
    entity_id: "climate.living_room_ac",
    name: "מזגן סלון",
    area: "סלון",
    domain: "climate",
    icon: "❄",
    pattern: [
      { startHour: -21, endHour: -18, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 24 } },
      { startHour: -12, endHour: -9, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 23 } },
      { startHour: -4, endHour: -0.5, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 24 } },
    ],
  },
  {
    entity_id: "media_player.living_room_spotify",
    name: "Spotify סלון",
    area: "סלון",
    domain: "media_player",
    icon: "♫",
    pattern: [
      { startHour: -18, endHour: -15.5, state: "playing", attributes: { media_title: "Morning mix" } },
      { startHour: -8, endHour: -6.5, state: "playing", attributes: { media_title: "Evening playlist" } },
      { startHour: -2.4, endHour: -1.2, state: "playing", attributes: { media_title: "Focus" } },
    ],
  },
  {
    entity_id: "cover.living_room_blinds",
    name: "תריס סלון",
    area: "סלון",
    domain: "cover",
    icon: "▤",
    pattern: [
      { startHour: -19, endHour: -18.8, state: "opening" },
      { startHour: -7, endHour: -6.8, state: "closing" },
    ],
  },
  {
    entity_id: "light.kitchen_counter",
    name: "תאורת מטבח",
    area: "מטבח",
    domain: "light",
    icon: "💡",
    pattern: [
      { startHour: -23, endHour: -21, state: "on" },
      { startHour: -14.5, endHour: -13.2, state: "on" },
      { startHour: -6, endHour: -3.5, state: "on" },
    ],
  },
  {
    entity_id: "switch.kitchen_coffee_machine",
    name: "מכונת קפה",
    area: "מטבח",
    domain: "switch",
    icon: "☕",
    pattern: [
      { startHour: -20.5, endHour: -20.1, state: "on" },
      { startHour: -11.2, endHour: -10.8, state: "on" },
      { startHour: -2, endHour: -1.6, state: "on" },
    ],
  },
  {
    entity_id: "cover.kitchen_blinds",
    name: "תריס מטבח",
    area: "מטבח",
    domain: "cover",
    icon: "▤",
    pattern: [
      { startHour: -17, endHour: -16.7, state: "opening" },
      { startHour: -5.4, endHour: -5.1, state: "closing" },
    ],
  },
  {
    entity_id: "light.children_room",
    name: "תאורת חדר ילדים",
    area: "חדרי ילדים",
    domain: "light",
    icon: "💡",
    pattern: [
      { startHour: -16, endHour: -14.8, state: "on" },
      { startHour: -4.8, endHour: -1, state: "on" },
    ],
  },
  {
    entity_id: "climate.children_room",
    name: "מזגן חדר ילדים",
    area: "חדרי ילדים",
    domain: "climate",
    icon: "❄",
    pattern: [
      { startHour: -10, endHour: -6.2, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 23 } },
      { startHour: -2.5, endHour: -0.2, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 23 } },
    ],
  },
  {
    entity_id: "fan.bedroom",
    name: "מאוורר חדר שינה",
    area: "חדר שינה",
    domain: "fan",
    icon: "◌",
    pattern: [
      { startHour: -9, endHour: -6, state: "on" },
      { startHour: -3.5, endHour: -0.1, state: "on" },
    ],
  },
];

export function getMockEntities(): EntityMeta[] {
  return MOCK_ENTITIES.map((entity) => ({
    entity_id: entity.entity_id,
    name: entity.name,
    area: entity.area,
    domain: entity.domain,
    icon: entity.icon,
    config: { entity: entity.entity_id, name: entity.name, area: entity.area },
  }));
}

export function getMockHistory(range: TimeRange): Record<string, HistoryStateRecord[]> {
  const result: Record<string, HistoryStateRecord[]> = {};
  const endMs = range.end.getTime();

  for (const entity of MOCK_ENTITIES) {
    const records: HistoryStateRecord[] = [
      makeRecord(entity.entity_id, "off", range.start.getTime(), undefined),
    ];

    for (const segment of entity.pattern) {
      const startMs = endMs + segment.startHour * 3600000;
      const stopMs = endMs + segment.endHour * 3600000;
      if (stopMs <= range.start.getTime() || startMs >= range.end.getTime()) continue;
      records.push(makeRecord(entity.entity_id, segment.state, Math.max(startMs, range.start.getTime()), segment.attributes));
      records.push(makeRecord(entity.entity_id, "off", Math.min(stopMs, range.end.getTime()), undefined));
    }

    result[entity.entity_id] = records
      .sort((a, b) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime())
      .filter((record, index, sorted) => index === 0 || record.last_changed !== sorted[index - 1]?.last_changed);
  }

  return result;
}

function makeRecord(
  entityId: string,
  state: string,
  timestampMs: number,
  attributes: Record<string, unknown> | undefined,
): HistoryStateRecord {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: new Date(timestampMs).toISOString(),
    last_updated: new Date(timestampMs).toISOString(),
  };
}
