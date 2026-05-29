# Home

The landing-screen top bar — anchored to a tab root (feed, inbox, profile). A leading menu glyph plus left-aligned page name sit at the start; up to three trailing icon actions (search, chat, profile) sit at the end. Title carries the system's largest page-level rung (`typo.heading.lg`, 24/Semibold).

**Reach for this when** the screen is a tab root and needs the menu drawer plus a small set of global affordances. **Skip when** you're one step inside a flow (use [Page](./page.md)) or on a dedicated search page (use [Search](./search.md)).

**Layout inset.** `full-bleed` — direct child of the page shell. The bar pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Menu glyph, brand logotype at 24px tall, three trailing actions.

```preview
navigation-bar/home/default
---
import { NavigationBar } from '@blind-dsai/ui';
import { SearchIcon, ChatIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<NavigationBar
  variant="home"
  title={
    <img
      src="/blind_logotype_black.svg"
      alt="Chorus"
      style={{ height: 24, width: 'auto', display: 'block' }}
    />
  }
  onMenuClick={() => {}}
  trailingActions={[
    { icon: <SearchIcon />,  'aria-label': 'Search' },
    { icon: <ChatIcon />,    'aria-label': 'Messages' },
    { icon: <ProfileIcon />, 'aria-label': 'Profile' },
  ]}
/>
```

## Use cases

### With a text title in place of the logotype

Names the screen in words. Plain text at `typo.heading.lg` (24/Semibold) `onSurface`; same 24-tall rhythm as the logotype, ellipsis on narrow.

```preview
navigation-bar/home/default--text-title
---
import { NavigationBar } from '@blind-dsai/ui';
import { SearchIcon, ChatIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<NavigationBar
  variant="home"
  title="Home"
  onMenuClick={() => {}}
  trailingActions={[
    { icon: <SearchIcon />,  'aria-label': 'Search' },
    { icon: <ChatIcon />,    'aria-label': 'Messages' },
    { icon: <ProfileIcon />, 'aria-label': 'Profile' },
  ]}
/>
```

### With one trailing action

Single trailing affordance — e.g. search on an Inbox screen.

```preview
navigation-bar/home/single-action
---
import { NavigationBar } from '@blind-dsai/ui';
import { SearchIcon } from '@blind-dsai/ui/icons';

<NavigationBar
  variant="home"
  title="Inbox"
  trailingActions={[
    { icon: <SearchIcon />, 'aria-label': 'Search' },
  ]}
/>
```

### Truncation (safety net)

Long page name truncates with ellipsis. Author concise titles (*Home*, *Inbox*) so the bar never resorts to ellipsis.

```preview
navigation-bar/home/truncation
---
import { NavigationBar } from '@blind-dsai/ui';
import { SearchIcon, ChatIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<NavigationBar
  variant="home"
  title="A very long screen title that should truncate"
  onMenuClick={() => {}}
  trailingActions={[
    { icon: <SearchIcon />,  'aria-label': 'Search' },
    { icon: <ChatIcon />,    'aria-label': 'Messages' },
    { icon: <ProfileIcon />, 'aria-label': 'Profile' },
  ]}
/>
```

## Slots

- **leadingIcon** *(fixed)* — always the menu / hamburger ([`MenuIcon`](../../packages/ui/src/icons/svg/Menu.svg)); the single hook into the app's primary drawer.
- **title** — screen identity. Required. Default is the brand logotype at fixed 24px height (ratio preserved); a string may be passed instead — renders as `typo.heading.lg` (24/Semibold) `onSurface`, ellipsis on narrow.
- **trailingActions** *(optional)* — up to three icon actions. Conventional set: Search, Chat, Profile. Laid left-to-right with no inter-icon gap — the capsules' 8px padding provides visible separation.

## Anatomy

| Slot                  | Container          | Color                                   |
|-----------------------|--------------------|------------------------------------------|
| **Bar container**     | `sys.color.surface` fill, 8px block / 16px inline padding, no border, no shadow at rest. | — |
| **Leading icon**      | Transparent capsule, 24px glyph centred. | `sys.color.onSurface` |
| **Title**             | Brand logotype `<img>` at 24px tall (width auto) by default; plain-text fallback at `heading.lg`. Not interactive. | `sys.color.onSurface` (text fallback) |
| **Trailing icon(s)**  | Transparent capsule, 24px glyph centred. Capsules sit flush, no inter-icon gap. | `sys.color.onSurface` |

## Sizes

A single fixed rung.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Container padding (block × inline)| 8 × 16               | `sys.layout.container.xs` × `sys.layout.container.md` |
| Min-height                        | 56px                 | raw ‡                              |
| Slot gap (leading ↔ title)        | 16px                 | `sys.layout.inline.xl`             |
| Slot gap (title ↔ trailing group) | 16px                 | `sys.layout.inline.xl`             |
| Slot gap (between trailing icons) | 16px                 | `sys.layout.inline.xl` †           |
| Icon-capsule padding              | 8px                  | `sys.layout.container.xs`          |
| Title — brand logotype (default)  | 24px tall, width auto| raw — fixed pixel height           |
| Title — plain text (fallback)     | 24 / Semibold        | `sys.typo.heading.lg`              |
| Leading icon                      | 24px                 | `sys.icon.lg`                      |
| Trailing icon                     | 24px                 | `sys.icon.lg`                      |

‡ Floor of 8 + 40 + 8 = 56. Keeps a title-only row from collapsing below 56.

† Optical alignment via Icon Button's negative-margin bleed — chrome-to-chrome 16 *is* the visible glyph-to-glyph distance.

## States

The bar itself has no interactive state. Icon slots inherit [Icon Button](../button/icon.md) states. Title carries no states.

## Focus indicator

Bar isn't a focus target; icon slots inherit [Icon Button → Outward](../button/icon.md#focus-indicator). Trigger: `:focus-visible`.

## Behavior

- **Bar is page chrome.** Renders in flow; host pins (`position: sticky`) when needed.
- **Title truncates.** Long page names truncate; bar height stays 56. Safety net only — page names should be one or two words.
- **Trailing icon count.** Three is the conventional ceiling; a fourth belongs in an overflow menu.
