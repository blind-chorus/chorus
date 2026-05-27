---
name: post_comments
image: ./post_comments.png
status: canonical
recipe: ../schema/screens/post-comments.screen.json
---

## Intent

Threaded comments under a post. Sort control left, jump-to-latest right, vertical comment stream with indented replies, persistent compose bar pinned bottom. One-thumb reading and quick reply.

## Layout

- **Header** — `navigation-bar / page`: back chevron, wordmark "blind" muted, trailing toolbar (share, bell-muted, bookmark, overflow). Same chrome as [[post]] for flow consistency.
- **Sort + jump row** — leading `button/text` "시간순 ▾" (sort menu trigger), trailing `button/text` "마지막 댓글로" (jump-to-end) in accent blue.
- **"이전 댓글 보기…"** — `button / text` row to load earlier comments.
- **Comment list** — `feed / feed` (or comment-flavored variant): each item has author meta line (verified badge, channel tag with emoji), body, footer row with time · ❤ count · 대댓글 · 대화하기 · overflow.
- **Nested reply** — indented with a soft-surface highlight, signaling thread parent/child relationship.
- **Compose bar** — pinned bottom: leading image-attach icon, placeholder "댓글을 남겨주세요." Sits above the keyboard / safe area.

## Tokens in use

- **color**: heart-active in coral; "마지막 댓글로" + "대화하기" + jump links in accent blue; verified badge in accent blue; secondary meta in `sys.color.onSurfaceVariant`. Nested reply background `sys.color.surfaceContainerLow`.
- **spacing**: comment vertical gap `sys.layout.stack.lg`; footer row gap `sys.layout.stack.md`.
- **typography**: comment body `sys.typo.body.md` with comfortable line-height; footer chips `sys.typo.label.sm`.

## Components

- [[navigation-bar/page]]
- [[button/text]] — sort trigger, jump-to-end, load-earlier.
- [[feed/feed]] — comment stream (parent-comment shape).
- [[badge]] — verified checkmark next to author handle.
- [[chip/tag]] — channel tag with emoji on author line.
- [[form-field/input]] — bottom compose field with leading attach icon.

## Notes

- Compose bar is *persistent*, not a bottom sheet — stays docked while scrolling. Do not model as `bottom-sheet`.
- Nested replies use `sys.color.surfaceContainerLow` block, not a left rule — preserve.
- "대댓글" and "대화하기" are distinct footer actions (reply thread vs DM). Keep as separate text buttons, not a combined dropdown.
- Source is Korean. Demo strings render English per AGENTS.md rule 7.
