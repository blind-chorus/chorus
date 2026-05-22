---
name: compose
image: ./compose.png
status: canonical
recipe: ../schema/screens/compose.screen.json
---

## Intent

Post-composition surface. Modal-style top bar with Cancel / Post commits, two destination pickers (channel + identity), title input, an inline coaching banner, and two checkbox-style toggles above the keyboard. The screen is keyboard-first: layout assumes the keyboard is up, so the upper half does all the structural work.

## Layout

- **Top bar** — custom navigation row, not the standard family: leading `button/text` "Cancel" (neutral), trailing `button/text` "Post" (accent blue, becomes primary when valid).
- **Channel picker row** — leading 4-dot grid icon, label "Ask Blinders", trailing chevron-down. Tapping opens [[compose_channel]] as a bottom sheet.
- **Identity row** — leading person icon, label "Samsung • ililliji" (company • alias). Read-only here; choice is made via the toggles below.
- **Title input** — full-width text field, no chrome, with caret. Placeholder behavior is to upgrade to entered title.
- **Guidance banner** — `banner` with leading warning glyph: "Get people thinking! Use the title section for open-ended question, avoid loaded ones and those with definite answers." Soft surface, secondary text color.
- **"Invisible to Coworkers"** — checkbox row on a soft surface band.
- **"Hide company name"** — secondary checkbox row, right-aligned.
- **Keyboard** — system keyboard intrinsic; not part of Chorus.

## Tokens in use

- **color**: "Cancel" in `sys.color.onSurface`, "Post" in accent blue. Banner on `sys.color.surfaceContainerLow` with `sys.color.onSurfaceVariant`. Checkbox row band uses the same sunken surface.
- **spacing**: hairline dividers between picker rows; `sys.layout.stack.lg` above the banner.
- **typography**: title input at `sys.typo.heading.md` bold; picker labels `sys.typo.body.md`; banner body `sys.typo.body.sm` secondary.

## Components

- [[button/text]] — Cancel + Post in the top bar.
- [[list/nav]] — channel picker row (with trailing chevron, opens a sheet).
- [[list/text]] — identity row (read-only, no chevron).
- [[form-field/input]] — title input.
- [[banner]] — open-ended-question coaching.
- [[button/check]] — "Invisible to Coworkers" + "Hide company name" toggle rows (medium size).

## Notes

- The top bar here is *not* a `navigation-bar/*` sub — it's a modal action bar (Cancel/Post). Do not retrofit `navigation-bar/page` onto it.
- The "Hide company name" checkbox is right-aligned while "Invisible to Coworkers" is left-aligned with a soft band — intentional emphasis difference; do not normalize.
- Channel picker chevron must open [[compose_channel]] as a bottom sheet — pair the trigger with the sheet per AGENTS.md composition rule.
