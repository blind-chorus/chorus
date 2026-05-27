# Thumbnail

A circular image — the unit used to identify a channel, a feed author, or any small-rung image. Two optional badges ride without changing footprint: an **update dot** at the top-right, and a **logo badge** at the bottom-right. A pure visual primitive — no label of its own.

**Layout inset.** `inline` — slot atom. No page-rail responsibility; the surrounding container places it. Lives inside another component's leading slot (List row leading, Feed author block, AvatarRail item, SuggestionList row, NavigationBar leading) — never as a sibling of `full-bleed` page rows. The host picks the rung (16 / 20 / 24 / 32 / 40 / 48) and positions the Thumbnail.

## Default

The base form — image only, no badges. Thumbnail is an **image-first** primitive: the `src` prop expects a real image asset URL (PNG / JPG / WebP / SVG); the slot resolves to an `<img>`, not a glyph or text. When mocking up with no real image, fill `src` with `/placeholder.png` rather than omitting it — the empty-surface fallback is for runtime load failures, not design-time scaffolding.

```preview
thumbnail/default
---
import { Thumbnail } from '@blind-dsai/ui';

<Thumbnail size={48} alt="Channel" src="/placeholder.png" />
```

## Use cases

### With update dot

A `brand`-tone dot at the top-right flags new activity. Decorative; the row carries the count in a sibling text slot.

```preview
thumbnail/with-update-dot
---
import { Thumbnail } from '@blind-dsai/ui';

<Thumbnail size={48} alt="Channel" src="/placeholder.png" updateDot />
```

### With logo badge

A 16×16 sub-brand mark at the bottom-right, on its own surface halo.

```preview
thumbnail/with-logo-badge
---
import { Thumbnail } from '@blind-dsai/ui';

<Thumbnail
  size={48}
  alt="Channel"
  src="/placeholder.png"
  logoBadge={{ src: '…', alt: 'Workspace' }}
/>
```

### With both badges

Top-right and bottom-right corners are independent and never collide.

```preview
thumbnail/with-both
---
import { Thumbnail } from '@blind-dsai/ui';

<Thumbnail
  size={48}
  alt="Channel"
  src="/placeholder.png"
  updateDot
  logoBadge={{ src: '…', alt: 'Workspace' }}
/>
```

### Size ladder

The full ladder side-by-side; update-dot size breaks at the 32-rung boundary.

```preview
thumbnail/size-ladder
---
import { Thumbnail } from '@blind-dsai/ui';

<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
  <Thumbnail size={48} alt="A" updateDot />
  <Thumbnail size={40} alt="B" updateDot />
  <Thumbnail size={32} alt="C" updateDot />
  <Thumbnail size={24} alt="D" updateDot />
  <Thumbnail size={20} alt="E" updateDot />
  <Thumbnail size={16} alt="F" updateDot />
</div>
```

## Slots

- **image** — circular image; required. Fills the container at `radius.full`. When the asset hasn't loaded, the container holds `surfaceContainerHigh` and AT reads `alt`.
- **updateDot** *(optional)* — `brand`-tone dot at the top-right. Decorative (`aria-hidden`); pair with a text affordance for the count. **Rendered by [Badge](../badge/badge.md)'s `dot-md` / `dot-sm` rungs.** Thumbnail picks `dot-md` at the 32 / 40 / 48 rungs and `dot-sm` at the 16 / 20 / 24 rungs.
- **logoBadge** *(optional)* — 16×16 circular badge at the bottom-right, for a sub-brand glyph.

Both corner overlays sit *above* the image and carry a 1px (`borderWidth.hairline`) `surface`-color halo painted as a `box-shadow` — no change to the overlay's bounding footprint.

## Anatomy

| Slot         | Token bindings |
|--------------|----------------|
| container    | `radius.full`, no fill of its own |
| image        | `surfaceContainerHigh` fallback, `onSurfaceVariant` fallback glyph |
| updateDot    | Rendered by [Badge](../badge/badge.md) `dot-md` / `dot-sm` (`brand` fill, `radius.full`, 2px `surface`-color outline); top-right flush |
| logoBadge    | 16×16, `radius.full`, `surface` halo at 1px, bottom-right flush |

## Sizes

Six rungs. Diameter binds to a raw `ref.space.*` step so Thumbnail can sit verbatim inside a fixed-footprint row.

| Size  | Diameter | Update-dot | Logo badge | Token (diameter)            |
|-------|----------|------------|------------|------------------------------|
| 48    | 48px     | 8 × 8      | 16 × 16    | `ref.space.600`              |
| 40    | 40px     | 8 × 8      | 16 × 16    | `ref.space.500`              |
| 32    | 32px     | 8 × 8      | 16 × 16    | `ref.space.400`              |
| 24    | 24px     | 6 × 6      | 16 × 16    | `ref.space.300`              |
| 20    | 20px     | 6 × 6      | 16 × 16    | `ref.space.250`              |
| 16    | 16px     | 6 × 6      | 16 × 16    | `ref.space.200`              |

The update-dot steps down at 32 so it stays a *highlight*, not an *occluder*; the logo badge is pinned at 16 because the glyph it carries is illegible below that.

## States

Thumbnail is not interactive — no hover / pressed / focused / disabled. When wrapped in an interactive row, the row owns state and focus.

When the image fails to load or `src` is omitted, the slot enters its **fallback** form — `/placeholder.png` paints as the layer's `background-image` (centered, covered) over a `surfaceContainerHigh` base. The fallback is a runtime safety net; design-time scaffolds should pass `/placeholder.png` through `src` explicitly.

## Behavior

- **Slot omission collapses without leaving a gap.** Both badges drop out entirely when absent.
- **Badges overlay; they never reflow the image.** Absolutely positioned; the 1px halo is a `box-shadow`.
- **Image clipped to a perfect circle.** `radius.full` + `overflow: hidden`; hand in a square-or-larger source.
- **Image fallback, not text fallback.** When `src` is omitted or the server fails to deliver the image, the slot's `background-image` paints `/placeholder.png` over a `surfaceContainerHigh` base. There is no text/initial fallback.
