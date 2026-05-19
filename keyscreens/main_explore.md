---
name: main_explore
image: ./main_explore.png
status: canonical
recipe:
---

## Intent

Channel and topic discovery. Two parallel modes — "Explore" (curated recommendations + hot posts) and "My Channels" — sit under a page-style header with a search affordance. The screen is shopping-shaped: large preview cards horizontally, follow/unfollow toggles as primary commits.

## Layout

- **Header** — `navigation-bar / page`: leading menu, title "Explore", trailing search + profile icons.
- **Top tabs** — `tabs / underline`: "Explore" (active) and "My Channels" with a sliding black underline indicator.
- **Recommended for you** — section header + horizontally scrollable channel preview cards. Each card: image, title, two-line description, [[button/toggle]] (Follow / Unfollow) as the row commit.
- **Hot Posts** — section header with a leading 🔥 icon, trailing "Refresh" text button. Horizontally scrollable post preview cards with title, embedded `poll` chip, footer meta (company • username, view count).
- **Tab bar** — `tab-bar`: Explore active.

## Tokens in use

- **color**: `sys.color.surface`, primary text, secondary meta. Follow button uses brand blue solid; Unfollow uses outlined neutral.
- **spacing**: `sys.layout.stack.lg` between sections; cards have internal `sys.layout.stack.md` padding.
- **typography**: section headers `sys.typo.heading.md` bold; card title `sys.typo.heading.sm` bold.
- **radius**: cards `sys.radius.md`; chips fully rounded.

## Components

- [[navigation-bar/page]]
- [[tabs/underline]] — Explore / My Channels.
- [[button/toggle]] — Follow / Unfollow on each recommended card.
- [[button/text]] — Refresh action on the Hot Posts section header.
- [[chip/tag]] — Poll indicator inside post preview cards.
- [[tab-bar]]

## Notes

- Two distinct horizontal rails (channel cards, post cards) are visually similar but semantically different surfaces — keep them as separate sections with their own headers, not a single rail.
- The Follow/Unfollow pair demonstrates `button/toggle` with both states visible; useful as a parity reference.
