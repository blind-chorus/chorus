# Toast

A transient confirmation strip that floats above the page after a user action lands — saved, copied, sent, retried. Inverse-toned by default so the message contrasts with any underlying page tier (canvas, raised card, scrim) without per-surface tuning. The strip grows with its content up to a 400 max-width (capped further to viewport-minus-safe-area on narrow screens), so a short phrase reads as a compact pill and a longer message stays a recognisable shape rather than a banner. Owner code mounts the Toast when the action resolves and unmounts it after a fixed beat; the component itself is presentational.

## Intent

Use Toast to confirm a system outcome the user just triggered — proof an action landed, without altering the page beneath. Prefer [Callout](../callout/callout.md) when the message is contextual to the content itself, not tied to a recent action.

## Default

The bare confirmation strip — body text only. Inverse surface, 48 min-height, 16 / 8 inset, single line.

```preview
toast/default
---
import { Toast } from '@blind-dsai/ui';

<Toast>Token copied to clipboard</Toast>
```

## Use cases

### With action

A small Text Button (`appearance="inverse"`) on the trailing edge for follow-through (Undo, Retry, View). When the trailing slot is present the toast stays on screen longer (~6s) so the user has time to reach for it. The Button node is passed directly so the call site spells out the sub-component the Toast delegates to.

```preview
toast/with-action
---
import { Toast, Button } from '@blind-dsai/ui';

<Toast trailing={
  <Button variant="text" size="small" appearance="inverse" onClick={() => {}}>
    Undo
  </Button>
}>
  Message deleted
</Toast>
```

### With dismiss

A medium Icon Button (`appearance="inverse"`) on the trailing edge for explicit dismissal — used when the toast carries information the user may want to read at their own pace. The Icon Button is composed at the call site (rather than via a shorthand object) so the `appearance="inverse"` binding stays visible alongside the rest of the surface contract.

```preview
toast/with-dismiss
---
import { Toast, Button } from '@blind-dsai/ui';
import { CloseIcon } from '@blind-dsai/ui/icons';

<Toast trailing={
  <Button
    variant="icon"
    size="medium"
    appearance="inverse"
    icon={<CloseIcon />}
    aria-label="Dismiss"
    onClick={() => {}}
  />
}>
  Synced 12 channels in the background
</Toast>
```

### Max width

The strip grows with its content until it hits the 400 cap (or the viewport-minus-safe-area cap on narrow screens). Past that, the body wraps onto a second line rather than letting the strip stretch into a banner. Use a body just long enough to fill the cap to see the wrap point.

```preview
toast/max-width
---
import { Toast } from '@blind-dsai/ui';

<Toast>Saved your draft to every workspace you joined this month</Toast>
```

### Truncation

The body wraps up to two lines and truncates with an ellipsis past that. Pair with a trailing dismiss when the message is the kind of status the user may want to read at their own pace — the truncated tail signals "there's more here, but it doesn't block you." Body, trailing button, and any leading glyph stay vertically centred on the container's cross axis.

```preview
toast/truncation
---
import { Toast, Button } from '@blind-dsai/ui';
import { CloseIcon } from '@blind-dsai/ui/icons';

<Toast trailing={
  <Button
    variant="icon"
    size="medium"
    appearance="inverse"
    icon={<CloseIcon />}
    aria-label="Dismiss"
    onClick={() => {}}
  />
}>
  Saved your draft and synced 12 channels across every workspace you joined this month — long enough that the body has to wrap and then truncate at two lines.
</Toast>
```

## Appearance

A single appearance — inverse. The inverse pair (`inverseSurface` / `inverseOnSurface`) is the only one the toast renders in; this is by intent, not omission. A toast that paints in a surface-family tone would read as part of the underlying page rather than as a status message floating above it.

| Appearance | Container fill              | Foreground                       | When to use |
|------------|-----------------------------|----------------------------------|-------------|
| `default`  | `sys.color.inverseSurface`  | `sys.color.inverseOnSurface`     | Every toast. Status messages that must read against any surface tier in the stack. |

## Slots

- **container** — pill-shaped strip. Horizontal flex with `align-items: center`; 16 / 8 inset; 48 min-height; content-driven width up to a 400 cap; `sys.radius.md` corners; `sys.elevation.overlay` shadow. `role="status"`, `aria-live="polite"`.
- **body** — confirmation copy. `body.sm` / Regular / inherits container foreground. Wraps when the body would push the strip past the 400 cap (or the viewport-minus-safe-area cap on narrow screens), and truncates with an ellipsis past the second line.
- **trailing** *(optional)* — a Button node. The canonical bindings are `<Button variant="text" size="small" appearance="inverse">` for an action (Undo, View, Retry) or `<Button variant="icon" size="medium" appearance="inverse">` for explicit dismissal. Right-aligned, with an `inline.xl` gap from the body.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill + foreground per appearance, `sys.radius.md` (8) corners, `sys.layout.container.md` (16) inline padding, `sys.layout.container.xs` (8) block padding, 48 min-height, `min(400px, 100vw - 2 × sys.layout.container.xs)` max-width (content-driven up to the cap), `sys.elevation.overlay` shadow, `sys.layout.container.xs` (8) safe area from the viewport edge |
| body      | `sys.typo.body.sm` (14 / Regular), color inherits, two-line clamp with `text-overflow: ellipsis` past the second line, vertically centred on the container's cross axis |
| trailing  | Pass-through Button node. Canonical bindings: `Button variant="text" size="small" appearance="inverse"` for action; `Button variant="icon" size="medium" appearance="inverse"` for dismiss. `sys.layout.inline.xl` (16) gap from the body. Both bindings rely on the inverse cluster so the label / glyph reads against the toast's `inverseSurface` fill without a per-host tweak. |

## States

Container carries no interactive state. The trailing button follows the standard Button state contract.

## Behavior

- **Lifecycle.** The component is presentational. Owner code mounts the Toast when an action resolves and unmounts it after a fixed beat — ~1.6s for a no-action toast (the read time of a short phrase), ~6s when an action slot is present so the user has time to reach for the affordance. Hover does not pause the timer; the contract is that toasts are non-essential.
- **Position.** Bottom-center of the viewport with a `sys.layout.container.xs` (8) safe area on all sides. Multiple concurrent toasts stack from bottom up.
- **Role.** Container carries `role="status"` and `aria-live="polite"` so screen readers announce the confirmation without interrupting the user's current focus. The trailing button is a discrete interactive child and remains keyboard-reachable while the toast is mounted.
