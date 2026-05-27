# Status tag

A small inline status pill — a tonal mark sized for the trailing edge of a row label. 10px text, 4px inline / 2px block padding, `sys.radius.xs` corners. Two appearances: `neutral` (quiet informational default) and `error` (rejection / blocked). Decorative — never interactive.

**Reach for this when** a row label needs a short state annotation inline — "pending" next to a user channel, "rejected" next to a failed approval, "draft" next to an in-progress post. **Skip when** the state is the row's primary content (use [List/text](../list/text.md) with `supportingText`), when the mark must be tappable (host row owns the click target), or inside a chip row (use [chip/filter](../chip/filter.md) or [chip/tag](../chip/tag.md)).

**Layout inset.** `inline` — StatusTag ships no padding outside its pill chrome. Sits next to a host label with `sys.layout.container.2xs` (4px) inline gap supplied by the host column.

## Default

The `neutral` appearance — a faint scrim of the inverse tone (`black.200` in light, `white.200` in dark) with `onSurfaceVariant` foreground. The quiet informational state.

```preview
status-tag/default
---
import { StatusTag } from '@blind-dsai/ui';

<StatusTag>Pending</StatusTag>
```

## Error

The `error` appearance — `errorContainer` fill with an `onErrorContainer` foreground. The rejection / blocked / failed state.

```preview
status-tag/error
---
import { StatusTag } from '@blind-dsai/ui';

<StatusTag appearance="error">Rejected</StatusTag>
```

## Use cases

### On a list row

The canonical pairing — a `list/thumbnail` row whose label carries a trailing StatusTag. Tag sits next to the label text with `sys.layout.container.2xs` (4px) inline gap, vertically centred against the label's optical mid-line. The gap belongs to the label column; StatusTag carries no outer margin.

```preview
status-tag/list-row
---
import { List, StatusTag, Thumbnail } from '@blind-dsai/ui';

<List
  variant="thumbnail"
  items={[
    {
      value: 'ch-2',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sys-layout-container-2xs)' }}>
          User channel 2
          <StatusTag>Pending</StatusTag>
        </span>
      ),
      thumbnail: { alt: 'User channel 2', shape: 'circle' },
    },
    {
      value: 'ch-3',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sys-layout-container-2xs)' }}>
          User channel 3
          <StatusTag appearance="error">Rejected</StatusTag>
        </span>
      ),
      thumbnail: { alt: 'User channel 3', shape: 'circle' },
    },
  ]}
/>
```

### Inline in a paragraph

A StatusTag tucked inline inside a paragraph or a feed-post header. Same 4px gap rule: the host column owns the whitespace, StatusTag stays a bare pill.

```preview
status-tag/inline
---
import { StatusTag } from '@blind-dsai/ui';

<p style={{ font: '14px var(--sys-typo-fontFamily)', color: 'var(--sys-color-onSurface)' }}>
  Shared document <StatusTag>Pending</StatusTag> is awaiting review.
</p>
```

## Slots

- **container** — tonal pill. 4px inline / 2px block padding, `sys.radius.xs` corners. Carries `role="status"` so the announcement reads as a state update.
- **label** — tag text. 10px / Semibold / appearance-bound foreground. Short phrase (≤ 6 chars Latin, ≤ 4 CJK); `white-space: nowrap`.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill + foreground per appearance, 4px inline / 2px block padding, `sys.radius.xs` corners |
| label     | `ref.fontSize.125` (10px) / Semibold, 1.2 line-height |
| gap from host label | `sys.layout.container.2xs` (4px) — paid by the host column, NOT by StatusTag |

## Appearance

| Appearance | Container fill                                                              | Foreground                       | When to reach                                                                  |
|------------|-----------------------------------------------------------------------------|----------------------------------|-------------------------------------------------------------------------------|
| `neutral`  | `ref.palette.black.200` (light) / `ref.palette.white.200` (dark)            | `sys.color.onSurfaceVariant`     | Quiet informational default — visible on every surface tier. In-progress / awaiting states — "pending", "draft", "queued", "in review". |
| `error`    | `sys.color.errorContainer`                                                  | `sys.color.onErrorContainer`     | Rejection / blocked / failed state. Use sparingly. |

## States

StatusTag is decorative and carries **no** lifecycle states (no hover, pressed, focus, or disabled paint). If the state needs to be tappable, the host row is the interactive surface.

## Behavior

- **Decorative only.** Never a `<button>`, `<a href>`, or focusable element. The host row owns the click target.
- **Inline next to a label.** The host label column carries a 4px gap to StatusTag; StatusTag itself has no outer margin.
- **No wrap.** Container is `inline-block` with `white-space: nowrap`. If the phrase is long, the label is wrong — not the pill.
- **Accessibility.** Container carries `role="status"` so screen readers announce the tag as a state update rather than as an unlabelled span.
