# Tooltip

A trigger-anchored explanation bubble — a small contrast-toned surface with a caret that points at the host. Reach for it to surface a label or short hint that does not fit on the trigger ("Manage" on an icon button, a coach-mark). Prefer [Banner](../banner/banner.md) when the message belongs inline in the reading flow, and [Toast](../toast/toast.md) when it confirms a recent user action.

**Layout inset.** `bounded-surface` — popover shell anchored to a trigger element. Owns its outer padding and trigger-relative placement; not subject to the page shell's `layout.page.*` gutter. Mount via a portal at the document root and position relative to the trigger. See [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

The brand-blue bubble — body text only. `primary` fill with `onPrimary` foreground (both theme-stable). 32 min-height, symmetric 12 inset (`sys.layout.container.sm` on every edge), `radius.lg` corners, overlay elevation. Caret renders on the edge facing the trigger.

```preview
tooltip/default
---
import { Tooltip } from '@blind-dsai/ui';

<Tooltip placement="top">Tooltip text</Tooltip>
```

## Inverse

The dark-cluster bubble. Reach for it when the host screen is already saturated with `primary` tone — the inverse cluster (`inverseSurface` / `inverseOnSurface`) reads as a distinct floating note above the page.

```preview
tooltip/inverse
---
import { Tooltip } from '@blind-dsai/ui';

<Tooltip placement="top" appearance="inverse">Tooltip text</Tooltip>
```

## Use cases

### With action

A small Text Button for follow-through ("Learn more", "Got it"). Bind the button's `appearance` to match the tooltip — `onPrimary` for the default (brand-blue) tooltip; `inverse` for the inverse tooltip.

```preview
tooltip/with-action
---
import { Tooltip, Button } from '@blind-dsai/ui';

<Tooltip placement="top" action={
  <Button variant="text" size="small" appearance="onPrimary" onClick={() => {}}>
    Got it
  </Button>
}>
  Tooltip text
</Tooltip>
```

### Multi-line with action

When the body wraps past one line, the action slot drops below the body. The body-to-action gap goes from 12 (inline) to 6 (block) so the stacked action reads as part of the same group.

```preview
tooltip/multiline-action
---
import { Tooltip, Button } from '@blind-dsai/ui';

<Tooltip placement="bottom" action={
  <Button variant="text" size="small" appearance="onPrimary" onClick={() => {}}>
    Learn more
  </Button>
}>
  Tooltip text wraps onto a second line when it would push the bubble past the 240 cap.
</Tooltip>
```

### Placements

Six placements, named `<edge>` or `<edge>-<align>`. The `<edge>` axis (top / bottom) places the bubble above or below the trigger and chooses the caret edge; the `<align>` axis (start / center / end) shifts the caret along the parallel axis.

```preview
tooltip/placements
---
import { Tooltip } from '@blind-dsai/ui';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 'var(--sys-layout-container-xl)' }}>
  <Tooltip placement="top-start">Tooltip text</Tooltip>
  <Tooltip placement="top">Tooltip text</Tooltip>
  <Tooltip placement="top-end">Tooltip text</Tooltip>
  <Tooltip placement="bottom-start">Tooltip text</Tooltip>
  <Tooltip placement="bottom">Tooltip text</Tooltip>
  <Tooltip placement="bottom-end">Tooltip text</Tooltip>
</div>
```

## Appearance

Two appearances — `default` (the canonical brand-blue tooltip) and `inverse` (for primary-heavy screens). See [DESIGN.md → Inverse cluster](../../DESIGN.md).

| Appearance | Container fill              | Foreground                       | Pair the action button with                                   | When to use |
|------------|-----------------------------|----------------------------------|---------------------------------------------------------------|-------------|
| `default`  | `sys.color.primary`         | `sys.color.onPrimary`            | `<Button variant="text" appearance="onPrimary">`              | The canonical tooltip — brand-blue bubble, always-white label. |
| `inverse`  | `sys.color.inverseSurface`  | `sys.color.inverseOnSurface`     | `<Button variant="text" appearance="inverse">`                | When the host screen is saturated with `primary` tone — the dark inverse bubble reads as distinct floating chrome. |

`default` is the right reach in most cases; switch to `inverse` only when the surrounding surface gives the brand-blue bubble no breathing room.

## Slots

- **container** — bubble surface with the caret. Inline flex; symmetric 12 inset on every edge; 32 min-height; content-driven width up to a 240 cap; `sys.radius.lg` corners; `sys.elevation.overlay` shadow. `role="tooltip"`.
- **caret** — pointer tail on the edge facing the trigger. 8px footprint; inherits the container fill; flips per `placement` (top edge → caret on the bottom; bottom edge → caret on the top); the `-start` / `-end` aligners shift it along the parallel axis.
- **body** — hint copy. `body.sm` / Regular / inherits container foreground. Wraps within the 240 cap.
- **action** *(optional)* — a Button node. Canonical binding `<Button variant="text" size="small" appearance="onPrimary">` for the default tooltip, or `appearance="inverse"` for the inverse tooltip. Inline next to the body when the body is single-line; drops below the body once the body wraps.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill + foreground per appearance, `sys.radius.lg` (12) corners, `sys.layout.container.sm` (12) padding on every edge, 32 min-height, 240 max-width (content-driven up to the cap), `sys.elevation.overlay` shadow |
| caret     | 8px footprint, inherits container fill, flipped to the edge facing the trigger per `placement`, `sys.layout.inline.sm` (4) offset between caret tip and trigger |
| body      | `sys.typo.body.sm` (14 / Regular), color inherits, wraps within the max-width cap |
| action    | Pass-through Button node. Canonical bindings: `Button variant="text" size="small" appearance="onPrimary"` (default appearance) or `appearance="inverse"` (inverse appearance). Inline gap from body = `ref.space.150` (12); block gap when the body wraps = `ref.space.75` (6). |

`ref.space.150` (12) and `ref.space.75` (6) bind to the reference tier because `sys.layout.inline.*` and `sys.layout.stack.*` do not expose a 12-constant or 6-constant rung (per the system's "`sys.*` first, `ref.*` if no semantic alias" rule).

## Alignment

Placement is driven by where the trigger sits on the viewport. The component does not own positioning; the owner positioner enforces these rules.

- **Viewport safe area.** The bubble (chrome + caret) MUST keep at least `sys.layout.container.md` (16) clear of every viewport edge. When honouring the safe area would push the bubble off its preferred placement, flip to the opposite edge.
- **Trigger offset.** Caret tip sits `sys.layout.inline.sm` (4) from the trigger's bounding box.
- **Mirror the trigger's position.** Pick the `<align>` axis to match the trigger's horizontal position:
  - Trigger near the **leading** edge → `-start` (caret anchored to the leading edge).
  - Trigger **centred** → bare edge name (caret at the bubble's centre).
  - Trigger near the **trailing** edge → `-end` (caret anchored to the trailing edge).
- **Pick the top/bottom edge by where there's room.** Trigger in the **bottom** half → prefer `top`. Trigger in the **top** half → prefer `bottom`. Collision-flipping is the positioner's job.

## States

Container carries no interactive state. The optional action button follows the standard Button state contract.

## Behavior

- **Lifecycle.** Presentational. Owner code mounts the Tooltip while the trigger is hovered or focused. Typical reveal delay is ~400ms on hover (immediate on focus); the component does not manage the timer.
- **Role.** Container carries `role="tooltip"`. The trigger MUST own `aria-describedby` pointing at the tooltip's id so screen readers associate the hint with the host.
- **Copy.** Tooltip text may run longer than a button label, but should stay intuitive at a glance. If the message needs more, it likely belongs in a [Banner](../banner/banner.md) or [Dialog](../dialog/dialog.md).
- **Reach for this when** the message describes a hovered or focused control. **Skip when** the message belongs in the reading flow (use [Banner](../banner/banner.md)) or confirms a recent action (use [Toast](../toast/toast.md)).
