# Bubble

A small persistent annotation pill with a caret/tail pointing at an anchor — a chat-icon "new messages" flag, a search-bar campaign nudge, a feature-flag callout. Sibling of [Tooltip](../tooltip/tooltip.md): Tooltip is transient and overlays neighbours on hover; Bubble stays in view at the resting state, sits lower in visual priority (no elevation, smaller padding, single line), and never occludes the surrounding chrome.

**Reach for this when** the annotation must remain readable as part of the resting UI. **Skip when** the hint is invoked on demand (use [Tooltip](../tooltip/tooltip.md)), carries a decision or blocking meaning (use [Banner](../banner/banner.md) / [Dialog](../dialog/dialog.md)), or is just a numeric count beside an icon (use [Badge](../badge/badge.md)).

**Layout inset.** `inline` — the host positions the bubble flush against the anchor (zero gap) with the tail tip on the anchor's horizontal centreline. The bubble caps its own `max-width` so it always keeps an 8-token margin from every viewport edge; position-clamping is the host's job. When the anchor sits near a viewport edge, the host shifts the bubble inward and picks `tailAlign` so the tail still points at it — `start` for left-edge anchors, `end` for right-edge anchors, `center` when the anchor has room on both sides.

**Colour tuning.** Default fill `sys.color.primary` / label `sys.color.onPrimary` — both theme-stable. Operations re-tint per campaign by setting `--bubble-fill` and `--bubble-ink` on inline style; the tail's `background: inherit` follows automatically.

## Default

```preview
bubble/default
---
import { Bubble } from '@blind-dsai/ui';

<Bubble>5 new messages + gift</Bubble>
```

## Use cases

### Anchored to a top-bar icon

A [Navigation bar (home)](../navigation-bar/home.md) with three trailing actions, bubble parked below the chat icon. The chat capsule sits near the bar's right edge, so the bubble extends leftward with `tailAlign="end"` — `top: 56px` for zero gap to the bar, `right: 58px` to land the tail tip on the chat icon's centre.

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

### Tail alignment

Three tail positions stacked so the offset reads at a glance — pick by where the anchor sits.

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

Copy that exceeds the host width truncates with an ellipsis. If the message can't fit on one line, it belongs in a [Banner](../banner/banner.md) instead.

```preview
bubble/long-copy
---
import { Bubble } from '@blind-dsai/ui';

<div style={{ maxWidth: 220 }}>
  <Bubble>A long campaign label that exceeds the bubble width and truncates with an ellipsis</Bubble>
</div>
```

### Operations re-tint

Brand red instead of primary blue — the tail inherits the fill, so a single declaration covers both surfaces.

```preview
bubble/recoloured
---
import { Bubble } from '@blind-dsai/ui';

<Bubble style={{ '--bubble-fill': 'var(--sys-color-brand)', '--bubble-ink': 'var(--sys-color-onBrand)' }}>
  Free daily tarot
</Bubble>
```

## Slots

- **container** — pill body. `role='note'`.
- **body** — copy. Single line; overflow truncates with an ellipsis.
- **tail** — 4 × 4 square rotated 45°, `background: inherit`. Position driven by `tailSide` + `tailAlign`. `aria-hidden`.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill `--bubble-fill` (default `sys.color.primary`), ink `--bubble-ink` (default `sys.color.onPrimary`), `sys.layout.container.2xs` padding-block, `ref.space.75` padding-inline, `sys.radius.full`, viewport-safe `max-width` cap |
| body      | `sys.typo.caption.sm` |
| tail      | `ref.space.50` square, rotated 45° |

## Behavior

- **Persistent.** No hover/focus trigger, no entry/exit animation, no dismissal — the host removes the bubble when the moment passes.
- **Single line.** Body never wraps. Overflow truncates rather than reflows.
- **Host positions.** Bubble is presentational. The four positioning rules — zero gap, tail tip on anchor centre, 8-token viewport safe margin, `tailAlign` follows anchor — are the host's contract.
- **Never occludes.** No elevation shadow, not portal-mounted. If a parent clips the bubble, fix the parent.
