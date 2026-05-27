# Icon

The icon-only commit surface — circular transparent target carrying a single glyph. Use when the control's identity is the glyph ([Navigation bar](../navigation-bar/navigation-bar.md) search/chat, [Dialog](../dialog/dialog.md) dismiss, feed-row "⋯"). Two rungs: `large` 40 × 40 for page chrome, `medium` 32 × 32 for inside-control density.

**Layout inset.** `inline` — ships no padding outside its own circular target. Sits inside a host slot (NavigationBar trailing rail, Dialog header, feed-row action cluster) with the host paying surrounding rhythm. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Transparent capsule with a single glyph in `onSurface`. `large` (40 × 40 / 24-glyph) is the default; flip to `medium` (32 × 32 / 16-glyph) for inside-control density.

```preview
button/icon/default
---
import { Button } from '@blind-dsai/ui';
import { SearchIcon } from '@blind-dsai/ui/icons';

<Button variant="icon" size="large" icon={<SearchIcon />} aria-label="Search" />
```

## Inverse

Mirror for inverse hosts (Toast dismiss, coach-mark close). Glyph paints in `inverseOnSurface` against the host's `inverseSurface` fill; state overlays mix from the same token.

```preview
button/icon/inverse
---
import { Button } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Button variant="icon" size="medium" appearance="inverse" icon={<XIcon />} aria-label="Dismiss" />
```

## Use cases

### Group

Three Icon Buttons in a row — common shape on the [Navigation bar](../navigation-bar/navigation-bar.md) Home trailing slot. Adjacent buttons sit **16px** apart (`sys.layout.inline.xl`). With optical alignment on, chrome-to-chrome gap *is* the visible glyph-to-glyph distance.

```preview
button/icon/group
---
import { Button } from '@blind-dsai/ui';
import { SearchIcon, ChatIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<div style={{ display: 'inline-flex', gap: 'var(--sys-layout-inline-xl)' }}>
  <Button variant="icon" icon={<SearchIcon />}  aria-label="Search" />
  <Button variant="icon" icon={<ChatIcon />}    aria-label="Messages" />
  <Button variant="icon" icon={<ProfileIcon />} aria-label="Profile" />
</div>
```

### Focus indicator

Standard ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)).

```preview
button/icon/focused
---
import { Button } from '@blind-dsai/ui';
import { SearchIcon } from '@blind-dsai/ui/icons';

<Button variant="icon" icon={<SearchIcon />} aria-label="Search" state="focused" />
```

## Appearance

Two appearances. `default` for regular page surfaces; `inverse` for Toast / coach-mark / snackbar hosts. Geometry identical; only the glyph colour pair flips.

| Appearance  | Background    | Border | Icon color                       | When to reach for it |
|-------------|---------------|--------|----------------------------------|----------------------|
| `default`   | `transparent` | none   | `sys.color.onSurface`            | Every regular page surface. |
| `inverse`   | `transparent` | none   | `sys.color.inverseOnSurface`     | For use inside an inverse host (Toast dismiss, coach-mark close). |

## Slots

- **icon** — required glyph, sized at the rung's icon token. Inherits foreground via `currentColor` per the [family icon-colour rule](./button.md#icon-colour-inheritance-family-wide).
- **aria-label** — required accessible name; Icon Button has no visible text.

## Anatomy

| Property              | Token                                                          |
|-----------------------|----------------------------------------------------------------|
| Background (rest)     | `transparent`                                                  |
| Border                | none                                                           |
| Icon color            | per appearance (`onSurface` / `inverseOnSurface`)              |
| Hover background      | icon color at `sys.state.hover` (8%) opacity                   |
| Pressed background    | icon color at `sys.state.pressed` (16%) opacity                |

## Sizes

Two rungs. Padding is the single sizing token — `sys.layout.container.xs` (8px) on every edge — so footprint falls out of the icon scale without explicit `width`/`height`.

| Rung      | Capsule footprint   | Padding (all sides)              | Icon                | Radius            |
|-----------|---------------------|----------------------------------|---------------------|-------------------|
| `large`   | 40 × 40 (implicit)  | `sys.layout.container.xs` (8)    | `sys.icon.lg` (24)  | `sys.radius.full` |
| `medium`  | 32 × 32 (implicit)  | `sys.layout.container.xs` (8)    | `sys.icon.md` (16)  | `sys.radius.full` |

**Default is `large`.** Use `medium` only inside another control's chrome. `large` clears the WCAG 24 × 24 floor; never use `medium` for a top-level commit.

## States

The overlay paints the **icon color** over the transparent container at the state's opacity.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Transparent capsule, glyph at `onSurface`.                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Glyph at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)). Trigger: `:focus-visible`.

## Behavior

- **Reach for this when** the control's identity is the glyph (menu, search, dismiss, share) and the action is reversible.
- **Skip when** the action is destructive or one-shot — use standard [Button](./button.md) with a visible verb.

## Optical alignment

Transparent at rest — the eye lands on the glyph. Default rendering applies `margin: calc(-1 × sys.layout.container.xs)` on every side so the **glyph is the layout box**. Not opt-in.

| Where it lands | Effect |
|---|---|
| At a row / header / toolbar edge | Glyph flush with the content rail; hover capsule bleeds into the gutter. |
| In a flush row of adjacent Icon Buttons | Capsule edges touch chrome-to-chrome without phantom padding. |
| Inside another control's chrome | Glyph occupies only its own footprint. |
