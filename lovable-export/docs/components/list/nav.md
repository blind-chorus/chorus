# Nav List

Drill-in navigation List sub-component — rows drill into another surface. No leading slot; trailing edge auto-renders a right-pointing chevron. Row geometry, typography, divider, state overlays, and inward focus ring all delegate to the [family-wide rules](./list.md); this sub documents the auto-rendered trailing chevron.

## Default

A navigation list — each row drills into another surface; trailing chevron is auto-rendered.

```preview
list/nav
---
import { List } from '@blind-dsai/ui';

<List
  variant="nav"
  items={[
    { value: 'profile',  label: 'Profile',         supportingText: 'Display name, avatar, bio' },
    { value: 'channels', label: 'My channels',     supportingText: '12 joined · 3 muted' },
    { value: 'notif',    label: 'Notifications' },
    { value: 'privacy',  label: 'Privacy' },
    { value: 'account',  label: 'Account' },
  ]}
/>
```

## Slots

- **container** — outer vertical stack (delegates to family).
- **row** — single list item; whole row is the click target.
- **leading** — omitted for this sub.
- **label** — primary row text. 16px / Regular / `onSurface`.
- **supportingText** *(optional)* — secondary line under label.
- **trailingIcon** — auto-rendered right-pointing chevron at 16px, `onSurfaceVariant`. A per-item `trailingIcon` overrides.

## States

No `selected` state.

## Focus indicator

Inward 3-layer ring inside the row's bounds — see [Focus indicator](./list.md#cross-sub-contract). The preview pins **My channels** to its focused state via `forcedState: 'focused'` for static inspection.

```preview
list/focus-indicator
---
import { List } from '@blind-dsai/ui';

<List
  variant="nav"
  items={[
    { value: 'profile',  label: 'Profile',         supportingText: 'Display name, avatar, bio' },
    { value: 'channels', label: 'My channels',     supportingText: '12 joined · 3 muted',     forcedState: 'focused' },
    { value: 'notif',    label: 'Notifications' },
    { value: 'privacy',  label: 'Privacy' },
    { value: 'account',  label: 'Account' },
  ]}
/>
```

## Behavior

- **Keyboard navigation.** Arrow ↑ / ↓ moves focus; Home / End jump to first / last.
- **Row click target.** Whole row is clickable; the trailing chevron is never a separate hit target.
