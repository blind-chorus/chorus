---
name: main_notifications
image: ./main_notifications.png
status: canonical
recipe: ../schema/screens/main-notifications.screen.json
---

## Intent

Inbox surface with two notification streams — system updates ("새 소식" / What's New) and keyword-matched posts ("키워드" / Keywords). Keyword tab is filter-heavy: pre-narrow by keyword and channel before scanning. Each row links to a post.

## Layout

- **Header** — `navigation-bar / page`: leading menu, title "알림" (Notifications), trailing settings cog + profile.
- **Top tabs** — `tabs / underline`: "새 소식" inactive, "키워드" active (with black underline).
- **Promo banner** — `banner` with illustration on the right and headline + subhead on the left. Distinct soft-yellow surface.
- **Filter row** — `chip / filter` row: "키워드 전체 ▾" (filled black, active), "채널 전체 ▾", "Label" (outlined), trailing "키워드 관리" as a `button / text` in accent blue.
- **Notification list** — `list / text` style rows. Each row: leading bell icon in coral circle, keyword tag(s), post title (bold), source channel · relative time. Hairline separators between rows.
- **Tab bar** — `tab-bar`: 알림/Notifications active.

## Tokens in use

- **color**: banner uses warm surface (`sys.color.brandContainer` or equivalent warm container) with `on<Role>Container` foreground — the color pair travels together (AGENTS.md rule 2). Bell glyph circle uses coral accent.
- **spacing**: `sys.layout.stack.md` row padding; section separators are hairlines, not full dividers.
- **typography**: post title `sys.typo.heading.sm` bold; keyword tags + meta `sys.typo.label.sm` secondary.
- **radius**: filter chips fully rounded; banner `sys.radius.md`.

## Components

- [[navigation-bar/page]]
- [[tabs/underline]] — 새 소식 / 키워드.
- [[banner]] — recruiter/promo banner.
- [[chip/filter]] — keyword + channel + label filters.
- [[button/text]] — "키워드 관리" link-shape action at the end of the chip row.
- [[list/text]] — notification rows.
- [[tab-bar]]

## Notes

- Trailing "키워드 관리" button-text is a navigation hint paired with the filter scope, not a filter chip. Don't merge into the chip row.
- Source is Korean. Per AGENTS.md rule 7, demo strings render English; Korean here is for visual fidelity only.
- Bell-in-coral leading glyph appears on every row — row type marker, not per-row state.
