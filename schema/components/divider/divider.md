# Divider

A section-break band — a single full-bleed block painted with `sys.color.scrimSubtle` (~8% inverse-tone overlay — black in light mode, white in dark) at a fixed block thickness of `sys.layout.stack.xs` (8). Reach for it when two adjacent regions don't share an enclosing container and vertical rhythm alone doesn't read as a boundary — a directory of suggested channels ending and a fresh recommendation list beginning, a feed segment ending and a followed-channels list resuming, a promo strip ending and content picking up below.

**Reach for this when** the boundary between two regions is ambiguous because they share the same surface and vertical rhythm — the visitor's eye should *land* on the break, not infer it. **Skip when** the regions already sit on different surfaces (one card, one canvas — the surface change is the break), when one region carries a heading that itself reads as the start of a new block, or when the separation is between *rows of the same list* (List's own `divider={true}` paints those as a hairline `outlineVariant` rule).

**Surface-agnostic by design.** The fill is `sys.color.scrimSubtle` — a ~8% inverse-tone overlay (black in light mode, white in dark) — so the band reads as a tint *darker than the host surface* without pinning to a fixed neutral step. The same band visibly separates regions on `surface`, `surfaceContainerHigh`, a hero panel, or a coloured card without retoning per-host. Same scrim tier as Banner default, Chip / Tag default, Progress track, StatusTag neutral, and Skeleton.

**Layout inset.** `full-bleed` — Divider stretches edge-to-edge inside the page-shell content box. It ships **no** inline padding, **no** outer margin, **no** corner radius, **no** stroke; it just paints `scrimSubtle` across a `sys.layout.stack.xs` (8) block. Drop it as a direct child of the page-shell `<main>` (or any full-width host column) between two regions — do not wrap in a `padding-inline` div, `className="px-*"`, or `style={{ padding }}`; the band reading edge-to-edge IS what makes it a region boundary.

**Safe zone — none.** The parent column pays no `gap`, `padding-block`, or `margin-block` around Divider. The 8 of `scrimSubtle` is the breathing. If two regions feel cramped after dropping Divider between them, the fix is to add internal padding to the regions themselves (`layout.container.*`), never to wrap Divider in a spacer or paint outer margin on it.

## Default

The single canonical band. 8 high, full inline width, `scrimSubtle` fill.

```preview
divider/default
---
import { Divider } from '@blind-dsai/ui';

<Divider />
```

## Use cases

### Between adjacent lists

The canonical placement — a region break between two full-bleed lists stacked on the same page. Above: a directory of new channels (DirectoryList, an inert directory). Below: a recommendation set keyed to the visitor (SuggestionList, the pager-flavoured sibling). Both lists own their internal divider hairlines for rows, but the *boundary between the two lists* is a region break — that is the role Divider plays.

```preview
divider/between-lists
---
import { Divider, DirectoryList, SuggestionList } from '@blind-dsai/ui';

<div style={{ background: 'var(--sys-color-surface)', display: 'flex', flexDirection: 'column' }}>
  <DirectoryList
    label="New channels"
    items={[
      { value: 'breadclub', name: 'Sourdough Bakers', followers: '12.4K Followers', description: 'Open-crumb obsession and cold-proof timing.', thumbnail: { src: '/placeholder.png', alt: 'Sourdough Bakers' } },
      { value: 'indiedevs', name: 'Indie Game Devs', followers: '8,210 Followers', description: 'Shipping logs, postmortems, marketing on a budget.', thumbnail: { src: '/placeholder.png', alt: 'Indie Game Devs' } },
    ]}
  />
  <Divider />
  <SuggestionList
    label="Recommended channels"
    items={[
      { value: 'plants', name: 'Plant People', followers: '21.7K Followers', description: 'Houseplant troubleshooting and propagation threads.', thumbnail: { src: '/placeholder.png', alt: 'Plant People' } },
      { value: 'movies', name: 'Movie Talk', followers: '34.2K Followers', description: 'Festival coverage, director threads, link shares.', thumbnail: { src: '/placeholder.png', alt: 'Movie Talk' } },
    ]}
  />
</div>
```

## Slots

- **container** — the tonal band. `sys.color.scrimSubtle` fill, `sys.layout.stack.xs` (8) block thickness, full inline width, no padding, no border, no corner radius. The native `<hr>` element with all browser defaults reset. `aria-hidden="true"` by default — the band is decorative.

## Anatomy

| Slot       | Token bindings |
|------------|----------------|
| container  | `sys.color.scrimSubtle` fill, `sys.layout.stack.xs` (8) block height, 100% inline width, `border: none`, `margin: 0`, `border-radius: 0` |

## Appearance

Single appearance — Divider has no emphasis axis, no orientation axis, and no thickness prop.

| Appearance | Fill                       | When to use                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | `sys.color.scrimSubtle`    | The only mode. Same scrim used by Banner default / Chip-Tag default / Progress track / StatusTag neutral / Skeleton — Divider is the section-level member of that family. |

## Behavior

- **aria-hidden by default.** The band is decorative chrome; screen-reader users navigate by headings and landmarks, not visual breaks. Override `aria-hidden={false}` only when the divider genuinely marks a semantic section change (rare — prefer a heading).
- **Fixed thickness.** Block thickness is `sys.layout.stack.xs` (8) and is not a prop. Heavier bands compete with content; thinner bands collapse to a hairline (use the host's own `outlineVariant` border for row-level breaks, not Divider).
- **Full-bleed by contract.** The band must touch the page edge to read as a region boundary. Wrapping Divider in a padding-inline container breaks the affordance — see the AGENTS.md "one gutter, paid once" rule.
- **Not a row separator.** Inside a List, rows already separate via the list's own `divider={true}` hairline `outlineVariant` rule. Reach for Divider only at the *region* level, between groups that don't share an enclosing container.
