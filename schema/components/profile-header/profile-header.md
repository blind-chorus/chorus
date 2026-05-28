# Profile header

Identity block at the top of a profile detail screen — a full-bleed cover band, an overlapping circular [Thumbnail](../thumbnail/thumbnail.md) avatar, an entity name, a visibility + follower meta row, and a trailing follow [Toggle Button](../button/toggle.md). Same `profile` contract as [Profile carousel](../section/profile-carousel.md) (channel topic, user, company channel) — the carousel surfaces a fixed-shape card in a curated rail; the header is the page-level identity rung the rail's `See all` lands on.

**Reach for this when** a profile detail route opens on a followable entity that needs a cover, an avatar, a single page-level heading, and a follow affordance. **Skip when** the screen is a feed list (use [Navigation bar/home](../navigation-bar/home.md) + [Feed](../feed/feed.md)), a settings or account drill-in (use [Navigation bar/page](../navigation-bar/page.md) + [Nav card](../nav-card/nav-card.md)), or a curated profile rail (use [Section](../section/section.md) + [Profile carousel](../section/profile-carousel.md)).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell at the top of the route. The cover stretches edge-to-edge inside the page-shell content box; the identity row pays its own `16px inline / 16px block` padding via `layout.container.*`. Do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

**Overlay nav.** When the route is a drill-in (`/channels/[slug]`, `/profiles/[id]`), compose a transparent [Navigation bar/page](../navigation-bar/page.md) on top of the cover — the bar pays its own `env(safe-area-inset-top)` safe area, and the cover's 200px height reserves enough room for a 56-tall bar plus the bottom half of the avatar.

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
- **cover** — full-bleed image band at the top; 200px tall. Image-area slot (same contract as [Thumbnail](../thumbnail/thumbnail.md) and [Profile carousel](../section/profile-carousel.md) cover) — falls back to `/placeholder.png` over a `surfaceContainerHigh` underlay when no `cover.src` is supplied.
- **avatar** — [Thumbnail](../thumbnail/thumbnail.md) `size={80}` overlapping the cover band's bottom edge by half its diameter. 2px surface halo around the circle separates it from the cover.
- **identity** — vertical column under the cover. Pays `sys.layout.container.md` (16px) inline / `sys.layout.container.md` (16px) block padding; `sys.layout.stack.xs` (8px) stack gap between action row, name, and meta.
- **actionRow** — top row of the identity column. Avatar leads (overlapping); follow [Toggle Button](../button/toggle.md) trails. `space-between` justify pins the two affordances to opposite edges.
- **name** — entity name. `<h1>` at `sys.typo.heading.lg` (24 / Semibold) / `sys.color.onSurface`. Single line; truncates with ellipsis.
- **meta** — visibility + follower row. `[visibility icon] [visibility label] · [followers]` in `sys.typo.body.sm` / `sys.color.onSurfaceVariant`. Single line.
- **followAction** — trailing [Toggle Button](../button/toggle.md) (`variant={'toggle'}`). `Follow` (inactive) → `Following` (active). Intrinsic width.

## Anatomy

| Slot          | Token bindings |
|---------------|----------------|
| container     | `sys.color.surface` fill, full-bleed inline, vertical stack |
| cover         | 200px tall, `sys.color.surfaceContainerHigh` underlay, `/placeholder.png` background-image, `object-fit: cover` on the inline `<img>` |
| avatar        | [Thumbnail](../thumbnail/thumbnail.md) `size={80}`, vertical center on the cover band's bottom edge, 2px `sys.color.surface` halo (box-shadow) |
| identity      | Flex column, `sys.layout.container.md` inline / block padding, `sys.layout.stack.xs` (8) gap |
| actionRow     | Flex row, `space-between` justify, `flex-end` align, negative top margin = -40px (avatar overlap) |
| name          | `<h1>`, `sys.typo.heading.lg` (24 / Semibold), `sys.color.onSurface`, single-line ellipsis |
| meta          | Flex row, `sys.layout.inline.sm` (4) gap, `sys.typo.body.sm` / Regular, `sys.color.onSurfaceVariant`; `·` separator before followers |
| meta icon     | `sys.icon.md` (16 × 16), `sys.color.onSurfaceVariant` |
| followAction  | [Toggle Button](../button/toggle.md) (Toolbar-Button footprint); state tokens delegate to Toggle Button |

## States

ProfileHeader itself has no lifecycle states. The trailing follow Toggle Button carries its own state per [Toggle Button](../button/toggle.md).

## Behavior

- **Page-level heading.** `name` renders as `<h1>` — the host route should not paint a second `<h1>` elsewhere on the page.
- **Cover is image-area.** Missing or failed `<img>` resolves to `/placeholder.png` over `surfaceContainerHigh`. Pass `cover.src` explicitly in design-time scaffolds so the contract reads in JSX.
- **Avatar overlap is structural.** The negative top margin on the identity surface (-40px = -avatar diameter / 2) achieves the overlap; the follow button is anchored to the same row but its baseline sits on the body, not the cover.
- **Follow toggle commits in place.** Tapping `Follow` flips to `Following` and stays. State is owned by the consumer via `followed` + `onFollowChange`.
- **Compatible with an overlay NavigationBar/page.** The 200px cover height reserves room for a transparent overlay [Navigation bar/page](../navigation-bar/page.md) and the bottom half of the avatar.
