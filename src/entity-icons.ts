import { html, type TemplateResult } from "lit";
import { getDomain } from "./format";
import type { EntityMeta, TimelineGroup } from "./types";

const DOMAIN_ICONS: Record<string, string> = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  climate: "mdi:air-conditioner",
  media_player: "mdi:music",
  cover: "mdi:window-shutter",
  fan: "mdi:fan",
  humidifier: "mdi:air-humidifier",
  vacuum: "mdi:robot-vacuum",
  lock: "mdi:lock",
  binary_sensor: "mdi:motion-sensor",
};

const AREA_ICON_HINTS: Array<[RegExp, string]> = [
  [/סלון|living/i, "mdi:sofa"],
  [/מטבח|kitchen/i, "mdi:countertop"],
  [/שינה|הורים|bed/i, "mdi:bed"],
  [/ילד|ילדים|kids|child/i, "mdi:bunk-bed"],
  [/מרפסת|גינה|garden|balcony/i, "mdi:flower"],
  [/כניסה|entry|door/i, "mdi:door"],
];

export function iconForEntity(entity: EntityMeta): string {
  if (entity.icon?.startsWith("mdi:")) return entity.icon;
  if (entity.icon && !entity.icon.includes(":")) return entity.icon;
  const domain = entity.domain || getDomain(entity.entity_id);
  return DOMAIN_ICONS[domain] ?? "mdi:circle-medium";
}

export function iconForGroup(group: TimelineGroup): string {
  if (group.icon?.startsWith("mdi:")) return group.icon;
  if (group.icon && !group.icon.includes(":")) return group.icon;
  const domainIcon = DOMAIN_ICONS[group.id];
  if (domainIcon) return domainIcon;
  const hint = AREA_ICON_HINTS.find(([pattern]) => pattern.test(group.title));
  return hint?.[1] ?? "mdi:home-outline";
}

export function renderDisplayIcon(
  icon: string,
  className: string,
): TemplateResult {
  if (icon.startsWith("mdi:")) {
    return html`<ha-icon class=${className} icon=${icon}></ha-icon>`;
  }

  return html`<span class=${className} aria-hidden="true">${icon}</span>`;
}

export function renderEntityIcon(
  entity: EntityMeta,
  className = "ahc-entity-icon",
): TemplateResult {
  return renderDisplayIcon(iconForEntity(entity), className);
}

export function renderGroupIcon(
  group: TimelineGroup,
  className = "ahc-group-icon",
): TemplateResult {
  return renderDisplayIcon(iconForGroup(group), className);
}
