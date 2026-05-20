---
name: compose_offereval
image: ./compose_offereval.png
status: canonical
recipe: ../schema/screens/compose-offereval.screen.json
---

## Intent

Expanded post-composition surface — the same modal as [[compose]] after the user has tapped into the body editor. Title + body inputs are both visible above the keyboard, a mention helper row coaches the next move, and a floating "Create an Offer or Poll" pill exposes the secondary commit (insert a poll/offer block). A horizontal "Popular Tags" chip row sits between the editor and the toggle band, and the bottom toolbar adds image/mention/hashtag insert affordances. Keyboard-first: the editing surface compresses to fit above the system keyboard.

## Layout

- **Top action bar** — same as [[compose]]: leading `button/text` "Cancel" (neutral), trailing `button/text` "Post" (accent blue when valid, muted while empty).
- **Channel picker row** — `list/nav`: leading 4-dot grid icon, label "Product Management" (the previously selected channel), trailing chevron-down. Tap opens [[compose_channel]] as a bottom sheet.
- **Identity row** — `list/text`: leading person icon, "Google • iisooas" (company • alias). Read-only here.
- **Title input** — `form-field/input`, no chrome, placeholder "Write a specific title". Renders at `sys.typo.heading.md` bold.
- **Body input** — `form-field/input` multiline, separated from the title by a hairline divider, placeholder copy "Keep it relevant. If the community flags your post for going off topic it will be invisible to the community."
- **Mention helper row** — inline coaching: leading `@` glyph, secondary text "Tap here to mention companies or job titles and get answers faster". Functions as an inline call to the `@` mention insert affordance, not a callout container.
- **Offer/Poll FAB** — `button/fab` with `appearance: secondary`: pill geometry, `sys.color.surfaceContainerHigh` background, `sys.color.onSurface` label, leading `+`, label "Create an Offer or Poll". Floats to the right above the Popular Tags band; not docked to the keyboard. Single-tap commits — opens the offer/poll insertion sheet (out of scope for this pattern).
- **Popular Tags row** — leading neutral label "Popular Tags:", then a row of `chip/tag` items with `appearance: accent` (pale-blue surface + blue label): `#sellside`, `#ib`, `#interview`. Horizontally scrollable.
- **Invisible to Coworkers band** — same `list/text` checkbox row as [[compose]], on the sunken surface band.
- **Bottom toolbar** — row of three leading `button/icon` triggers (image attach, `@` mention, `#` hashtag) with a trailing right-aligned `Hide company name` checkbox row. Sits directly above the keyboard.
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

- This is the *expanded* sibling of [[compose]] — same modal frame, more controls visible because the editor has focus. Do not treat as a separate surface; treat as the same modal in a later state.
- The "Create an Offer or Poll" pill **IS** a `button/fab` with `appearance: secondary` — the neutral-surface FAB variant in [fab.spec.json](../schema/components/button/fab.spec.json). It is the canonical commit on this surface (entry to the structured-post flow); Post in the top bar is finalize chrome (`button/text`), not a competing FAB. The ≤1-FAB rule is satisfied.
- The mention helper row is *not* a `callout` — it has no container surface, just inline guidance text. Treat as a `list/text` row with a leading `@` glyph.
- Popular Tags chips use `chip/tag` with `appearance: accent` (informational, tonal pale-primary), not `chip/filter` (toggleable filter). Tapping inserts the tag into the body, it doesn't toggle filter state. The accent appearance is what makes the row read as a clickable suggestion strip rather than passive metadata.
- The bottom toolbar trio (image / `@` / `#`) is the *insert* row, separate from the post-level option rows above. Do not fuse with the "Hide company name" checkbox conceptually — the checkbox is right-aligned on the same row only because of horizontal density, not because it belongs to the toolbar.
- Demo strings render English per AGENTS.md rule 7.
