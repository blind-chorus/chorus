---
name: main_jobs
image: ./main_jobs.png
status: canonical
recipe: ../schema/screens/main-jobs.screen.json
---

## Intent

Job listings — a search-led, filterable list where every row is a discrete entity (company, role, location) and the trailing bookmark is the only per-row commit. A transient toast confirms the bookmark action without modal interruption.

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

- The whole card is the click target; the bookmark icon is a *secondary* commit that should not steal hit area — see AGENTS.md composition rule "List rows are the click target."
- Toast lives above the tab bar with safe gap; never overlaps tab labels.
- Filter chips with `▾` indicate a sheet/menu opens on tap (no inline disclosure).
