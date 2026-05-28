# Byline

Author / brand attribution cluster shared by [Feed Post](./post.md) and [Feed Ad](./ad.md). A leading 32-rung [Thumbnail](../thumbnail/thumbnail.md), a primary line (entity name + optional inline timestamp + optional follow toggle), and an optional secondary line (a plain `subtitle` text — canonical 'Sponsored' for ads — or an array of independently-linked `meta` items: location, job function, @handle). Optional trailing slot hosts a row-level affordance like the dismiss × button on ads. The middot separator's line-box is constrained to its font-size so the dot never inflates the surrounding text line.

**Reach for this when** composing the head of a Feed Post or Feed Ad — the cluster owns the avatar + identity + meta. **Skip when** you only need a labelled-region heading (use [Header](../header/header.md)) or a profile / channel page hero (use [Profile header](../profile-header/profile-header.md)).

**Layout inset.** `inline` — Byline ships no padding of its own. Sits inside whichever Feed sub-component composes it; the host pays surrounding rhythm.

## Default

The Feed Post shape — avatar + channel name with timestamp + meta link row (location, job, handle).

```preview
feed/byline-default
---
import { Byline } from '@blind-dsai/ui';

<Byline
  avatar={{ src: '/placeholder.png', alt: 'Sourdough Bakers' }}
  name="Sourdough Bakers"
  nameHref="#"
  timestamp="2h"
  meta={['Brooklyn, NY', 'Home baker', '@crustcrumb']}
/>
```

## Use cases

### With follow action

The inline follow toggle. A middot separates it from the timestamp; the toggle paints in `sys.color.primary` at rest and `sys.color.onSurfaceVariant` when active. The dot's line-box stays inside its font-size so the row's text-line stays tight.

```preview
feed/byline-with-follow
---
import { Byline } from '@blind-dsai/ui';

<Byline
  avatar={{ src: '/placeholder.png', alt: 'Indie Game Devs' }}
  name="Indie Game Devs"
  nameHref="#"
  timestamp="4h"
  followAction
  meta={['Solo dev', 'First release', '@sidequest']}
/>
```

### Sponsored (ad)

Feed Ad shape — `subtitle="Sponsored"` paints a plain caption-tone line under the brand name (no link affordance, no meta row). Pair with `trailing` to host the dismiss × button.

```preview
feed/byline-sponsored
---
import { Byline } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Byline
  avatar={{ src: '/placeholder.png', alt: 'Acme Coffee' }}
  name="Acme Coffee"
  subtitle="Sponsored"
  trailing={
    <button type="button" aria-label="Dismiss ad" onClick={() => {}}>
      <XIcon size={16} />
    </button>
  }
/>
```

## Slots

- **container** — outer flex row. `align-items: center`, `sys.layout.inline.md` (8px) gap between avatar, text column, and trailing slot.
- **avatar** *(optional)* — leading [Thumbnail](../thumbnail/thumbnail.md) at `size={32}`. Forwards every Thumbnail prop verbatim.
- **text** — two-line text column. Primary line on top, optional secondary line below. `flex: 1 1 auto`, `min-width: 0` so both lines truncate.
- **name** — entity name. `<a>` when `nameHref` is set, `<span>` otherwise. `sys.typo.label.sm` / `sys.color.onSurface`. Single line; truncates.
- **timestamp** *(optional)* — inline timestamp after the name. `sys.typo.caption.md` / `sys.color.outline`.
- **followAction** *(optional)* — bare-text follow toggle at the primary line's trailing edge. Preceded by a middot.
- **subtitle** *(optional, ad)* — plain caption-tone secondary line. Mutually exclusive with `meta`.
- **meta** *(optional, post)* — secondary line meta-link row. Each item is its own `<a>`; siblings separate by middot.
- **trailing** *(optional)* — trailing-edge slot. Canonical fill is the Feed Ad dismiss × button.

## Anatomy

| Slot          | Token bindings |
|---------------|----------------|
| container     | Flex row, `sys.layout.inline.md` (8) gap, `align-items: center` |
| avatar        | [Thumbnail](../thumbnail/thumbnail.md) `size={32}` |
| name          | `sys.typo.label.sm` / Semibold / `sys.color.onSurface`, single-line ellipsis |
| timestamp     | `sys.typo.caption.md` / `sys.color.outline` |
| dot separator | `·` glyph, `color: sys.color.outline`, **`line-height: 1`** so its line-box equals its font-size — never inflates the text line |
| follow        | `sys.typo.label.sm` / Semibold / `sys.color.primary` (active → `sys.color.onSurfaceVariant`) |
| subtitle      | `sys.typo.caption.md` / `sys.color.onSurfaceVariant` |
| meta          | `sys.typo.caption.md` / `sys.color.onSurfaceVariant`, links inherit; underline on hover |

## States

Byline itself has no lifecycle state. Each interactive child (name link, follow toggle, meta links, trailing button) carries its own state contract.

## Behavior

- **Dot height constrained.** Every middot separator (between primary-line items and between meta items) uses `line-height: 1` so its line-box matches its font-size. The U+00B7 glyph's natural vertical extent never inflates the parent's text-line.
- **Independent affordances.** Name and meta items are independent `<a>` links — taps land on the link, not the row. Trailing slot's clicks stop propagating so the dismiss button never commits the surrounding row.
- **Secondary line mutex.** `subtitle` and `meta` are mutually exclusive — pass one, not both. When both are passed, `meta` wins.
