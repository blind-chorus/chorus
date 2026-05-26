# Thumbnail list

Avatar-anchored List sub-component — each row is fronted by a 40px leading [Thumbnail](../thumbnail/thumbnail.md). Same click semantics as the [Text sub](./text.md). Row geometry, typography, divider, state overlays, and inward focus ring all delegate to the [family-wide rules](./list.md); this sub documents the leading Thumbnail slot.

## Default

A list anchored by leading thumbnails — channel / source / author rows. Thumbnail is fixed at the 40 rung, vertically centred against the label column.

```preview
list/thumbnail
---
import { List } from '@blind-dsai/ui';

<List
  variant="thumbnail"
  items={[
    { value: 'design-weekly', label: 'Design Weekly', supportingText: 'Updated 2h ago', thumbnail: { alt: 'Design Weekly' } },
    { value: 'frontend',      label: 'Frontend Friday', supportingText: 'Updated 1d ago', thumbnail: { alt: 'Frontend Friday' } },
    { value: 'changelog',     label: 'Changelog',       supportingText: 'Updated 3d ago', thumbnail: { alt: 'Changelog' } },
  ]}
/>
```

## Use cases

### With trailing action

A Text Button in the row's `trailingIcon` slot — the canonical "directory row + small commit" composition. Reach for it on follow / join / invite rows where the leading Thumbnail anchors the entity and the trailing button carries the only commit. The row body stays informational; the button is the only tap target for the action.

```preview
list/thumbnail-with-trailing-action
---
import { Button, List } from '@blind-dsai/ui';

<List
  variant="thumbnail"
  aria-label="채널 추천"
  items={[
    {
      value: 'product',
      label: '프로덕트 디자인',
      supportingText: '동료 1,204명이 참여 중',
      thumbnail: { alt: '프로덕트 디자인', shape: 'circle' },
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          팔로우
        </Button>
      ),
    },
    {
      value: 'frontend',
      label: '프론트엔드 개발',
      supportingText: '동료 892명이 참여 중',
      thumbnail: { alt: '프론트엔드 개발', shape: 'circle' },
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          팔로우
        </Button>
      ),
    },
  ]}
/>
```

## Slots

- **container** — outer vertical stack (delegates to family).
- **row** — single list item; whole row is the click target.
- **leading** — required. 40px [Thumbnail](../thumbnail/thumbnail.md), vertically centred. `thumbnail` props (`src`, `alt`, `updateDot`, `logoBadge`) forward verbatim.
- **label** — primary row text. 16px / Regular / `onSurface`.
- **supportingText** *(optional)* — secondary line under label.
- **trailingIcon** *(optional)* — consumer-supplied 16px glyph at the trailing edge.

## States

No `selected` state.

## Focus indicator

Inward 3-layer ring inside the row's bounds — see [Focus indicator](./list.md#cross-sub-contract).

## Behavior

- **Keyboard navigation.** Arrow ↑ / ↓ moves focus; Home / End jump to first / last.
- **Row click target.** Whole row is clickable; the thumbnail is never a separate hit target.
