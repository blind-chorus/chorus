# Select

Input-shaped picker — the same box, label, helper, and error re-tone as [Input](./input.md), but read-only and ending in a `DownwardIcon` chevron. Clicking the box opens a Bottom Sheet with the option list; the chosen value is echoed back through `value`.

## Default

The neutral at-rest field — transparent fill, hairline `outlineVariant` stroke, placeholder in the faint `outline` colour. The trailing 16px chevron signals that the field opens a sheet rather than a caret.

```preview
form-field/select/default
---
import { FormField } from '@blind-dsai/ui';

<FormField variant="select" placeholder="Select an option" onOpen={() => {}} />
```

## Use cases

### With leading icon

An optional `leadingIcon` (16px / `sys.icon.md`) pins at the inner-left edge — same affordance as Search bar's glyph. Available on `input` and `select`.

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

Pair a Select with an Input on one row via `<FormFieldGroup direction="horizontal">`. The group owns one shared label above and helper below; the children render as bare boxes joined at `sys.layout.inline.md` gap. The typical pattern is a leading Select (country dial code, currency, unit) plus a trailing real Input.

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

Same accessibility ring as [Input → Focus indicator](./input.md#focus-indicator) — layered on top of the `active` border re-tone.

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

Same two-appearance axis as [Input → Appearance](./input.md#appearance) — `default` and `error`. The error re-tone covers the box, chevron, label and helper rung; placeholder text steps to `onErrorContainer`.

## Slots

- **container** — same as [Input → Slots](./input.md#slots). Read-only.
- **leading** *(optional)* — 16px decorative glyph at the inner-left edge. Same affordance as Input's leading icon.
- **input** — read-only echo of the picked value (or placeholder when empty). Not editable.
- **dropdown** — trailing `DownwardIcon` chevron (16px / `sys.icon.md`). Always present; clicking it fires `onOpen` and the parent box click does the same.
- **label** *(optional)* / **helper** *(optional)* — same anatomy as Input. Mutually-exclusive `count` is **not** offered (a read-only field has nothing to count).

## Sizes

Identical footprint to [Input → Sizes](./input.md#sizes) — 40px tall, `sys.radius.md` corners, hairline rest stroke, thin active stroke as an inset `box-shadow`. The trailing chevron occupies the slot Input reserves for the clear button.

## States

Same five interactive states as [Input → States](./input.md#states). `active` is reached by the field being clicked (the sheet then takes over) rather than by a caret being present.

## Focus indicator

Same composition as [Input → Focus indicator](./input.md#focus-indicator). Suppressed while `disabled`. Trigger: `:focus-visible`.

## Behavior

- **Read-only.** The field does not accept keystrokes — `value` is set by the consumer when a sheet option is picked.
- **Open on click.** Clicking anywhere on the box (or the chevron) fires `onOpen`. The consumer owns the `BottomSheet` state and the option list (typically a [Radio list](../list/radio.md)); when a row is picked, the consumer closes the sheet and updates `value`. The docs preview shows the field at rest only — the sheet wiring is illustrative, not part of the Select primitive itself.
- **No clear button.** The trailing slot is the chevron; clearing is done by the sheet's option list.
