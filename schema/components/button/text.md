# Text

The link-shaped commit surface — reads as text at rest, paints a button-like hover overlay and focus ring on interaction. Two axes: **appearance** (`default` / `accent` / `onPrimary` / `inverse`), **size** (`medium` / `small` / `xsmall`).

**Reach for this when** the action is inline next to typographic content and commits — *Skip*, *Edit*, *Resend*, a section's trailing *See all*. **Skip when** the affordance navigates — use [Text link](../../DESIGN.md#text-links).

**Layout inset.** inline — optical alignment is on by default, so the visible label box *is* the layout box; chrome bleeds outward only on hover.

## Default

Neutral label (`onSurfaceVariant`) in a transparent capsule — the base inline action ("Not now", trailing dismissals).

```preview
button/text/default
---
import { Button } from '@blind-dsai/ui';

<Button variant="text">Not now</Button>
```

## Use cases

### Accent

Brand-blue label (`primary`) — the inline commit. Reach for `accent` when the button reads as a navigational link (*See all*, *Follow*, *View details*).

```preview
button/text/accent
---
import { Button } from '@blind-dsai/ui';

<Button variant="text" appearance="accent">Skip</Button>
```

### On primary

Always-white label on top of a `primary`-filled host (Tooltip `default`). Theme-stable.

```preview
button/text/on-primary
---
import { Button } from '@blind-dsai/ui';

<Button variant="text" appearance="onPrimary">Got it</Button>
```

### Inverse

For inverse hosts (Toast, coach-mark, snackbar). Label paints `inverseOnSurface`; tokens flip with theme.

```preview
button/text/inverse
---
import { Button } from '@blind-dsai/ui';

<Button variant="text" appearance="inverse">Undo</Button>
```

### With leading icon

16px (`sys.icon.md`) glyph before the label at 4px gap — fixed across rungs.

```preview
button/text/leading-icon
---
import { Button, ChevronLeftIcon } from '@blind-dsai/ui';

<Button variant="text" leadingIcon={<ChevronLeftIcon />}>Back</Button>
```

### With trailing icon

Destination glyph after the label — chevron-right *Continue*, external-link *Open in new tab*.

```preview
button/text/trailing-icon
---
import { Button, ChevronRightIcon } from '@blind-dsai/ui';

<Button variant="text" trailingIcon={<ChevronRightIcon />}>Continue</Button>
```

### Dropdown

Disclosure trigger: the label reads as the **current value**, the trailing chevron flips with state — `ChevronDownIcon` at rest, `ChevronUpIcon` while the menu is open. Pair `aria-haspopup` + `aria-expanded` on the trigger and portal the menu so it escapes any clipping ancestor; never freeze the chevron when the menu is open.

Default rung is `xsmall` for inline / toolbar dropdowns (Size selectors, filter chrome, header trailing). Step up to `small` or `medium` when the dropdown is the row's primary commit.

```preview
button/text/dropdown
---
import { useState } from 'react';
import { Button } from '@blind-dsai/ui';
import { ChevronDownIcon, ChevronUpIcon } from '@blind-dsai/ui/icons';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Button
      variant="text"
      size="xsmall"
      trailingIcon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
    >
      Medium
    </Button>
  );
}
```

### Group

Optical alignment means chrome-to-chrome gap **is** the visible label-to-label distance. Row gap: `medium`/`small` → 16px (`sys.layout.inline.xl`); `xsmall` → 12px (`sys.layout.inline.lg`).

```preview
button/text/group
---
import { Button } from '@blind-dsai/ui';

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
import { Button } from '@blind-dsai/ui';

<Button variant="text" state="focused">Skip</Button>
```

## Slots

- **label** — accessible name. Required, single line.
- **leadingIcon** (optional) — context glyph before the label. 16px on every rung. Inherits via `currentColor`.
- **trailingIcon** (optional) — directional/destination glyph after the label.

## Appearance

A **destructive** flavor swaps the label to `error` across every appearance.

| Appearance  | Background (rest) | Label color                       | When to reach for it                                                                 |
|-------------|-------------------|-----------------------------------|--------------------------------------------------------------------------------------|
| `default`   | `transparent`     | `sys.color.onSurfaceVariant`      | Base inline action — "Not now", secondary inline trail commits. |
| `accent`    | `transparent`     | `sys.color.primary`               | Brand-blue inline commit — "Skip", "See all". One per row. |
| `onPrimary` | `transparent`     | `sys.color.onPrimary`             | On a `primary`-filled host (Tooltip `default`). Theme-stable. |
| `inverse`   | `transparent`     | `sys.color.inverseOnSurface`      | Inside an inverse host (Toast, coach-mark). |

## Sizes

Three rungs. `medium` matches [Icon Button](./icon.md)'s 40-tall footprint; `small` / `xsmall` for denser call-sites. Icon and slot gap stay fixed (16px / 4px); only label rank and capsule height shrink.

| Size      | Min-height       | Padding (block × inline)        | Slot gap                          | Label                          | Icon                          |
|-----------|------------------|----------------------------------|-----------------------------------|--------------------------------|-------------------------------|
| `medium`  | 40px (`ref.space.500`) ‡ | 8 × 8 (`sys.layout.container.xs` × `sys.layout.container.xs`) | 4px (`sys.layout.inline.sm`)   | 16 / Semibold (`sys.typo.heading.sm`) | 16px (`sys.icon.md`) |
| `small`   | 32px (`ref.space.400`) ‡ | 4 × 8 (`sys.layout.container.2xs` × `sys.layout.container.xs`) | 4px (`sys.layout.inline.sm`)   | 14 / Semibold (`sys.typo.label.md`)   | 16px (`sys.icon.md`) |
| `xsmall`  | 24px (`ref.space.300`) ‡ | 4 × 8 (`sys.layout.container.2xs` × `sys.layout.container.xs`) | 4px (`sys.layout.inline.sm`)   | 12 / Semibold (`sys.typo.label.sm`)   | 16px (`sys.icon.md`) |

‡ `min-height` binds raw `ref.space.*` — `sys.*` does not expose 24/32/40 px steps.

## States

Overlay paints the **label color** over the transparent container.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Transparent capsule.                                                        |
| `hovered`  | `sys.state.hover` (8%)     | `:hover`.                                                                   |
| `pressed`  | `sys.state.pressed` (16%)  | `:active`.                                                                  |
| `disabled` | overlay suppressed         | Label at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard outward ring. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Optical alignment

Transparent at rest — the eye locks onto the label. Default rendering negates per-rung padding via `margin: calc(-1 × padding-block) calc(-1 × padding-inline)` so the visible **label box is the layout box**. Not opt-in.
