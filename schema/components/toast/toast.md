# Toast

A transient confirmation strip that floats above the page after a user action lands — saved, copied, sent, retried. Inverse-toned by default so the message contrasts with any underlying page tier; content-driven width up to a 400 cap.

**Reach for this when** you need to confirm a system outcome the user just triggered — saved, copied, sent, retried. **Skip when** the message is contextual to the content itself (use [Banner](../banner/banner.md)), or the surface is a committed confirmation prompt (use [Dialog](../dialog/dialog.md)).

**Layout inset.** `bounded-surface` — floating shell *above* the page. Anchored **bottom-center of the viewport** (`position: fixed; bottom: 0; left: 50%; transform: translateX(-50%)`) — never bottom-left, never bottom-right, never inline inside content flow. Pays its own `sys.layout.container.xs` (= **8px**) safe area on all four sides from the viewport edge; content-driven width grows up to `min(400px, 100vw - 16px)` (the `16 = 2 × 8` = the left/right safe-area margins together), so on a 320-wide viewport the strip caps at 304, and on a 600-wide viewport it caps at 400. Mount via a portal at the document root, not inside `<main>`; the page shell's `layout.page.*` gutter does NOT apply (the toast lives outside the gutter system, on its own viewport-anchored coordinate). See [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

**Trailing action / dismiss color contract — `appearance="inverse"` is mandatory.** Toast paints `inverseSurface` (dark on a light page, light on a dark page) and the trailing Button MUST bind to `appearance="inverse"` so its label / glyph reads against the inverse fill. Passing a default-appearance Text Button (the canonical link-affordance `primary` blue) produces the unreadable `primary` -on- `inverseSurface` failure mode that fails contrast and reads as "default page action accidentally floating on top of a toast". The inverse cluster is non-negotiable for both action (`<Button variant="text" size="small" appearance="inverse">`) and dismiss (`<Button variant="icon" size="medium" appearance="inverse">`).

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

A small Text Button (`appearance="inverse"`) on the trailing edge for follow-through (Undo, Retry, View). With the trailing slot present, the toast stays on screen longer (~6s). The Button node is passed directly so the call site spells out the sub-component.

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

A medium Icon Button (`appearance="inverse"`) on the trailing edge for explicit dismissal — used when the toast carries information the user may want to read at their own pace. Composed at the call site so the `appearance="inverse"` binding stays visible.

```preview
toast/with-dismiss
---
import { Toast, Button } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Toast trailing={
  <Button
    variant="icon"
    size="medium"
    appearance="inverse"
    icon={<XIcon />}
    aria-label="Dismiss"
    onClick={() => {}}
  />
}>
  Synced 12 channels in the background
</Toast>
```

### Max width

Strip grows until it hits the 400 cap (or viewport-minus-safe-area on narrow screens). Past that, the body wraps onto a second line rather than letting the strip stretch into a banner.

```preview
toast/max-width
---
import { Toast } from '@blind-dsai/ui';

<Toast>Saved your draft to every workspace you joined this month</Toast>
```

### Truncation

Body wraps up to two lines and truncates with an ellipsis past that — body, trailing button, and any leading glyph stay vertically centred. Pair with a trailing dismiss when the message is status the user may want to read at their own pace.

```preview
toast/truncation
---
import { Toast, Button } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Toast trailing={
  <Button
    variant="icon"
    size="medium"
    appearance="inverse"
    icon={<XIcon />}
    aria-label="Dismiss"
    onClick={() => {}}
  />
}>
  Saved your draft and synced 12 channels across every workspace you joined this month — long enough that the body has to wrap and then truncate at two lines.
</Toast>
```

## Appearance

A single appearance — inverse. The inverse pair (`inverseSurface` / `inverseOnSurface`) is the only one the toast renders in. A toast in a surface-family tone would read as part of the underlying page rather than a status message floating above it.

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

- **Lifecycle.** Presentational. Owner code mounts the Toast and unmounts after a fixed beat — ~1.6s for a no-action toast, ~6s when an action slot is present. Hover does not pause the timer; toasts are non-essential.
- **Position.** Bottom-center of the viewport with `sys.layout.container.xs` (8) safe area on all sides. Multiple concurrent toasts stack from bottom up.
- **Role.** Container carries `role="status"` and `aria-live="polite"` so screen readers announce the confirmation without interrupting focus. The trailing button is a discrete interactive child and remains keyboard-reachable.
