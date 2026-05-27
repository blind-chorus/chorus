---
name: compose_offereval
image: ./compose_offereval.png
status: canonical
recipe: ../schema/screens/compose-offereval.screen.json
---

## Intent

Expanded post-composition surface — same modal as [[compose]] after the body editor gains focus. Title + body inputs visible, mention helper row coaches next move, floating "Create an Offer or Poll" pill exposes the poll/offer insert. A "Popular Tags" chip row sits between editor and toggle band; bottom toolbar adds image/mention/hashtag inserts. Keyboard-first.

## Layout

- **Top action bar** — same as [[compose]]: leading `button/text` "Cancel" (neutral), trailing `button/text` "Post" (accent blue when valid, muted while empty).
- **Channel picker row** — `list/nav`: leading 4-dot grid icon, label "Product Management" (the previously selected channel), trailing chevron-down. Tap opens [[compose_channel]] as a bottom sheet.
- **Identity row** — `list/text`: leading person icon, "Google • iisooas" (company • alias). Read-only here.
- **Title input** — `form-field/input`, no chrome, placeholder "Write a specific title". Renders at `sys.typo.heading.md` bold.
- **Body input** — `form-field/input` multiline, separated from the title by a hairline divider, placeholder copy "Keep it relevant. If the community flags your post for going off topic it will be invisible to the community."
- **Mention helper row** — inline coaching: leading `@` glyph, secondary text "Tap here to mention companies or job titles and get answers faster". Inline affordance, not a banner.
- **Offer/Poll FAB** — `button/fab` `appearance: secondary`: pill geometry, `sys.color.surfaceContainerHigh` bg, `sys.color.onSurface` label, leading `+`, label "Create an Offer or Poll". Floats right above the Popular Tags band; opens the offer/poll insertion sheet (out of scope).
- **Popular Tags row** — leading neutral label "Popular Tags:", then `chip/tag` items `appearance: accent` (pale-blue surface + blue label): `#sellside`, `#ib`, `#interview`. Horizontally scrollable.
- **Invisible to Coworkers band** — same `list/text` checkbox row as [[compose]], on the sunken surface band.
- **Bottom toolbar** — three leading `button/icon` triggers (image attach, `@` mention, `#` hashtag) with trailing right-aligned `Hide company name` checkbox row. Directly above the keyboard.
- **Keyboard** — system keyboard intrinsic; not part of Chorus.

## Tokens in use

- **color**: "Cancel" `sys.color.onSurface`; "Post" `sys.color.primary` when valid, otherwise `sys.color.onSurfaceVariant` (muted state in the screenshot). Body input placeholder + helper text in `sys.color.onSurfaceVariant`. Popular Tags chips use `chip/tag` appearance `accent` — `sys.color.primaryContainer` background with `sys.color.primary` label. Invisible-to-Coworkers band on `sys.color.surfaceContainerLow`. Offer FAB uses `button/fab` appearance `secondary` — `sys.color.surfaceContainerHigh` background with `sys.color.onSurface` label.
- **spacing**: hairline dividers between picker rows and around the title/body block; `sys.layout.stack.md` row gap inside Popular Tags; `sys.layout.stack.lg` between the offer pill and the tag row.
- **typography**: title input `sys.typo.heading.md` bold; body input `sys.typo.body.md`; mention helper + tag label `sys.typo.label.md` secondary; offer pill label `sys.typo.label.md` bold.
- **radius**: offer pill fully rounded (`sys.radius.lg`+); tags fully rounded; bottom band corners square.
- **elevation**: offer pill carries `sys.elevation.level2` shadow — it floats above the editor surface.

## Components

- [[button/text]] — Cancel + Post in the top action bar.
- [[list/nav]] — channel picker row (with trailing chevron, opens [[compose_channel]]).
- [[list/text]] — identity row (read-only, no chevron); invisible-to-coworkers checkbox row.
- [[form-field/input]] — title + body inputs.
- [[button/fab]] — "Create an Offer or Poll" pill (`appearance: secondary`, leading + glyph). One FAB per screen; Post in the top bar is `button/text` chrome.
- [[chip/tag]] — Popular Tags row items.
- [[button/icon]] — bottom toolbar triggers (image, `@`, `#`).
- [[button/check]] — Invisible-to-Coworkers toggle row (medium size).

## Notes

- *Expanded* sibling of [[compose]] — same modal, later state with editor focused.
- "Create an Offer or Poll" pill **IS** `button/fab` `appearance: secondary` (see [fab.spec.json](../schema/components/button/fab.spec.json)) — canonical commit for this surface. Post in the top bar is finalize chrome (`button/text`), not a competing FAB. ≤1-FAB rule satisfied.
- Mention helper row is *not* a `banner` — no container surface; treat as `list/text` with leading `@` glyph.
- Popular Tags use `chip/tag` `appearance: accent`, not `chip/filter`. Taps insert the tag, don't toggle filter state. Accent appearance signals clickable suggestion vs passive metadata.
- Bottom toolbar trio (image / `@` / `#`) is the *insert* row, separate from post-level options. Don't fuse with "Hide company name" — right-aligned on the same row for density only.
- Demo strings render English per AGENTS.md rule 7.
