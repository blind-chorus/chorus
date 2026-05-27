# Radio list

Single-select picker List sub-component. Each row carries a leading 16px radio indicator; clicking commits that row's value via `onChange(value)`. Exactly one row is selected at a time. Row geometry, typography, divider, state overlays, and inward focus ring all delegate to the [family-wide rules](./list.md); this sub documents the Radio-specific leading indicator and selection contract.

**Layout inset.** `full-bleed` — Radio list is an **edge-to-edge** family. It sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. Each row pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap the list in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays and the radio indicator lands at a different inset than the section headings and other lists around it. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A radio-selectable list — single-select picker over the shared anatomy.

```preview
list/radio
---
import { useState } from 'react';
import { List } from '@blind-dsai/ui';

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

## Use cases

### With supporting text

Each row pairs its label with a secondary line under it. Reach for it when the option labels alone don't carry enough context — sort orders explained in copy, equity types with one-line definitions.

```preview
list/radio-with-supporting
---
import { useState } from 'react';
import { List } from '@blind-dsai/ui';

const [value, setValue] = useState('trending');

<List
  variant="radio"
  value={value}
  onChange={setValue}
  aria-label="Sort posts by"
  items={[
    { value: 'newest',     label: 'Newest first',  supportingText: 'Most recent posts at the top' },
    { value: 'trending',   label: 'Trending',      supportingText: 'Active threads from the last 24h' },
    { value: 'most-liked', label: 'Most liked',    supportingText: 'Highest like count this week' },
    { value: 'oldest',     label: 'Oldest first',  supportingText: 'Earliest posts at the top' },
  ]}
/>
```

### Disabled item

A single row pinned to `disabled: true` — pointer-events suppressed, the radio indicator dims with the row at `sys.state.disabled` opacity. Reach for it when an option is contextually unavailable but should still read as part of the set (a paywalled tier, a region-locked option).

```preview
list/radio-disabled-item
---
import { useState } from 'react';
import { List } from '@blind-dsai/ui';

const [value, setValue] = useState('week');

<List
  variant="radio"
  value={value}
  onChange={setValue}
  items={[
    { value: 'day',     label: 'Day' },
    { value: 'week',    label: 'Week' },
    { value: 'month',   label: 'Month' },
    { value: 'quarter', label: 'Quarter', disabled: true },
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

`selected` is unique to this sub — the leading indicator switches to `RadioFillIcon` in `primary`; row foreground stays at `onSurface` (no fill change on the row itself).

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
