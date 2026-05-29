# Bubble

Always-on annotation pill with a caret/tail pointing at an anchor UI element. Sibling of [Tooltip](../tooltip/tooltip.md): Tooltip is transient and overlays neighbours; Bubble is **persistent**, **lower visual priority**, and **never occludes neighbours**.

**Reach for this when** the annotation must stay in view at the resting state — chat-icon "new messages" flag, search-bar campaign nudge, feature-flag callout. **Skip when** the hint is invoked on demand (Tooltip), carries a decision (Banner / Dialog), or is a numeric count (Badge).

**Layout inset.** `inline`. Bubble owns its padding (4 / 6), pill radius, fill, tail, and a viewport-safe `max-width` cap. The host owns four coupled positioning decisions:

| # | Contract |
|---|---|
| 1 | Every bubble edge ≥ 8 (`sys.layout.container.xs`) from the viewport edge — width-clamping baked into CSS; position-clamping is on the host. |
| 2 | **Zero gap** between the bubble's tail-bearing edge and the anchor — the bubble sits flush; the tail's `ref.space.25` protrusion connects them. |
| 3 | **Tail tip on the anchor's centreX** (≤ 2px) — the host's inline offset must cancel the tail's `container.xs + half-tail` inset inside the bubble. |
| 4 | `tailAlign` follows the anchor: `start` (anchor near left edge), `center` (anchor centred), `end` (anchor near right edge). |

## Default

```preview
bubble/default
---
import { Bubble } from '@blind-dsai/ui';

<Bubble>5 new messages + gift</Bubble>
```

## Use cases

### Anchored to a top-bar icon

[Navigation bar (home)](../navigation-bar/home.md) + bubble below the chat icon. Anchor near the right edge → `tailAlign="end"`. `top: 56px` (zero gap to bar) + `right: 58px` (tail tip on chat centreX: 68 − 10 tail-internal-offset).

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

`align-items: flex-start` shrink-wraps each bubble to its content so the start / center / end tail offsets read at a glance.

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

Copy that overflows the host width truncates with an ellipsis. Wrap requirements signal the message belongs in a Banner.

```preview
bubble/long-copy
---
import { Bubble } from '@blind-dsai/ui';

<div style={{ maxWidth: 220 }}>
  <Bubble>A long campaign label that exceeds the bubble width and truncates with an ellipsis</Bubble>
</div>
```

### Operations re-tint

`--bubble-fill` and `--bubble-ink` are the runtime override surface; the tail's `background: inherit` follows automatically.

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

- **container** — pill body. `position: relative`, `display: inline-flex`. `role='note'`.
- **body** — copy. `white-space: nowrap` + `text-overflow: ellipsis`. Colour inherits.
- **tail** — 4 × 4 square rotated 45°, `background: inherit`. Position driven by `[data-tail-side]` + `[data-tail-align]`. `aria-hidden='true'`.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill `--bubble-fill` (default `sys.color.primary`), ink `--bubble-ink` (default `sys.color.onPrimary`), `sys.layout.container.2xs` (4) padding-block, `ref.space.75` (6) padding-inline, `sys.radius.full`, `max-width: min(100%, calc(100vw − 2 × sys.layout.container.xs))` |
| body      | `sys.typo.caption.sm` (10) |
| tail      | `ref.space.50` (4) square, rotated 45°, `background: inherit` |

## Behavior

- **Persistent.** No hover/focus trigger, no entry/exit animation, no dismissal — the host removes it.
- **Single line.** Body never wraps; overflow truncates.
- **Host positions.** Match the four contracts above or the tail reads as pointing at empty space.
- **Never occludes.** No elevation shadow, not portal-mounted. If a parent clips, fix the parent.
- **Colour tuning.** Set `--bubble-fill` / `--bubble-ink` on inline style; tail inherits the fill. Contrast ≥ WCAG AA (4.5:1) is the consumer's responsibility.
