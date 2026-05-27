---
name: main_home
image: ./main_home.png
status: canonical
recipe: ../schema/screens/main-home.screen.json
---

## Intent

Default landing surface — vertically scrolling feed of authored posts framed by lightweight discovery affordances (channel rail, recruiter banner, "while you were away" rail) above the fold. High density, thin chrome; the only persistent commit is the tab bar's red Create entry.

## Layout

- **Header** — `navigation-bar / home`: leading menu (hamburger), wordmark "blind" center-left, trailing icon cluster (message, bell, profile).
- **Channel rail** — `avatar-rail` directly under the bar; horizontally scrollable channel chips with leading emoji/avatar. "For You" / "Recent" / "Popular" function as feed-mode chips with one selected (filled black).
- **Promo banner** — `banner` with image, headline + body, dismissible. Soft surface (`sys.color.surfaceContainerHigh`-ish), not modal.
- **Keyword subscription row** — secondary banner-style row, bell-leading, "X" trailing.
- **Section header** — "While you were away…" intrinsic header above the feed proper.
- **Feed** — `feed / feed`: author header (avatar, channel, time, follow CTA), title, body preview, footer (heart, comment, view counts).
- **Tab bar** — `tab-bar` 6 items: Home (active), Company, Explore, Jobs, Notifications, Create. Create is a coral-filled square with white plus — the canonical commit shortcut.

## Tokens in use

- **color**: `sys.color.surface` (page), `sys.color.onSurface` (titles), `sys.color.onSurfaceVariant` (meta), accent coral on Create + heart-active + Poll, accent blue on inline links.
- **spacing**: standard `sys.layout.stack.lg` between feed cards, `sys.layout.stack.md` row gap inside cards.
- **typography**: feed title at `sys.typo.heading.md` bold; body preview at `sys.typo.body.md`; meta at `sys.typo.label.sm`.
- **radius**: chips fully rounded; cards/banners ~`sys.radius.md`.

## Components

- [[navigation-bar/home]] — top chrome.
- [[avatar-rail]] — channel + feed-mode rail.
- [[banner]] — recruiter promo + keyword subscription rows.
- [[feed/feed]] — post stream.
- [[tab-bar]] — bottom nav, 6 items including Create as accent.

## Notes

- "For You / Recent / Popular" are feed-mode chips inside the rail, not `tabs / underline` — the rail is the navigation primitive.
- Two stacked banner rows above the feed is intentional density; keep as discrete banners, do not fuse.
- Source is English; demo strings stay English per AGENTS.md rule 7.
