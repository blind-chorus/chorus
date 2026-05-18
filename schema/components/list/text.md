# Text List

The default List sub-component — display or navigation rows over the shared List anatomy. No leading slot; the whole row is the click target.

> Per the family-wide rules in [`list.md`](./list.md): row geometry, typography, divider, state overlays, and inward focus ring all delegate to the shared anatomy. This sub documents only Text-specific composition.

## Default

A plain text list — six menu rows with optional supporting text.

```preview
list/text
---
import { List } from '@blind-chorus/ui';

<List
  items={[
    { value: 'profile',  label: 'Profile',         supportingText: 'Name, photo, bio' },
    { value: 'notif',    label: 'Notifications',   supportingText: 'Email, push, in-app' },
    { value: 'privacy',  label: 'Privacy',         supportingText: 'Who can see your activity' },
    { value: 'language', label: 'Language' },
    { value: 'about',    label: 'About' },
  ]}
/>
```

## Slots

- **container** — outer vertical stack (delegates to family).
- **row** — single list item; whole row is the click target.
- **leading** — omitted for this sub.
- **label** — primary row text. 16px / Regular / `onSurface`.
- **supportingText** *(optional)* — secondary line under label.
- **trailingIcon** *(optional)* — consumer-supplied 16px glyph at the trailing edge.

## States

Default / hovered / pressed / disabled compose via the family-wide [State overlays](../../DESIGN.md#state-overlays) on the row foreground. No `selected` state — selection belongs to the [Radio sub](./radio.md).

## Focus indicator

Inward 3-layer ring inside the row's bounds — see the family-wide [Focus indicator](./list.md#cross-sub-contract).

## Behavior

- **Keyboard navigation.** Arrow ↑ / ↓ moves focus between rows; Home / End jump to first / last.
- **Row click target.** The whole row is clickable when `onClick` is bound to the item.
