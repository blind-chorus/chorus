# Thumbnail

A circular image — the unit that identifies a channel, a feed author, or any small-rung image. Two optional badges ride without changing footprint: an **update dot** top-right and a **logo badge** bottom-right. A pure visual primitive — no label of its own.

**Layout inset.** inline — slot atom. Lives inside another component's leading slot (List row leading, Feed author block, AvatarRail item, SuggestionList row, NavigationBar leading); the host picks the rung (16 / 20 / 24 / 32 / 40 / 48 / 56) and places it. Never a sibling of `full-bleed` page rows.

## Default

Image only, no badges. Thumbnail is **image-first** — `src` expects a real image asset URL; the slot resolves to an `<img>`, not a glyph or text. When mocking up with no real image, fill `src` with `/placeholder.png` rather than omitting it — the empty-surface fallback is for runtime load failures, not design-time scaffolding.

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

A 16 × 16 sub-brand mark at the bottom-right on its own surface halo.

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

### With surface outline

`outlined` paints a 2-token (`sys.borderWidth.thin`) `sys.color.surface` halo as an outset `box-shadow` around the container. The ring blends into the host's `surface*` tier and separates the circle's edge from anything visually noisy underneath. Painted as a shadow, not a `border:` — the rung's diameter never reflows.

```preview
thumbnail/with-outline
---
import { Thumbnail } from '@blind-dsai/ui';

<Thumbnail size={56} alt="Channel" src="/placeholder.png" outlined />
```

**Reach for `outlined` when** the Thumbnail half-overlaps or sits over an image ([ProfileHeader](../profile-header/profile-header.md) avatar on cover, [Profile carousel](../carousel/profile.md) avatar on card cover), the backdrop is a brand-tonal strip or gradient ([Banner](../banner/banner.md) inside a colour-tinted host, a Section painted with a `*Container` fill), the Thumbnail sits over a dark photo / pattern / video frame, or two adjacent Thumbnails partially overlap (avatar stack, cluster).

**Skip `outlined` when** the host is a plain `surface*` row (List / Feed / SuggestionList / Navigation bar leading) with no imagery underneath, the host's chrome already provides the separator (outlined card, hairline divider under the avatar), or the Thumbnail is `size={16}` / `size={20}` where the halo would dominate.

The two corner badges (`updateDot`, `logoBadge`) carry their own 1-token surface halos and compose cleanly over the outlined ring — order is image → outlined ring → badge halos → badge fills, all painted as `box-shadow` so footprint never changes.

### Size ladder

The full ladder side-by-side; update-dot steps down at the 32-rung boundary.

```preview
thumbnail/size-ladder
---
import { Thumbnail } from '@blind-dsai/ui';

<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
  <Thumbnail size={56} alt="A" updateDot />
  <Thumbnail size={48} alt="B" updateDot />
  <Thumbnail size={40} alt="C" updateDot />
  <Thumbnail size={32} alt="D" updateDot />
  <Thumbnail size={24} alt="E" updateDot />
  <Thumbnail size={20} alt="F" updateDot />
  <Thumbnail size={16} alt="G" updateDot />
</div>
```

## Slots

- **image** — required circular image at `radius.full`. When the asset hasn't loaded, the container holds `surfaceContainerHigh` and AT reads `alt`.
- **updateDot** *(optional)* — `brand`-tone dot at the top-right. Decorative (`aria-hidden`); pair with a text affordance for the count. Rendered by [Badge](../badge/badge.md)'s `dot-md` / `dot-sm` rungs — `dot-md` at 32 / 40 / 48 / 56, `dot-sm` at 16 / 20 / 24.
- **logoBadge** *(optional)* — 16 × 16 circular badge at the bottom-right, for a sub-brand glyph.

Both corner overlays sit *above* the image and carry a 1px (`borderWidth.hairline`) `surface`-color halo as a `box-shadow` — no change to bounding footprint. With `outlined={true}` the container takes a 2px (`borderWidth.thin`) `surface`-color outset halo via `box-shadow`, composing cleanly with the two badge halos above.

## Anatomy

| Slot         | Token bindings |
|--------------|----------------|
| container    | `radius.full`, no fill of its own. With `outlined={true}` adds a 2px (`borderWidth.thin`) `surface`-color outset halo via `box-shadow` |
| image        | `surfaceContainerHigh` fallback, `onSurfaceVariant` fallback glyph |
| updateDot    | Rendered by [Badge](../badge/badge.md) `dot-md` / `dot-sm` (`brand` fill, `radius.full`, 2px `surface`-color outline); top-right flush |
| logoBadge    | 16 × 16, `radius.full`, `surface` halo at 1px, bottom-right flush |

## Sizes

Seven rungs. Diameter binds to a raw `ref.space.*` step so Thumbnail can sit verbatim inside a fixed-footprint row.

| Size  | Diameter | Update-dot | Logo badge | Token (diameter)            |
|-------|----------|------------|------------|------------------------------|
| 56    | 56px     | 8 × 8      | 16 × 16    | `ref.space.700`              |
| 48    | 48px     | 8 × 8      | 16 × 16    | `ref.space.600`              |
| 40    | 40px     | 8 × 8      | 16 × 16    | `ref.space.500`              |
| 32    | 32px     | 8 × 8      | 16 × 16    | `ref.space.400`              |
| 24    | 24px     | 6 × 6      | 16 × 16    | `ref.space.300`              |
| 20    | 20px     | 6 × 6      | 16 × 16    | `ref.space.250`              |
| 16    | 16px     | 6 × 6      | 16 × 16    | `ref.space.200`              |

Update-dot steps down at 32 so it stays a *highlight*, not an *occluder*; logo badge pins at 16 because the glyph it carries is illegible below that. The 56 rung is reserved for the canonical follow-suggestion / xlarge directory-row leading slot (see [list/entry](../list/entry.md) `size="xlarge"`).

## States

Not interactive — no hover / pressed / focused / disabled. When wrapped in an interactive row, the row owns state and focus.

When the image fails to load or `src` is omitted, the slot enters its **fallback** form — `/placeholder.png` paints as `background-image` (centered, covered) over a `surfaceContainerHigh` base. The fallback is a runtime safety net; design-time scaffolds should pass `/placeholder.png` through `src` explicitly.

## Behavior

- **Slot omission collapses without a gap.** Both badges drop out entirely when absent.
- **Badges overlay; they never reflow the image.** Absolutely positioned; the 1px halo is a `box-shadow`.
- **Image clipped to a perfect circle.** `radius.full` + `overflow: hidden`; hand in a square-or-larger source.
- **Image fallback, not text fallback.** When `src` is omitted or the server fails to deliver, the slot's `background-image` paints `/placeholder.png` over a `surfaceContainerHigh` base. No text/initial fallback.
