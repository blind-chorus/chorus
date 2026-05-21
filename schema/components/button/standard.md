# Standard

The default inline action surface — a labelled commit that lives inline with content (form submit, dialog confirm, row action). Two independent axes: **size** (`large` / `medium` / `small`) chosen by the surrounding surface, **appearance** (`primary` / `secondary` / `outlined` / `tertiary`) by the action's emphasis. Reach for [FAB](./fab.md) when the commit must float above scrolling content, [Text Button](./text.md) when the rung is body-text-sized, or [Toolbar Button](./toolbar.md) inside a dense toolbar row.

## Default

The single highest-emphasis action on a view — `appearance="primary"`. Use **one per view** — Save, Continue, Confirm, Submit.

```preview
button/standard/default
---
import { Button } from '@blind-dsai/ui';

<Button appearance="primary" size="large">
  Primary action
</Button>
```

## Secondary

Lower-emphasis tier paired against `primary` — opposing actions (Cancel beside Save) or quieter alternatives. Safe to repeat on a single view.

```preview
button/standard/secondary
---
import { Button } from '@blind-dsai/ui';

<Button appearance="secondary" size="large">
  Secondary action
</Button>
```

## Outlined

Bordered blue-on-transparent Button paired beside `primary` as a **supplementary** option (*See more*, *Learn more*, *Skip for now*). For opposing paths use `secondary` instead.

```preview
button/standard/outlined
---
import { Button } from '@blind-dsai/ui';

<Button appearance="outlined" size="large">
  See more
</Button>
```

## Tertiary

Neutral grey ghost — transparent at rest, label in `sys.color.onSurfaceVariant`. Reads as a button only on hover.

```preview
button/standard/tertiary
---
import { Button } from '@blind-dsai/ui';

<Button appearance="tertiary" size="large">
  Tertiary action
</Button>
```

## Use cases

Compositional recipes that hold across every appearance.

### With leading icon

A single optional icon rendered **before** the label — a context glyph (`+` for Add, `↓` for Download). Inherits label color via `currentColor` (`sys.icon.lg` 24 on `large`, `sys.icon.md` 16 on `medium`/`small`). The Standard Button does not carry a trailing icon.

```preview
button/standard/with-leading-icon
---
import { Button } from '@blind-dsai/ui';
import { AddIcon } from '@blind-dsai/ui/icons';

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
button/standard/full-width
---
import { Button } from '@blind-dsai/ui';

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
button/standard/group
---
import { Button } from '@blind-dsai/ui';

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
button/standard/group-vertical
---
import { Button } from '@blind-dsai/ui';

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
button/standard/truncation
---
import { Button } from '@blind-dsai/ui';

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
button/standard/focused
---
import { Button } from '@blind-dsai/ui';

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
- **leadingIcon** (optional) — context glyph before the label. Inherits the label colour via `currentColor` — see [Button → Icon colour inheritance](./button.md#icon-colour-inheritance).

The Standard Button does not carry a trailing icon.

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

## Behavior

The Standard Button is a chrome-aligned filled form — no optical compensation, layout by chrome (see [Button → Optical alignment](./button.md#optical-alignment)). Long labels truncate inline rather than wrapping; the min-width floor (160px) keeps a row of buttons reading as one composition unless `fullWidth` or `truncate` overrides it.
