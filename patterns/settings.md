---
name: settings
status: canonical
recipe: ../schema/screens/settings.screen.json
---

## Intent

A drill-in settings surface — a page-style top bar over a vertical list of grouped preference rows. Each row is itself a drill-in into a sub-screen; destructive commits (sign out, delete account) escalate to a BottomSheet rather than firing inline. There is no FAB — there is no canonical commit at this level.

## Layout

- **Header** — `navigation-bar / page`: leading back chevron + centered title ("Settings"). No trailing action cluster.
- **Body** — `list / nav`: vertical stack of preference rows. Each row carries a primary label and a single-line supporting text describing what lives behind the drill-in; the `nav` variant auto-renders the trailing chevron, so consumers must not paint their own. Rows are the click target — the chevron is not a separate hit area.
- **Overlay** — `bottom-sheet` triggered by destructive rows (e.g. `Sign out`): title + body copy, primary action carries the button family's `destructive` flavor, secondary action is `Cancel`. The overlay never appears inline; the row commit is to *open the sheet*, not to perform the destructive action.
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

- **Destructive commits never fire inline.** Even when a row reads as a verb ("Sign out", "Delete account"), the row's tap opens the sheet — the *sheet* owns the irreversible action.
- **List variant stays `nav`.** Switching to `text` would drop the chevron and break the drill-in affordance contract.
- **Overlay swap is allowed.** The recipe declares `swappable.overlay: [bottom-sheet, dialog]` — Dialog is the alternative when the surface is small or the destructive copy needs more emphasis.
- Sub-screens reached from rows are themselves drill-ins (back chevron + page title) — keep the bar variant consistent across the flow.
