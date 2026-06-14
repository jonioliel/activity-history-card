import { css } from "lit";

export const activityHistoryCardStyles = css`
  /*
  Activity History Card design baseline
  Target: Home Assistant Lovelace custom card, RTL-first, mobile-first capable.

  Notes for implementation:
  - Apply \`dir="rtl"\` on \`.ahc\` for Hebrew/RTL UI.
  - Keep the inner chart math/timeline in LTR with \`.ahc-timeline { direction: ltr; }\`.
  - Prefer CSS logical properties in TS/templates too.
*/

  :host {
    --ahc-radius-xs: 8px;
    --ahc-radius-sm: 12px;
    --ahc-radius-md: 18px;
    --ahc-radius-lg: 24px;
    --ahc-radius-xl: 32px;

    --ahc-gap-xxs: 4px;
    --ahc-gap-xs: 8px;
    --ahc-gap-sm: 12px;
    --ahc-gap-md: 16px;
    --ahc-gap-lg: 24px;
    --ahc-gap-xl: 32px;

    --ahc-font-family: var(
      --primary-font-family,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Arial,
      sans-serif
    );
    --ahc-card-bg: var(
      --ha-card-background,
      var(--card-background-color, #0f172a)
    );
    --ahc-page-bg: var(--lovelace-background, #020617);
    --ahc-surface-1: color-mix(in srgb, var(--ahc-card-bg) 88%, #1e3a5f 12%);
    --ahc-surface-2: color-mix(
      in srgb,
      var(--ahc-card-bg) 80%,
      #2563eb 8%,
      #0f172a 12%
    );
    --ahc-surface-3: color-mix(
      in srgb,
      var(--ahc-card-bg) 72%,
      #38bdf8 7%,
      #0f172a 21%
    );
    --ahc-border: color-mix(
      in srgb,
      var(--divider-color, #334155) 76%,
      #60a5fa 24%
    );
    --ahc-border-soft: color-mix(
      in srgb,
      var(--divider-color, #334155) 55%,
      transparent 45%
    );
    --ahc-shadow: 0 18px 60px rgba(0, 0, 0, 0.32);
    --ahc-shadow-soft: 0 8px 26px rgba(0, 0, 0, 0.22);

    --ahc-text: var(--primary-text-color, #f8fafc);
    --ahc-muted: var(--secondary-text-color, #94a3b8);
    --ahc-disabled: var(--disabled-text-color, #64748b);
    --ahc-accent: var(--primary-color, #38bdf8);
    --ahc-accent-strong: #0ea5e9;
    --ahc-accent-soft: rgba(56, 189, 248, 0.16);
    --ahc-focus: #93c5fd;

    --ahc-on: var(--success-color, #22c55e);
    --ahc-off: #64748b;
    --ahc-cooling: #38bdf8;
    --ahc-heating: #fb923c;
    --ahc-playing: #a78bfa;
    --ahc-opening: #facc15;
    --ahc-closing: #cbd5e1;
    --ahc-idle: #14b8a6;
    --ahc-unknown: #94a3b8;

    --ahc-track: rgba(148, 163, 184, 0.12);
    --ahc-grid-line: rgba(148, 163, 184, 0.16);
    --ahc-row-hover: rgba(56, 189, 248, 0.08);
    --ahc-now: #60a5fa;
    --ahc-label-width: 240px;
    --ahc-row-height: 34px;
    --ahc-group-gap: 12px;
    --ahc-segment-height: 8px;
    --ahc-segment-min-width: 4px;
    --ahc-activity-row-height: 34px;
    --ahc-activity-label-width: 220px;
    --ahc-activity-segment-height: 9px;
    --ahc-activity-segment-min-width: 4px;
    --ahc-activity-group-gap: 12px;
    --ahc-dashboard-row-height: 38px;
    --ahc-dashboard-label-width: 250px;
    --ahc-dashboard-segment-height: 12px;
    --ahc-dashboard-aggregate-height: 15px;
    --ahc-dashboard-segment-min-width: 6px;
    --ahc-dashboard-group-header-height: 42px;
    --ahc-dashboard-group-gap: 10px;
    --ahc-axis-label-color: rgba(235, 242, 255, 0.92);
    --ahc-axis-grid-color: rgba(148, 163, 184, 0.22);
    --ahc-insights-width: 340px;

    --ahc-chip-height: 40px;
    --ahc-touch-target: 44px;
    --ahc-mobile-breakpoint: 760px;

    display: block;
    font-family: var(--ahc-font-family);
  }

  :host([hidden]) {
    display: none;
  }

  /* Root */
  .ahc {
    direction: rtl;
    box-sizing: border-box;
    position: relative;
    display: grid;
    gap: var(--ahc-gap-sm);
    padding: clamp(14px, 1.6vw, 22px);
    color: var(--ahc-text);
    background:
      radial-gradient(
        circle at 92% 0%,
        rgba(14, 165, 233, 0.22),
        transparent 34%
      ),
      radial-gradient(
        circle at 4% 12%,
        rgba(124, 58, 237, 0.14),
        transparent 28%
      ),
      linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.9));
    border: 1px solid var(--ahc-border);
    border-radius: var(--ahc-radius-lg);
    box-shadow: var(--ahc-shadow-soft);
    overflow: hidden;
    isolation: isolate;
  }

  .ahc *,
  .ahc *::before,
  .ahc *::after {
    box-sizing: border-box;
  }

  .ahc[dir="ltr"] {
    direction: ltr;
  }

  .ahc::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.035),
        transparent 18%,
        transparent 82%,
        rgba(255, 255, 255, 0.025)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 18%);
    z-index: -1;
  }

  .ahc--panel {
    min-height: min(100svh, 920px);
    inline-size: 100%;
  }

  .ahc--fullscreen {
    position: fixed;
    inset: 0;
    z-index: 2147483640;
    min-height: 100svh;
    border-radius: 0;
    padding: max(var(--ahc-gap-lg), env(safe-area-inset-top))
      max(var(--ahc-gap-lg), env(safe-area-inset-right))
      max(var(--ahc-gap-lg), env(safe-area-inset-bottom))
      max(var(--ahc-gap-lg), env(safe-area-inset-left));
    background: linear-gradient(145deg, #020617, #0f172a 45%, #0b1221);
  }

  .ahc--panel,
  .ahc--fullscreen {
    grid-template-rows:
      minmax(72px, max-content)
      minmax(0, 58px)
      minmax(0, 88px)
      minmax(0, 1fr);
    block-size: min(100svh, 980px);
    min-block-size: min(100svh, 760px);
  }

  .ahc__hero,
  .ahc__toolbar,
  .ahc__summary-strip,
  .ahc__body,
  .ahc__main {
    min-inline-size: 0;
  }

  .ahc__hero {
    max-block-size: 96px;
    overflow: hidden;
  }

  .ahc__hero-actions {
    display: flex;
    flex: 0 0 auto;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ahc-gap-sm);
    min-inline-size: min(420px, 100%);
  }

  .ahc__toolbar {
    max-block-size: 58px;
  }

  .ahc__summary-strip {
    max-block-size: 88px;
  }

  /* Top bar */
  .ahc__topbar {
    display: flex;
    flex-wrap: nowrap;
    gap: var(--ahc-gap-md);
    align-items: start;
    justify-content: space-between;
    padding: 12px 14px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: var(--ahc-radius-md);
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.28), rgba(30, 64, 175, 0.1)),
      rgba(2, 6, 23, 0.14);
  }

  .ahc__title-block {
    display: grid;
    grid-auto-flow: row;
    gap: var(--ahc-gap-xs);
    flex: 1 1 auto;
    min-inline-size: 0;
    justify-items: start;
    text-align: start;
  }

  .ahc__title-row {
    display: inline-flex;
    align-items: center;
    gap: var(--ahc-gap-sm);
  }

  .ahc__icon-badge {
    display: inline-grid;
    place-items: center;
    min-inline-size: 48px;
    min-block-size: 48px;
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(56, 189, 248, 0.24),
      rgba(37, 99, 235, 0.2)
    );
    border: 1px solid rgba(56, 189, 248, 0.42);
    color: var(--ahc-accent);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.11),
      0 10px 28px rgba(14, 165, 233, 0.1);
  }

  .ahc__icon-badge ha-icon {
    inline-size: 26px;
    block-size: 26px;
  }

  .ahc__title {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.75rem;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: 0;
  }

  .ahc__subtitle {
    margin: 0;
    color: var(--ahc-muted);
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .ahc-last-event {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-inline-size: min(560px, 100%);
    min-block-size: 34px;
    padding-block: 4px;
    padding-inline: 10px;
    border: 1px solid rgba(56, 189, 248, 0.22);
    border-radius: 999px;
    background: rgba(2, 6, 23, 0.24);
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-last-event strong,
  .ahc-last-event__label {
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc__hero-actions {
    display: flex;
    flex: 0 0 auto;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ahc-gap-sm);
    min-inline-size: min(460px, 100%);
  }

  .ahc__search {
    position: relative;
    inline-size: min(320px, 100%);
  }

  .ahc__search-input {
    inline-size: 100%;
    min-block-size: var(--ahc-touch-target);
    border-radius: var(--ahc-radius-sm);
    border: 1px solid var(--ahc-border-soft);
    background: rgba(2, 6, 23, 0.42);
    color: var(--ahc-text);
    padding-block: 0;
    padding-inline: 44px 16px;
    outline: none;
    text-align: start;
    font: inherit;
  }

  .ahc__search-input::placeholder {
    color: color-mix(in srgb, var(--ahc-muted) 82%, transparent 18%);
  }

  .ahc__search-icon {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 14px;
    transform: translateY(-50%);
    color: var(--ahc-muted);
    pointer-events: none;
  }

  .ahc[dir="rtl"] .ahc__search-input {
    padding-inline: 16px 44px;
  }

  .ahc[dir="rtl"] .ahc__search-icon {
    inset-inline-start: auto;
    inset-inline-end: 14px;
  }

  /* Buttons and chips */
  .ahc__button,
  .ahc__chip,
  .ahc__segmented-button {
    appearance: none;
    min-block-size: var(--ahc-chip-height);
    min-inline-size: var(--ahc-touch-target);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.58);
    color: var(--ahc-muted);
    font: inherit;
    font-size: 0.92rem;
    line-height: 1;
    padding-block: 0;
    padding-inline: 16px;
    cursor: pointer;
    user-select: none;
    transition:
      background 160ms ease,
      color 160ms ease,
      border-color 160ms ease,
      transform 160ms ease;
  }

  .ahc__button:hover,
  .ahc__chip:hover,
  .ahc__segmented-button:hover {
    color: var(--ahc-text);
    border-color: color-mix(
      in srgb,
      var(--ahc-accent) 46%,
      var(--ahc-border-soft)
    );
    background: rgba(30, 41, 59, 0.72);
  }

  .ahc__button:focus-visible,
  .ahc__chip:focus-visible,
  .ahc__segmented-button:focus-visible,
  .ahc__search-input:focus-visible,
  .ahc__row-action:focus-visible,
  .ahc-filter-option:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 2px;
  }

  .ahc__chip[aria-pressed="true"],
  .ahc__segmented-button[aria-pressed="true"],
  .ahc__chip--active,
  .ahc__button--primary {
    color: #e0f2fe;
    border-color: rgba(56, 189, 248, 0.75);
    background: linear-gradient(
      180deg,
      rgba(14, 165, 233, 0.3),
      rgba(37, 99, 235, 0.18)
    );
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 8px 22px rgba(14, 165, 233, 0.1);
  }

  .ahc__button--ghost {
    background: rgba(2, 6, 23, 0.34);
  }

  .ahc__button:disabled {
    cursor: progress;
    opacity: 0.58;
  }

  .ahc__refresh-indicator {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--ahc-chip-height);
    padding-inline: 12px;
    border: 1px solid rgba(56, 189, 248, 0.24);
    border-radius: var(--ahc-radius-sm);
    background: rgba(14, 165, 233, 0.1);
    color: #bae6fd;
    font-size: 0.82rem;
  }

  .ahc__button-icon {
    inline-size: 20px;
    block-size: 20px;
    flex: 0 0 auto;
  }

  .ahc__segmented {
    display: inline-flex;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-sm);
    overflow: hidden;
    background: rgba(2, 6, 23, 0.3);
  }

  .ahc__segmented-button {
    border: 0;
    border-radius: 0;
    background: transparent;
    min-inline-size: 84px;
  }

  .ahc__segmented-button + .ahc__segmented-button {
    border-inline-start: 1px solid var(--ahc-border-soft);
  }

  /* Filters */
  .ahc__filters {
    display: flex;
    align-items: center;
    gap: var(--ahc-gap-xs);
    padding: 10px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.38);
    overflow: hidden;
  }

  .ahc__filter-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
    inline-size: 100%;
  }

  .ahc__filter-row--primary {
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .ahc__filter-row--primary > * {
    flex: 0 0 auto;
  }

  .ahc__filter-row--compact {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .ahc__filter-row--compact::-webkit-scrollbar {
    display: none;
  }

  .ahc__filter-row--compact > * {
    flex: 0 0 auto;
  }

  .ahc__filter-label {
    color: var(--ahc-muted);
    font-size: 0.82rem;
    font-weight: 700;
    margin-inline-end: 2px;
  }

  .ahc-curation-note {
    display: inline-flex;
    align-items: center;
    min-block-size: 32px;
    max-inline-size: min(480px, 42vw);
    padding-inline: 10px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: 999px;
    background: rgba(2, 6, 23, 0.22);
    color: var(--ahc-muted);
    font-size: 0.78rem;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Summary */
  .ahc__summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    overflow: hidden;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background:
      linear-gradient(180deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.54)),
      rgba(2, 6, 23, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
  }

  .ahc__metric {
    min-block-size: 88px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ahc-gap-sm);
    padding: 12px 16px;
    border: 0;
    border-inline-start: 1px solid rgba(148, 163, 184, 0.13);
    background: transparent;
    box-shadow: none;
  }

  .ahc__metric:first-child {
    border-inline-start: 0;
  }

  .ahc__metric-copy {
    min-inline-size: 0;
    text-align: end;
  }

  .ahc__metric-label {
    display: block;
    color: var(--ahc-muted);
    font-size: 0.82rem;
    font-weight: 700;
    margin-block-end: 4px;
  }

  .ahc__metric-value {
    display: block;
    color: var(--ahc-text);
    font-size: 1.95rem;
    line-height: 1.05;
    font-weight: 850;
    letter-spacing: 0;
  }

  .ahc__metric-value--compact {
    font-size: 1.12rem;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc__metric-value--positive {
    color: var(--ahc-on);
  }

  .ahc__metric-subtitle {
    display: block;
    color: var(--ahc-muted);
    font-size: 0.78rem;
    line-height: 1.35;
    margin-block-start: 6px;
  }

  .ahc__metric-icon {
    display: inline-grid;
    place-items: center;
    inline-size: 46px;
    block-size: 46px;
    border-radius: 14px;
    border: 1px solid var(--ahc-border-soft);
    background: rgba(2, 6, 23, 0.22);
    color: var(--ahc-accent);
  }

  /* Layout body */
  .ahc__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-insights-width);
    gap: var(--ahc-gap-md);
    align-items: stretch;
    direction: ltr;
    min-block-size: 0;
    max-inline-size: 1920px;
  }

  .ahc__body--no-insights {
    grid-template-columns: minmax(0, 1fr);
  }

  .ahc__main,
  .ahc__timeline-panel {
    min-inline-size: 0;
    min-block-size: 0;
    display: grid;
    gap: var(--ahc-gap-md);
  }

  .ahc__insights {
    display: grid;
    gap: var(--ahc-gap-sm);
    align-content: start;
    padding: var(--ahc-gap-sm);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(30, 41, 59, 0.5),
      rgba(15, 23, 42, 0.52)
    );
  }

  .ahc__insights-panel {
    inline-size: 100%;
    max-inline-size: var(--ahc-insights-width);
  }

  .ahc__insights-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    margin: 0 0 var(--ahc-gap-xs);
    color: var(--ahc-text);
    font-size: 1.05rem;
    font-weight: 800;
  }

  .ahc__insight-card {
    padding: 12px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.52);
  }

  .ahc__insight-kicker {
    display: block;
    color: var(--ahc-muted);
    font-size: 0.78rem;
    font-weight: 700;
    margin-block-end: 8px;
  }

  .ahc__insight-value {
    display: block;
    color: var(--ahc-text);
    font-size: 1.12rem;
    font-weight: 850;
    overflow-wrap: anywhere;
  }

  .ahc__insight-subtitle {
    display: block;
    color: var(--ahc-muted);
    font-size: 0.78rem;
    margin-block-start: 6px;
  }

  .ahc__spark {
    display: flex;
    align-items: end;
    gap: 5px;
    block-size: 34px;
    margin-block-start: 10px;
  }

  .ahc__spark i {
    inline-size: 8px;
    block-size: var(--bar, 20%);
    min-block-size: 4px;
    border-radius: 999px 999px 2px 2px;
    background: linear-gradient(
      180deg,
      var(--ahc-accent),
      rgba(37, 99, 235, 0.38)
    );
  }

  /* Activity dashboard timeline */
  .ahc-activity {
    direction: rtl;
    display: grid;
    gap: var(--ahc-gap-md);
    min-inline-size: 0;
    min-block-size: 420px;
    padding: var(--ahc-gap-md);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(30, 41, 59, 0.42),
      rgba(2, 6, 23, 0.24)
    );
    overflow: hidden;
  }

  .ahc-activity__header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--ahc-gap-md);
    padding-block-end: var(--ahc-gap-xs);
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ahc-activity__heading {
    min-inline-size: 0;
    text-align: start;
  }

  .ahc-activity__heading h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.08rem;
    font-weight: 850;
  }

  .ahc-activity__heading p,
  .ahc-activity__more {
    margin: 6px 0 0;
    color: var(--ahc-muted);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .ahc-activity__range {
    flex: 0 0 auto;
    min-block-size: 36px;
    display: inline-flex;
    align-items: center;
    padding-inline: 12px;
    border: 1px solid rgba(56, 189, 248, 0.28);
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.1);
    color: #bae6fd;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .ahc-activity__density-strip {
    direction: ltr;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(5px, 1fr);
    align-items: end;
    gap: 3px;
    min-block-size: 58px;
    padding-block: 8px;
    padding-inline: 10px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.28);
  }

  .ahc-activity__density-bar {
    display: block;
    block-size: max(6px, calc(var(--intensity, 0) * 48px));
    border-radius: 999px 999px 3px 3px;
    background: linear-gradient(
      180deg,
      rgba(125, 211, 252, 0.95),
      rgba(34, 197, 94, 0.34)
    );
    opacity: max(0.18, calc(var(--intensity, 0) * 0.92));
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.16);
  }

  .ahc-activity__axis {
    direction: ltr;
    position: relative;
    min-block-size: 32px;
    margin-inline-start: 0;
    margin-inline-end: var(--ahc-activity-label-width);
    border-block-end: 1px solid rgba(148, 163, 184, 0.1);
  }

  .ahc-activity__tick {
    position: absolute;
    inset-block: 0;
    transform: translateX(-50%);
    min-inline-size: 42px;
    display: grid;
    place-items: center;
    color: var(--ahc-muted);
    font-size: 0.75rem;
  }

  .ahc-activity__tick::after {
    content: "";
    position: absolute;
    inset-block-end: 0;
    inline-size: 1px;
    block-size: 9px;
    background: rgba(148, 163, 184, 0.16);
  }

  .ahc-activity__groups {
    display: grid;
    gap: var(--ahc-activity-group-gap);
    min-inline-size: 0;
  }

  .ahc-activity-group {
    display: grid;
    gap: var(--ahc-gap-sm);
    padding: var(--ahc-gap-sm);
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.46);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .ahc-activity-group__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 32px;
  }

  .ahc-activity-group__title {
    display: inline-flex;
    align-items: center;
    gap: var(--ahc-gap-xs);
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc-activity-group__meta {
    color: var(--ahc-muted);
    font-size: 0.78rem;
    white-space: nowrap;
  }

  .ahc-activity-group__rows {
    display: grid;
    gap: 4px;
  }

  .ahc-activity-row {
    direction: rtl;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-activity-label-width);
    align-items: center;
    gap: var(--ahc-gap-sm);
    min-block-size: var(--ahc-activity-row-height);
  }

  .ahc-activity-row__label {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
    color: var(--ahc-text);
  }

  .ahc-activity-row__name {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.84rem;
    font-weight: 760;
  }

  .ahc-activity-row__plot {
    direction: ltr;
    position: relative;
    min-inline-size: 0;
    min-block-size: var(--ahc-activity-row-height);
    overflow: visible;
    border-radius: 999px;
    background-image: linear-gradient(
      to right,
      rgba(148, 163, 184, 0.08) 1px,
      transparent 1px
    );
    background-size: calc(100% / 8) 100%;
  }

  .ahc-activity-segment {
    appearance: none;
    position: absolute;
    inset-block-start: 50%;
    min-inline-size: var(--ahc-activity-segment-min-width);
    block-size: var(--ahc-activity-segment-height);
    transform: translateY(-50%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    color: transparent;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.13),
      0 7px 18px rgba(0, 0, 0, 0.22);
  }

  .ahc-activity-segment span {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .ahc-activity-segment:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-activity-segment[data-category="on"] {
    background: linear-gradient(90deg, var(--ahc-on), #86efac);
  }
  .ahc-activity-segment[data-category="cooling"] {
    background: linear-gradient(90deg, var(--ahc-cooling), #7dd3fc);
  }
  .ahc-activity-segment[data-category="heating"] {
    background: linear-gradient(90deg, var(--ahc-heating), #fdba74);
  }
  .ahc-activity-segment[data-category="drying"],
  .ahc-activity-segment[data-category="fan"] {
    background: linear-gradient(90deg, var(--ahc-idle), #5eead4);
  }
  .ahc-activity-segment[data-category="playing"] {
    background: linear-gradient(90deg, var(--ahc-playing), #c4b5fd);
  }
  .ahc-activity-segment[data-category="opening"] {
    background: linear-gradient(90deg, var(--ahc-opening), #fde68a);
  }
  .ahc-activity-segment[data-category="closing"] {
    background: linear-gradient(90deg, var(--ahc-closing), #e2e8f0);
  }

  .ahc-activity-empty {
    place-items: center;
    min-block-size: 260px;
    text-align: center;
  }

  .ahc-activity-empty h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.18rem;
    font-weight: 850;
  }

  .ahc-activity-empty p {
    max-inline-size: 520px;
    margin: var(--ahc-gap-xs) 0 0;
    color: var(--ahc-muted);
  }

  /* Product activity dashboard */
  .ahc-dashboard {
    direction: rtl;
    display: grid;
    gap: var(--ahc-gap-sm);
    min-inline-size: 0;
    min-block-size: 360px;
    padding: var(--ahc-gap-sm);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.68),
      rgba(2, 6, 23, 0.36)
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    overflow: hidden;
  }

  .ahc-dashboard__header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--ahc-gap-md);
    min-inline-size: 0;
    padding-block-end: 8px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ahc-dashboard__title-block {
    display: grid;
    gap: 4px;
    min-inline-size: 0;
    text-align: start;
  }

  .ahc-dashboard__title-block h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.08rem;
    font-weight: 850;
  }

  .ahc-dashboard__title-block p,
  .ahc-dashboard__hidden-note {
    margin: 0;
    color: var(--ahc-muted);
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .ahc-dashboard__range-pill {
    flex: 0 0 auto;
    min-block-size: 36px;
    display: inline-flex;
    align-items: center;
    padding-inline: 12px;
    border: 1px solid rgba(56, 189, 248, 0.32);
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.12);
    color: #bae6fd;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .ahc-dashboard__overview {
    display: grid;
    gap: 6px;
    padding: 8px 10px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.26);
  }

  .ahc-dashboard__density {
    direction: ltr;
    display: flex;
    align-items: end;
    gap: 3px;
    min-block-size: 34px;
    padding: 3px 2px;
  }

  .ahc-dashboard-density-bucket {
    flex: 1 1 0;
    min-inline-size: 3px;
    block-size: 28px;
    display: flex;
    align-items: end;
    justify-content: center;
    border-radius: 6px;
    background: rgba(148, 163, 184, 0.06);
  }

  .ahc-dashboard-density-fill {
    inline-size: 100%;
    block-size: 0;
    min-block-size: 0;
    max-block-size: 24px;
    border-radius: 5px 5px 2px 2px;
    background: linear-gradient(180deg, #7dd3fc, #22c55e);
    opacity: 0.22;
    transition:
      block-size 180ms ease,
      opacity 180ms ease;
  }

  .ahc-dashboard-density-bucket[data-active="true"]
    .ahc-dashboard-density-fill {
    block-size: max(4px, calc(var(--intensity, 0) * 24px));
    opacity: max(0.38, calc(var(--intensity, 0) * 0.96));
  }

  .ahc-dashboard__axis {
    direction: ltr;
    position: relative;
    min-block-size: 24px;
    margin-inline-start: calc(var(--ahc-dashboard-label-width) + 8px);
    margin-inline-end: 72px;
  }

  .ahc-dashboard__tick {
    position: absolute;
    inset-block: 0;
    transform: translateX(-50%);
    min-inline-size: 44px;
    display: grid;
    place-items: center;
    color: var(--ahc-muted);
    font-size: 0.74rem;
  }

  .ahc-dashboard__tick::after {
    content: "";
    position: absolute;
    inset-block-end: 0;
    inline-size: 1px;
    block-size: 7px;
    background: rgba(148, 163, 184, 0.18);
  }

  .ahc-dashboard__groups {
    display: grid;
    gap: var(--ahc-dashboard-group-gap);
    min-inline-size: 0;
  }

  .ahc-dashboard-group {
    display: grid;
    gap: 8px;
    padding: 10px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.52);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .ahc-area-card {
    overflow: hidden;
  }

  .ahc-dashboard-group__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-inline-size: 0;
  }

  .ahc-area-card__actions {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-inline-size: 0;
  }

  .ahc-dashboard-group__title {
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
  }

  .ahc-dashboard-group__title strong,
  .ahc-dashboard-row__label strong {
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc-dashboard-group__title span,
  .ahc-dashboard-group__meta,
  .ahc-dashboard-row__label span,
  .ahc-dashboard-row__meta span {
    color: var(--ahc-muted);
    font-size: 0.76rem;
  }

  .ahc-dashboard-group__meta {
    white-space: nowrap;
  }

  .ahc-area-card__inventory-button,
  .ahc-area-inventory__more {
    appearance: none;
    min-block-size: 32px;
    border: 1px solid rgba(125, 211, 252, 0.28);
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.1);
    color: #bae6fd;
    font: inherit;
    font-size: 0.76rem;
    font-weight: 800;
    cursor: pointer;
  }

  .ahc-area-card__inventory-button {
    padding-inline: 12px;
  }

  .ahc-area-card__inventory-button:hover,
  .ahc-area-inventory__more:hover {
    background: rgba(14, 165, 233, 0.18);
  }

  .ahc-dashboard-icon {
    display: inline-grid;
    place-items: center;
    inline-size: 30px;
    block-size: 30px;
    border-radius: 10px;
    background: rgba(56, 189, 248, 0.1);
    color: #bae6fd;
  }

  .ahc-dashboard-icon ha-icon {
    inline-size: 19px;
    block-size: 19px;
  }

  .ahc-dashboard-group__aggregate {
    direction: ltr;
    position: relative;
    min-block-size: 24px;
    border-radius: 999px;
    background:
      linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
      rgba(2, 6, 23, 0.2);
    background-size: calc(100% / 8) 100%;
    overflow: hidden;
  }

  .ahc-dashboard-group__rows {
    display: grid;
    gap: 3px;
  }

  .ahc-dashboard-row {
    direction: rtl;
    display: grid;
    grid-template-columns:
      var(--ahc-dashboard-label-width) minmax(0, 1fr)
      minmax(64px, 78px);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-block-size: var(--ahc-dashboard-row-height);
    padding-block: 1px;
    padding-inline: 6px;
    border-radius: var(--ahc-radius-sm);
  }

  .ahc-dashboard-row:hover {
    background: rgba(56, 189, 248, 0.06);
  }

  .ahc-dashboard-row__label {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
  }

  .ahc-dashboard-row__label div {
    min-inline-size: 0;
    display: grid;
    gap: 1px;
  }

  .ahc-dashboard-row__label strong,
  .ahc-dashboard-row__label span {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-dashboard-row__label strong {
    font-size: 0.84rem;
  }

  .ahc-dashboard-row__plot {
    direction: ltr;
    position: relative;
    min-inline-size: 0;
    min-block-size: var(--ahc-dashboard-row-height);
    border-radius: 999px;
    background:
      linear-gradient(to right, rgba(148, 163, 184, 0.07) 1px, transparent 1px),
      rgba(15, 23, 42, 0.36);
    background-size: calc(100% / 8) 100%;
    overflow: visible;
  }

  .ahc-dashboard-row__meta {
    display: grid;
    justify-items: end;
    gap: 1px;
    min-inline-size: 0;
    color: var(--ahc-muted);
    font-size: 0.72rem;
    text-align: end;
  }

  .ahc-dashboard-row__meta strong {
    color: #bbf7d0;
    font-size: 0.82rem;
  }

  .ahc-dashboard-segment {
    box-sizing: border-box;
    position: absolute;
    inset-block-start: 50%;
    min-inline-size: 0;
    block-size: var(--ahc-dashboard-segment-height);
    transform: translateY(-50%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: var(--segment-color, var(--ahc-on));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.16),
      0 6px 14px rgba(0, 0, 0, 0.18);
  }

  .ahc-dashboard-segment--min {
    min-inline-size: var(--ahc-dashboard-segment-min-width);
  }

  .ahc-dashboard-segment--aggregate {
    block-size: 13px;
    opacity: 0.86;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 8px 20px rgba(34, 197, 94, 0.18);
  }

  button.ahc-dashboard-segment {
    appearance: none;
    padding: 0;
    cursor: pointer;
  }

  .ahc-dashboard-segment span {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .ahc-dashboard-segment:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-dashboard-segment[data-category="cooling"] {
    background: linear-gradient(90deg, var(--ahc-cooling), #7dd3fc);
  }

  .ahc-dashboard-segment[data-category="heating"] {
    background: linear-gradient(90deg, var(--ahc-heating), #fdba74);
  }

  .ahc-dashboard-segment[data-category="drying"],
  .ahc-dashboard-segment[data-category="fan"] {
    background: linear-gradient(90deg, var(--ahc-idle), #5eead4);
  }

  .ahc-dashboard-segment[data-category="playing"] {
    background: linear-gradient(90deg, var(--ahc-playing), #c4b5fd);
  }

  .ahc-dashboard-segment[data-category="opening"] {
    background: linear-gradient(90deg, var(--ahc-opening), #fde68a);
  }

  .ahc-dashboard-segment[data-category="closing"] {
    background: linear-gradient(90deg, var(--ahc-closing), #e2e8f0);
  }

  .ahc-area-card__quiet {
    min-block-size: 36px;
    display: grid;
    align-items: center;
    padding-inline: 10px;
    border: 1px dashed rgba(148, 163, 184, 0.18);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.16);
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-area-inventory {
    display: grid;
    gap: 8px;
    padding-block-start: 6px;
    border-block-start: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ahc-area-inventory__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: var(--ahc-text);
    font-size: 0.78rem;
    font-weight: 850;
  }

  .ahc-area-inventory__header small {
    color: var(--ahc-muted);
    font-size: 0.74rem;
    font-weight: 700;
  }

  .ahc-area-inventory__groups {
    display: grid;
    gap: 7px;
  }

  .ahc-area-inventory__domain {
    display: grid;
    gap: 5px;
  }

  .ahc-area-inventory__domain-title {
    color: var(--ahc-muted);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .ahc-area-inventory__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-inline-size: 0;
  }

  .ahc-inventory-chip {
    appearance: none;
    min-inline-size: 0;
    max-inline-size: min(100%, 230px);
    min-block-size: 44px;
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 7px;
    padding: 6px 9px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.58);
    color: var(--ahc-text);
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  .ahc-inventory-chip:hover {
    border-color: rgba(125, 211, 252, 0.34);
    background: rgba(30, 41, 59, 0.68);
  }

  .ahc-inventory-chip[data-active-now="true"] {
    border-color: rgba(187, 247, 208, 0.38);
    background: rgba(34, 197, 94, 0.1);
  }

  .ahc-inventory-chip[data-had-activity="false"] {
    color: rgba(226, 232, 240, 0.78);
  }

  .ahc-inventory-chip .ahc-dashboard-icon {
    inline-size: 26px;
    block-size: 26px;
    border-radius: 8px;
  }

  .ahc-inventory-chip__copy {
    display: grid;
    gap: 1px;
    min-inline-size: 0;
  }

  .ahc-inventory-chip__copy strong,
  .ahc-inventory-chip__copy small {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-inventory-chip__copy strong {
    color: inherit;
    font-size: 0.78rem;
    font-weight: 850;
  }

  .ahc-inventory-chip__copy small {
    color: var(--ahc-muted);
    font-size: 0.7rem;
  }

  .ahc-area-inventory__more {
    justify-self: start;
    padding-inline: 12px;
  }

  .ahc-dashboard-empty {
    place-items: center;
    min-block-size: 260px;
    text-align: center;
  }

  .ahc-dashboard-empty h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.18rem;
    font-weight: 850;
  }

  .ahc-dashboard-empty p {
    max-inline-size: 520px;
    margin: 0;
    color: var(--ahc-muted);
  }

  .ahc-legacy-warning {
    padding: 10px 12px;
    border: 1px solid rgba(251, 191, 36, 0.28);
    border-radius: var(--ahc-radius-sm);
    background: rgba(251, 191, 36, 0.1);
    color: #fde68a;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  /* Area inventory dashboard polish */
  .ahc__insights-panel {
    display: block;
    inline-size: 100%;
    max-inline-size: var(--ahc-insights-width);
    min-inline-size: 0;
  }

  .ahc__insights-panel > .ahc__insights {
    inline-size: 100%;
  }

  .ahc-dashboard {
    gap: 10px;
    min-block-size: 0;
    padding: 10px;
  }

  .ahc-dashboard__header {
    min-block-size: 42px;
    padding-block-end: 6px;
  }

  .ahc-dashboard__title-block h3 {
    font-size: 1rem;
  }

  .ahc-dashboard__title-block p,
  .ahc-dashboard__hidden-note {
    font-size: 0.78rem;
  }

  .ahc-dashboard__overview {
    gap: 4px;
    padding: 6px 8px;
  }

  .ahc-dashboard__density {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5px, 1fr));
    align-items: end;
    gap: 3px;
    min-block-size: 36px;
  }

  .ahc-dashboard-density-bucket {
    block-size: 30px;
    min-inline-size: 0;
    align-items: end;
    background: rgba(148, 163, 184, 0.045);
  }

  .ahc-dashboard-density-fill {
    align-self: end;
    inline-size: 100%;
    background: linear-gradient(180deg, #93c5fd, #86efac);
  }

  .ahc-dashboard-density-bucket[data-active="true"]
    .ahc-dashboard-density-fill {
    block-size: max(5px, calc(var(--intensity, 0) * 28px));
    opacity: max(0.46, calc(var(--intensity, 0) * 0.98));
  }

  .ahc-area-card {
    display: grid;
    gap: 9px;
    overflow: hidden;
    padding: 10px;
    border: 1px solid rgba(148, 163, 184, 0.13);
    border-radius: var(--ahc-radius-sm);
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.54), rgba(2, 6, 23, 0.28)),
      rgba(15, 23, 42, 0.42);
  }

  .ahc-dashboard-group {
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .ahc-area-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-inline-size: 0;
  }

  .ahc-area-card__title {
    min-inline-size: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 8px;
  }

  .ahc-area-card__title-copy {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  .ahc-area-card__title-copy strong,
  .ahc-area-card__title-copy span {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-area-card__title-copy strong {
    color: var(--ahc-text);
    font-size: 0.9rem;
    font-weight: 850;
  }

  .ahc-area-card__title-copy span {
    color: var(--ahc-muted);
    font-size: 0.74rem;
  }

  .ahc-area-card__actions {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-inline-size: 0;
  }

  .ahc-area-card__meta {
    display: grid;
    justify-items: end;
    gap: 1px;
    min-inline-size: max-content;
    color: var(--ahc-muted);
    font-size: 0.72rem;
    line-height: 1.25;
  }

  .ahc-area-card__meta strong {
    color: #bbf7d0;
    font-size: 0.84rem;
    font-weight: 850;
  }

  .ahc-area-card__aggregate {
    min-block-size: 20px;
    background:
      linear-gradient(to right, rgba(148, 163, 184, 0.06) 1px, transparent 1px),
      rgba(2, 6, 23, 0.18);
  }

  .ahc-area-card__content {
    display: grid;
    gap: 10px;
    min-inline-size: 0;
  }

  .ahc-area-card__activity {
    min-inline-size: 0;
  }

  .ahc-dashboard-group__rows {
    display: grid;
    gap: 4px;
  }

  .ahc-dashboard-row {
    direction: rtl;
    grid-template-columns:
      minmax(170px, var(--ahc-dashboard-label-width))
      minmax(220px, 1fr);
    min-block-size: var(--ahc-dashboard-row-height);
    gap: 10px;
    padding-block: 2px;
    padding-inline: 0;
    border-radius: 10px;
  }

  .ahc-dashboard-row__label {
    min-inline-size: 0;
    align-self: stretch;
    padding-inline: 4px;
  }

  .ahc-dashboard-row__label div {
    gap: 1px;
  }

  .ahc-dashboard-row__label strong {
    font-size: 0.8rem;
  }

  .ahc-dashboard-row__inline-meta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--ahc-muted);
    font-size: 0.7rem;
  }

  .ahc-dashboard-row__inline-meta strong {
    color: #bbf7d0;
    font-size: 0.72rem;
  }

  .ahc-dashboard-row__plot {
    min-block-size: var(--ahc-dashboard-row-height);
    background:
      linear-gradient(
        to right,
        rgba(148, 163, 184, 0.055) 1px,
        transparent 1px
      ),
      transparent;
  }

  .ahc-dashboard-row__plot::before {
    content: "";
    position: absolute;
    inset-inline: 4px;
    inset-block-start: 50%;
    block-size: 2px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.13);
  }

  .ahc-dashboard-row__meta {
    display: none;
  }

  .ahc-dashboard-segment {
    z-index: 1;
  }

  .ahc-dashboard-segment--row {
    block-size: 11px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 8px 18px rgba(0, 0, 0, 0.2);
  }

  .ahc-dashboard-segment--min {
    min-inline-size: 8px;
    box-shadow:
      0 0 0 3px rgba(125, 211, 252, 0.13),
      0 0 16px rgba(125, 211, 252, 0.28);
  }

  .ahc-area-card__quiet {
    min-block-size: 44px;
    align-items: center;
    border-style: solid;
    background: rgba(2, 6, 23, 0.2);
  }

  .ahc-area-inventory {
    gap: 8px;
    padding: 10px;
    border: 1px solid rgba(148, 163, 184, 0.11);
    border-radius: 12px;
    background: rgba(2, 6, 23, 0.22);
  }

  .ahc-area-inventory__header {
    min-block-size: 24px;
  }

  .ahc-area-inventory__chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
    gap: 7px;
  }

  .ahc-inventory-chip {
    position: relative;
    max-inline-size: none;
    min-block-size: 48px;
    grid-template-columns: auto minmax(0, 1fr);
    border-radius: 10px;
    background: rgba(15, 23, 42, 0.58);
  }

  .ahc-inventory-chip__copy {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    column-gap: 6px;
  }

  .ahc-inventory-chip__status {
    inline-size: 7px;
    block-size: 7px;
    border-radius: 999px;
    background: var(--ahc-disabled);
  }

  .ahc-inventory-chip__copy strong,
  .ahc-inventory-chip__copy small {
    grid-column: 2;
  }

  .ahc-inventory-chip[data-state-tone="active"] {
    border-color: rgba(187, 247, 208, 0.45);
    background: rgba(34, 197, 94, 0.12);
  }

  .ahc-inventory-chip[data-state-tone="active"] .ahc-inventory-chip__status {
    background: var(--ahc-on);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
  }

  .ahc-inventory-chip[data-state-tone="had_activity"]
    .ahc-inventory-chip__status {
    background: var(--ahc-accent);
  }

  .ahc-inventory-chip[data-state-tone="inactive"] {
    opacity: 0.84;
  }

  .ahc-inventory-chip[data-state-tone="unavailable"] {
    border-color: rgba(148, 163, 184, 0.18);
    color: rgba(226, 232, 240, 0.68);
    background: rgba(15, 23, 42, 0.34);
  }

  .ahc-inventory-chip[data-state-tone="unavailable"]
    .ahc-inventory-chip__status {
    background: var(--ahc-unknown);
  }

  /* Timeline */
  .ahc-timeline-card {
    min-inline-size: 0;
    min-block-size: 420px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background:
      linear-gradient(180deg, rgba(30, 41, 59, 0.42), rgba(2, 6, 23, 0.3)),
      radial-gradient(
        circle at 88% 12%,
        rgba(56, 189, 248, 0.1),
        transparent 32%
      );
    overflow: hidden;
  }

  .ahc-timeline-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 58px;
    padding: 12px 16px;
    border-block-end: 1px solid var(--ahc-border-soft);
    background: rgba(15, 23, 42, 0.4);
  }

  .ahc-timeline-toolbar .ahc-curation-note {
    max-inline-size: min(520px, 48vw);
  }

  .ahc-timeline-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ahc-text);
  }

  .ahc-timeline-scroll {
    inline-size: 100%;
    max-block-size: var(--ahc-timeline-height, min(62svh, 680px));
    overflow: auto;
    overscroll-behavior-inline: contain;
    scrollbar-color: rgba(56, 189, 248, 0.42) rgba(15, 23, 42, 0.3);
  }

  .ahc-timeline {
    direction: ltr;
    position: relative;
    min-inline-size: 1040px;
    padding: 0;
  }

  .ahc-timeline__axis {
    position: sticky;
    inset-block-start: 0;
    z-index: 3;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-label-width);
    min-block-size: 48px;
    background: rgba(15, 23, 42, 0.92);
    backdrop-filter: blur(14px);
    border-block-end: 1px solid var(--ahc-border-soft);
  }

  .ahc-timeline__axis-spacer {
    position: sticky;
    inset-inline-end: 0;
    z-index: 4;
    direction: rtl;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-inline: var(--ahc-gap-md);
    color: var(--ahc-muted);
    font-size: 0.8rem;
  }

  .ahc-timeline__ticks {
    position: relative;
    min-block-size: 44px;
  }

  .ahc-timeline__tick {
    position: absolute;
    inset-block: 0;
    transform: translateX(-50%);
    color: var(--ahc-muted);
    font-size: 0.78rem;
    display: grid;
    place-items: center;
    min-inline-size: 48px;
  }

  .ahc-timeline__tick::after {
    content: "";
    position: absolute;
    inset-block-end: 0;
    inline-size: 1px;
    block-size: 12px;
    background: var(--ahc-grid-line);
  }

  .ahc-group {
    direction: rtl;
    margin: var(--ahc-group-gap);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.3);
    overflow: clip;
  }

  .ahc-group:nth-child(even) {
    background: rgba(15, 23, 42, 0.36);
  }

  .ahc-group__header {
    position: sticky;
    inset-inline-start: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 54px;
    padding-block: 0;
    padding-inline: var(--ahc-gap-md);
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.72)),
      rgba(2, 6, 23, 0.34);
    cursor: pointer;
    list-style: none;
  }

  .ahc-group__header::-webkit-details-marker {
    display: none;
  }

  .ahc-group__empty {
    direction: rtl;
    padding: var(--ahc-gap-md);
    color: var(--ahc-muted);
    font-size: 0.82rem;
  }

  .ahc-group__title {
    display: flex;
    align-items: center;
    gap: var(--ahc-gap-xs);
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc-group__meta {
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-row {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-label-width);
    min-block-size: var(--ahc-row-height);
    border-block-start: 1px solid rgba(148, 163, 184, 0.09);
  }

  .ahc-row:hover {
    background: var(--ahc-row-hover);
  }

  .ahc-row__label {
    position: sticky;
    inset-inline-start: auto;
    inset-inline-end: 0;
    z-index: 2;
    direction: rtl;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ahc-gap-xs);
    padding-inline: 12px 14px;
    border-inline-start: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(8, 15, 32, 0.72);
    backdrop-filter: blur(10px);
    min-inline-size: 0;
  }

  .ahc-entity-icon,
  .ahc-group-icon {
    display: inline-grid;
    place-items: center;
    inline-size: 22px;
    block-size: 22px;
    color: var(--ahc-accent);
    flex: 0 0 auto;
  }

  ha-icon.ahc-entity-icon,
  ha-icon.ahc-group-icon {
    inline-size: 22px;
    block-size: 22px;
  }

  .ahc-group-icon {
    color: #7dd3fc;
  }

  .ahc-row__name {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--ahc-text);
    font-weight: 700;
    font-size: 0.86rem;
  }

  .ahc-row__state-chip {
    justify-self: end;
    border-radius: 999px;
    padding-block: 3px;
    padding-inline: 8px;
    color: var(--ahc-text);
    font-size: 0.72rem;
    font-weight: 800;
    background: rgba(148, 163, 184, 0.14);
    border: 1px solid rgba(148, 163, 184, 0.18);
  }

  .ahc-row__state-chip[data-state="on"] {
    color: #bbf7d0;
    background: rgba(34, 197, 94, 0.16);
    border-color: rgba(34, 197, 94, 0.28);
  }
  .ahc-row__state-chip[data-state="cooling"] {
    color: #bae6fd;
    background: rgba(56, 189, 248, 0.14);
    border-color: rgba(56, 189, 248, 0.3);
  }
  .ahc-row__state-chip[data-state="heating"] {
    color: #fed7aa;
    background: rgba(251, 146, 60, 0.16);
    border-color: rgba(251, 146, 60, 0.3);
  }
  .ahc-row__state-chip[data-state="playing"] {
    color: #ddd6fe;
    background: rgba(167, 139, 250, 0.16);
    border-color: rgba(167, 139, 250, 0.3);
  }

  .ahc-row__track {
    direction: ltr;
    position: relative;
    min-inline-size: 0;
    min-block-size: var(--ahc-row-height);
    background-image: linear-gradient(
      to right,
      var(--ahc-grid-line) 1px,
      transparent 1px
    );
    background-size: calc(100% / 8) 100%;
  }

  .ahc-row__svg {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
  }

  .ahc-row__svg-track {
    stroke: rgba(148, 163, 184, 0.08);
    stroke-width: 2;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  .ahc-segment-svg {
    cursor: pointer;
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 0.8;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.22));
  }

  .ahc-segment-svg--inactive {
    cursor: pointer;
    opacity: 0.28;
    stroke: rgba(255, 255, 255, 0.04);
    filter: none;
  }

  .ahc-segment-svg[data-active="true"] {
    opacity: 0.96;
  }

  .ahc-segment-svg:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-segment-svg[data-category="on"] {
    fill: var(--ahc-on);
  }
  .ahc-segment-svg[data-category="off"] {
    fill: color-mix(in srgb, var(--ahc-off) 72%, #dbeafe 28%);
  }
  .ahc-segment-svg[data-category="cooling"] {
    fill: var(--ahc-cooling);
  }
  .ahc-segment-svg[data-category="heating"] {
    fill: var(--ahc-heating);
  }
  .ahc-segment-svg[data-category="drying"],
  .ahc-segment-svg[data-category="fan"] {
    fill: var(--ahc-idle);
  }
  .ahc-segment-svg[data-category="playing"] {
    fill: var(--ahc-playing);
  }
  .ahc-segment-svg[data-category="opening"] {
    fill: var(--ahc-opening);
  }
  .ahc-segment-svg[data-category="closing"] {
    fill: var(--ahc-closing);
  }
  .ahc-segment-svg[data-category="idle"] {
    fill: color-mix(in srgb, var(--ahc-idle) 62%, #64748b 38%);
  }
  .ahc-segment-svg[data-category="unknown"] {
    fill: var(--ahc-unknown);
    stroke-dasharray: 3 2;
  }

  .ahc-timeline-card--baselines .ahc-row__track::before {
    content: "";
    position: absolute;
    inset-inline: 14px;
    inset-block-start: 50%;
    block-size: 1px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.08);
  }

  .ahc-segment {
    position: absolute;
    inset-block-start: 50%;
    block-size: 12px;
    transform: translateY(-50%);
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.08) inset,
      0 6px 16px rgba(0, 0, 0, 0.18);
    cursor: pointer;
  }

  .ahc-segment:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-segment[data-category="on"] {
    background: linear-gradient(
      90deg,
      var(--ahc-on),
      color-mix(in srgb, var(--ahc-on) 72%, #0f172a)
    );
  }
  .ahc-segment[data-category="off"] {
    background: linear-gradient(
      90deg,
      var(--ahc-off),
      color-mix(in srgb, var(--ahc-off) 72%, #0f172a)
    );
  }
  .ahc-segment[data-category="cooling"] {
    background: linear-gradient(
      90deg,
      var(--ahc-cooling),
      color-mix(in srgb, var(--ahc-cooling) 70%, #1d4ed8)
    );
  }
  .ahc-segment[data-category="heating"] {
    background: linear-gradient(
      90deg,
      var(--ahc-heating),
      color-mix(in srgb, var(--ahc-heating) 70%, #7c2d12)
    );
  }
  .ahc-segment[data-category="drying"],
  .ahc-segment[data-category="fan"] {
    background: linear-gradient(
      90deg,
      var(--ahc-idle),
      color-mix(in srgb, var(--ahc-idle) 70%, #0f766e)
    );
  }
  .ahc-segment[data-category="playing"] {
    background: linear-gradient(
      90deg,
      var(--ahc-playing),
      color-mix(in srgb, var(--ahc-playing) 68%, #312e81)
    );
  }
  .ahc-segment[data-category="opening"] {
    background: linear-gradient(
      90deg,
      var(--ahc-opening),
      color-mix(in srgb, var(--ahc-opening) 70%, #713f12)
    );
  }
  .ahc-segment[data-category="closing"] {
    background: linear-gradient(
      90deg,
      var(--ahc-closing),
      color-mix(in srgb, var(--ahc-closing) 70%, #334155)
    );
  }
  .ahc-segment[data-category="idle"] {
    background: linear-gradient(
      90deg,
      var(--ahc-idle),
      color-mix(in srgb, var(--ahc-idle) 70%, #0f766e)
    );
  }
  .ahc-segment[data-category="unknown"] {
    background: repeating-linear-gradient(
      90deg,
      var(--ahc-unknown),
      var(--ahc-unknown) 6px,
      transparent 6px,
      transparent 10px
    );
  }

  .ahc-now-line {
    position: absolute;
    inset-block: 0;
    inline-size: 1px;
    background: linear-gradient(
      180deg,
      transparent,
      var(--ahc-now) 12%,
      var(--ahc-now) 88%,
      transparent
    );
    box-shadow:
      0 0 0 1px rgba(96, 165, 250, 0.14),
      0 0 18px rgba(96, 165, 250, 0.3);
    pointer-events: none;
    z-index: 4;
  }

  .ahc-now-line__label {
    position: absolute;
    inset-block-start: 8px;
    transform: translateX(-50%);
    padding-block: 2px;
    padding-inline: 8px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.62);
    color: #dbeafe;
    font-size: 0.72rem;
    font-weight: 800;
    white-space: nowrap;
  }

  /* Legend */
  .ahc-legend {
    direction: rtl;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ahc-gap-md);
    flex-wrap: wrap;
    padding: var(--ahc-gap-md);
    color: var(--ahc-muted);
    font-size: 0.82rem;
  }

  .ahc-legend__item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .ahc-legend__swatch {
    inline-size: 24px;
    block-size: 8px;
    border-radius: 999px;
    background: var(--swatch, var(--ahc-accent));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }

  /* Tooltip / popover */
  .ahc-popover {
    direction: rtl;
    position: fixed;
    inset-inline-start: var(--ahc-popover-x, 16px);
    inset-block-start: var(--ahc-popover-y, 16px);
    z-index: 2147483641;
    max-inline-size: min(320px, calc(100vw - 32px));
    padding: var(--ahc-gap-md);
    border: 1px solid var(--ahc-border);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.96);
    color: var(--ahc-text);
    box-shadow: var(--ahc-shadow);
    backdrop-filter: blur(18px);
  }

  .ahc-popover__close {
    appearance: none;
    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;
    inline-size: 30px;
    block-size: 30px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: 999px;
    background: rgba(2, 6, 23, 0.32);
    color: var(--ahc-text);
    cursor: pointer;
  }

  .ahc-popover__title {
    margin: 0 0 var(--ahc-gap-xs);
    font-size: 1rem;
    font-weight: 850;
  }

  .ahc-popover__dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 6px 14px;
    margin: 0;
    font-size: 0.86rem;
  }

  .ahc-popover__dt {
    color: var(--ahc-muted);
  }

  .ahc-popover__dd {
    margin: 0;
    color: var(--ahc-text);
    text-align: end;
  }

  /* Mobile filter sheet */
  .ahc-filter-sheet-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2147483638;
    background: rgba(2, 6, 23, 0.62);
    backdrop-filter: blur(4px);
  }

  .ahc-filter-sheet {
    direction: rtl;
    position: fixed;
    inset-inline: max(12px, env(safe-area-inset-left))
      max(12px, env(safe-area-inset-right));
    inset-block-end: 0;
    z-index: 2147483639;
    inline-size: min(720px, calc(100vw - 24px));
    margin-inline: auto;
    max-block-size: min(88svh, 900px);
    overflow: auto;
    padding: var(--ahc-gap-lg)
      max(var(--ahc-gap-lg), env(safe-area-inset-right))
      max(var(--ahc-gap-lg), env(safe-area-inset-bottom))
      max(var(--ahc-gap-lg), env(safe-area-inset-left));
    border-start-start-radius: var(--ahc-radius-xl);
    border-start-end-radius: var(--ahc-radius-xl);
    border: 1px solid var(--ahc-border);
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.98),
      rgba(2, 6, 23, 0.98)
    );
    color: var(--ahc-text);
    box-shadow: 0 -24px 80px rgba(0, 0, 0, 0.46);
  }

  .ahc-filter-sheet__handle {
    inline-size: 72px;
    block-size: 5px;
    margin-inline: auto;
    margin-block-end: var(--ahc-gap-md);
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.5);
  }

  .ahc-filter-sheet__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    margin-block-end: var(--ahc-gap-md);
  }

  .ahc-filter-sheet__title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 850;
  }

  .ahc-filter-section {
    display: grid;
    gap: var(--ahc-gap-sm);
    padding: var(--ahc-gap-md);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: rgba(30, 41, 59, 0.34);
    margin-block-end: var(--ahc-gap-md);
  }

  .ahc-filter-section__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ahc-gap-xs);
  }

  .ahc-filter-section__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc-filter-option {
    appearance: none;
    display: grid;
    gap: 4px;
    min-block-size: 64px;
    padding-block: 10px;
    padding-inline: 16px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.46);
    color: var(--ahc-text);
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .ahc-filter-option small {
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-filter-option[aria-pressed="true"] {
    border-color: rgba(56, 189, 248, 0.75);
    background: linear-gradient(
      180deg,
      rgba(14, 165, 233, 0.24),
      rgba(37, 99, 235, 0.16)
    );
  }

  .ahc__search--sheet {
    inline-size: 100%;
  }

  .ahc-filter-sheet__footer {
    position: sticky;
    inset-block-end: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
    gap: var(--ahc-gap-sm);
    padding-block-start: var(--ahc-gap-md);
    background: linear-gradient(180deg, transparent, rgba(2, 6, 23, 0.95) 22%);
  }

  /* Empty/loading/error */
  .ahc-loading {
    display: grid;
    gap: var(--ahc-gap-lg);
    min-block-size: 420px;
    padding: var(--ahc-gap-lg);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.64),
      rgba(2, 6, 23, 0.34)
    );
  }

  .ahc-loading__copy {
    text-align: center;
  }

  .ahc-loading__copy h3 {
    margin: 0 0 var(--ahc-gap-xs);
    color: var(--ahc-text);
  }

  .ahc-loading__copy p {
    margin: 0;
    color: var(--ahc-muted);
  }

  .ahc-loading__timeline {
    direction: ltr;
    display: grid;
    gap: var(--ahc-gap-md);
  }

  .ahc-loading__group {
    display: grid;
    gap: 10px;
    padding: var(--ahc-gap-md);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.34);
  }

  .ahc-loading__group span,
  .ahc-loading__group i {
    display: block;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.12),
      rgba(56, 189, 248, 0.22),
      rgba(148, 163, 184, 0.12)
    );
    animation: ahc-shimmer 1400ms ease-in-out infinite;
    animation-delay: calc(var(--delay, 0) * 90ms);
  }

  .ahc-loading__group span {
    inline-size: 120px;
    block-size: 16px;
  }

  .ahc-loading__group i {
    inline-size: var(--width, 48%);
    block-size: 12px;
  }

  @keyframes ahc-shimmer {
    0%,
    100% {
      opacity: 0.44;
    }
    50% {
      opacity: 1;
    }
  }

  .ahc-state-card {
    display: grid;
    place-items: center;
    min-block-size: 220px;
    padding: var(--ahc-gap-xl);
    border: 1px dashed var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    color: var(--ahc-muted);
    text-align: center;
  }

  .ahc-state-card__title {
    margin: 0 0 var(--ahc-gap-xs);
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc-state-card__yaml {
    direction: ltr;
    text-align: left;
    max-inline-size: min(520px, 100%);
    margin: var(--ahc-gap-md) auto 0;
    padding: var(--ahc-gap-md);
    overflow: auto;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.34);
    color: var(--ahc-text);
    font-size: 0.82rem;
  }

  .ahc-empty-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--ahc-gap-xs);
    margin-block-start: var(--ahc-gap-md);
  }

  .ahc-debug {
    display: block;
    justify-self: start;
    inline-size: fit-content;
    max-inline-size: 100%;
    gap: var(--ahc-gap-sm);
    padding: 0;
    border: 1px solid rgba(56, 189, 248, 0.24);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.18);
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-debug summary {
    cursor: pointer;
    list-style: none;
  }

  .ahc-debug summary::-webkit-details-marker {
    display: none;
  }

  .ahc-debug[open] {
    display: grid;
    inline-size: 100%;
    padding: var(--ahc-gap-md);
    border-style: dashed;
    background: rgba(2, 6, 23, 0.32);
  }

  .ahc-debug__header {
    display: flex;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 32px;
    align-items: center;
    padding-block: 0;
    padding-inline: 10px;
    color: var(--ahc-text);
  }

  .ahc-debug[open] .ahc-debug__header {
    padding: 0;
  }

  .ahc-debug__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--ahc-gap-xs);
    margin: 0;
  }

  .ahc-debug__grid div {
    display: grid;
    gap: 2px;
    padding: var(--ahc-gap-xs);
    border-radius: var(--ahc-radius-xs);
    background: rgba(15, 23, 42, 0.42);
  }

  .ahc-debug dt,
  .ahc-debug dd {
    margin: 0;
  }

  .ahc-debug dd {
    color: var(--ahc-text);
    font-weight: 800;
  }

  .ahc-debug__meta {
    margin: 0;
    overflow-wrap: anywhere;
  }

  .ahc-entity-list {
    display: grid;
    gap: var(--ahc-gap-xs);
    max-block-size: 260px;
    overflow: auto;
  }

  .ahc-entity-list__item {
    display: grid;
    gap: 2px;
    min-block-size: 44px;
    padding-block: 7px;
    padding-inline: 12px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.42);
  }

  .ahc-entity-list__item span {
    color: var(--ahc-text);
    font-weight: 750;
  }

  .ahc-entity-list__item small,
  .ahc-entity-list__more {
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  /* Responsive */
  @media (max-width: 1100px) {
    :host {
      --ahc-label-width: 180px;
      --ahc-activity-label-width: 190px;
      --ahc-dashboard-label-width: 200px;
      --ahc-insights-width: 320px;
    }

    .ahc__body {
      grid-template-columns: minmax(0, 1fr);
    }

    .ahc__insights-panel {
      max-inline-size: none;
    }

    .ahc__insights {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ahc__insights-title {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 900px) {
    :host {
      --ahc-label-width: 180px;
      --ahc-activity-label-width: 180px;
      --ahc-dashboard-label-width: 180px;
    }
  }

  @media (max-width: 760px) {
    :host {
      --ahc-chip-height: 44px;
      --ahc-label-width: 180px;
      --ahc-activity-label-width: 160px;
      --ahc-dashboard-label-width: 160px;
      --ahc-dashboard-row-height: 36px;
    }

    .ahc {
      min-block-size: 100svh;
      border-radius: var(--ahc-radius-md);
      padding: var(--ahc-gap-md);
      gap: var(--ahc-gap-md);
    }

    .ahc--panel,
    .ahc--fullscreen {
      border-radius: 0;
      min-block-size: 100svh;
      padding: max(12px, env(safe-area-inset-top))
        max(12px, env(safe-area-inset-right))
        max(12px, env(safe-area-inset-bottom))
        max(12px, env(safe-area-inset-left));
    }

    .ahc__topbar {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }

    .ahc__title-block {
      order: -1;
      justify-items: center;
      text-align: center;
    }

    .ahc__title {
      font-size: 1.45rem;
    }

    .ahc__toolbar {
      justify-content: center;
      flex-wrap: wrap;
      min-inline-size: 0;
    }

    .ahc__search {
      inline-size: 100%;
    }

    .ahc__filters {
      display: grid;
      gap: var(--ahc-gap-xs);
      padding: 0;
      border: 0;
      background: transparent;
      overflow: hidden;
    }

    .ahc__filter-row {
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      padding-block: 2px 8px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .ahc__filter-row::-webkit-scrollbar {
      display: none;
    }

    .ahc__filter-row > * {
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .ahc-curation-note {
      max-inline-size: 72vw;
    }

    .ahc__filter-label {
      min-inline-size: max-content;
    }

    .ahc__summary-grid {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x proximity;
      gap: var(--ahc-gap-sm);
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      scrollbar-width: none;
    }

    .ahc__summary-grid::-webkit-scrollbar {
      display: none;
    }

    .ahc__metric {
      flex: 0 0 min(44vw, 230px);
      scroll-snap-align: start;
      min-block-size: 104px;
      grid-template-columns: minmax(0, 1fr) auto;
      padding: var(--ahc-gap-sm);
      border: 1px solid var(--ahc-border-soft);
      border-radius: var(--ahc-radius-md);
      background: linear-gradient(
        180deg,
        rgba(30, 41, 59, 0.54),
        rgba(15, 23, 42, 0.58)
      );
    }

    .ahc__metric-icon {
      inline-size: 44px;
      block-size: 44px;
      border-radius: 14px;
    }

    .ahc__insights {
      display: flex;
      overflow-x: auto;
      padding: 0;
      border: 0;
      background: transparent;
      scrollbar-width: none;
    }

    .ahc__insights::-webkit-scrollbar {
      display: none;
    }

    .ahc__insights-title {
      display: none;
    }

    .ahc__insight-card {
      flex: 0 0 min(78vw, 280px);
    }

    .ahc-activity {
      padding: var(--ahc-gap-sm);
    }

    .ahc-activity__header,
    .ahc-activity-group__header {
      align-items: stretch;
      flex-direction: column;
    }

    .ahc-activity__range,
    .ahc-activity-group__meta {
      align-self: start;
    }

    .ahc-activity__axis {
      margin-inline-end: var(--ahc-activity-label-width);
    }

    .ahc-activity-row {
      grid-template-columns: minmax(260px, 1fr) var(--ahc-activity-label-width);
      gap: var(--ahc-gap-xs);
    }

    .ahc-activity-group {
      overflow-x: auto;
    }

    .ahc-dashboard {
      padding: var(--ahc-gap-sm);
    }

    .ahc-dashboard__header,
    .ahc-dashboard-group__header {
      align-items: stretch;
      flex-direction: column;
    }

    .ahc-area-card__actions {
      justify-content: space-between;
    }

    .ahc-dashboard__range-pill,
    .ahc-dashboard-group__meta {
      align-self: start;
    }

    .ahc-dashboard__axis {
      margin-inline-start: calc(var(--ahc-dashboard-label-width) + 8px);
      margin-inline-end: 56px;
    }

    .ahc-dashboard-row {
      grid-template-columns: var(--ahc-dashboard-label-width) minmax(180px, 1fr);
      gap: 8px;
      padding-inline: 0;
    }

    .ahc-area-inventory__chips {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-block-end: 2px;
      scrollbar-width: none;
    }

    .ahc-area-inventory__chips::-webkit-scrollbar {
      display: none;
    }

    .ahc-inventory-chip {
      flex: 0 0 min(72vw, 230px);
    }

    .ahc-timeline-card {
      border-radius: var(--ahc-radius-md);
      background: transparent;
      border: 0;
    }

    .ahc-timeline-toolbar {
      position: sticky;
      inset-block-start: 0;
      z-index: 5;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(14px);
    }

    .ahc-timeline {
      min-inline-size: 760px;
    }

    .ahc-timeline__groups {
      display: grid;
      gap: var(--ahc-gap-md);
      padding: var(--ahc-gap-sm);
    }

    .ahc-group {
      border: 1px solid var(--ahc-border-soft);
      border-radius: var(--ahc-radius-md);
      overflow: hidden;
      background: linear-gradient(
        180deg,
        rgba(30, 41, 59, 0.48),
        rgba(15, 23, 42, 0.58)
      );
    }

    .ahc-group__header {
      position: static;
      min-block-size: 64px;
    }

    .ahc-timeline__axis,
    .ahc-row {
      grid-template-columns: minmax(560px, 1fr) var(--ahc-label-width);
    }

    .ahc-row {
      min-block-size: 46px;
    }

    .ahc-row__label {
      padding-inline: var(--ahc-gap-sm);
    }

    .ahc-row__state-chip {
      display: inline-flex;
      min-block-size: 28px;
      align-items: center;
    }

    .ahc-legend {
      justify-content: flex-start;
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-inline: var(--ahc-gap-sm);
    }

    .ahc-popover {
      inset-inline: 12px !important;
      inset-block-end: 12px !important;
      inset-block-start: auto !important;
      max-inline-size: none;
      border-radius: 24px;
    }

    .ahc-filter-sheet {
      inset-inline: max(10px, env(safe-area-inset-left))
        max(10px, env(safe-area-inset-right));
      inline-size: auto;
      max-block-size: min(86svh, 820px);
      border-start-start-radius: 28px;
      border-start-end-radius: 28px;
    }

    .ahc-filter-section__chips {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .ahc-filter-section__chips::-webkit-scrollbar {
      display: none;
    }

    .ahc-filter-section__chips > * {
      flex: 0 0 auto;
    }
  }

  @media (max-width: 600px) {
    :host {
      --ahc-label-width: 150px;
      --ahc-activity-label-width: 145px;
      --ahc-dashboard-label-width: 150px;
      --ahc-dashboard-row-height: 34px;
    }
  }

  @media (max-width: 420px) {
    :host {
      --ahc-label-width: 130px;
      --ahc-activity-label-width: 132px;
      --ahc-dashboard-label-width: 130px;
    }

    .ahc__summary-grid {
      margin-inline: -2px;
    }

    .ahc__metric-value {
      font-size: 1.32rem;
    }

    .ahc-timeline__axis,
    .ahc-row {
      grid-template-columns: minmax(540px, 1fr) var(--ahc-label-width);
    }

    .ahc-row__name {
      font-size: 0.8rem;
    }

    .ahc-row__state-chip {
      display: none;
    }

    .ahc-activity-row__name {
      font-size: 0.78rem;
    }

    .ahc-activity__density-strip {
      grid-auto-columns: minmax(4px, 1fr);
      gap: 2px;
    }

    .ahc-dashboard-row {
      grid-template-columns: var(--ahc-dashboard-label-width) minmax(150px, 1fr);
    }

    .ahc-dashboard-row__label span {
      display: none;
    }

    .ahc-dashboard-row__meta strong {
      font-size: 0.74rem;
    }

    .ahc-inventory-chip {
      flex-basis: min(78vw, 210px);
    }
  }

  /* Mockup 05 compact dashboard shell */
  .ahc__hero {
    min-block-size: 72px;
    max-block-size: 96px;
  }

  .ahc__hero.ahc__topbar {
    align-items: center;
    padding-block: 10px;
    padding-inline: 14px;
  }

  .ahc__hero .ahc__title-block {
    justify-items: start;
  }

  .ahc__hero-actions {
    justify-content: flex-start;
    min-inline-size: 0;
  }

  .ahc__hero-actions .ahc__button {
    min-block-size: 38px;
    padding-inline: 12px;
  }

  .ahc__toolbar.ahc__filters {
    display: flex;
    align-items: center;
    max-block-size: 58px;
    min-block-size: 58px;
    padding: 8px 10px;
  }

  .ahc__toolbar .ahc__filter-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }

  .ahc__toolbar .ahc__filter-row::-webkit-scrollbar {
    display: none;
  }

  .ahc__toolbar .ahc__filter-row > * {
    flex: 0 0 auto;
  }

  .ahc__toolbar .ahc__search {
    inline-size: min(320px, 25vw);
  }

  .ahc__toolbar .ahc-curation-note {
    max-inline-size: min(320px, 24vw);
  }

  .ahc__toolbar .ahc__chip,
  .ahc__toolbar .ahc__button,
  .ahc__toolbar .ahc__segmented-button {
    min-block-size: 40px;
  }

  .ahc__summary-strip {
    min-block-size: 82px;
    max-block-size: 88px;
  }

  .ahc__summary-strip .ahc__metric {
    min-block-size: 82px;
    padding-block: 10px;
    padding-inline: 14px;
  }

  .ahc--panel .ahc__body,
  .ahc--fullscreen .ahc__body {
    min-block-size: 0;
    block-size: 100%;
  }

  .ahc__main {
    block-size: 100%;
    direction: rtl;
    overflow: hidden;
  }

  .ahc[dir="rtl"] .ahc__main {
    grid-column: 1;
  }

  .ahc[dir="rtl"] .ahc__insights-panel {
    grid-column: 2;
  }

  .ahc[dir="ltr"] .ahc__main {
    grid-column: 1;
  }

  .ahc[dir="ltr"] .ahc__insights-panel {
    grid-column: 2;
  }

  .ahc .ahc__body--no-insights .ahc__main {
    grid-column: 1;
  }

  .ahc__insights-panel {
    align-self: stretch;
    direction: rtl;
    max-inline-size: var(--ahc-insights-width);
    min-block-size: 0;
    overflow: hidden;
  }

  .ahc__insights-panel > .ahc__insights {
    block-size: 100%;
    max-block-size: 100%;
    overflow: auto;
  }

  .ahc__insights-panel .ahc__insight-card {
    min-block-size: 112px;
  }

  .ahc-dashboard {
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    block-size: var(
      --ahc-dashboard-height,
      var(--ahc-timeline-height, calc(100svh - 320px))
    );
    min-block-size: 520px;
    max-block-size: 760px;
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    gap: 12px;
    padding: 14px;
    border: 1px solid rgba(125, 211, 252, 0.16);
    border-radius: 18px;
    background:
      linear-gradient(180deg, rgba(20, 31, 54, 0.94), rgba(8, 13, 29, 0.96)),
      rgba(15, 23, 42, 0.88);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.045),
      0 18px 46px rgba(2, 6, 23, 0.22);
    overflow: hidden;
  }

  .ahc-dashboard__header {
    min-block-size: 48px;
    padding-block: 0;
    padding-inline: 4px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.11);
  }

  .ahc-dashboard__title-block h3 {
    font-size: 0.98rem;
  }

  .ahc-dashboard__range-pill {
    min-block-size: 32px;
    border-radius: 8px;
  }

  .ahc-dashboard__density {
    display: grid;
    grid-template-rows: 32px 14px;
    gap: 4px;
    block-size: 54px;
    min-block-size: 54px;
    padding-block: 4px 3px;
    padding-inline: 14px calc(var(--ahc-dashboard-label-width) + 14px);
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.7), rgba(2, 6, 23, 0.42)),
      rgba(15, 23, 42, 0.34);
    overflow: hidden;
  }

  .ahc-dashboard__density-bars {
    position: absolute;
    inset: 0;
    z-index: 2;
    direction: ltr;
    display: grid;
    grid-template-columns: repeat(var(--bucket-count, 24), minmax(5px, 1fr));
    align-items: end;
    gap: 3px;
    min-block-size: 0;
  }

  .ahc-dashboard-density-bucket {
    position: relative;
    display: block;
    block-size: 32px;
    min-inline-size: 0;
    border-radius: 5px;
    background: rgba(148, 163, 184, 0.055);
    overflow: hidden;
  }

  .ahc-dashboard-density-fill {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    inline-size: 100%;
    block-size: 4px;
    max-block-size: 28px;
    border-radius: 6px 6px 2px 2px;
    background: linear-gradient(180deg, #93c5fd 0%, #38bdf8 48%, #22c55e 100%);
    opacity: 0.18;
  }

  .ahc-dashboard-density-bucket[data-active="true"]
    .ahc-dashboard-density-fill {
    block-size: max(5px, calc(var(--intensity, 0) * 28px));
    opacity: max(0.44, calc(var(--intensity, 0) * 0.98));
    box-shadow: 0 0 14px rgba(56, 189, 248, 0.18);
  }

  .ahc-dashboard__density-labels {
    position: relative;
    direction: ltr;
    color: var(--ahc-axis-label-color);
    font-size: 0.68rem;
    font-weight: 700;
    line-height: 1;
  }

  .ahc-dashboard__density-labels span {
    position: absolute;
    inset-block-start: 0;
    transform: translateX(-50%);
    min-inline-size: 40px;
    text-align: center;
    white-space: nowrap;
  }

  .ahc-dashboard__density-labels span[data-edge="start"],
  .ahc-dashboard__axis-label[data-edge="start"] {
    transform: none;
    text-align: start;
  }

  .ahc-dashboard__density-labels span[data-edge="end"],
  .ahc-dashboard__axis-label[data-edge="end"] {
    transform: translateX(-100%);
    text-align: end;
  }

  .ahc-timegrid {
    direction: ltr;
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    block-size: 100%;
    min-block-size: 30px;
    overflow: hidden;
  }

  .ahc-timegrid--density {
    block-size: 32px;
    min-block-size: 32px;
  }

  .ahc-timegrid--aggregate {
    block-size: 100%;
  }

  .ahc-timegrid--row {
    block-size: var(--ahc-dashboard-row-height);
  }

  .ahc-timegrid--row::before,
  .ahc-timegrid--aggregate::before {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-start: 50%;
    transform: translateY(-50%);
    block-size: 1px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.035);
  }

  .ahc-timegrid__grid,
  .ahc-timegrid__segments {
    position: absolute;
    inset: 0;
  }

  .ahc-timegrid__grid {
    z-index: 0;
    pointer-events: none;
  }

  .ahc-timegrid__segments {
    z-index: 2;
    pointer-events: auto;
  }

  .ahc-timegrid__line {
    position: absolute;
    inset-block: 0;
    inline-size: 1px;
    transform: translateX(-0.5px);
    pointer-events: none;
  }

  .ahc-timegrid__line--major {
    background: var(--ahc-axis-grid-color);
  }

  .ahc-timegrid__line--minor {
    background: rgba(148, 163, 184, 0.055);
  }

  .ahc-timegrid__now {
    position: absolute;
    inset-block: 0;
    z-index: 3;
    inline-size: 2px;
    transform: translateX(-1px);
    border-radius: 999px;
    background: rgba(125, 211, 252, 0.9);
    box-shadow: 0 0 12px rgba(125, 211, 252, 0.3);
    pointer-events: none;
  }

  .ahc-timegrid__now--label {
    inset-block: 0;
    block-size: auto;
  }

  .ahc-timegrid__now-label {
    position: absolute;
    inset-block-start: 5px;
    transform: translateX(-50%);
    padding-block: 2px;
    padding-inline: 6px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.72);
    color: #eff6ff;
    font-size: 0.66rem;
    font-weight: 850;
    line-height: 1;
    white-space: nowrap;
  }

  .ahc-dashboard__timeline {
    min-inline-size: 0;
    min-block-size: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 0;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 16px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.74), rgba(2, 6, 23, 0.38)),
      rgba(15, 23, 42, 0.28);
  }

  .ahc-dashboard__axis {
    position: relative;
    direction: ltr;
    margin-inline-start: 0;
    margin-inline-end: calc(var(--ahc-dashboard-label-width) + 12px);
    block-size: 34px;
    min-block-size: 34px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(15, 23, 42, 0.34);
    overflow: hidden;
  }

  .ahc-dashboard__axis .ahc-timegrid__grid {
    inset-block: auto 0;
    block-size: 100%;
  }

  .ahc-dashboard__axis-labels {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .ahc-dashboard__tick,
  .ahc-dashboard__axis-label {
    position: absolute;
    inset-block-start: 10px;
    transform: translateX(-50%);
    min-inline-size: 48px;
    color: var(--ahc-axis-label-color);
    font-size: 0.75rem;
    font-weight: 800;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    text-shadow: 0 1px 6px rgba(2, 6, 23, 0.55);
  }

  .ahc-dashboard__tick::after {
    display: none;
  }

  .ahc-dashboard__scroll {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    padding-block: 10px 12px;
    padding-inline: 6px;
    overscroll-behavior: contain;
    scrollbar-color: rgba(56, 189, 248, 0.48) rgba(15, 23, 42, 0.24);
  }

  .ahc-dashboard__groups {
    display: contents;
  }

  .ahc-dashboard-group,
  .ahc-area-card {
    display: grid;
    gap: 8px;
    padding: 10px 12px 12px;
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 16px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.64), rgba(2, 6, 23, 0.3)),
      rgba(15, 23, 42, 0.28);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
    overflow: hidden;
  }

  .ahc-dashboard-group + .ahc-dashboard-group {
    margin-block-start: 10px;
  }

  .ahc-dashboard-group__header,
  .ahc-area-card__header {
    min-block-size: var(--ahc-dashboard-group-header-height);
    padding-block: 0;
    padding-inline: 0;
    background: transparent;
  }

  .ahc-dashboard-group__title,
  .ahc-area-card__title {
    min-inline-size: 0;
  }

  .ahc-area-card__title-copy {
    min-inline-size: 0;
  }

  .ahc-area-card__title-copy strong {
    font-size: 0.94rem;
  }

  .ahc-area-card__title-copy span {
    font-size: 0.74rem;
  }

  .ahc-area-card__meta {
    min-inline-size: max-content;
    font-size: 0.72rem;
  }

  .ahc-area-card__actions {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 8px;
    min-inline-size: 0;
  }

  .ahc-area-card__inventory-button,
  .ahc-area-inventory__more {
    min-block-size: 32px;
    border-radius: 8px;
  }

  .ahc-dashboard-group__aggregate,
  .ahc-area-card__aggregate {
    min-block-size: 28px;
    block-size: 28px;
    margin-inline: 0 calc(var(--ahc-dashboard-label-width) + 12px);
    border-radius: 0;
    background-color: transparent;
    overflow: hidden;
  }

  .ahc-dashboard-group__body,
  .ahc-area-card__content {
    display: grid;
    gap: 0;
    min-inline-size: 0;
  }

  .ahc-dashboard-group__rows {
    display: grid;
    gap: 0;
  }

  .ahc-dashboard-row {
    direction: rtl;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-dashboard-label-width);
    gap: 12px;
    min-block-size: var(--ahc-dashboard-row-height);
    padding-block: 0;
    padding-inline: 0;
    border-radius: 8px;
    border-block-start: 1px solid rgba(148, 163, 184, 0.07);
  }

  .ahc-dashboard-row:hover {
    background: rgba(56, 189, 248, 0.045);
  }

  .ahc-dashboard-row__plot {
    grid-column: 1;
    direction: ltr;
    position: relative;
    min-block-size: var(--ahc-dashboard-row-height);
    border-radius: 0;
    background-image: none;
    background-color: transparent;
    overflow: hidden;
  }

  .ahc-dashboard-row__plot::before {
    display: none;
  }

  .ahc-dashboard-row__label {
    grid-column: 2;
    direction: rtl;
    align-self: stretch;
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    padding-inline: 0 10px;
    min-inline-size: 0;
    border-inline-start: 1px solid rgba(148, 163, 184, 0.1);
  }

  .ahc-dashboard-row__label strong,
  .ahc-dashboard-row__label span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-dashboard-row__label strong {
    font-size: 0.82rem;
  }

  .ahc-dashboard-row__inline-meta,
  .ahc-dashboard-row__meta {
    display: none;
  }

  .ahc-dashboard-segment {
    position: absolute;
    inset-block-start: 50%;
    transform: translateY(-50%);
    block-size: var(--ahc-dashboard-segment-height);
    min-inline-size: 0;
    border: 0;
    border-radius: 999px;
    background: var(--segment-color, #38bdf8);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.24),
      0 3px 12px rgba(0, 0, 0, 0.22),
      0 0 14px
        color-mix(in srgb, var(--segment-color, #38bdf8) 38%, transparent);
    opacity: 0.96;
  }

  .ahc-dashboard-segment--row {
    block-size: var(--ahc-dashboard-segment-height);
  }

  .ahc-dashboard-segment--min {
    min-inline-size: var(--ahc-dashboard-segment-min-width);
  }

  .ahc-dashboard-segment--aggregate {
    block-size: var(--ahc-dashboard-aggregate-height);
    opacity: 0.92;
  }

  button.ahc-dashboard-segment span {
    display: none;
  }

  .ahc-dashboard-group__more {
    margin: 0;
    padding-block: 5px 8px;
    padding-inline: 14px calc(var(--ahc-dashboard-label-width) + 26px);
    color: var(--ahc-muted);
    font-size: 0.74rem;
  }

  .ahc-area-card__quiet {
    min-block-size: 42px;
    margin-inline: 0;
    border-radius: 10px;
  }

  .ahc-area-inventory {
    max-block-size: 120px;
    overflow: auto;
    margin: 2px 0 0;
    padding: 8px;
    border: 1px solid rgba(148, 163, 184, 0.09);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.62), rgba(2, 6, 23, 0.3)),
      rgba(2, 6, 23, 0.22);
  }

  .ahc-area-card[data-inventory-expanded="true"] .ahc-area-inventory {
    max-block-size: 260px;
  }

  .ahc-area-inventory__header {
    min-block-size: 22px;
    font-size: 0.76rem;
  }

  .ahc-area-inventory__groups {
    gap: 6px;
  }

  .ahc-area-inventory__domain {
    display: grid;
    gap: 5px;
    min-inline-size: 0;
  }

  .ahc-area-inventory__domain-title {
    color: rgba(226, 232, 240, 0.72);
    font-size: 0.68rem;
    font-weight: 800;
  }

  .ahc-area-inventory__chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 6px;
  }

  .ahc-inventory-chip {
    min-block-size: 36px;
    block-size: 36px;
    grid-template-columns: 28px minmax(0, 1fr);
    padding-block: 4px;
    padding-inline: 7px;
    border-radius: 10px;
  }

  .ahc-inventory-chip .ahc-dashboard-icon {
    inline-size: 24px;
    block-size: 24px;
  }

  .ahc-inventory-chip__copy {
    min-inline-size: 0;
  }

  .ahc-inventory-chip__copy strong {
    font-size: 0.76rem;
  }

  .ahc-inventory-chip__copy small {
    font-size: 0.68rem;
  }

  .ahc-dashboard__notice {
    position: absolute;
    inset-inline: 18px;
    inset-block-end: 10px;
    margin: 0;
    padding-block: 6px;
    padding-inline: 10px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 10px;
    background: rgba(2, 6, 23, 0.72);
    color: rgba(226, 232, 240, 0.78);
    font-size: 0.72rem;
    text-align: center;
  }

  @media (max-width: 1100px) {
    .ahc__insights-panel {
      display: none;
    }
  }

  @media (max-width: 760px) {
    :host {
      --ahc-dashboard-label-width: 156px;
      --ahc-dashboard-row-height: 36px;
    }

    .ahc,
    .ahc--panel,
    .ahc--fullscreen {
      grid-template-rows: auto auto auto minmax(0, 1fr);
      block-size: auto;
      min-block-size: 100svh;
    }

    .ahc__hero {
      max-block-size: none;
    }

    .ahc__hero.ahc__topbar {
      align-items: stretch;
      gap: 10px;
    }

    .ahc__hero-actions {
      justify-content: center;
      flex-wrap: nowrap;
      overflow-x: auto;
    }

    .ahc__toolbar.ahc__filters {
      max-block-size: none;
      min-block-size: 0;
      padding: 0;
      border: 0;
      background: transparent;
    }

    .ahc__toolbar .ahc__search {
      inline-size: min(86vw, 420px);
    }

    .ahc__summary-strip {
      display: flex;
      max-block-size: none;
    }

    .ahc__body {
      min-block-size: 0;
    }

    .ahc__main {
      overflow: visible;
    }

    .ahc-dashboard {
      min-block-size: 560px;
      max-block-size: none;
      block-size: auto;
      gap: 10px;
      padding: 10px;
      border-radius: 16px;
    }

    .ahc-dashboard__density {
      grid-template-rows: 32px;
      block-size: 42px;
      min-block-size: 42px;
      padding-inline: 10px calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard__density-labels {
      display: none;
    }

    .ahc-dashboard__axis {
      margin-inline-end: calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard__axis-label {
      min-inline-size: 40px;
      font-size: 0.66rem;
    }

    .ahc-dashboard__scroll {
      max-block-size: min(66svh, 720px);
      padding-inline: 4px;
    }

    .ahc-dashboard-row {
      grid-template-columns: minmax(360px, 1fr) var(--ahc-dashboard-label-width);
      min-inline-size: calc(360px + var(--ahc-dashboard-label-width) + 32px);
      padding-inline: 10px;
    }

    .ahc-dashboard-group__aggregate,
    .ahc-area-card__aggregate {
      min-inline-size: 360px;
      margin-inline: 10px calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard-row__label span {
      display: block;
    }

    .ahc-area-inventory {
      max-block-size: 150px;
      margin-inline: 0;
    }

    .ahc-area-card[data-inventory-expanded="true"] .ahc-area-inventory {
      max-block-size: 260px;
    }

    .ahc-area-inventory__chips {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .ahc-inventory-chip {
      flex: 0 0 min(72vw, 230px);
    }
  }

  @media (max-width: 420px) {
    :host {
      --ahc-dashboard-label-width: 142px;
    }

    .ahc-dashboard-row {
      grid-template-columns: minmax(320px, 1fr) var(--ahc-dashboard-label-width);
      min-inline-size: calc(320px + var(--ahc-dashboard-label-width) + 28px);
    }

    .ahc-dashboard-row__label span {
      display: block;
    }
  }

  /* Motion & contrast */
  @media (prefers-reduced-motion: reduce) {
    .ahc *,
    .ahc *::before,
    .ahc *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (forced-colors: active) {
    .ahc,
    .ahc__metric,
    .ahc__filters,
    .ahc-timeline-card,
    .ahc__insights,
    .ahc-filter-sheet,
    .ahc-popover {
      border: 1px solid CanvasText;
      background: Canvas;
      color: CanvasText;
    }

    .ahc__button,
    .ahc__chip,
    .ahc__segmented-button {
      border: 1px solid ButtonText;
      background: ButtonFace;
      color: ButtonText;
    }

    .ahc-segment {
      border: 2px solid CanvasText;
    }
  }

  /* Optional compact mode for many entities */
  .ahc--dense .ahc-row {
    min-block-size: 30px;
  }

  .ahc--dense .ahc-row__track {
    min-block-size: 30px;
  }

  .ahc--dense .ahc-segment {
    block-size: 8px;
  }

  .ahc--dense .ahc-row__state-chip {
    display: none;
  }

  .ahc--dense .ahc-row__name {
    font-size: 0.78rem;
  }

  .ahc--ultra-dense .ahc-row,
  .ahc-timeline-card--ultra-dense .ahc-row {
    min-block-size: 24px;
  }

  .ahc--ultra-dense .ahc-row__track,
  .ahc-timeline-card--ultra-dense .ahc-row__track {
    min-block-size: 24px;
  }

  .ahc--ultra-dense .ahc-row__state-chip,
  .ahc-timeline-card--ultra-dense .ahc-row__state-chip {
    display: none;
  }

  .ahc--ultra-dense .ahc-row__name,
  .ahc-timeline-card--ultra-dense .ahc-row__name {
    font-size: 0.74rem;
  }
`;
