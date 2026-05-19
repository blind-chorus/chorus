# Badge

A small brand-tone indicator attached to a host label — a channel entry, a list row, a thumbnail corner — flagging unread / new activity behind that target. Two top-level **types** share the same brand-tone fill and `radius.full` corner: **Numeric** (a labelled count pill, the canonical badge) and **Dot** (a labelless update dot, the corner activity flag used by [Thumbnail](../thumbnail/thumbnail.md)). Always anchored to a host; never appears in isolation and never carries an interactive affordance.

## Intent

Use Badge to signal *new or unread activity* on a host — a count, dot, or short alert label that pulls the eye back to attention-worthy state. Prefer [Tag](../chip/tag.md) when the marker describes the content (category, status) rather than flagging recent change.

## Numeric

The labelled form — a short count sitting next to its host label. Two rungs (`medium` / `small`); a 1-character label collapses to a perfect circle, a 2-character or `99+` label stretches into a pill. The `count` prop applies the `99+` cap automatically; pass `children` for non-numeric labels (`NEW`).

```preview
badge/default
---
import { Badge } from '@blind-chorus/ui';

<Badge>3</Badge>
```

## Dot

The labelless form — an update dot used as a corner activity flag. Two rungs (`dot-md` 8 × 8 and `dot-sm` 6 × 6); paints the brand fill with a 1px `surface`-color halo (`box-shadow`) so the dot reads cleanly above any host imagery without enlarging its bounding box. The dot rungs ignore `count` and `children` and never render text. [Thumbnail](../thumbnail/thumbnail.md) is the canonical host — it picks `dot-md` at the 32 / 40 / 48 rungs and `dot-sm` at the 16 / 20 / 24 rungs — but any host may reach for the same dot. Toggle the **Size** control to swap between the two rungs (`Medium` → `dot-md`, `Small` → `dot-sm`).

```preview
badge/update-dot
---
import { Badge } from '@blind-chorus/ui';

<Badge size="dot-md" />
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

Numeric badge attached inside the label cell of a thumbnail `List` row — the canonical product use. The badge sits flush against the channel name (8px inline gap).

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

- **label** *(Numeric only)* — the count. Required on Numeric, single line. Numeric in the common case, `99+` cap once the count crosses 99. Non-numeric labels (`NEW`) allowed as a short single word. The Dot type carries no label slot.

## Sizes

Four rungs split across the two types — two per type.

| Type     | Size    | Min-height / width | Padding (block × inline) | Label                                         | Halo                       |
|----------|---------|--------------------|--------------------------|-----------------------------------------------|----------------------------|
| Numeric  | medium  | 20px (`ref.space.250` ‡) | 0 × 6 (`0` × `ref.space.75` ‡)        | 12 / Semibold (`sys.typo.label.sm`)   | —                          |
| Numeric  | small   | 16px (`ref.space.200`)   | 0 × 4 (`0` × `sys.layout.container.2xs`) | 10 / Regular (`sys.typo.caption.sm`)  | —                          |
| Dot      | dot-md  | 8px (`ref.space.100`)    | 0 × 0                                  | — (labelless)                              | 1px `sys.color.surface` ⁋  |
| Dot      | dot-sm  | 6px (`ref.space.75`)     | 0 × 0                                  | — (labelless)                              | 1px `sys.color.surface` ⁋  |

All rungs share `sys.radius.full` (9999px) corners.

‡ `ref.space.250` (20px) and `ref.space.75` (6px) bind raw because `sys.*` does not expose those steps. The Dot rungs reuse `ref.space.100` (8px) and `ref.space.75` (6px) to stay in lockstep with [Thumbnail's update-dot ladder](../thumbnail/thumbnail.md#sizes) — `dot-md` at the 32 / 40 / 48 rungs, `dot-sm` at 16 / 20 / 24.

⁋ Dot halo is painted as a `box-shadow` so the dot's bounding footprint never changes when it sits on a host image.

The `min-width = min-height` rule combined with `radius.full` guarantees a perfect circle for one character (or a labelless dot) and a content-growing pill otherwise.

## States

Badge is presentational — no hover, pressed, focused, or disabled states of its own. State belongs to the host.

Disabled hosts may suppress the badge entirely rather than dim it.
