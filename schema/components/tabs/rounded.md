# Rounded

The rounded-rectangle tab row — each tab a self-contained chip with a required leading icon and label. Shares its visual chrome with [Segmented](./segmented.md) and [Filter chip](../chip/filter.md) verbatim — **the single divergence is the corner radius**, which steps from `sys.radius.full` (capsule) to `sys.radius.md` (8). Reads as a soft rounded rectangle rather than a pill.

**Layout inset.** `full-bleed` — Rounded tabs is an **edge-to-edge** family. It sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. The row pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays and the tabs land at a different inset than the page body and section headings around them. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

The bare headline form — labels carry the meaning, no glyphs.

```preview
tabs/rounded/default
---
import { Tabs, Tab } from '@blind-dsai/ui';

<Tabs variant="rounded" value="latest" onChange={setValue} aria-label="Sort">
  <Tab value="latest">Latest</Tab>
  <Tab value="popular">Popular</Tab>
  <Tab value="following">Following</Tab>
</Tabs>
```

## Use cases

### With icon

The canonical sort / filter row — each tab pairs a leading glyph with its label. Icon sits at 16px (`sys.icon.md`). Every glyph is drawn from the managed `@blind-dsai/ui/icons` set so the row carries no inline SVG.

```preview
tabs/rounded/leading-icon
---
import { Tabs, Tab } from '@blind-dsai/ui';
import { PulseIcon, StarIcon, HeartIcon, BookmarkIcon } from '@blind-dsai/ui/icons';

<Tabs variant="rounded" value="latest" onChange={setValue} aria-label="Sort">
  <Tab value="latest"    leadingIcon={<PulseIcon />}>Latest</Tab>
  <Tab value="popular"   leadingIcon={<StarIcon />}>Popular</Tab>
  <Tab value="favorites" leadingIcon={<HeartIcon />}>Favorites</Tab>
  <Tab value="saved"     leadingIcon={<BookmarkIcon />}>Saved</Tab>
</Tabs>
```

### Icon only

A glyph-only tab — collapses to a clean 32×32 square (inline padding 12 → 8). Pair every icon-only tab with an `aria-label`.

```preview
tabs/rounded/icon-only
---
import { Tabs, Tab } from '@blind-dsai/ui';
import { StarIcon, BookmarkIcon, HeartIcon } from '@blind-dsai/ui/icons';

<Tabs variant="rounded" value="featured" onChange={setValue} aria-label="View">
  <Tab value="featured" leadingIcon={<StarIcon />}     aria-label="Featured" />
  <Tab value="saved"    leadingIcon={<BookmarkIcon />} aria-label="Saved"    />
  <Tab value="loved"    leadingIcon={<HeartIcon />}    aria-label="Loved"    />
</Tabs>
```

### Overflow

When the row's natural width exceeds the surrounding column, it scrolls horizontally instead of compressing tabs. Trailing **Edge fade** (48px / `ref.space.600`) paints via `mask-image` only while overflow is present.

```preview
tabs/rounded/overflow
---
import { Tabs, Tab } from '@blind-dsai/ui';
import { PulseIcon, StarIcon, HeartIcon, BookmarkIcon, TagIcon, ProfileIcon, MentionIcon } from '@blind-dsai/ui/icons';

<Tabs variant="rounded" value="latest" aria-label="Feed">
  <Tab value="latest"    leadingIcon={<PulseIcon />}>Latest</Tab>
  <Tab value="popular"   leadingIcon={<StarIcon />}>Popular</Tab>
  <Tab value="favorites" leadingIcon={<HeartIcon />}>Favorites</Tab>
  <Tab value="saved"     leadingIcon={<BookmarkIcon />}>Saved</Tab>
  <Tab value="topics"    leadingIcon={<TagIcon />}>Topics</Tab>
  <Tab value="people"    leadingIcon={<ProfileIcon />}>People</Tab>
  <Tab value="mentions"  leadingIcon={<MentionIcon />}>Mentions</Tab>
</Tabs>
```

### Focus indicator

Static design-review specimen — pins the keyboard-focus ring to the selected tab. See top-level [Focus indicator](#focus-indicator) for composition.

```preview
tabs/rounded/focused
---
import { Tabs, Tab } from '@blind-dsai/ui';

<Tabs variant="rounded" value="latest" aria-label="Sort">
  <Tab value="latest" state="focused">Latest</Tab>
  <Tab value="popular">Popular</Tab>
  <Tab value="following">Following</Tab>
</Tabs>
```

## Slots

- **label** — tab's accessible name. Single line. Optional only when icon-only — pair with `aria-label`.
- **leadingIcon** — optional 16px (`sys.icon.md`) glyph. May carry its own brand / category color independent of the label.

At least one of `label` / `leadingIcon` must be present.

## Anatomy

| Prop / state           | Container                          | Label color                       | Border (always 1px `sys.borderWidth.hairline`)                          |
|------------------------|------------------------------------|-----------------------------------|-------------------------------------------------------------------------|
| **Tab — unselected**   | `transparent`                      | `sys.color.onSurface`             | `sys.color.outlineVariant`                                              |
| **Tab — selected**     | `sys.color.inverseSurface`         | `sys.color.inverseOnSurface`      | `transparent` — 1px width held so footprint never changes between states |

Selected / unselected pairs are inherited verbatim from [Filter chip's selectionStates](../chip/filter.md#variants).

## Sizes

A single fixed rung. Every dimension other than the corner radius matches [Segmented](./segmented.md#sizes) and [Filter chip](../chip/filter.md#sizes).

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Container background              | transparent          | —                                  |
| Container padding (block × inline)| 16 × 16              | `sys.layout.container.md` × `sys.layout.container.md` |
| Min-height                        | 32px                 | `ref.space.400` ‡                  |
| Padding (block × inline)          | 4 × 12               | `sys.layout.container.2xs` × `sys.layout.container.sm` |
| Label inset (within label slot)   | 4px (horizontal)     | `sys.layout.container.2xs`         |
| Slot gap (icon ↔ label)           | 0                    | — †                                |
| Inter-tab gap                     | 4px                  | `sys.layout.inline.sm`             |
| Radius                            | **8px**              | `sys.radius.md` ⁂                  |
| Label                             | 12 / Semibold        | `sys.typo.label.sm`                |
| Icon                              | 16px (fixed)         | `sys.icon.md`                      |

‡ **min-height** binds to raw `ref.space.*` because `sys.*` does not currently expose a 32px step.

† **Slot gap is a literal `0`** — the visible label-to-glyph rhythm comes from the label-slot inset (`padding: 0 4px` on the label span), not from a sibling `gap`.

⁂ **Radius is the only divergence from Segmented.** Segmented uses `sys.radius.full`; Rounded uses `sys.radius.md` (8).

## States

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `selected` | —                          | Swap to inverse-surface pair; hairline stroke goes `transparent` (1px held). |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)). Trigger: `:focus-visible`.
