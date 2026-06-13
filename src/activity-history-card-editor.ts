import { LitElement, html } from "lit";

export class ActivityHistoryCardEditor extends LitElement {
  protected override render() {
    return html`<div style="padding:16px">Activity History Card editor placeholder. MVP can be configured in YAML.</div>`;
  }
}

if (!customElements.get("activity-history-card-editor")) {
  customElements.define("activity-history-card-editor", ActivityHistoryCardEditor);
}
