# Nav list

Drill-in navigation List sub-component — rows drill into another surface. No leading slot; trailing edge auto-renders a right-pointing chevron. Row geometry, typography, divider, state overlays, and inward focus ring all delegate to the [family-wide rules](./list.md); this sub documents the auto-rendered trailing chevron.

**Layout inset.** `full-bleed` — Nav list is an **edge-to-edge** family. It sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. Each row pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap the list in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays and the trailing chevron lands at a different inset than the section headings and other lists around it. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

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

## Use cases

### With per-item trailing icon override

A row passes its own `trailingIcon` to replace the auto-rendered chevron — typically a status glyph (badge, count, external-link mark). Reach for it when a single row carries a status the rest of the list doesn't (an unread badge on `Notifications`, an external `↗` on a row that opens off-screen). The override is per-item; sibling rows keep the chevron.

```preview
list/nav-trailing-override
---
import { List } from '@blind-dsai/ui';
import { Badge } from '@blind-dsai/ui';

<List
  variant="nav"
  items={[
    { value: 'profile',  label: 'Profile',       supportingText: 'Display name, avatar, bio' },
    { value: 'channels', label: 'My channels',   supportingText: '12 joined · 3 muted' },
    { value: 'notif',    label: 'Notifications', trailingIcon: <Badge>3</Badge> },
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

No `selected` state — selection belongs to the [Radio sub](./radio.md).

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
- **Per-item trailing override.** When `items[i].trailingIcon` is set, it replaces the auto chevron for that row only.
