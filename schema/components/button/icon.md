# Icon

The icon-only commit surface — circular transparent target carrying a single glyph. Two rungs: `large` (40 × 40 / 24-glyph) for page chrome, `medium` (32 × 32 / 16-glyph) for inside-control density.

**Reach for this when** the control's identity is the glyph and the action is reversible — [Navigation bar](../navigation-bar/navigation-bar.md) search/chat, [Dialog](../dialog/dialog.md) dismiss, feed-row "⋯". **Skip when** the action is destructive or one-shot — use standard [Button](./button.md) with a visible verb.

**Layout inset.** inline — ships no padding outside its own circular target. Sits inside a host slot (NavigationBar trailing rail, Dialog header, feed-row action cluster) with the host paying surrounding rhythm. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Transparent capsule with a single glyph in `onSurface`. `large` is the default; flip to `medium` for inside-control density.

```preview
button/icon/default
---
import { Button } from '@blind-dsai/ui';
import { SearchIcon } from '@blind-dsai/ui/icons';

<Button variant="icon" size="large" icon={<SearchIcon />} aria-label="Search" />
```

## Use cases

### Inverse

Mirror for inverse hosts (Toast dismiss, coach-mark close). Glyph paints in `inverseOnSurface` against the host's `inverseSurface` fill; state overlays mix from the same token.

```preview
button/icon/inverse
---
import { Button } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Button variant="icon" size="medium" appearance="inverse" icon={<XIcon />} aria-label="Dismiss" />
```

### Group

Three Icon Buttons in a row — common shape on the [Navigation bar](../navigation-bar/navigation-bar.md) Home trailing slot. Adjacent buttons sit 16px apart (`sys.layout.inline.xl`); with optical alignment on, that gap *is* the visible glyph-to-glyph distance.

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

### Custom palette colours

Outside the named appearances, the glyph inherits `currentColor` — any Chorus icon-paint token works. Reach for a custom colour when the glyph carries semantic weight (favorite star → `sys.color.icon.yellow`, success check → `sys.color.success`, warning bolt, channel-branded glyph in a brand-tinted host). Apply via inline `color` so state overlays still mix from the same token at standard `sys.state.*` opacities — never override `background` or wrap in another element to recolour.

```preview
button/icon/custom-color
---
import { Button } from '@blind-dsai/ui';
import { StarFillIcon } from '@blind-dsai/ui/icons';

<div style={{ display: 'inline-flex', gap: 'var(--sys-layout-inline-xl)' }}>
  <Button variant="icon" icon={<StarFillIcon />} aria-label="Favorite — inactive" style={{ color: 'var(--sys-color-icon-muted)' }} />
  <Button variant="icon" icon={<StarFillIcon />} aria-label="Favorite — active"   style={{ color: 'var(--sys-color-icon-yellow)' }} />
</div>
```

Pick from `sys.color.*` — semantic roles (`primary` / `success` / `error` / …) for status pairs that also carry a background, and the dedicated `sys.color.icon.*` palette (`muted` / `yellow` / `red` / `blue` / `green` / `purple`) for standalone semantic glyphs. Reaching past sys into `ref.palette.*`, hardcoded hex, and Tailwind colour utilities are all forbidden.

### Focus indicator

Standard ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)).

```preview
button/icon/focused
---
import { Button } from '@blind-dsai/ui';
import { SearchIcon } from '@blind-dsai/ui/icons';

<Button variant="icon" icon={<SearchIcon />} aria-label="Search" state="focused" />
```

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

## Appearance

Two named appearances; geometry identical, only the glyph colour pair flips.

| Appearance  | Background    | Border | Icon color                       | When to reach for it |
|-------------|---------------|--------|----------------------------------|----------------------|
| `default`   | `transparent` | none   | `sys.color.onSurface`            | Every regular page surface. |
| `inverse`   | `transparent` | none   | `sys.color.inverseOnSurface`     | For use inside an inverse host (Toast dismiss, coach-mark close). |

## Sizes

Two rungs. Padding is the single sizing token — `sys.layout.container.xs` (8px) on every edge — so footprint falls out of the icon scale without explicit `width`/`height`. Default is `large`; reach for `medium` only inside another control's chrome, since it falls below the WCAG 24 × 24 floor for top-level commits.

| Rung      | Capsule footprint   | Padding (all sides)              | Icon                | Radius            |
|-----------|---------------------|----------------------------------|---------------------|-------------------|
| `large`   | 40 × 40 (implicit)  | `sys.layout.container.xs` (8)    | `sys.icon.lg` (24)  | `sys.radius.full` |
| `medium`  | 32 × 32 (implicit)  | `sys.layout.container.xs` (8)    | `sys.icon.md` (16)  | `sys.radius.full` |

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

## Optical alignment

Transparent at rest — the eye lands on the glyph. Default rendering applies `margin: calc(-1 × sys.layout.container.xs)` on every side so the **glyph is the layout box**. Not opt-in.

| Where it lands | Effect |
|---|---|
| At a row / header / toolbar edge | Glyph flush with the content rail; hover capsule bleeds into the gutter. |
| In a flush row of adjacent Icon Buttons | Capsule edges touch chrome-to-chrome without phantom padding. |
| Inside another control's chrome | Glyph occupies only its own footprint. |
