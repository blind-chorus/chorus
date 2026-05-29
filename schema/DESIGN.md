# Chorus design rationale

> Single source of truth for every design rule in Chorus.

Token JSON files in [`schema/tokens`](schema/tokens) hold values only; their meaning, intent, and usage live here. For an orientation to the repo, see [`README.md`](../README.md).

---

## Introduction

### Chorus

The design system behind a product built on the belief that your voice matters — individual voices arranged into harmony through shared tokens.

#### About Chorus

**Chorus** is the design system behind our product — a platform built on the belief that *your voice matters*.

A chorus is individual voices coming together without losing what makes them distinct. That is the community we build for: workplace professionals, students, and anyone who speaks more freely when their name is not the thing being judged.

#### What this means for the system

Four convictions follow from the *your voice matters* premise:

- **Every voice matters, so every token matters.** Color, type, space, radius, and elevation are defined once, in the open, and every surface sings from the same score.
- **Harmony over uniformity.** Components stay recognizably themselves across contexts (light/dark, professional/student, mobile/desktop) while belonging to one system.
- **Clarity is how we amplify.** An anonymous voice only carries when the interface around it is legible, calm, and trustworthy.
- **The system is the score, not the performance.** Chorus is the notation; product surfaces are the performance. When the score changes, the whole chorus changes together.

#### Scope

Chorus covers foundations — tokens, typography, spacing, color, elevation — and the primitive components built on them.

#### Visual theme & atmosphere

Chorus is the design language of a community product with high text volume and mixed-script (Hangul + Latin) typography. Pretendard is the only typeface; the accent is a single restrained blue; surfaces ride a neutral-grayscale family with one inverse layer. See [Font family](#font-family).

#### Token architecture

Chorus follows a **three-tier** model — *reference → system → component* — with deliberate discipline about when each tier earns a token.

- **Reference tier** ([`reference.json`](schema/tokens/reference.json), namespaced under `ref.*`) — raw palettes and scales with no opinion about usage. `ref.palette.neutral.500`, `ref.fontSize.200`, `ref.space.400`. The material.
- **System tier** ([`system.json`](schema/tokens/system.json), namespaced under `sys.*`) — semantic roles consuming the reference tier via `{ref.palette.*}` / `{ref.space.*}` references. `sys.color.primary`, `sys.color.surfaceContainerHigh`, `sys.layout.page.md`, `sys.elevation.floating`. The vocabulary product surfaces speak in.
- **Component tier** ([`component.json`](schema/tokens/component.json), namespaced under `comp.*`) — per-component tokens that bind system roles to a component's contract. Currently illustrative-only (a hypothetical `comp.button.primary.container` / `comp.button.primary.label` pair would belong here) and ships empty by design — see [Current state of `comp.*`](#current-state-of-comp). Reserved for components reused widely enough that naming the composition earns its keep.

CSS variables emit with the full prefix preserved (`var(--sys-color-primary)`, `var(--ref-space-200)`) so tier identity is explicit at the call site — `var(--ref-…)` in a component is a code-review signal that the component reached past the system tier.

**Default to two tiers.** Most surfaces consume the system tier directly. The component tier is *opt-in*, not routine. A new component token must clear two bars: (1) the component is reused broadly, and (2) the same composition of system roles recurs in enough places that naming it reduces drift more than indirection costs. One-off compositions stay inline at the system tier.

Components never reference the palette directly. The chain always lands on system → reference. This single rule makes rebrands cheap: swap the reference tier, the system tier keeps its shape, and every component follows.

**Current state of `comp.*`.** [`component.json`](schema/tokens/component.json) ships with the namespace declared but no entries — every component composes system tokens inline. The file holds the convention so the tier is ready when a composition earns naming; intentionally empty, not unfinished. Adding the first entry should be a deliberate event reviewed against the two-bar test above.

CSS custom properties follow `--<tier>-<group>-<name>`: `var(--sys-color-primary)`, `var(--ref-space-200)`, `var(--sys-layout-page-md)`, `var(--sys-radius-xl)`. Reference palette variables (`var(--ref-palette-neutral-500)`) are emitted but reserved for the Color Palette documentation — components must not consume them.

**No raw numeric or color literals in component CSS.** Every length, color, radius, border width, opacity, and type-style value must resolve through `var(--sys-*)` (or `var(--ref-*)` when a system role isn't yet named) — never a bare `16px`, `#ffffff`, `1.4`, or `8px solid …`. Legitimate exceptions: (1) **intrinsic geometry** naming a component anatomy slot — e.g. a Thumbnail rung `48px`, an icon size `16px`, a fixed `width` that *is* the slot contract; (2) **computed compositions** combining tokens in `calc()` — e.g. `calc(48px + var(--sys-layout-inline-lg))`; (3) **structural zero / one-hundred values** (`0`, `100%`, `auto`) with no token equivalent. Anything else — paddings, gaps, margins, font sizes, line heights, font weights, border widths, focus-ring offsets, underline thickness, scroll-snap basis — is a token call. **Do not write `var(--sys-…, 16px)` fallback values**: the build emits the variable globally, and fallbacks hide regressions when a token name changes. If a target value doesn't map to an existing system token, that's a system-tier gap — name the new role in DESIGN.md and add the JSON entry rather than inlining the literal.

**JSON files contain values only.** All meaning, usage, and rules live in this document. A token without a description in DESIGN.md is a token without a role.

**JSON shape.** Token files follow the [Design Tokens Community Group (DTCG)](https://tr.designtokens.org) draft: each leaf carries `$value`, optional `$type`, and Chorus extensions (`$rem`, `$multiplier`, `$responsive.web`) namespaced under `$` so DTCG-aware tooling (Style Dictionary, Tokens Studio) reads values without choking on extras. Aliases use the DTCG `{ref.palette.blue.500}` reference syntax. Conformance is partial-by-intent. A new extension key earns its keep only if at least one consumer reads it.

---

## Foundations

### Color

Six solid hues plus two opacity overlays, organized into role clusters that always pair a background with its foreground — components consume system roles, never the raw palette.

#### Reference palettes

Six solid palettes share a 0–1000 lightness curve, tuned so the same numeric step lands at a perceptually similar brightness across hues. Pairing a 50–400 background with a 700–900 foreground (or vice versa) clears WCAG AA 4.5:1 for body text across every palette.

##### Lightness ramp

Each palette is a one-dimensional ramp keyed by lightness (light → dark, 0 → 1000), partitioned into four functional bands plus two endpoint anchors. **Endpoints (0, 1000)** anchor pure ends, **lower bands (50–400)** carry surfaces, **brand step (500)** anchors hue identity, **upper bands (600–900)** carry foregrounds. Numeric step is identical across hues, so a role transfers by swapping the hue family.

Step bands across all hues:

- **0** — lightest endpoint anchor. `neutral.0` is pure `#ffffff`; chromatic hues carry a near-imperceptible tint of their family so the hue identity survives at the extremes.
- **50–400** — surface band. Backgrounds and tinted fills; dark text reads on top.
- **500** — brand anchor. The canonical hue identity step for each palette (the step that *is* the brand color).
- **600–900** — foreground band. Text, icons, emphasis; light text reads on top.
- **1000** — darkest endpoint anchor. `neutral.1000` is pure `#000000`; chromatic hues carry a subtle tint of their family. For true `#ffffff` / `#000000` references, use the `neutral` palette.

| Palette  | 500 (canonical) | Role                                              |
|----------|-----------------|---------------------------------------------------|
| `neutral`  | `#737373`       | Text, surfaces, borders, dark UI chrome           |
| `blue`     | `#2563eb`       | Primary brand accent                              |
| `green`    | `#008838`       | Success / positive confirmation                   |
| `red`      | `#d92626`       | Brand / Error / destructive                       |
| `yellow`   | `#a16207`       | Reserved (warning / categorical)                  |
| `purple`   | `#9333ea`       | Reserved (categorical / decorative)               |

**Only system tokens may reference these palette steps.** Components never consume `palette.*` directly. Document a new role here in DESIGN.md before adding the JSON entry.

#### Overlay palettes

`palette.black` and `palette.white` share the 0–1000 step axis but key on **opacity**, not lightness. Each step's alpha is drawn from the [base-unit ladder](#base-unit-ladder) read as percent. Compositing over the surface lets the underlying tint bleed through.

##### Opacity ramp

A one-dimensional opacity ramp (`0` → `1000`) where the step name matches the solid palettes' 0–1000 index, and the alpha value is a rung from the [base-unit ladder](#base-unit-ladder) read as percent (`0 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 64 · 80 · 100%`). The fully-opaque `100%` is appended as a color-specific endpoint. Choosing a step picks an *intensity intent* (veil / scrim / endpoint). `palette.white.*` mirrors `palette.black.*` step-for-step.

The ramp partitions into three functional bands:

| Band      | Steps        | Alpha values            | Used by                                                                  |
|-----------|--------------|-------------------------|--------------------------------------------------------------------------|
| Endpoint  | `0`          | 0% (transparent)        | Reset / fully transparent overlays                                       |
| Veil      | `50–600`     | 4 / 6 / 8 / 12 / 16 / 20 / 24% | `elevation.*` shadow alphas, `state.*` overlay opacities          |
| Scrim     | `700–900`    | 40 / 64 / 80%           | `color.scrim`, heavy modal/drawer dim                                    |
| Endpoint  | `1000`       | 100% (fully opaque)     | `color.focus` outer ring, `color.elevation` ink                          |

**Contrast guidance**: veil-band overlays are low-emphasis — foreground text (`color.onSurface`, near-black) stays readable. Scrim-band and `1000` are strong overlays — use inverse text (`color.inverseOnSurface`, near-white).

`palette.white.*` mirrors `palette.black.*` for dark-mode use: composite over dark backgrounds so the surface tint shows through.

#### Accent roles

Five role families: brand emphasis (`primary`), neutral support (`secondary`), brand-identity attention (`brand`), positive confirmation (`success`), destructive signal (`error`). The role decides *what the color means*; the structure below decides *how to compose it*.

##### Four-token quartet

Each accent role (`primary` / `secondary` / `brand` / `success` / `error`) ships as a fixed **four-token quartet**: a high-emphasis pair and a low-emphasis pair, foreground always paired to background. The quartet is the unit of meaning — never use a fill without its `on*` foreground, never read contrast manually. The *role* differs across accents but the *four-slot structure* is identical.

The four slots:

- **Main pair** — `X` / `onX` — high-attention fill for CTAs, emphasis badges, status chips. Use sparingly per view.
- **Container pair** — `XContainer` / `onXContainer` — low-chroma tinted surface in the same family for callouts, notification tiles, subtle banners. Lower visual weight, safe on larger areas.

**The Container pair is the tint.** When a surface needs to read as a soft accent — info callouts, selected list rows, success banners, error tiles, "subtle" highlight blocks — reach for `XContainer` + `onXContainer`, **never** a `color-mix(<accent> N%, <surface>)` overlay. `XContainer` already resolves to the soft tone (`blue.50` light / `blue.900` dark for primary, `red.50` / `green.50` light and `red.900` / `green.900` dark for brand / success, `red.100`/`red.900` for error), tuned to clear AA against its paired `on*` foreground; an alpha mix bypasses that contract and lands on the neutral `surface*` family. If the canonical pair gives a poor visual, retune the token value in [`system.json`](schema/tokens/system.json) — never break the pair at the call site.

**Allowed `color-mix` exceptions** — two and only two:

1. **State-overlay formula** — `color-mix(<onContainer> 8%, <container>)` for hover/focus/pressed layered over a Container surface, per [State overlays](#state-overlays).
2. **Decorative gradient atmospherics** — an `<accent>`-toned stop fading to `transparent` inside a `radial-gradient` / `linear-gradient` over a flat `surface*` base where the *underlying base* governs text contrast. The gradient is decoration, not a content surface. The tell-tale: the gradient stops with `transparent`, and the text resolves contrast against the base color *under* the gradient (`onSurface` on `surfaceContainerLowest`, etc.).

###### Primary

| Token                      | Role                                                                          |
|----------------------------|-------------------------------------------------------------------------------|
| `color.primary`            | The brand color and highest-attention accent. Use sparingly for one dominant action per view (primary CTA, selected tab underline, active toggle fill, progress indicator). Two primary buttons in a view collapse the hierarchy. Resolves to `ref.palette.blue.500` in both modes — the brand hue is saturated enough to clear AA against `surface` in both light (white) and dark (`neutral.900`), so the CTA reads as the same blue across themes without a tonal nudge. |
| `color.onPrimary`          | Foreground placed on top of `primary`. Label text, icons, and spinners inside primary-filled surfaces. Always pair with `primary`; never against a neutral surface. Resolves to `ref.palette.neutral.50`. |
| `color.primaryContainer`   | Low-chroma tinted surface in the primary family. Selected-state list backgrounds, informational callouts, highlighted message bubbles, brand-flavored section banners. Safe on larger areas where `primary` would overwhelm. Resolves to `ref.palette.blue.50` (light) / `ref.palette.blue.900` (dark). The light value sits one step brighter than the other accent containers (`error` uses `*.100`) because primary is the most-used quartet in the product — a `blue.100` callout next to multiple active list rows on the same page felt heavier than the role asks for. The lighter step keeps the brand identity visible against `surface` while reading as a quiet, decorative tint rather than a filled banner. |
| `color.onPrimaryContainer` | Foreground for content placed on `primaryContainer`. Text, icons, and links inside primary-tinted surfaces. Resolves to `ref.palette.blue.600` (light) / `ref.palette.blue.400` (dark) — both stay in the saturated primary family so the foreground reads as *blue* on both tinted backgrounds, instead of collapsing to near-black on the light tint or muddying into the deep container on the dark tint. The dark step lifts one band higher than light's mirror would suggest because identical luminance gaps read darker on dark surfaces. The pair clears AA at ~9:1 against the lifted light container. |

###### Secondary

| Token                        | Role                                                                          |
|------------------------------|-------------------------------------------------------------------------------|
| `color.secondary`            | A neutral accent for supporting actions that should feel present but not brand-loud. Secondary CTAs paired beside a primary button, quiet filled controls, selection highlights where a colored brand fill would be distracting. Unlike the chromatic accents, this family inverts between light and dark modes. Resolves to `ref.palette.neutral.700` (light) / `ref.palette.neutral.300` (dark). |
| `color.onSecondary`          | Foreground placed on top of `secondary`. Label text and icons inside secondary-filled surfaces. Resolves to `ref.palette.neutral.50` (light) / `ref.palette.neutral.900` (dark). |
| `color.secondaryContainer`   | Low-contrast neutral surface in the secondary family. Subtle backgrounds that need to separate from the page without implying brand meaning: tonal chip fills, quiet badges, muted selection backgrounds, segmented-control tracks, secondary button fills. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.600` (dark). The dark step sits two bands lighter than a strict mirror would land — at `neutral.800` the secondary fill would collide with every `surfaceContainer*` and `surfaceVariant` (all `neutral.800` in dark); at `neutral.700` it would still collide with `surfaceContainerHighest` (the topmost surface band). `neutral.600` lifts the secondary accent one step clear of the entire surface ladder so a secondary fill placed on any host — including the most lifted overlay surfaces — stays distinct, while remaining inside the muted band. |
| `color.onSecondaryContainer` | Foreground for content placed on `secondaryContainer`. Resolves to `ref.palette.neutral.900` (light) / `ref.palette.neutral.100` (dark). |

###### Brand

| Token                    | Role                                                                          |
|--------------------------|-------------------------------------------------------------------------------|
| `color.brand`            | The product's signature red — a high-attention accent reserved for notification counts, unread badges, eyebrow flags, and brand-identity moments (logomark fills, brand-tagged callouts). One tonal step **brighter** than `error` in both modes (`red.500` brand vs. `red.600` / `red.700` error), so the two reds stay visually distinct on the same surface: brand reads as energetic identity, error reads as a deeper destructive signal. Resolves to `ref.palette.red.500` in **both** light and dark modes — brand identity stays stable across themes, and the 500 step is the brightest red the palette ships that still clears AA against `onBrand` (`neutral.50`) for white-on-brand labels. |
| `color.onBrand`          | Foreground placed on top of `brand`. Label text and icons inside brand-filled surfaces (notification counts, brand badges). Resolves to `ref.palette.neutral.50`. White-on-`red.500` lands at ~4.7:1 — clears AA for normal text in both modes. |
| `color.brandContainer`   | Low-chroma tinted surface in the brand family. Soft brand callouts, "what's new" banners, promotional tiles, marketing surfaces where the energy of `brand` would overwhelm. Resolves to `ref.palette.red.50` (light) / `ref.palette.red.900` (dark). Light is one step lighter than `errorContainer` (`red.50` vs. `red.100`) so the brand callout reads as a quiet identity touch rather than a warning. |
| `color.onBrandContainer` | Foreground for content placed on `brandContainer`. Resolves to `ref.palette.red.600` (light) / `ref.palette.red.400` (dark) — both stay in the saturated red family so the foreground reads as *red on tinted red*, not as *near-black on tinted red*. The dark step lifts one band higher than light's mirror would suggest because identical luminance gaps read darker on dark surfaces. |

###### Success

| Token                       | Role                                                                          |
|-----------------------------|-------------------------------------------------------------------------------|
| `color.success`             | The signal color for positive confirmation — completed states, success toasts, "saved" pills, validated form fields, healthy status indicators. Reserved strictly for affirmative outcomes; decorative use erodes its signaling power. Resolves to `ref.palette.green.500` in **both** light and dark modes — mirrors `brand`'s cross-mode stability so the success signal reads as the same green across themes, and the 500 step is the brightest green the palette ships that still clears AA against `onSuccess` (`neutral.50`) for white-on-success labels. |
| `color.onSuccess`           | Foreground placed on top of `success`. Label text and icons inside success-filled surfaces. Resolves to `ref.palette.neutral.50`. |
| `color.successContainer`    | Low-chroma tinted surface in the success family. Soft success callouts, "you're all set" banners, completed-task tiles where `success` would overwhelm. Resolves to `ref.palette.green.50` (light) / `ref.palette.green.900` (dark) — mirrors `brandContainer`'s shallow-light / deep-dark structure. |
| `color.onSuccessContainer`  | Foreground for content placed on `successContainer`. Resolves to `ref.palette.green.600` (light) / `ref.palette.green.400` (dark) — both stay in the saturated green family so the foreground reads as *green on tinted green*, not as *near-black on tinted green*. The dark step lifts one band higher than light's mirror would suggest because identical luminance gaps read darker on dark surfaces. |

###### Error

| Token                    | Role                                                                          |
|--------------------------|-------------------------------------------------------------------------------|
| `color.error`            | The signal color for destructive and error states. Destructive CTAs (Delete, Remove), form-field error outlines, critical status indicators, alert icons. Reserved strictly for negative or dangerous meaning — decorative use erodes its signaling power. One tonal step **darker** than `brand` (red.500) in both modes so destructive moments sit deeper and graver than brand-identity moments on the same screen. Resolves to `ref.palette.red.600` (light) / `ref.palette.red.700` (dark). |
| `color.onError`          | Foreground placed on top of `error`. Label text and icons inside error-filled surfaces. Resolves to `ref.palette.neutral.50`. |
| `color.errorContainer`   | Low-chroma tinted surface in the error family. Inline error message backgrounds, warning banners, failed-state tiles. Less alarming than `error`, so appropriate for larger areas. Resolves to `ref.palette.red.100` (light) / `ref.palette.red.900` (dark). |
| `color.onErrorContainer` | Foreground for content placed on `errorContainer`. Resolves to `ref.palette.red.700` (light) / `ref.palette.red.500` (dark). |

#### Surface stack

Page background and the elevation-tier container surfaces.

##### Three sub-groups

1. **Base canvas** (`surface` / `onSurface`) — the foundation everything else sits on.
2. **Canvas modifiers** (`surfaceVariant` / `onSurfaceVariant` / `surfaceDim` / `surfaceBright`) — alternate base tones for quiet separation, recess, or spotlight. `surfaceVariant` carries its own paired foreground for two-tier text hierarchy; `Dim` / `Bright` keep `onSurface` as foreground.
3. **Container ladder** (`surfaceContainerLowest` → `Low` → `default` → `High` → `Highest`) — five ordered tiers indicating *spatial role* (sunken → recessed → default → raised → topmost). In light mode the tones collapse onto `#ffffff` by design; lift comes from `elevation.*` shadows.

`onSurface` is the canonical foreground for the entire stack.

###### Base & variants

| Token                    | Role                                                                                         |
|--------------------------|----------------------------------------------------------------------------------------------|
| `color.surface`          | The base page background — the canvas everything else sits on. Root app background, empty regions, any large flat area that should read as the "ground" of the UI. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.900` (dark). |
| `color.onSurface`        | Primary foreground against `surface`. Body copy, headings, primary icons. Clears WCAG AA against every `surface*` token. Resolves to `ref.palette.neutral.900` (light) / `ref.palette.neutral.50` (dark). |
| `color.surfaceVariant`   | A quiet alternate surface tone — and the **canonical fill for any "subtle container" region** that should read as separated from the page without being lifted. Input field fills, disabled control backgrounds, zebra-striping, muted section backgrounds, and contained sub-modules inside a card (poll banners, citation bodies, attachment chips). Prefer `surfaceVariant` over `surfaceContainer*` for this role: `surfaceContainer` collapses onto `surface` in light mode by design and produces no visible separation when used as a sub-module fill. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.800` (dark). |
| `color.onSurfaceVariant` | Secondary foreground for lower-emphasis text on any surface tone. Supporting copy, placeholders, helper text, metadata, inactive icon fills. Deliberately lighter than `onSurface` to establish a two-tier text hierarchy. Resolves to `ref.palette.neutral.700` (light) / `ref.palette.neutral.300` (dark). |
| `color.surfaceDim`       | A darker variant of `surface` — the darkest base background. Use when the page behind an elevated element needs to recede (dimmed canvas behind a modal/drawer, "quiet" screens where raised cards carry the focus). Resolves to `ref.palette.neutral.200` (light) / `ref.palette.neutral.900` (dark). |
| `color.surfaceBright`    | A brighter variant of `surface` — the brightest base background. Spotlight moments where the base layer itself should feel elevated (hero regions, focus screens, brightened split-view panels). Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.800` (dark). |

###### Container ladder

| Token                           | Role                                                                                         |
|---------------------------------|----------------------------------------------------------------------------------------------|
| `color.surfaceContainerLowest`  | Elevation level 0 — the lowest tier in the container stack. The most recessed tone: a soft notch beneath `surface` in light mode, the true palette floor (pure black) in dark mode. Sunken or inset regions: input wells, disabled control bodies, trough/rail backgrounds, page-header recessed bands. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.1000` (dark). |
| `color.surfaceContainerLow`     | Elevation level 1 — low-prominence containers. Backgrounded secondary panels, sidebar sections, cards that should feel "attached" to the page rather than floating. Less recessed than `surfaceContainerLowest`. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.900` (dark). |
| `color.surfaceContainer`        | Elevation level 2 — the default container tone. Standard cards, list items, feed tiles, most everyday content surfaces. Start here when in doubt. In light mode this matches `surface`; in dark mode it is one tonal step above `surface`. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.800` (dark). |
| `color.surfaceContainerHigh`    | Elevation level 3 — the "raised" tone. Two families share this fill: (a) **scrim-anchored interruptions** — modals and dialogs, search view, bottom sheets, expanded navigation drawers; and (b) **in-page raised chrome** — bottom app bar, FAB surface variant, filter / toolbar button bodies (and the chip-chrome tabs that inherit them), selected cards, nested emphasized sections, neutral placeholder fills. Note: Toggle Button's active state uses `transparent` (not `surfaceContainerHigh`) so it sits cleanly on any host tier; only the inactive state's `primary` fill or the filter/toolbar chrome sit on this token. Tonally identical to `surfaceContainer` in both modes — visible lift comes from `elevation.overlay` (for scrim-anchored surfaces) or `elevation.floating` (for in-page raised containers), not an ever-brightening fill. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.800` (dark). |
| `color.surfaceContainerHighest` | Elevation level 4 — the topmost container tone, reserved for the *most* lifted surfaces that float over everything else without their own scrim. Menus, tooltips, popovers, filled text-field bodies, search bars. In light mode matches `surfaceContainer`; in dark mode steps up one tier so the topmost layer reads against the stack beneath it, reinforced by `elevation.overlay`. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.700` (dark). |

**Tonal elevation is capped, not stacked.** The Chorus brand goal is *calm and trustworthy*; ever-brightening surfaces feel showy and break the calm. Lift is expressed by `elevation.*` shadows; the surface names carry semantic weight ("this is a modal") even when the tone is identical to a card.

#### Outline · Inverse · Focus · Scrim

Borders, inverted overlays, focus indicators, backdrop dimming.

##### Five role-clusters

- **Outline cluster** (`outline` / `outlineVariant`) — high vs. low emphasis border pair.
- **Inverse cluster** (`inverseSurface` / `inverseOnSurface`) — mini-stack for elements that must contrast with the page (snackbars, tooltips). Action accents inside inverted components fall back to the regular `primary` family — the inverse canvas is contrast-tuned to clear AA against `primary` without a dedicated step.
- **Focus cluster** (`focus` / `focusInset`) — outer ring + inner counter-ring pair. Always composed together (see [Focus ring composition](#focus-ring-composition)).
- **Scrim** (solo) — translucent black for backdrop dimming.
- **Elevation ink** (solo) — base shadow color, referenced only from `elevation.*` definitions, never as a fill.

###### Outline

| Token                  | Role                                                                                                 |
|------------------------|------------------------------------------------------------------------------------------------------|
| `color.outline`        | High-emphasis border. Outlined buttons, form field borders, selected-state strokes, dividers that need to carry visual weight. Resolves to `ref.palette.neutral.400` (light) / `ref.palette.neutral.500` (dark). |
| `color.outlineVariant` | Low-emphasis border. Subtle dividers, table row separators, card edges, decorative hairlines where `outline` would be too loud. Resolves to `ref.palette.neutral.200` (light) / `ref.palette.neutral.700` (dark). The dark step sits one band higher than a strict mirror of the light step (`neutral.200`) would land — at `neutral.800` the divider would collide with `surfaceVariant` (`neutral.800` in dark) and vanish against any sub-module fill. `neutral.700` keeps a low-emphasis divider visible against both `surface` (`neutral.900`) and `surfaceVariant` (`neutral.800`) without escalating to the high-emphasis `outline`. |

###### Inverse

| Token                    | Role                                                                                                 |
|--------------------------|------------------------------------------------------------------------------------------------------|
| `color.inverseSurface`   | A surface that deliberately reverses the current mode — dark in light mode, light in dark mode. Components that must visually contrast with the surrounding page to grab attention: snackbars, toast backgrounds, coach-mark tooltips, onboarding highlights. Resolves to `ref.palette.neutral.900` (light) / `ref.palette.neutral.50` (dark). |
| `color.inverseOnSurface` | Foreground on `inverseSurface`. Text and icons inside inverted surfaces. Resolves to `ref.palette.neutral.50` (light) / `ref.palette.neutral.900` (dark). |

###### Focus

| Token              | Role                                                                                                 |
|--------------------|------------------------------------------------------------------------------------------------------|
| `color.focus`      | Outer focus-ring color. Intentionally inverse-toned — dark in light mode, light in dark mode — so the ring reads against any surface in the stack regardless of the control's own fill. See [Focus ring composition](#focus-ring-composition) for the full three-layer rule. Resolves to `ref.palette.black.1000` (light) / `ref.palette.white.1000` (dark). |
| `color.focusInset` | Inner counter-ring paired with `focus`. Mirrors `focus` in the opposite direction so even when the outer ring meets a similarly-toned background, the inset edge keeps the indicator legible. Resolves to `ref.palette.white.1000` (light) / `ref.palette.black.1000` (dark). |

###### Overlay

| Token             | Role                                                                                                 |
|-------------------|------------------------------------------------------------------------------------------------------|
| `color.scrim`     | Translucent black used to dim content behind a raised overlay. The backdrop behind modals, drawers, menus, and bottom sheets — focuses attention on the foreground and blocks interaction with the obscured layer. Resolves to `ref.palette.black.800`. |
| `color.elevation` | Base color used to build elevation shadows (composited with opacity inside `elevation.*` definitions). Not for fills — reference only from elevation definitions. Resolves to `ref.palette.black.1000`. |
| `color.placeholderImage.start` / `color.placeholderImage.end` | Gradient endpoints for a decorative **image-placeholder fallback** — composed as `linear-gradient(135deg, start 0%, end 100%)` on slots that expose user-supplied imagery (Feed post thumbnail, Citation hero) when the image `src` is empty or unloaded. Theme-aware: cool teal in light (`#c8e0e1 → #2d6f72`), cool neutral in dark (`#3a4548 → #1a2226`) so the placeholder reads as "image content here" against either surface ladder without competing with adjacent thumbnails. **Not for non-image fills** — for empty/skeleton states of solid surfaces, use `surfaceContainerHigh` instead. |

#### Dark-mode strategy

- **Chromatic accents (`primary`, `brand`, `success`, `error`) do NOT invert their on-pair between modes.** `error` nudges one tonal step in dark (`red.600` → `red.700`) so the fill still reads against a dark page; `primary` stays at `blue.500`, `brand` at `red.500`, `success` at `green.500` in both modes because each hue clears AA against both `surface` tones and its `on*` foreground (`neutral.50`) without a nudge. The `on*` foreground stays at `neutral.50` across all four. Keeps brand identity stable across modes.
- **Neutral roles (`secondary`, `surface*`, `onSurface*`, `outline*`) invert as usual.**
- **Container pairs (`primaryContainer` / `onPrimaryContainer`, etc.) flip the *container*, not the foreground family**: light mode container is shallow (e.g. `blue.50` for primary, `red.50` / `green.50` for brand / success, `red.100` for error) with a saturated mid-band foreground (`blue.600`); dark mode container goes deep (`blue.900`) with a brighter mid-band foreground (`blue.400`). Both modes keep the foreground in the saturated primary family so the pair reads as *blue on tinted blue*, not *near-black on tinted blue*. Primary's light container sits one step brighter than the other quartets because it appears most often (active nav rows, brand callouts). The dark foreground lifts one band higher than a strict mirror (`blue.400` instead of `blue.500`) because equal luminance gaps appear shallower on dark surfaces.
- **Focus ring inverts** so the outer ring is always inverse-toned to the page.

#### Data visualization palette

Charts and category-coded surfaces draw from the same six reference hues, organized into three intent groups (categorical / sequential / diverging) — never invented per-chart.

##### Three palette types

| Palette        | Source                                                | Ordered? | Use                                                                       |
|----------------|-------------------------------------------------------|----------|---------------------------------------------------------------------------|
| Categorical | `blue.500` · `green.500` · `yellow.500` · `purple.500` · `red.500` · `neutral.700` | No       | Discrete categories with no inherent order — series in a stacked bar, slices of a pie, group labels. |
| Sequential  | One palette ramp, steps `200 → 800` (light → dark)   | Yes      | A single quantitative variable along a magnitude axis — heatmaps, choropleths, ranked bars. Default to `blue.*` (brand-aligned); use `neutral.*` when the data is content-secondary. |
| Diverging   | `red.700 · red.400 · neutral.200 · blue.400 · blue.700` | Yes (centered) | A variable with a meaningful midpoint — gain/loss, sentiment, deviation from baseline. Center step `neutral.200` is the zero anchor. |

##### Rules

- **Six maximum for categorical.** Past six categories, group the long tail into "Other" or add a secondary visual channel (texture, position).
- **Brand color comes first only when it carries meaning.** Using `blue.500` for the first series implies that series is "primary." If categories are equal, rotate the order or pick a non-brand starting hue.
- **Reuse `color.error` and `color.success` for negative / positive coding.** Don't introduce chart-specific red or green.
- **Dark mode shifts the steps, not the hues.** Light uses `*.500` for categorical; dark uses `*.400`/`*.300` so contrast against the dark canvas holds.
- **Pair with a non-color channel** — pattern fills, direct labels, or shape differentiation. ~4% of users cannot distinguish red from green.

### Typography

One typeface (Pretendard) handles both Latin and Hangul, materialized as fifteen roles across five purpose categories × three sizes — weight and line-height carry meaning by purpose, not by size.

#### Font family

The system typeface is **Pretendard**.

**Why Pretendard** — Chorus is a community service with high text volume where Hangul (국문) and Latin (영문) routinely appear side by side. Most sans-serif families are tuned for one script and break when scripts mix. Pretendard's Hangul and Latin share compatible x-height, weight, and optical rhythm, so mixed-script lines read as one continuous texture.

**How to apply** — one family for every surface (display, heading, body, label, caption). Do not substitute a different family for Latin-only or Korean-only regions. The stack falls back to platform system fonts only when Pretendard fails to load:

```
Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif
```

#### Categories × Sizes

Five purpose categories × three size levels = 15 type roles, each composed of four atomic properties.

- **Category axis (purpose)** — `display` (hero) → `heading` (structural title) → `body` (reading) → `label` (control) → `caption` (metadata). Position determines weight and line-height by purpose, not by size.
- **Size axis (emphasis within a category)** — `lg` / `md` / `sm`. `md` is the default.
- **Composition** — each grid cell composes four reference-tier values: `size` / `weight` / `line` / `tracking`. Never mix-and-match across cells.
- **Responsive scaling grows with hierarchy, above the `md` baseline only.** `display.lg` jumps two scale steps on web (≥800px); `heading.lg` jumps one. `display.md/sm` / `heading.md/sm` stay constant. Body / label / caption are unconditionally flat. **`md` is the baseline, only sizes above it grow on web.**

| Role          | Size (mobile → Web) | Weight     | Line   | Tracking      | Use                                                |
|---------------|---------------------|------------|--------|---------------|----------------------------------------------------|
| `typo.display.lg`  | 48 → 80 px          | 700 Bold     | 1.25 tight | -0.02em tight | Top-of-page hero on landing/onboarding — typically one per screen. |
| `typo.display.md`  | 40 px               | 700 Bold     | 1.25 tight | -0.02em tight | Section heroes, featured content callouts, high-impact empty states. |
| `typo.display.sm`  | 32 px               | 700 Bold     | 1.25 tight | -0.02em tight | Compact heroes and sub-hero banners where vertical space is constrained. |
| `typo.heading.lg`  | 24 → 32 px          | 600 Semibold | 1.25 tight | -0.01em snug  | Page-level title — the single top heading of a screen or dialog. |
| `typo.heading.md`  | 20 px               | 600 Semibold | 1.25 tight | -0.01em snug  | Section title — card titles, modal titles, settings groups. |
| `typo.heading.sm`  | 16 px               | 600 Semibold | 1.25 tight | -0.01em snug  | Sub-section title, list-group headers, inline emphasis headings. |
| `typo.body.lg`     | 20 px               | 400 Regular  | 1.5 normal | 0em normal    | Long-form bodies — article text, descriptions, main readable content. |
| `typo.body.md`     | 16 px               | 400 Regular  | 1.5 normal | 0em normal    | Default body. Single-topic page bodies (article text, one-up content surfaces, descriptions where the reader stays in the block) and form-field input values. See [Composition recipes § Body text size](#body-text-size-14px-in-mixed-group-sections-16px-on-single-topic-pages) for picking between `body.md` and `body.sm`. |
| `typo.body.sm`     | 14 px               | 400 Regular  | 1.5 normal | 0em normal    | Compact body. The right pick when a section composes multiple distinct text groups (cards listing several short descriptions, settings rows, feed items, dialog/callout messages); also dense lists, secondary descriptions, inline helper prose. Still a reading size, not a caption. |
| `typo.label.lg`    | 16 px               | 600 Semibold | 1.5 normal | 0em normal    | Primary CTA buttons, prominent tab labels, standalone form labels. |
| `typo.label.md`    | 14 px               | 600 Semibold | 1.5 normal | 0em normal    | Default control label. Standard buttons, input labels, menu items, chip labels. |
| `typo.label.sm`    | 12 px               | 600 Semibold | 1.5 normal | 0.02em wide   | Compact controls — dense toolbars, small badges, inline tag labels, supporting actions. |
| `typo.caption.lg`  | 14 px               | 400 Regular  | 1.5 normal | 0em normal    | Form helper text, footnote-style explanations needing easy legibility. |
| `typo.caption.md`  | 12 px               | 400 Regular  | 1.5 normal | 0.02em wide   | Default caption. Timestamps, attribution metadata, card metadata, image captions. |
| `typo.caption.sm`  | 10 px               | 400 Regular  | 1.5 normal | 0.02em wide   | Smallest caption — legal fine print, dense metadata columns, data-dense tables. Use sparingly. |

#### Tracking & line-height principles

- **Bold display, semibold heading, semibold label, regular body, regular caption.** Weight differentiates roles at the same size — `body.md` (400) and `label.lg` (600) share 16px but read differently. Labels borrow heading's 600 to read as actionable; captions stay regular as *information about content*.
- **Tracking only diverges at the extremes.** Display compresses (`-0.02em`); small UI text and uppercase widens (`0.02em`). Body, label-md, caption-lg use the typeface's intended spacing (`0em`).
- **Line-height splits by purpose, not size.** Display and heading use `tight` (1.25); body / label / caption use `normal` (1.5).

#### Letter-spacing scale

Em-relative ramp from compressed to widened. `normal` is the anchor (the typeface's intended spacing); the four extremes are optical corrections.

Mapping into `typo.*`: display → `tight`, heading → `snug`, body / reading → `normal`, small UI labels → `wide`, uppercase overlines → `wider`.

| Token                  | Value     | Role                                                                                |
|------------------------|-----------|-------------------------------------------------------------------------------------|
| `letterSpacing.tight`    | `-0.02em` | Compressed tracking for oversized display type — large glyphs settle closer so the block reads as a unit. |
| `letterSpacing.snug`     | `-0.01em` | Subtly tightened for headings and mid-large type — sharpens silhouette without marketing compression. |
| `letterSpacing.normal`   | `0em`     | Default. The typeface's intended spacing — body copy, reading text, standard UI controls. |
| `letterSpacing.wide`     | `0.02em`  | Slight widening for small UI text (≈12px and below) — measurably improves glance-readability of dense labels. |
| `letterSpacing.wider`    | `0.08em`  | Pronounced tracking for uppercase eyebrows, overlines, and small-caps category markers. Restores rhythm lost in all caps. |

#### Font-size scale

Built on the 8px base (`fontSize.100` = 8px = 1×, `fontSize.200` = 16px = 2×), with finer in-between rungs (10 / 14 / 18 / 56 / 72px) added where legibility demands resolution the spacing scale cannot provide. Each rung carries `$rem` alongside `$value` so consumers can emit rem units (which respect the user's browser font-size preference).

The reference ladder is *material*, not vocabulary: `typo.*` categories pick rungs from it; product code never references `fontSize.*` directly.

#### Casing

**Sentence case is the default** for every piece of UI text — navigation items, section titles, button and label text, page titles, dialog and toast bodies. Capitalize the first word and proper nouns; everything else stays lowercase. **Title Case Like This is not used anywhere in product surfaces.**

**Why** — Title case adds a decorative convention on top of the typographic hierarchy already encoded by `typo.*`. The two signals then compete: a Title-Cased label at `label.lg` reads as more important than a Sentence-cased one at `heading.sm`. Title case also has no analogue in Korean, the system's primary language, so any title-cased label becomes inconsistent when localized.

**UPPERCASE is reserved for in-content category markers** — eyebrows, overlines, table-section headers — pairing with `letterSpacing.wider` (see [Letter-spacing scale](#letter-spacing-scale)). It does **not** apply to navigation structure (side-nav group labels, page-nav section headers); those use sentence case with hierarchy expressed by font size and weight. Apply via CSS `text-transform: uppercase`, never by writing the text in caps in source — the underlying text stays sentence case so it reads correctly when the transform is removed (search, screen readers, diff review, localization).

**Exceptions** — proper nouns (Pretendard, Hangul), product names, code identifiers (`sys.color.primary`), acronyms (CTA, AA, WCAG) keep their natural casing.

##### Segmented sentence case

When a heading or label joins multiple ideas with a separator (`&`, `/`, `·`, `×`, `:`, `→`), apply **sentence case to each segment independently** — capitalize the first word of every segment, lowercase the rest. The separator marks a fresh "sentence-start."

| Wrong (single sentence case) | Right (segmented sentence case) |
|------------------------------|---------------------------------|
| `Spacing & layout`           | `Spacing & Layout`              |
| `Visual theme & atmosphere`  | `Visual theme & Atmosphere`     |
| `State layer & focus`        | `State layer & Focus`           |
| `Do's & don'ts`              | `Do's & Don'ts`                 |
| `Tracking & line-height principles` | `Tracking & Line-height principles` |

Hyphenated compounds inside a segment (`line-height`, `top-level`) do **not** start a new segment — they follow sentence case as one word.

**Parentheses do not shield segments.** A separator inside `(…)` still splits the label, and the word *after* the separator is capitalized as a fresh segment-start — `Default bindings (assist / Filter chip)`, `IA mapping (heading → Docs surface)`. The opening parenthesis itself is not a separator: the word immediately after `(` stays lowercase when only the parenthetical-opening preceded it.

**Why** — Capitalizing the segment-initial word anchors the parallelism without escalating to title case, and drops cleanly in Korean.

### Iconography

A single icon family aligned to the typographic grid: sizes ride a four-step `icon.*` scale mirroring the type ladder, and color always inherits from the same `on*` foreground as the surrounding text.

#### Family & style

Chorus uses **one icon family** for the entire product. Mixing libraries drifts in stroke weight, terminal style, and corner radius once the catalogue grows past a few dozen glyphs.

- **Style** — outlined glyphs at rest, filled glyphs to mark *selected / active / committed* state on the same icon (selected tab, toggled favorite, active filter). Filled vs outlined is a **state signal**, never a stylistic choice for emphasis.
- **Stroke weight** — match the weight of the adjacent type. A `label.md` (600 Semibold) row pairs with a 1.5–2px stroke; a `display.lg` hero pairs with a 2.5–3px stroke.
- **Custom icons** — draw on the same grid, with the same stroke weight and corner radius as the family's nearest analogue. Add to a project-local set; do not edit the upstream family file.

#### Size grid

Two canonical sizes aligned to the type ladder. Each matches a category of `typo.*` so the icon's optical height equals the cap-height of the text beside it.

| Token            | Pixel size | Pairs with                                | Use                                                                  |
|------------------|------------|-------------------------------------------|----------------------------------------------------------------------|
| `icon.md`        | 16 px      | `typo.label.md`, `typo.body.md`, `typo.body.sm` | **Default**. Buttons, list items, menu items, form-field affixes, toolbars, chips, tabs, `medium` Icon Button, Feed engagement counters. |
| `icon.lg`        | 24 px      | `typo.label.lg`, `typo.body.lg`, `typo.heading.sm` | Primary CTAs, prominent toolbar actions, section headers, FAB, Navigation Bar slots, `large` Icon Button. |

The grid is **drawing-area, not bounding-box**. A 16px icon should occupy ~13px of optical weight inside a 16px frame; breathing margin keeps icons aligned with descender-free text.

#### Color & state

Icons consume the same `on*` foreground tokens as the text they sit with — never a dedicated icon color.

- **Solo icon (icon-only button)** — color is the parent control's foreground role (`color.onSurface` for a ghost button, `color.onPrimary` inside a primary fill).
- **Icon + label** — both use the same foreground; never paint the icon a different hue for emphasis. Hierarchy belongs to the label.
- **Inactive / disabled** — inherit from the surrounding `state.disabled` opacity; do not pre-darken the icon SVG.
- **Status icons** (success/error checks, alert glyphs) follow the accent role they signal: `color.success`, `color.error`, paired with their `on*` foreground when on a filled accent surface.

#### Alignment & layout participation

Icons participate in `layout.inline.*` — the gap is `layout.inline.md` by default, `layout.inline.sm` inside compact controls. Don't compensate with `margin` overrides; the gap token is the contract.

For optical centering, prefer `display: inline-flex` + `align-items: center` over `vertical-align` hacks. Fix off-grid glyphs in the SVG, not the layout.

#### Source of truth

All product icons — across component code (`packages/ui`) and documentation surfaces (`apps/docs`) — must come from **`@blind-dsai/ui/icons`**. The canonical catalog is rendered on the Iconography page in docs.

Inline `<svg>` in component or page files is permitted in exactly two cases: (a) the brand mark itself — the Chorus logo (identity, not iconography), and (b) decorative illustrations bound to a single layout. Anything that could plausibly appear in two places must be in the library.

A glyph qualifies for the library when it satisfies all three: drawn on the 24×24 grid, uses `currentColor` for fill/stroke, and renders without a hardcoded pixel size (callers pass `size`, defaulting to `icon.md`). Bypassing the library forfeits dark-mode contrast and token-driven density changes.

The procedural details — folder layout, registration recipe, naming conventions — live at [`packages/ui/src/icons/README.md`](../packages/ui/src/icons/README.md).

### Spacing & layout

An 8px base materializes into a percentage-keyed reference scale, then composes into four orthogonal layout axes — `page` → `container` → `stack` → `inline` — each owning one spatial relationship and stepping up on web. [Composition recipes](#composition-recipes) at the end pin down *which step* of each axis to pick for the five compositional situations every product surface runs into.

#### 8px base unit

Every spacing value is a multiple of **8px**. The base makes grid alignment automatic and lets a global density change be a single-file edit at the reference tier.

**Why 8px** — divides cleanly at every common display density (1×, 1.5×, 2×, 3×) without sub-pixel artifacts, gives enough resolution at small sizes (4px / 6px sub-steps), and matches the type system (16px body sits on 2× base; 24px line-height on 3× base).

##### Naming reflects the multiplier

`space.100` is the canonical unit (8px = 1×). The numeric suffix expresses value as a percentage: `space.200` = 200% = 16px, `space.50` = 50% = 4px, `space.400` = 400% = 32px. Sub-base steps (`25` / `50` / `75`) cover hairline rhythms; everything from `100` upward is an integer multiple of the base.

##### Base-unit ladder

The discrete numeric values from the 8px base form a **single canonical ladder** every other Chorus scale draws from:

```
0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 48 · 64 · 80
```

The ladder is unitless. Scales bind it to different units:

- **Spacing** binds to **pixels** — each rung is a `space.*` step (`0px` … `80px`); see [Reference scale](#reference-scale).
- **Type rungs** bind to **pixels** for ladder rungs (8 / 16 / 24 / 32 / 40 / 48 / 64 / 80px); finer typographic resolution adds in-between rungs where legibility demands it ([Font-size scale](#font-size-scale)).
- **Opacity** binds to **percent** — `palette.black.*` / `palette.white.*` alphas are drawn from the ladder read as percent, plus a color-specific endpoint at `100%` for fully-opaque overlays (`color.focus`, `color.elevation`). 100 isn't on the spacing/typography ladder because spacing has no "fully opaque." See [Opacity ramp](#opacity-ramp).

Surfaces needing a value outside the ladder are a code-review signal — either the ladder needs a step, or the surface is reaching past the system tier.

#### Reference scale

The `space.*` rungs materializing the spacing binding of the [base-unit ladder](#base-unit-ladder). Bands: **0** is reset, **25–75** are sub-base hairlines, **100–300** are control-and-content rhythm, **400–1000** are page-and-section framing. `space.100` (base) and `space.200` (default) are the two anchor steps.

Components consume `layout.*` system tokens. `lg`-and-above steps carry a mobile→web step-up; **`md` and below stay constant** — the natural pick for fixed-footprint controls (buttons, chips, table cells, toolbar items). Reach for raw `space.*` only when a fixed-footprint control needs a value `layout.*` doesn't expose.

Each rung carries `$multiplier` (× the 8px base), `$rem`, and pixel `$value`. The rem convention is **browser-default `1rem = 16px`** — same as `fontSize.*`, so the same px lands at the same rem (`space.200` = `fontSize.200` = 16px = `1rem`). Consumers wanting to respect the user's browser font-size preference can emit `$rem`.

| Token        | Base unit multiplier | Rem      | Pixels | Role                                                                                |
|--------------|----------------------|----------|--------|-------------------------------------------------------------------------------------|
| `space.0`      | 0×                   | 0rem     | 0px    | No space. Reset inherited spacing or collapse a gap without removing the property.  |
| `space.25`     | 0.25×                | 0.125rem | 2px    | Hairline. Visually bonded pairs — counter badge ↔ anchor, glyph ↔ diacritic.        |
| `space.50`     | 0.5×                 | 0.25rem  | 4px    | Very tight. Compact icon + adjacent label inside small controls; dense pill/tag padding. |
| `space.75`     | 0.75×                | 0.375rem | 6px    | Tight intermediate. Use when 4px feels cramped but 8px breaks rhythm.                |
| `space.100`    | 1×                   | 0.5rem   | 8px    | Base unit. Icon-label gap inside buttons/inputs; compact list item spacing.     |
| `space.150`    | 1.5×                 | 0.75rem  | 12px   | Button / input-field padding; gap between adjacent buttons in a toolbar.            |
| `space.200`    | 2×                   | 1rem     | 16px   | Default. Card / list-row / sheet content padding; paragraph and card-stack gap. |
| `space.250`    | 2.5×                 | 1.25rem  | 20px   | Between default and spacious. Slightly roomier card padding on web.                  |
| `space.300`    | 3×                   | 1.5rem   | 24px   | Spacious card padding, dialog body insets, gap between distinct content groups.     |
| `space.400`    | 4×                   | 2rem     | 32px   | Page-level gutters, hero section insets, large modal bodies, top-level section gaps. |
| `space.500`    | 5×                   | 2.5rem   | 40px   | Landing heroes and marketing pages that demand wide margins.                         |
| `space.600`    | 6×                   | 3rem     | 48px   | Showcase hero layouts; extra-wide marketing canvases.                                |
| `space.800`    | 8×                   | 4rem     | 64px   | Oversize breaks between distinct page regions on very wide displays.                 |
| `space.1000`   | 10×                  | 5rem     | 80px   | Maximum scale step. Reserved for the widest page-level framing.                      |

#### Layout axes

Where the spacing scale graduates from raw values into layout vocabulary.

##### Four orthogonal axes

Ordered by spatial scope outermost to innermost (`page` → `container` → `stack` → `inline`). Each axis owns one spatial relationship and is applied by one kind of element. Axes never substitute for each other. Every axis carries an internal T-shirt scale (`xs` / `sm` / `md` / `lg` / `xl`, with `2xl` / `3xl` / `3xs` / `2xs` extensions). **Steps above `md` (`lg`, `xl`, `2xl`, `3xl`) carry a mobile→web step-up; `md` and below stay constant.**

The `sys.layout.*` group in [`system.json`](schema/tokens/system.json) defines four role-scoped semantic groups. At the web breakpoint (≥800px), only steps above `md` shift one step up:

| Axis                | Scope                       | Question it answers                                                | Owner                            |
|---------------------|-----------------------------|--------------------------------------------------------------------|----------------------------------|
| `layout.page.*`     | Viewport ↔ content          | How far should any content stay from the screen edge?              | Page shell (applied once per route) |
| `layout.container.*`| Surface ↔ its content       | How much breathing room does this card / sheet / dialog give?      | The individual surface           |
| `layout.stack.*`    | Sibling ↔ sibling (vertical)   | How much vertical gap between these two column siblings?        | The flex/grid parent             |
| `layout.inline.*`   | Sibling ↔ sibling (horizontal) | How much horizontal gap between these two row siblings?         | The flex/grid parent             |

`page` and `container` stack: a card inside a page is inset by `page` padding *plus* its own `container` padding. Removing the card doesn't change the page gutter; removing the page gutter doesn't change the card's internal padding.

#### Viewport-edge gutter

The outermost gutter between the viewport edge and page content. Applied **once** per route at the page shell. Full-bleed elements (hero images, sticky headers, edge-to-edge banners) opt out by negating this padding, not by changing the token.

##### Four-step T-shirt scale

`sm` / `md` / `lg` / `xl`. `md` is canonical default for ordinary app routes; other steps shift *page personality* (compact / canonical / generous / showcase). No `xs` or `2xl+` — page gutter is intentionally narrow vocabulary.

| Token              | Value (mobile → Web) | Role                                                              |
|--------------------|----------------------|-------------------------------------------------------------------|
| `layout.page.sm`     | 8 px (constant)      | Compact gutter for information-dense routes — dashboards, admin tables, multi-pane list/detail views. Resolves to `ref.space.100`. |
| `layout.page.md`     | 16 px (constant)     | Default. Canonical page gutter for ordinary app routes. Resolves to `ref.space.200`. |
| `layout.page.lg`     | 24 → 40 px           | Generous gutter for marketing and content-forward pages — landings, editorial routes, high-emphasis CTAs. Resolves to `ref.space.300` (mobile) / `ref.space.500` (web). |
| `layout.page.xl`     | 40 → 64 px           | Widest gutter. Showcase heroes and brand-moment landings. Use sparingly — overuse breaks the shared page rhythm `md` establishes. Resolves to `ref.space.500` (mobile) / `ref.space.800` (web). |

#### Surface-internal padding

Padding inside a bounded surface — the room between a container's edge and its content. Cards, sheets, dialogs, popovers, list rows, toolbars, sections, form groups.

##### Nine-step T-shirt scale

`3xs` → `3xl`. `md` is the default. Lower steps (`3xs` / `2xs` / `xs` / `sm`) cover *control-density* surfaces (chips, buttons, dense cells); upper steps (`lg` / `xl` / `2xl` / `3xl`) cover *content-emphasis* surfaces (dialogs, hero blocks, marketing canvases).

**Rule of thumb** — if removing the container makes the padding meaningless, it belongs here. If the padding exists to keep content away from the screen edge regardless of surface, it belongs in `layout.page.*`.

| Token                | Value (mobile → Web) | Role                                                              |
|----------------------|----------------------|-------------------------------------------------------------------|
| `layout.container.3xs` | 2 px (constant)      | Hairline inset. Tightly packed chip/badge interiors, icon-only controls. Density is the design intent. Resolves to `ref.space.25`. |
| `layout.container.2xs` | 4 px (constant)      | Compact inset for small pills, dense tags, tightly-spaced inline controls. Resolves to `ref.space.50`. |
| `layout.container.xs`  | 8 px (constant)      | Small-control padding. Chip body padding, segmented-control items, compact list rows, dense table-cell inputs. Resolves to `ref.space.100`. |
| `layout.container.sm`  | 12 px (constant)     | Button and input-field padding. Also the canonical one-rung step-down for a child container nested inside a `container.md` parent — see [Composition recipes § Nested container padding](#nested-container-padding-parent-tighter-than-child-is-wrong-child-must-be-tighter). Control's inset doesn't compete with surrounding surface padding. Resolves to `ref.space.150`. |
| `layout.container.md`  | 16 px (constant)     | Default. Card, list-row, and sheet-content padding — the system-wide baseline section padding (see [Composition recipes § Section horizontal padding](#section-horizontal-padding-16px-global-16px-touch-safe-margin)). Resolves to `ref.space.200`. |
| `layout.container.lg`  | 24 → 32 px           | Spacious card padding, dialog body insets. Higher-hierarchy surfaces — primary dialogs, feature-card callouts. Resolves to `ref.space.300` (mobile) / `ref.space.400` (web). |
| `layout.container.xl`  | 32 → 40 px           | Hero section insets and large modal bodies. Surfaces carrying top-level page weight. Resolves to `ref.space.400` (mobile) / `ref.space.500` (web). |
| `layout.container.2xl` | 48 → 64 px           | Landing heroes and marketing layouts where padding is part of the visual composition. Resolves to `ref.space.600` (mobile) / `ref.space.800` (web). |
| `layout.container.3xl` | 64 → 80 px           | Largest container inset — showcase heroes, extra-wide marketing canvases. Use sparingly. Resolves to `ref.space.800` (mobile) / `ref.space.1000` (web). |

#### Vertical sibling gap

Vertical gap between stacked elements — form fields, list items, sections. Use `gap` in a flex/grid column or consistent `margin-top` on each child.

##### Nine-step T-shirt scale

`3xs` → `3xl`, the same range as `container.*`. `md` is the default (paragraph / card-stack rhythm). Lower steps (`3xs` / `2xs`) signal *visually bonded* pairs (label↔input, title↔subtitle); upper steps (`xl` / `2xl` / `3xl`) signal *page-section* breaks.

| Token              | Value (mobile → Web) | Role                                                              |
|--------------------|----------------------|-------------------------------------------------------------------|
| `layout.stack.3xs`   | 2 px (constant)      | Hairline rhythm. Visually bonded stacked pairs — badge ↔ counter line, two metadata lines that should read as one unit. Resolves to `ref.space.25`. |
| `layout.stack.2xs`   | 4 px (constant)      | Tight rhythm. Label ↔ input, caption ↔ parent text, title ↔ immediately-attached subtitle. Signals the two elements describe the same thing. Resolves to `ref.space.50`. |
| `layout.stack.xs`    | 8 px (constant)      | Compact list spacing and small-element grouping — dense feed rows, compact menus, tightly-set metadata blocks. Also the canonical gap when adjacent sections need an explicit separator beyond their paddings — see [Composition recipes § Section ↔ section vertical separation](#section--section-vertical-separation-optional-8px-when-needed) — and the tighter rhythm for one-bound-group content blocks (see [Composition recipes § Content ↔ content vertical rhythm](#content--content-vertical-rhythm-inside-a-section-16px-default-8px-for-one-group-blocks)). Resolves to `ref.space.100`. |
| `layout.stack.sm`    | 12 px (constant)     | Form field gap — between two adjacent fields or between rows in a dense list. Fields belong to the same logical block. Resolves to `ref.space.150`. |
| `layout.stack.md`    | 16 px (constant)     | Default. Paragraph spacing and the baseline gap between peer content blocks (paragraph↔paragraph, card↔card, item↔item) inside a content region — see [Composition recipes § Content ↔ content vertical rhythm](#content--content-vertical-rhythm-inside-a-section-16px-default-8px-for-one-group-blocks). Resolves to `ref.space.200`. |
| `layout.stack.lg`    | 24 → 32 px           | Gap between distinct content groups within a section — heading block ↔ body block, form group ↔ submit area. Resolves to `ref.space.300` (mobile) / `ref.space.400` (web). |
| `layout.stack.xl`    | 32 → 40 px           | Gap between top-level page sections. Strong content break that still sits within a single scroll region. Resolves to `ref.space.400` (mobile) / `ref.space.500` (web). |
| `layout.stack.2xl`   | 40 → 48 px           | Strong section break on content-dense vertical pages — hero → feature → CTA reads as discrete chapters. Resolves to `ref.space.500` (mobile) / `ref.space.600` (web). |
| `layout.stack.3xl`   | 48 → 64 px           | Widest vertical break — hero-scale separations on marketing, landing, long-form pages. Use sparingly. Resolves to `ref.space.600` (mobile) / `ref.space.800` (web). |

#### Horizontal sibling gap

Horizontal gap between sibling elements on a row — icon/label, adjacent buttons, chips. Use `gap` (flex/grid) or horizontal `margin`.

##### Six-step T-shirt scale

`xs` / `sm` / `md` / `lg` / `xl` / `2xl` — the narrowest layout axis. `md` is the default (icon-label gap inside controls). Steps at and below `md` stay constant across breakpoints (bonded inline pairs); upper steps (`lg` / `xl` / `2xl`) carry the web step-up for toolbar, breadcrumb, and rail-scale gaps.

| Token              | Value (mobile → Web) | Role                                                              |
|--------------------|----------------------|-------------------------------------------------------------------|
| `layout.inline.xs`   | 2 px (constant)      | Almost touching. Visually bonded inline pairs — character ↔ diacritic, counter ↔ anchor, currency ↔ amount. Resolves to `ref.space.25`. |
| `layout.inline.sm`   | 4 px (constant)      | Very tight. Icon + label inside small controls — dense chips, icon buttons, filter pills. Resolves to `ref.space.50`. |
| `layout.inline.md`   | 8 px (constant)      | Default. Icon-label spacing inside buttons and inputs; gap between tightly related inline elements. Resolves to `ref.space.100`. |
| `layout.inline.lg`   | 12 → 16 px           | Gap between adjacent buttons in a toolbar, chips in a chip group, tabs in a tab bar. Independent targets, equal weight. Resolves to `ref.space.150` (mobile) / `ref.space.200` (web). |
| `layout.inline.xl`   | 16 → 24 px           | Spacious gap. Separates distinct inline groups — top-nav links, breadcrumb segments, toolbar clusters. Resolves to `ref.space.200` (mobile) / `ref.space.300` (web). |
| `layout.inline.2xl`  | 24 → 32 px           | Widest horizontal break. Rail-scale separations — the gap between a horizontally-scrolling track and its anchored trailing action, or between two unrelated horizontal clusters on the same row. Use sparingly. Resolves to `ref.space.300` (mobile) / `ref.space.400` (web). |

#### Composition recipes

The four axes name *what role* a value plays; the recipes below name *which step* to pick for the five compositional situations every product surface runs into. Every recipe resolves to a step in the tables above.

##### Section ↔ section vertical separation (optional, 8px when needed)

Two adjacent sections **do not require an extra vertical gap**. Each section's `layout.container.*` padding on its top and bottom edges is normally enough to read as separation; adding a stack gap creates triple breathing room.

When back-to-back paddings no longer register as a section break, add **`layout.stack.xs` (8px)** between sections — never larger. Anything bigger reads as a page-region break — promote one section to a top-level region instead (`stack.lg` / `stack.xl`).

##### Content ↔ content vertical rhythm inside a section (16px default, 8px for one-group blocks)

Within a single content region, the baseline gap between blocks is **`layout.stack.md` (16px)** — the default reading rhythm for paragraph↔paragraph, card↔card, item↔item.

When blocks belong to **one tightly-bound group** (bullet rows, metadata lines, fields about the same entity), tighten to **`layout.stack.xs` (8px)**. The 8px rung says "these belong together"; the 16px default says "these are siblings within the same region." Don't go below 8px for group rhythm — the smaller `stack.3xs` / `stack.2xs` rungs are reserved for *visually bonded* pairs (label↔input, title↔subtitle).

A wider gap is correct when the blocks are **distinct structural groups inside one section** — header block ↔ body block, form group ↔ submit cluster, list label ↔ scrollable track. That case is `layout.stack.lg` (24 → 32px): peers within each block sit at 16/8, the gap between blocks sits at `stack.lg`. If the gap reaches `stack.xl` or beyond, promote one block to a top-level region.

##### Section horizontal padding (16px global, 16px touch-safe margin)

A section's left/right padding is **`layout.container.md` (16px)** by default.

For a section containing a **touch target** that extends past the visible content frame (icon button with invisible hit area, full-width tappable row), the **visible content's safe margin from the section edge must still total 16px** — but it can be *split* between the section's padding and the touch element's padding. A row with a 4px-padded icon button at its leading edge can sit in a section padded to 12px (`layout.container.sm`); the visible glyph still lands 16px from the section edge while the hit area extends to 12px. The contract is the *visual* 16px.

##### Body text size (14px in mixed-group sections, 16px on single-topic pages)

When a section composes **multiple distinct text groups** in its body (cards listing short descriptions, settings page mixing labels and helper text, feed of compact items), default to **`sys.typo.body.sm` (14px)**.

When a section is the **single-topic body of a page** (article, long-form description, documentation block, one-up content surface), default to **`sys.typo.body.md` (16px)**. The 14px fallback applies the moment a second peer text group joins the surface.

##### Nested container padding (parent-tighter-than-child is wrong; child must be tighter)

When a content area lives inside another, **the inner area's padding must be tighter than the outer's**. A flat parent-and-child both at `layout.container.md` (16px) reads as two unrelated peers.

The canonical step-down is **one rung**: parent at `layout.container.md` (16px) → child at `layout.container.sm` (12px). Step down once more for a third level (`xs`, 8px). Same direction across the whole tree — never invert, never skip rungs. The same rule governs nested padding inside cards, dialogs, and list rows: every nesting level tightens by one rung until `container.xs`, after which further nesting drops out of padding and into `inline.*` / `stack.*`.

### Radius

A T-shirt scale chosen by visual role, so a global shape adjustment is a single-file edit.

#### Scale

An eight-step ramp from `none` (square) through six T-shirt rungs to `full` (capsule), with two anchored defaults (`md`, `xl`).

- **Endpoints** — `none` (load-bearing geometry) and `full` (pills, circles). Either-or, not on the rounding ramp.
- **Control band** — `xs` / `sm` / `md`. **`md` (8px)** is the default control radius.
- **Surface band** — `lg` / `xl` / `2xl`. **`xl` (16px)** is the default surface radius. A button (`radius.md`, 8px) inside a card (`radius.xl`, 16px) reads as *inside* the card.

| Token         | Value     | Role                                                                                  |
|---------------|-----------|---------------------------------------------------------------------------------------|
| `radius.none`   | 0px       | Square corners. Use when the shape itself is load-bearing — dividers, table cells, full-bleed media. Also when a parent already clips to a radius and the child needs to sit flush. |
| `radius.xs`     | 2px       | Hairline softening. Removes optical sharpness without reading as "rounded" — tags, badges, code chips, inline image thumbnails, small swatches. |
| `radius.sm`     | 4px       | Subtle round that still reads as precise. Dense controls, table-cell inputs, filter chips, small meta chips. Good for utilitarian, data-dense surfaces. |
| `radius.md`     | 8px       | Default control radius. Buttons, inputs, selects, segmented controls, tabs. Soft enough to feel friendly, tight enough to read as a precise hit target. |
| `radius.lg`     | 12px      | Mid-surface corner. Small cards, list-item tiles, popovers, tooltips, toast-style surfaces. Also the right step for oversized controls (hero CTA buttons) where extra rounding keeps the silhouette in proportion. |
| `radius.xl`     | 16px      | Default surface radius. Cards, sheets, dialogs, modals, banners. Larger than control radii so containers visually "hold" the controls they contain. |
| `radius.2xl`    | 24px      | Hero / marketing surface corner. Showcase cards, feature tiles, landing-page blocks where shape contributes to visual warmth. Use sparingly. |
| `radius.full`   | 9999px    | Fully rounded — capsule on any rectangle, perfect circle on any square. Pill buttons, status chips, avatar frames, FABs, progress indicators. |

#### Asymmetric radii

For edge-anchored surfaces — bottom sheets, side drawers, popover tails, attached tabs — round only the corners that don't touch the anchor. A bottom sheet rounds top two corners at `radius.xl`, bottom two at `0`; a left-anchored drawer rounds only its right edge; a tab attached to a panel rounds only the corners facing away.

Apply the existing `radius.*` value to specific corners (`border-top-left-radius`, etc.). **Don't introduce per-corner tokens** — they multiply the token surface, drift independently, and don't survive a global radius change.

#### Capsule vs circle

`radius.full` (9999px) is larger than any control dimension, so shape is determined by the *element's aspect ratio*: perfect capsule on any rectangle, perfect circle on any square.

- **Capsule** — pill buttons, status chips, badges, progress tracks, segmented-control thumbs. Any rectangle whose width changes with content.
- **Circle** — avatars, FABs, circular icon buttons, radio dots, single-character indicators. Anything sized 1:1.

Do not approximate a capsule with `radius.2xl` or any finite step — corners drift as content length changes. Use `full`.

### Border & stroke

A four-step stroke-width scale paired with color and radius tokens — borders are *width × color × shape*.

#### Why a width scale

Hardcoded values (`border: 1px`, `border: 2px`) accumulate inconsistently across components. A small named scale gives every stroke a reason for its weight, the same way `radius.*` gives every corner a reason for its softness.

#### Scale

| Token              | Value | Role                                                                                       |
|--------------------|-------|--------------------------------------------------------------------------------------------|
| `borderWidth.none`   | 0px   | No stroke. The width *values* in this scale are what a control's stroke reads at (`hairline` rest, `thin` for an emphasis / active stroke); a control whose stroke should disappear in some state sets its colour `transparent`, not its width to `0px` (see the box-model note below) — `borderWidth.none` is for the rare layout where dropping the stroke's box is the intent (a divider that should genuinely collapse). |
| `borderWidth.hairline` | 1px | Default. Subtle dividers (table rows, list separators), card edges, input borders, outlined buttons. |
| `borderWidth.thin`     | 2px | Emphasis borders — focus ring outer, selected-state outlines, error-state field borders. Strong enough to register without competing with the fill. |
| `borderWidth.thick`    | 4px | Load-bearing strokes — keyboard-focus emphasis on touch surfaces, status indicators (active tab underline at hero scale), decorative rules. Use sparingly. |

The focus ring composition (see [Focus ring composition](#focus-ring-composition)) consumes `borderWidth.thin` for the outer ring and a 1px inner counter-ring.

**Sub-pixel widths are forbidden.** A 0.5px hairline renders inconsistently across DPR. For a thinner-than-1px effect, lower the stroke color's *opacity*, not the width.

**A control's stroke never touches the box model — implement as inset `box-shadow`, not `border`.** Every interactive control (Button, Chip, Toggle / Toolbar Button, Tabs that delegate to Chip, Form field input, …) draws its visible edge stroke as `box-shadow: inset 0 0 0 <width> <colour>` and sets `border: none`. `box-shadow` is paint, not layout: zero box-model cost in every state. So —

- **Presence is free.** An `outlined` Button is the *same size* as a filled one. A bordered Chip is the same footprint as a borderless one.
- **State changes don't reflow.** A Filter chip / Segmented tab swapping selected ↔ unselected only changes the shadow's *colour* (to `transparent` where the stroke should disappear) — width stays fixed, so a chip row never jitters.
- **A heavier stroke doesn't grow the control.** A text field stepping `hairline` → `thin` widens the *shadow* (`inset 0 0 0 2px`) — height stays exactly `content + padding` (24px line-box + 16px padding = 40px, never 42).

Same reasoning makes the [focus ring](#focus-ring-composition) a `position: absolute` overlay rather than an `outline` / `box-shadow` on the control: **a stroke, state change, or focus indicator must never reflow a layout.** Set `box-sizing: border-box` on the control (don't rely on the consumer's reset). (Structural dividers between rows — list separator, section rule — *are* part of layout and a real `border` is fine; this rule is about a *control's own edge stroke*.)

**Edge strokes on cards hosting full-bleed children paint on a `::after` overlay, not an inset shadow on the card itself.** An inset `box-shadow` is painted *between* the background and content layer — so when a card's child has its own opaque fill (cover band, hero thumbnail, header band) reaching the card's edge under `overflow: hidden`, the child's fill masks the stroke. The visible bug: a card outline that vanishes at the top while intact elsewhere. Fix: promote the stroke to `::after` (`position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 2; box-shadow: inset 0 0 0 <width> <colour>`) on the card. The overlay sits above every child. Controls whose interior is *padded* (Button, Chip, Form field, post-carousel card with `padding: layout.container.md`) keep the inset-shadow recipe — no child reaches the edge. Promotion is only required when a child paints to the card's outer edge.

### Elevation

Shadows are classified by **spatial role**, not by component. A card and a selected list row both read as `raised`; a FAB and a dropdown both read as `floating`.

#### Scale

Three lift levels plus one direction-special token. Each preset is a self-contained two-layer shadow (tight ambient + wider spread); components consume the role, never assemble shadows themselves.

- **Lift ramp** — `raised` (subtle) → `floating` (free-floating) → `overlay` (page-blocking). Each step deepens the spread layer; meaning is the spatial relationship (sits-on vs hovers-above vs blocks).
- **Direction-special** — `sheet`. Same intensity as `floating`, offset inverted so the shadow projects *away from the anchored edge* (bottom sheets cast upward).
- **Two-layer composition.** Tight ambient layer + wider spread layer, mirroring physical light so edges stay crisp while the halo fades.
- **Shadow alphas come from the overlay palettes.** `palette.black.*` draws from the [base-unit ladder](#base-unit-ladder) read as percent — every shadow alpha (4 / 6 / 8 / 12 / 16 / 20%) is a ladder step.

| Token                | Two-layer shadow                                                                  | Role                                                                              |
|----------------------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `elevation.raised`     | `0 1px 2px black/4%, 0 2px 6px black/6%`                                          | Subtle lift. Cards at rest, hovered list rows, selected menu items, buttons that should read as gently elevated without demanding attention. |
| `elevation.floating`   | `0 2px 4px black/6%, 0 8px 20px black/12%`                                        | Free-floating above the page. FABs, floating menus, dropdowns, autocomplete panels — elements that detach from the flow and hover over content. |
| `elevation.overlay`    | `0 4px 12px black/8%, 0 16px 48px black/20%`                                      | Page-level overlay demanding user focus. Modals, dialogs, popovers, full-screen prompts that sit above a scrim and block interaction below. |
| `elevation.sheet`      | `0 -2px 6px black/4%, 0 -8px 24px black/16%`                                      | Edge-anchored panel projecting shadow away from its anchored edge (here, anchored bottom — shadow rises). Bottom sheets, side drawers, pinned panels. |

### State layers & focus

A single rule expresses every interactive state — paint a translucent layer of the element's foreground over its base, at the state's opacity — paired with a three-layer focus ring.

#### State overlays

Interactive controls need feedback for hover, focus, pressed, dragged across many base colors and variants. Chorus expresses state as **a single rule** (foreground-over-base), so a new color role or variant requires zero new state tokens.

##### Intensity ramp plus a categorical

- **Interaction ramp** — `hover` (8%) → `focus` (12%) → `pressed` / `dragged` (16%). Ascending intensity. `pressed` and `dragged` share opacity (both represent sustained engagement).
- **Categorical special** — `disabled` (40%). Not on the overlay ramp; *element's own opacity*, with overlay layers suppressed.
- **Stacking rule** — ramp layers stack additively when states coexist (focus + hover → 8% + 12%). `disabled` is exclusive.

**How to apply**:

1. **Pick the overlay color** — it is the element's foreground.
   - Filled primary button → `color.onPrimary`.
   - Tonal button on `primaryContainer` → `color.onPrimaryContainer`.
   - Text / ghost button on `surface` → `color.primary` (the ink becomes the overlay when there is no fill).
   - Selectable surface (list row, menu item) → `color.onSurface`.
2. **Pick the opacity from `state.*`** based on active state.
3. **Composite** — render the overlay as a layer (pseudo-element, extra background-image, or `color-mix`) clipped to the element's shape.
4. **Stack additively** when states coexist. Focused + hovered → 8% + 12% composited. Pressed during focus → 12% + 16%.
5. **`disabled` is different**: element's own opacity (40%), not an overlay. Suppress hover/focus/pressed layers; cursor `not-allowed`.

**Scope** — apply to any control the user can hover, focus, press, or drag. Do not apply to static surfaces (page background, plain text, dividers).

| Token            | Opacity | Role                                                                              |
|------------------|---------|-----------------------------------------------------------------------------------|
| `state.hover`      | 8%      | Pointer is over the element. Lowest-intensity layer — gentle highlight, not a commitment. Resolves to `ref.opacity.8`. |
| `state.focus`      | 12%     | Element holds keyboard or programmatic focus. Stronger than hover so focused controls remain visible to keyboard users even when the pointer is elsewhere. Pair with the focus ring composition (see [Focus ring composition](#focus-ring-composition)). Resolves to `ref.opacity.12`. |
| `state.pressed`    | 16%     | Active press / tap / click. Strongest persistent layer — provides tactile feedback before the action completes. Resolves to `ref.opacity.16`. |
| `state.dragged`    | 16%     | Element being dragged (reorderable list items, draggable cards, slider thumbs mid-drag). Matches `pressed` intensity — both represent sustained interaction. Resolves to `ref.opacity.16`. |
| `state.disabled`   | 40%     | Element-level opacity (not an overlay). Indicates the control is non-interactive. Suppress hover/focus/pressed layers and use a non-interactive cursor. Resolves to `ref.opacity.40`. |

#### Focus ring composition

The state overlay alone doesn't meet keyboard-accessibility contrast requirements. Every interactive control pairs `state.focus` with a visible ring on `:focus-visible` — a **three-layer composition** built outward from the control's edge:

| Layer                | Position relative to control          | Width | Token                |
|----------------------|---------------------------------------|-------|----------------------|
| Fill layer           | painted ON the control's surface      | —     | `state.focus` (12%) of the variant's foreground composited over the variant's container |
| Inner counter-ring   | 0 → 1px outside the control's edge    | 1px   | `color.focusInset`   |
| Outer ring           | 1px → 3px outside the control's edge  | 2px   | `color.focus`        |

Reading from the control outward: **fill layer (on the control) → 1px `color.focusInset` → 2px `color.focus`**. Both rings are always visible — `color.focusInset` is a thin interior counter-ring (a single-pixel inverse-toned hairline between control and outer ring); the one-pixel inversion guarantees a visible edge on any surface.

The ring sits on a **dedicated overlay layer** — a `position: absolute` pseudo-element (`::after`) — not an `outline` / `box-shadow` on the control. The pseudo draws *on top of* the state-overlay tint and label, and **never affects layout** — focus moving across a row never reflows a sibling.

Two named compositions cover every control:

**Outward** — the default. Ring sits *outside* the control's footprint, extending 0..3px beyond the edge. For controls that live inline with breathing room — **action affordances**: Button (every appearance), Chip, Form Field, FAB, Icon Button, Text Button. The 3px outward extent is reserved by surrounding layout.

**Inward** — for **container-shaped components** filling their parent edge-to-edge: Tab Bar (slots flush at `flex: 1 1 0`), Tabs Underline (row in `overflow-x: auto` scroller), List (rows tile the column with a hairline divider). Drawn *inside* the bounding box (depth 0..3px inward), avoiding clipping at scrollers / overlap with neighbours / past dividers. Composition is identical to outward; only the offset flips. Both rings inherit the control's `border-radius`. Suppressed while `disabled`.

**Choosing.** Default to **Outward**. Switch to **Inward** when *any* of: (a) the control is flush against a sibling, (b) the parent is an `overflow: hidden` / `overflow-x: auto` scroller, (c) the footprint tiles the available width (`flex: 1 1 0` slot, `width: 100%` list row). The choice is fixed per sub-component — never per-instance.

Canonical CSS recipe — write on a pseudo-element layer, write the multi-shadow inline (do **not** wrap in a `var()`; Chrome resolves stylesheet `box-shadow: var(--multi-shadow)` to zero spreads):

```css
.control { position: relative; isolation: isolate; }

.control::after {
  content: '';
  position: absolute;
  inset: 0;                 /* or `inset: calc(-1 * <border-width>)` to ring the border-box */
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;               /* above the state-overlay ::before and the label/icon */
  box-shadow: none;
  transition: box-shadow 120ms ease;
}

.control:focus-visible::after {
  /* outward — the default */
  box-shadow:
    0 0 0 1px var(--sys-color-focusInset),  /* inner counter-ring, on top */
    0 0 0 3px var(--sys-color-focus);       /* outer ring, visible at 1..3px */
}

/* inside a scroller, re-anchor inward instead (same two layers): */
.scroller .control:focus-visible::after {
  box-shadow:
    inset 0 0 0 2px var(--sys-color-focus),       /* outer stroke at 0..2px in */
    inset 0 0 0 3px var(--sys-color-focusInset);  /* counter-ring visible at 2..3px in */
}

.control:disabled::after { box-shadow: none; }
```

Pair the ring with the per-variant fill rule (`background: color-mix(in srgb, <foreground> calc(var(--sys-state-focus) * 100%), <container>)`) so focus shows BOTH overlay and ring.

#### Text links

A **text link** is a hyperlink whose chrome is only its label — no fill, no border, no capsule. Inline inside prose (a mention `@name`, a citation source) or anchoring a navigation row whose label is the only affordance (channel name under a thumbnail, "View all" footer).

Text links diverge from [State overlays](#state-overlays) because they have no container to paint over. **Express hover as a 1px underline in the link's own color**:

| State        | Treatment                                                                                       |
|--------------|--------------------------------------------------------------------------------------------------|
| `default`    | No decoration. Color is the link's resting ink (`color.primary` for accent links, `color.onSurface` for navigation labels — whatever the surrounding type role specifies). |
| `hovered`    | `text-decoration: underline`, `text-decoration-thickness: 1px`, `text-underline-offset: 2px`. **Color does not change** — the underline is the affordance. |
| `pressed`    | Underline persists; opacity drops to `state.pressed` (16%) overlay on the text via `color-mix` so the link feels tactile without flipping its ink color. |
| `disabled`   | Element opacity at `state.disabled` (40%); underline suppressed. |
| `focused`    | Underline persists; the three-layer focus ring (see [Focus ring composition](#focus-ring-composition)) paints around the link's text box. |

Underline appears **only on hover** because resting text already inherits hierarchy from `typo.*` — a permanent underline would over-emphasize navigation chrome.

**Do not change color on hover.** A blue-on-hover (flipping to `color.primary`) competes with the surrounding type's color hierarchy and reads as a category change. Underline owns hover; color owns role.

```css
.text-link {
  color: inherit;             /* or color.primary for accent links */
  text-decoration: none;
}
.text-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
.text-link:focus-visible {
  /* three-layer focus ring per Focus ring composition above */
}
```

**Scope** — apply to: inline prose hyperlinks, mention chips as plain `@name` ink, citation source attributions, avatar-rail labels under thumbnails, "View all" / "See more" footers, navigation rows whose entire interactive surface is a single text label. **Do not apply to** buttons (own fill + state overlay), Filter / Tag chips (capsule + container pair), card-shaped links like Feed citation surface (the card *is* the affordance).

#### Caret

The blinking insertion mark inside a text-input slot (`<input>`, `<textarea>`, contentEditable) is a **system-wide rule**. Every component hosting a typing surface ([Form Field Input](components/form-field/input.md), [Form Field Search Bar](components/form-field/search.md), [Navigation Bar Search](components/navigation-bar/search.md), any future text-input slot) inherits the same caret recipe.

| Property         | Value                                          | Token                                |
|------------------|------------------------------------------------|--------------------------------------|
| Color            | High-emphasis foreground of the surface — same ink the user is typing | `sys.color.onSurface` (default), `sys.color.error` (error appearance) |
| Intended width   | 2px                                            | `sys.borderWidth.thin`               |
| Intended height  | 0.75 × the input's text line-box (computed from `line-height`) | derived               |
| Intended ends    | Rounded                                        | radius equal to half the caret width |

**Color is the only part of the recipe browsers honour.** Standard CSS exposes `caret-color` and nothing else — width, height, end-cap shape are painted by the browser's text engine and can't be overridden without forfeiting the native input (and with it: IME composition, RTL, screen-reader cursor, mobile autocorrect). The width / height / rounded-ends columns are **design intent** the system asks browsers to approximate; the enforceable contract is colour.

**Why no Caret component.** A caret isn't compositional — it lives inside a text-input element, has no React tree, can't accept props. Wrapping it would either re-implement the input surface in JS over a `caret-color: transparent` field (breaks platform IME / a11y) or invent a token group with nothing to wire into. Every input-bearing component sets `caret-color: var(--sys-color-onSurface)` (or `var(--sys-color-error)` on error) and references this section.

```css
.chorus-input,
.chorus-field__input,
.chorus-navigation-bar__search-input {
  caret-color: var(--sys-color-onSurface);
}

.chorus-input.is-error,
.chorus-field.is-error .chorus-field__input {
  caret-color: var(--sys-color-error);
}
```

**Inheritance shortcut** — when the input element's `color` is bound to the right ink (Form Field Input sets `color: var(--field-text)` resolving to `onSurface` / `onErrorContainer`), `caret-color` inherits automatically. Set `caret-color` explicitly only when the input's own `color` differs from the caret's intended colour.

### Responsive behavior

Three breakpoints carve the viewport into four named tiers (mobile → tablet → laptop → desktop). Token step-ups happen once, at the mobile→tablet line; chrome layout shifts compose on top.

#### Breakpoints

Four viewport tiers and three lines:

| Tier        | Range            | Crosses               |
|-------------|------------------|-----------------------|
| **mobile**  | <800px           | —                     |
| **tablet**  | 800px – 1099px   | mobile → tablet       |
| **laptop**  | 1100px – 1499px  | tablet → laptop       |
| **desktop** | ≥1500px          | laptop → desktop      |

**Mobile → tablet** at **800px** is the only token-level breakpoint (`$responsive.web`): below, mobile values apply; at or above, web values apply. Every responsive token carries at most two values. The tablet→laptop and laptop→desktop lines are *layout-level* breakpoints used by chrome (side nav becomes a permanent rail at laptop; in-page nav reveals at desktop). Product code reads tokens; only chrome reaches for higher tiers.

#### What grows on web

Per-group rules for the mobile→tablet (800px) step-up. **`md` is the responsive baseline; only sizes above it (`lg`, `xl`, `2xl`, `3xl`) grow on web.** Reading sizes, tap targets, and the `md`-and-below band of every layout axis stay constant.

| Group                            | Web step-up                                       |
|----------------------------------|---------------------------------------------------|
| `typo.display.lg`                | +2 scale steps (48 → 80px)                        |
| `typo.heading.lg`                | +1 scale step (24 → 32px)                         |
| `typo.display.md/sm`, `typo.heading.md/sm` | unchanged — already small enough to read on any viewport |
| `typo.body.*`, `typo.label.*`, `typo.caption.*` | unchanged — reading and tap targets stay constant |
| `layout.*` at `lg` and above     | +1 step (e.g. `layout.container.lg` 24 → 32px)    |
| `layout.*` at `md` and below     | unchanged — flat across the mobile↔web line       |
| Elevation, radius, color, state  | unchanged                                         |

#### Touch targets

Tap-target sizing is owned by [§Accessibility § Touch & Pointer targets](#touch--pointer-targets). The `layout.container.sm` (12 → 16px padding) default produces a 40–48px control height, clearing the 44px iOS / 48px Material guideline.

#### Image and media

Responsive images use `max-width: 100%`. Hero compositions arranging illustration alongside text on web fall back to stacking on mobile via the `layout.stack.*` step-down.

#### Why this split

Most design systems carry 3–5 breakpoints and let *every* token vary across all of them. Chorus splits: tokens vary at one line (mobile↔web), chrome composes the rest. Product code stays a single boolean; every responsive token has at most two values.

The two upper lines exist because chrome has real call sites: side-nav rail needs viewport ≥1100px (content + 320px rail); in-page nav needs ≥1500px (third column). Token step-ups across those tiers would multiply `(token × viewport)` pairs without payoff.

#### Density

Chorus does **not** ship a global "compact mode" toggle. Density is expressed *locally* by picking a smaller `typo.label.*` rung and a smaller `layout.container.*` step on dense controls (table cells, dense toolbars, admin grids). A global density mode would double the surface and let two ways of asking for "smaller" drift apart.

**When you need a denser surface**, choose the smaller rung explicitly:

- Drop the label one step (`label.md` → `label.sm`), drop the matching icon (`icon.md` → `icon.sm`) — note `icon.sm` is the smallest 12px tier in the post-rebalance scale.
- Drop container padding one step (`layout.container.sm` → `layout.container.xs`).
- Keep `radius.md` and the focus-ring composition unchanged — density should not erode hit-target legibility.

---

## Accessibility

### Accessibility

Accessibility is a property of the token system, not a checklist applied at the end. Color quartets clear contrast by construction; focus ring is a system primitive; type scale and tap targets work without zoom.

#### Conformance targets

Chorus targets **WCAG 2.2 Level AA** as the floor for every product surface and **AAA where the foundations already meet it** (e.g. `onSurface`/`surface` clears AAA at 7:1 in both modes). A surface that fails AA is a bug — fix or document the exception.

#### Color contrast

Enforced by the **paired-token rule**: every fill ships with its `on*` foreground, tuned to clear 4.5:1 for body text and 3:1 for large text and non-text UI.

- **Never read contrast manually.** If two roles aren't paired, they aren't a permitted combination. `onSurface` text on a `primary` background bypasses the contract.
- **Surface stack is single-pair.** All `surfaceContainer*` tones read against `onSurface`. The ladder carries *spatial meaning*, not contrast variation.
- **Lower-emphasis text uses `onSurfaceVariant`** — still ≥ 4.5:1 against every surface tone, one step lighter than `onSurface` for two-tier hierarchy.
- **Disabled is the exception.** `state.disabled` (40% opacity) drops below AA on purpose — WCAG 1.4.3 inactive-component carve-out applies. Never use `disabled` styling to convey live information.

#### Touch & pointer targets

Mobile tap targets use `layout.container.sm` (12 → 16px padding) on default controls, producing **40–48px** heights — above 44px iOS / 48px Material.

- **Minimum 44 × 44 CSS pixels** for any interactive touch element. Icon-only buttons inflate hit area with transparent padding, not by enlarging the glyph.
- **Independent targets need an 8px gap** (`layout.inline.md` mobile). Stacked targets use `layout.stack.xs` minimum.
- **Pointer (desktop) targets** can shrink — a 24px close button is fine — but never below 24px or below `borderWidth.thin` × 2 for the visible silhouette.

#### Keyboard navigation

Every interactive control must be reachable, operable, and visible to a keyboard.

- **Tab order follows DOM order.** Don't override with `tabindex > 0`; fix the source order.
- **`:focus-visible`, not `:focus`.** Mouse never paints the ring; keyboard and programmatic focus always do.
- **Skip link** to main content at the top of every route, visually hidden until focused. Persistent side-nav routes also offer a skip past the nav.
- **Custom controls match native semantics.** A `div` styled as a button needs `role="button"`, `tabindex="0"`, Space + Enter, `aria-pressed` / `aria-expanded`. If you can't replicate, use the native element.
- **Arrow-key navigation inside composite widgets** follows [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — Left/Right inside tab strips, Up/Down inside menus, Home/End to ends.
- **Focus must never be trapped** outside an explicit modal context. Modals trap focus while open, restore to trigger on close.

#### Screen reader & assistive tech

- **Visible label is the accessible label.** "Save" button has accessible name "Save"; never duplicate or contradict in `aria-label`.
- **Icon-only controls require an accessible name** via `aria-label` or visually-hidden text. Decorative icons next to a text label use `aria-hidden="true"`.
- **Live regions for async feedback.** Toasts, snackbars, inline form-validation in `aria-live="polite"` (`assertive` only for interruptive failures). Don't rely on color or motion alone.
- **Form fields own their labels.** Every input has `<label for>` or `aria-labelledby`; placeholder is not a label. Required state via `aria-required` plus visual.
- **Error association** uses `aria-describedby` pointing at helper text, plus `aria-invalid="true"`.
- **Don't override `lang`.** Mixed-script content stays under one root `<html lang="ko">` (or `en`); `<span lang>` only when a fragment switches language.

#### Motion & animation

- **Respect `prefers-reduced-motion: reduce`.** Collapse transitions to near-zero, skip transform-based animations. Treat reduced-motion as the safe default.
- **No flashing more than 3 times per second** — WCAG 2.3.1. Cap skeleton pulse at 2 Hz.
- **Auto-advancing carousels and auto-playing video are forbidden** without user control to pause, stop, or hide.

#### Visual & cognitive

- **Don't convey meaning by color alone.** Required markers, error states, status pills pair color with text or icon.
- **Resize support to 200%.** Type scales in rem; layout doesn't break, no horizontal scroll at zoom 200%.
- **Reflow at 320 CSS pixels.** Mobile-narrow content reflows without horizontal scroll except for elements needing 2D scrolling (tables, code blocks, maps).
- **`prefers-contrast: more`** — increase border weight from `borderWidth.hairline` to `borderWidth.thin`, switch `outlineVariant` to `outline`, drop tonal elevation in favor of explicit borders.
- **Plain language.** Use [Voice & content](#voice--content) rules.

#### Internationalization

Chorus is Korean-first with regular Latin admixture.

- **One typeface for both scripts** — see [Font family](#font-family). Substitutes break mixed-script contract and can fail screen-reader pronunciation.
- **Title Case is not used** — no Korean analogue. See [Casing](#casing).
- **Translation expansion budget.** Layouts must absorb ~30% string growth (German, French). Use `min-width` / `max-width` based on longest plausible localization, not Korean measurements.
- **Bidirectional (RTL) text** is out of scope currently. When Chorus adopts an RTL locale, layout axes (`layout.inline.*`, `layout.page.*`) become logical (`inline-start` / `inline-end`); plan for the swap rather than baking `left`/`right` into product code today.
- **Number, date, currency formatting** uses platform `Intl` APIs with user's locale. Korean dates default `YYYY.MM.DD`; Latin locales default to their own convention.

---

## Guidelines

### Do's & Don'ts

Quick rules, paired 1-to-1: each Do has a matching Don't.

#### Do

- **Consume system tokens (`sys.*`).** `var(--sys-color-primary)`, not `var(--ref-palette-blue-500)`. Reference variables exist for documentation only.
- **Reserve Blue 500 as the sole brand-emphasis accent.** `brand` (red) is the identity accent, `success` (green) is the affirmative status accent — neither is a second brand-emphasis hue.
- **Pair every accent fill with its `on*` foreground.** Pairs are tuned to clear AA.
- **Reach for `XContainer` + `onXContainer` for tinted surfaces.** Callouts, info banners, success tiles, selected rows — the Container tone is the tint.
- **Compose state as foreground-over-base.** `state.*` opacity over the element's foreground — works on every variant.
- **Express lift with `elevation.*` shadows.** `surfaceContainer*` names carry spatial *meaning* even when tones collapse.
- **Use `layout.*` for layout-participating spacing.** Page gutters, card insets, section rhythm grow on web; raw `space.*` only for fixed-footprint controls.
- **Apply `layout.page.*` once at the route root.** Nested content uses `layout.container.*` / `layout.stack.*` / `layout.inline.*`.
- **Use Pretendard for both Hangul and Latin.**
- **Use `radius.md` for controls and `radius.xl` for surfaces.** Containers visually "hold" the controls inside them.
- **Build every `:focus-visible` ring from the three-layer composition.** Outer `color.focus`, `state.focus` fill, inner `color.focusInset`.

#### Don't

- **Don't ship `ref.*` variables in product code.** Palette internals; bypassing the system tier defeats rebrandability.
- **Don't introduce a secondary accent hue.** Two brand colors compete instead of arrange.
- **Don't read foreground contrast manually or mix `on*` across roles.** A handpicked text color silently breaks AA as the palette evolves.
- **Don't compose ad-hoc tinted surfaces with `color-mix(<accent> N%, <surface>)`.** A 5–10% accent over `surface*` for a callout, banner, info block, or "subtle" highlight bypasses the Container quartet's AA contract. The only allowed `color-mix` involving an accent is the [state-overlay formula](#state-overlays) or a [decorative gradient stop fading to `transparent`](#four-token-quartet) where text contrast is governed by the underlying base.
- **Don't hardcode hover or pressed colors per component.**
- **Don't add tonal elevation in light mode.** All `surfaceContainer*` tones resolve to `#ffffff` by design.
- **Don't reach for raw `space.*` for layout-level rhythm.** Section gaps, card-stack rhythm, page gutters live in `layout.*`.
- **Don't reapply `layout.page.*` to nested content.** Full-bleed elements opt out by negating the gutter, not by changing the token.
- **Don't substitute Latin-only or Korean-only fonts per region.**
- **Don't introduce per-corner radius tokens.** They multiply the token surface and don't survive a global radius change.
- **Don't use `color.focus` alone.** A single-layer ring fails contrast against same-toned backgrounds.

---

## Voice & content

### Voice & content

The writing layer of Chorus — rules keeping button labels, error messages, empty states, and microcopy coherent.

#### Voice principles

Brand voice is **clear, calm, trustworthy**. Four habits:

- **Plain over clever.** "Save changes" beats "Lock it in." Cleverness ages badly across translations.
- **Direct over hedged.** "We couldn't load your settings" beats "It seems there may have been an issue loading your settings." Hedge words (`maybe`, `seems`, `appears to`) erode trust.
- **User's words, not ours.** Use what the user typed (`post`, `comment`, `room`) over our internal name (`thread`, `entity`, `space`).
- **Anonymous-friendly.** Avoid copy that personalizes from our side ("Hey John!") or assumes identity disclosure ("Tell us about yourself"). Default to second-person plural or impersonal.


#### Buttons & CTAs

- **Verb + object, sentence case.** "Save changes", "Send invite", "Delete post". One verb.
- **Primary CTA is the most likely intent**, not the most important to us. "Continue" beats "Submit" on multi-step forms.
- **Destructive actions name what's destroyed.** "Delete account" beats "Delete".
- **Cancel is always "Cancel"** — never "Nevermind" or "Keep editing".
- **No trailing punctuation** on button labels.

#### Error messages

Three-part structure: **what happened · why it matters · what to do next.** Drop non-load-bearing parts; never invert.

- ❌ "Error 422: validation failed."
- ✅ "Email is already in use. Try signing in instead."

- **Lead with the user's action**, not the system's state. "Couldn't send your post" over "Server returned 500".
- **Never blame the user.** "Wrong password" → "That password didn't match."
- **Avoid jargon and codes** in user-facing copy.

#### Empty states

Three lines max: **what this surface is for · why it's empty · the one action that fills it.**

- ✅ "No posts yet. Conversations you start or join will appear here. **Start a post.**"

The CTA is often the surface's primary action — make it primary visually too (`color.primary` button).

#### Loading & success

- **Loading copy** describes the action, not "Loading…". "Saving your draft", "Sending invite", "Loading 3 of 12 posts".
- **Success copy is short and past-tense.** "Saved.", "Sent.", "Copied to clipboard." — period, not exclamation. Brand voice is calm.

#### Form helper & Validation

- **Helper text describes the rule before the user fails it** — "8+ characters with a number". Validation refers back to the same rule.
- **Required is marked once**, not per field. Mark required ("*") or optional ("(optional)") — pick the rarer label.
- **Inline validation** fires on blur for new fields, on input for fields the user has failed once. Don't lecture mid-typing.

#### Casing, punctuation, and numbers

See [Casing](#casing) for sentence case rules. Additions for body copy:

- **Sentence-final punctuation** in toast bodies, helper text, empty-state prose. Buttons, labels, chips drop the period.
- **Single quotes for inner quotation, double for outer** in English. Korean uses 「 」 inner and 『 』 outer.
- **No Oxford comma** in Korean; honor it consistently in English.
- **Numbers under 10 spelled out in prose** (English); numerals for measurements, IDs, dates, currency. Korean uses numerals throughout.
- **`–` for ranges** (`3–5 posts`), `—` for parenthetical breaks, never `--`.
- **Date formats** — Korean `YYYY.MM.DD`; English `D MMM YYYY` (`29 Apr 2026`). Never `MM/DD/YYYY` or `DD/MM/YYYY`.

#### Localization

- **Write source strings translation-ready.** Avoid embedded HTML/markdown; use placeholders (`{name}`, `{count}`) so translators can reorder. Prefer full sentences over fragments.
- **Plurals via ICU MessageFormat**, not string concatenation. Korean has no grammatical plural; English has two; some have six.
- **Don't truncate at character counts.** Translation expansion doubles Korean in German; accommodate via `min-width` / wrap.
- **Time-sensitive strings** ("just now", "2 hours ago") use `Intl.RelativeTimeFormat`.

---

## Components

The token system bottoms out at components — buttons, inputs, cards, dialogs, the primitives every surface is built from. This chapter is the **anatomy reference**: slots a component owns, system tokens that fill each slot, composition rules across variants.

### Why anatomy, not a catalogue

Chorus does not ship a closed component catalogue. Product surfaces compose system tokens directly; the component tier is opt-in and currently empty. This chapter documents the **shape every primitive should take** — slot names, token bindings, state behavior.

The set below covers components most likely to drift if informal: button, input, card, dialog, chip, tab. Others follow the same anatomy pattern.

Each component anatomy describes:

1. **Slots** — named regions the component owns (`container`, `label`, `leadingIcon`, `trailingIcon`, …).
2. **Tokens per slot** — which system tokens fill each slot in the default variant.
3. **Variants** — how slots re-bind for filled / tonal / outlined / text variants.
4. **States** — how [State overlays](#state-overlays) and [Focus ring composition](#focus-ring-composition) apply per slot.

> Per-component implementation details live in [`schema/components/`](components/README.md). Each spec defers to Chorus-wide rules and only documents component-specific behavior. The catalog itself — families, folder layout, sub-component breakdown — is the README inside that directory.

What stays here: the **shape every primitive should take** plus cross-cutting compositions (empty states, loading patterns).

### Empty states

Three lines max — see [Empty states](#empty-states) in Voice & content for writing rules. Visual composition:

- **Optional illustration** at `icon.xl` or larger, centered, color `color.onSurfaceVariant` (illustrations stay monochrome unless they carry brand-moment intent).
- **Headline** in `typo.heading.sm` color `color.onSurface`, `layout.stack.sm` below illustration.
- **Body** in `typo.body.sm` color `color.onSurfaceVariant`, `layout.stack.2xs` below headline.
- **Primary CTA** as a default-size primary button, `layout.stack.md` below body.
- Whole composition centered inside the surface that would otherwise hold the data.

### Loading & skeleton states

- **Spinners** for indeterminate loads under ~1 second of expected wait. Use `color.primary` for foreground motion on neutral surfaces; reserve to a single spinner per view.
- **Skeleton placeholders** for content shapes that will arrive — feed cards, list rows, profile headers. Skeleton color is `color.surfaceContainerHigh`; the pulse animation runs at 1.5–2 Hz (well below the WCAG flash threshold) and respects `prefers-reduced-motion: reduce` (no animation; show the skeleton statically).
- **Match the shape**, not the content. A skeleton for a feed card uses the same radius, padding, and inline rhythm as the real card so the layout doesn't jump on resolution.
- **Don't skeleton tiny surfaces.** A spinner is faster than authoring a skeleton for a 40px button.
- **Loading copy** lives inside the skeleton or beside the spinner — see [Loading & success](#loading--success) for the writing rule.

---

## Reference

Operational material — how to change the system, recurring vocabulary, working surface for AI agents.

### Adapting Chorus

Editing rules describe *how* to change a token; governance rules describe *who reviews*, *when changes ship*, *how downstream consumers learn*.

#### Editing rules

Six rules ordered by safety, naming the tier you should edit at — reference, system, or component.

- **Rebrand at the reference tier, not the component tier.** If the brand shifts hue, edit `ref.palette.*` in [`schema/tokens/reference.json`](schema/tokens/reference.json). System roles keep names and meaning; components keep working.
- **Extend the system tier when a role is missing.** Add a new semantic token (`color.campaignAccent`, `space.threadRail`) rather than hardcoding values. **Document in DESIGN.md *before* adding the JSON value.**
- **Promote to the component tier only when reuse demands it.** When a component is reused widely and its system-token composition recurs verbatim. Otherwise keep inline.
- **Prune what the service doesn't need.** Unused tokens are future mis-uses. Remove DESIGN.md entry first, then JSON.
- **Document the *why*, not the *what*.** Code shows what; DESIGN.md captures why.
- **One system, many services.** Sub-brands share the system tier while swapping the reference tier for their own identity.

#### Maturity stages

Every token, role, and component primitive carries one of four stages, marked beside its first introduction:

- **Experimental** — newly added, expected to change. Default for tokens under a quarter old; expect breaking edits between minor versions.
- **Stable** — proven across at least three real surfaces. Default state unless marked otherwise.
- **Deprecated** — superseded, scheduled for removal. Carries `**Deprecated:**` note with replacement. Removed in next major.
- **Removed** — JSON entry and DESIGN.md description both gone. Leave a one-line tombstone in the changelog.

Anything not marked is **stable**. Mark *experimental* on introduction; mark *deprecated* the moment a replacement lands.

#### Change flow

Skipping a step is the most common source of drift.

1. **Propose in DESIGN.md.** PR edits prose first — role, rationale, stage. No JSON yet.
2. **Review.** At least one design owner + one engineering owner sign off. Reviewers check the [Token architecture](#token-architecture) two-bar test and naming fit.
3. **Land the JSON value** in the same PR or immediate follow-up. One merge cycle max before the doc rots.
4. **Communicate.** CHANGELOG entry under the upcoming version, one line + PR link.
5. **Adopt.** Product surfaces migrate at their own pace inside the deprecation window.

#### Versioning

**Semantic versioning** at the token-system level:

- **Major** — breaking changes to stable tokens: rename, removal, value shift large enough to break existing layouts (e.g. `space.200` 16px→12px). Ships at most quarterly, bundles all deprecated migrations.
- **Minor** — additive changes to stable tokens or any change to experimental tokens. Ship as needed.
- **Patch** — fixes that don't affect emitted CSS: docs, JSON formatting, build tweaks. Ship freely.

A breaking change without a major bump is a bug.

#### Deprecation window

Deprecated tokens stay shipping **at least one minor cycle** (~quarter) before removal. The deprecation note spells out:

- What replaces the token.
- One-line migration recipe (`var(--sys-color-emphasis)` → `var(--sys-color-primary)`).
- Target removal version.

Removal moves the entry from "Deprecated" to a CHANGELOG tombstone.

#### Ownership

DESIGN.md and `schema/tokens/*.json` have a single editor of record per cycle, named in the repo `README.md`. The editor is tiebreaker on naming, vocabulary, stage decisions. Role rotates so no one owns the system long enough to grow stale.

### Glossary

Chorus-specific vocabulary. The section introducing each term is canonical.

- **Reference tier (`ref.*`)** — Raw palettes, scales, and typeface metrics with no opinion about usage. Components never consume the reference tier directly. See [Token architecture](#token-architecture).
- **System tier (`sys.*`)** — Semantic roles that consume the reference tier and form the vocabulary product surfaces speak in. The default tier for any product code.
- **Component tier (`comp.*`)** — Per-component tokens that bind system roles to a component's contract. Opt-in; currently empty by design.
- **Quartet** — The fixed four-token unit every accent role ships as: `X` / `onX` / `XContainer` / `onXContainer`. The unit of meaning; never use a fill without its `on*`. See [Four-token quartet](#four-token-quartet).
- **Container ladder** — The five-step `surfaceContainerLowest` → `Lowest` → `default` → `High` → `Highest` stack. Encodes *spatial role*, not five distinct fill tones.
- **Base-unit ladder** — The single canonical numeric ladder (`0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 48 · 64 · 80`) that spacing (px), type (px), and opacity (%) all draw from. See [Base-unit ladder](#base-unit-ladder).
- **Layout axis** — One of four orthogonal spacing roles: `page`, `container`, `stack`, `inline`. Each owns one spatial relationship and is applied by exactly one kind of element.
- **Veil / Scrim / Endpoint** — The three opacity bands of `palette.black` / `palette.white`: veil (4–24%) for state overlays, scrim (40–80%) for backdrop dimming, endpoint (0% / 100%) for reset and fully-opaque uses.
- **Tonal elevation** — the pattern of expressing lift via brighter surface tones at higher elevation. Chorus *caps* tonal elevation in light mode (all `surfaceContainer*` collapse onto `#ffffff`); lift comes from `elevation.*` shadows.
- **State overlay** — The single rule that paints a translucent layer of an element's *foreground color* over its *base*, at the opacity defined by `state.*`. One rule, every variant. See [State overlays](#state-overlays).
- **Focus ring composition** — The fixed three-layer focus indicator: outer ring + fill + inner counter-ring. Every interactive control uses the same composition; never single-layer rings.
- **Slot** — A named region inside a component anatomy (`container`, `label`, `leadingIcon`, …). Tokens bind to slots, not to components as a whole.
- **`$rem`, `$multiplier`, `$responsive.web`** — Chorus extensions to the DTCG token format. See [Token architecture](#token-architecture).
- **Maturity stage** — One of *experimental / stable / deprecated / removed*; marked beside a token's first introduction. See [Maturity stages](#maturity-stages).

### Agent guide

Chorus is designed to be ingested as a single canonical context by AI design agents. Pass this document whole alongside `schema/tokens/` JSON. Three sections follow: quick lookup table, example prompts, iteration rules.

#### Quick token reference

Mapping from common UI needs to system tokens.

| Need                  | Token                                            | Light value         |
|-----------------------|--------------------------------------------------|---------------------|
| Page background       | `color.surface`                                  | `#ffffff`           |
| Primary text          | `color.onSurface`                                | `#121212`           |
| Secondary text        | `color.onSurfaceVariant`                         | `#3d3d3d`           |
| Card surface          | `color.surfaceContainer`                         | `#ffffff`           |
| Card border           | `color.outlineVariant`                           | `#e6e6e6`           |
| Primary CTA fill      | `color.primary`                                  | `#2563eb`           |
| Primary CTA text      | `color.onPrimary`                                | `#fafafa`           |
| Link                  | `color.primary`                                  | `#2563eb`           |
| Error                 | `color.error`                                    | `#b42222`           |
| Success               | `color.success`                                  | `#008838`           |
| Focus ring (outer)    | `color.focus`                                    | `#000000`           |
| Focus ring (inner)    | `color.focusInset`                               | `#ffffff`           |
| Card padding          | `layout.container.md`                            | 16 → 24px           |
| Page gutter           | `layout.page.md`                                 | 16 → 32px           |
| Section rhythm        | `layout.stack.lg`                                | 24 → 32px           |
| Control radius        | `radius.md`                                      | 8px                 |
| Surface radius        | `radius.xl`                                      | 16px                |
| Card shadow           | `elevation.raised`                               | two-layer ambient + spread |

#### Example component prompts

Reference prompts resolving through the system tier — copy and adapt.

> "Build a primary button: `color.primary` background, `color.onPrimary` text, `radius.md` corners, `layout.container.sm` vertical padding and `layout.container.md` horizontal padding, `typo.label.md` for the label. On `:hover`, composite an 8% `onPrimary` overlay; on `:focus-visible`, apply the three-layer focus ring (see [Focus ring composition](#focus-ring-composition))."

> "Design a content card: `color.surfaceContainer` background, `radius.xl` corners, `elevation.raised` shadow, `layout.container.md` padding. Title in `typo.heading.md` `color.onSurface`; body in `typo.body.md` `color.onSurfaceVariant`. Stack title and body with `layout.stack.sm`."

> "Create a form field: `color.surfaceVariant` background, `radius.md` corners, `layout.container.sm` padding. Label above in `typo.label.sm` `color.onSurfaceVariant`. Border `1px solid color.outlineVariant`; on focus, full three-layer focus composition. Error state: border swaps to `color.error`, helper text uses `color.error` at `typo.caption.md`."

> "Build a notification banner using the primaryContainer pair: `color.primaryContainer` background, `color.onPrimaryContainer` text and icons, `radius.lg` corners, `layout.container.md` padding. Inline with `layout.inline.md` between icon and text. No shadow — containers stay flat."

#### Iteration rules

Guardrails for iterating on agent-generated output.

1. Reach for `color.*` system tokens, never raw `palette.*` — palette steps are documentation-only.
2. Pair every accent fill with its `on*` foreground; never read contrast manually.
3. Use `layout.*` for layout-participating spacing; reserve raw `space.*` for fixed-footprint controls.
4. Default to `radius.md` for controls and `radius.xl` for surfaces — the size gap is the point.
5. State feedback is *foreground-over-base at state opacity*, never a hardcoded hover color.
6. The web step-up is automatic; do not branch on viewport for `layout.*`, `display.*`, or `heading.*`.
7. Pretendard is the only family — do not split fonts between Latin and Hangul.
