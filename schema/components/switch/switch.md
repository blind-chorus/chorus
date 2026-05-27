# Switch

A binary on/off control — a pill-shaped track with a circular thumb that translates between the two ends. Off reads as a muted track with an `outlineVariant` hairline; on paints the track in `primary` so the contract reads chromatically without an inline label.

**Reach for this when** a setting commits the moment it changes (notifications on/off, privacy toggles, "show in feed", instant-commit list trailing). **Skip when** the commit needs confirmation (use [Button](../button/button.md) + [Dialog](../dialog/dialog.md)), when the user picks one of several options (use [List/radio](../list/radio.md) or [Tabs](../tabs/tabs.md)), or when destructive (Switch carries no undo).

**Layout inset.** `inline` — Switch ships no padding of its own. Sits next to its label with at least `sys.layout.inline.md` (12px) gap between label and track. The host surface pays surrounding padding.

## Default

The bare Switch. Stateful — click or use Space / Enter on the keyboard to toggle.

```preview
switch/default
---
import { Switch } from '@blind-dsai/ui';

<Switch defaultChecked aria-label="Notifications" />
```

## Use cases

### Off

The resting off state — `surfaceContainerHighest` track with `outlineVariant` hairline and `onSurfaceVariant` thumb at the leading end.

```preview
switch/off
---
import { Switch } from '@blind-dsai/ui';

<Switch defaultChecked={false} aria-label="Notifications" />
```

### Disabled

`disabled` fades both on and off appearance to `sys.state.disabled` and freezes the thumb. Non-interactive.

```preview
switch/disabled
---
import { Switch } from '@blind-dsai/ui';

<div style={{ display: 'flex', gap: 'var(--sys-layout-inline-md)' }}>
  <Switch defaultChecked={false} disabled aria-label="Off, disabled" />
  <Switch defaultChecked disabled aria-label="On, disabled" />
</div>
```

### With label

The canonical pairing — a visible label sits to the left of the Switch with a `sys.layout.inline.md` (12px) gap. The label carries the accessible name via `htmlFor` + `id` or `aria-labelledby`; Switch drops `aria-label`.

```preview
switch/with-label
---
import { Switch } from '@blind-dsai/ui';

<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--sys-layout-inline-md)',
    padding: 'var(--sys-layout-container-xs) var(--sys-layout-container-md)',
  }}
>
  <span id="notif-label" style={{ font: 'var(--sys-typo-body-sm-font)', color: 'var(--sys-color-onSurface)' }}>
    Push notifications
  </span>
  <Switch defaultChecked aria-labelledby="notif-label" />
</div>
```

## Slots

- **track** — pill-shaped container. 52 × 32, fully rounded. Carries the click handler, the focus ring, and the state-overlay paint. `role="switch"`; `aria-checked` reflects on/off.
- **thumb** *(decorative)* — circular knob inside the track. 28 × 28, fully rounded. Translates between the two ends on toggle. Never a separate hit target.

## Anatomy

| Slot          | Token bindings |
|---------------|----------------|
| track (off)   | `sys.color.surfaceContainerHighest` fill, hairline `outlineVariant` stroke, fully rounded |
| track (on)    | `sys.color.primary` fill, no stroke, fully rounded |
| thumb (off)   | `sys.color.onSurfaceVariant` fill, 28 × 28, fully rounded, 2px inset from the leading edge |
| thumb (on)    | `sys.color.onPrimary` fill, 28 × 28, translated 20px to the trailing end |
| transition    | 120ms `ease-out` on track-fill, thumb-fill, and thumb-translate |

## Appearance

A single appearance — Switch has no emphasis axis. The visible variation is the `data-state="on"` / `"off"` contract.

| State | Track fill                                | Track stroke         | Thumb fill                     |
|-------|-------------------------------------------|----------------------|--------------------------------|
| off   | `sys.color.surfaceContainerHighest`       | `outlineVariant` hairline | `sys.color.onSurfaceVariant`   |
| on    | `sys.color.primary`                       | none                 | `sys.color.onPrimary`          |

## States

| State      | Overlay                       | Additional |
|------------|-------------------------------|------------|
| `default`  | —                             | Resting paint per the on/off contract. |
| `hovered`  | label tone at `sys.state.hover`   | Overlay paints across the track. |
| `pressed`  | label tone at `sys.state.pressed` | Overlay deepens; no other shift. |
| `disabled` | overlay suppressed            | Container at `sys.state.disabled` opacity; `pointer-events: none`. |

## Focus indicator

Outward 3-layer ring painted on the track's outer edge via an `::after` overlay. Trigger: `:focus-visible`. Composition: Switch sits inline next to siblings with whitespace around it, so outward reads cleanly — see [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Behavior

- **Instant commit.** `onCheckedChange` fires the moment the user releases the click or Space / Enter — no confirmation step.
- **Whole track is the click target.** The thumb is decorative; it never receives focus or events.
- **Keyboard.** Space and Enter both toggle the value when the Switch holds focus.
- **Controlled / uncontrolled.** Pass `checked` + `onCheckedChange` for controlled use, or `defaultChecked` to let Switch own the state.
