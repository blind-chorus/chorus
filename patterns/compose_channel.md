---
name: compose_channel
image: ./compose_channel.png
status: canonical
recipe: ../schema/screens/compose-channel.screen.json
---

## Intent

Channel picker bottom sheet from [[compose]]. Two sections — "내 채널" (channels you belong to) and "팔로우중인 채널" (channels you follow) — each row showing avatar, channel name, and a short eligibility/scope sentence. Search input pinned at top.

## Layout

- **Sheet handle** — top center drag handle; intrinsic to `bottom-sheet`.
- **Sheet title** — "채널 선택" (Select Channel) left-aligned, `sys.typo.heading.lg` bold.
- **Search input** — `form-field / search` pill below the title, placeholder "채널을 검색하세요".
- **Section: 내 채널** — section header in `sys.typo.label.md` secondary; then `list / thumbnail` rows. Each row: leading avatar/logo, channel name (bold), short eligibility blurb (one or two lines).
- **Section: 팔로우중인 채널** — second section, denser rows with single-line names. Many rows have a small red "B" badge on the avatar (Blind-curated).
- **Channels** — "성격유형" includes a "New" tag in accent coral next to the name.

## Tokens in use

- **color**: section headers in `sys.color.onSurfaceVariant`; eligibility text in `sys.color.onSurfaceVariant`; "New" tag in coral.
- **spacing**: `sys.layout.stack.md` between rows; section gap `sys.layout.stack.lg`.
- **typography**: channel name `sys.typo.heading.sm` bold; eligibility body `sys.typo.body.sm`.
- **radius**: sheet top corners `sys.radius.lg`; search input fully rounded.

## Components

- [[bottom-sheet]] — host surface with drag handle.
- [[form-field/search]] — channel search input.
- [[list/thumbnail]] — channel rows (avatar-anchored).
- [[chip/tag]] — "New" marker on channel names.
- [[badge]] — small "B" overlay on Blind-curated channel avatars.

## Notes

- Paired trigger of the channel picker row in [[compose]] (AGENTS.md: every bottom-sheet must have a paired trigger).
- "내 채널" rows carry eligibility metadata and are denser than "팔로우중인 채널" rows; do not normalize densities.
- The "B" badge is a thumbnail-decorator inside the `thumbnail` slot, not a trailing `badge`.
- Sheet supports scroll; keyboard collapses sheet height when search focuses.
