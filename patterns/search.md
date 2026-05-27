---
name: search
status: canonical
recipe: ../schema/screens/search.screen.json
---

## Intent

Focused search surface — the input is the screen. Top bar collapses to a bare input row (leading back + text field filling the bar + conditional clear); body switches between recent searches and live results without changing component. No FAB; the input is itself the primary commit.

## Layout

- **Header** — `navigation-bar / search`: leading back chevron, bare text input fills the row, trailing clear icon appears only when the input has content.
- **Body** — `list / text`: vertical list of search items. Two modes share the same component:
  - *Empty input* — recent searches (most recent first, plain text rows).
  - *Active input* — live results filtered against the query, same `list/text` rows.
- **No FAB, no tab bar.** Search is a transient surface; the back affordance in the navigation bar returns to the originating screen.

## Tokens in use

- **color**: `sys.color.surface` (page), `sys.color.onSurface` (row labels), `sys.color.onSurfaceVariant` (placeholder + clear glyph).
- **spacing**: list rows pay their own row padding (`sys.layout.stack.sm` block, `sys.layout.container.md` inline); page shell pays `sys.layout.page.md` once.
- **typography**: input + row labels at `sys.typo.body.md`; placeholder at the same ramp with reduced contrast color.
- **radius**: none on the bar (full-bleed), none on rows (full-bleed list).

## Components

- [[navigation-bar/search]] — top chrome with embedded input.
- [[list/text]] — recent searches and live results (same sub).

## Notes

- **Same component in both modes.** Do not swap to `list/nav` when results appear — trailing chevrons conflict with result-tap semantics. Only the `items` array changes.
- **Never stack a second top bar.** The `search` variant owns the back affordance; a `page` bar above doubles chrome.
- **Body may swap to `feed` when results are authored content** (posts vs channels). Recipe declares `swappable.body: [list, feed]` — choice is by *result kind*, not visual preference.
- Source is English; demo strings stay English per AGENTS.md rule 7.
