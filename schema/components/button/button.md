# Button

The standard inline action surface. Two independent axes: **size** (`large` / `medium` / `small`) chosen by the surrounding surface, **appearance** (`primary` / `secondary` / `outlined` / `tertiary`) by the action's emphasis.

## Intent

Use Button for inline commits that belong to the surrounding content — form submission, row actions, dialog confirms. Prefer [FAB](./fab.md) when the action is the canvas's single headline commit and must stay reachable while content scrolls.

## Primary

The single highest-emphasis action on a view. Use **one per view** — Save, Continue, Confirm, Submit.

```preview
button/primary
---
import { Button } from '@blind-chorus/ui';

<Button appearance="primary" size="large">
  Primary action
</Button>
```

## Secondary

Lower-emphasis tier paired against `primary` — opposing actions (Cancel beside Save) or quieter alternatives. Safe to repeat on a single view.

```preview
button/secondary
---
import { Button } from '@blind-chorus/ui';

<Button appearance="secondary" size="large">
  Secondary action
</Button>
```

## Outlined

Bordered blue-on-transparent Button paired beside `primary` as a **supplementary** option (*See more*, *Learn more*, *Skip for now*). For opposing paths use `secondary` instead.

```preview
button/outlined
---
import { Button } from '@blind-chorus/ui';

<Button appearance="outlined" size="large">
  See more
</Button>
```

## Tertiary

Neutral grey ghost — transparent at rest, label in `sys.color.onSurfaceVariant`. Reads as a button only on hover.

```preview
button/tertiary
---
import { Button } from '@blind-chorus/ui';

<Button appearance="tertiary" size="large">
  Tertiary action
</Button>
```

## Use cases

Compositional recipes that hold across every appearance.

### With icon

A single optional icon rendered **before** the label — a context glyph (`+` for Add, `↓` for Download). Inherits label color via `currentColor` (`sys.icon.lg` 24 on `large`, `sys.icon.md` 16 on `medium`/`small`). The standard Button does not carry a trailing icon.

```preview
button/icon-leading
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button
  appearance="primary"
  size="large"
  leadingIcon={<AddIcon />}
>
  Add item
</Button>
```

### Full width

Button stretched to fill the surrounding column (`width: 100%`). Default mobile shape for `large`/`medium` primary commits — hero surfaces, empty states, onboarding, login. On wider surfaces fall back to content-sized.

```preview
button/full-width
---
import { Button } from '@blind-chorus/ui';

<Button
  appearance="primary"
  size="large"
  fullWidth
>
  Confirm
</Button>
```

### Group

Adjacent Buttons share an **8px** gap (`sys.layout.inline.md` horizontal / `sys.layout.stack.xs` vertical). Horizontal: outlined left, primary right. Vertical: primary top, secondary below. Groups of more than two fall back to the surrounding surface's rhythm.

```preview
button/button-group
---
import { Button } from '@blind-chorus/ui';

<div style={{ display: 'flex', gap: 8 }}>
  <Button appearance="outlined" size="large">
    See more
  </Button>
  <Button appearance="primary" size="large">
    Confirm
  </Button>
</div>
```

```preview
button/button-group-vertical
---
import { Button } from '@blind-chorus/ui';

<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  <Button appearance="primary" size="large">
    Save
  </Button>
  <Button appearance="secondary" size="large">
    Cancel
  </Button>
</div>
```

### Truncation

When the column is narrower than the label's natural width, the label clips with an ellipsis (`text-overflow: ellipsis; white-space: nowrap`) instead of wrapping. Buttons are single-line by contract.

```preview
button/truncation
---
import { Button } from '@blind-chorus/ui';

<Button
  appearance="primary"
  size="large"
  fullWidth
  truncate
>
  A very long label that should truncate gracefully
</Button>
```

### Focus indicator

Standard keyboard-focus ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)).

```preview
button/focused
---
import { Button } from '@blind-chorus/ui';

<Button appearance="primary" size="large" state="focused">
  Primary action
</Button>
```

## Appearance

Four appearances cover the commit-emphasis ladder. A **destructive** flavor swaps the `primary` family → `error` family across whichever appearance and is reserved for irreversible actions. Each specimen above carries a **Disabled** toggle.

| Appearance  | Background    | Border (1px)            | Label color                       | Notes                                                                 |
|-------------|---------------|--------------------------|-----------------------------------|-----------------------------------------------------------------------|
| `primary`   | `sys.color.primary`            | —                        | `sys.color.onPrimary`             | Single highest-emphasis action; one per view. |
| `secondary` | `sys.color.secondaryContainer` | —                        | `sys.color.onSecondaryContainer`  | Lower-emphasis tier; covers opposing-action and quieter-alternative roles. |
| `outlined`  | `transparent`                  | `sys.color.primary` (`sys.borderWidth.hairline`) | `sys.color.primary`               | Supplementary option beside `primary` (*See more*, *Learn more*). |
| `tertiary`  | `transparent`                  | —                        | `sys.color.onSurfaceVariant`      | Lowest-emphasis neutral ghost for quiet inline actions. |

## Slots

- **label** — accessible name. Required, single line; long labels truncate (see [Truncation](#truncation)).
- **leadingIcon** (optional) — context glyph before the label. Inherits the label colour via `currentColor` per the family icon-colour rule below.

The standard Button does not carry a trailing icon.

### Icon colour inheritance (family-wide)

**Every Button family component paints icon glyphs in the label / foreground colour via `currentColor`.** The SVG must declare `fill="currentColor"` (or `stroke="currentColor"`) with no hardcoded colour. For icon-only forms the glyph adopts the parent's foreground role.

## Sizes

| Size     | Padding (block × Inline)                                            | Gap (icon ↔ label)            | Min-height               | Min-width                  | Radius                | Label                              | Icon                |
|----------|---------------------------------------------------------------------|-------------------------------|--------------------------|----------------------------|-----------------------|------------------------------------|---------------------|
| `large`  | `sys.layout.container.xs` × `sys.layout.container.md` (8 × 16)      | `sys.layout.inline.md` (8)    | `ref.space.600` (48) ‡   | **160** ⁂                  | `sys.radius.md` (8)   | `sys.typo.label.lg` (16, semibold) | `sys.icon.lg` (24)  |
| `medium` | `sys.layout.container.xs` × `sys.layout.container.md` (8 × 16)      | `sys.layout.inline.md` (8)    | `ref.space.500` (40) ‡   | **160** ⁂                  | `sys.radius.md` (8)   | `sys.typo.label.md` (14, semibold) | `sys.icon.md` (16)  |
| `small`  | `sys.layout.container.2xs` × `sys.layout.container.sm` (4 × 12)     | `sys.layout.inline.sm` (4)    | `ref.space.400` (32) ‡   | **160** ⁂                  | `sys.radius.sm` (4) † | `sys.typo.label.md` (14, semibold) | `sys.icon.md` (16)  |

† **Token gap:** small Button's intended radius is 6px; implementation falls back to `sys.radius.sm` (4) until a 6px step lands.

‡ **min-height** binds to raw `ref.space.*` — `sys.*` does not currently expose 32 / 40 / 48 px steps.

⁂ **Min-width 160px** is fixed across sizes so a row of buttons reads as one composition. `fullWidth` and [Truncation](#truncation) override the floor.

## States

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) drawn as a `position: absolute` pseudo-element so it never affects layout. Trigger: `:focus-visible`.

## Optical alignment

Transparent-rest forms ([Icon Button](./icon.md), [Text Button](./text.md)) apply negative-margin compensation so the glyph/label bounding box — not the invisible chrome — is the layout box. Filled forms (standard Button, [FAB](./fab.md)) align by chrome.

## Sub-components

Additional Button forms:

- **[FAB](./fab.md)** — surface-elevated pill anchored to the canvas; commit stays reachable while content scrolls.
- **[Icon Button](./icon.md)** — 40 × 40 transparent capsule, glyph-only. Requires `aria-label`.
- **[Text Button](./text.md)** — link-shaped commit at the 16/Semibold rung; reads as inline `primary` type at rest.
- **[Toolbar Button](./toolbar.md)** — 32px capsule for dense inline actions. Chrome shared with [Filter chip](../chip/filter.md).
- **[Toggle Button](./toggle.md)** — reversible commit at the Toolbar footprint. Follow ↔ Following.
