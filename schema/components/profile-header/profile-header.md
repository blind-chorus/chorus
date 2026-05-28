# Profile header

Identity block at the top of a profile detail screen — a full-bleed cover band, an overlapping circular [Thumbnail](../thumbnail/thumbnail.md) avatar, an entity name, a visibility + follower meta row, and a trailing follow [Toggle Button](../button/toggle.md). Same `profile` contract as [Profile carousel](../section/profile-carousel.md) (channel topic, user, company channel) — the carousel surfaces a fixed-shape card in a curated rail; the header is the page-level identity rung the rail's `See all` lands on.

**Reach for this when** a profile detail route opens on a followable entity that needs a cover, an avatar, a single page-level heading, and a follow affordance. **Skip when** the screen is a feed list (use [Navigation bar/home](../navigation-bar/home.md) + [Feed](../feed/feed.md)), a settings or account drill-in (use [Navigation bar/page](../navigation-bar/page.md) + [Nav card](../nav-card/nav-card.md)), or a curated profile rail (use [Section](../section/section.md) + [Profile carousel](../section/profile-carousel.md)).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell at the top of the route. The cover stretches edge-to-edge inside the page-shell content box; the identity row pays its own `16px inline / 16px block` padding via `layout.container.*`. Do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

**Overlay nav.** ProfileHeader paints an overlay [Navigation bar/page](../navigation-bar/page.md) at `appearance="overlay"` absolutely positioned at the cover's top edge — transparent fill, fixed-white icons. Defaults to a back-arrow leading and a search-icon trailing; consumer wires `onBack` / `onSearch`. Opt out with `nav={false}` when the host route owns its own top chrome.

## Default

A public channel topic with a cover photo, a circular avatar, the entity name, and a `Follow` toggle.

```preview
profile-header/default
---
import { ProfileHeader } from '@blind-dsai/ui';

<ProfileHeader
  name="General Topic"
  avatar={{ src: '/placeholder.png', alt: 'General Topic' }}
  visibility="public"
  followers="999 followers"
/>
```

## Use cases

### Following

Active state — the trailing button has flipped to `Following` (`surfaceContainerHigh` + hairline outline) so the followed state recedes.

```preview
profile-header/following
---
import { ProfileHeader } from '@blind-dsai/ui';

<ProfileHeader
  name="Plant People"
  avatar={{ src: '/placeholder.png', alt: 'Plant People' }}
  visibility="public"
  followers="21.7K followers"
  followed
/>
```

### Private

Private visibility — paints the [LockIcon](../../packages/ui/src/icons/svg/Lock.svg) on the meta row in place of the globe. Reach for it when the entity is gated (members-only channel, locked company channel).

```preview
profile-header/private
---
import { ProfileHeader } from '@blind-dsai/ui';

<ProfileHeader
  name="Compensation"
  avatar={{ src: '/placeholder.png', alt: 'Compensation' }}
  visibility="private"
  followers="8.1K followers"
/>
```

### With cover image

A custom cover photo overrides the placeholder. The image is `object-fit: cover` — aspect ratio preserved, cropped to fill the 200px band.

```preview
profile-header/with-cover
---
import { ProfileHeader } from '@blind-dsai/ui';

<ProfileHeader
  name="Sourdough Bakers"
  avatar={{ src: '/placeholder.png', alt: 'Sourdough Bakers' }}
  cover={{ src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&auto=format&q=80', alt: 'Sliced loaf with open crumb' }}
  visibility="public"
  followers="12.4K followers"
/>
```

## Slots

- **container** — outer `<section>`. Vertical stack: cover band above, identity column below. `sys.color.surface` fill; no outer padding.
- **cover** — full-bleed image band at the top; 200px tall. Image-area slot (same contract as [Thumbnail](../thumbnail/thumbnail.md) and [Profile carousel](../section/profile-carousel.md) cover) — falls back to `/placeholder.png` over a `surfaceContainerHigh` underlay when no `cover.src` is supplied. Hosts the overlay nav at its top edge.
- **nav** *(optional)* — [Navigation bar/page](../navigation-bar/page.md) at `appearance="overlay"`. Absolutely positioned at the cover's top edge; transparent fill, fixed-white icons (back chevron leading, search trailing by default). Pays its own `env(safe-area-inset-top)`. Pass `nav={false}` to opt out.
- **avatar** — [Thumbnail](../thumbnail/thumbnail.md) `size={80}` overlapping the cover band's bottom edge by half its diameter (`margin-top: -40px`). Carries a 2-token (`sys.borderWidth.thin`) outset border in the host's surface tone via `box-shadow`, separating the circle from the cover.
- **identity** — vertical column under the cover. Pays `sys.layout.container.md` (16px) inline / block-end padding, no block-start padding (the action row's avatar lifts into the cover from y=0). `sys.layout.stack.xs` (8px) stack gap between the action row and the heading sub-group.
- **actionRow** — top row of the identity column. Avatar leads (overlapping the cover); follow [Toggle Button](../button/toggle.md) trails. The toggle sits `sys.layout.stack.md` (16px) below the cover bottom — independent of the avatar's lower edge — so it reads with its own breathing room.
- **heading** — sub-group bundling the name and meta row at `sys.layout.stack.2xs` (4px) gap. Sits below the action row.
- **name** — entity name. `<h1>` at `sys.typo.heading.lg` (24 / Semibold) / `sys.color.onSurface`. Single line; truncates with ellipsis.
- **meta** — visibility + follower row. `[visibility icon] [visibility label] · [followers]` in `sys.typo.body.sm` / `sys.color.onSurfaceVariant`. Single line.
- **followAction** — trailing [Toggle Button](../button/toggle.md) (`variant={'toggle'}`). `Follow` (inactive) → `Following` (active). Intrinsic width.

## Anatomy

| Slot          | Token bindings |
|---------------|----------------|
| container     | `sys.color.surface` fill, full-bleed inline, vertical stack |
| cover         | 200px tall, `sys.color.surfaceContainerHigh` underlay, `/placeholder.png` background-image, `object-fit: cover` on the inline `<img>`; `position: relative` so the overlay nav pins to its bounds |
| nav           | [Navigation bar/page](../navigation-bar/page.md) `appearance="overlay"`, absolutely positioned `inset: 0 0 auto 0` on the cover, transparent fill, `ref.palette.white.1000` icons |
| avatar        | [Thumbnail](../thumbnail/thumbnail.md) `size={80}`, `margin-top: -40px` (vertical centre on cover bottom edge), `box-shadow: 0 0 0 sys.borderWidth.thin sys.color.surface` (2-token outset halo) |
| identity      | Flex column, `padding-block: 0 sys.layout.container.md`, `padding-inline: sys.layout.container.md`, `sys.layout.stack.xs` (8) gap |
| actionRow     | Flex row, `space-between` justify, `flex-start` align; follow button carries `margin-top: sys.layout.stack.md` (16) so it sits 16px below cover bottom |
| heading       | Flex column, `sys.layout.stack.2xs` (4) gap between name and meta |
| name          | `<h1>`, `sys.typo.heading.lg` (24 / Semibold), `sys.color.onSurface`, single-line ellipsis |
| meta          | Flex row, `sys.layout.inline.sm` (4) gap, `sys.typo.body.sm` / Regular, `sys.color.onSurfaceVariant`; `·` separator before followers |
| meta icon     | `sys.icon.md` (16 × 16), `sys.color.onSurfaceVariant` |
| followAction  | [Toggle Button](../button/toggle.md) (Toolbar-Button footprint); state tokens delegate to Toggle Button |

## States

ProfileHeader itself has no lifecycle states. The trailing follow Toggle Button carries its own state per [Toggle Button](../button/toggle.md).

## Behavior

- **Page-level heading.** `name` renders as `<h1>` — the host route should not paint a second `<h1>` elsewhere on the page.
- **Cover is image-area.** Missing or failed `<img>` resolves to `/placeholder.png` over `surfaceContainerHigh`. Pass `cover.src` explicitly in design-time scaffolds so the contract reads in JSX.
- **Avatar overlap is structural.** The avatar's `margin-top: -40px` (half its diameter) lifts it so the vertical centre lands on the cover bottom edge. The follow Toggle Button carries its own `margin-top: sys.layout.stack.md` (16) so it sits 16px below the cover regardless of where the avatar lands.
- **Follow toggle commits in place.** Tapping `Follow` flips to `Following` and stays. State is owned by the consumer via `followed` + `onFollowChange`.
- **Overlay nav.** Defaults to an opt-in overlay [Navigation bar/page](../navigation-bar/page.md) at `appearance="overlay"` — transparent fill, fixed-white icons. Pass `nav={false}` to opt out when the host route already paints its own top chrome.
