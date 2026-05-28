# Image list

Avatar-anchored List sub-component — each row is fronted by a leading 40px [Thumbnail](../thumbnail/thumbnail.md) image (the sub was renamed from `thumbnail` to `image` to disambiguate the sub name from the standalone [Thumbnail](../thumbnail/thumbnail.md) family — the slot still binds to a Thumbnail; the variant just names the leading-image role rather than the atom that fills it). Single density: 40px Thumbnail + optional `supportingText` second line + optional `trailingIcon` per row (canonical: `<Button variant="text" appearance="accent">` Follow on directory rows). Same click semantics as [Text sub](./text.md). Row geometry, state overlays, and inward focus ring delegate to the [family-wide rules](./list.md); this sub documents the leading image slot and the trailing slot.

For the directory shape with identity group (label + inline count Badge + optional stacked secondary line) + optional description, reach for [list/entry](./entry.md) — the canonical home for entity-row directory cases.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell. Each row pays its own `16px inline / 8px block` padding via `layout.container.md` / `layout.container.xs`; do **not** wrap the list in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Channel / source / author rows anchored by leading thumbnails. Thumbnail fixed at the 40 rung, vertically centred against the label column.

```preview
list/image
---
import { List } from '@blind-dsai/ui';

<List
  variant="image"
  items={[
    { value: 'design-weekly', label: 'Design Weekly', supportingText: 'Updated 2h ago', thumbnail: { alt: 'Design Weekly' } },
    { value: 'frontend',      label: 'Frontend Friday', supportingText: 'Updated 1d ago', thumbnail: { alt: 'Frontend Friday' } },
    { value: 'changelog',     label: 'Changelog',       supportingText: 'Updated 3d ago', thumbnail: { alt: 'Changelog' } },
  ]}
/>
```

## Use cases

### Without divider

`divider: false` on a row suppresses its bottom hairline rule — useful when a visual group ends mid-stack and the divider would visually fence off the next group from its label. The row's footprint and inline padding stay unchanged.

```preview
list/image-without-divider
---
import { List } from '@blind-dsai/ui';

<List
  variant="image"
  items={[
    { value: 'design-weekly', label: 'Design Weekly', supportingText: 'Updated 2h ago', thumbnail: { alt: 'Design Weekly' } },
    { value: 'frontend',      label: 'Frontend Friday', supportingText: 'Updated 1d ago', thumbnail: { alt: 'Frontend Friday' }, divider: false },
    { value: 'changelog',     label: 'Changelog',       supportingText: 'Updated 3d ago', thumbnail: { alt: 'Changelog' } },
  ]}
/>
```

### With trailing action

A Text Button in the row's `trailingIcon` slot — the canonical "directory row + small commit" composition. Reach for it on follow / join / invite rows where the leading Thumbnail anchors the entity and the trailing button is the only commit. Row body stays informational.

```preview
list/image-with-trailing-action
---
import { Button, List } from '@blind-dsai/ui';

<List
  variant="image"
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
- **leading** — required. [Thumbnail](../thumbnail/thumbnail.md) at the 40 rung, vertically centred. `thumbnail` props (`src`, `alt`, `updateDot`, `logoBadge`) forward verbatim.
- **label** — primary row text. 16px / Regular / `onSurface`.
- **supportingText** *(optional)* — secondary line under label. Sits directly under the label with no extra gap.
- **trailingIcon** *(optional, per-row)* — consumer-supplied node at the trailing edge. Each row decides independently. Canonical fill: `<Button variant="text" appearance="accent">` (Follow / Invite) or a 16px icon button (favorite / overflow). Its own hit target: a tap on this slot stops propagating before it reaches the row's `onClick`.
- **divider** *(optional, per-row)* — pass `divider: false` to suppress the row's bottom hairline. Use when a visual group ends mid-stack and the divider would visually fence off the next group from its label.

## States

No `selected` state.

## Focus indicator

Inward 3-layer ring inside the row's bounds — see [Focus indicator](./list.md#cross-sub-contract).

## Behavior

- **Keyboard navigation.** Arrow ↑ / ↓ moves focus; Home / End jump to first / last.
- **Row click target.** Whole row is clickable; the thumbnail is never a separate hit target.
- **Trailing slot is its own hit target.** Clicks inside `trailingIcon` stop propagating before they reach the row — wire a favorite / mute / pin toggle there without it committing the row's primary action.
