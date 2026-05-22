---
name: main_notifications_keywords
image: ./main_notifications_keywords.png
status: canonical
---

## Intent

Keyword scope picker for the notifications "키워드" (Keywords) tab. Surfaces as a bottom sheet over [main_notifications](main_notifications.md) when the user taps the "키워드 전체 ▾" filter chip, letting them multi-select which tracked keywords drive the matched-post stream before committing with a single primary action. "선택해제" (Deselect all) clears the set in one tap; "적용하기" (Apply) closes the sheet and refilters the list underneath.

## Layout

- **Sheet container** — `bottom-sheet`: drag handle at top, rounded top corners, scrim over the parent screen. Full-width, anchored to the bottom edge; content scrolls within the sheet while the primary CTA stays pinned.
- **Header row** — leading title "키워드" in heading weight; trailing `button / text` "선택해제" in accent blue.
- **Keyword list** — vertical stack of `button / check` (medium) rows, one per tracked keyword. Each row: leading 24px filled checkbox glyph (all checked in this state) + label. Hairline separators between rows.
- **Primary action** — full-width `button / standard` primary "적용하기" pinned to the sheet's bottom safe area.

## Tokens in use

- **color**: sheet surface `sys.color.surface` with `sys.color.onSurface` foreground; primary CTA uses the brand primary pair. The deselect-all link uses the accent-blue text-button role — same token as "키워드 관리" on the parent screen so the two link-shape affordances read as a family.
- **spacing**: row padding `sys.layout.stack.md`; sheet content uses the standard sheet inset, with the pinned CTA respecting safe-area bottom inset.
- **typography**: title `sys.typo.heading.sm`; row labels `sys.typo.body.md`; CTA `sys.typo.label.lg` per Standard Button medium.
- **radius**: sheet top corners `sys.radius.lg`; checkbox glyph and CTA per their component specs.

## Components

- [[bottom-sheet]] — sheet container with handle + scrim.
- [[button/text]] — "선택해제" deselect-all action in the header.
- [[button/check]] — medium checkbox rows, one per keyword; `checked` state is the default for tracked keywords.
- [[button/standard]] — primary "적용하기" commit action.

## Notes

- This is a *sub-screen* of [main_notifications](main_notifications.md); don't catalogue it as a standalone destination. The trigger is the "키워드 전체 ▾" filter chip — keep that affordance in sync if either side changes.
- Use `button / check` for the rows, not `list / radio` or a custom checkbox: rows commit option state alongside the sheet's primary action, which is exactly Check Button's intent (see [button/check](../schema/components/button/check.md)).
- Localization: source is Korean. Per AGENTS.md rule 7, demo strings rendered in components should be English; this pattern captures the Korean source for visual fidelity only.
- No paired screen recipe yet — when one is added under `schema/screens/`, link both ways and update the index row's Recipe column.
