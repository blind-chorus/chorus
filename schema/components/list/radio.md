# Radio List

Single-select picker List sub-component. Each row carries a leading 16px radio indicator; clicking commits that row's value via `onChange(value)`. Exactly one row is selected at a time.

> Per the family-wide rules in [`list.md`](./list.md): row geometry, typography, divider, state overlays, and inward focus ring all delegate to the shared anatomy. This sub documents the Radio-specific leading indicator and selection contract.

## Default

A radio-selectable list — single-select picker over the shared anatomy.

```preview
list/radio
---
import { useState } from 'react';
import { List } from '@blind-chorus/ui';

const [value, setValue] = useState('week');

<List
  variant="radio"
  value={value}
  onChange={setValue}
  items={[
    { value: 'day',     label: 'Day' },
    { value: 'week',    label: 'Week' },
    { value: 'month',   label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year',    label: 'Year' },
  ]}
/>
```

## Slots

- **container** — outer vertical stack (delegates to family).
- **row** — single list item; whole row is the click target.
- **leading** — required. 16×16 radio indicator: `RadioIcon` (outline) at rest, `RadioFillIcon` (primary) when selected. Decorative.
- **label** — primary row text. 16px / Regular / `onSurface`.
- **supportingText** *(optional)* — secondary line under label.

## States

**Selected** is unique to this sub — the leading indicator switches to `RadioFillIcon` in `primary`; row foreground unchanged.

| State      | Overlay opacity      | Additional |
|------------|----------------------|------------|
| `default`  | —                    | Outline indicator. |
| `hovered`  | `sys.state.hover`    | `:hover`. |
| `pressed`  | `sys.state.pressed`  | `:active`. |
| `selected` | —                    | Indicator → `RadioFillIcon` in `primary`. |
| `disabled` | overlay suppressed   | Row at `sys.state.disabled` opacity; indicator dims with the row. |

## Focus indicator

Inward 3-layer ring inside the row's bounds — see [Focus indicator](./list.md#cross-sub-contract). The row is the keyboard target, not the indicator.

## Behavior

- **Keyboard navigation.** Arrow ↑ / ↓ moves focus; **Space** and **Enter** commit; Home / End jump to first / last.
- **Selection model.** Single-select; selecting a row deselects the previous. Controlled via `value` + `onChange`.
- **Row click target.** Whole row is clickable; the indicator is never a separate hit target.
