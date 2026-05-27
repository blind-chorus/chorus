# Input

Single-line text field — a bordered, transparent-fill box for short values. Optional label + helper or `maxLength` count compose it into a labeled group; `error` appearance re-tones fill / text / stroke.

**Reach for this when** capturing a short single-line value — name, email, search query, comment subject. **Skip when** the value is multi-line (use a textarea), a one-of-many selection (use a select), or a free-form search input with built-in results (use the [search](./search.md) sub-component).

**Layout inset.** inline — content-sized inside its surface's padding; with `label` / `helper` / `maxLength` it wraps in a `.chorus-field-group` flex column.

## Default

Transparent fill, hairline `outlineVariant` stroke, placeholder in faint `outline` colour. Type to see the lifecycle: placeholder → value, stroke steps up, trailing clear ("×") appears.

```preview
form-field/input/default
---
import { FormField } from '@blind-dsai/ui';

<FormField variant="input" placeholder="Place holder" />
```

## Use cases

### Error

`errorContainer` wash, full-strength `error` stroke, `onErrorContainer` text. Assistive helper rung re-tones to `sys.color.error`.

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

The `helper` rung is optional — pass nothing and the error field still re-tones the box. Use the helper-less form when the surrounding row already carries the failure message.

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

### Label, assistive text & count

When any of `label` / `helper` / `maxLength` is supplied, the box wraps in a `.chorus-field-group` flex column at `sys.layout.stack.xs` between rungs. Label above; helper or count below — helper left, count right. **Helper and count are mutually exclusive**; pass both and count wins.

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

Optional `leadingIcon` (16px / `sys.icon.md`) pinned inner-left. Decorative (`aria-hidden`); tracks the field's active text colour. Also available on [`select`](./select.md).

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

Compose multiple Inputs into a column via `<FormFieldGroup>`. Each rung keeps its own label / helper / count; group inserts `sys.layout.stack.md` (16px) between rungs. For sign-up / profile forms.

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

Focus ring layered on top of the `active` border re-tone.

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

## Slots

- **container** — the box. Owns transparent fill, the inset-`box-shadow` stroke, radius, padding, and focus ring.
- **input** — editable text. Single line. Value-driven placeholder swap.
- **clear** — trailing "×" button (`XCircleFillIcon`). Shown only while the box is active and holds a non-empty value.
- **group** *(optional)* — wrapper holding label / box / helper / count when any is supplied.
- **label** *(optional)* — visible label above the box.
- **helper** *(optional)* — assistive text below the box, left-aligned. Mutually exclusive with `count`.
- **count** *(optional)* — `current/max` count below the box, right-aligned. Mutually exclusive with `helper`.

## Appearance

| Appearance | Background                    | Border (rest)                                       | Text                          | Placeholder                   |
|------------|-------------------------------|-----------------------------------------------------|-------------------------------|-------------------------------|
| `default`  | `transparent`                 | `sys.color.outlineVariant` (`borderWidth.hairline`) | `sys.color.onSurface`         | `sys.color.outline`           |
| `error`    | `sys.color.errorContainer`    | `sys.color.error` (`borderWidth.hairline`)          | `sys.color.onErrorContainer`  | `sys.color.onErrorContainer`  |

Placeholder vs. value is value-driven, not focus-driven.

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

‡ Height is exactly `content + padding` (24px line-box + 2 × 8px). `min-height` binds raw `ref.space.500`.

⁋ Stroke is an inset `box-shadow`, never a `border` — zero layout cost; footprint pixel-stable in every state. See [DESIGN.md → Border & Stroke](../../DESIGN.md#border-scale).

## States

Four interactive states. Load-bearing: `active` — the field has the caret; stroke re-tones to `sys.color.onSurface` at 2px.

| State      | Stroke (inset box-shadow)                                                 | Additional |
|------------|---------------------------------------------------------------------------|------------|
| `default`  | 1px, `borderRest` (`outlineVariant` / `error`)                            | Caret hidden. |
| `hovered`  | 1px, `sys.color.outline` (error: stays `error`)                           | `:hover`. |
| `pressed`  | 1px, `sys.color.outline` + `text` overlay at `sys.state.pressed`          | `:active`. |
| `active`   | 2px, `sys.color.onSurface` (error: `error`)                               | Caret visible per the [system caret rule](../../DESIGN.md#caret). |
| `disabled` | 1px, `borderRest`; container at `sys.state.disabled` opacity              | Fill steps to `surfaceContainerLow`; overlays / clear suppressed; `cursor: not-allowed`. |

## Focus indicator

Standard outward ring on a `position: absolute` pseudo-element — never affects layout. Suppressed while `disabled`. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Behavior

- **Clear button** shown only while active and holding a non-empty value. Click empties, fires `onClear`, returns focus. Real `<button>`, keyboard-reachable, `aria-label="Clear"`.
- **Placeholder vs. value** value-driven. Placeholder shows only while empty; never the field's only accessible name — pair with a visible label or `aria-label`.
- **Single line.** Long values scroll horizontally.
