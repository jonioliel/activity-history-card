export type Mockup05SegmentTone =
  | "on"
  | "cooling"
  | "heating"
  | "playing"
  | "open"
  | "fan";

export type Mockup05StateTone = Mockup05SegmentTone | "idle" | "unavailable";

export interface Mockup05AxisLabel {
  label: string;
  percent: number;
}

export interface Mockup05Hero {
  title: string;
  subtitle: string;
  icon: string;
  status?: string;
}

export interface Mockup05Toolbar {
  timePresets: Array<{ id: string; label: string; active?: boolean }>;
  groupBy: Array<{ id: string; label: string; active?: boolean }>;
  searchPlaceholder: string;
  filtersLabel: string;
}

export interface Mockup05SummaryCard {
  id: string;
  label: string;
  value: string;
  caption: string;
  icon: string;
  tone?: Mockup05StateTone;
}

export interface Mockup05DensityBucket {
  id: string;
  label: string;
  value: string;
  intensity: number;
  active: boolean;
}

export interface Mockup05Segment {
  leftPct: number;
  widthPct: number;
  tone: Mockup05SegmentTone;
  label: string;
  minVisible?: boolean;
  sourceIndex?: number;
}

export interface Mockup05Row {
  id: string;
  entityId?: string;
  label: string;
  secondary?: string;
  state: string;
  stateTone?: Mockup05StateTone;
  icon: string;
  totalLabel?: string;
  eventLabel?: string;
  segments: Mockup05Segment[];
}

export interface Mockup05InventoryItem {
  id: string;
  entityId?: string;
  label: string;
  secondary?: string;
  state: string;
  stateTone?: Mockup05StateTone;
  icon: string;
  activeNow?: boolean;
  hadActivity?: boolean;
}

export interface Mockup05Group {
  id: string;
  title: string;
  icon: string;
  meta: string;
  activityLabel: string;
  inventoryLabel: string;
  aggregateSegments: Mockup05Segment[];
  rows: Mockup05Row[];
  inventoryItems: Mockup05InventoryItem[];
  inventoryTotal: number;
  hiddenInventoryCount?: number;
  expandedInventory?: boolean;
}

export interface Mockup05Insight {
  id: string;
  title: string;
  value: string;
  caption: string;
  icon?: string;
}

export interface Mockup05Model {
  hero: Mockup05Hero;
  toolbar: Mockup05Toolbar;
  summary: Mockup05SummaryCard[];
  rangeLabel: string;
  axisLabels: Mockup05AxisLabel[];
  density: Mockup05DensityBucket[];
  groups: Mockup05Group[];
  insights: Mockup05Insight[];
}

const axisLabels: Mockup05AxisLabel[] = [
  { label: "18:00", percent: 0 },
  { label: "22:00", percent: 20 },
  { label: "02:00", percent: 40 },
  { label: "06:00", percent: 60 },
  { label: "10:00", percent: 80 },
  { label: "14:00", percent: 100 },
];

const densityPattern = [
  0.12, 0.22, 0.18, 0.28, 0.2, 0.16, 0.34, 0.46, 0.62, 0.72, 0.58, 0.4, 0.24,
  0.18, 0.26, 0.38, 0.66, 0.82, 0.74, 0.52, 0.3, 0.2, 0.16, 0.12,
];

const density: Mockup05DensityBucket[] = densityPattern.map(
  (intensity, index) => ({
    id: `density-${index}`,
    label: `${String(index).padStart(2, "0")}:00`,
    value: `${Math.round(intensity * 12)} אירועים`,
    intensity,
    active: intensity > 0.22,
  }),
);

export const mockup05VisualModel: Mockup05Model = {
  hero: {
    title: "היסטוריית פעילות חכמה",
    subtitle: "Home Assistant · שעות אחרונות · תצוגת מוקאפ 05",
    icon: "mdi:chart-timeline-variant-shimmer",
    status: "מוכן לתצוגה",
  },
  toolbar: {
    timePresets: [
      { id: "24h", label: "24 שעות", active: true },
      { id: "7d", label: "7 ימים" },
      { id: "custom", label: "מותאם" },
    ],
    groupBy: [
      { id: "area", label: "אזור", active: true },
      { id: "domain", label: "סוג" },
      { id: "none", label: "ללא" },
    ],
    searchPlaceholder: "חיפוש רכיב או אזור...",
    filtersLabel: "סינון",
  },
  summary: [
    {
      id: "active-now",
      label: "פעילים עכשיו",
      value: "18",
      caption: "רכיבים במצב פעיל",
      icon: "mdi:circle-medium",
      tone: "on",
    },
    {
      id: "active-components",
      label: "רכיבים שפעלו",
      value: "42",
      caption: "מתוך 57 אביזרים במלאי",
      icon: "mdi:toggle-switch-outline",
      tone: "cooling",
    },
    {
      id: "events",
      label: "אירועים",
      value: "169",
      caption: "שינויי מצב פעילים",
      icon: "mdi:timeline-clock-outline",
      tone: "playing",
    },
    {
      id: "component-hours",
      label: "סה״כ שעות־רכיב",
      value: "42:18",
      caption: "סכום פעילות על פני כל הרכיבים",
      icon: "mdi:clock-outline",
      tone: "heating",
    },
    {
      id: "last-event",
      label: "אירוע אחרון",
      value: "מזגן סלון",
      caption: "קירור · סלון · לפני 3 דק׳",
      icon: "mdi:snowflake",
      tone: "cooling",
    },
  ],
  rangeLabel: "18:00 - 14:00 · 24 שעות",
  axisLabels,
  density,
  groups: [
    {
      id: "living",
      title: "סלון",
      icon: "mdi:sofa-outline",
      meta: "7 רכיבים · 12:35 שעות",
      activityLabel: "פעילות רציפה",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 6, widthPct: 12, tone: "on", label: "תאורת סלון" },
        { leftPct: 22, widthPct: 18, tone: "cooling", label: "מזגן" },
        { leftPct: 58, widthPct: 9, tone: "playing", label: "מוזיקה" },
        { leftPct: 78, widthPct: 14, tone: "on", label: "סצנת ערב" },
      ],
      rows: [
        {
          id: "living-ac",
          entityId: "climate.living_room",
          label: "מזגן סלון",
          secondary: "אקלים · סלון",
          state: "קירור",
          stateTone: "cooling",
          icon: "mdi:snowflake",
          totalLabel: "4:18",
          eventLabel: "9 אירועים",
          segments: [
            { leftPct: 20, widthPct: 14, tone: "cooling", label: "קירור ערב" },
            { leftPct: 50, widthPct: 8, tone: "cooling", label: "קירור קצר" },
            { leftPct: 78, widthPct: 15, tone: "cooling", label: "קירור בוקר" },
          ],
        },
        {
          id: "living-main-light",
          entityId: "light.living_room_main",
          label: "תאורת סלון ראשית",
          secondary: "תאורה · סלון",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:ceiling-light",
          totalLabel: "3:04",
          eventLabel: "14 אירועים",
          segments: [
            { leftPct: 5, widthPct: 10, tone: "on", label: "אור ערב" },
            { leftPct: 63, widthPct: 4, tone: "on", label: "בדיקה" },
            { leftPct: 82, widthPct: 12, tone: "on", label: "אור בוקר" },
          ],
        },
        {
          id: "living-media",
          entityId: "media_player.living_room",
          label: "רמקול סלון",
          secondary: "מדיה · סלון",
          state: "מנגן",
          stateTone: "playing",
          icon: "mdi:speaker-wireless",
          totalLabel: "1:26",
          eventLabel: "5 אירועים",
          segments: [
            { leftPct: 56, widthPct: 7, tone: "playing", label: "מוזיקה" },
            { leftPct: 74, widthPct: 6, tone: "playing", label: "רדיו" },
          ],
        },
      ],
      inventoryItems: [
        {
          id: "living-ac-chip",
          entityId: "climate.living_room",
          label: "מזגן סלון",
          secondary: "אקלים",
          state: "קירור",
          stateTone: "cooling",
          icon: "mdi:snowflake",
          activeNow: true,
          hadActivity: true,
        },
        {
          id: "living-light-chip",
          entityId: "light.living_room_main",
          label: "תאורה ראשית",
          secondary: "תאורה",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:ceiling-light",
          activeNow: true,
          hadActivity: true,
        },
        {
          id: "living-media-chip",
          entityId: "media_player.living_room",
          label: "רמקול סלון",
          secondary: "מדיה",
          state: "מנגן",
          stateTone: "playing",
          icon: "mdi:speaker",
          activeNow: true,
          hadActivity: true,
        },
        {
          id: "living-cover-chip",
          entityId: "cover.living_room",
          label: "תריס סלון",
          secondary: "כיסוי",
          state: "סגור",
          stateTone: "idle",
          icon: "mdi:window-shutter",
          hadActivity: true,
        },
      ],
      inventoryTotal: 7,
      hiddenInventoryCount: 3,
    },
    {
      id: "kitchen",
      title: "מטבח",
      icon: "mdi:silverware-fork-knife",
      meta: "6 רכיבים · 8:10 שעות",
      activityLabel: "פעילות בוקר",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 4, widthPct: 6, tone: "on", label: "קפה" },
        { leftPct: 67, widthPct: 12, tone: "on", label: "בישול" },
        { leftPct: 82, widthPct: 9, tone: "fan", label: "קולט אדים" },
      ],
      rows: [
        {
          id: "kitchen-strip",
          entityId: "light.kitchen_strip",
          label: "פס לד מטבח",
          secondary: "תאורה · מטבח",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:led-strip-variant",
          totalLabel: "2:12",
          eventLabel: "11 אירועים",
          segments: [
            { leftPct: 3, widthPct: 8, tone: "on", label: "קפה" },
            { leftPct: 70, widthPct: 15, tone: "on", label: "בישול" },
          ],
        },
        {
          id: "kitchen-fan",
          entityId: "fan.kitchen_hood",
          label: "קולט אדים",
          secondary: "מאוורר · מטבח",
          state: "פועל",
          stateTone: "fan",
          icon: "mdi:fan",
          totalLabel: "0:58",
          eventLabel: "4 אירועים",
          segments: [
            { leftPct: 79, widthPct: 10, tone: "fan", label: "אוורור" },
          ],
        },
      ],
      inventoryItems: [
        {
          id: "kitchen-strip-chip",
          entityId: "light.kitchen_strip",
          label: "פס לד",
          secondary: "תאורה",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:led-strip-variant",
          activeNow: true,
          hadActivity: true,
        },
        {
          id: "kitchen-fan-chip",
          entityId: "fan.kitchen_hood",
          label: "קולט אדים",
          secondary: "מאוורר",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:fan",
          hadActivity: true,
        },
        {
          id: "kitchen-switch-chip",
          entityId: "switch.kitchen_counter",
          label: "שקע שיש",
          secondary: "מתג",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:power-socket-eu",
        },
      ],
      inventoryTotal: 6,
      hiddenInventoryCount: 3,
    },
    {
      id: "kids",
      title: "חדרי ילדים",
      icon: "mdi:teddy-bear",
      meta: "5 רכיבים · 6:48 שעות",
      activityLabel: "פעילות ערב",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 12, widthPct: 11, tone: "on", label: "לילה" },
        { leftPct: 61, widthPct: 13, tone: "heating", label: "חימום" },
      ],
      rows: [
        {
          id: "kids-night",
          entityId: "light.kids_night",
          label: "מנורת לילה",
          secondary: "תאורה · חדר ילדים",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:lamp",
          totalLabel: "5:22",
          eventLabel: "7 אירועים",
          segments: [
            { leftPct: 11, widthPct: 13, tone: "on", label: "שנת לילה" },
            { leftPct: 88, widthPct: 4, tone: "on", label: "התעוררות" },
          ],
        },
        {
          id: "kids-heater",
          entityId: "climate.kids_room",
          label: "חימום חדר ילדים",
          secondary: "אקלים · חדר ילדים",
          state: "חימום",
          stateTone: "heating",
          icon: "mdi:radiator",
          totalLabel: "1:26",
          eventLabel: "3 אירועים",
          segments: [
            { leftPct: 60, widthPct: 15, tone: "heating", label: "חימום" },
          ],
        },
      ],
      inventoryItems: [
        {
          id: "kids-night-chip",
          entityId: "light.kids_night",
          label: "מנורת לילה",
          secondary: "תאורה",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:lamp",
          activeNow: true,
          hadActivity: true,
        },
        {
          id: "kids-heater-chip",
          entityId: "climate.kids_room",
          label: "חימום",
          secondary: "אקלים",
          state: "חימום",
          stateTone: "heating",
          icon: "mdi:radiator",
          hadActivity: true,
        },
      ],
      inventoryTotal: 5,
      hiddenInventoryCount: 3,
    },
    {
      id: "balcony",
      title: "מרפסת",
      icon: "mdi:flower-outline",
      meta: "4 רכיבים · 4:45 שעות",
      activityLabel: "פתיחות ותאורה",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 18, widthPct: 8, tone: "open", label: "תריס נפתח" },
        { leftPct: 72, widthPct: 7, tone: "on", label: "תאורה" },
      ],
      rows: [
        {
          id: "balcony-cover",
          entityId: "cover.balcony",
          label: "תריס מרפסת",
          secondary: "כיסוי · מרפסת",
          state: "נפתח",
          stateTone: "open",
          icon: "mdi:window-shutter-open",
          totalLabel: "0:18",
          eventLabel: "5 אירועים",
          segments: [
            { leftPct: 18, widthPct: 3, tone: "open", label: "פתיחה" },
            { leftPct: 24, widthPct: 2, tone: "open", label: "סגירה" },
          ],
        },
        {
          id: "balcony-light",
          entityId: "light.balcony",
          label: "תאורת מרפסת",
          secondary: "תאורה · מרפסת",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:outdoor-lamp",
          totalLabel: "1:05",
          eventLabel: "2 אירועים",
          segments: [
            { leftPct: 71, widthPct: 8, tone: "on", label: "תאורת ערב" },
          ],
        },
      ],
      inventoryItems: [
        {
          id: "balcony-cover-chip",
          entityId: "cover.balcony",
          label: "תריס מרפסת",
          secondary: "כיסוי",
          state: "סגור",
          stateTone: "idle",
          icon: "mdi:window-shutter",
          hadActivity: true,
        },
        {
          id: "balcony-light-chip",
          entityId: "light.balcony",
          label: "תאורת מרפסת",
          secondary: "תאורה",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:outdoor-lamp",
          hadActivity: true,
        },
      ],
      inventoryTotal: 4,
      hiddenInventoryCount: 2,
    },
  ],
  insights: [
    {
      id: "most-active-entity",
      title: "הרכיב הפעיל ביותר",
      value: "מנורת לילה",
      caption: "חדרי ילדים · 5:22 שעות",
      icon: "mdi:star-four-points",
    },
    {
      id: "most-active-area",
      title: "האזור הפעיל ביותר",
      value: "סלון",
      caption: "7 רכיבים · 12:35 שעות",
      icon: "mdi:home-lightning-bolt-outline",
    },
    {
      id: "peak-hours",
      title: "שעות שיא",
      value: "07:00 - 09:00",
      caption: "צפיפות פעילות גבוהה",
      icon: "mdi:chart-bar",
    },
    {
      id: "short-pattern",
      title: "דפוס שימוש קצר",
      value: "ערב ובוקר",
      caption: "רוב הפעילות סביב תאורה ואקלים",
      icon: "mdi:lightning-bolt-outline",
    },
  ],
};
