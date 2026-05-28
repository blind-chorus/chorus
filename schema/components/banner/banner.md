# Banner

An in-body explanation block — a tinted card sitting within the reading flow with a short paragraph and an optional follow-through link. Reach for Banner when a passage needs a brief aside the reader can scan or skip; prefer [Dialog](../dialog/dialog.md) / [Bottom sheet](../bottom-sheet/bottom-sheet.md) when the message demands a decision, or [Toast](../toast/toast.md) when it confirms a recent user action.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge. Owns its internal padding via `layout.container.*`; do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

**Safe zone — 16 inline / 8 block.** Banner's surround is **`sys.layout.container.md` (16)** horizontal + **`sys.layout.stack.xs` (8)** vertical. The horizontal 16 is paid once by the page shell's `layout.page.md` gutter (Banner stretches to its edges); the vertical 8 is paid by the **parent** as `gap: var(--sys-layout-stack-xs)` on the column that hosts Banner and its siblings. Banner itself owns no outer margin — never wrap it in a `padding-block` div, never re-wrap it in `<Section>` to "get spacing", and never paint per-child `margin-block`. One parent, one `gap`. Violating this re-introduces the double-pay pattern [`AGENTS.md`](../../../AGENTS.md#composition-rules) prohibits.

## Default

The muted appearance — body in `onSecondaryContainer`, action link in `primary`. Supplementary asides the reader can pass over without missing the main flow.

```preview
banner/default
---
import { Banner } from '@blind-dsai/ui';

<Banner
  appearance="default"
  action={{ label: 'How levels work', href: '#level' }}
>
  Stay active in the community to level up and unlock more of what the app offers.
</Banner>
```

## Accent

The primary-tinted appearance. Body and action both paint in the primary family — reach for it when the aside should pull more attention.

```preview
banner/accent
---
import { Banner } from '@blind-dsai/ui';

<Banner
  appearance="accent"
  action={{ label: 'How levels work', href: '#level' }}
>
  Stay active in the community to level up and unlock more of what the app offers.
</Banner>
```

## Destructive

The error-tinted appearance — `errorContainer` fill with `onErrorContainer` foreground. Reach for `destructive` when the aside is a blocking error or rejection — failed approvals, integration outages, billing problems. Use sparingly.

```preview
banner/destructive
---
import { Banner } from '@blind-dsai/ui';

<Banner
  appearance="destructive"
  action={{ label: 'Retry connection', onClick: () => {} }}
>
  We could not reach the integrations service. Recent changes have not been synced.
</Banner>
```

## Use cases

### With thumbnail

A leading [Thumbnail](../thumbnail/thumbnail.md) at the top-left — reach for it when the aside is anchored to a channel, author, or sub-brand image. Thumbnail owns its own diameter and corner shape; the slot only top-aligns it next to the content column.

```preview
banner/with-thumbnail
---
import { Banner, Thumbnail } from '@blind-dsai/ui';

<Banner
  appearance="accent"
  thumbnail={<Thumbnail size={40} alt="Channel" src="/channel.png" />}
  action={{ label: 'How levels work', href: '#level' }}
>
  Stay active in the community to level up and unlock more of what the app offers.
</Banner>
```

### With icon

A 16 × 16 (`sys.icon.md`) glyph at the leading edge, painted in `currentColor` so the mark inherits the banner's foreground. The slot is sized to the body's first-line height so the glyph centres on the first line of body copy — multi-line bodies keep the icon anchored to the first-line cap, not the block centre. Reach for it when the aside leads with a meaning-bearing glyph rather than a brand image.

```preview
banner/with-icon
---
import { Banner } from '@blind-dsai/ui';
import { StarIcon } from '@blind-dsai/ui/icons';

<Banner
  appearance="accent"
  icon={<StarIcon size={16} />}
  action={{ label: 'How levels work', href: '#level' }}
>
  Stay active in the community to level up and unlock more of what the app offers.
</Banner>
```

## Appearance

Two appearances on the *emphasis* axis — pick by how much attention the aside should pull. Banner carries no disabled state; only the optional action link follows the link state contract.

| Appearance | Container fill                  | Body / action color                                                 | When to use                                                                  |
|------------|---------------------------------|---------------------------------------------------------------------|------------------------------------------------------------------------------|
| `default`  | `sys.color.scrimSubtle` (translucent inverse-tone scrim — ~8% black light / ~8% white dark) | body in `sys.color.onSurface`, action steps to `sys.color.primary` | Supplementary asides the reader can pass over without missing the main flow. |
| `accent`   | `sys.color.primaryContainer`    | body in `onPrimaryContainer`, action inherits                       | Asides worth pulling the eye toward — new-feature explainers, capability nudges. |

## Slots

- **container** — tinted block. Horizontal flex with `align-items: flex-start`. 12px inset on all sides; 8px gap between siblings. 8px corner radius.
- **icon** *(optional)* — 16 × 16 (`sys.icon.md`) glyph. Slot height equals the body.sm line box, centring the glyph on the body's first line. Paints in `currentColor`, inheriting the banner's foreground.
- **thumbnail** *(optional)* — leading [Thumbnail](../thumbnail/thumbnail.md) instance for channel / author / sub-brand imagery; takes precedence over `icon`. Footprint and corner shape come from Thumbnail itself.
- **content** — vertical column holding body and optional action. 8px stack gap; fills remaining inline space.
- **body** — explanation copy. `body.sm` / Regular / inherits container foreground. Required.
- **action** *(optional)* — follow-through link below the body. `label.md` / Semibold / underlined.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill + foreground per appearance, `sys.radius.md` (8), `sys.layout.container.sm` (12) padding, `sys.layout.stack.xs` (8) sibling gap, `align-items: flex-start` |
| icon      | `sys.icon.md` (16 × 16) glyph inside a slot whose height equals the body's first-line box (`calc(sys.typo.body.sm.size * sys.typo.body.sm.line)`), so the icon centres on the first text line; `color: currentColor` |
| thumbnail | Delegated to [Thumbnail](../thumbnail/thumbnail.md); slot is footprint-preserving (`flex: 0 0 auto`) |
| content   | Flex column, `flex: 1 1 auto`, `sys.layout.stack.xs` (8) body↔action gap |
| body      | `sys.typo.body.sm` (14 / Regular), color inherits |
| action    | `sys.typo.label.md` (14 / Semibold), underlined. Steps to `sys.color.primary` in `default`; inherits in `accent`. |

## States

Container carries no interactive state. The action link follows the standard link state contract (hover underline persists, pressed darkens).

## Behavior

- **Action link.** Renders as `<a>` accepting `href` or `onClick`. Underline persists at rest so the link reads as actionable inside the muted block.
- **Block role.** Container carries `role="note"`.
