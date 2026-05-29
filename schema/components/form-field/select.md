# Select

Input-shaped picker — same box, label, helper, and error re-tone as [Input](./input.md), but read-only and ending in an `ArrowDownIcon` chevron. Clicking opens a Bottom Sheet with the option list; chosen value is echoed back through `value`.

**Reach for this when** the user picks one value from a known set that's too long for inline chips — country, currency, sort order, equity tier. **Skip when** the value is free text ([Input](./input.md)), the user searches an open set ([Search bar](./search.md)), or the list is short enough to surface inline as a [Radio list](../list/radio.md).

**Layout inset.** `inline` — ships no padding outside its own box chrome. Sits inside the host form column (settings page, Dialog body, BottomSheet form group) with the host paying surrounding stack rhythm and inline padding. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Neutral at-rest field — transparent fill, hairline `outlineVariant` stroke, placeholder in faint `outline` colour. The trailing 16px chevron signals that the field opens a sheet rather than a caret.

```preview
form-field/select/default
---
import { FormField } from '@blind-dsai/ui';

<FormField variant="select" placeholder="Select an option" onOpen={() => {}} />
```

## Use cases

### With leading icon

Optional `leadingIcon` (16px / `sys.icon.md`) pins inner-left — same affordance as Search bar's glyph. Available on `input` and `select`.

```preview
form-field/select/with-leading-icon
---
import { FormField } from '@blind-dsai/ui';
import { GlobeIcon } from '@blind-dsai/ui/icons';

<FormField
  variant="select"
  label="Country"
  leadingIcon={<GlobeIcon />}
  placeholder="Choose country"
/>
```

### Group

Pair a Select with an Input on one row via `<FormFieldGroup direction="horizontal">`. The group owns one shared label above and helper below; children render as bare boxes joined at `sys.layout.inline.md` gap. Typical pattern: leading Select (country dial code, currency, unit) + trailing real Input.

```preview
form-field/select/group
---
import { FormField, FormFieldGroup } from '@blind-dsai/ui';

<FormFieldGroup direction="horizontal" label="Phone number" helper="We'll text a one-time code">
  <FormField variant="select" value="+82" onOpen={() => {}} style={{ flex: '0 0 96px' }} />
  <FormField variant="input" placeholder="010-0000-0000" />
</FormFieldGroup>
```

### Focus indicator

Same as [Input → Focus indicator](./input.md#focus-indicator) — layered on top of the `active` border re-tone.

```preview
form-field/select/focused
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="select"
  placeholder="Select an option"
  state="focused"
  onOpen={() => {}}
/>
```

## Appearance

Same two-appearance axis as [Input → Appearance](./input.md#appearance) — `default` and `error`. The error re-tone covers box, chevron, label and helper rung; placeholder text steps to `onErrorContainer`.

## Slots

- **container** — same as [Input → Slots](./input.md#slots). Read-only.
- **leading** *(optional)* — 16px decorative glyph at the inner-left edge.
- **input** — read-only echo of the picked value (or placeholder when empty). Not editable.
- **dropdown** — trailing `ArrowDownIcon` chevron (16px / `sys.icon.md`). Always present; clicking it fires `onOpen` (so does parent box click).
- **label** *(optional)* / **helper** *(optional)* — same anatomy as Input. `count` is **not** offered (read-only field has nothing to count).

## Sizes

Identical footprint to [Input → Sizes](./input.md#sizes) — 40px tall, `sys.radius.md` corners, hairline rest stroke, thin active stroke as inset `box-shadow`. The trailing chevron occupies the slot Input reserves for clear.

## States

Same five states as [Input → States](./input.md#states). `active` is reached by clicking the field (the sheet then takes over) rather than by a caret.

## Focus indicator

Same composition as [Input → Focus indicator](./input.md#focus-indicator). Suppressed while `disabled`. Trigger: `:focus-visible`.

## Behavior

- **Read-only.** Does not accept keystrokes — `value` is set by the consumer when a sheet option is picked.
- **Open on click.** Clicking the box (or the chevron) fires `onOpen`. The consumer owns the `BottomSheet` state and the option list (typically a [Radio list](../list/radio.md)); on pick, closes the sheet and updates `value`. The docs preview shows the field at rest only.
- **No clear button.** Trailing slot is the chevron; clearing is done by the sheet's option list.
