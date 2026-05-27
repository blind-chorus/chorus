# Textarea

Multi-line cousin of [input](./input.md) — identical chrome contract (transparent fill, inset box-shadow stroke, optional `label` / `helper` / `maxLength` group rungs); the inner element is a `<textarea>` with configurable `rows` (default 4) and vertical-only resize.

**Reach for this when** the value naturally spans multiple lines: compose surfaces, bug reports, profile bios, comment composers. **Skip when** the value is single-line ([input](./input.md)), needs a leading magnifier glyph ([search](./search.md)), or opens a sheet-driven option list ([select](./select.md)).

**Layout inset.** `inline` — ships no padding outside its own box chrome. Sits inside the host form column (settings page, Dialog body, BottomSheet compose surface) with the host paying surrounding stack rhythm and inline padding. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Labeled multi-line field with helper text. Four rows tall by default; the user drags the bottom-right resize handle to grow taller.

```preview
form-field/textarea
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="textarea"
  label="Description"
  placeholder="Add a description for your channel"
  helper="Up to 280 characters. Markdown is supported."
/>
```

## Use cases

### With character count

`maxLength` caps value length and renders a `current/max` count below the box (right-aligned). Mutually exclusive with `helper` — count wins.

```preview
form-field/textarea-count
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="textarea"
  label="Bio"
  defaultValue="Designing for clarity, building for trust."
  maxLength={140}
  rows={3}
/>
```

### Error appearance

`appearance="error"` re-tones container to `errorContainer` and stroke to `error`. The optional `helper` paints in `sys.color.error` as the error caption.

```preview
form-field/textarea-error
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="textarea"
  label="Description"
  defaultValue=""
  appearance="error"
  helper="Description is required."
/>
```

## Slots

Delegates to the family group anatomy. Single divergence vs [input](./input.md) is the inner element:

- **textarea** — multi-line editable text. `body.md` typo, `resize: vertical`, `rows` minimum. No trailing clear (multi-line content is too costly to wipe in one click).

See [input.md § Slots](./input.md#slots) for shared label / container / helper / count slots.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| group     | Same as [input.md § Anatomy](./input.md#anatomy) |
| label     | Same as input |
| container | Same chrome; `align-items: stretch` so the textarea fills the box height |
| textarea  | `sys.typo.body.md`, `resize: vertical`, `rows` floor (default 4) |
| helper    | Same as input |
| count     | Same as input |

## Behavior

- **`rows` floor.** At least `rows` tall (default 4). Drag the bottom-right handle to grow.
- **Vertical resize only.** `resize: vertical` — horizontal resize breaks the parent column's rhythm and is forbidden.
- **No clear button.** Multi-line content is too costly to wipe in one click. Users clear by selecting and deleting.
- **`maxLength` precedence.** When both `helper` and `maxLength` are supplied, count wins and `helper` is ignored. Pick one per field.
- **Disabled state.** Same as input — `sys.color.surfaceContainerLow` background at `sys.state.disabled` opacity, `cursor: not-allowed`.
