export function createHassMoreInfoEvent(
  entityId: string,
): CustomEvent<{ entityId: string }> {
  return new CustomEvent("hass-more-info", {
    bubbles: true,
    composed: true,
    detail: { entityId },
  });
}
