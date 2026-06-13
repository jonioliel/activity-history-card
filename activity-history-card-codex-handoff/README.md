# Activity History Card — Codex Handoff Pack

חבילת עבודה מלאה להעברה ל-Codex עבור פיתוח כרטיס Home Assistant בשם:

```yaml
type: custom:activity-history-card
```

המטרה: כרטיס היסטוריית פעילות חכם, נקי וברור, עם תמיכה מלאה ב-RTL, סינון רכיבים, מצב מסך מלא, ונייד.

## מה יש בחבילה

```text
CODEX_PROMPT.md                 # הפרומט הראשי להעברה ל-Codex
activity-history-card.css       # CSS מלא כבסיס עיצובי
sample-config.yaml              # דוגמת YAML לכרטיס
package.json                    # שלד פרויקט Vite/Lit
vite.config.ts
src/                            # שלד TypeScript ראשוני
mockups/                        # כל ההדמיות
mockups/index.html              # גלריית צפייה מהירה בהדמיות
docs/IMPLEMENTATION_SPEC.md     # מפרט פיתוח מפורט
docs/MOBILE_RTL_FILTER_SPEC.md  # מפרט מובייל/RTL/סינון
docs/MOCKUP_MANIFEST.md         # פירוט ההדמיות
docs/legacy-codex-brief.md      # הבריף הקודם, לשימור הקשר
docs/legacy-mockups-gallery.html# גלריית ההדמיות המקורית
```

## איך להשתמש מול Codex

1. העלה ל-Codex את כל התיקייה או את קובץ ה-ZIP.
2. פתח את `CODEX_PROMPT.md` והדבק אותו כהנחיית העבודה הראשית.
3. בקש מ-Codex להתחיל מ-MVP של `swimlane` עם תמיכה ב-RTL, פילטרים, ומובייל.
4. אחרי שה-MVP עובד, המשך למצבי `heatmap`, `detail`, ו-`correlation`.

## סדר עדיפות לפיתוח

1. תשתית Custom Card: Lit + TypeScript + build.
2. קריאת History מ-Home Assistant.
3. המרת היסטוריה ל-Segments.
4. תצוגת Swimlane לפי אזורים.
5. סינון לפי זמן, אזור, סוג רכיב, חיפוש, active-only.
6. RTL אמיתי, כולל מובייל.
7. מצב full-screen/panel.
8. Drill-down לרכיב.
9. Heatmap וקורלציות.

## ההדמיות החשובות ביותר

- `mockups/05-desktop-fullscreen-rtl-panel.png`
- `mockups/06-mobile-overview-rtl.png`
- `mockups/07-mobile-advanced-filter-sheet-rtl.png`
- `mockups/08-mobile-entity-detail-rtl.png`

