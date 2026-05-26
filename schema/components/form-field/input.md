# Input

The single-line text field — a bordered, transparent-fill box for short values. An optional label and either helper text or a `maxLength` count compose it into a labeled group; the `error` appearance re-tones fill / text / stroke to the error family.

## Default

The neutral at-rest field — transparent fill, hairline `outlineVariant` stroke, placeholder in the faint `outline` colour. Type into the live specimen to see the full lifecycle — placeholder → value, stroke steps up, trailing clear ("×") appears at the right edge.

```preview
form-field/input/default
---
import { FormField } from '@blind-dsai/ui';

<FormField variant="input" placeholder="Place holder" />
```

## Error

The failed field — `errorContainer` wash, full-strength `error` stroke, `onErrorContainer` text. The assistive helper rung below the box re-tones to `sys.color.error` so the message reads as the error caption.

```preview
form-field/input/error
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="input"
  appearance="error"
  label="Label text"
  placeholder="Place holder"
  helper="Assistive text"
/>
```

The `helper` rung is intentionally **optional** on every appearance — pass nothing and the error field still re-tones the box without an assistive caption below it. Reach for the helper-less form when the surrounding row already carries the failure message.

```preview
form-field/input/error-no-helper
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="input"
  appearance="error"
  label="Label text"
  placeholder="Place holder"
/>
```

## Use cases

### Label, assistive text & count

When any of `label` / `helper` / `maxLength` is supplied, the box is wrapped in a `.chorus-field-group` (flex column at `sys.layout.stack.xs` between rungs). Label sits above; helper or count sits below — helper at the left, count at the right.

**Helper and count are mutually exclusive.** Pass both and the count is shown, `helper` ignored.

| Slot                | Token (typography)            | Token (colour)               | Notes |
|---------------------|-------------------------------|------------------------------|-------|
| `label`             | `sys.typo.label.md`           | `sys.color.onSurface`        | Bound to the input via `htmlFor`. |
| `helper`            | `sys.typo.body.sm`            | `sys.color.onSurfaceVariant` | Referenced by `aria-describedby`; re-tones to `sys.color.error` on the error appearance. |
| `count` (suffix)    | `sys.typo.body.sm`            | `sys.color.onSurfaceVariant` | Updates `aria-live="polite"`. |
| `count` (current)   | `sys.typo.label.md` (weight)  | `sys.color.onSurface`        | Live digit, stepped to `label.md` weight. |

```preview
form-field/input/with-label
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="input"
  label="Label text"
  placeholder="Place holder"
  helper="Assistive text"
/>
```

Same shape with a character count:

```preview
form-field/input/with-count
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="input"
  label="Label text"
  placeholder="Place holder"
  defaultValue="Text"
  maxLength={30}
/>
```

### Leading icon

An optional `leadingIcon` (16px / `sys.icon.md`) pins at the inner-left edge — same affordance and footprint as Search bar's glyph. Decorative (`aria-hidden`); tracks the field's active text colour (`sys.color.onSurface` on the default appearance, `sys.color.onErrorContainer` on `error`) so the glyph reads as part of the typed content rather than a recessed affordance. Also available on the [`select`](./select.md) sub-component.

```preview
form-field/input/with-leading-icon
---
import { FormField } from '@blind-dsai/ui';
import { LocationIcon } from '@blind-dsai/ui/icons';

<FormField
  variant="input"
  label="Location"
  leadingIcon={<LocationIcon />}
  placeholder="City, region"
  helper="Used to suggest local channels"
/>
```

### Group

Compose multiple Inputs into a single column via `<FormFieldGroup>`. Each rung keeps its own label / helper / count, and the group inserts `sys.layout.stack.md` (16px) between rungs — the same vertical rhythm a section of stacked labelled controls already uses. Reach for it for sign-up / profile forms where the labels stay per-field.

```preview
form-field/input/group
---
import { FormField, FormFieldGroup } from '@blind-dsai/ui';

<FormFieldGroup direction="vertical">
  <FormField variant="input" label="Name" placeholder="Your name" />
  <FormField variant="input" label="Email" placeholder="you@example.com" helper="We'll send a confirmation" />
  <FormField variant="input" label="Bio" placeholder="One sentence about you" />
</FormFieldGroup>
```

### Focus indicator

The accessibility ring layered on top of the `active` border re-tone — see [DESIGN.md → Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
form-field/input/focused
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="input"
  placeholder="Place holder"
  state="focused"
/>
```

## Appearance

One axis — **appearance** — with two values. Each specimen above carries a **Disabled** toggle in its toolbar.

| Appearance | Background                    | Border (rest)                                       | Text                          | Placeholder                   | When to reach for it                                                                                  |
|------------|-------------------------------|-----------------------------------------------------|-------------------------------|-------------------------------|--------------------------------------------------------------------------------------------------------|
| `default`  | `transparent`                 | `sys.color.outlineVariant` (`borderWidth.hairline`) | `sys.color.onSurface`         | `sys.color.outline`           | The neutral field — transparent fill so the field adopts whatever surface sits behind it.              |
| `error`    | `sys.color.errorContainer`    | `sys.color.error` (`borderWidth.hairline`)          | `sys.color.onErrorContainer`  | `sys.color.onErrorContainer`  | The failed field — a low-chroma red wash plus a full-strength `error` stroke so the field is unmistakable. |

Placeholder vs. value is value-driven, not focus-driven — see [Behavior → Placeholder vs. value](#behavior).

## Slots

- **container** — the box. Owns transparent fill, the inset-`box-shadow` stroke, radius, padding, and focus ring.
- **input** — editable text. Single line. Value in `Text` colour, placeholder in faint `Placeholder` colour; swap is value-driven.
- **clear** — trailing "×" button (`XCircleFillIcon`). Shown only while the box is active and holds a non-empty value.
- **group** *(optional)* — wrapper holding label / box / helper / count when any is supplied.
- **label** *(optional)* — visible label above the box. `sys.typo.label.md` / `sys.color.onSurface`.
- **helper** *(optional)* — assistive text below the box, left-aligned. Mutually exclusive with `count`.
- **count** *(optional)* — `current/max` count below the box, right-aligned. Mutually exclusive with `helper`.

## Sizes

A single fixed footprint.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Height                            | 40px ‡               | `ref.space.500` |
| Padding (block × inline)          | 8 × 12               | `sys.layout.container.xs` × `sys.layout.container.sm` |
| Slot gap (input ↔ clear)          | 8px                  | `sys.layout.inline.md`             |
| Radius                            | 8px                  | `sys.radius.md`                    |
| Stroke (rest / hover)             | 1px ⁋                | `sys.borderWidth.hairline`         |
| Stroke (active)                   | 2px ⁋                | `sys.borderWidth.thin`             |
| Text / placeholder                | 16 / Regular         | `sys.typo.body.md`                 |
| Clear icon                        | 16px                 | `sys.icon.md`                      |

‡ Height is exactly `content + padding` (24px line-box + 2 × 8px padding). `min-height` binds raw `ref.space.500` because `sys.*` does not expose a 40px control-height step.

⁋ **The stroke never touches the box model** — no `border` property; the visible stroke is an inset `box-shadow`. Zero layout cost, so the field's footprint is pixel-stable in every state. See [DESIGN.md → Border & Stroke](../../DESIGN.md#border-scale).

## States

Four interactive states: `default`, `hovered`, `pressed`, `active`. The load-bearing one is `active` — the field has the caret; stroke re-tones to `sys.color.onSurface` at 2px. Keyboard focus is a separate accessibility indicator (see [Focus indicator](#focus-indicator-1)).

All borders below are an inset `box-shadow`, never a `border` — every row changes only colour / width.

| State      | Stroke (inset box-shadow)                                                 | Additional |
|------------|---------------------------------------------------------------------------|------------|
| `default`  | 1px, `borderRest` (`outlineVariant` / `error`)                            | Caret hidden. |
| `hovered`  | 1px, `sys.color.outline` (error: stays `error`)                           | `:hover`. |
| `pressed`  | 1px, `sys.color.outline` + `text` overlay at `sys.state.pressed`          | `:active`. |
| `active`   | 2px, `sys.color.onSurface` (error: `error`)                               | Caret visible per the [system caret rule](../../DESIGN.md#caret). |
| `disabled` | 1px, `borderRest`; container at `sys.state.disabled` opacity              | Fill steps to `surfaceContainerLow`; overlays / clear suppressed; `cursor: not-allowed`. |

## Focus indicator

Standard ring on a `position: absolute` pseudo-element — never affects layout. Suppressed while `disabled`. Trigger: `:focus-visible`.

## Behavior

- **Clear button.** Shown only while active and holding a non-empty value. Clicking empties the value, fires `onClear`, returns focus. Real `<button>`, keyboard-reachable, `aria-label="Clear"`.
- **Placeholder vs. value.** Placeholder shows only while empty; never the field's only accessible name — pair with a visible label or `aria-label`.
- **Single line.** Long values scroll horizontally within the box.
