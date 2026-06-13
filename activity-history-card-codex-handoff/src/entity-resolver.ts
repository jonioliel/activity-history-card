import type { ActivityHistoryCardConfig, EntityConfig, EntityMeta, HomeAssistant } from "./types";
import { getDomain, humanizeEntityId, normalizeEntityConfig } from "./format";

export function resolveEntityMetas(config: ActivityHistoryCardConfig, hass?: HomeAssistant): EntityMeta[] {
  const configured = config.entities ?? [];
  const entities: EntityConfig[] = configured.map((item) => normalizeEntityConfig(item) as EntityConfig);

  // Conservative auto-discovery: only use configured domains/areas, never load every entity by default.
  if (!entities.length && hass && config.domains?.length) {
    for (const entityId of Object.keys(hass.states)) {
      const domain = getDomain(entityId);
      if (!config.domains.includes(domain)) continue;
      entities.push({ entity: entityId });
    }
  }

  return entities
    .filter((entry) => entry.entity && !entry.hidden)
    .map((entry) => {
      const stateObj = hass?.states[entry.entity];
      const domain = entry.domain ?? getDomain(entry.entity);
      const friendly = stateObj ? hass?.formatEntityName?.(stateObj) : undefined;
      const attrName = stateObj?.attributes?.friendly_name;
      const area = entry.area ?? stringAttr(stateObj?.attributes?.area) ?? stringAttr(stateObj?.attributes?.area_id);
      return {
        entity_id: entry.entity,
        name: entry.name ?? friendly ?? (typeof attrName === "string" ? attrName : humanizeEntityId(entry.entity)),
        area,
        domain,
        icon: entry.icon ?? stringAttr(stateObj?.attributes?.icon),
        config: entry,
      } satisfies EntityMeta;
    });
}

function stringAttr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}
