---
name: compose_channel
image: ./compose_channel.png
status: canonical
recipe: ../screens/compose-channel.screen.json
---

## Intent

Channel picker presented as a bottom sheet from [[compose]]. Two sections — "내 채널" (channels you belong to) and "팔로우중인 채널" (channels you follow) — each row showing avatar, channel name, and a short eligibility/scope sentence. Search input pinned at top of the sheet for fast filtering.

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

- This sheet is the *paired trigger* of the channel picker row in [[compose]] — per AGENTS.md, every bottom-sheet/dialog must have a paired trigger; that trigger lives there.
- The "내 채널" rows are denser-text than "팔로우중인 채널" rows because they carry eligibility metadata; do not normalize them to the same density.
- The avatar-overlaid "B" badge is a thumbnail-decorator, not a separate row badge — model it as part of the `thumbnail` slot, not as a trailing `badge`.
- Sheet is short-form (≤2 sections visible without scroll on tall devices) but supports scroll; assume keyboard collapses sheet height when search focuses.
