# Header

Labelled heading + an optional trailing affordance. The composable header anatomy reused across [Carousel](../carousel/carousel.md), in-sheet sub-sections, bounded cards, [SideSheet](../side-sheet/side-sheet.md) drawer columns, and any host that needs a leading title + one trailing commit.

**Reach for this when** a labelled block needs a heading and at most one trailing commit. **Skip when** the block has multiple actions, the trailing affordance is a destructive commit, or the surrounding host already owns a heading at the same rung.

**Layout inset.** `inline` — width-following. Pays no padding of its own; the host's surface padding governs the inset.

## Default

Section-style heading with a trailing Text Button "See all" link. Two sizes diverge on label typography: `large` = `sys.typo.heading.md` (20 / Semibold), `medium` = `sys.typo.heading.sm` (16 / Semibold).

```preview
header/default
---
import { Header } from '@blind-dsai/ui';

<Header
  label="Recommended channels"
  headerAction={{ label: 'See all', href: '#all' }}
/>
```

## Use cases

### With drill-in chevron

`trailingIcon` mode — the chevron is a [Button `variant="icon"`](../button/icon.md) at `size="medium"` (32 × 32 capsule, 16-glyph) that owns its own tap target. The chevron paints in `onSurfaceVariant` and rotates -90° to read as chevron-right. The surrounding `<header>` element stays non-interactive — clicks land on the Icon Button, not on the row chrome. Use when the trailing affordance is "open this surface", not "commit a labelled action". `headerAction` and `trailingIcon` are mutually exclusive.

```preview
header/with-icon-action
---
import { Header } from '@blind-dsai/ui';

<Header
  size="medium"
  label="My channels"
  trailingIcon
  onClick={() => {}}
/>
```

## Slots

- **container** — outer row. Flex with `space-between`; label leads, action / icon trails, 8px (`layout.inline.md`) gap. Stays a non-interactive `<header>` / `<div>` — the trailing affordance owns its own hit target.
- **label** *(optional)* — heading text. `<h3>` by default; override the wrapper with `as="div"` when the surrounding host already owns the heading semantics. Color `sys.color.onSurface`. Typo per size.
- **action** *(optional, headerAction mode)* — trailing Text Button. Fixed at `size="xsmall"`, `appearance="accent"`.
- **icon** *(optional, trailingIcon mode)* — trailing [Icon Button](../button/icon.md) (`variant="icon"` `size="medium"`) hosting a 16px glyph (canonical: chevron-right). Its own tap target — clicks land on the Icon Button, not the surrounding header. Supply `aria-label` for the icon-only button (defaults to `"Open <label>"` when `label` is a string).

## Behavior

- **Empty render** — when `label`, `headerAction`, and `trailingIcon` are all omitted, Header renders nothing.
- **Alignment** — label and trailing affordance share the row's centre line. The label never wraps; the trailing keeps intrinsic width and never grows.
- **Mode exclusivity** — `headerAction` and `trailingIcon` are mutually exclusive. When both are set, `trailingIcon` wins.

## Composition

- Inside [Carousel](../carousel/carousel.md) — rendered automatically as `size="large"` + `headerAction` mode.
- Standalone — drop above any labelled region (`List`, `Feed`, `PostCarousel`, `Banner`, a bounded card body).
- Inside a [SideSheet](../side-sheet/side-sheet.md) drawer column — `size="medium"` is the canonical rung; pair with `List` compact below.
- Inside a [BottomSheet](../bottom-sheet/bottom-sheet.md) content slot — `size="medium"` so the heading does not compete with the sheet's own 20-rung title.
