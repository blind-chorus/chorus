# Tab Bar

The **bottom tab bar** — a horizontal strip pinned to the bottom of the app that exposes top-level destinations (Home / Company / Explore / Jobs / Notifications) in one tap. Each item stacks a 24px glyph above a 10/Regular label; the active item shows the filled companion glyph at `onSurface` while inactive items render the outline at `onSurfaceVariant`. An item may opt into `appearance="primary"` to render a tile-shaped commit affordance — the conventional **Create** entry at the trailing end.

## Default

The canonical five-destination bar. First item is active.

```preview
tab-bar/default
---
import { TabBar } from '@blind-chorus/ui';
import { HomeIcon, HomeFillIcon, CompanyIcon, CompanyFillIcon, SearchIcon, BriefcaseIcon, BriefcaseFillIcon, NotificationIcon, NotificationFillIcon } from '@blind-chorus/ui/icons';

<TabBar
  aria-label="Primary"
  value="home"
  items={[
    { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'Company',       icon: <CompanyIcon />,      activeIcon: <CompanyFillIcon /> },
    { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,       activeIcon: <SearchIcon /> },
    { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <NotificationIcon />, activeIcon: <NotificationFillIcon /> },
  ]}
/>
```

## Use cases

### With a primary "Create" item

A bar including a primary-coloured **Create** affordance at the trailing end. The icon ([`AddSquareFillIcon`](../../packages/ui/src/icons/svg/AddSquareFill.svg)) is painted in `sys.color.brand` via `appearance="primary"` — the icon's shape provides the commit-tile look. Still occupies one equal-width slot.

```preview
tab-bar/with-primary
---
import { TabBar } from '@blind-chorus/ui';
import { HomeIcon, HomeFillIcon, CompanyIcon, SearchIcon, BriefcaseIcon, NotificationIcon, AddSquareFillIcon } from '@blind-chorus/ui/icons';

<TabBar
  aria-label="Primary"
  value="home"
  items={[
    { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'Company',       icon: <CompanyIcon /> },
    { value: 'explore',       label: 'Explore',       icon: <SearchIcon /> },
    { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <NotificationIcon /> },
    { value: 'create',        label: 'Create',        icon: <AddSquareFillIcon />, appearance: 'primary' },
  ]}
/>
```

### Three-destination bar

A bar with a smaller destination set — `space-evenly` distribution scales naturally to any item count.

```preview
tab-bar/three-destinations
---
import { TabBar } from '@blind-chorus/ui';
import { HomeIcon, HomeFillIcon, SearchIcon, ProfileIcon, ProfileFillIcon } from '@blind-chorus/ui/icons';

<TabBar
  aria-label="Primary"
  value="explore"
  items={[
    { value: 'home',    label: 'Home',    icon: <HomeIcon />,    activeIcon: <HomeFillIcon /> },
    { value: 'explore', label: 'Explore', icon: <SearchIcon /> },
    { value: 'profile', label: 'Profile', icon: <ProfileIcon />, activeIcon: <ProfileFillIcon /> },
  ]}
/>
```

### Truncation

Labels exceeding their slot truncate with a single-line ellipsis. Author labels concisely — truncation is a safety net for unexpectedly long i18n strings.

```preview
tab-bar/truncation
---
import { TabBar } from '@blind-chorus/ui';
import { HomeIcon, HomeFillIcon, CompanyIcon, CompanyFillIcon, SearchIcon, ChatIcon, NotificationIcon, NotificationFillIcon } from '@blind-chorus/ui/icons';

<TabBar
  aria-label="Primary"
  value="messages"
  items={[
    { value: 'home',          label: 'Home',                icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'My organization',     icon: <CompanyIcon />,      activeIcon: <CompanyFillIcon /> },
    { value: 'explore',       label: 'Explore communities', icon: <SearchIcon /> },
    { value: 'messages',      label: 'Direct messages',     icon: <ChatIcon /> },
    { value: 'notifications', label: 'All notifications',   icon: <NotificationIcon />, activeIcon: <NotificationFillIcon /> },
  ]}
/>
```

### Focus indicator

Static design-review specimen — pins the keyboard-focus ring to a single destination. See top-level [Focus indicator](#focus-indicator) for composition.

```preview
tab-bar/focused
---
import { TabBar } from '@blind-chorus/ui';
import { HomeIcon, HomeFillIcon, CompanyIcon, CompanyFillIcon, SearchIcon, BriefcaseIcon, BriefcaseFillIcon, NotificationIcon, NotificationFillIcon } from '@blind-chorus/ui/icons';

<TabBar
  aria-label="Primary"
  value="home"
  items={[
    { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'Company',       icon: <CompanyIcon />,      activeIcon: <CompanyFillIcon /> },
    { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,                                              forcedState: 'focused' },
    { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <NotificationIcon />, activeIcon: <NotificationFillIcon /> },
  ]}
/>
```

## Slots

- **container** — horizontal `<nav>` landmark.
- **item** — a destination. `<a href>` when an `href` is supplied, else `<button>`.
- **icon** — outline glyph at rest; filled `activeIcon` when active (falls back to `icon`).
- **label** — single line; truncates with ellipsis.

## Anatomy

| Slot      | Token bindings                                                                                       |
|-----------|------------------------------------------------------------------------------------------------------|
| container | `surface` fill; top hairline `outlineVariant` divider (inset shadow); `display: flex` + `justify-content: space-evenly` |
| item      | Flex column, icon over label; `flex: 1 1 0` with `max-width: 80px`; tap target is the full slot. State layer is a `sys.radius.md` rounded rectangle filling the slot |
| icon      | `sys.color.onSurfaceVariant` → `sys.color.onSurface` (active) |
| label     | `sys.typo.caption.sm` (10 / Regular); `onSurfaceVariant` → `onSurface` (active) |
| primary   | When `appearance="primary"`, the icon paints in `sys.color.brand`. Pair with a filled-tile glyph (e.g. [`AddSquareFillIcon`](../../packages/ui/src/icons/svg/AddSquareFill.svg)) |

## Sizes

A single fixed rung.

| Property             | Value          | Token                              |
|----------------------|----------------|-------------------------------------|
| Min-height           | 56px           | raw — system bar floor             |
| Item block padding   | 4px            | `sys.layout.container.2xs`         |
| Item max-width       | 80px           | per-slot cap                       |
| Icon size            | 24px           | `sys.icon.lg`                      |
| Icon ↔ label gap     | 2px            | `sys.layout.stack.3xs`             |

## States

The container has no interactive state. Each item carries the lifecycle below — hover / pressed paint a `sys.radius.md` rounded rectangle filling the item's slot. Focus is a separate accessibility visual — see [Focus indicator](#focus-indicator).

| State      | Treatment                                                                                          |
|------------|----------------------------------------------------------------------------------------------------|
| `default`  | Outline `icon`, label at `onSurfaceVariant`. Cursor `pointer`.                                     |
| `hovered`  | State layer fills the slot, painted with `onSurface` at `sys.state.hover` (8%).                    |
| `pressed`  | State layer fills the slot, painted with `onSurface` at `sys.state.pressed` (12%).                 |
| `active`   | Filled `activeIcon`, label at `onSurface`. Item carries `aria-current="page"`. No persistent state layer. |
| `disabled` | Item at `sys.state.disabled` (40%) opacity; pointer events suppressed.                              |

## Focus indicator

**Composition: Inward** (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) — adjacent items are flush under `flex: 1 1 0`, so outward would overlap the neighbour. The ring paints as inset shadows flush at the slot edge; state layer beneath is `onSurface`. Single-focus — at most one item holds the ring at a time. Trigger: `:focus-visible`.

## Behavior

- **Tap an item → navigate.** Selected item swaps to its filled `activeIcon`; icon + label flip to `onSurface`. No reflow on selection.
- **`appearance="primary"` items don't swap.** A primary item invokes a screen-covering overlay rather than navigating; never receives `aria-current="page"`.
- **Single-select.** `value` names the active item; `onChange` fires after the item's own `onClick`. Component owns no internal state.
- **Items are anchors or buttons.** `href` → `<a>`; no `href` → `<button>`. Routing belongs to the host framework.
- **Fixed row.** Never wraps, never scrolls. Author to a five- or six-item ceiling. Host shell handles safe-area inset and pinning.
