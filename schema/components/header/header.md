# Header

Labelled heading + an optional trailing affordance. The composable header anatomy reused across [Section](../section/section.md), in-sheet sub-sections, bounded cards, [SideSheet](../side-sheet/side-sheet.md) drawer columns, and any host that needs a leading title + one trailing commit.

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

`trailingIcon` mode — the whole header becomes the tap target via `onClick` / `href`. The 16px chevron paints in `onSurfaceVariant` and rotates -90° to read as chevron-right. Use when the trailing affordance is "open this surface", not "commit a labelled action". `headerAction` and `trailingIcon` are mutually exclusive.

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

- **container** — outer row. Flex with `space-between`; label leads, action / icon trails, 8px (`layout.inline.md`) gap. Becomes a `<button>` / `<a>` when interactive (`trailingIcon` + `onClick` / `href`).
- **label** *(optional)* — heading text. `<h3>` by default; override the wrapper with `as="div"` when the surrounding host already owns the heading semantics. Color `sys.color.onSurface`. Typo per size.
- **action** *(optional, headerAction mode)* — trailing Text Button. Fixed at `size="xsmall"`, `appearance="accent"`.
- **icon** *(optional, trailingIcon mode)* — trailing 16px icon. Decorative — `aria-hidden`. Whole header is the hit target; the icon is not a separate one.

## Behavior

- **Empty render** — when `label`, `headerAction`, and `trailingIcon` are all omitted, Header renders nothing.
- **Alignment** — label and trailing affordance share the row's centre line. The label never wraps; the trailing keeps intrinsic width and never grows.
- **Mode exclusivity** — `headerAction` and `trailingIcon` are mutually exclusive. When both are set, `trailingIcon` wins.

## Composition

- Inside [Section](../section/section.md) — rendered automatically as `size="large"` + `headerAction` mode.
- Standalone — drop above any labelled region (`List`, `Feed`, `PostCarousel`, `Banner`, a bounded card body).
- Inside a [SideSheet](../side-sheet/side-sheet.md) drawer column — `size="medium"` is the canonical rung; pair with `List` compact below.
- Inside a [BottomSheet](../bottom-sheet/bottom-sheet.md) content slot — `size="medium"` so the heading does not compete with the sheet's own 20-rung title.
