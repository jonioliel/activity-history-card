# Activity History Card

כרטיס Lovelace ל-Home Assistant שמציג היסטוריית פעילות כציר זמן מסוג swimlane, עם תמיכה מלאה בעברית, RTL, מובייל, אזורים, סינון לפי סוג רכיב ו-labels.

```yaml
type: custom:activity-history-card
```

הכרטיס מיועד להתחיל מנתוני Home Assistant אמיתיים: הוא יכול לגלות אוטומטית רכיבים שמשויכים לאזורים, למשוך את ההיסטוריה מה-Recorder, ולהציג פעילות לפי אזור או סוג רכיב. נתוני דוגמה מוצגים רק כאשר מגדירים במפורש `mock_data: true`.

## התקנה דרך HACS

1. פתח את HACS.
2. עבור אל Custom repositories.
3. הוסף את הרפו:

```text
https://github.com/jonioliel/activity-history-card
```

4. בחר Category: `Dashboard`.
5. התקן את הכרטיס.
6. אם Home Assistant לא הוסיף resource אוטומטית, הוסף ידנית:

```text
/hacsfiles/activity-history-card/activity-history-card.js
```

Type: `JavaScript Module`

## שימוש בסיסי עם נתוני אמת

```yaml
type: custom:activity-history-card
title: היסטוריית פעילות חכמה
mock_data: false
auto_discover: true
display_mode: panel
hours_to_show: 24
refresh_interval_seconds: 300
group_by: area
max_visible_rows: 48
timeline_height: min(62svh, 680px)
collapse_groups: false
exclude_labels:
  - לא להצגה
  - רכיבים מוגנים
```

במצב הזה הכרטיס מנסה למצוא אוטומטית רכיבים שמוגדרים באזורים של Home Assistant. אם אין אזורים, או שה-Registry לא זמין לגרסת Home Assistant שלך, הכרטיס יציג הודעה ברורה ויציע YAML חלופי.

## YAML מומלץ לייצור

```yaml
type: custom:activity-history-card
title: היסטוריית פעילות חכמה
mock_data: false
auto_discover: true
live: true
refresh_interval_seconds: 300
display_mode: panel
hours_to_show: 24
group_by: area
max_visible_rows: 48
timeline_height: min(62svh, 680px)
exclude_labels:
  - לא להצגה
  - רכיבים מוגנים
```

## YAML מומלץ לדיבאג

```yaml
type: custom:activity-history-card
mock_data: false
auto_discover: true
debug: true
hours_to_show: 24
refresh_interval_seconds: 300
```

## סינון לפי אזורים ודומיינים

```yaml
type: custom:activity-history-card
mock_data: false
auto_discover: true
areas:
  - סלון
  - מטבח
domains:
  - light
  - switch
  - climate
  - media_player
  - cover
  - fan
```

אם לא מגדירים `domains`, הכרטיס משתמש בדומיינים שימושיים כברירת מחדל כדי להימנע מרעש של חיישנים כלליים.
ברירת המחדל השמרנית כוללת רק: `light`, `switch`, `climate`, `media_player`, `cover`, `fan`.

אפשר גם להשתמש ב-globs:

```yaml
type: custom:activity-history-card
auto_discover: true
include_entity_globs:
  - light.*
  - switch.kitchen_*
exclude_entity_globs:
  - switch.router*
exclude_domains:
  - sensor
```

## רשימת entities ידנית

```yaml
type: custom:activity-history-card
mock_data: false
auto_discover: false
entities:
  - entity: light.living_room_main
    name: תאורת סלון
    area: סלון
    active_states: ["on"]
  - entity: climate.living_room_ac
    name: מזגן סלון
    area: סלון
    active_states: ["cool", "heat", "dry", "fan_only"]
    active_attributes:
      hvac_action: ["cooling", "heating", "drying", "fan"]
```

כאשר `auto_discover: false`, חייבים להגדיר `entities`. אחרת הכרטיס יציג מצב ריק של "לא נבחרו רכיבים".

## Labels

אפשר להסתיר או להציג רכיבים לפי labels של Home Assistant:

```yaml
type: custom:activity-history-card
auto_discover: true
exclude_labels:
  - לא להצגה
  - רכיבים מוגנים
include_labels:
  - להצגה בלוח ראשי
```

הסתרה באמצעות `exclude_labels` גוברת על הצגה באמצעות `include_labels`. אפשר להשתמש בשם ה-label או ב-ID שלו.

## מצב debug

אם הכרטיס לא מציג נתונים, הפעל אבחון:

```yaml
type: custom:activity-history-card
mock_data: false
auto_discover: true
debug: true
refresh_interval_seconds: 300
```

כאשר `debug: true`, הכרטיס מציג פאנל קטן עם:

- מספר רכיבים שנמצאו
- מספר רשומות היסטוריה שחזרו מה-Recorder
- מספר מקטעי timeline
- המסננים הפעילים
- טווח בקשת ההיסטוריה
- האם נדרשו attributes
- זמינות area/entity/device/label registries
- סיבת הרענון האחרונה
- משך fetch אחרון
- cache hit/miss
- refresh interval פעיל

כאשר `debug: false`, הכרטיס לא אמור להציף את ה-console.

## מצב נתוני דוגמה

לבדיקה מהירה בלי Home Assistant Recorder:

```yaml
type: custom:activity-history-card
mock_data: true
display_mode: panel
```

אם אתה רואה אזורי דוגמה כמו סלון, מטבח או חדרי ילדים שלא קשורים לבית שלך, בדוק שהכרטיס לא מוגדר עם `mock_data: true`.

## אפשרויות עיקריות

| Option | Default | Description |
| --- | --- | --- |
| `mock_data` | `false` | מציג נתוני דוגמה רק כאשר מוגדר `true` במפורש |
| `auto_discover` | `true` | מגלה רכיבים שמשויכים לאזורים |
| `areas` | all | רשימת אזורים להצגה |
| `domains` | useful activity domains | סוגי רכיבים להצגה |
| `include_labels` | none | מציג רק רכיבים עם labels אלה |
| `exclude_labels` | none | מסתיר רכיבים עם labels אלה |
| `hours_to_show` | `24` | טווח זמן להצגה |
| `refresh_interval_seconds` | `300` | תדירות רענון רקע כאשר `live: true` |
| `max_visible_rows` | `48` | מגביל את מספר השורות הגלויות כדי לשמור על ביצועים וקריאות |
| `timeline_height` | `min(62svh, 680px)` | גובה פנימי של אזור הטיימליין לפני גלילה |
| `collapse_groups` | `false` | מאפשר קיפול קבוצות; קבוצות ללא פעילות יכולות להתחיל סגורות |
| `default_collapsed_groups` | `[]` | רשימת שמות/IDs של קבוצות שייפתחו סגורות |
| `group_by` | `area` | `area`, `domain`, `entity`, `none` |
| `display_mode` | `panel` | `card`, `panel`, `fullscreen` |
| `debug` | `false` | מציג דיאגנוסטיקה בכרטיס |

ראו דוגמה מלאה ב-[sample-config.yaml](sample-config.yaml).

## פיתוח מקומי

```bash
npm install
npm run typecheck
npm run test
npm run build
```

הקובץ ש-HACS מתקין הוא:

```text
dist/activity-history-card.js
```

הקובץ הזה נשמר במכוון בתוך הרפו, ולכן אחרי כל שינוי בקוד יש להריץ build ולעדכן אותו.

## המשך עבודה עם ChatGPT / Codex

הקובץ [docs/CHATGPT_CONTINUATION.md](docs/CHATGPT_CONTINUATION.md) נשמר כהערות פנימיות להמשך פיתוח. הוא לא מחליף את ה-README למשתמשים.

לפני המשך פיתוח מומלץ לקרוא:

- `AGENTS.md`
- `CODEX_PROMPT.md`
- `docs/CHATGPT_CONTINUATION.md`

## מגבלות MVP

- מצב swimlane הוא המצב הפעיל של ה-MVP.
- Heatmap, drill-down ו-correlation נשארים placeholders בלבד בשלב הזה.
- Timeline נשאר כרונולוגי משמאל לימין, בזמן שכל הטקסטים והפקדים מותאמים ל-RTL.
- היסטוריה תלויה ב-Home Assistant Recorder ובזמינות הרשומות עבור הישויות שבחרת.
