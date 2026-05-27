# Tab bar

The **bottom tab bar** — a horizontal strip pinned to the bottom of the app exposing top-level destinations (Home / Company / Explore / Jobs / Notifications) in one tap. Each item stacks a 24px glyph above a 10/Regular label; the active item shows the filled companion glyph at `onSurface` while inactive items render the outline at `onSurfaceVariant`. An item may opt into `appearance="primary"` to render a tile-shaped commit affordance — the conventional **Create** entry at the trailing end.

**Layout inset.** `full-bleed` — pinned chrome at the bottom of the page shell, stretching edge-to-edge. Bar owns its internal padding and tile geometry; do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Sits *outside* the `<main>` that pays `sys.layout.page.*` — TabBar is a sibling of NavigationBar in the page shell skeleton, not a `<main>` child. See [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

**Viewport safe area.** The bar's block-bottom padding pays `env(safe-area-inset-bottom)` so its `surface` background extends through the device home-indicator / gesture zone below the 56-tall content row. On non-mobile viewports `env()` resolves to 0 and the bar collapses to its original 56-tall footprint. **The page shell MUST NOT add its own `padding-bottom: env(safe-area-inset-bottom)` when a TabBar is rendered at the bottom** — the bar already pays it, and stacking would double-inset the row by the gesture-zone height.

## Default

The canonical five-destination bar. First item is active.

```preview
tab-bar/default
---
import { TabBar } from '@blind-dsai/ui';
import { HomeIcon, HomeFillIcon, BuildingIcon, BuildingFillIcon, SearchIcon, BriefcaseIcon, BriefcaseFillIcon, BellIcon, BellFillIcon } from '@blind-dsai/ui/icons';

<TabBar
  aria-label="Primary"
  value="home"
  items={[
    { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'Company',       icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
    { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,       activeIcon: <SearchFillIcon /> },
    { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <BellIcon />, activeIcon: <BellFillIcon /> },
  ]}
/>
```

## Use cases

### With a primary "Create" item

A bar including a primary-coloured **Create** affordance at the trailing end. The icon ([`PlusSquareFillIcon`](../../packages/ui/src/icons/svg/AddSquareFill.svg)) is painted in `sys.color.brand` via `appearance="primary"`. Still occupies one equal-width slot.

```preview
tab-bar/with-primary
---
import { TabBar } from '@blind-dsai/ui';
import { HomeIcon, HomeFillIcon, BuildingIcon, BuildingFillIcon, SearchIcon, SearchFillIcon, BriefcaseIcon, BriefcaseFillIcon, BellIcon, BellFillIcon, PlusSquareFillIcon } from '@blind-dsai/ui/icons';

<TabBar
  aria-label="Primary"
  value="home"
  items={[
    { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'Company',       icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
    { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,       activeIcon: <SearchFillIcon /> },
    { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <BellIcon />, activeIcon: <BellFillIcon /> },
    { value: 'create',        label: 'Create',        icon: <PlusSquareFillIcon />, appearance: 'primary' },
  ]}
/>
```

### Three-destination bar

A bar with a smaller destination set — `space-evenly` distribution scales to any item count.

```preview
tab-bar/three-destinations
---
import { TabBar } from '@blind-dsai/ui';
import { HomeIcon, HomeFillIcon, SearchIcon, SearchFillIcon, ProfileIcon, ProfileFillIcon } from '@blind-dsai/ui/icons';

<TabBar
  aria-label="Primary"
  value="explore"
  items={[
    { value: 'home',    label: 'Home',    icon: <HomeIcon />,    activeIcon: <HomeFillIcon /> },
    { value: 'explore', label: 'Explore', icon: <SearchIcon />,  activeIcon: <SearchFillIcon /> },
    { value: 'profile', label: 'Profile', icon: <ProfileIcon />, activeIcon: <ProfileFillIcon /> },
  ]}
/>
```

### Truncation

Labels exceeding their slot truncate with a single-line ellipsis. Truncation is a safety net for long i18n strings.

```preview
tab-bar/truncation
---
import { TabBar } from '@blind-dsai/ui';
import { HomeIcon, HomeFillIcon, BuildingIcon, BuildingFillIcon, SearchIcon, SearchFillIcon, ChatIcon, ChatFillIcon, BellIcon, BellFillIcon } from '@blind-dsai/ui/icons';

<TabBar
  aria-label="Primary"
  value="messages"
  items={[
    { value: 'home',          label: 'Home',                icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'My organization',     icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
    { value: 'explore',       label: 'Explore communities', icon: <SearchIcon />,       activeIcon: <SearchFillIcon /> },
    { value: 'messages',      label: 'Direct messages',     icon: <ChatIcon />,         activeIcon: <ChatFillIcon /> },
    { value: 'notifications', label: 'All notifications',   icon: <BellIcon />, activeIcon: <BellFillIcon /> },
  ]}
/>
```

### Focus indicator

Static design-review specimen — pins the keyboard-focus ring to a single destination. See top-level [Focus indicator](#focus-indicator) for composition.

```preview
tab-bar/focused
---
import { TabBar } from '@blind-dsai/ui';
import { HomeIcon, HomeFillIcon, BuildingIcon, BuildingFillIcon, SearchIcon, SearchFillIcon, BriefcaseIcon, BriefcaseFillIcon, BellIcon, BellFillIcon } from '@blind-dsai/ui/icons';

<TabBar
  aria-label="Primary"
  value="home"
  items={[
    { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
    { value: 'company',       label: 'Company',       icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
    { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,       activeIcon: <SearchFillIcon />, forcedState: 'focused' },
    { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <BellIcon />, activeIcon: <BellFillIcon /> },
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
| primary   | When `appearance="primary"`, only the **icon** paints in `sys.color.brand`; the label stays in the bar's default `sys.color.onSurfaceVariant` so every label across the row reads as one rung. Pair with a filled-tile glyph (e.g. [`PlusSquareFillIcon`](../../packages/ui/src/icons/svg/AddSquareFill.svg)) |

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

**Composition: Inward** (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) — adjacent items are flush under `flex: 1 1 0`, so outward would overlap the neighbour. Ring paints as inset shadows flush at the slot edge; state layer beneath is `onSurface`. Single-focus — at most one item holds the ring. Trigger: `:focus-visible`.

## Behavior

- **Tap an item → navigate.** Selected item swaps to filled `activeIcon`; icon + label flip to `onSurface`. No reflow on selection.
- **`appearance="primary"` items don't swap.** Primary invokes a screen-covering overlay rather than navigating; never receives `aria-current="page"`.
- **Single-select.** `value` names the active item; `onChange` fires after the item's `onClick`. Component owns no internal state.
- **Items are anchors or buttons.** `href` → `<a>`; no `href` → `<button>`. Routing belongs to the host framework.
- **Fixed row.** Never wraps, never scrolls. Author to a five- or six-item ceiling. **Bar pays its own `env(safe-area-inset-bottom)` via block-bottom padding**, so the surface fill extends through the home-indicator / gesture zone without the host shell needing to thread a padding-bottom — pinning (`position: fixed` / `position: sticky`) is still the host's job.
