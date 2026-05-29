# Dialog

A focused, opt-in interruption — a centred card over a scrim that holds the flow until the user makes a single decision.

**Reach for this when** the flow must pause for a definitive response — destructive actions, conflicts, consent gates, "Are you sure?". **Skip when** the same nudge can be delivered without halting the flow (use [Bottom sheet](../bottom-sheet/bottom-sheet.md)), the message is contextual to underlying content ([Banner](../banner/banner.md)), or the confirmation is post-action ([Toast](../toast/toast.md)).

**Layout inset.** `bounded-surface` — its own modal shell. Owns its outer padding; not a sibling of `full-bleed` page rows. A `full-bleed` child placed inside (List / Feed / Chip group) MUST opt out via `marginInline: 'calc(-1 * var(--sys-layout-container-md))'` (matching `width`, `maxWidth: 'none'`) so its own row padding becomes the visual inset and the dialog title aligns with row leading content. See [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A confirmation-style dialog with title, body, and stacked primary / tertiary actions. No image, so the text left-aligns.

```preview
dialog/default
---
import { useState } from 'react';
import { Dialog, Button } from '@blind-dsai/ui';

const [open, setOpen] = useState(false);

<>
  <Button appearance="primary" onClick={() => setOpen(true)}>Open dialog</Button>
  <Dialog
    open={open}
    onClose={() => setOpen(false)}
    title="Pick your major and get tailored job recommendations"
    body="We'll surface the companies and roles your seniors applied to most often, first."
    primaryAction={{ label: 'Pick major', onClick: () => setOpen(false) }}
    secondaryAction={{ label: 'Later', onClick: () => setOpen(false) }}
  />
</>
```

## Use cases

### With image

Pass an `image` to add a centred illustration between title and actions. With the image present, the whole stack centre-aligns. `imageFirst` (default `true`) controls whether the image sits under the title or the body.

```preview
dialog/with-image
---
import { useState } from 'react';
import { Dialog, Button } from '@blind-dsai/ui';

const [open, setOpen] = useState(false);

<>
  <Button appearance="primary" onClick={() => setOpen(true)}>Open dialog</Button>
  <Dialog
    open={open}
    onClose={() => setOpen(false)}
    title="You earned the Sourdough Starter badge"
    body="Three open-crumb bakes shared this week — your channel just lit up."
    image={{ src: '/badge.png', alt: 'Sourdough Starter badge' }}
    primaryAction={{ label: 'Share to channel', onClick: () => setOpen(false) }}
    secondaryAction={{ label: 'Not now', onClick: () => setOpen(false) }}
  />
</>
```

## Slots

- **scrim** — translucent black overlay; clicking fires `onClose`. Holds the card to a 40px inset from the wrapper's left and right edges.
- **container** — dialog card. `surfaceContainerHigh` fill, `radius.xl`, `elevation.overlay`. Caps at `max-width: 480px`. Vertical stack: title, (optional) image, body, actions.
- **title** — short headline. `heading.sm` / Semibold / `onSurface`. Always sits at the top.
- **image** *(optional)* — illustrative image between title and actions. Spans the inner width; preserves intrinsic aspect ratio.
- **body** *(optional)* — one-paragraph supporting copy. `body.sm` / Regular / `onSurfaceVariant`.
- **actions** — vertical stack at the bottom; primary on top, secondary below. Both stretch full inner width. Primary = `appearance="primary"`; secondary = `appearance="tertiary"`.

## Anatomy

| Slot         | Token bindings |
|--------------|----------------|
| scrim        | Fixed full-viewport overlay, `palette.black.600` (~24% alpha), centres container, fixed 40px inline padding |
| container    | `surfaceContainerHigh` fill, `radius.xl` (16px), `elevation.overlay`, `sys.layout.container.lg` padding, `max-width: 480px` |
| title        | `sys.typo.heading.sm` (16 / Semibold), `onSurface` |
| image        | `width: 100%`, `height: auto`, `radius.lg` corners, 16px above and below |
| body         | `sys.typo.body.sm` (14 / Regular), `onSurfaceVariant`, 16px above |
| actions      | Flex column, 8px between buttons, 16px above the stack |
| primary CTA  | [Button](../button/button.md) `appearance="primary"`, `size="large"`, `fullWidth` |
| secondary    | [Button](../button/button.md) `appearance="tertiary"`, `size="large"`, `fullWidth` |

**Inter-slot rhythm.** Every gap between adjacent card children is `sys.layout.stack.md` (16px).

## Alignment

- **With image** — title, body, and stack centre-align (`text-align: center`, `align-items: center`).
- **Text only** — title and body left-align (`text-align: start`, `align-items: stretch`).

Actions row is always stretched to the inner width.

## Sizes

A single rung. Card holds a fixed `max-width: 480px` and 40px gutter; below that breakpoint it fills available width.

## States

Dialog is either **open** or **closed** — closed renders nothing. When open, the underlying surface is non-interactive behind the scrim.

The container itself has no interactive state — interaction lives in the action buttons.

## Focus indicator

Dialog itself isn't a focus target; action slots inherit [Button → Outward](../button/button.md#focus-indicator) focus composition. On open, focus moves to the primary action. Trigger: `:focus-visible`.

## Behavior

- **Scrim click closes.** Card stops propagation.
- **Escape key closes.** Bound at the document level.
- **Focus management.** On open, focus moves to the primary action; returns to the previously-focused element on close.
- **Body scroll lock.** Page underneath does not scroll while the dialog is open.
- **Portal rendering.** Renders into a portal at `document.body` by default. Pass `inline` to scope to the nearest positioned ancestor (must declare `position: relative` and `overflow: hidden`).
