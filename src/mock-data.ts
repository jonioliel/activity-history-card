import type { EntityMeta, HistoryStateRecord, TimeRange } from "./types";

interface MockEntitySeed {
  entity_id: string;
  name: string;
  area: string;
  domain: string;
  icon: string;
  entity_category?: string;
  labels?: string[];
  pattern: Array<{
    startHour: number;
    endHour: number;
    state: string;
    attributes?: Record<string, unknown>;
  }>;
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
      {
        startHour: -21,
        endHour: -18,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 24 },
      },
      {
        startHour: -12,
        endHour: -9,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 23 },
      },
      {
        startHour: -4,
        endHour: -0.5,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 24 },
      },
    ],
  },
  {
    entity_id: "media_player.living_room_spotify",
    name: "Spotify סלון",
    area: "סלון",
    domain: "media_player",
    icon: "♫",
    pattern: [
      {
        startHour: -18,
        endHour: -15.5,
        state: "playing",
        attributes: { media_title: "Morning mix" },
      },
      {
        startHour: -8,
        endHour: -6.5,
        state: "playing",
        attributes: { media_title: "Evening playlist" },
      },
      {
        startHour: -2.4,
        endHour: -1.2,
        state: "playing",
        attributes: { media_title: "Focus" },
      },
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
      {
        startHour: -10,
        endHour: -6.2,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 23 },
      },
      {
        startHour: -2.5,
        endHour: -0.2,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 23 },
      },
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

export function getMockEntities(profile?: string): EntityMeta[] {
  return mockSeedsForProfile(profile).map((entity) => ({
    entity_id: entity.entity_id,
    name: entity.name,
    area: entity.area,
    domain: entity.domain,
    icon: entity.icon,
    labels: entity.labels,
    entity_category: entity.entity_category,
    config: { entity: entity.entity_id, name: entity.name, area: entity.area },
  }));
}

export function getMockHistory(
  range: TimeRange,
  profile?: string,
): Record<string, HistoryStateRecord[]> {
  const result: Record<string, HistoryStateRecord[]> = {};
  const endMs = range.end.getTime();

  for (const entity of mockSeedsForProfile(profile)) {
    const records: HistoryStateRecord[] = [
      makeRecord(entity.entity_id, "off", range.start.getTime(), undefined),
    ];

    for (const segment of entity.pattern) {
      const startMs = endMs + segment.startHour * 3600000;
      const stopMs = endMs + segment.endHour * 3600000;
      if (stopMs <= range.start.getTime() || startMs >= range.end.getTime())
        continue;
      records.push(
        makeRecord(
          entity.entity_id,
          segment.state,
          Math.max(startMs, range.start.getTime()),
          segment.attributes,
        ),
      );
      records.push(
        makeRecord(
          entity.entity_id,
          "off",
          Math.min(stopMs, range.end.getTime()),
          undefined,
        ),
      );
    }

    result[entity.entity_id] = records
      .sort(
        (a, b) =>
          new Date(a.last_changed).getTime() -
          new Date(b.last_changed).getTime(),
      )
      .filter(
        (record, index, sorted) =>
          index === 0 ||
          record.last_changed !== sorted[index - 1]?.last_changed,
      );
  }

  return result;
}

function mockSeedsForProfile(profile?: string): MockEntitySeed[] {
  if (profile === "mockup05_visual") {
    return [];
  }
  if (profile === "large_noisy_home") {
    return [...MOCK_ENTITIES, ...buildLargeNoisyHome()];
  }
  if (profile === "area_inventory") {
    return buildAreaInventoryProfile();
  }
  if (profile === "clean_activity_dashboard") {
    return buildCleanActivityDashboardProfile();
  }
  return MOCK_ENTITIES;
}

function buildAreaInventoryProfile(): MockEntitySeed[] {
  return [
    ...MOCK_ENTITIES.slice(0, 6),
    {
      entity_id: "switch.kitchen_dishwasher_main",
      name: "מדיח כלים",
      area: "מטבח",
      domain: "switch",
      icon: "mdi:dishwasher",
      pattern: [],
    },
    {
      entity_id: "switch.kitchen_socket",
      name: "שקע שירות",
      area: "מטבח",
      domain: "switch",
      icon: "mdi:power-socket-eu",
      pattern: [],
    },
    {
      entity_id: "fan.kitchen_ceiling",
      name: "מאוורר תקרה",
      area: "מטבח",
      domain: "fan",
      icon: "mdi:fan",
      pattern: [{ startHour: -3.2, endHour: -2.1, state: "on" }],
    },
    {
      entity_id: "light.balcony_string",
      name: "גרילנדה מרפסת",
      area: "מרפסת",
      domain: "light",
      icon: "mdi:string-lights",
      pattern: [],
    },
    {
      entity_id: "cover.balcony_shade",
      name: "סוכך מרפסת",
      area: "מרפסת",
      domain: "cover",
      icon: "mdi:awning",
      pattern: [{ startHour: -7.1, endHour: -7, state: "opening" }],
    },
    {
      entity_id: "light.pool_ambient",
      name: "תאורת בריכה",
      area: "בריכה",
      domain: "light",
      icon: "mdi:pool",
      pattern: [
        { startHour: -20, endHour: -18.5, state: "on" },
        { startHour: -4.5, endHour: -1.2, state: "on" },
      ],
    },
    {
      entity_id: "switch.pool_pump",
      name: "משאבת בריכה",
      area: "בריכה",
      domain: "switch",
      icon: "mdi:pump",
      pattern: [{ startHour: -8, endHour: -3.5, state: "on" }],
    },
    {
      entity_id: "fan.pool_airflow",
      name: "מאוורר אזור בריכה",
      area: "בריכה",
      domain: "fan",
      icon: "mdi:fan",
      pattern: [],
    },
    {
      entity_id: "cover.pool_cover",
      name: "כיסוי בריכה",
      area: "בריכה",
      domain: "cover",
      icon: "mdi:pool",
      pattern: [{ startHour: -6.2, endHour: -6, state: "closing" }],
    },
  ];
}

function buildCleanActivityDashboardProfile(): MockEntitySeed[] {
  return [
    {
      entity_id: "light.kitchen_counter_clean",
      name: "תאורת שיש",
      area: "מטבח",
      domain: "light",
      icon: "mdi:led-strip-variant",
      pattern: [
        { startHour: -22, endHour: -20.5, state: "on" },
        { startHour: -6, endHour: -3.8, state: "on" },
      ],
    },
    {
      entity_id: "switch.kitchen_coffee_clean",
      name: "מכונת קפה",
      area: "מטבח",
      domain: "switch",
      icon: "mdi:coffee-maker",
      pattern: [
        { startHour: -20.2, endHour: -20, state: "on" },
        { startHour: -2.2, endHour: -2, state: "on" },
      ],
    },
    {
      entity_id: "climate.living_room_clean",
      name: "מזגן סלון",
      area: "סלון",
      domain: "climate",
      icon: "mdi:air-conditioner",
      pattern: [
        {
          startHour: -12,
          endHour: -9.5,
          state: "cool",
          attributes: { hvac_action: "cooling" },
        },
        {
          startHour: -4.4,
          endHour: -1.2,
          state: "cool",
          attributes: { hvac_action: "cooling" },
        },
      ],
    },
    {
      entity_id: "media_player.living_room_clean",
      name: "מוזיקה סלון",
      area: "סלון",
      domain: "media_player",
      icon: "mdi:speaker",
      pattern: [{ startHour: -5.8, endHour: -4.1, state: "playing" }],
    },
    {
      entity_id: "fan.bedroom_clean",
      name: "מאוורר חדר שינה",
      area: "חדר שינה",
      domain: "fan",
      icon: "mdi:fan",
      pattern: [{ startHour: -8, endHour: -1.5, state: "on" }],
    },
    {
      entity_id: "cover.bedroom_shutter_clean",
      name: "תריס חדר שינה",
      area: "חדר שינה",
      domain: "cover",
      icon: "mdi:window-shutter",
      pattern: [{ startHour: -7.4, endHour: -7.2, state: "closing" }],
    },
  ];
}

function buildLargeNoisyHome(): MockEntitySeed[] {
  const noisyNames = [
    "Power",
    "Extra dry",
    "Half load",
    "Silence on demand",
    "Vario speed",
    "Program",
    "Progress",
    "Finish",
    "Remote start",
    "Child lock",
    "Router LAN0",
    "WLAN signal",
    "Firmware update",
    "Battery level",
    "Cloud connection",
    "תוכנית כביסה",
    "חצי כמות",
    "נעילת ילדים",
    "מהירות ייבוש",
    "ראוטר רשת",
  ];
  const areas = ["בריכה", "מטבח", "סלון", "חדר שירות", "חדרי ילדים"];
  const domains = ["switch", "sensor", "binary_sensor", "switch", "switch"];
  const seeds: MockEntitySeed[] = [];

  for (let index = 0; index < 170; index += 1) {
    const name = noisyNames[index % noisyNames.length] ?? "Power";
    const domain = domains[index % domains.length] ?? "switch";
    const category =
      index % 7 === 0 ? "diagnostic" : index % 11 === 0 ? "config" : undefined;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u0590-\u05ff]+/gi, "_")
      .replace(/^_+|_+$/g, "");
    seeds.push({
      entity_id: `${domain}.large_noisy_${index}_${slug || "entity"}`,
      name,
      area: areas[index % areas.length] ?? "ללא אזור",
      domain,
      icon: domain === "sensor" ? "mdi:gauge" : "mdi:toggle-switch",
      entity_category: category,
      labels: index % 13 === 0 ? ["לא להצגה"] : undefined,
      pattern:
        index % 19 === 0
          ? [{ startHour: -2, endHour: -1.95, state: "on" }]
          : [],
    });
  }

  return seeds;
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
