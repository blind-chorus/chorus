# Thumbnail list

Avatar-anchored List sub-component — each row is fronted by a 40px leading [Thumbnail](../thumbnail/thumbnail.md). Same click semantics as the [Text sub](./text.md). Row geometry, typography, divider, state overlays, and inward focus ring all delegate to the [family-wide rules](./list.md); this sub documents the leading Thumbnail slot.

**Layout inset.** `full-bleed` — Thumbnail list is an **edge-to-edge** family. It sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. Each row pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap the list in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays and the rows land at a different inset than the section headings and other lists around them. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

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
  aria-label="Suggested channels"
  items={[
    {
      value: 'product',
      label: 'Product Design',
      supportingText: '1,204 colleagues following',
      thumbnail: { alt: 'Product Design', shape: 'circle' },
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          Follow
        </Button>
      ),
    },
    {
      value: 'frontend',
      label: 'Frontend',
      supportingText: '892 colleagues following',
      thumbnail: { alt: 'Frontend', shape: 'circle' },
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          Follow
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
