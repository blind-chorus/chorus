---
name: main_jobs
image: ./main_jobs.png
status: canonical
recipe: ../schema/screens/main-jobs.screen.json
---

## Intent

Job listings — search-led filterable list where every row is a discrete entity (company, role, location) and trailing bookmark is the only per-row commit. Transient toast confirms bookmarks.

## Layout

- **Header** — `navigation-bar / search`: input fills the bar; trailing profile icon. Placeholder "Search by job title or company".
- **Top tabs** — `tabs / underline`: "Jobs (3,401)" active, "Saved Jobs (4)" inactive. Counts inline in label.
- **Filter row** — leading filter icon, then `chip / filter` row: "Location ▾", "Remote Only", "Minimum YOE ▾". Horizontally scrollable.
- **Job list** — vertical stack of card rows. Each row: leading company logo thumbnail, title (bold), company • posted-time meta, location icon + location text, trailing bookmark icon (filled = saved, outlined = not saved).
- **Toast** — `toast` overlay above tab bar: leading check, "Job saved", trailing "Undo" text action. Auto-dismissing.
- **Tab bar** — `tab-bar`: Jobs active.

## Tokens in use

- **color**: search input `sys.color.surfaceContainerLow`; bookmark active uses primary text color (filled black). Toast on `sys.color.inverseSurface`.
- **spacing**: `sys.layout.stack.md` between job cards; card internal padding `sys.layout.stack.md`.
- **typography**: job title `sys.typo.heading.md` bold; company/time `sys.typo.label.md` secondary; location `sys.typo.body.sm`.
- **radius**: cards `sys.radius.md`; chips fully rounded; toast pill `sys.radius.lg`.

## Components

- [[navigation-bar/search]] — search fills the bar.
- [[tabs/underline]] — Jobs / Saved Jobs.
- [[chip/filter]] — facet filter row.
- [[button/icon]] — leading filter icon and trailing bookmark.
- [[toast]] — "Job saved" with Undo.
- [[tab-bar]]

## Notes

- Whole card is the click target; the bookmark icon is *secondary* and must not steal hit area (AGENTS.md "List rows are the click target").
- Toast sits above the tab bar with safe gap; never overlaps tab labels.
- Filter chips with `▾` open a sheet/menu on tap (no inline disclosure).
