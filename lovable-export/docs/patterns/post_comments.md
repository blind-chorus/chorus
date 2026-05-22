---
name: post_comments
image: ./post_comments.png
status: canonical
recipe: ../screens/post-comments.screen.json
---

## Intent

Threaded comments under a post. Sorted-by control on the left, jump-to-latest on the right, then a vertical stream of comments with replies indented and a persistent compose bar pinned to the bottom. Optimized for one-thumb reading and quick reply.

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

- Compose bar is *persistent*, not a bottom sheet — it stays docked even when scrolling. Do not model as `bottom-sheet`.
- Nested replies use a `sys.color.surfaceContainerLow` block, not a left rule — preserve the surface treatment.
- "대댓글" and "대화하기" are two distinct footer actions: one starts a reply thread, the other opens DM. Agents replicating must keep them as separate text buttons, not a combined dropdown.
- Source is Korean for fidelity; demo strings should render English per AGENTS.md rule 7.
