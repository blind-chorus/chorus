# Badge

A small brand-tone indicator attached to a host label — a channel entry, a list row, a thumbnail corner — flagging *new or unread activity*. Use Badge for a count, dot, or short alert label; prefer [Tag](../chip/tag.md) when the marker describes content (category, status). Two top-level **types** share the same brand-tone fill and `radius.full` corner: **Numeric** (a labelled count pill) and **Dot** (a labelless update dot, used by [Thumbnail](../thumbnail/thumbnail.md)). Always anchored to a host; never interactive.

**Reach for Numeric when** the count itself carries meaning (3 unread, 12 mentions, `99+` notifications). **Reach for Dot when** the presence of activity is the whole signal — a corner flag without a magnitude. **Skip Badge entirely** when the marker is descriptive metadata — use [Tag](../chip/tag.md).

**Layout inset.** `inline` — slot atom. No page-rail responsibility; the surrounding container places it. Lives anchored to a host (Thumbnail corner, List row label, icon glyph) — never as a sibling of `full-bleed` page rows.

## Numeric

The labelled form — a short count next to its host label. Two rungs (`medium` / `small`); a 1-character label collapses to a circle, 2-character or `99+` stretches into a pill. The `count` prop applies the `99+` cap automatically; pass `children` for non-numeric labels (`NEW`).

```preview
badge/default
---
import { Badge } from '@blind-dsai/ui';

<Badge>3</Badge>
```

## Dot

The labelless form — an update dot used as a corner activity flag. Two rungs (`dot-md` 8 × 8, `dot-sm` 6 × 6); paints the brand fill with a 2px (`borderWidth.thin`) `surface`-color outline (`box-shadow`) so the dot stays a discrete chip without enlarging its bounding box. Dot rungs ignore `count` and `children`. [Thumbnail](../thumbnail/thumbnail.md) is the canonical host — `dot-md` at the 32 / 40 / 48 rungs, `dot-sm` at 16 / 20 / 24.

```preview
badge/update-dot
---
import { Badge } from '@blind-dsai/ui';

<Badge size="dot-md" />
```

## Use cases

### Digit cases

Single digit collapses to a circle (`min-width = min-height`); two digits stretch via `padding-inline`; counts past 99 cap at `99+`.

```preview
badge/digit-cases
---
import { Badge } from '@blind-dsai/ui';

<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-lg)' }}>
  <Badge count={3} />
  <Badge count={27} />
  <Badge count={142} />
</div>
```

### On thumbnail

The Dot rung painted at a [Thumbnail](../thumbnail/thumbnail.md)'s top-right corner — the canonical hosted form. Thumbnail picks `dot-md` at the 32 / 40 / 48 rungs and `dot-sm` at 16 / 20 / 24. The dot rides above the image without enlarging its bounding box.

```preview
badge/on-thumbnail
---
import { Thumbnail } from '@blind-dsai/ui';

<Thumbnail size={48} src="…" alt="Channel" updateDot />
```

### On icon

The Dot rung painted at an icon's top-right (notification bell, chat, mention). Always `dot-sm` regardless of icon size — a 6 × 6 dot reads as a *highlight* against the icon's drawing area without competing with the glyph. The 2px `surface`-color outline keeps it discrete from the icon stroke. Does not change the icon's `icon.md` / `icon.lg` footprint.

```preview
badge/on-icon
---
import { Badge } from '@blind-dsai/ui';
import { BellIcon } from '@blind-dsai/ui/icons';

<span style={{ position: 'relative', display: 'inline-flex' }}>
  <BellIcon size={24} />
  <Badge size="dot-sm" style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(25%, -25%)' }} />
</span>
```

### With host

Numeric badge attached inside the label cell of a thumbnail `List` row — the canonical product use. Badge sits flush against the channel name (8px inline gap).

```preview
badge/with-host
---
import { Badge, List } from '@blind-dsai/ui';

const labelWithBadge = (text, count) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sys-layout-inline-md)', minWidth: 0 }}>
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    <Badge count={count} />
  </span>
);

<List
  variant="image"
  items={[
    { value: 'amazon',  label: labelWithBadge('Amazon',  142), supportingText: 'Private · My company', thumbnail: { src: '/amazon.png',  alt: 'Amazon' } },
    { value: 'samsung', label: labelWithBadge('Samsung',  27), supportingText: 'Private · My company', thumbnail: { src: '/samsung.png', alt: 'Samsung' } },
    { value: 'naver',   label: labelWithBadge('Naver',     3), supportingText: 'Public · Tech',        thumbnail: { src: '/naver.png',   alt: 'Naver' } },
  ]}
/>
```

## Appearance

Single appearance — Badge uses the **brand** token pair (`sys.color.brand` background, `sys.color.onBrand` label). Brand is one tonal step brighter than `error` and reserved for short-label attention pins. Do not reach for `error` or `brandContainer`.

## Slots

- **label** *(Numeric only)* — the count. Required on Numeric, single line. `99+` cap once count crosses 99. Non-numeric labels (`NEW`) allowed. The Dot type carries no label slot.

## Sizes

Four rungs split across the two types — two per type.

| Type     | Size    | Min-height / width | Padding (block × inline) | Label                                         | Halo                       |
|----------|---------|--------------------|--------------------------|-----------------------------------------------|----------------------------|
| Numeric  | medium  | 20px (`ref.space.250` ‡) | 0 × 6 (`0` × `ref.space.75` ‡)        | 12 / Semibold (`sys.typo.label.sm`)   | —                          |
| Numeric  | small   | 16px (`ref.space.200`)   | 0 × 4 (`0` × `sys.layout.container.2xs`) | 10 / Regular (`sys.typo.caption.sm`)  | —                          |
| Dot      | dot-md  | 8px (`ref.space.100`)    | 0 × 0                                  | — (labelless)                              | 2px `sys.color.surface` ⁋  |
| Dot      | dot-sm  | 6px (`ref.space.75`)     | 0 × 0                                  | — (labelless)                              | 2px `sys.color.surface` ⁋  |

All rungs share `sys.radius.full` (9999px) corners.

‡ `ref.space.250` (20px) and `ref.space.75` (6px) bind raw because `sys.*` does not expose those steps. The Dot rungs reuse `ref.space.100` (8px) and `ref.space.75` (6px) to stay in lockstep with [Thumbnail's update-dot ladder](../thumbnail/thumbnail.md#sizes) — `dot-md` at the 32 / 40 / 48 rungs, `dot-sm` at 16 / 20 / 24.

⁋ Dot outline is painted as a `box-shadow` so the dot's bounding footprint never changes when it sits on a host image.

The `min-width = min-height` rule combined with `radius.full` guarantees a perfect circle for one character (or a labelless dot) and a content-growing pill otherwise.

## States

Badge is presentational — no hover, pressed, focused, or disabled states of its own. State belongs to the host.

Disabled hosts may suppress the badge entirely rather than dim it.
