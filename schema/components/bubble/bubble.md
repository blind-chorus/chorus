# Bubble

An always-on annotation bubble — a small pill-shaped label with a tail pointing at a specific UI element. Use it when a hint should stay in view as part of the resting UI (a chat icon flagging new messages, a search bar promoting a fresh keyword campaign, a tab tagged with a one-off event). Distinct from [Tooltip](../tooltip/tooltip.md) on three axes: Bubble is **persistent** (Tooltip is transient), **lower visual priority** (no elevation, smaller padding, single line), and **never occludes neighbours** (the host positions it inline; Bubble is not a portal-mounted overlay).

**Reach for this when** an annotation should remain visible at all times — editorial nudges, campaign flags, feature-flag callouts, count summaries that need more presence than a Badge dot. **Skip when** the message is invoked on demand (use Tooltip), when it carries a decision or blocking meaning (use Banner / Dialog), or when the hint is just a numeric count beside an icon (use Badge).

**Layout inset.** `inline` — Bubble owns its own padding (4 / 6), pill radius, fill, tail, and a viewport-safe width cap, but ships **no positioning**. The host decides whether the bubble sits inline-flex next to the anchor, absolutely positioned relative to a positioned parent, or fixed at a top-bar slot.

**Viewport safe area — 8 from every display edge.** The bubble must keep an 8-token (`sys.layout.container.xs`) safe margin from every viewport edge. Width-clamping is built into the component (`max-width` is `min(100%, calc(100vw − 2 × sys.layout.container.xs))`), so the bubble can never grow wide enough to break the margin even when the host mis-positions it. *Position*-clamping (keeping the bubble's left and right edges out of the 8-token strip) is a host responsibility: when the anchor sits within 8 of an edge, the host shifts the bubble *away* from the edge and updates `tailAlign` so the tail still points at the anchor.

**Tail tip on the anchor's centreX — zero gap to the anchor.** Two coupled rules govern how the host aligns the bubble to the element it flags:

1. **Zero gap.** The bubble's tail-bearing edge (top edge for `tailSide="top"`, bottom edge for `tailSide="bottom"`) sits *flush* against the anchor's opposite edge. The tail's `ref.space.25` (2) protrusion past the bubble's edge is what visually connects bubble and anchor — adding a positive gap creates a floating bubble whose tail looks unattached.
2. **Tail tip centred on the anchor's horizontal centreline.** The host computes the bubble's inline offset so that, after accounting for the tail's own offset inside the bubble (`container.xs` from the chosen edge + half the tail's bounding box), the tail tip lands on the anchor's centreX. If the tail tip drifts off the centreline by more than ~2px, the bubble reads as pointing at empty space.

In a top-bar / trailing-icon scenario, this means: bubble's top edge sits at the bar's bottom edge (no gap), and the bubble's right offset equals the chat-icon centre's distance from the bar's right edge *minus* the tail's right-inset within the bubble (`container.xs + half-tail`). The bubble effectively *touches* the anchor; the tail tip lives on the anchor's centreline.

**Tail alignment selection — left / center / right by anchor position.** Visibility of the bubble is the contract; tail position is the lever that enforces it. Three cases govern how the host picks `tailAlign`:

| Anchor position relative to viewport          | Bubble shifts | `tailAlign` |
|-----------------------------------------------|---------------|-------------|
| Near the right edge (no room to centre under) | Leftward      | `end`       |
| Near the left edge (no room to centre under)  | Rightward     | `start`     |
| Centred with room on both sides               | Centred under | `center`    |

In every case the tail ends up directly under (or above) the anchor while the nearest bubble edge stays ≥8 from the viewport. The bubble is therefore *always* fully readable at the resting state — no portion is allowed to drift into the safe margin or under another overlay.

**Colour tuning — operations-friendly.** Default fill is `sys.color.primary` (brand blue) and label is `sys.color.onPrimary` — both theme-stable, so the bubble reads identically in light and dark mode. Operations re-tint per campaign by setting two CSS custom properties on the bubble's inline style: `--bubble-fill` (background tone) and `--bubble-ink` (label tone). The decorative tail uses `background: inherit`, so a single colour swap on the container covers the whole bubble. Keep contrast above WCAG AA (4.5:1) — the system does not enforce this at runtime.

## Default

The single canonical bubble — primary fill, onPrimary label, top tail centred, single line that truncates with an ellipsis if the copy exceeds the bubble's host width.

```preview
bubble/default
---
import { Bubble } from '@blind-dsai/ui';

<Bubble>5 new messages + gift</Bubble>
```

## Use cases

### Anchored to a top-bar icon

The canonical pattern from the screenshots — a [Navigation bar (home)](../navigation-bar/home.md) with three trailing actions (search / chat / profile), and a bubble parked below the chat icon. Because the chat capsule is the middle of three icons near the right edge of the bar, the bubble shifts *leftward* (so its right edge clears the 8-token safe margin) and `tailAlign="end"` pins the tail to the bubble's right end where the chat icon still lives. Composing the bar via `<NavigationBar variant="home" />` rather than a hand-rolled mock keeps the demo grounded in the real chrome the screen ships — the bubble's geometry (right inset, tail offset) tunes against the spec'd trailing-capsule layout, not a one-off div.

**The two anchoring rules in action.** `top: 56px` (the bar's own min-height) — *zero gap*, the bubble's top edge sits flush against the bar's bottom. `right: 58px` — computed so that the tail tip (which is 10 inside the bubble's right edge: 8 inset + 2 half-tail) lands at the chat icon's centreX (68 from the bar's right). Both contracts satisfied: gap = 0, tail tip on the anchor centreline.

```preview
bubble/anchored-icon
---
import { Bubble, NavigationBar } from '@blind-dsai/ui';
import { SearchIcon, ChatIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<div style={{ position: 'relative', paddingBottom: 'var(--sys-layout-stack-2xl)' }}>
  <NavigationBar
    variant="home"
    title={
      <img
        src="/blind_logotype_black.svg"
        alt="Chorus"
        className="chorus-brand-logotype"
        style={{ height: 24, width: 'auto', display: 'block' }}
      />
    }
    trailingActions={[
      { icon: <SearchIcon />,  'aria-label': 'Search' },
      { icon: <ChatIcon />,    'aria-label': 'Messages' },
      { icon: <ProfileIcon />, 'aria-label': 'Profile' },
    ]}
  />
  <div style={{
    position: 'absolute',
    top: '56px',
    right: '58px',
    display: 'flex',
  }}>
    <Bubble tailSide="top" tailAlign="end">5 new messages + gift</Bubble>
  </div>
</div>
```

### Tail alignment matrix

Three tail alignments stacked in a column, each carrying a short marketing nudge. The column uses `align-items: flex-start` so the bubbles shrink-wrap to their content (flex's default `stretch` would otherwise pull them to full column width and bury the start / end tail offset). The CSS-level viewport-safe `max-width` cap still applies — if the column ever sat flush to the viewport edge, each bubble would still respect the 8 / 8 safe margin and truncate before crossing it.

The host picks `tailAlign` based on where the anchor sits relative to the viewport — `start` when the anchor is near the left edge (bubble shifts right), `center` when the anchor has room on both sides, `end` when the anchor is near the right edge (bubble shifts left). The tail always lands under the anchor; the nearest bubble edge always clears the 8-token safe margin.

```preview
bubble/tail-positions
---
import { Bubble } from '@blind-dsai/ui';

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--sys-layout-stack-md)' }}>
  <Bubble tailSide="top" tailAlign="start">New here?</Bubble>
  <Bubble tailSide="top" tailAlign="center">Try free</Bubble>
  <Bubble tailSide="top" tailAlign="end">Today only</Bubble>
</div>
```

### Long copy — single-line truncation

When the campaign copy is too long for the bubble's host width, the body truncates with an ellipsis rather than wrapping. Wrap requirements signal that the message belongs in a Banner instead.

```preview
bubble/long-copy
---
import { Bubble } from '@blind-dsai/ui';

<div style={{ maxWidth: 220 }}>
  <Bubble>A long campaign label that exceeds the bubble width and truncates with an ellipsis</Bubble>
</div>
```

### Operations re-tint

`--bubble-fill` and `--bubble-ink` are the supported runtime overrides. The tail inherits the fill via `background: inherit`, so a single declaration on the bubble covers body and tail.

```preview
bubble/recoloured
---
import { Bubble } from '@blind-dsai/ui';

<Bubble
  style={{
    '--bubble-fill': 'var(--sys-color-brand)',
    '--bubble-ink': 'var(--sys-color-onBrand)',
  }}
>
  Free daily tarot
</Bubble>
```

## Slots

- **container** — pill body. `position: relative` so the tail can pin to its edge, `display: inline-flex` so the body shrink-wraps. Carries the runtime fill, ink, padding (4 block / 6 inline), and pill radius. `role='note'`.
- **body** — copy in `sys.typo.caption.sm` (10 / Regular). Single line — `white-space: nowrap` + `text-overflow: ellipsis` truncate overflow rather than wrap. Inherits the container's ink colour.
- **tail** — 4 × 4 square rotated 45° so a diamond corner protrudes from the bubble's edge. `background: inherit` so the tail tracks the runtime fill. `aria-hidden='true'`.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill `--bubble-fill` (default `sys.color.primary`), ink `--bubble-ink` (default `sys.color.onPrimary`), `sys.layout.container.2xs` (4) padding-block, `ref.space.75` (6) padding-inline, `sys.radius.full` corner, `position: relative`, `display: inline-flex`, `max-width: 100%`, `role='note'` |
| body      | `sys.typo.caption.sm` (10 / Regular), `white-space: nowrap`, `text-overflow: ellipsis`, `overflow: hidden`, colour inherits |
| tail      | `ref.space.50` (4) × `ref.space.50` (4) square, `background: inherit`, rotated 45° via CSS transform, positioned by `[data-tail-side]` + `[data-tail-align]`, `aria-hidden='true'` |

## Appearance

Single appearance — Bubble has no `default` / `accent` / `destructive` axis. Operations campaigns re-tint via the `--bubble-fill` / `--bubble-ink` custom properties.

| Appearance | Fill                       | Ink                          | When to use                                                                 |
|------------|----------------------------|------------------------------|-----------------------------------------------------------------------------|
| `default`  | `sys.color.primary`        | `sys.color.onPrimary`        | The only mode. Theme-stable in light and dark. Override via `--bubble-fill` / `--bubble-ink` for campaigns. |

## Behavior

- **Persistent at rest.** Bubble stays in view as part of the resting UI — no hover / focus trigger, no entry / exit animation, no dismissal contract. If the bubble should disappear after one viewing, the host removes it from the tree.
- **Single line + ellipsis.** Body copy never wraps. When copy exceeds the bubble's host width, the trailing text truncates with an ellipsis. Long copy signals the message belongs in a Banner.
- **Host positions.** Bubble is presentational. The host's positioning decision (inline-flex next to the anchor / `position: absolute` / `position: fixed`) is what makes the tail visually attach. Match `tailSide` + `tailAlign` to the anchor.
- **Never occludes.** Bubble has no elevation shadow and is not portal-mounted — it sits in the normal flow at the host's chosen position. Anchors, neighbour chrome, and adjacent body copy must remain visible around the bubble.
- **Colour tuning.** `--bubble-fill` and `--bubble-ink` are the supported runtime overrides. The tail picks up the fill via `background: inherit`, so a single declaration covers both surfaces. Keep contrast above WCAG AA (4.5:1).
