# Callout

An in-body explanation block — a tinted card sitting within the reading flow with a short paragraph and an optional follow-through link. Reach for Callout when a passage needs a brief aside the reader can scan or skip, not for a decision (use Dialog or Bottom Sheet) or an alert.

> Inherits the Chorus-wide rules in [`DESIGN.md`](../../DESIGN.md). This file documents Callout-specific composition.

## Info

The primary-tinted appearance with body and a follow-through link. Both the body and the action paint in the primary family, so the whole callout reads as one "highlighted block" at a glance.

```preview
callout/info
---
import { Callout } from '@blind-chorus/ui';

<Callout
  appearance="info"
  action={{ label: 'How levels work', href: '#level' }}
>
  Stay active in the community to level up and unlock more of what the app offers.
</Callout>
```

## Neutral

The muted appearance — body in `onSecondaryContainer`, action link in `primary` so it carries the only chromatic emphasis on the surface.

```preview
callout/neutral
---
import { Callout } from '@blind-chorus/ui';

<Callout
  appearance="neutral"
  action={{ label: 'How levels work', href: '#level' }}
>
  Stay active in the community to level up and unlock more of what the app offers.
</Callout>
```

## Use cases

### With icon

A 32 × 32 leading illustration at the top-left; content column wraps the remaining width. Slot clips to a full-radius circle.

```preview
callout/with-icon
---
import { Callout } from '@blind-chorus/ui';

<Callout
  appearance="info"
  icon={<img src="/badge.png" alt="" />}
  action={{ label: 'How levels work', href: '#level' }}
>
  Stay active in the community to level up and unlock more of what the app offers.
</Callout>
```

## Appearance

Two appearances on the *emphasis* axis — pick by how much attention the aside should pull from the surrounding body. Callout carries no disabled state (the container is non-interactive; only the optional action link follows the link state contract).

| Appearance | Container fill            | Body / action color                                           | When to use                                                                  |
|------------|---------------------------|---------------------------------------------------------------|------------------------------------------------------------------------------|
| `info`     | `sys.color.primaryContainer`   | body in `onPrimaryContainer`, action inherits                  | Asides worth pulling the eye toward — new-feature explainers, capability nudges. |
| `neutral`  | `sys.color.secondaryContainer` | body in `onSecondaryContainer`, action steps to `sys.color.primary` | Supplementary asides the reader can pass over without missing the main flow. |

## Slots

- **container** — tinted block. Horizontal flex with `align-items: flex-start`. 12px inset on all sides; 8px gap between siblings. 8px corner radius.
- **icon** *(optional)* — 32 × 32 illustration / badge / glyph, top-aligned. Slot clips to a full-radius circle.
- **content** — vertical column holding body and optional action. 8px stack gap; fills remaining inline space.
- **body** — explanation copy. `body.sm` / Regular / inherits container foreground. Required.
- **action** *(optional)* — follow-through link below the body. `label.md` / Semibold / underlined.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill + foreground per appearance, `sys.radius.md` (8), `sys.layout.container.sm` (12) padding, `sys.layout.stack.xs` (8) sibling gap, `align-items: flex-start` |
| icon      | 32 × 32, `sys.radius.full`, `overflow: hidden` |
| content   | Flex column, `flex: 1 1 auto`, `sys.layout.stack.xs` (8) body↔action gap |
| body      | `sys.typo.body.sm` (14 / Regular), color inherits |
| action    | `sys.typo.label.md` (14 / Semibold), underlined. Inherits in `info`; steps to `sys.color.primary` in `neutral`. |

## States

Container carries no interactive state. The action link follows the standard link state contract (hover underline persists, pressed darkens).

## Behavior

- **Action link.** Renders as `<a>` accepting `href` or `onClick`. Underline persists at rest so the link reads as actionable inside the muted block.
- **Block role.** Container carries `role="note"`.
