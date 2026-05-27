# Avatar rail

A horizontal strip of channel entry points — each item routes to a channel or company page. Composes a [Thumbnail](../thumbnail/thumbnail.md) (optional `updateDot`) and a single-line label; an optional trailing action lives at the end.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge. The family owns its own internal row / header padding via `layout.container.*`; do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A four-channel rail with a trailing "View all" action.

```preview
avatar-rail/default
---
import { AvatarRail } from '@blind-dsai/ui';

<AvatarRail
  aria-label="Subscribed channels"
  items={[
    { value: 'hyundai',  label: 'Hyundai Motor',  href: '/channels/hyundai',  thumbnail: { alt: 'Hyundai', updateDot: true } },
    { value: 'samsung',  label: 'Samsung',        href: '/channels/samsung',  thumbnail: { alt: 'Samsung', updateDot: true } },
    { value: 'naver',    label: 'Naver',          href: '/channels/naver',    thumbnail: { alt: 'Naver' } },
    { value: 'mobis',    label: 'Hyundai Mobis',  href: '/channels/mobis',    thumbnail: { alt: 'Hyundai Mobis', updateDot: true } },
  ]}
  trailingAction={{ label: 'View all', href: '/channels' }}
/>
```

## Use cases

### With overflow

When the rail carries more items than the container fits, it scrolls horizontally.

```preview
avatar-rail/overflow
---
import { AvatarRail } from '@blind-dsai/ui';

<AvatarRail
  aria-label="Subscribed channels"
  items={[
    { value: 'hyundai',   label: 'Hyundai Motor',   href: '/channels/hyundai',   thumbnail: { alt: 'Hyundai', updateDot: true } },
    { value: 'samsung',   label: 'Samsung',         href: '/channels/samsung',   thumbnail: { alt: 'Samsung', updateDot: true } },
    { value: 'naver',     label: 'Naver',           href: '/channels/naver',     thumbnail: { alt: 'Naver' } },
    { value: 'mobis',     label: 'Hyundai Mobis',   href: '/channels/mobis',     thumbnail: { alt: 'Hyundai Mobis', updateDot: true } },
    { value: 'kakao',     label: 'Kakao',           href: '/channels/kakao',     thumbnail: { alt: 'Kakao' } },
    { value: 'lg',        label: 'LG Electronics',  href: '/channels/lg',        thumbnail: { alt: 'LG', updateDot: true } },
    { value: 'sk',        label: 'SK Hynix',        href: '/channels/sk',        thumbnail: { alt: 'SK Hynix' } },
    { value: 'kia',       label: 'Kia',             href: '/channels/kia',       thumbnail: { alt: 'Kia' } },
  ]}
  trailingAction={{ label: 'View all', href: '/channels' }}
/>
```

## Slots

- **container** — horizontal flex strip over `surface`. Overflows horizontally; scrollbar hidden. Never wraps.
- **item** — channel entry, rendered as `<a href>`. Stacks Thumbnail above label.
- **avatar** — [Thumbnail](../thumbnail/thumbnail.md) at the 48 rung. Forwards every other Thumbnail prop verbatim.
- **label** — channel name. `label.sm` / Regular / `onSurface`. Single line; truncates.
- **trailingAction** *(optional)* — [`small` Text Button](../button/text.md), `accent` appearance per the link-affordance rule. Renders as `<a>` when `href` is set. Vertically centred against the avatar row.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| container      | `surface` fill, `sys.layout.container.sm` / `sys.layout.container.md` (12 / 16px) padding, `sys.layout.inline.xl` (16→24px) gap between track and trailing action, scrollbar hidden |
| track          | Trailing-edge `mask-image` fade over the rightmost `ref.space.600` (48px), painted only when the track overflows |
| item           | Flex column, items centred; 8px avatar↔label; 16px between item columns |
| avatar         | [Thumbnail](../thumbnail/thumbnail.md) `size={48}` |
| label          | `label.sm` / Regular / `onSurface`, max-width 80px (matches avatar) |
| trailingAction | `small` [Text Button](../button/text.md), `accent` appearance, vertically centred against avatar row |

## Sizes

A single rung. Rail width follows its container and overflows horizontally when content exceeds the box.

## States

Container has no interactive state. Each item is a text-link affordance obeying the [Text links](../../DESIGN.md#text-links) contract — underline is the affordance, colour does not change on hover or press.

| State      | Overlay                    | Additional |
|------------|----------------------------|------------|
| `default`  | —                          | Label `onSurface`, no underline. |
| `hovered`  | —                          | 1px same-colour underline; label colour unchanged. |
| `pressed`  | `sys.state.pressed`        | Underline persists; pressed overlay tints. |
| `disabled` | overlay suppressed         | Item at `sys.state.disabled` opacity; underline suppressed. |

The trailing action is a `small` Text Button (rendered as `<a>` when `href` is set) — Text Button hover overlay + standard three-layer focus ring. Mirrors the Channel List header action; the only difference is the rung.

## Focus indicator

Standard ring painted around the item's outer edge (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)). Trigger: `:focus-visible`.

## Behavior

- **Items are anchors.** Each item is `<a href>`; routing belongs to the host framework's link integration.
- **Horizontal scroll only.** Overflowing items scroll horizontally; the rail never wraps.
- **Edge fade (conditional).** Trailing 48px fade via `mask-image`, painted only while overflow is present. Same `useScrollOverflow` hook Tabs uses.
- **No selection state.** Navigation, not a picker — no `value` / `onChange`. "Current channel" highlighting is the host's job via Thumbnail props.
- **Trailing action floats with the row.** Stays at the end of rail content; scrolling reveals it like the last item.
