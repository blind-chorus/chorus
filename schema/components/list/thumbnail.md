# Thumbnail List

Avatar-anchored List sub-component — each row is fronted by a 40px leading [Thumbnail](../thumbnail/thumbnail.md). Same click semantics as the [Text sub](./text.md).

> Per the family-wide rules in [`list.md`](./list.md): row geometry, typography, divider, state overlays, and inward focus ring all delegate to the shared anatomy. This sub documents the leading Thumbnail slot.

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
