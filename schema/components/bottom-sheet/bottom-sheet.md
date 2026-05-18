# Bottom Sheet

An edge-anchored interruption — a panel that rises from the bottom of the viewport, sits over a scrim, and holds richer content than a Dialog can. Reach for Bottom Sheet when the answer needs more vertical room than a centred card affords but is still a single dismissable decision.

> Inherits the Chorus-wide rules in [`DESIGN.md`](../../DESIGN.md) — color quartets, state overlays, type scale, surface ladder, edge-anchored radius rule. Action buttons delegate to [Button](../button/button.md). This file documents only Bottom Sheet-specific composition.

## Default

An information-style sheet — title, body paragraph, and a stacked primary / secondary action pair.

```preview
bottom-sheet/default
---
import { useState } from 'react';
import { BottomSheet, Button } from '@blind-chorus/ui';

const [open, setOpen] = useState(false);

<>
  <Button appearance="primary" onClick={() => setOpen(true)}>Open sheet</Button>
  <BottomSheet
    open={open}
    onClose={() => setOpen(false)}
    title="Channel settings"
    body="Manage how this channel shows up in your feed and who can reach you here."
    primaryAction={{ label: 'Done', onClick: () => setOpen(false) }}
    secondaryAction={{ label: 'Cancel', onClick: () => setOpen(false) }}
  />
</>
```

## Use cases

### Overflow

When content exceeds the card's `max-height`, the content slot scrolls internally — handle and actions remain pinned, and the footer gains its `is-elevated` upward shadow.

```preview
bottom-sheet/overflow
---
import { useState } from 'react';
import { BottomSheet, Button, List } from '@blind-chorus/ui';

const [open, setOpen] = useState(false);

<>
  <Button appearance="primary" onClick={() => setOpen(true)}>Open sheet</Button>
  <BottomSheet
    open={open}
    onClose={() => setOpen(false)}
    title="Channels you follow"
    body="Tap a channel to manage notifications, members, and pinned posts."
    primaryAction={{ label: 'Done', onClick: () => setOpen(false) }}
    secondaryAction={{ label: 'Cancel', onClick: () => setOpen(false) }}
  >
    <List variant="nav" items={/* many rows */} />
  </BottomSheet>
</>
```

## Slots

- **scrim** — translucent black overlay; dims the host. Clicking fires `onClose`. Aligns the card to the bottom edge.
- **container** — the sheet card. `surfaceContainerHigh` fill, `radius.xl` top corners (bottom flat), `elevation.sheet` shadow, `max-width: 480px`.
- **drag handle** — small grey pill centred at the top; decorative dismissal cue.
- **content** — scrollable region holding title, body, and custom children. Title: `heading.lg` / Semibold / `onSurface`. Body: `body.md` / Regular / `onSurfaceVariant`.
- **actions** — pinned footer holding the action stack. Primary on top, secondary below; both stretch to the inner width. Primary = `Button appearance="primary"`; secondary = `Button appearance="secondary"`.

## Anatomy

| Slot         | Token bindings |
|--------------|----------------|
| scrim        | Fixed full-viewport overlay, `palette.black.600` (~24% alpha), aligns card to bottom |
| container    | `surfaceContainerHigh` fill, `radius.xl` top corners (bottom flat), `elevation.sheet`, `max-width: 480px`, `max-height: 90vh` |
| drag handle  | 48 × 4px pill, `onSurfaceVariant @ 40%`, `sys.radius.full`, 8px vertical gutter |
| content      | Flex column, 16px padding, 16px between children, vertical scroll on overflow |
| title        | `sys.typo.heading.lg` (24 / Semibold), `onSurface` |
| body         | `sys.typo.body.md` (16 / Regular), `onSurfaceVariant` |
| actions      | Flex column, 8px between buttons, 16px padding on all four sides |
| primary CTA  | [Button](../button/button.md) `appearance="primary"`, `size="large"`, `fullWidth` |
| secondary    | [Button](../button/button.md) `appearance="secondary"`, `size="large"`, `fullWidth` |

## States

The sheet is either **open** or **closed** — closed renders nothing. When open, scrim and card both render; the underlying surface is non-interactive.

The container itself carries no interactive state — interaction lives in the action buttons.

## Focus indicator

Sheet itself isn't a focus target; primary and secondary slots inherit [Button → Outward](../button/button.md#focus-indicator) focus composition. On open, focus moves to the primary action. Trigger: `:focus-visible`.

## Behavior

- **Scrim click closes.** Tapping the scrim fires `onClose`; card stops propagation.
- **Escape key closes.** `Esc` fires `onClose`.
- **Focus management.** On open, focus moves to the primary action; returns to the previously-focused element on close.
- **Body scroll lock.** The page underneath does not scroll while open.
- **Overflow scrolling.** When content exceeds `max-height`, the content slot scrolls internally; handle and actions stay pinned. Flex column: handle and actions `flex: 0 0 auto`, content `flex: 1 1 auto` with `overflow-y: auto`.
- **Elevated actions footer.** While content is overflowing, footer gains an upward drop shadow (`0 -2px 6px black/4%, 0 -8px 16px black/8%`) so it reads as pinned above the scrolling content.
- **Portal rendering.** Renders into a portal at `document.body` by default. Pass `inline` to scope to the nearest positioned ancestor.
