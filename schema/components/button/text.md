# Text Button

The link-shaped commit surface — reads as text at rest, paints a button-like hover overlay and standard focus ring when interacted with. Use inline next to typographic content where the action commits ("Skip"/"Done" on a [Page](../navigation-bar/page.md) bar, "Edit" beside a row title). For navigation use the bare [Text link](../../DESIGN.md#text-links).

## Default

Neutral label (`onSurfaceVariant`) in a transparent capsule — the canonical Text Button. Quiet enough to sit next to typographic content without claiming commit-rank attention.

```preview
button/text/default
---
import { Button } from '@blind-chorus/ui';

<Button variant="text">Not now</Button>
```

## Accent

Brand-blue label (`primary`) — the inline commit affordance. Use sparingly; never two in the same row.

```preview
button/text/accent
---
import { Button } from '@blind-chorus/ui';

<Button variant="text" appearance="accent">Skip</Button>
```

## Inverse

Mirror for use inside an inverse host (Toast, coach-mark, snackbar). Label paints in `inverseOnSurface` so it reads against the host's `inverseSurface` fill.

```preview
button/text/inverse
---
import { Button } from '@blind-chorus/ui';

<Button variant="text" appearance="inverse">Undo</Button>
```

## Use cases

### With leading icon

16px (`sys.icon.md`) glyph before the label with a 4px (`sys.layout.inline.sm`) gap — fixed across rungs. Use for directional cues (back chevron, refresh).

```preview
button/text/leading-icon
---
import { Button, BackwardIcon } from '@blind-chorus/ui';

<Button variant="text" leadingIcon={<BackwardIcon />}>Back</Button>
```

### With trailing icon

Destination glyph after the label at the same icon rung. Use when the affordance points downstream — chevron-right "Continue", external-link "Open in new tab".

```preview
button/text/trailing-icon
---
import { Button, ForwardIcon } from '@blind-chorus/ui';

<Button variant="text" trailingIcon={<ForwardIcon />}>Continue</Button>
```

### Group

Horizontally-grouped Text Buttons — common on [Page](../navigation-bar/page.md) bar trailing actions. Optical alignment is on by default ([see below](#optical-alignment)), so the chrome-to-chrome gap **is** the visible label-to-label distance. Row gap pairs with size:

- **`medium`** and **`small` groups** — **16px** apart (`sys.layout.inline.xl`).
- **`xsmall` groups** — **12px** apart (`sys.layout.inline.lg`).

```preview
button/text/group
---
import { Button } from '@blind-chorus/ui';

<div style={{ display: 'inline-flex', gap: 'var(--sys-layout-inline-md)' }}>
  <Button variant="text">Cancel</Button>
  <Button variant="text" appearance="accent">Save</Button>
</div>
```

### Focus indicator

Standard ring.

```preview
button/text/focused
---
import { Button } from '@blind-chorus/ui';

<Button variant="text" state="focused">Skip</Button>
```

## Appearance

Three appearances. Default is the base neutral inline action; `accent` paints the label in the brand commit colour for the row's one commit; `inverse` swaps to the inverse cluster for use inside Toast / coach-mark / snackbar hosts.

| Appearance  | Background (rest) | Label color                       | When to reach for it                                                                 |
|-------------|-------------------|-----------------------------------|--------------------------------------------------------------------------------------|
| `default`   | `transparent`     | `sys.color.onSurfaceVariant`      | The base inline action — "Not now" tails, secondary inline trail commits. |
| `accent`    | `transparent`     | `sys.color.primary`               | Brand-blue inline commit — "Skip" / "Done", "Edit". One per row. |
| `inverse`   | `transparent`     | `sys.color.inverseOnSurface`      | For use inside an inverse host (Toast action, coach-mark). |

A **destructive** flavor swaps the label to the `error` family across every appearance.

## Slots

- **label** — accessible name. Required, single line.
- **leadingIcon** (optional) — context glyph before the label. 16px on every rung (`sys.icon.md`). Inherits label colour via `currentColor`. `aria-hidden`.
- **trailingIcon** (optional) — directional/destination glyph after the label. Same footprint and inheritance as leading. Use one or the other per call site.

## Anatomy

| Property              | Token                                                  |
|-----------------------|---------------------------------------------------------|
| Background (rest)     | `transparent`                                           |
| Border                | none                                                    |
| Label color           | per appearance (`default` / `accent` / `inverse`)       |
| Icon color            | `currentColor` (inherits the label colour — see below)  |
| Hover background      | label color at `sys.state.hover` (8%) opacity           |
| Pressed background    | label color at `sys.state.pressed` (16%) opacity        |

Icon glyphs inherit the label colour via `currentColor`. The capsule appears only on hover/pressed/focus.

## Sizes

Three rungs, largest → smallest. `medium` (default) matches [Icon Button](./icon.md)'s 40-tall footprint. `small` and `xsmall` for denser call-sites.

| Size      | Min-height       | Padding (block × inline)        | Slot gap                          | Label                          | Icon                          |
|-----------|------------------|----------------------------------|-----------------------------------|--------------------------------|-------------------------------|
| `medium`  | 40px (`ref.space.500`) ‡ | 8 × 8 (`sys.layout.container.xs` × `sys.layout.container.xs`) | 4px (`sys.layout.inline.sm`)   | 16 / Semibold (`sys.typo.heading.sm`) | 16px (`sys.icon.md`) |
| `small`   | 32px (`ref.space.400`) ‡ | 4 × 8 (`sys.layout.container.2xs` × `sys.layout.container.xs`) | 4px (`sys.layout.inline.sm`)   | 14 / Semibold (`sys.typo.label.md`)   | 16px (`sys.icon.md`) |
| `xsmall`  | 24px (`ref.space.300`) ‡ | 4 × 8 (`sys.layout.container.2xs` × `sys.layout.container.xs`) | 4px (`sys.layout.inline.sm`)   | 12 / Semibold (`sys.typo.label.sm`)   | 16px (`sys.icon.md`) |

‡ **min-height** binds to raw `ref.space.*` — `sys.*` does not expose 24/32/40 px steps.

**Icon size and slot gap stay fixed across rungs** (16px / 4px). Only label rank and capsule height shrink.

## States

The overlay paints the **label color** over the transparent container at the state's opacity.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Transparent capsule, label at the appearance's color.                       |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Label at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)). Trigger: `:focus-visible`.

## Behavior

- **Reach for this when** the action is inline next to typographic content and commits ("Skip", "Edit", "Resend").
- **Skip when** the affordance navigates — use [Text link](../../DESIGN.md#text-links).

## Optical alignment

Transparent at rest, so the eye locks onto the label's text bounding box. Default rendering negates per-rung padding via `margin: calc(-1 × padding-block) calc(-1 × padding-inline)` so the visible **label box is the layout box**. Consumers do not opt in.

| Where it lands | Effect |
|---|---|
| At a header / card / footer's content rail | Label flush with the rail; hover capsule bleeds outward. |
| Inside a horizontal Text Button group | Chrome-to-chrome gap *is* the visible label-to-label distance. |
| Inline with running text | Label baseline aligns with surrounding type. |
