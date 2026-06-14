# Activity History Card

כרטיס Lovelace ל-Home Assistant שמציג היסטוריית פעילות כ-dashboard נקי: פס צפיפות פעילות, כרטיסי אזורים, שורות פעילות משמעותיות בלבד, תמיכה מלאה בעברית, RTL, מובייל, אזורים, סינון לפי סוג רכיב ו-labels.

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
view_mode: activity
mock_data: false
auto_discover: true
display_mode: panel
hours_to_show: 24
refresh_interval_seconds: 300
group_by: area
smart_filter: true
activity_mode: meaningful
hide_empty_rows: true
show_inactive_baselines: false
min_row_active_seconds: 10
max_rows_per_group: 4
max_total_rows: 18
max_visible_rows: 18
show_activity_density: true
show_area_inventory: true
area_inventory_mode: compact
area_inventory_include_inactive: true
area_inventory_max_items: 12
area_inventory_group_by_domain: true
area_inventory_show_state: true
area_inventory_show_last_activity: true
timeline_height: calc(100svh - 320px)
timeline_axis_density: comfortable
debug_timeline_geometry: false
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
view_mode: activity
mock_data: false
auto_discover: true
display_mode: panel
live: false
refresh_interval_seconds: 300
hours_to_show: 24
group_by: area
smart_filter: true
activity_mode: meaningful
hide_empty_rows: true
hide_empty_groups: true
show_inactive_baselines: false
min_row_active_seconds: 10
max_rows_per_group: 4
max_total_rows: 18
show_technical_entities: false
show_config_entities: false
show_diagnostic_entities: false
summary_scope: visible
max_visible_rows: 18
show_activity_density: true
show_summary: true
show_insights: true
show_area_inventory: true
area_inventory_mode: compact
area_inventory_include_inactive: true
area_inventory_max_items: 12
area_inventory_group_by_domain: true
area_inventory_show_state: true
area_inventory_show_last_activity: true
debug: false
timeline_height: calc(100svh - 320px)
timeline_axis_density: comfortable
debug_timeline_geometry: false
filters:
  show: true
  show_search: true
  show_area_chips: false
  show_domain_chips: false
  show_state_mode: false
domains:
  - light
  - switch
  - climate
  - media_player
  - cover
  - fan
exclude_labels:
  - לא להצגה
  - רכיבים מוגנים
```

## YAML מומלץ לדיבאג

```yaml
type: custom:activity-history-card
title: היסטוריית פעילות - legacy/debug
view_mode: legacy_swimlane
mock_data: false
auto_discover: true
debug: true
hours_to_show: 24
refresh_interval_seconds: 300
smart_filter: false
activity_mode: all
hide_empty_rows: false
hide_empty_groups: false
show_inactive_baselines: true
show_technical_entities: true
show_config_entities: true
show_diagnostic_entities: true
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

כאשר בוחרים אזור יחיד, מלאי האביזרים של אותו אזור נפתח כברירת מחדל:

```yaml
type: custom:activity-history-card
mock_data: false
auto_discover: true
display_mode: panel
view_mode: activity
areas:
  - סלון
show_area_inventory: true
area_inventory_mode: compact
area_inventory_include_inactive: true
area_inventory_max_items: 12
timeline_height: calc(100svh - 320px)
timeline_axis_density: comfortable
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

## מלאי אביזרים לפי אזור

בתצוגת `activity` ציר הזמן נשאר נקי ומציג רק שורות עם פעילות משמעותית. בתצוגת כל הבית מלאי האביזרים מקופל כברירת מחדל ונפתח מכפתור האזור; בבחירת אזור יחיד הוא נפתח אוטומטית. כך אפשר לראות שמות של מפסקים, תאורות ומזגנים בלי להעמיס את הגרף.

```yaml
type: custom:activity-history-card
view_mode: activity
show_area_inventory: true
area_inventory_mode: compact # compact | expanded | off
area_inventory_include_inactive: true
area_inventory_max_items: 12
area_inventory_group_by_domain: true
area_inventory_show_state: true
area_inventory_show_last_activity: true
```

לחיצה על אביזר במלאי פותחת את חלון `more-info` של Home Assistant. הכפתור “כל האביזרים” בתוך הכרטיס מרחיב את מלאי האזורים ואינו עובר לתצוגת legacy גולמית. אם צריך לבדוק שורות raw, השתמש ב-`view_mode: legacy_swimlane`.

## סינון חכם

כברירת מחדל הכרטיס מציג תצוגה שימושית ולא רשימת registry מלאה. `activity_mode: meaningful` יחד עם `smart_filter: true` מציגים רק מקטעי פעילות אמיתיים, מסתירים שורות ללא פעילות, פעילות קצרה מאוד, ישויות `config`/`diagnostic`, ורעש טכני נפוץ כמו נתבים, חיבורי LAN/WLAN, firmware, update, battery, signal, program, remote start, child lock, half load ו-extra dry.

אם רכיב הוגדר ידנית תחת `entities`, הוא לא יוסתר אוטומטית על ידי הסינון החכם. כדי לבדוק מה הוסתר, הפעל `debug: true` או עבור זמנית ל-`view_mode: legacy_swimlane`.

```yaml
type: custom:activity-history-card
auto_discover: true
smart_filter: true
activity_mode: meaningful
show_inactive_baselines: false
min_row_active_seconds: 10
max_rows_per_group: 4
max_total_rows: 18
show_technical_entities: false
show_config_entities: false
show_diagnostic_entities: false
```

## מצבי תצוגה

`view_mode: activity` הוא מצב ברירת המחדל והמומלץ. הוא לא מציג טבלת registry גולמית, אלא dashboard נקי שמראה איפה ומתי הייתה פעילות משמעותית: פס צפיפות פעילות עליון, ציר זמן נקי משמאל לימין, כרטיסי אזורים עם שורות פעילות, ומלאי אביזרים קומפקטי לכל אזור.

`view_mode: activity_legacy` שומר את רנדרר ה-activity הקודם לצורך השוואה זמנית.

`view_mode: legacy_swimlane` שומר את רנדרר ה-swimlane הישן. הוא שימושי לדיבוג ולבדיקת רכיבים שהוסתרו מהתצוגה החכמה.

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
- מספר שורות לפני/אחרי סינון חכם וסיבות הסתרה

כאשר `debug: false`, הכרטיס לא אמור להציף את ה-console.

## מצב נתוני דוגמה

לבדיקה מהירה בלי Home Assistant Recorder:

```yaml
type: custom:activity-history-card
mock_data: true
display_mode: panel
```

לבדיקת בית גדול ורועש:

```yaml
type: custom:activity-history-card
mock_data: true
mock_profile: large_noisy_home
display_mode: panel
debug: true
```

אם אתה רואה אזורי דוגמה כמו סלון, מטבח או חדרי ילדים שלא קשורים לבית שלך, בדוק שהכרטיס לא מוגדר עם `mock_data: true`.

## אפשרויות עיקריות

| Option                              | Default                 | Description                                                                       |
| ----------------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `mock_data`                         | `false`                 | מציג נתוני דוגמה רק כאשר מוגדר `true` במפורש                                      |
| `mock_profile`                      | `default`               | פרופיל דוגמה: `clean_activity_dashboard`, `area_inventory`, או `large_noisy_home` |
| `view_mode`                         | `activity`              | `activity` מומלץ; `activity_legacy` להשוואה; `legacy_swimlane` לדיבוג גולמי       |
| `auto_discover`                     | `true`                  | מגלה רכיבים שמשויכים לאזורים                                                      |
| `areas`                             | all                     | רשימת אזורים להצגה                                                                |
| `domains`                           | useful activity domains | סוגי רכיבים להצגה                                                                 |
| `include_labels`                    | none                    | מציג רק רכיבים עם labels אלה                                                      |
| `exclude_labels`                    | none                    | מסתיר רכיבים עם labels אלה                                                        |
| `hours_to_show`                     | `24`                    | טווח זמן להצגה                                                                    |
| `refresh_interval_seconds`          | `300`                   | תדירות רענון רקע כאשר `live: true`                                                |
| `smart_filter`                      | `true`                  | מסתיר כברירת מחדל שורות ריקות, טכניות או קצרות מאוד                               |
| `activity_mode`                     | `meaningful`            | `meaningful` מציג פעילות אמיתית; `all` מציג הכל לבדיקה                            |
| `hide_empty_rows`                   | `true`                  | מסתיר רכיבים ללא פעילות משמעותית בטווח הנוכחי                                     |
| `show_inactive_baselines`           | `false`                 | מציג קווי baseline כבויים רק כאשר מוגדר `true`                                    |
| `min_row_active_seconds`            | `10`                    | פעילות קצרה יותר תוסתר כאשר `smart_filter` פעיל                                   |
| `max_rows_per_group`                | `4`                     | מגביל כמה שורות אוטומטיות יוצגו בכל אזור/קבוצה                                    |
| `max_total_rows`                    | `18`                    | מגביל את כלל השורות האוטומטיות בתצוגה                                             |
| `show_activity_density`             | `true`                  | מציג פס צפיפות פעילות עליון בתצוגת `activity`                                     |
| `show_area_inventory`               | `true`                  | מציג מלאי אביזרים קומפקטי מתחת לכל אזור בתצוגת `activity`                         |
| `area_inventory_mode`               | `compact`               | `compact`, `expanded`, או `off`                                                   |
| `area_inventory_include_inactive`   | `true`                  | כולל אביזרים שלא פעלו בטווח הזמן במלאי האזורי                                     |
| `area_inventory_max_items`          | `12`                    | מספר אביזרים שיוצגו לפני “עוד X אביזרים”                                          |
| `area_inventory_group_by_domain`    | `true`                  | מקבץ את אביזרי האזור לפי סוג רכיב                                                 |
| `area_inventory_show_state`         | `true`                  | מציג מצב נוכחי/ידוע של האביזר במלאי                                               |
| `area_inventory_show_last_activity` | `true`                  | מציג משך פעילות אחרון/מצטבר כאשר יש פעילות בטווח                                  |
| `show_technical_entities`           | `false`                 | מאפשר להציג נתבים, הגדרות תוכנית ורעש טכני                                        |
| `show_config_entities`              | `false`                 | מאפשר להציג ישויות registry מסוג `config`                                         |
| `show_diagnostic_entities`          | `false`                 | מאפשר להציג ישויות registry מסוג `diagnostic`                                     |
| `summary_scope`                     | `visible`               | מחשב סיכום לפי השורות המוצגות או לפי כל השורות המסוננות                           |
| `max_visible_rows`                  | `18`                    | מגביל את מספר השורות הגלויות כדי לשמור על ביצועים וקריאות                         |
| `timeline_height`                   | `calc(100svh - 320px)`  | גובה פנימי של אזור הטיימליין לפני גלילה                                           |
| `timeline_axis_density`             | `comfortable`           | צפיפות תוויות הציר: `auto`, `compact`, `comfortable`                              |
| `debug_timeline_geometry`           | `false`                 | מציג אחוזי tick/segment ורוחב plot בזמן debug                                     |
| `collapse_groups`                   | `false`                 | מאפשר קיפול קבוצות; קבוצות ללא פעילות יכולות להתחיל סגורות                        |
| `default_collapsed_groups`          | `[]`                    | רשימת שמות/IDs של קבוצות שייפתחו סגורות                                           |
| `group_by`                          | `area`                  | `area`, `domain`, `entity`, `none`                                                |
| `display_mode`                      | `panel`                 | `card`, `panel`, `fullscreen`                                                     |
| `debug`                             | `false`                 | מציג דיאגנוסטיקה בכרטיס                                                           |

ראו דוגמה מלאה ב-[sample-config.yaml](sample-config.yaml).

## פיתוח מקומי

```bash
npm install
npm run demo
npm run typecheck
npm run test
npm run build
```

`npm run demo` פותח דמו מקומי עם נתוני mock ומציג בית עמוס בתצוגת panel, אזור יחיד עם מלאי פתוח, ותצוגת legacy להשוואה.

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

- מצב `activity` הוא המצב הפעיל והמומלץ של ה-MVP.
- `activity_legacy` נשאר זמין להשוואה מול רנדרר ה-activity הקודם.
- `legacy_swimlane` נשאר זמין לדיבוג ולבדיקה גולמית של שורות.
- Heatmap, drill-down ו-correlation נשארים placeholders בלבד בשלב הזה.
- Timeline נשאר כרונולוגי משמאל לימין, בזמן שכל הטקסטים והפקדים מותאמים ל-RTL.
- היסטוריה תלויה ב-Home Assistant Recorder ובזמינות הרשומות עבור הישויות שבחרת.
