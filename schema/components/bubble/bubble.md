# Bubble

An always-on annotation pill with a caret/tail pointing at an anchor UI element — a small persistent label that flags new activity, a fresh campaign, or a feature nudge. Sibling of [Tooltip](../tooltip/tooltip.md) on the annotation axis: Tooltip is transient, high-priority, and overlays neighbours on hover/focus; Bubble is **persistent**, **lower visual priority** (no elevation, smaller padding, single line), and **never occludes neighbours** (the host positions it inline; not portal-mounted).

**Reach for this when** an annotation should remain in view at the resting state — chat-icon "new messages" flag, search-bar campaign nudge, feature-flag callout. **Skip when** the hint is invoked on demand (use Tooltip), carries a blocking decision (use Banner / Dialog), or is just a numeric count beside an icon (use Badge).

**Layout inset.** `inline` — Bubble owns its padding (4 / 6), pill radius, fill, tail, and a viewport-safe `max-width` cap. The host owns four coupled positioning decisions:

| # | Contract |
|---|---|
| 1 | Every bubble edge ≥ 8 (`sys.layout.container.xs`) from the viewport edge. Width-clamping is baked into the CSS; position-clamping is on the host. |
| 2 | **Zero gap** between the bubble's tail-bearing edge and the anchor — the bubble sits flush, the tail's `ref.space.25` protrusion connects them. |
| 3 | **Tail tip on the anchor's centreX** (within ~2px) — the host's inline offset must cancel the tail's `container.xs + half-tail` inset inside the bubble. |
| 4 | `tailSide` (`top` if bubble sits below anchor, `bottom` if above) and `tailAlign` (`start` / `center` / `end`) must agree with (3). |

**Tail alignment selection.** The host picks `tailAlign` by where the anchor sits relative to the viewport — `start` for left-edge anchors (bubble shifts right), `center` for anchors with room on both sides, `end` for right-edge anchors (bubble shifts left). The tail tip always lands on the anchor's centreline; the bubble's nearest edge always clears the 8-token safe margin.

**Colour tuning.** Default fill `sys.color.primary` / label `sys.color.onPrimary` (both theme-stable). Operations re-tint per campaign by setting `--bubble-fill` and `--bubble-ink` on the bubble's inline style; the tail's `background: inherit` follows automatically. Keep contrast ≥ WCAG AA (4.5:1) — the system does not enforce.

## Default

The canonical bubble — primary fill, onPrimary label, top-centre tail, single line that truncates with an ellipsis if the copy exceeds the host width.

```preview
bubble/default
---
import { Bubble } from '@blind-dsai/ui';

<Bubble>5 new messages + gift</Bubble>
```

## Use cases

### Anchored to a top-bar icon

A [Navigation bar (home)](../navigation-bar/home.md) with three trailing actions and a bubble parked below the chat icon. Anchor sits near the right edge → bubble shifts left with `tailAlign="end"`. The two anchoring contracts in action: `top: 56px` (NavigationBar home's min-height) for zero gap to the bar; `right: 58px` so the tail tip lands on the chat icon's centreX (68 from bar right − 10 tail-internal-offset).

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
  <div style={{ position: 'absolute', top: '56px', right: '58px', display: 'flex' }}>
    <Bubble tailSide="top" tailAlign="end">5 new messages + gift</Bubble>
  </div>
</div>
```

### Tail alignment matrix

Three tail alignments stacked — `align-items: flex-start` shrink-wraps each bubble to its content (the default flex `stretch` would mask the tail offset). The viewport-safe `max-width` cap stays in force regardless of column width.

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

### Long copy

Copy that exceeds the host width truncates with an ellipsis rather than wrapping. Wrap requirements signal the message belongs in a Banner instead.

```preview
bubble/long-copy
---
import { Bubble } from '@blind-dsai/ui';

<div style={{ maxWidth: 220 }}>
  <Bubble>A long campaign label that exceeds the bubble width and truncates with an ellipsis</Bubble>
</div>
```

### Operations re-tint

`--bubble-fill` and `--bubble-ink` are the supported runtime overrides; the tail inherits the fill so a single declaration covers both surfaces.

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

- **container** — pill body. `position: relative`, `display: inline-flex`. Carries the runtime fill, ink, padding (4 block / 6 inline), pill radius. `role='note'`.
- **body** — copy in `sys.typo.caption.sm` (10 / Regular). `white-space: nowrap` + `text-overflow: ellipsis`. Colour inherits.
- **tail** — 4 × 4 square rotated 45°, `background: inherit`. Position driven by `[data-tail-side]` + `[data-tail-align]`. `aria-hidden='true'`.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill `--bubble-fill` (default `sys.color.primary`), ink `--bubble-ink` (default `sys.color.onPrimary`), `sys.layout.container.2xs` (4) padding-block, `ref.space.75` (6) padding-inline, `sys.radius.full` corner, `max-width: min(100%, calc(100vw − 2 × sys.layout.container.xs))`, `role='note'` |
| body      | `sys.typo.caption.sm` (10), `white-space: nowrap`, `text-overflow: ellipsis`, colour inherits |
| tail      | `ref.space.50` (4) square, `background: inherit`, rotated 45° via CSS transform, positioned by `[data-tail-side]` + `[data-tail-align]`, `aria-hidden='true'` |

## Appearance

Single canonical appearance — no emphasis axis, no orientation axis, no thickness prop.

| Appearance | Fill                  | Ink                    | When to use |
|------------|-----------------------|------------------------|-------------|
| `default`  | `sys.color.primary`   | `sys.color.onPrimary`  | The only mode. Theme-stable in light and dark. Override via `--bubble-fill` / `--bubble-ink`. |

## Behavior

- **Persistent.** No hover/focus trigger, no entry/exit animation, no dismissal. If the bubble should disappear, the host removes it.
- **Single line.** Body never wraps; overflow truncates with an ellipsis.
- **Host positions.** Bubble is presentational. Match the four contracts above and the tail reads as pointing at the anchor; miss any one and it reads as pointing at empty space.
- **Never occludes.** No elevation shadow, not portal-mounted. If a parent clips the bubble, fix the parent, not the bubble.
