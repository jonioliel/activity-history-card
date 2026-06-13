import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { DEFAULT_CONFIG, DEFAULT_DISCOVERY_DOMAINS, DOMAIN_LABELS_HE } from "./defaults";
import { getDomain } from "./format";
import type { ActivityHistoryCardConfig, DisplayMode, HomeAssistant } from "./types";

interface EditorArea {
  area_id: string;
  name: string;
}

interface EditorLabel {
  label_id: string;
  name: string;
}

export class ActivityHistoryCardEditor extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #e5e7eb);
      font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
      direction: rtl;
    }

    .editor {
      display: grid;
      gap: 16px;
      padding: 16px;
    }

    .section {
      display: grid;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color, rgba(148, 163, 184, 0.24));
      border-radius: 12px;
      background: color-mix(in srgb, var(--card-background-color, #111827) 88%, transparent);
    }

    h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 0.92rem;
    }

    .row {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .check-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .check {
      display: flex;
      align-items: center;
      gap: 8px;
      min-block-size: 40px;
      padding-inline: 10px;
      border: 1px solid var(--divider-color, rgba(148, 163, 184, 0.24));
      border-radius: 10px;
      background: rgba(15, 23, 42, 0.08);
    }

    input[type="text"],
    input[type="number"],
    select {
      min-block-size: 40px;
      border: 1px solid var(--divider-color, rgba(148, 163, 184, 0.34));
      border-radius: 10px;
      padding-inline: 10px;
      background: var(--card-background-color, #111827);
      color: var(--primary-text-color, #e5e7eb);
      font: inherit;
    }

    .hint {
      margin: 0;
      color: var(--secondary-text-color, #94a3b8);
      font-size: 0.82rem;
      line-height: 1.45;
    }

    @media (max-width: 640px) {
      .row {
        grid-template-columns: 1fr;
      }
    }
  `;

  private _config: ActivityHistoryCardConfig = { type: "custom:activity-history-card" };
  private _hass?: HomeAssistant;
  private _areas: EditorArea[] = [];
  private _labels: EditorLabel[] = [];
  private _domains: string[] = DEFAULT_DISCOVERY_DOMAINS;
  private _loadedOptions = false;

  setConfig(config: ActivityHistoryCardConfig): void {
    this._config = {
      ...config,
      type: "custom:activity-history-card",
      auto_discover: config.auto_discover ?? true,
      hours_to_show: config.hours_to_show ?? DEFAULT_CONFIG.hours_to_show,
      display_mode: config.display_mode ?? DEFAULT_CONFIG.display_mode,
      group_by: config.group_by ?? DEFAULT_CONFIG.group_by,
    };
    this.requestUpdate();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._loadedOptions) {
      this._loadedOptions = true;
      void this._loadOptions();
    }
  }

  protected override render(): TemplateResult {
    const config = this._config;
    const selectedDomains = config.domains?.length ? config.domains : DEFAULT_DISCOVERY_DOMAINS;

    return html`
      <div class="editor">
        <section class="section">
          <h3>הגדרות כלליות</h3>
          <div class="row">
            <label>
              כותרת
              <input type="text" .value=${config.title ?? DEFAULT_CONFIG.title} @input=${(event: Event) => this._setValue("title", inputValue(event))} />
            </label>
            <label>
              טווח שעות
              <input type="number" min="1" max="168" .value=${String(config.hours_to_show ?? 24)} @input=${(event: Event) => this._setNumber("hours_to_show", inputValue(event))} />
            </label>
          </div>
          <div class="row">
            <label>
              מצב תצוגה
              <select .value=${config.display_mode ?? "panel"} @change=${(event: Event) => this._setValue("display_mode", inputValue(event) as DisplayMode)}>
                <option value="card">כרטיס רגיל</option>
                <option value="panel">פאנל</option>
                <option value="fullscreen">מסך מלא</option>
              </select>
            </label>
            <label class="check">
              <input type="checkbox" .checked=${config.mock_data === true} @change=${(event: Event) => this._setChecked("mock_data", event)} />
              נתוני דוגמה
            </label>
          </div>
          <label class="check">
            <input type="checkbox" .checked=${config.auto_discover !== false} @change=${(event: Event) => this._setChecked("auto_discover", event)} />
            משוך אוטומטית רכיבים שמשויכים לאזורים
          </label>
          <p class="hint">כאשר האפשרות פעילה ואין רשימת entities ידנית, הכרטיס מאתר ישויות לפי אזורי Home Assistant ומסנן לפי הדומיינים והלייבלים שבחרת.</p>
        </section>

        <section class="section">
          <h3>דומיינים להצגה</h3>
          <div class="check-grid">
            ${this._domains.map((domain) => this._renderArrayCheckbox("domains", domain, DOMAIN_LABELS_HE[domain] ?? domain, selectedDomains.includes(domain)))}
          </div>
          <p class="hint">אם לא תבחר ידנית, הכרטיס משתמש בדומיינים שימושיים לפעילות כמו תאורה, מתגים, מזגנים, תריסים וחיישנים בינאריים.</p>
        </section>

        <section class="section">
          <h3>אזורים</h3>
          ${this._areas.length
            ? html`<div class="check-grid">
                ${this._areas.map((area) => this._renderArrayCheckbox("areas", area.name, area.name, (config.areas ?? []).includes(area.name) || (config.areas ?? []).includes(area.area_id)))}
              </div>`
            : html`<p class="hint">לא נטענו אזורים מה־registry. אפשר עדיין לערוך YAML ידנית.</p>`}
          <p class="hint">אם לא נבחר אזור, יוצגו כל האזורים שיש להם רכיבים מתאימים.</p>
        </section>

        <section class="section">
          <h3>לייבלים</h3>
          ${this._labels.length ? this._renderLabelControls(config) : html`<p class="hint">לא נמצאו labels ב־Home Assistant, או שהגרסה לא תומכת ב־label registry.</p>`}
        </section>
      </div>
    `;
  }

  private _renderLabelControls(config: ActivityHistoryCardConfig): TemplateResult {
    return html`
      <p class="hint">בחר labels להצגה או להסתרה. הסתרה גוברת על הצגה, כך שאפשר למשל להסתיר "לא להצגה" או "רכיבים מוגנים".</p>
      <h3>הצג רק labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map((label) => this._renderArrayCheckbox("include_labels", label.name, label.name, (config.include_labels ?? []).includes(label.name) || (config.include_labels ?? []).includes(label.label_id)))}
      </div>
      <h3>הסתר labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map((label) => this._renderArrayCheckbox("exclude_labels", label.name, label.name, (config.exclude_labels ?? []).includes(label.name) || (config.exclude_labels ?? []).includes(label.label_id)))}
      </div>
    `;
  }

  private _renderArrayCheckbox(
    key: "areas" | "domains" | "include_labels" | "exclude_labels",
    value: string,
    label: string,
    checked: boolean,
  ): TemplateResult {
    return html`
      <label class="check">
        <input type="checkbox" .checked=${checked} @change=${(event: Event) => this._toggleArrayValue(key, value, event)} />
        ${label}
      </label>
    `;
  }

  private async _loadOptions(): Promise<void> {
    if (!this._hass) return;
    const [areas, labels] = await Promise.all([this._safeRegistryCall<EditorArea>("config/area_registry/list"), this._safeRegistryCall<EditorLabel>("config/label_registry/list")]);
    const domainsFromStates = [...new Set(Object.keys(this._hass.states).map(getDomain))].filter(Boolean).sort();
    this._areas = areas.sort((a, b) => a.name.localeCompare(b.name, "he"));
    this._labels = labels.sort((a, b) => a.name.localeCompare(b.name, "he"));
    this._domains = [...new Set([...DEFAULT_DISCOVERY_DOMAINS, ...domainsFromStates])].sort();
    this.requestUpdate();
  }

  private async _safeRegistryCall<T>(type: string): Promise<T[]> {
    try {
      const result = await this._hass?.callWS<unknown>({ type });
      return Array.isArray(result) ? (result as T[]) : [];
    } catch {
      return [];
    }
  }

  private _setValue<K extends keyof ActivityHistoryCardConfig>(key: K, value: ActivityHistoryCardConfig[K]): void {
    this._emitConfig({ ...this._config, [key]: value });
  }

  private _setNumber(key: "hours_to_show", value: string): void {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      this._emitConfig({ ...this._config, [key]: parsed });
    }
  }

  private _setChecked(key: "auto_discover" | "mock_data", event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._emitConfig({ ...this._config, [key]: checked });
  }

  private _toggleArrayValue(
    key: "areas" | "domains" | "include_labels" | "exclude_labels",
    value: string,
    event: Event,
  ): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = new Set(this._config[key] ?? []);
    if (checked) {
      current.add(value);
    } else {
      current.delete(value);
    }
    const values = [...current];
    this._emitConfig({
      ...this._config,
      [key]: values.length ? values : undefined,
    });
  }

  private _emitConfig(config: ActivityHistoryCardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
    this.requestUpdate();
  }
}

function inputValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement).value;
}

if (!customElements.get("activity-history-card-editor")) {
  customElements.define("activity-history-card-editor", ActivityHistoryCardEditor);
}
