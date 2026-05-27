---
name: settings
status: canonical
recipe: ../schema/screens/settings.screen.json
---

## Intent

Drill-in settings surface — page-style top bar over a vertical list of grouped preference rows. Each row drills into a sub-screen; destructive commits (sign out, delete account) escalate to a BottomSheet rather than firing inline. No FAB — no canonical commit at this level.

## Layout

- **Header** — `navigation-bar / page`: leading back chevron + centered title ("Settings"). No trailing action cluster.
- **Body** — `list / nav`: vertical stack of preference rows. Each row: primary label + single-line supporting text. `nav` auto-renders the trailing chevron — do not paint your own. Rows are the click target; chevron is not a separate hit area.
- **Overlay** — `bottom-sheet` triggered by destructive rows (e.g. `Sign out`): title + body copy, primary action with `destructive` flavor, secondary action `Cancel`. Never inline — row commit *opens the sheet*, not performs the action.
- **No FAB, no tab bar inside the drill-in.** The back chevron is the only way back.

## Tokens in use

- **color**: `sys.color.surface` (page), `sys.color.onSurface` (row primary), `sys.color.onSurfaceVariant` (row supporting text + chevron), `sys.color.error` carried by the destructive button inside the sheet.
- **spacing**: rows pay their own block padding via `sys.layout.stack.sm`, inline via `sys.layout.container.md`; page shell pays `sys.layout.page.md` once.
- **typography**: row primary at `sys.typo.body.md`; supporting text at `sys.typo.label.sm`; sheet title at `sys.typo.heading.sm`.
- **radius**: none on rows (full-bleed list); sheet at `sys.radius.lg` on its top corners.

## Components

- [[navigation-bar/page]] — back + centered title.
- [[list/nav]] — preference rows with auto-rendered trailing chevron.
- [[bottom-sheet]] — destructive confirmation host.
- [[button/standard]] (`flavor: "destructive"`, inside the sheet) — the actual destructive commit.

## Notes

- **Destructive commits never fire inline.** Even verb-shaped rows ("Sign out", "Delete account") open the sheet — the *sheet* owns the irreversible action.
- **List variant stays `nav`.** `text` drops the chevron and breaks the drill-in affordance contract.
- **Overlay swap allowed.** Recipe declares `swappable.overlay: [bottom-sheet, dialog]` — Dialog when surface is small or destructive copy needs emphasis.
- Sub-screens reached from rows are themselves drill-ins — keep the bar variant consistent across the flow.
