---
name: main_company
image: ./main_company.png
status: canonical
recipe: ../schema/screens/main-company.screen.json
---

## Intent

Company-context surface — posts scoped to the user's employer ("My Company") or followed companies ("Following"). Distinguished from Home by an explicit company filter chip row under the tabs and a collapsible "Overview" banner.

## Layout

- **Header** — `navigation-bar / page`: leading menu, title "Company", trailing search + profile.
- **Top tabs** — `tabs / underline`: "MY COMPANY" active (uppercase tracking), "FOLLOWING" inactive.
- **Company-scope chip row** — `chip / filter` row: "🔒 Amazon" filled black (active company chip with lock leading icon), "@ Amazon", "Pulse", "Reviews", "Lab…". Horizontally scrollable.
- **Overview banner** — `banner` with title "Overview", body text, trailing chevron-down for collapse. Soft surface, not modal.
- **Section header** — "▾ RECENT" — collapsible section divider with uppercase label.
- **"While you were away…" rail** — intrinsic mini-divider with leading clock emoji.
- **Feed** — `feed / feed` posts; each post has a leading "HOT" or "ALL TIME BEST" category eyebrow in colored small-caps (coral / blue) above the author row.
- **Tab bar** — `tab-bar`: Company active.

## Tokens in use

- **color**: eyebrow labels — "HOT" in coral, "ALL TIME BEST" in blue — these are semantic role colors, not arbitrary highlights; expect `sys.color.brand` and `sys.color.primary` (or matching role).
- **spacing**: `sys.layout.stack.lg` between posts; chip row padding `sys.layout.stack.md`.
- **typography**: eyebrow labels `sys.typo.label.sm` bold uppercase tracked; post title `sys.typo.heading.md` bold.

## Components

- [[navigation-bar/page]]
- [[tabs/underline]] — MY COMPANY / FOLLOWING.
- [[chip/filter]] — company-scope filter row with lock and @-prefixed variants.
- [[banner]] — collapsible Overview block.
- [[feed/feed]] — post stream with category eyebrow.
- [[tab-bar]]

## Notes

- Lock 🔒 leading icon on the active company chip signals private/employee-only scope — preserve.
- Category eyebrow ("HOT", "ALL TIME BEST") sits *above* the author row, not in the title. Model as feed-post `eyebrow` slot or `chip/tag` variant; do not bake into title string.
- "▾ RECENT" is a collapsible section header, not a tab — do not swap in `tabs/*`.
