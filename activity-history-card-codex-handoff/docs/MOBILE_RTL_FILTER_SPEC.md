# Mobile, RTL, and Filtering Spec

## Mobile design goal

The card must be comfortable inside the Home Assistant mobile app, not merely squeezed from desktop.

The mobile design follows these references:

- `mockups/06-mobile-overview-rtl.png`
- `mockups/07-mobile-advanced-filter-sheet-rtl.png`
- `mockups/08-mobile-entity-detail-rtl.png`

## Breakpoints

Recommended:

```css
@media (max-width: 760px) { ... }
@media (max-width: 420px) { ... }
```

Also use container width detection with `ResizeObserver` when possible, because Home Assistant dashboard columns can make the card narrow even on desktop.

## Mobile layout

### Header

- Title centered or aligned start based on card width.
- Back/fullscreen/filter buttons in touch-friendly 44px controls.
- Subtitle compact: “עודכן לפני דקה”.

### Filter chips

- Chips become horizontal scroll rows.
- No cramped multi-line desktop toolbar.
- Important chips first: time range, area, type.

### Summary

- Use 2 columns.
- Show only most important metrics by default:
  - זמן פעילות
  - מספר אירועים
- Optional expand for more metrics.

### Timeline groups

- Area groups are stacked rounded cards.
- Each group has a collapsible header.
- Entity labels remain readable.
- Timeline area can scroll horizontally.
- Now marker remains visible inside scroll content.

### Bottom sheet filter

On mobile, advanced filters open as a bottom sheet:

- Title: `סינון מתקדם`
- Close button.
- Drag handle.
- Sections:
  - טווח זמן
  - אזורים
  - סוגי רכיבים
  - מצבים
  - קבוצות
  - חיפוש רכיב
- Footer buttons:
  - `נקה סינון`
  - `החל סינון`

Use `role="dialog"`, `aria-modal="true"`, and focus management.

## RTL implementation checklist

- Root has `dir="rtl"` when Hebrew/RTL.
- CSS logical properties instead of left/right.
- Text uses `text-align: start/end`.
- Chips flow right-to-left.
- Dialog and popover align correctly.
- Search icon is on the correct side.
- Legend labels are RTL.
- Time axis and bar x-coordinate math stay LTR.
- Do not reverse start/end times in tooltips.

## Filtering behavior

### Time filters

- `24 שעות`
- `7 ימים`
- `טווח מותאם`

Changing time range triggers history refetch.

### Area filters

- `הכל`
- user areas from config/entity metadata
- multi-select in advanced sheet

Changing area does not require refetch if all entities were already fetched.

### Domain/type filters

- `מתגים`
- `מזגנים`
- `תאורה`
- `מוזיקה`
- `תריסים`
- `מאווררים`

Changing domain does not require refetch if all entities were already fetched. If auto-discovery is used, it may require fetching new entities.

### State filters

- `כל המצבים`
- `רק פעילים`
- `רק פעילים כרגע`

State filters are local transforms.

### Search

Search should match:

- entity ID
- friendly name
- configured name
- area
- domain label

Use simple lowercase matching for MVP.

## Accessibility for filters

- Chips are buttons.
- Selected chip uses `aria-pressed="true"`.
- Collapsible group uses `aria-expanded`.
- Bottom sheet traps focus while open.
- Escape closes sheet.
- Applying filters announces result count in an `aria-live` region.

## Touch interactions

- Segment tap opens popover.
- Tap outside closes popover.
- Long timeline rows should be horizontally scrollable.
- Avoid requiring precise hover.
- Minimum touch target: 44px.
