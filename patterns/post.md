---
name: post
image: ./post.png
status: canonical
recipe: ../schema/screens/post.screen.json
---

## Intent

Single-post detail view — full body, optional embedded poll, and full toolbar of post-level actions (share, subscribe, bookmark, overflow). The reader's primary action is to scroll, react, or vote; replies live on the paired comments screen ([[post_comments]]).

## Layout

- **Header** — `navigation-bar / page`: leading back chevron, wordmark "blind" muted in the title position, trailing `button/toolbar` cluster (share, bell, bookmark, overflow).
- **Author block** — leading avatar (gray circle, "blind" mark), then "Channel 💞" + relative time, then a second line with workplace · role · username.
- **Title** — large bold; inline rich tokens like underlined "Meta" indicate entity links.
- **Body** — long-form text. Numbered list rendered natively. `#TC`-style hashtags rendered in accent blue.
- **Poll** — `callout`-shaped container: leading coral Poll icon, "Number Participants" header, "Select only one answer" helper, then radio-style option rows (`list / radio`).
- **Footer status** — bottom bar callout: leading ⓘ glyph, muted text "You cannot reply to flagged/deleted comment." — informational state, not modal.

## Tokens in use

- **color**: hashtags + entity links in accent blue (`sys.color.primary`). Poll icon in `sys.color.brand`. Footer notice on `sys.color.surfaceContainerLow` with `sys.color.onSurfaceVariant`.
- **spacing**: generous body line-height; `sys.layout.stack.lg` between title and body, body and poll.
- **typography**: title `sys.typo.display.md` bold; body `sys.typo.body.lg`; meta `sys.typo.label.sm`.
- **radius**: poll container `sys.radius.md`; option rows `sys.radius.sm`.

## Components

- [[navigation-bar/page]] — back + toolbar cluster.
- [[button/toolbar]] — share, bell-subscribe, bookmark, overflow icons in the trailing slot.
- [[callout]] — Poll container surface.
- [[list/radio]] — poll options.
- [[callout]] (info variant) — bottom notice strip.

## Notes

- The author block has *two* meta lines (channel + time, then workplace · role · username). Agents should preserve both — collapsing into one loses identity context that's load-bearing in Blind.
- "blind" in the nav title is intentionally muted/gray, not primary — it's a wordmark, not a screen title.
- The bottom notice strip is non-modal and persistent for this state; do not model it as a toast.
- Body markup includes inline entity underlines and hashtag color — these are tokenized text styles, not arbitrary inline `<span>` overrides.
