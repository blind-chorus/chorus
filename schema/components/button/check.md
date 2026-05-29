# Check

Option-toggle commit — a [Text Button](./text.md) with a required leading checkbox glyph that flips outline → fill on `checked`, plus an optional middle icon. Two sizes (`medium` / `small`) where the checkbox footprint is the differentiator.

**Reach for this when** an option is committed alongside the surface's main action — *Use this perk?*, *Apply offer*, *Keep me signed in*. **Skip when** the row is a form-bound checkbox input (out-of-system), the commit is a one-shot action ([Text Button](./text.md)), or the row needs a radio's single-select contract ([Radio list](../list/radio.md)).

**Layout inset.** `inline` — ships no padding outside its own chrome. Sits inside a host slot (Dialog confirmation row, BottomSheet option strip, perk-card footer) with the host paying surrounding rhythm. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Leading 24px checkbox outline + label, no optional icon. Base neutral appearance — `onSurfaceVariant` label.

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

Mirror for inverse hosts (Toast, coach-mark, snackbar). Label paints `sys.color.inverseOnSurface` against the host's `inverseSurface` fill.

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

Same row with `checked={true}` — checkbox glyph flips to the filled square. State overlays follow the label color.

```preview
button/check/checked
---
import { Button } from '@blind-dsai/ui';

<Button variant="check" size="medium" checked>
  Invisible to Coworkers
</Button>
```

### With middle icon

Optional 16px icon between checkbox and label. Use sparingly — most rows don't need it. Canonical case: an item-use row where the middle glyph names the item being consumed.

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

Three appearances. `default` is the base neutral toggle; `accent` paints the label in the brand commit colour (one option per row); `inverse` for Toast / coach-mark / snackbar hosts.

| Appearance | Background (rest) | Label color                  | When to reach for it                                                  |
|-----------|-------------------|------------------------------|-----------------------------------------------------------------------|
| `default` | `transparent`     | `sys.color.onSurfaceVariant` | The base neutral toggle — option rows next to a primary commit.       |
| `accent`  | `transparent`     | `sys.color.primary`          | One option per row that needs commit-rank emphasis.                   |
| `inverse` | `transparent`     | `sys.color.inverseOnSurface` | Inside an inverse host (Toast, coach-mark, snackbar).                 |

## Slots

- **checkbox** *(intrinsic, 24 / 16px)* — leading glyph rendered by the component based on `checked`. 24px on `medium`, 16px on `small`. Consumers do NOT pass an icon node; only `checked`.
- **icon** *(optional, 16px)* — middle context glyph between checkbox and label. Inherits label color via `currentColor`. `aria-hidden`.
- **label** *(required)* — accessible name. Single line.

## Sizes

Two rungs. Text rank identical (`sys.typo.label.sm`, 12) — the visual difference comes from the checkbox footprint.

| Size   | Min-height | Padding (block × inline) | Label                    | Checkbox | Icon | Slot gap |
|--------|------------|--------------------------|--------------------------|----------|------|----------|
| medium | 40         | `xs` × `xs`              | `sys.typo.label.sm` (12) | 24       | 16   | 4        |
| small  | 32         | `2xs` × `xs`             | `sys.typo.label.sm` (12) | 16       | 16   | 4        |

## States

Same recipe as [Text Button](./text.md#states): rest, hovered, pressed, disabled. Hover/pressed overlays paint `--button-check-label` at `sys.state.hover` / `sys.state.pressed`. Disabled drops container opacity to `sys.state.disabled` and suppresses the focus ring.

## Focus indicator

Standard `:focus-visible` ring. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
button/check/focused
---
import { Button } from '@blind-dsai/ui';

<Button variant="check" state="focused">Invisible to Coworkers</Button>
```

## Accessibility

Toggle button — sets `aria-pressed={checked}` automatically. Do NOT model as a checkbox input (no form value, no name/value pair). For a form-bound checkbox, reach for `<input type="checkbox">` (out-of-system at present).
