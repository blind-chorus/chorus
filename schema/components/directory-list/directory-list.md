# Directory list

A vertical follow-list — labelled block where each row pairs a 48 [Thumbnail](../thumbnail/thumbnail.md), an identity column (name + `secondary` followers + `description`), and a trailing [Toggle Button](../button/toggle.md) flipping between "Follow" and "Following". Anatomy is entity-agnostic — channels, people, companies, topics share one shape.

**Preset wrapper.** Internally this is `<Header /> + <List variant="entry" size="large" divider={false}>`. The wrapper exists to (a) map entity-flavored item keys (`name → label`, `followers → secondary`, `active/onToggle → trailingIcon`) and (b) lock the rung + divider preset for the canonical Follow-able directory shape. There is no new visual grammar — just a pinned set of `List` props plus item-key sugar.

**Reach for `<DirectoryList />` when** you want the canonical Follow-able directory shape verbatim (48 rung, no inter-row divider, Follow Toggle trailing). **Drop down to `<Header /> + <List variant="entry" />` instead when** you need any divergence — different size rung, mixed label-only and thumbnail rows, a different trailing affordance (chevron / icon button / star), per-row dividers, or a non-toggle commit pattern. **Skip when** the surface is a peek of three with horizontal paging (use [SuggestionList](../suggestion-list/suggestion-list.md)) or a label-only category index ([NavList](../nav-list/nav-list.md)).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any host that pays the gutter). Container pays its own `24px block / 16px inline` padding; each row keeps the list/entry native `16px inline padding` for the tap target and pulls its inline margin by `-16` so the visible avatar lines up with the header label at 16 from the surface. Do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Header label only, five follow-able channels at the `large` rung.

```preview
directory-list/default
---
import { DirectoryList } from '@blind-dsai/ui';

<DirectoryList
  label="New channels"
  items={[
    { value: 'devsplan',  name: 'Devs Plan',           followers: '2.1K Followers', description: 'Chat about Devs Plan launches and tips.',           thumbnail: { alt: 'Devs Plan' } },
    { value: 'passnotes', name: 'Pass Notes Together', followers: '1.4K Followers', description: 'Ghosting Blind threads on offers and promo packs.', thumbnail: { alt: 'Pass Notes Together' }, active: true },
    { value: 'cars',      name: 'Cars',                followers: '8.7K Followers', description: 'Daily-driver picks, trims, and ownership notes.',   thumbnail: { alt: 'Cars' } },
    { value: 'beauty',    name: 'Beauty Bursts',       followers: '4.2K Followers', description: 'Routines, cushion drops, scent threads.',           thumbnail: { alt: 'Beauty Bursts' } },
    { value: 'health',    name: 'Health · Diet',       followers: '11.3K Followers', description: 'Programs, macros, and weekday-meal logistics.',     thumbnail: { alt: 'Health · Diet' } },
  ]}
/>
```

## Use cases

### With header action

Extends the header with a trailing `accent` Text Button when the screen has a broader index page to route to.

```preview
directory-list/with-header-action
---
import { DirectoryList } from '@blind-dsai/ui';

<DirectoryList
  label="People you may know"
  headerAction={{ label: 'See all', href: '/people' }}
  items={[
    { value: 'jordan', name: 'Jordan Lee',    followers: '342 Followers',  description: 'PM at a logistics startup. Mostly here for roadmap reviews.',         thumbnail: { alt: 'Jordan Lee' } },
    { value: 'taylor', name: 'Taylor Brooks', followers: '1.1K Followers', description: 'Frontend engineer. Writes about the bits between framework and user.', thumbnail: { alt: 'Taylor Brooks' }, active: true },
    { value: 'morgan', name: 'Morgan Park',   followers: '512 Followers',  description: 'Designer-turned-PM. Notes on the handoff layer.',                      thumbnail: { alt: 'Morgan Park' } },
  ]}
/>
```

## Slots

- **container** — `surface` block with 24px block / 16px inline padding. Holds the header above the vertical list.
- **header** — [Header](../header/header.md) `size="large"`. Section label leading, optional accent Text Button trailing. Anchored above the list.
- **list** — embedded [List](../list/entry.md) `variant="entry"` `size="large"`. The inter-row hairline divider is suppressed (`divider={false}`); rows tile against the surface fill.
- **row** — entity entry rendered as a [list/entry](../list/entry.md) row at the `large` rung (48 Thumbnail). Each item descriptor (`name` / `followers` / `description` / `thumbnail` / `active` / `onToggle`) maps to the entry contract (`label` / `secondary` / `description` / `thumbnail` / `trailingIcon`). The row body is presentational — tapping does not route.
- **trailingAction** — [Toggle Button](../button/toggle.md), `variant="toggle"` — composed into the row's `trailingIcon` slot.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| container      | `surface` fill, 24px block / 16px inline padding, vertical stack |
| header         | [Header](../header/header.md) `size="large"`. Container stack (`sys.layout.stack.md` = 16px) separates from list. |
| label          | `heading.md` / Semibold / `onSurface` |
| headerAction   | `xsmall` [Text Button](../button/text.md), `accent` appearance |
| list           | [List](../list/entry.md) `variant="entry"` `size="large"`. `embedded` (wrapper section owns the rail). `divider={false}` (rows tile without an inter-row hairline). |
| row            | [list/entry](../list/entry.md)-shaped row at `large` rung — 48 avatar, `inline.lg` gap, label.md primary / caption.md `secondary` + `description`. Keeps the list/entry native `container.md` inline padding and adds `margin-inline: -container.md` so the avatar lines up at the section rail (16 from the surface). The inter-row hairline divider is suppressed — rows tile against the surface fill with `stack.sm` (12) breathing room from the row's intrinsic block padding. |
| trailingAction | [Toggle Button](../button/toggle.md), `variant="toggle"` — composed into the row's `trailingIcon` slot. |

## States

Container has no interactive state. Each row's only interactive surface is its **trailingAction** — a Toggle Button obeying the [Toggle Button](../button/toggle.md) state contract. Row body is presentational; tapping the row does not route. The **headerAction** is an `xsmall` Text Button (rendered as `<a>` when `href` is set).

## Focus indicator

Row body is presentational; the only row-level focus target is the trailing Toggle Button (Outward ring). headerAction also paints its own Outward ring. Composition for any future row-level focus target: Inward — rows tile with a hairline divider.

## Behavior

- **Header is required.** Every DirectoryList carries a `label`; the optional `headerAction` extends the header with a trailing `accent` Text Button when there's an index page to route to.
- **Vertical scroll, no pager.** The full list scrolls in normal document flow — reach for [SuggestionList](../suggestion-list/suggestion-list.md) instead when the surface needs a horizontal peek.
- **Toggle commits in place.** State is owned by the consumer — `active` and `onToggle` forward per row through `items`.
- **Entity-agnostic anatomy.** Same row shape carries channels, people, companies, or topics.
