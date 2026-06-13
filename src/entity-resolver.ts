import { DEFAULT_DISCOVERY_DOMAINS } from "./defaults";
import { getDomain, humanizeEntityId } from "./format";
import type {
  ActivityHistoryCardConfig,
  DiscoveryDiagnostics,
  EntityConfig,
  EntityMeta,
  HomeAssistant,
} from "./types";

interface AreaRegistryEntry {
  area_id: string;
  name: string;
  labels?: string[];
}

interface DeviceRegistryEntry {
  id: string;
  area_id?: string | null;
  name?: string | null;
  name_by_user?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  labels?: string[];
  disabled_by?: string | null;
}

interface EntityRegistryEntry {
  entity_id: string;
  name?: string | null;
  original_name?: string | null;
  area_id?: string | null;
  device_id?: string | null;
  labels?: string[];
  hidden_by?: string | null;
  disabled_by?: string | null;
  entity_category?: string | null;
}

interface LabelRegistryEntry {
  label_id: string;
  name: string;
}

interface RegistrySnapshot {
  areas: AreaRegistryEntry[];
  devices: DeviceRegistryEntry[];
  entities: EntityRegistryEntry[];
  labels: LabelRegistryEntry[];
  areaRegistryAvailable: boolean;
  deviceRegistryAvailable: boolean;
  entityRegistryAvailable: boolean;
  labelRegistryAvailable: boolean;
}

const registrySnapshotPromises = new WeakMap<
  HomeAssistant,
  Promise<RegistrySnapshot>
>();

export async function resolveEntityMetas(
  config: ActivityHistoryCardConfig,
  hass?: HomeAssistant,
): Promise<EntityMeta[]> {
  return (await resolveEntityMetasWithDiagnostics(config, hass)).entities;
}

export async function resolveEntityMetasWithDiagnostics(
  config: ActivityHistoryCardConfig,
  hass?: HomeAssistant,
): Promise<{ entities: EntityMeta[]; diagnostics: DiscoveryDiagnostics }> {
  const configured = config.entities ?? [];
  const registry = hass ? await loadRegistrySnapshot(hass) : emptyRegistry();
  const entities: EntityConfig[] = configured.map((item) =>
    typeof item === "string" ? { entity: item } : item,
  );
  let fallbackUsed = false;

  if (!entities.length && hass && config.auto_discover !== false) {
    const discovered = discoverAreaEntities(config, hass, registry);
    fallbackUsed = discovered.fallbackUsed;
    entities.push(...discovered.entities);
  }

  const resolved = entities
    .filter((entry) => entry.entity && !entry.hidden)
    .map((entry) => toEntityMeta(entry, config, hass, registry))
    .filter((entity): entity is EntityMeta => Boolean(entity))
    .filter((entity) =>
      labelConfigAllows(entity.labels ?? [], config, registry.labels),
    );

  return {
    entities: resolved,
    diagnostics: buildDiscoveryDiagnostics(registry, fallbackUsed, config),
  };
}

function discoverAreaEntities(
  config: ActivityHistoryCardConfig,
  hass: HomeAssistant,
  registry: RegistrySnapshot,
): { entities: EntityConfig[]; fallbackUsed: boolean } {
  const allowedDomains = config.domains?.length
    ? config.domains
    : DEFAULT_DISCOVERY_DOMAINS;
  const excludedDomains = normalizedSet(config.exclude_domains ?? []);
  const areaFilters = normalizedSet(config.areas ?? []);
  const entities: EntityConfig[] = [];

  if (registry.entities.length) {
    const areaById = mapBy(registry.areas, "area_id");
    const deviceById = mapBy(registry.devices, "id");

    for (const entry of registry.entities) {
      if (entry.disabled_by || entry.hidden_by || !hass.states[entry.entity_id])
        continue;
      if (!entityCategoryAllows(entry, config, false)) continue;
      const domain = getDomain(entry.entity_id);
      if (excludedDomains.has(normalizeToken(domain))) continue;
      if (allowedDomains.length && !allowedDomains.includes(domain)) continue;
      if (!globConfigAllows(entry.entity_id, config)) continue;

      const device = entry.device_id
        ? deviceById.get(entry.device_id)
        : undefined;
      if (device?.disabled_by) continue;
      const areaId = entry.area_id || device?.area_id || undefined;
      if (!areaId) continue;
      const area = areaById.get(areaId);
      const areaName = area?.name ?? areaId;
      if (
        areaFilters.size &&
        !areaFilters.has(normalizeToken(areaId)) &&
        !areaFilters.has(normalizeToken(areaName))
      )
        continue;

      const labels = mergeLabels(entry.labels, device?.labels, area?.labels);
      if (!labelConfigAllows(labels, config, registry.labels)) continue;

      entities.push({
        entity: entry.entity_id,
        area: areaName,
        domain,
      });
    }

    return { entities, fallbackUsed: false };
  }

  for (const [entityId, stateObj] of Object.entries(hass.states)) {
    const domain = getDomain(entityId);
    if (excludedDomains.has(normalizeToken(domain))) continue;
    if (allowedDomains.length && !allowedDomains.includes(domain)) continue;
    if (!globConfigAllows(entityId, config)) continue;
    const area =
      stringAttr(stateObj.attributes.area) ??
      stringAttr(stateObj.attributes.area_id);
    if (!area) continue;
    if (areaFilters.size && !areaFilters.has(normalizeToken(area))) continue;
    entities.push({ entity: entityId, area, domain });
  }

  return { entities, fallbackUsed: true };
}

function toEntityMeta(
  entry: EntityConfig,
  config: ActivityHistoryCardConfig,
  hass: HomeAssistant | undefined,
  registry: RegistrySnapshot,
): EntityMeta | undefined {
  const stateObj = hass?.states[entry.entity];
  const registryEntity = registry.entities.find(
    (item) => item.entity_id === entry.entity,
  );
  const explicitlyConfigured = isExplicitEntity(entry.entity, config);
  if (registryEntity?.disabled_by || registryEntity?.hidden_by)
    return undefined;
  if (
    registryEntity &&
    !entityCategoryAllows(registryEntity, config, explicitlyConfigured)
  )
    return undefined;

  const device = registryEntity?.device_id
    ? registry.devices.find((item) => item.id === registryEntity.device_id)
    : undefined;
  if (device?.disabled_by) return undefined;

  const areaId = entry.area
    ? undefined
    : registryEntity?.area_id || device?.area_id || undefined;
  const area =
    entry.area ??
    resolveAreaName(areaId, registry) ??
    stringAttr(stateObj?.attributes?.area) ??
    stringAttr(stateObj?.attributes?.area_id);
  if (
    config.areas?.length &&
    (!area || !matchesConfiguredArea(area, areaId, config.areas))
  )
    return undefined;

  const domain = entry.domain ?? getDomain(entry.entity);
  if (!domainConfigAllows(entry.entity, domain, config)) return undefined;
  const labels = mergeLabels(
    registryEntity?.labels,
    device?.labels,
    areaId
      ? registry.areas.find((item) => item.area_id === areaId)?.labels
      : undefined,
  );
  const friendly = stateObj ? hass?.formatEntityName?.(stateObj) : undefined;
  const attrName = stateObj?.attributes?.friendly_name;

  const configuredName = stringAttr(entry.name);
  const registryName =
    stringAttr(registryEntity?.name) ??
    stringAttr(registryEntity?.original_name);
  const deviceName =
    stringAttr(device?.name_by_user) ?? stringAttr(device?.name);
  const friendlyName = stringAttr(friendly);
  const attributeName = stringAttr(attrName);
  const fallbackName = humanizeEntityId(entry.entity);
  const displayName =
    configuredName ??
    enrichEntityName(
      friendlyName ?? attributeName ?? registryName ?? fallbackName,
      deviceName,
      entry.entity,
      domain,
    );

  return {
    entity_id: entry.entity,
    name: displayName,
    area,
    area_id: areaId,
    domain,
    icon: entry.icon ?? stringAttr(stateObj?.attributes?.icon),
    labels,
    entity_category: stringAttr(registryEntity?.entity_category),
    device_id: stringAttr(registryEntity?.device_id),
    device_name: deviceName,
    device_manufacturer: stringAttr(device?.manufacturer),
    device_model: stringAttr(device?.model),
    hidden_by: stringAttr(registryEntity?.hidden_by),
    disabled_by: stringAttr(registryEntity?.disabled_by),
    config: entry,
  };
}

function domainConfigAllows(
  entityId: string,
  domain: string,
  config: ActivityHistoryCardConfig,
): boolean {
  if (
    config.domains?.length &&
    !normalizedSet(config.domains).has(normalizeToken(domain))
  )
    return false;
  if (normalizedSet(config.exclude_domains ?? []).has(normalizeToken(domain)))
    return false;
  return globConfigAllows(entityId, config);
}

function globConfigAllows(
  entityId: string,
  config: ActivityHistoryCardConfig,
): boolean {
  const includeGlobs = config.include_entity_globs ?? [];
  const excludeGlobs = [
    ...(config.exclude_entities ?? []),
    ...(config.exclude_entity_globs ?? []),
  ];
  if (
    includeGlobs.length &&
    !includeGlobs.some((pattern) => wildcardToRegExp(pattern).test(entityId))
  )
    return false;
  if (
    excludeGlobs.length &&
    excludeGlobs.some((pattern) => wildcardToRegExp(pattern).test(entityId))
  )
    return false;
  return true;
}

function entityCategoryAllows(
  entry: EntityRegistryEntry,
  config: ActivityHistoryCardConfig,
  explicitlyConfigured: boolean,
): boolean {
  if (explicitlyConfigured) return true;
  if (entry.entity_category === "config") {
    return config.show_config_entities === true;
  }
  if (entry.entity_category === "diagnostic") {
    return config.show_diagnostic_entities === true;
  }
  return true;
}

function labelConfigAllows(
  entityLabels: string[],
  config: ActivityHistoryCardConfig,
  labelRegistry: LabelRegistryEntry[],
): boolean {
  const labels = expandedLabelSet(entityLabels, labelRegistry);
  const includeLabels = normalizedSet(config.include_labels ?? []);
  const excludeLabels = normalizedSet(config.exclude_labels ?? []);

  if (
    excludeLabels.size &&
    [...excludeLabels].some((label) => labels.has(label))
  )
    return false;
  if (
    includeLabels.size &&
    ![...includeLabels].some((label) => labels.has(label))
  )
    return false;
  return true;
}

async function loadRegistrySnapshot(
  hass: HomeAssistant,
): Promise<RegistrySnapshot> {
  const existing = registrySnapshotPromises.get(hass);
  if (existing) return existing;

  const promise = Promise.all([
    safeRegistryCall<AreaRegistryEntry>(hass, "config/area_registry/list"),
    safeRegistryCall<DeviceRegistryEntry>(hass, "config/device_registry/list"),
    safeRegistryCall<EntityRegistryEntry>(hass, "config/entity_registry/list"),
    safeRegistryCall<LabelRegistryEntry>(hass, "config/label_registry/list"),
  ]).then(([areas, devices, entities, labels]) => ({
    areas: areas.items,
    devices: devices.items,
    entities: entities.items,
    labels: labels.items,
    areaRegistryAvailable: areas.available,
    deviceRegistryAvailable: devices.available,
    entityRegistryAvailable: entities.available,
    labelRegistryAvailable: labels.available,
  }));

  registrySnapshotPromises.set(hass, promise);
  return promise;
}

async function safeRegistryCall<T>(
  hass: HomeAssistant,
  type: string,
): Promise<{ items: T[]; available: boolean }> {
  try {
    const value = await hass.callWS<unknown>({ type });
    return {
      items: Array.isArray(value) ? (value as T[]) : [],
      available: Array.isArray(value),
    };
  } catch {
    return { items: [], available: false };
  }
}

function emptyRegistry(): RegistrySnapshot {
  return {
    areas: [],
    devices: [],
    entities: [],
    labels: [],
    areaRegistryAvailable: false,
    deviceRegistryAvailable: false,
    entityRegistryAvailable: false,
    labelRegistryAvailable: false,
  };
}

function buildDiscoveryDiagnostics(
  registry: RegistrySnapshot,
  fallbackUsed: boolean,
  config: ActivityHistoryCardConfig,
): DiscoveryDiagnostics {
  const unavailableReasons: string[] = [];
  if (!registry.areaRegistryAvailable)
    unavailableReasons.push("area_registry_unavailable");
  if (!registry.entityRegistryAvailable)
    unavailableReasons.push("entity_registry_unavailable");
  if (!registry.deviceRegistryAvailable)
    unavailableReasons.push("device_registry_unavailable");
  if (
    (config.include_labels?.length || config.exclude_labels?.length) &&
    !registry.labelRegistryAvailable
  ) {
    unavailableReasons.push("label_registry_unavailable");
  }

  return {
    registryAvailable:
      registry.areaRegistryAvailable ||
      registry.entityRegistryAvailable ||
      registry.deviceRegistryAvailable,
    areaRegistryAvailable: registry.areaRegistryAvailable,
    entityRegistryAvailable: registry.entityRegistryAvailable,
    deviceRegistryAvailable: registry.deviceRegistryAvailable,
    labelRegistryAvailable: registry.labelRegistryAvailable,
    registryEntityCount: registry.entities.length,
    areaCount: registry.areas.length,
    labelCount: registry.labels.length,
    fallbackUsed,
    unavailableReasons,
  };
}

function resolveAreaName(
  areaId: string | undefined,
  registry: RegistrySnapshot,
): string | undefined {
  if (!areaId) return undefined;
  return registry.areas.find((area) => area.area_id === areaId)?.name ?? areaId;
}

function matchesConfiguredArea(
  areaName: string,
  areaId: string | undefined,
  configuredAreas: string[],
): boolean {
  const filters = normalizedSet(configuredAreas);
  return (
    filters.has(normalizeToken(areaName)) ||
    Boolean(areaId && filters.has(normalizeToken(areaId)))
  );
}

function expandedLabelSet(
  labelIds: string[],
  labelRegistry: LabelRegistryEntry[],
): Set<string> {
  const namesById = new Map(
    labelRegistry.map((label) => [label.label_id, label.name]),
  );
  const values = new Set<string>();
  for (const labelId of labelIds) {
    values.add(normalizeToken(labelId));
    const name = namesById.get(labelId);
    if (name) values.add(normalizeToken(name));
  }
  return values;
}

function mergeLabels(...items: Array<string[] | undefined>): string[] {
  return [...new Set(items.flatMap((labels) => labels ?? []))];
}

function isExcluded(entityId: string, patterns: string[]): boolean {
  return patterns.some((pattern) => wildcardToRegExp(pattern).test(entityId));
}

function wildcardToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[|\\{}()[\]^$+?.]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`);
}

function mapBy<T extends Record<K, string>, K extends keyof T>(
  items: T[],
  key: K,
): Map<string, T> {
  return new Map(items.map((item) => [item[key], item]));
}

function normalizedSet(values: string[]): Set<string> {
  return new Set(values.map(normalizeToken).filter(Boolean));
}

function isExplicitEntity(
  entityId: string,
  config: ActivityHistoryCardConfig,
): boolean {
  return (config.entities ?? []).some((entry) =>
    typeof entry === "string" ? entry === entityId : entry.entity === entityId,
  );
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function stringAttr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function enrichEntityName(
  name: string,
  deviceName: string | undefined,
  entityId: string,
  domain: string,
): string {
  if (!deviceName || !name) return name;

  const normalizedName = normalizeToken(name);
  const normalizedDevice = normalizeToken(deviceName);
  if (!normalizedName || !normalizedDevice) return name;
  if (
    normalizedName.includes(normalizedDevice) ||
    normalizedDevice.includes(normalizedName)
  )
    return name;

  if (
    domain === "switch" &&
    (isGenericEntityName(name) ||
      isShortLatinName(name) ||
      name === humanizeEntityId(entityId))
  ) {
    return `${deviceName} - ${name}`;
  }

  return name;
}

function isShortLatinName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length <= 16 && /^[a-z0-9][a-z0-9 ._()/+-]*$/i.test(trimmed);
}

function isGenericEntityName(value: string): boolean {
  const genericNames = new Set([
    "power",
    "switch",
    "outlet",
    "plug",
    "extra dry",
    "half load",
    "remote start",
    "child lock",
    "door",
    "light",
    "fan",
    "מתג",
    "שקע",
    "הפעלה",
    "כיבוי",
    "דולק",
  ]);
  return genericNames.has(normalizeToken(value));
}
