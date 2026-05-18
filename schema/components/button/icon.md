# Icon Button

The icon-only commit surface — circular transparent target carrying a single glyph. Use when the control's identity is the glyph ([Navigation Bar](../navigation-bar/navigation-bar.md) search/chat, [Dialog](../dialog/dialog.md) dismiss, feed-row "⋯"). Two rungs: `large` 40 × 40 for page chrome and `medium` 32 × 32 for inside-control density.

> Inherits the Chorus-wide rules in [`DESIGN.md`](../../DESIGN.md) — color quartets, state overlays, focus ring composition. Cross-family contract lives in [`button.md`](./button.md). Live previews render below each section so the spec and its live behaviour sit side by side.

## Default

Transparent capsule with a single glyph. `large` (40 × 40 / 24-glyph) is the default; flip Size to `medium` (32 × 32 / 16-glyph) for the dense inside-control rung.

```preview
button/icon/default
---
import { Button } from '@blind-chorus/ui';
import { SearchIcon } from '@blind-chorus/ui/icons';

<Button variant="icon" size="large" icon={<SearchIcon />} aria-label="Search" />
```

## Use cases

### Group

Three Icon Buttons in a row — common shape on the [Navigation Bar](../navigation-bar/navigation-bar.md) Home trailing slot. Adjacent buttons sit **16px** apart (`sys.layout.inline.xl`). With optical alignment on by default, the chrome-to-chrome gap *is* the visible glyph-to-glyph distance.

```preview
button/icon/group
---
import { Button } from '@blind-chorus/ui';
import { SearchIcon, ChatIcon, ProfileIcon } from '@blind-chorus/ui/icons';

<div style={{ display: 'inline-flex', gap: 'var(--sys-layout-inline-xl)' }}>
  <Button variant="icon" icon={<SearchIcon />}  aria-label="Search" />
  <Button variant="icon" icon={<ChatIcon />}    aria-label="Messages" />
  <Button variant="icon" icon={<ProfileIcon />} aria-label="Profile" />
</div>
```

### Focus indicator

Three-layer ring over the `sys.state.focus` overlay. See [DESIGN.md → Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
button/icon/focused
---
import { Button } from '@blind-chorus/ui';
import { SearchIcon } from '@blind-chorus/ui/icons';

<Button variant="icon" icon={<SearchIcon />} aria-label="Search" state="focused" />
```

## Slots

- **icon** — required glyph, sized at the rung's icon token. Inherits foreground via `currentColor` per the [family icon-colour rule](./button.md#icon-colour-inheritance-family-wide).
- **aria-label** — required accessible name; Icon Button has no visible text.

## Anatomy

| Property              | Token                                                  |
|-----------------------|---------------------------------------------------------|
| Background (rest)     | `transparent`                                           |
| Border                | none                                                    |
| Icon color            | `sys.color.onSurface`                                   |
| Hover background      | `sys.color.onSurface` at `sys.state.hover` (8%) opacity |
| Pressed background    | `sys.color.onSurface` at `sys.state.pressed` (16%) opacity |
| Focus ring            | Standard three-layer ring — see [DESIGN.md → Focus ring composition](../../DESIGN.md#focus-ring-composition) |

## Sizes

Two rungs, largest → smallest. Padding is the single sizing token — `sys.layout.container.xs` (8px) on every edge — so footprint falls out of the icon scale without explicit `width`/`height`.

| Rung      | Capsule footprint   | Padding (all sides)              | Icon                | Radius            |
|-----------|---------------------|----------------------------------|---------------------|-------------------|
| `large`   | 40 × 40 (implicit)  | `sys.layout.container.xs` (8)    | `sys.icon.lg` (24)  | `sys.radius.full` |
| `medium`  | 32 × 32 (implicit)  | `sys.layout.container.xs` (8)    | `sys.icon.md` (16)  | `sys.radius.full` |

**Default is `large`.** Use `medium` only when perched inside another control's chrome. The `large` hit zone clears the WCAG 24 × 24 floor; never use `medium` for a top-level commit.

## States

States compose with the icon color via [DESIGN.md → State overlays](../../DESIGN.md#state-overlays) — the **icon color** paints over the transparent container at the state's opacity.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Transparent capsule, glyph at `onSurface`.                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Glyph at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Accessibility indicator over any lifecycle state. Three-layer ring over the `sys.state.focus` (12%) overlay. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Behavior

- **Reach for this when** the control's identity is the glyph (menu, search, dismiss, share) and the action is reversible.
- **Skip when** the action is destructive or one-shot — use standard [Button](./button.md) with a visible verb.

## Optical alignment

Transparent at rest, so the eye lands on the glyph's visible edge. Default rendering applies `margin: calc(-1 × sys.layout.container.xs)` on every side so the **glyph is the layout box**. Consumers do not opt in.

| Where it lands | Effect |
|---|---|
| At a row / header / toolbar edge | Glyph flush with the content rail; hover capsule bleeds into the gutter. |
| In a flush row of adjacent Icon Buttons | Capsule edges touch chrome-to-chrome without phantom padding. |
| Inside another control's chrome | Glyph occupies only its own footprint. |
