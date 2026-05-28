# Nav list

A vertical label-only nav list — labelled block where each row carries a label (and an optional supporting line) plus a trailing chevron, and routes via `href` / `onClick`. Bundles a [Header](../header/header.md) over a [List](../list/nav.md) so the section title and the route group come as one composition. Anatomy is intentionally label-only; no leading thumbnail.

**Reach for this when** the screen shows a category index, settings menu, or any "pick a sub-page" set where each row is purely a route target. **Skip when** the rows need a leading thumbnail (use [DirectoryList](../directory-list/directory-list.md)) or the rows commit in place rather than route (use [List](../list/text.md) `variant="text"`).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any host that pays the gutter). Container pays its own `24px block / 16px inline` padding; each row keeps the list/nav native `16px inline padding` for the tap target and pulls its inline margin by `-16` so the visible label lines up with the header label at 16 from the surface. Do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Header label only, nine category rows with trailing chevrons.

```preview
nav-list/default
---
import { NavList } from '@blind-dsai/ui';

<NavList
  label="Category"
  items={[
    { value: 'location',      label: 'Location',              href: '/category/location' },
    { value: 'job',           label: 'Job Function',          href: '/category/job-function' },
    { value: 'learning',      label: 'Learning & Advising',   href: '/category/learning' },
    { value: 'money',         label: 'Money',                 href: '/category/money' },
    { value: 'industry',      label: 'Industry',              href: '/category/industry' },
    { value: 'worklife',      label: 'Work Life',             href: '/category/work-life' },
    { value: 'entertainment', label: 'Entertainment',         href: '/category/entertainment' },
    { value: 'relationships', label: 'Relationships & Social',href: '/category/relationships' },
    { value: 'culture',       label: 'Culture',               href: '/category/culture' },
  ]}
/>
```

## Use cases

### With header action

Extends the header with a trailing `accent` Text Button when the screen has a broader index page or "Manage" route.

```preview
nav-list/with-header-action
---
import { NavList } from '@blind-dsai/ui';

<NavList
  label="Settings"
  headerAction={{ label: 'Manage', href: '/settings/manage' }}
  items={[
    { value: 'account',      label: 'Account',       href: '/settings/account' },
    { value: 'notifications',label: 'Notifications', href: '/settings/notifications' },
    { value: 'privacy',      label: 'Privacy',       href: '/settings/privacy' },
    { value: 'appearance',   label: 'Appearance',    href: '/settings/appearance' },
    { value: 'language',     label: 'Language',      href: '/settings/language' },
  ]}
/>
```

## Slots

- **container** — `surface` block with 24px block / 16px inline padding. Holds the header above the vertical nav list.
- **header** — [Header](../header/header.md) `size="large"`. Section label leading, optional accent Text Button trailing. Anchored above the list.
- **list** — embedded [List](../list/nav.md) `variant="nav"` carrying the rows.
- **row** — single nav row rendered by [List](../list/nav.md). The label is the primary content; the trailing chevron signals drill-in.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| container      | `surface` fill, 24px block / 16px inline padding, vertical stack |
| header         | [Header](../header/header.md) `size="large"`. Container stack (`sys.layout.stack.md` = 16px) separates from list. |
| label          | `heading.md` / Semibold / `onSurface` |
| headerAction   | `xsmall` [Text Button](../button/text.md), `accent` appearance |
| list           | [List](../list/nav.md) `variant="nav"`. `embedded` (wrapper section owns the rail) |
| row            | [list/nav](../list/nav.md)-shaped row — label.md primary / caption.md supporting (optional). Keeps the list/nav native `container.md` inline padding and adds `margin-inline: -container.md` so the label lines up at the section rail (16 from the surface). Divider anchors at the row's leading text column. |
| trailingChevron| Decorative `ChevronDownIcon` rotated right via `list/nav` — `sys.icon.md` / `onSurfaceVariant`. |

## States

Each row is the interactive target — hover / pressed / focused / disabled tokens delegate to [List](../list/nav.md). The **headerAction** is an `xsmall` Text Button (rendered as `<a>` when `href` is set).

## Focus indicator

Rows take the family-wide Inward focus ring; headerAction paints its own Outward ring.

## Behavior

- **Header is required.** Every NavList carries a `label`; the optional `headerAction` extends the header with a trailing `accent` Text Button when there's an index page to route to.
- **Vertical scroll, no pager.** The full list scrolls in normal document flow.
- **Each row routes.** Rows render as `<a>` when `href` is set; otherwise `onClick` fires. Trailing chevron is decorative.
