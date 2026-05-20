# Check Button

Option-toggle commit surface — a [Text Button](./text.md) with a required leading checkbox glyph that flips outline → fill with the `checked` state, plus an optional middle icon. Use when an option is committed alongside (or selected for) the surface's main action — the canonical Blind use is an in-app item-use affordance ("Use this perk?") that toggles state before the primary commit fires. Two sizes (`medium` / `small`) where the **checkbox footprint** is the visual differentiator: medium pairs a 24px checkbox with 12-rank text, small drops the checkbox to 16px alongside the same 12-rank text. Appearances and state behavior mirror Text Button; the optional middle icon stays at 16px on both rungs.

## Default

Leading 24px checkbox outline + label, no optional icon. The base neutral appearance — `onSurfaceVariant` label.

```preview
button/check/default
---
import { useState } from 'react';
import { Button } from '@blind-dsai/ui';

function Demo() {
  const [checked, setChecked] = useState(false);
  return (
    <Button
      variant="check"
      size="medium"
      checked={checked}
      onClick={() => setChecked((v) => !v)}
    >
      Invisible to Coworkers
    </Button>
  );
}

<Demo />
```

## Accent

Brand-blue label — `sys.color.primary`. Use sparingly; never two accent Check Buttons in the same row.

```preview
button/check/accent
---
import { Button } from '@blind-dsai/ui';

<Button variant="check" size="medium" appearance="accent" checked>
  Apply offer
</Button>
```

## Inverse

Mirror appearance for use inside an inverse host (Toast, coach-mark, snackbar). Label paints in `sys.color.inverseOnSurface` so it reads against the host's `inverseSurface` fill.

```preview
button/check/inverse
---
import { Button } from '@blind-dsai/ui';

<Button variant="check" size="medium" appearance="inverse" checked>
  Keep me signed in
</Button>
```

## Use cases

### Checked

The same row with `checked={true}` — checkbox glyph flips to the filled square. State overlays follow the label color.

```preview
button/check/checked
---
import { Button } from '@blind-dsai/ui';

<Button variant="check" size="medium" checked>
  Invisible to Coworkers
</Button>
```

### With middle icon

Optional 16px icon between checkbox and label. Use sparingly — most rows do not need it. Canonical case is an item-use row where the middle glyph names the item being consumed.

```preview
button/check/icon
---
import { Button } from '@blind-dsai/ui';
import { BookmarkFillIcon } from '@blind-dsai/ui/icons';

<Button variant="check" size="medium" icon={<BookmarkFillIcon />} checked>
  Use 1 promotion link
</Button>
```

## Appearance

Three appearances. `default` is the base neutral toggle; `accent` paints the label in the brand commit colour for one option per row; `inverse` swaps to the inverse cluster for use inside Toast / coach-mark / snackbar hosts.

| Appearance | Background (rest) | Label color                  | When to reach for it                                                  |
|-----------|-------------------|------------------------------|-----------------------------------------------------------------------|
| `default` | `transparent`     | `sys.color.onSurfaceVariant` | The base neutral toggle — option rows next to a primary commit.       |
| `accent`  | `transparent`     | `sys.color.primary`          | One option per row that needs commit-rank emphasis.                   |
| `inverse` | `transparent`     | `sys.color.inverseOnSurface` | Inside an inverse host (Toast, coach-mark, snackbar).                 |

## Slots

- **checkbox** *(intrinsic, 24 / 16px)* — leading glyph rendered by the component based on the `checked` prop. 24px on `medium`, 16px on `small`. Consumers do NOT pass an icon node here; only `checked`.
- **icon** *(optional, 16px)* — middle context glyph between checkbox and label. 16px on every rung. Inherits the label color via `currentColor`. `aria-hidden`.
- **label** *(required)* — accessible name. Single line.

## Sizes

Two rungs. Text rank is identical (`sys.typo.label.sm`, 12) — the visual size difference comes from the checkbox footprint.

| Size   | Min-height | Padding (block × inline) | Label                    | Checkbox | Icon | Slot gap |
|--------|------------|--------------------------|--------------------------|----------|------|----------|
| medium | 40         | `xs` × `xs`              | `sys.typo.label.sm` (12) | 24       | 16   | 4        |
| small  | 32         | `2xs` × `xs`             | `sys.typo.label.sm` (12) | 16       | 16   | 4        |

## States

Same recipe as [Text Button](./text.md#states): rest, hovered, pressed, disabled. Hover / pressed overlays paint `--button-check-label` at `sys.state.hover` / `sys.state.pressed`. Disabled drops container opacity to `sys.state.disabled` and suppresses the focus ring.

## Focus indicator

Standard `:focus-visible` ring. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## ARIA

Toggle button — the component sets `aria-pressed={checked}` automatically. Do NOT model as a checkbox input (no associated form value, no name/value pair). For a form-bound checkbox, reach for `<input type="checkbox">` (out-of-system at present).
