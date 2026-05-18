# Badge

A small red count pill attached to a host label — a channel entry, a list row, a thumbnail corner — reporting how many unread or new items wait behind that target. Always anchored to something; never appears in isolation and never carries an interactive affordance.

## Default

The headline form — a short numeric count sitting next to its host label. Toggle Size to switch rungs; medium is the default.

```preview
badge/default
---
import { Badge } from '@blind-chorus/ui';

<Badge>3</Badge>
```

## Use cases

### Digit cases

Single digit collapses to a circle (`min-width = min-height`); two digits stretch via `padding-inline`; counts past 99 cap at `99+`. The `count` prop applies the cap automatically.

```preview
badge/digit-cases
---
import { Badge } from '@blind-chorus/ui';

<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-lg)' }}>
  <Badge count={3} />
  <Badge count={27} />
  <Badge count={142} />
</div>
```

### With host

Badge attached inside the label cell of a thumbnail `List` row — the canonical product use. The badge sits flush against the channel name (8px inline gap).

```preview
badge/with-host
---
import { Badge, List } from '@blind-chorus/ui';

const labelWithBadge = (text, count) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sys-layout-inline-md)', minWidth: 0 }}>
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    <Badge count={count} />
  </span>
);

<List
  variant="thumbnail"
  items={[
    { value: 'amazon',  label: labelWithBadge('Amazon',  142), supportingText: 'Private · My company', thumbnail: { src: '/amazon.png',  alt: 'Amazon' } },
    { value: 'samsung', label: labelWithBadge('Samsung',  27), supportingText: 'Private · My company', thumbnail: { src: '/samsung.png', alt: 'Samsung' } },
    { value: 'naver',   label: labelWithBadge('Naver',     3), supportingText: 'Public · Tech',        thumbnail: { src: '/naver.png',   alt: 'Naver' } },
  ]}
/>
```

## Appearance

Single appearance — Badge uses the **brand** token pair (`sys.color.brand` background, `sys.color.onBrand` label). Brand is one tonal step brighter than `error` and reserved for short-label attention pins. Do not reach for `error` (graver, reads as warning) or `brandContainer` (soft tint reads informational, not urgent).

## Slots

- **label** — the count. Required, single line. Numeric in the common case, `99+` cap once the count crosses 99. Non-numeric labels (`NEW`) allowed as a short single word.

## Sizes

Two rungs. Both render as a red capsule with `onError` text and `radius.full` corners — a 1-character label collapses to a perfect circle, a 2-character or `99+` label stretches into a pill.

| Property                | Medium                | Small                | Token |
|-------------------------|-----------------------|----------------------|-------|
| Min-height              | 20px                  | 16px                 | `ref.space.250` / `ref.space.200` ‡ |
| Min-width               | 20px                  | 16px                 | same as min-height |
| Padding (block × inline)| 0 × 6                 | 0 × 4                | `0` × `ref.space.75` ‡ / `0` × `sys.layout.container.2xs` |
| Radius                  | 9999px                | 9999px               | `sys.radius.full` |
| Label                   | 12 / Semibold         | 10 / Regular         | `sys.typo.label.sm` / `sys.typo.caption.sm` |

‡ `ref.space.250` (20px) and `ref.space.75` (6px) bind raw because `sys.*` does not expose those steps.

The `min-width = min-height` rule combined with `radius.full` guarantees a perfect circle for one character and a content-growing pill otherwise.

## States

Badge is presentational — no hover, pressed, focused, or disabled states of its own. State belongs to the host.

Disabled hosts may suppress the badge entirely rather than dim it.
