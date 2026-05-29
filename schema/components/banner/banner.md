# Banner

An in-body explanation block — a tinted card sitting within the reading flow with a short paragraph and an optional follow-through link. Two axes: **appearance** (`default` / `accent` / `destructive`), **leading slot** (`icon` / `thumbnail` / none).

**Reach for this when** a passage needs a brief aside the reader can scan or skip. **Skip when** the message demands a decision ([Dialog](../dialog/dialog.md) / [Bottom sheet](../bottom-sheet/bottom-sheet.md)) or confirms a recent user action ([Toast](../toast/toast.md)).

**Layout inset.** inline — Banner is an inline card. It owns internal padding (`sys.layout.container.sm`), corner (`sys.radius.md`), and tinted fill, but ships **no outer margin** and does not claim the page rail. The host pays surrounding horizontal inset — page shell `layout.page.md` at the top level, or a wrapping host's container padding inside `<Section>` / `<Feed>` / `<BottomSheet>` / `<SideSheet>`. Vertical 8 is paid by the parent as `gap: var(--sys-layout-stack-xs)` on the column hosting Banner and its siblings. Never wrap Banner in a `padding-block` div or re-wrap in `<Section>` for spacing — one parent, one `gap`. See [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

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

The error-tinted appearance — `errorContainer` fill with `onErrorContainer` foreground. Reach for it when the aside is a blocking error or rejection (failed approvals, integration outages, billing). Use sparingly.

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

A leading [Thumbnail](../thumbnail/thumbnail.md) at the top-left — reach for it when the aside is anchored to a channel, author, or sub-brand image. Thumbnail owns its diameter and corner shape; the slot only top-aligns it next to the content column.

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

A 16 × 16 (`sys.icon.md`) glyph at the leading edge, painted in `currentColor`. The slot is sized to the body's first-line height so the glyph centres on the first line — multi-line bodies keep the icon anchored to the first-line cap, not the block centre. Reach for it when the aside leads with a meaning-bearing glyph rather than a brand image.

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

Two appearances on the *emphasis* axis (plus `destructive` for errors). Banner carries no disabled state; only the optional action link follows the link state contract.

| Appearance    | Container fill                                                                              | Body / action color                                                | When to use                                                                  |
|---------------|---------------------------------------------------------------------------------------------|--------------------------------------------------------------------|------------------------------------------------------------------------------|
| `default`     | `sys.color.scrimSubtle` (translucent inverse-tone scrim — ~8% black light / ~8% white dark) | body in `sys.color.onSurface`, action steps to `sys.color.primary` | Supplementary asides the reader can pass over without missing the main flow. |
| `accent`      | `sys.color.primaryContainer`                                                                | body in `onPrimaryContainer`, action inherits                      | Asides worth pulling the eye toward — new-feature explainers, capability nudges. |
| `destructive` | `sys.color.errorContainer`                                                                  | body in `onErrorContainer`, action inherits                        | Blocking errors or rejections — failed approvals, outages, billing.          |

## Slots

- **container** — tinted block. Horizontal flex with `align-items: flex-start`; 12px inset, 8px sibling gap, 8px corner radius.
- **icon** *(optional)* — 16 × 16 glyph. Slot height equals the `body.sm` line box so the glyph centres on the body's first line. Paints in `currentColor`.
- **thumbnail** *(optional)* — leading [Thumbnail](../thumbnail/thumbnail.md). Takes precedence over `icon`; footprint and corner come from Thumbnail.
- **content** — vertical column holding body and optional action; 8px stack gap; fills remaining inline space.
- **body** — explanation copy. `body.sm` / Regular / inherits container foreground. Required.
- **action** *(optional)* — follow-through link below the body. `label.md` / Semibold / underlined.

## Anatomy

| Slot      | Token bindings |
|-----------|----------------|
| container | Fill + foreground per appearance, `sys.radius.md` (8), `sys.layout.container.sm` (12) padding, `sys.layout.stack.xs` (8) sibling gap, `align-items: flex-start` |
| icon      | `sys.icon.md` (16 × 16) glyph inside a slot whose height equals the body's first-line box (`calc(sys.typo.body.sm.size * sys.typo.body.sm.line)`); `color: currentColor` |
| thumbnail | Delegated to [Thumbnail](../thumbnail/thumbnail.md); footprint-preserving (`flex: 0 0 auto`) |
| content   | Flex column, `flex: 1 1 auto`, `sys.layout.stack.xs` (8) body↔action gap |
| body      | `sys.typo.body.sm` (14 / Regular), color inherits |
| action    | `sys.typo.label.md` (14 / Semibold), underlined. Steps to `sys.color.primary` in `default`; inherits in `accent` / `destructive`. |

## States

Container carries no interactive state. The action link follows the standard link state contract — hover underline persists, pressed darkens.

## Behavior

- **Action link.** Renders as `<a>` accepting `href` or `onClick`. Underline persists at rest so the link reads as actionable inside the muted block.
- **Block role.** Container carries `role="note"`.
