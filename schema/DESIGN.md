# Chorus design rationale

> Single source of truth for every design rule in Chorus.

This document captures the reasoning behind the system, the meaning of each token, and the rules that compose them. Token JSON files in [`schema/tokens`](schema/tokens) hold values only; their meaning, intent, and usage live here. For an orientation to the repo, see [`README.md`](../README.md).

---

## Introduction

### Chorus

The design system behind a product built on the belief that your voice matters — individual voices arranged into harmony through tokens every surface sings from. This page gathers what Chorus is, the visual atmosphere it produces, and the three-tier token model that makes it editable.

#### About Chorus

**Chorus** is the design system behind our product — a platform built on the belief that *your voice matters*.

A chorus is what happens when individual voices, each with its own timbre, come together without losing what makes them distinct. No single voice is drowned out; the whole exists only because every part is heard. That is the shape of the community we build for: workplace professionals, students, and anyone who speaks more freely when their name is not the thing being judged.

#### What this means for the system

Four convictions follow from the *your voice matters* premise — the principles every concrete decision in this document derives from.

- **Every voice matters, so every token matters.** Color, type, space, radius, and elevation are the smallest units of our product's voice. They are defined once, in the open, and every surface sings from the same score.
- **Harmony over uniformity.** Chorus does not flatten difference — it arranges it. Components are built to stay recognizably themselves across contexts (light and dark, professional and student, mobile and desktop) while still belonging to one system.
- **Clarity is how we amplify.** An anonymous voice only carries when the interface around it is legible, calm, and trustworthy. Chorus exists to remove friction between what a person wants to say and how clearly it reaches the people who should hear it.
- **The system is the score, not the performance.** Product surfaces are the performance; Chorus is the notation that makes the performance repeatable, reviewable, and shared. When the score changes, the whole chorus changes together.

#### Scope

Chorus covers the foundations — tokens, typography, spacing, color, elevation, and the primitive components built on top of them — and the documentation that keeps them coherent as the product and the community grow.

#### Visual theme & Atmosphere

Chorus is the design language of a community product where text volume is high, mixed-script (Hangul + Latin) is the norm, and the brand voice is *clear, calm, trustworthy*. The system reads the way a well-tuned chorus sounds: distinct voices arranged into one coherent whole, no single voice loud enough to drown the others. Visually, that translates to a near-monochromatic neutral foundation, a single restrained brand accent (Blue 500 `#2563eb`), and shape and tone choices that prefer composure over expressiveness.

The single typeface is **Pretendard**, chosen for its mixed-script (Hangul + Latin) balance — see [Font family](#font-family).

#### Token architecture

Chorus follows a **three-tier** model — *reference → system → component* — but with deliberate discipline about when each tier earns a token.

- **Reference tier** ([`reference.json`](schema/tokens/reference.json), namespaced under `ref.*`) — raw palettes and scales with no opinion about usage. `ref.palette.neutral.500`, `ref.fontSize.200`, `ref.space.400`. These are the material.
- **System tier** ([`system.json`](schema/tokens/system.json), namespaced under `sys.*`) — semantic roles that consume the reference tier via `{ref.palette.*}` / `{ref.space.*}` references. `sys.color.primary`, `sys.color.surfaceContainerHigh`, `sys.layout.page.md`, `sys.elevation.floating`. These are the vocabulary product surfaces speak in.
- **Component tier** ([`component.json`](schema/tokens/component.json), namespaced under `comp.*`) — per-component tokens that bind system roles to a component's own contract. The shape is illustrative-only today (a hypothetical `comp.button.primary.container` / `comp.button.primary.label` pair would belong here) and the file ships empty by design — see [Current state of `comp.*`](#current-state-of-comp) below. Reserved for components reused widely enough that naming the composition earns its keep.

The `ref.` / `sys.` / `comp.` namespacing keeps the tier prefix explicit. CSS variables emit with the full prefix preserved (`var(--sys-color-primary)`, `var(--ref-space-200)`) so tier identity is explicit at the call site — a `var(--ref-…)` in a component is a code-review signal that the component reached past the system tier.

**Default to two tiers.** Most surfaces should consume the system tier directly. The component tier is an *opt-in* third layer, not a routine wrapping step — its purpose is to keep the token surface small. A new component token must clear two bars: (1) the component is reused broadly across the product, and (2) the same composition of system roles recurs in enough places that giving it a name reduces drift more than the indirection costs. One-off compositions stay inline at the system tier; a component token created "just in case" is the most likely kind to rot, because it isolates the composition from the surfaces that would otherwise keep it honest.

Components never reference the palette directly. Whether a component speaks system tokens inline or resolves through its own component-tier tokens, the chain always lands on system → reference. This is the single rule that makes rebrands cheap: swap the reference tier, the system tier keeps its shape, and every component follows.

**Current state of `comp.*`.** [`component.json`](schema/tokens/component.json) ships with the namespace declared but no entries — every component in the product currently composes system tokens inline. The file holds the convention so the tier is ready when a composition earns naming; it is intentionally empty, not unfinished. Adding the first entry should be a deliberate event reviewed against the two-bar test above.

In CSS the tokens surface as custom properties under the pattern `--<tier>-<group>-<name>`: `var(--sys-color-primary)`, `var(--ref-space-200)`, `var(--sys-layout-page-md)`, `var(--sys-radius-xl)`. Reference palette variables (`var(--ref-palette-neutral-500)`) are emitted but reserved for the Color Palette documentation section — components must not consume them.

**No raw numeric or color literals in component CSS.** Every length, color, radius, border width, opacity, and type-style value in a component stylesheet must resolve through a `var(--sys-*)` (or, when a system role has not yet been named, a `var(--ref-*)`) reference — never a bare `16px`, `#ffffff`, `1.4`, or `8px solid …`. The few legitimate exceptions are: (1) **intrinsic geometry** that names a component anatomy slot, not a layout decision — e.g. a Thumbnail rung `48px`, an icon size `16px`, a fixed `width` that *is* the slot contract; (2) **computed compositions** that combine tokens in `calc()` — e.g. `calc(48px + var(--sys-layout-inline-lg))` to anchor a divider to the trailing edge of a 48-rung avatar; (3) **structural zero / one-hundred values** (`0`, `100%`, `auto`) that have no token equivalent. Anything else — paddings, gaps, margins, font sizes, line heights, font weights, border widths, focus-ring offsets, underline thickness, scroll-snap basis — is a token call. **Do not write `var(--sys-…, 16px)` fallback values either**: the build emits the variable globally, and the fallback hides regressions when a token name changes by silently keeping the old literal alive. If a target value (e.g. 2px, 12px, 24px) doesn't map to an existing system token, that is a system-tier gap — name the new role here in DESIGN.md and add the JSON entry rather than inlining the literal. The rule keeps the rebrand chain intact: every component → `sys.*` → `ref.*`, no escape hatches.

**JSON files contain values only.** All meaning, usage, and rules live in this document. A token without a description in DESIGN.md is a token without a role; if you find yourself reaching for one, document it here first, then add the JSON value.

**JSON shape.** Token files follow the [Design Tokens Community Group (DTCG)](https://tr.designtokens.org) draft: each leaf carries `$value`, optional `$type`, and Chorus-specific extensions (`$rem`, `$multiplier`, `$responsive.web`) namespaced under `$` so DTCG-aware tooling (Style Dictionary, Tokens Studio) reads the values without choking on the extras. Aliases use the DTCG `{ref.palette.blue.500}` reference syntax. Conformance is partial-by-intent: Chorus follows the schema where it helps interop and adds what it needs where the spec is silent. A new extension key earns its keep only if at least one consumer reads it; otherwise the value lives in DESIGN.md prose.

---

## Foundations

### Color

Six solid hues plus two opacity overlays, organized into role clusters that always pair a background with its foreground — components consume system roles, never the raw palette.

#### Reference palettes

Six solid palettes share a single 0–1000 lightness curve, tuned so the same numeric step lands at a perceptually similar brightness across hues. This consistency is what lets the system meet WCAG AA contrast by construction: pairing a 50–400 background with a 700–900 foreground (or vice versa) clears the 4.5:1 threshold for body text across every palette, and the same pairing rules transfer cleanly between hues.

##### Lightness ramp

Each palette is a single one-dimensional ramp keyed by lightness (light → dark, 0 → 1000), partitioned into four functional bands plus two endpoint anchors. The band a step falls in determines the kind of role it can serve: **endpoints (0, 1000)** anchor pure ends, **lower bands (50–400)** carry surfaces, **brand step (500)** anchors hue identity, **upper bands (600–900)** carry foregrounds. Numeric step is identical across hues, so a role defined on one palette transfers to another by swapping the hue family.

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
| `green`    | `#008838`       | Reserved (positive / success — not yet bound to a system role) |
| `red`      | `#d92626`       | Brand / Error / destructive                       |
| `yellow`   | `#a16207`       | Reserved (warning / categorical)                  |
| `purple`   | `#9333ea`       | Tertiary / categorical accent                     |

**Only system tokens may reference these palette steps.** Components never consume `palette.*` directly. Reach for a palette step only when defining a new system role — and document that role here in DESIGN.md before adding the JSON entry.

#### Overlay palettes

`palette.black` and `palette.white` share the 0–1000 step axis with the solid palettes, but the axis is **opacity**, not lightness. Each step's alpha value is drawn from the [base-unit ladder](#base-unit-ladder) read as percent, so the alphas snap to the same numeric set the spacing scale uses. Compositing over the underlying surface lets the surface tint bleed through, which keeps overlays consistent across themed backgrounds.

##### Opacity ramp

A single one-dimensional opacity ramp (`0` → `1000`) where the step name is the lightness-style 0–1000 index (matching the solid palettes) and the alpha value at each step is a rung from the [base-unit ladder](#base-unit-ladder) read as percent (`0 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 64 · 80 · 100%`). The fully-opaque `100%` is appended as a color-specific endpoint — it is not part of the spacing/typography ladder because spacing has no equivalent of "fully opaque." Choosing a step picks an *intensity intent* (veil / scrim / endpoint), not a free numeric value. `palette.white.*` mirrors `palette.black.*` step-for-step so dark-mode equivalents resolve identically.

The ramp partitions into three functional bands:

| Band      | Steps        | Alpha values            | Used by                                                                  |
|-----------|--------------|-------------------------|--------------------------------------------------------------------------|
| Endpoint  | `0`          | 0% (transparent)        | Reset / fully transparent overlays                                       |
| Veil      | `50–600`     | 4 / 6 / 8 / 12 / 16 / 20 / 24% | `elevation.*` shadow alphas, `state.*` overlay opacities          |
| Scrim     | `700–900`    | 40 / 64 / 80%           | `color.scrim`, heavy modal/drawer dim                                    |
| Endpoint  | `1000`       | 100% (fully opaque)     | `color.focus` outer ring, `color.elevation` ink                          |

**Contrast guidance**: veil-band overlays are low-emphasis — foreground text (`color.onSurface`, near-black) stays readable on top. Scrim-band and `1000` are strong overlays — use inverse text (`color.inverseOnSurface`, near-white) on top.

`palette.white.*` mirrors `palette.black.*` for dark-mode use: composite over dark backgrounds so the surface tint shows through.

#### Accent roles

Five role families covering brand emphasis (`primary`), neutral support (`secondary`), categorical accent (`tertiary`), brand-identity attention (`brand`), and destructive signal (`error`). The role decides *what the color means*; the structure below decides *how to compose it*.

##### Four-token quartet

Each accent role (`primary` / `secondary` / `tertiary` / `brand` / `error`) ships as a fixed **four-token quartet**: a high-emphasis pair and a low-emphasis pair, with foreground always paired to its background. The quartet is the unit of meaning — never use a fill without its `on*` foreground, and never read contrast manually. Across the four accents, the *role of the accent* differs (brand / supporting / confirmation / destructive) but the *internal four-slot structure* is identical, so the same composition rule (background + paired foreground) applies everywhere.

The four slots:

- **Main pair** — `X` / `onX` — high-attention fill for CTAs, emphasis badges, status chips. Use sparingly per view.
- **Container pair** — `XContainer` / `onXContainer` — low-chroma tinted surface in the same family for callouts, notification tiles, subtle banners. Lower visual weight than the main pair, so safe to use on larger surface areas.

**The Container pair is the tint.** When a surface needs to read as a soft accent — info callouts, selected list rows, success banners, error tiles, "subtle" highlight blocks — reach for `XContainer` + `onXContainer`, **never** a `color-mix(<accent> N%, <surface>)` overlay. `XContainer` already resolves to the soft tone (`blue.50` light / `blue.900` dark for primary, `purple.100`/`purple.900` for tertiary, `red.100`/`red.900` for error), tuned to clear AA against its paired `on*` foreground; an alpha mix bypasses that contract, drifts under theme switches, and lands on the neutral `surface*` family instead of the accent family — so the pair reads as *near-black on tinted blue* in light mode and muddies into the deep container in dark mode. If the canonical pair gives a poor visual, retune the token value in [`system.json`](schema/tokens/system.json) and update the description in this section — never break the pair at the call site.

**Allowed `color-mix` exceptions** — two and only two:

1. **State-overlay formula** — `color-mix(<onContainer> 8%, <container>)` for hover/focus/pressed layered over a Container surface, per [State overlays](#state-overlays). The element-foreground-over-base rule defines this composition; it is not an "ad-hoc tint."
2. **Decorative gradient atmospherics** — a `<accent>`-toned stop fading to `transparent` inside a `radial-gradient` / `linear-gradient`, layered over a flat `surface*` base where the *underlying base* is what governs text contrast. The gradient is decoration, not a content surface — no foreground sits inside the tinted region long enough to need its own `on*` pair. The tell-tale: the gradient stops with `transparent`, and the text on the same element resolves contrast against the base color *under* the gradient (`onSurface` on `surfaceContainerLowest`, etc.).

###### Primary

| Token                      | Role                                                                          |
|----------------------------|-------------------------------------------------------------------------------|
| `color.primary`            | The brand color and highest-attention accent. Use sparingly for one dominant action per view (primary CTA, selected tab underline, active toggle fill, progress indicator). Two primary buttons in a view collapse the hierarchy. Resolves to `ref.palette.blue.500` in both modes — the brand hue is saturated enough to clear AA against `surface` in both light (white) and dark (`neutral.900`), so the CTA reads as the same blue across themes without a tonal nudge. |
| `color.onPrimary`          | Foreground placed on top of `primary`. Label text, icons, and spinners inside primary-filled surfaces. Always pair with `primary`; never against a neutral surface. Resolves to `ref.palette.neutral.50`. |
| `color.primaryContainer`   | Low-chroma tinted surface in the primary family. Selected-state list backgrounds, informational callouts, highlighted message bubbles, brand-flavored section banners. Safe on larger areas where `primary` would overwhelm. Resolves to `ref.palette.blue.50` (light) / `ref.palette.blue.900` (dark). The light value sits one step brighter than the other accent containers (`tertiary` / `error` use `*.100`) because primary is the most-used quartet in the product — a `blue.100` callout next to multiple active list rows on the same page felt heavier than the role asks for. The lighter step keeps the brand identity visible against `surface` while reading as a quiet, decorative tint rather than a filled banner. |
| `color.onPrimaryContainer` | Foreground for content placed on `primaryContainer`. Text, icons, and links inside primary-tinted surfaces. Resolves to `ref.palette.blue.600` (light) / `ref.palette.blue.400` (dark) — both stay in the saturated primary family so the foreground reads as *blue* on both tinted backgrounds, instead of collapsing to near-black on the light tint or muddying into the deep container on the dark tint. The dark step lifts one band higher than light's mirror would suggest because identical luminance gaps read darker on dark surfaces. The pair clears AA at ~9:1 against the lifted light container. |

###### Secondary

| Token                        | Role                                                                          |
|------------------------------|-------------------------------------------------------------------------------|
| `color.secondary`            | A neutral accent for supporting actions that should feel present but not brand-loud. Secondary CTAs paired beside a primary button, quiet filled controls, selection highlights where a colored brand fill would be distracting. Unlike the chromatic accents, this family inverts between light and dark modes. Resolves to `ref.palette.neutral.700` (light) / `ref.palette.neutral.300` (dark). |
| `color.onSecondary`          | Foreground placed on top of `secondary`. Label text and icons inside secondary-filled surfaces. Resolves to `ref.palette.neutral.50` (light) / `ref.palette.neutral.900` (dark). |
| `color.secondaryContainer`   | Low-contrast neutral surface in the secondary family. Subtle backgrounds that need to separate from the page without implying brand meaning: tonal chip fills, quiet badges, muted selection backgrounds, segmented-control tracks, secondary button fills. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.600` (dark). The dark step sits two bands lighter than a strict mirror would land — at `neutral.800` the secondary fill would collide with every `surfaceContainer*` and `surfaceVariant` (all `neutral.800` in dark); at `neutral.700` it would still collide with `surfaceContainerHighest` (the topmost surface band). `neutral.600` lifts the secondary accent one step clear of the entire surface ladder so a secondary fill placed on any host — including the most lifted overlay surfaces — stays distinct, while remaining inside the muted band. |
| `color.onSecondaryContainer` | Foreground for content placed on `secondaryContainer`. Resolves to `ref.palette.neutral.900` (light) / `ref.palette.neutral.100` (dark). |

###### Tertiary

| Token                       | Role                                                                          |
|-----------------------------|-------------------------------------------------------------------------------|
| `color.tertiary`            | A third accent distinct from the brand. Categorical accent moments and supplementary highlights — featured-tile fills, premium-tier badges, decorative call-outs that need a hue *other than* blue without taking on brand or destructive meaning. Never stands in for the main CTA — treat as a complement to `primary`, not a replacement. Resolves to `ref.palette.purple.500` (light) / `ref.palette.purple.600` (dark). |
| `color.onTertiary`          | Foreground placed on top of `tertiary`. Label text and icons inside tertiary-filled surfaces. Resolves to `ref.palette.neutral.50`. |
| `color.tertiaryContainer`   | Low-chroma tinted surface in the tertiary family. Soft categorical surfaces: featured banners, premium callouts, decorative tiles, sections that want a quiet purple identity without leaning on brand. Resolves to `ref.palette.purple.50` (light) / `ref.palette.purple.900` (dark). |
| `color.onTertiaryContainer` | Foreground for content placed on `tertiaryContainer`. Resolves to `ref.palette.purple.600` (light) / `ref.palette.purple.400` (dark) — both stay in the saturated purple family so the foreground reads as *purple on tinted purple*, not as *near-black on tinted purple*. |

###### Brand

| Token                    | Role                                                                          |
|--------------------------|-------------------------------------------------------------------------------|
| `color.brand`            | The product's signature red — a high-attention accent reserved for notification counts, unread badges, eyebrow flags, and brand-identity moments (logomark fills, brand-tagged callouts). One tonal step **brighter** than `error` in both modes (`red.500` brand vs. `red.600` / `red.700` error), so the two reds stay visually distinct on the same surface: brand reads as energetic identity, error reads as a deeper destructive signal. Resolves to `ref.palette.red.500` in **both** light and dark modes — brand identity stays stable across themes, and the 500 step is the brightest red the palette ships that still clears AA against `onBrand` (`neutral.50`) for white-on-brand labels. |
| `color.onBrand`          | Foreground placed on top of `brand`. Label text and icons inside brand-filled surfaces (notification counts, brand badges). Resolves to `ref.palette.neutral.50`. White-on-`red.500` lands at ~4.7:1 — clears AA for normal text in both modes. |
| `color.brandContainer`   | Low-chroma tinted surface in the brand family. Soft brand callouts, "what's new" banners, promotional tiles, marketing surfaces where the energy of `brand` would overwhelm. Resolves to `ref.palette.red.50` (light) / `ref.palette.red.900` (dark). Light is one step lighter than `errorContainer` (`red.50` vs. `red.100`) so the brand callout reads as a quiet identity touch rather than a warning. |
| `color.onBrandContainer` | Foreground for content placed on `brandContainer`. Resolves to `ref.palette.red.600` (light) / `ref.palette.red.400` (dark) — both stay in the saturated red family so the foreground reads as *red on tinted red*, not as *near-black on tinted red*. The dark step lifts one band higher than light's mirror would suggest because identical luminance gaps read darker on dark surfaces. |

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

Organized along an explicit hierarchy:

1. **Base canvas** (`surface` / `onSurface`) — the foundation everything else sits on. Foreground always pairs with the canvas.
2. **Canvas modifiers** (`surfaceVariant` / `onSurfaceVariant` / `surfaceDim` / `surfaceBright`) — alternate base tones for quiet separation, recess, or spotlight. `surfaceVariant` carries its own paired foreground for two-tier text hierarchy; `Dim` / `Bright` keep `onSurface` as foreground.
3. **Container ladder** (`surfaceContainerLowest` → `Low` → `default` → `High` → `Highest`) — five ordered tiers indicating *spatial role* (sunken → recessed → default → raised → topmost). In light mode the tones collapse onto `#ffffff` by design; lift comes from `elevation.*` shadows. The names carry semantic weight even when the tone is identical.

`onSurface` is the canonical foreground for the entire stack — every container tier reads against it.

###### Base & Variants

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
| `color.surfaceContainerHigh`    | Elevation level 3 — the "raised" tone. Two families share this fill: (a) **scrim-anchored interruptions** — modals and dialogs, search view, bottom sheets, expanded navigation drawers; and (b) **in-page raised chrome** — bottom app bar, FAB surface variant, filter / toolbar / toggle button bodies (and the chip-chrome tabs that inherit them), selected cards, nested emphasized sections, neutral placeholder fills. Tonally identical to `surfaceContainer` in both modes — visible lift comes from `elevation.overlay` (for scrim-anchored surfaces) or `elevation.floating` (for in-page raised containers), not an ever-brightening fill. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.800` (dark). |
| `color.surfaceContainerHighest` | Elevation level 4 — the topmost container tone, reserved for the *most* lifted surfaces that float over everything else without their own scrim. Menus, tooltips, popovers, filled text-field bodies, search bars. In light mode matches `surfaceContainer`; in dark mode steps up one tier so the topmost layer reads against the stack beneath it, reinforced by `elevation.overlay`. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.700` (dark). |

**Tonal elevation is capped, not stacked.** The Chorus brand goal is *calm and trustworthy*; ever-brightening surfaces feel showy and break the calm. Lift is expressed by `elevation.*` shadows; the surface names carry semantic weight ("this is a modal") even when the tone is identical to a card.

#### Outline · Inverse · Focus · Scrim

The remaining color vocabulary — borders, inverted overlays, focus indicators, and backdrop dimming. Each cluster answers a question the accent and surface groups don't, so it earns its own naming rather than sharing a scale.

##### Five role-clusters

Small clusters that don't fit the accent quartet or the surface stack. Each is paired or solo by intent, not by a shared scale:

- **Outline cluster** (`outline` / `outlineVariant`) — high vs. low emphasis border pair.
- **Inverse cluster** (`inverseSurface` / `inverseOnSurface`) — mini-stack for elements that must contrast with the page (snackbars, tooltips). `inverseSurface` is the canvas, `inverseOnSurface` is the foreground. Action accents inside inverted components fall back to the regular `primary` family — the inverse canvas is contrast-tuned to clear AA against `primary` without a dedicated step.
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

Two different inversion rules apply across the system:

- **Chromatic accents (`primary`, `tertiary`, `brand`, `error`) do NOT invert their on-pair between modes.** `tertiary` nudges one tonal step in dark (`purple.500` → `purple.600`) and `error` nudges one tonal step (`red.600` → `red.700`) so the fill still reads against a dark page; `primary` stays at `blue.500` and `brand` stays at `red.500` in both modes because both hues clear AA against both `surface` tones and against `onPrimary` / `onBrand` (`neutral.50`) without a nudge — a deeper step would dim the accent without buying contrast. The `on*` foreground stays at `neutral.50` across all four. This keeps brand identity stable across modes.
- **Neutral roles (`secondary`, `surface*`, `onSurface*`, `outline*`) invert as usual.** Light surfaces become dark, dark text becomes light.
- **Container pairs (`primaryContainer` / `onPrimaryContainer`, etc.) flip the *container*, not the foreground family**: in light mode the container is shallow (e.g. `blue.50` for primary, `purple.100` / `red.100` for tertiary / error) with a saturated mid-band foreground (`blue.600`); in dark mode the container goes deep (`blue.900`) with a brighter mid-band foreground (`blue.400`). Both modes keep the foreground in the saturated primary family so the pair reads as *blue on tinted blue*, not as *near-black on tinted blue* — a flat-black foreground would lose the brand identity the container exists to express. Primary's light container sits one step brighter than the other quartets because it appears the most often (active nav rows, brand callouts) — a heavier tint at that frequency competes with content; the lift trades visual weight for breathing room without giving up the family identity. The dark foreground lifts one band higher than a strict mirror would suggest (`blue.400` instead of `blue.500`) because equal luminance gaps appear shallower on dark surfaces.
- **Focus ring inverts** so the outer ring is always inverse-toned to the page, guaranteeing legibility.

#### Data visualization palette

Charts, graphs, and category-coded surfaces draw from a small palette derived from the same six reference hues — never invented per-chart. The palette is organized into three intent groups (categorical / sequential / diverging), each picking specific reference steps so the same chart palette transfers across themes.

##### Three palette types

| Palette        | Source                                                | Ordered? | Use                                                                       |
|----------------|-------------------------------------------------------|----------|---------------------------------------------------------------------------|
| Categorical | `blue.500` · `green.500` · `yellow.500` · `purple.500` · `red.500` · `neutral.700` | No       | Discrete categories with no inherent order — series in a stacked bar, slices of a pie, group labels. |
| Sequential  | One palette ramp, steps `200 → 800` (light → dark)   | Yes      | A single quantitative variable along a magnitude axis — heatmaps, choropleths, ranked bars. Default to `blue.*` (brand-aligned); use `neutral.*` when the data is content-secondary. |
| Diverging   | `red.700 · red.400 · neutral.200 · blue.400 · blue.700` | Yes (centered) | A variable with a meaningful midpoint — gain/loss, sentiment, deviation from baseline. Center step `neutral.200` is the zero anchor. |

##### Rules

- **Six maximum for categorical.** Past six categories, color stops being a useful encoding — group the long tail into "Other" or add a secondary visual channel (texture, position).
- **Brand color comes first only when it carries meaning.** A categorical chart that uses `blue.500` for the first series implies that series is the "primary" one. If the categories are equal, rotate the order or pick a non-brand starting hue.
- **Reuse `color.error` for negative coding.** Don't introduce chart-specific red; the system role already encodes the meaning, and stays palette-consistent across non-chart surfaces (KPI tiles, status pills). Positive / success coding currently has no dedicated system role — reach for `ref.palette.green.500` directly inside a chart palette (the only exception to the "no `ref.*` in components" rule, scoped to dataviz) until a `color.success` role lands.
- **Dark mode shifts the steps, not the hues.** Light mode chart palettes use the lighter end of each ramp (`*.500` for categorical); dark mode uses the same hue families but shifts to the `*.400`/`*.300` steps so contrast against the dark canvas holds.
- **Pair with a non-color channel** for accessibility — pattern fills, direct labels, or shape differentiation. Around 4% of users cannot distinguish red from green; categorical charts that rely on hue alone fail them silently.

### Typography

One typeface (Pretendard) handles both Latin and Hangul, materialized as fifteen roles across five purpose categories × three sizes — weight and line-height carry meaning by purpose, not by size.

#### Font family

The system typeface is **Pretendard**.

**Why Pretendard** — Chorus's product is a community service where text volume is high and Hangul (국문) and Latin (영문) routinely appear side by side in the same line. Most sans-serif families are tuned for one script and visually break when the two scripts mix: Latin glyphs read too small next to Hangul, or Hangul feels heavier than the Latin around it. Pretendard is explicitly designed to resolve that mismatch — its Hangul and Latin share compatible x-height, weight, and optical rhythm, so mixed-script lines read as one continuous texture rather than two pasted-together systems.

**How to apply** — use one family for every surface (display, heading, body, label, caption). Do not substitute a different family for Latin-only or Korean-only regions; the balance only holds when one family handles both scripts. The stack falls back to platform system fonts only when Pretendard fails to load:

```
Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif
```

#### Categories × Sizes

Five purpose categories × three size levels = 15 type roles, each composed of four atomic properties.

- **Category axis (purpose)** — `display` (hero) → `heading` (structural title) → `body` (reading) → `label` (control) → `caption` (metadata). Position on this axis determines weight and line-height by purpose, not by size.
- **Size axis (emphasis within a category)** — `lg` / `md` / `sm`. The middle step `md` is the default within most categories.
- **Composition** — each grid cell composes four reference-tier values: `size` / `weight` / `line` / `tracking`. The four together define the role; never mix-and-match across cells (e.g. body's weight on a heading's size).
- **Responsive scaling grows with hierarchy, above the `md` baseline only.** `display.lg` jumps two scale steps on web (≥800px, the mobile→tablet line); `heading.lg` jumps one. `display.md` / `display.sm` / `heading.md` / `heading.sm` stay constant — they're already small enough to read on any viewport, and the web step-up would inflate them past the role they describe. Body / label / caption are unconditionally flat. The shared rule across every token group: **`md` is the baseline, only sizes above it grow on web.**

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
| `typo.label.sm`    | 12 px               | 600 Semibold | 1.5 normal | 0.02em wide   | Compact controls — dense toolbars, small badges, inline tag labels, tertiary actions. |
| `typo.caption.lg`  | 14 px               | 400 Regular  | 1.5 normal | 0em normal    | Form helper text, footnote-style explanations needing easy legibility. |
| `typo.caption.md`  | 12 px               | 400 Regular  | 1.5 normal | 0.02em wide   | Default caption. Timestamps, byline text, card metadata, image captions. |
| `typo.caption.sm`  | 10 px               | 400 Regular  | 1.5 normal | 0.02em wide   | Smallest caption — legal fine print, dense metadata columns, data-dense tables. Use sparingly. |

#### Tracking & Line-height principles

Three rules govern how weight, tracking, and line-height combine across the fifteen `typo.*` roles — so each property carries consistent meaning regardless of which cell of the grid it lands in.

- **Bold display, semibold heading, semibold label, regular body, regular caption.** Weight is what differentiates roles at the same size — `body.md` (400) and `label.lg` (600) share 16px but read differently because of weight. Labels share the heading's 600 because controls borrow heading-style affordance to read as actionable rather than as prose. Captions stay regular so they read as *information about content* rather than as controls.
- **Tracking only diverges at the extremes.** Display compresses (`-0.02em`) so oversized glyphs settle as a block; small UI text and uppercase widens (`0.02em`) so dense labels stay readable. Body, label-md, and caption-lg use the typeface's intended spacing (`0em`).
- **Line-height splits by purpose, not size.** Display and heading use `tight` (1.25) to keep large type compact; body / label / caption use `normal` (1.5) for reading comfort.

#### Letter-spacing scale

A ramp from compressed to widened, em-relative so the value scales with font-size. The ramp parallels `lineHeight` but inverts its direction: large display type compresses while small UI text widens. `normal` is the anchor (the typeface's intended spacing); the four extremes are intentional optical corrections, not stylistic flourishes.

Mapping into `typo.*`: display → `tight`, heading → `snug`, body / reading → `normal`, small UI labels → `wide`, uppercase overlines → `wider`.

| Token                  | Value     | Role                                                                                |
|------------------------|-----------|-------------------------------------------------------------------------------------|
| `letterSpacing.tight`    | `-0.02em` | Compressed tracking for oversized display type — large glyphs settle closer so the block reads as a unit. |
| `letterSpacing.snug`     | `-0.01em` | Subtly tightened for headings and mid-large type — sharpens silhouette without marketing compression. |
| `letterSpacing.normal`   | `0em`     | Default. The typeface's intended spacing — body copy, reading text, standard UI controls. |
| `letterSpacing.wide`     | `0.02em`  | Slight widening for small UI text (≈12px and below) — measurably improves glance-readability of dense labels. |
| `letterSpacing.wider`    | `0.08em`  | Pronounced tracking for uppercase eyebrows, overlines, and small-caps category markers. Restores rhythm lost in all caps. |

#### Font-size scale

Built on the 8px base (`fontSize.100` = 8px = 1×, `fontSize.200` = 16px = 2×), with finer in-between rungs (10 / 14 / 18 / 56 / 72px) added only where legibility demands resolution the spacing scale cannot provide. Each rung carries `$rem` alongside `$value` so consumers can emit rem units — the accessibility-recommended unit for text, which respects the user's browser font-size preference.

The reference ladder is *material*, not vocabulary: system `typo.*` categories pick rungs from it; product code never references `fontSize.*` directly.

#### Casing

**Sentence case is the default** for every piece of UI text the system produces — navigation items, section titles, button and label text, page titles, dialog and toast bodies. Capitalize the first word and proper nouns; everything else stays lowercase. **Title Case Like This is not used anywhere in product surfaces.**

**Why** — Title case introduces a second, decorative convention on top of the typographic hierarchy already encoded by `typo.*` (size + weight + line-height). Once both signals are in play they compete: a Title-Cased label at `label.lg` reads as more important than a Sentence-cased one at `heading.sm`, even though the type token says the opposite. Sentence case lets the type tokens carry hierarchy alone, which keeps emphasis predictable across surfaces and across translations — title case has no analogue in Korean, the system's primary language, so any title-cased label becomes inconsistent the moment it is localized.

**UPPERCASE is reserved for in-content category markers** — eyebrows, overlines, table-section headers — the small all-caps role that already pairs with `letterSpacing.wider` (see [Letter-spacing scale](#letter-spacing-scale)). It does **not** apply to navigation structure (side-nav group labels, page-nav section headers); those follow sentence case, with hierarchy expressed by font size and weight on the existing `typo.label.*` ramp, not by a second decorative convention. Apply via CSS `text-transform: uppercase`, never by writing the text in caps in source — the underlying text stays sentence case so it reads correctly when the transform is removed (search results, screen readers, diff review, future localization).

**Exceptions** — proper nouns (Pretendard, Hangul), product names, code identifiers (`sys.color.primary`), and acronyms (CTA, AA, WCAG) keep their natural casing.

##### Segmented sentence case

When a heading or label joins multiple ideas with a separator (`&`, `/`, `·`, `×`, `:`, `→`), apply **sentence case to each segment independently** — capitalize the first word of every segment, lowercase the rest. The separator marks a fresh "sentence-start," so the second half of a compound heading is *not* a continuation of the first.

| Wrong (single sentence case) | Right (segmented sentence case) |
|------------------------------|---------------------------------|
| `Spacing & layout`           | `Spacing & Layout`              |
| `Visual theme & atmosphere`  | `Visual theme & Atmosphere`     |
| `State layer & focus`        | `State layer & Focus`           |
| `Do's & don'ts`              | `Do's & Don'ts`                 |
| `Tracking & line-height principles` | `Tracking & Line-height principles` |

Hyphenated compounds inside a segment (`line-height`, `top-level`) do **not** start a new segment — they follow sentence case as one word. Only the major separators above split a label into segments.

**Parentheses do not shield segments.** A separator that appears inside `(…)` still splits the label into segments, and the word *after* the separator is capitalized as a fresh segment-start — `Default bindings (assist / Filter chip)`, `IA mapping (heading → Docs surface)`. The opening parenthesis is not itself a separator: the word immediately after `(` stays lowercase when nothing but the parenthetical-opening preceded it, because it is still mid-segment. Only the major separators listed above promote a word to segment-initial.

**Why** — Capitalizing the segment-initial word anchors the parallelism the separator is there to express, without escalating to title case (no second word is capitalized) — and stays cleanly translatable since the convention drops cleanly in Korean.

### Iconography

A single icon family aligned to the typographic grid: sizes ride a four-step `icon.*` scale that mirrors the type ladder, and color always inherits from the same `on*` foreground rule as the surrounding text — so an icon never needs its own color token, and the size token only encodes "which type role do I sit beside."

#### Family & Style

Chorus uses **one icon family** for the entire product. Mixing libraries (Material Symbols + Heroicons + custom) drifts in stroke weight, terminal style, and corner radius the moment the catalogue grows past a few dozen glyphs; one family keeps the visual language coherent without per-icon review.

- **Style** — outlined glyphs at rest, filled glyphs to mark a *selected / active / committed* state on the same icon (selected tab, toggled favorite, active filter). Filled vs outlined is a **state signal**, not a stylistic choice — never swap to filled for emphasis.
- **Stroke weight** — match the weight of the adjacent type. A `label.md` (600 Semibold) row pairs with a 1.5–2px stroke; a `display.lg` hero pairs with a 2.5–3px stroke. The icon should read as *part of the line*, not pasted onto it.
- **Custom icons** — when a glyph the family doesn't provide is needed, draw it on the same grid, with the same stroke weight and corner radius as the family's nearest analogue. Add custom glyphs to a project-local set; do not edit the upstream family file.

#### Size grid

Two canonical sizes that align to the type ladder rather than introducing a new scale. Each size matches a category of `typo.*` so the icon's optical height equals the cap-height of the text beside it.

| Token            | Pixel size | Pairs with                                | Use                                                                  |
|------------------|------------|-------------------------------------------|----------------------------------------------------------------------|
| `icon.md`        | 16 px      | `typo.label.md`, `typo.body.md`, `typo.body.sm` | **Default**. Buttons, list items, menu items, form-field affixes, toolbars, chips, tabs, `medium` Icon Button, Feed engagement counters. |
| `icon.lg`        | 24 px      | `typo.label.lg`, `typo.body.lg`, `typo.heading.sm` | Primary CTAs, prominent toolbar actions, section headers, FAB, Navigation Bar slots, `large` Icon Button. |

The grid is **drawing-area, not bounding-box**. A 16px icon should occupy ~13px of optical weight inside a 16px frame — the breathing margin is what keeps icons aligned with descender-free text. Glyphs designed to a literal 16×16 fill always read too heavy beside the type.

#### Color & State

Icons consume the same `on*` foreground tokens as the text they sit with — never a dedicated icon color.

- **Solo icon (icon-only button)** — color is the parent control's foreground role (`color.onSurface` for a ghost button, `color.onPrimary` inside a primary fill).
- **Icon + label** — both use the same foreground; never paint the icon a different hue for emphasis. Hierarchy belongs to the label.
- **Inactive / disabled** — inherit from the surrounding `state.disabled` opacity; do not pre-darken the icon SVG.
- **Status icons** (success/error checks, alert glyphs) follow the accent role they signal: `color.error` for error glyphs, paired with `color.onError` when sitting on a filled error surface. Success glyphs currently have no dedicated system role — pending a `color.success` token, reach for the icon's surrounding label color (`color.onSurface` or `color.onSurfaceVariant`) and let the glyph shape carry the semantic.

#### Alignment & Layout participation

Icons participate in `layout.inline.*` like any other inline element — the gap between an icon and its label is `layout.inline.md` by default, `layout.inline.sm` inside compact controls. Don't compensate with `margin` overrides; the gap token is the contract.

For optical centering inside a container, prefer `display: inline-flex` + `align-items: center` over `vertical-align` hacks. Icons drawn off-grid will still betray their misalignment; fix the SVG, not the layout.

#### Source of truth

All product icons — across both component code (`packages/ui`) and documentation surfaces (`apps/docs`) — must come from **`@blind-chorus/ui/icons`**. This is not a recommendation; it is the only sanctioned source. The canonical catalog is rendered on the Iconography page in docs — browse there before drawing a new glyph.

Inline `<svg>` in component or page files is permitted in exactly two cases: (a) the brand mark itself — the Chorus logo, which is identity, not iconography, and (b) decorative illustrations bound to a single layout (a half-page hero, a guideline marker that exists nowhere else). Anything that could plausibly appear in two places must be in the library, full stop.

A glyph qualifies for the library when it satisfies all three: drawn on the 24×24 grid, uses `currentColor` for fill/stroke so it picks up the surrounding `on*` foreground, and renders without a hardcoded pixel size (callers pass `size`, defaulting to `icon.md`). These three rules are what make every icon size-, color-, and theme-correct by default — bypassing the library, even temporarily, forfeits all three guarantees and silently breaks dark-mode contrast or token-driven density changes.

The procedural details — folder layout, registration recipe, naming conventions — live next to the library code at [`packages/ui/src/icons/README.md`](../packages/ui/src/icons/README.md). DESIGN.md owns the *principle*; the implementation guide owns the *recipe*.

### Spacing & Layout

An 8px base materializes into a percentage-keyed reference scale, then composes into four orthogonal layout axes — `page` → `container` → `stack` → `inline` — each owning one spatial relationship and stepping up automatically on web. Once the axes are named, [Composition recipes](#composition-recipes) at the end of this chapter pin down *which step* of each axis to pick for the five compositional situations (section-section gap, intra-section rhythm, section padding, body text size, nested padding) every product surface runs into — so two designers laying out unrelated screens land on the same rhythm.

#### 8px base unit

Every spacing value in Chorus is a multiple — or sub-multiple — of **8px**. The base is what makes grid alignment automatic: any two surfaces composed from `space.*` land on the same rhythm without per-component adjustment, and a global density change (tighten / loosen the system) is a single-file edit at the reference tier.

**Why 8px** — 8 divides cleanly at every common display density (1×, 1.5×, 2×, 3×) without sub-pixel artifacts, gives enough resolution at small sizes (4px / 6px sub-steps) without a noisy scale, and matches the rhythm of the type system (16px body sits on 2× base; 24px line-height on 3× base). The choice is not arbitrary — it is the smallest unit that makes type, spacing, and layout commensurate.

##### Naming reflects the multiplier

`space.100` is the canonical unit (8px = 1×). The numeric suffix on every other step expresses its value as a percentage of that unit, so the multiplier is readable from the token name alone: `space.200` = 200% = 16px, `space.50` = 50% = 4px, `space.400` = 400% = 32px. Sub-base steps (`25` / `50` / `75`) exist for hairline rhythms the 8px grid can't resolve; everything from `100` upward is an integer multiple of the base.

##### Base-unit ladder

The discrete numeric values that fall out of the 8px base form a **single canonical ladder** every other scale in Chorus draws from:

```
0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 48 · 64 · 80
```

The ladder is unitless. Different scales bind it to different units:

- **Spacing** binds it to **pixels** — each rung is a `space.*` step (`0px` … `80px`); see [Reference scale](#reference-scale) for the per-step table.
- **Type rungs** bind it to **pixels** for the rungs that fall on the ladder (8 / 16 / 24 / 32 / 40 / 48 / 64 / 80px); finer typographic resolution adds in-between rungs only where legibility demands it ([Font-size scale](#font-size-scale)).
- **Opacity** binds it to **percent** — `palette.black.*` / `palette.white.*` alphas are drawn from the ladder read as percent (the 12 palette steps pick a subset of the rungs), plus a color-specific endpoint at `100%` for fully-opaque overlays (`color.focus`, `color.elevation`). 100 is not part of the spacing/typography ladder because spacing has no equivalent of "fully opaque." Reading the ladder as percent gives elevation shadows and state-layer overlays a snap-grid ([Opacity ramp](#opacity-ramp)).

Surfaces that need a value outside the ladder are a code-review signal — either the value belongs on the ladder (and the ladder needs a step), or the surface is reaching past the system tier.

#### Reference scale

The `space.*` rungs that materialize the spacing binding of the [base-unit ladder](#base-unit-ladder). The ladder partitions naturally into bands: **0** is reset, **25–75** are sub-base hairlines, **100–300** are control-and-content rhythm, **400–1000** are page-and-section framing. `space.100` (base) and `space.200` (default) are the two anchor steps the rest of the system aligns against.

Components consume the `layout.*` system tokens for layout participation. The `lg` and above steps in each axis carry a mobile→web step-up so layout-level rhythm breathes on wider viewports; **`md` and below stay constant** across breakpoints, so they're the natural pick for fixed-footprint controls (buttons, chips, table cells, toolbar items) whose padding/gap must not inflate on web. Reach for raw `space.*` only when a fixed-footprint control needs a value the `md`-and-below band of `layout.*` doesn't expose.

Each rung carries a `$multiplier` (× the 8px base), a `$rem` value, and a pixel `$value`. The rem convention is the **browser-default `1rem = 16px`** — same convention as `fontSize.*`, so the same px lands at the same rem across both scales (`space.200` = `fontSize.200` = 16px = `1rem`). The pixel column is what tokens compile to in CSS; consumers that want a value that respects the user's browser font-size preference can emit `$rem` instead.

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

Where the spacing scale graduates from raw values into layout vocabulary. The reference ladder is *material*; the four axes below are how product surfaces actually consume it.

##### Four orthogonal axes

Ordered by spatial scope from outermost to innermost (`page` → `container` → `stack` → `inline`). Each axis owns one specific spatial relationship and is applied by exactly one kind of element. Axes never substitute for each other: page gutter is not container padding, vertical sibling gap is not horizontal. Every axis carries an internal T-shirt scale (`xs` / `sm` / `md` / `lg` / `xl`, with `2xl` / `3xl` / `3xs` / `2xs` extensions where the role demands them). **Steps above `md` (i.e. `lg`, `xl`, `2xl`, `3xl`) carry a mobile→web step-up baked into the token; `md` and below stay constant** — the system-wide rule that the `md` step is the responsive baseline applies here verbatim.

The `sys.layout.*` group in [`system.json`](schema/tokens/system.json) defines four role-scoped semantic groups that consume the raw scale. At the web breakpoint (≥800px, the mobile→tablet line), only the steps above `md` shift one step up; `md` and smaller stay where they are:

| Axis                | Scope                       | Question it answers                                                | Owner                            |
|---------------------|-----------------------------|--------------------------------------------------------------------|----------------------------------|
| `layout.page.*`     | Viewport ↔ content          | How far should any content stay from the screen edge?              | Page shell (applied once per route) |
| `layout.container.*`| Surface ↔ its content       | How much breathing room does this card / sheet / dialog give?      | The individual surface           |
| `layout.stack.*`    | Sibling ↔ sibling (vertical)   | How much vertical gap between these two column siblings?        | The flex/grid parent             |
| `layout.inline.*`   | Sibling ↔ sibling (horizontal) | How much horizontal gap between these two row siblings?         | The flex/grid parent             |

`page` and `container` stack: a card inside a page is inset from the viewport by `page` padding *plus* its own `container` padding. Removing the card should not change the page gutter; removing the page gutter should not change the card's internal padding.

#### Viewport-edge gutter

The outermost gutter between the viewport edge and any page content. Applied **once** per route at the page shell / root layout. Full-bleed elements (hero images, sticky headers, edge-to-edge banners) opt out by negating this padding, not by changing the token.

##### Four-step T-shirt scale

`sm` / `md` / `lg` / `xl`, where `md` is the canonical default for ordinary app routes; the other steps shift the *page personality* (compact / canonical / generous / showcase) without changing what the token *is*. No `xs` or `2xl+` — page gutter is intentionally a narrow vocabulary so routes share rhythm.

| Token              | Value (mobile → Web) | Role                                                              |
|--------------------|----------------------|-------------------------------------------------------------------|
| `layout.page.sm`     | 8 px (constant)      | Compact gutter for information-dense routes — dashboards, admin tables, multi-pane list/detail views. Resolves to `ref.space.100`. |
| `layout.page.md`     | 16 px (constant)     | Default. Canonical page gutter for ordinary app routes. Resolves to `ref.space.200`. |
| `layout.page.lg`     | 24 → 40 px           | Generous gutter for marketing and content-forward pages — landings, editorial routes, high-emphasis CTAs. Resolves to `ref.space.300` (mobile) / `ref.space.500` (web). |
| `layout.page.xl`     | 40 → 64 px           | Widest gutter. Showcase heroes and brand-moment landings. Use sparingly — overuse breaks the shared page rhythm `md` establishes. Resolves to `ref.space.500` (mobile) / `ref.space.800` (web). |

#### Surface-internal padding

Padding inside a bounded surface — the breathing room between a container's own edge and its content. Applies to anything with a visible or implicit boundary that owns its interior: cards, sheets, dialogs, popovers, list rows, toolbars, sections, form groups.

##### Nine-step T-shirt scale

`3xs` → `3xl`, covering the full range from hairline chip insets to oversized hero canvases. `md` is the default (ordinary card / list-row / sheet padding). Lower steps (`3xs` / `2xs` / `xs` / `sm`) cover *control-density* surfaces (chips, buttons, dense cells); upper steps (`lg` / `xl` / `2xl` / `3xl`) cover *content-emphasis* surfaces (dialogs, hero blocks, marketing canvases). The wide range exists because container is the most diverse axis — the same role spans a 2px chip and a 64px hero.

**Rule of thumb** — if removing the container would make the padding meaningless, it belongs here. If the padding exists to keep content away from the screen edge regardless of what surface is on the page, it belongs in `layout.page.*`.

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

Vertical gap between stacked elements in a column — between form fields, list items, sections. Use `gap` in a flex/grid column or consistent `margin-top` on each child.

##### Nine-step T-shirt scale

`3xs` → `3xl`, the same range as `container.*` because vertical layouts span the same scale spectrum (from intra-pair hairlines to hero-section breaks). `md` is the default (paragraph / card-stack rhythm). The lower steps (`3xs` / `2xs`) signal *visually bonded* pairs (label↔input, title↔subtitle); the upper steps (`xl` / `2xl` / `3xl`) signal *page-section* breaks. Stack runs deeper than `inline.*` because long scrolling pages stack many more blocks than a row fits.

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

Horizontal gap between sibling elements on a single row — between icon and label, between adjacent buttons, between chips. Use `gap` (flex/grid) or horizontal `margin`; the value is identical either way.

##### Six-step T-shirt scale

`xs` / `sm` / `md` / `lg` / `xl` / `2xl` — the narrowest layout axis because rows have less spatial range than columns. `md` is the default (icon-label gap inside controls). All steps at and below `md` (i.e. `xs` / `sm` / `md`) sit constant across breakpoints — they describe *bonded inline pairs* whose proximity is the design intent; the upper steps (`lg` / `xl` / `2xl`) carry the web step-up so toolbar, breadcrumb, and rail-scale gaps breathe on wider viewports.

| Token              | Value (mobile → Web) | Role                                                              |
|--------------------|----------------------|-------------------------------------------------------------------|
| `layout.inline.xs`   | 2 px (constant)      | Almost touching. Visually bonded inline pairs — character ↔ diacritic, counter ↔ anchor, currency ↔ amount. Resolves to `ref.space.25`. |
| `layout.inline.sm`   | 4 px (constant)      | Very tight. Icon + label inside small controls — dense chips, icon buttons, filter pills. Resolves to `ref.space.50`. |
| `layout.inline.md`   | 8 px (constant)      | Default. Icon-label spacing inside buttons and inputs; gap between tightly related inline elements. Resolves to `ref.space.100`. |
| `layout.inline.lg`   | 12 → 16 px           | Gap between adjacent buttons in a toolbar, chips in a chip group, tabs in a tab bar. Independent targets, equal weight. Resolves to `ref.space.150` (mobile) / `ref.space.200` (web). |
| `layout.inline.xl`   | 16 → 24 px           | Spacious gap. Separates distinct inline groups — top-nav links, breadcrumb segments, toolbar clusters. Resolves to `ref.space.200` (mobile) / `ref.space.300` (web). |
| `layout.inline.2xl`  | 24 → 32 px           | Widest horizontal break. Rail-scale separations — the gap between a horizontally-scrolling track and its anchored trailing action, or between two unrelated horizontal clusters on the same row. Use sparingly. Resolves to `ref.space.300` (mobile) / `ref.space.400` (web). |

#### Composition recipes

The four axes above name *what role* a value plays; the recipes below name *which step* to pick for the five compositional situations every product surface runs into. They are not new tokens — every recipe resolves to a step in the tables above. They exist so two designers laying out unrelated screens land on the same rhythm, and so a fresh implementer never has to choose between (e.g.) `stack.xs` and `stack.md` from first principles.

##### Section ↔ section vertical separation (optional, 8px when needed)

Two adjacent sections **do not require an extra vertical gap**. Each section already carries `layout.container.*` padding on its top and bottom edges, and that padding is normally enough to read as separation between distinct sections — adding a stack gap on top of two paddings creates triple breathing room and weakens the page's vertical rhythm.

When a page has so much content that the back-to-back paddings are no longer enough to register as a section break, add **`layout.stack.xs` (8px)** between sections — never larger. The 8px sits *outside* the two paddings as a third tier of distinction; anything bigger reads as a page-region break and should be expressed by promoting one of the sections to a top-level region (`stack.lg` / `stack.xl`).

##### Content ↔ content vertical rhythm inside a section (16px default, 8px for one-group blocks)

Within a single content region, the baseline gap between two content blocks is **`layout.stack.md` (16px)** — the default reading rhythm. It gives paragraph↔paragraph, card↔card, and item↔item in a vertical feed the breathing room needed to read as separate-but-related siblings.

When the content blocks belong to **one tightly-bound group** (a stack of bullet rows, a list of metadata lines, a cluster of fields about the same entity), tighten to **`layout.stack.xs` (8px)** so the group reads as one unit rather than as several. The 8px rung says "these belong together"; the 16px default says "these are siblings within the same region." Don't go below 8px for group rhythm — the smaller `stack.3xs` / `stack.2xs` rungs are reserved for *visually bonded* pairs (label↔input, title↔subtitle), not for general content.

This recipe describes peer-content rhythm. A wider gap is correct when the two blocks are not peers but **distinct structural groups inside one section** — a header block ↔ a body block, a form group ↔ a submit cluster, a list label ↔ its scrollable track. That case is what `layout.stack.lg` (24 → 32px) names, and it composes cleanly above this recipe: peers within each block sit at 16/8, the gap between the two blocks themselves sits at `stack.lg`. If the gap reaches `stack.xl` or beyond, the two blocks are no longer one section — promote one to a top-level region.

##### Section horizontal padding (16px global, 16px touch-safe margin)

A section's left/right padding is **`layout.container.md` (16px)** by default — the system-wide horizontal inset that keeps content off the section's edge.

For a section whose interior contains a **touch target** that needs to extend past the visible content frame (an icon button with an invisible hit area, a row whose entire width is tappable), the **visible content's safe margin from the section edge must still total 16px** — but it can be *split* between the section's own padding and the touch element's padding. So a row with a 4px-padded icon button at its leading edge can sit in a section padded to 12px (`layout.container.sm`), and the icon's visible glyph still lands 16px from the section edge while the hit area extends to 12px. The contract is the *visual* 16px, not where the padding is paid.

##### Body text size (14px in mixed-group sections, 16px on single-topic pages)

When a section composes **multiple distinct text groups** in its body (a card listing several short descriptions, a settings page mixing labels and helper text, a feed of compact items), default to **`sys.typo.body.sm` (14px)**. Each group reads as one of several siblings; the 14px size keeps the visual weight balanced so no single block dominates.

When a section is the **single-topic body of a page** (an article, a long-form description, a documentation block, a one-up content surface), default to **`sys.typo.body.md` (16px)**. The page is doing one job and the reader is staying in this block — give them the larger reading size for stronger legibility. The 14px fallback applies the moment a second peer text group joins the surface.

##### Nested container padding (parent-tighter-than-child is wrong; child must be tighter)

When a content area lives inside another content area, **the inner area's padding must be tighter than the outer's** so the density step itself signals the hierarchy. A flat parent-and-child both at `layout.container.md` (16px) reads as two unrelated peers; the tighter inner padding tells the reader the inner block is *contained by* the outer.

The canonical step-down is **one rung**: parent at `layout.container.md` (16px) → child at `layout.container.sm` (12px). Step down once more for a third level (`xs`, 8px). Same direction across the whole tree — never invert, and never skip rungs (a 16px parent with a 4px grandchild reads as compression, not hierarchy). The same rule governs nested padding inside cards, dialogs, and list rows: every nesting level tightens by exactly one rung from `container.md` until the design needs `container.xs` to stop, after which further nesting drops out of the padding axis and lives in `inline.*` / `stack.*` instead.

### Radius

A flat T-shirt scale chosen by visual role rather than raw value, so a global shape adjustment (more geometric vs. more rounded) is a single-file edit that cascades consistently across every surface.

#### Scale

An eight-step ramp from `none` (square) through six T-shirt rungs to `full` (capsule), ordered by visual role rather than raw value, with two anchored defaults that carry most of the weight. Controls and surfaces have anchored defaults (`md`, `xl`) so most components inherit the right value without choosing.

- **Endpoints** — `none` (load-bearing geometry) and `full` (pills, circles). Either-or, not on the rounding ramp.
- **Control band** — `xs` / `sm` / `md`. Small, precise corners for hit-target elements. **`md` (8px)** is the default control radius.
- **Surface band** — `lg` / `xl` / `2xl`. Larger corners for content containers. **`xl` (16px)** is the default surface radius. A button (`radius.md`, 8px) inside a card (`radius.xl`, 16px) reads as *inside* the card rather than floating on top — the size difference does the work.

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

For edge-anchored surfaces — bottom sheets, side drawers, popover tails, attached tabs — round only the corners that don't touch the anchor. A bottom sheet rounds its top two corners at `radius.xl` and leaves the bottom two at `0`; a left-anchored drawer rounds only its right edge; a tab attached to a panel rounds only the corners that face away from the panel.

This is composition, not a new vocabulary: apply the existing `radius.*` value to the specific corners that need it (`border-top-left-radius`, `border-top-right-radius`, etc.). **Don't introduce per-corner tokens** — they multiply the token surface, drift independently, and don't survive a global radius change. The full radius scale already covers every value the corners need; asymmetry is whether to apply it.

#### Capsule vs circle

`radius.full` (9999px) is intentionally larger than any conceivable control dimension, so the resulting shape is determined by the *element's aspect ratio*, not by the radius value: a perfect capsule on any rectangle, a perfect circle on any square. One token, two shapes — pick the aspect ratio you want and `full` does the rest.

- **Capsule** — pill buttons, status chips, badges, progress tracks, segmented-control thumbs. Any rectangle whose width changes with content.
- **Circle** — avatars, FABs, circular icon buttons, radio dots, single-character indicators. Anything sized 1:1.

Do not approximate a capsule with `radius.2xl` or any finite step — the corners drift as content length changes, and a row of pills with the same token reads as visibly different shapes. If you want a capsule, use `full`.

### Border & Stroke

A four-step stroke-width scale paired with the existing color and radius tokens — borders are *width × color × shape*, and the width is the only axis that didn't have a token until now.

#### Why a width scale

Hardcoded values (`border: 1px`, `border: 2px`) accumulate inconsistently across components: a button at 1.5px next to an input at 1px next to a divider at 2px reads as authored by three different people. A small named scale gives every stroke a reason for its weight, the same way `radius.*` gives every corner a reason for its softness.

#### Scale

| Token              | Value | Role                                                                                       |
|--------------------|-------|--------------------------------------------------------------------------------------------|
| `borderWidth.none`   | 0px   | No stroke. The width *values* in this scale are what a control's stroke reads at (`hairline` rest, `thin` for an emphasis / active stroke); a control whose stroke should disappear in some state sets its colour `transparent`, not its width to `0px` (see the box-model note below) — `borderWidth.none` is for the rare layout where dropping the stroke's box is the intent (a divider that should genuinely collapse). |
| `borderWidth.hairline` | 1px | Default. Subtle dividers (table rows, list separators), card edges, input borders, outlined buttons. |
| `borderWidth.thin`     | 2px | Emphasis borders — focus ring outer, selected-state outlines, error-state field borders. Strong enough to register without competing with the fill. |
| `borderWidth.thick`    | 4px | Load-bearing strokes — keyboard-focus emphasis on touch surfaces, status indicators (active tab underline at hero scale), decorative rules. Use sparingly. |

The focus ring composition (see [Focus ring composition](#focus-ring-composition)) consumes `borderWidth.thin` for the outer ring and a 1px inner counter-ring; the 1px counter is `borderWidth.hairline`-equivalent and stays inline so the focus recipe is one self-contained `box-shadow`.

**Sub-pixel widths are forbidden.** A 0.5px hairline renders inconsistently across DPR (retina shows it; non-retina drops it entirely). When a thinner-than-1px effect is needed, lower the *opacity* of the stroke color, not the width.

**A control's stroke never touches the box model — implement it as an inset `box-shadow`, not a `border`.** Every interactive control (Button, Chip, Toggle / Toolbar Button, the Tabs that delegate to Chip, Form field input, …) draws its visible edge stroke as `box-shadow: inset 0 0 0 <width> <colour>` on the control box, and sets `border: none`. A `box-shadow` is paint, not layout: it costs the box model exactly zero in every state. So —

- **Presence is free.** An `outlined` Button is the *same size* as a filled one (no `+2px`); the label sits in the same place. A bordered Chip is the same footprint as a borderless one.
- **State changes don't reflow.** A Filter chip / Segmented tab swapping selected ↔ unselected only changes the shadow's *colour* (to `transparent` where the stroke should read as gone) — the chip never changes width, so a chip row never jitters when a selection moves. A Toggle Button flipping active ↔ inactive, likewise.
- **A heavier stroke doesn't grow the control.** A text field stepping from its `hairline` rest stroke to a `thin` active stroke just widens the *shadow* (`inset 0 0 0 2px` instead of `1px`) — the field's height stays exactly `content + padding` (a 24px line-box + 16px padding = 40px, never 42), and the caret / placeholder don't shift a pixel.

This is the same reasoning that makes the [focus ring](#focus-ring-composition) a `position: absolute` overlay layer rather than an `outline` / `box-shadow` on the control: **a stroke, a state change to a stroke, or a focus indicator must never reflow a layout.** Set `box-sizing: border-box` on the control as well (don't rely on the consumer's reset) so a `min-height` / fixed size always means the outer box, even though the stroke contributes nothing to it. (Structural dividers between rows — a list separator, a section rule — are a different thing: those *are* part of the layout and a real `border` / `box-shadow` is fine; this rule is about a *control's own edge stroke*.)

### Elevation

Shadows are classified by the **spatial role a surface plays**, not by the component that uses it. A card and a selected list row both read as `raised`; a FAB and a dropdown both read as `floating`.

#### Scale

Three lift levels along a single ascending intensity axis, plus one direction-special token. Each preset is a self-contained two-layer shadow (tight ambient + wider spread) tuned to one spatial role; components consume the role, never assemble shadows themselves.

- **Lift ramp** — `raised` (subtle) → `floating` (free-floating) → `overlay` (page-blocking). Each step deepens the spread layer's blur and alpha; meaning is the spatial relationship to the page (sits-on vs hovers-above vs blocks).
- **Direction-special** — `sheet`. Same intensity family as `floating`, but the offset is inverted so the shadow projects *away from the anchored edge* (bottom sheets cast upward).
- **Two-layer composition.** Each preset is a tight ambient layer plus a wider spread layer, mirroring physical light behavior so edges stay crisp while the diffuse halo fades naturally.
- **Shadow alphas come from the overlay palettes.** `palette.black.*` draws from the [base-unit ladder](#base-unit-ladder) read as percent — every shadow alpha (4 / 6 / 8 / 12 / 16 / 20%) is a step on that ladder, so a step rebalance in the palette propagates through every elevation preset without re-authoring shadows.

| Token                | Two-layer shadow                                                                  | Role                                                                              |
|----------------------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `elevation.raised`     | `0 1px 2px black/4%, 0 2px 6px black/6%`                                          | Subtle lift. Cards at rest, hovered list rows, selected menu items, buttons that should read as gently elevated without demanding attention. |
| `elevation.floating`   | `0 2px 4px black/6%, 0 8px 20px black/12%`                                        | Free-floating above the page. FABs, floating menus, dropdowns, autocomplete panels — elements that detach from the flow and hover over content. |
| `elevation.overlay`    | `0 4px 12px black/8%, 0 16px 48px black/20%`                                      | Page-level overlay demanding user focus. Modals, dialogs, popovers, full-screen prompts that sit above a scrim and block interaction below. |
| `elevation.sheet`      | `0 -2px 6px black/4%, 0 -8px 24px black/16%`                                      | Edge-anchored panel projecting shadow away from its anchored edge (here, anchored bottom — shadow rises). Bottom sheets, side drawers, pinned panels. |

### State layers & Focus

A single rule expresses every interactive state — paint a translucent layer of the element's foreground over its base, at the opacity defined by the state — and pairs with a three-layer focus ring for keyboard accessibility.

#### State overlays

Interactive controls need visible feedback for four states — hover, focus, pressed, dragged — across many base colors and component variants (filled / tonal / outlined / text). Hand-picking a bespoke hover color for every (base × variant) combination would explode the token surface; Chorus avoids it by expressing state as **a single rule** (the foreground-over-base composition introduced above), so adding a new color role or component variant requires zero new state tokens.

##### Intensity ramp plus a categorical

Five tokens organized as an intensity ramp plus one categorical special:

- **Interaction ramp** — `hover` (8%) → `focus` (12%) → `pressed` / `dragged` (16%). Ascending intensity, ascending commitment. `pressed` and `dragged` share the same opacity because both represent sustained active engagement.
- **Categorical special** — `disabled` (40%). Not on the overlay ramp at all; it is the *element's own opacity*, applied directly to the control, with all overlay layers suppressed.
- **Stacking rule** — overlay layers from the ramp stack additively when states coexist (focus + hover → 8% + 12%, composited). `disabled` is exclusive: when active, the ramp is suppressed.

**How to apply**:

1. **Pick the overlay color** — it is the element's foreground (the color used for text/icons on that surface).
   - Filled primary button → overlay color is `color.onPrimary`.
   - Tonal button on `primaryContainer` → overlay is `color.onPrimaryContainer`.
   - Text / ghost button on `surface` → overlay is `color.primary` (the ink becomes the overlay when there is no fill).
   - Selectable surface (list row, menu item) → overlay is `color.onSurface`.
2. **Pick the opacity from `state.*`** based on which state is active.
3. **Composite** — render the overlay as a layer (pseudo-element, extra background-image, or CSS `color-mix`) covering the interactive region, clipped to the element's shape (radius included).
4. **Stack additively** when states coexist. A focused element that is also hovered shows *both* layers — 8% + 12% composited, not replaced. Pressed during focus → 12% + 16%.
5. **`disabled` is different**: it is the element's own opacity (40%), not an overlay. When disabled, suppress hover/focus/pressed layers entirely and switch the cursor to `not-allowed`.

**Scope** — apply to any control the user can hover, focus, press, or drag: buttons, chips, list items, menu items, tabs, switches, checkboxes, icon buttons, draggable cards. Do not apply to static surfaces (page background, plain text, dividers) — they have no interaction to signal.

| Token            | Opacity | Role                                                                              |
|------------------|---------|-----------------------------------------------------------------------------------|
| `state.hover`      | 8%      | Pointer is over the element. Lowest-intensity layer — gentle highlight, not a commitment. Resolves to `ref.opacity.8`. |
| `state.focus`      | 12%     | Element holds keyboard or programmatic focus. Stronger than hover so focused controls remain visible to keyboard users even when the pointer is elsewhere. Pair with the focus ring composition (see [Focus ring composition](#focus-ring-composition)). Resolves to `ref.opacity.12`. |
| `state.pressed`    | 16%     | Active press / tap / click. Strongest persistent layer — provides tactile feedback before the action completes. Resolves to `ref.opacity.16`. |
| `state.dragged`    | 16%     | Element being dragged (reorderable list items, draggable cards, slider thumbs mid-drag). Matches `pressed` intensity — both represent sustained interaction. Resolves to `ref.opacity.16`. |
| `state.disabled`   | 40%     | Element-level opacity (not an overlay). Indicates the control is non-interactive. Suppress hover/focus/pressed layers and use a non-interactive cursor. Resolves to `ref.opacity.40`. |

#### Focus ring composition

The state overlay alone does not meet keyboard-accessibility contrast requirements. Every interactive control pairs `state.focus` with a visible ring on `:focus-visible` — a **three-layer composition** built strictly outward from the control's outer edge:

| Layer                | Position relative to control          | Width | Token                |
|----------------------|---------------------------------------|-------|----------------------|
| Fill layer           | painted ON the control's surface      | —     | `state.focus` (12%) of the variant's foreground composited over the variant's container |
| Inner counter-ring   | 0 → 1px outside the control's edge    | 1px   | `color.focusInset`   |
| Outer ring           | 1px → 3px outside the control's edge  | 2px   | `color.focus`        |

So an implementer reading from the control outward sees: **fill layer (on the control) → 1px `color.focusInset` → 2px `color.focus`**. Both rings are always visible — `color.focusInset` is a thin interior counter-ring (a single-pixel inverse-toned hairline between the control and the outer ring), not the outermost layer; that one-pixel inversion is enough to guarantee a visible edge on any surface (white-on-white or black-on-black is impossible) without inflating the ring past its 3px outward extent.

The ring sits on a **dedicated overlay layer** — a `position: absolute` pseudo-element (`::after`) stacked on top of the control's content, carrying the multi-shadow — rather than an `outline` / `box-shadow` on the control element itself. The pseudo lets the ring draw cleanly *on top of* the state-overlay tint and the label, and **never affects layout** — focus moving across a row or grid never reflows a sibling, never widens the control, never shifts a gap.

Two named compositions cover every control in the system:

**Outward** — the default. Ring sits *outside* the control's footprint and extends 0..3px beyond the edge. Use for controls that live inline with breathing room around them — **action affordances**: Button (every appearance), Chip, Form Field, FAB, Icon Button, Text Button. The 3px outward extent is reserved by the surrounding layout so the ring never collides with neighbours.

**Inward** — for **container-shaped components** that fill their parent edge-to-edge with no breathing room: Tab Bar (slots flush at `flex: 1 1 0`), Tabs Underline (row in an `overflow-x: auto` scroller), List (rows tile the column with a hairline divider between them). The ring is drawn entirely *inside* the control's bounding box (depth 0..3px from the edge inward), so an outward ring that would clip at the scroller / overlap a neighbour / extend past the divider is avoided. The composition (1px `color.focusInset` counter-ring, 2px `color.focus` stroke) is identical to outward; only the offset direction flips. Both rings inherit the control's `border-radius`. Suppressed while `disabled`.

**Choosing.** Default to **Outward**. Switch to **Inward** when *any* of: (a) the control is flush against a sibling (no inter-control gap), (b) the control's parent is an `overflow: hidden` / `overflow-x: auto` scroller, (c) the control's footprint already tiles the available width (`flex: 1 1 0` slot, `width: 100%` list row). Within a single component family, the choice is fixed per sub-component — never per-instance.

The canonical CSS recipe — write this on a pseudo-element layer, and write the multi-shadow inline (do **not** wrap it in a `var()`; Chrome resolves stylesheet `box-shadow: var(--multi-shadow)` to zero spreads):

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

Pair the ring with the per-variant fill rule (`background: color-mix(in srgb, <foreground> calc(var(--sys-state-focus) * 100%), <container>)`) so the focus state shows BOTH the overlay and the ring.

#### Text links

A **text link** is a hyperlink whose chrome is only its label — no fill, no border, no surrounding capsule. It sits inline inside prose (a mention `@name`, a citation source) or anchors a navigation row whose label is the only typographic affordance (the channel name under a thumbnail, a "View all" footer).

Text links diverge from the [State overlays](#state-overlays) rule because they have no container to paint the overlay over — overlaying the ink onto a transparent surface produces no visible feedback. Instead, **express hover as a 1px underline in the link's own color**:

| State        | Treatment                                                                                       |
|--------------|--------------------------------------------------------------------------------------------------|
| `default`    | No decoration. Color is the link's resting ink (`color.primary` for accent links, `color.onSurface` for navigation labels — whatever the surrounding type role specifies). |
| `hovered`    | `text-decoration: underline`, `text-decoration-thickness: 1px`, `text-underline-offset: 2px`. **Color does not change** — the underline is the affordance. |
| `pressed`    | Underline persists; opacity drops to `state.pressed` (16%) overlay on the text via `color-mix` so the link feels tactile without flipping its ink color. |
| `disabled`   | Element opacity at `state.disabled` (40%); underline suppressed. |
| `focused`    | Underline persists; the three-layer focus ring (see [Focus ring composition](#focus-ring-composition)) paints around the link's text box. |

The underline appears **only on hover** because resting text already inherits hierarchy from its `typo.*` role — adding a permanent underline to every link would over-emphasize navigation chrome at rest. The hover stroke is the just-in-time affordance: it tells the pointer "this is clickable" the moment the user expresses interest, without paying for the decoration when no one is looking.

**Do not change color on hover.** A blue-on-hover treatment (label flips to `color.primary` when the pointer enters) is the wrong affordance for a text link — it competes with the surrounding type's color hierarchy and reads as a category change rather than as interaction feedback. Underline owns hover; color owns role.

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

**Scope** — apply to: inline prose hyperlinks, mention chips written as plain `@name` ink, citation source attributions, channel-rail labels under thumbnails, "View all" / "See more" footer affordances, any navigation row whose entire interactive surface is a single text label. **Do not apply to** buttons (they carry their own fill + state overlay), Filter / Tag chips (capsule + container pair), card-shaped links like the Feed citation surface (the card *is* the affordance, not the inline link).

#### Caret

The blinking insertion mark inside a text-input slot — `<input>`, `<textarea>`, contentEditable region — is a **system-wide rule**, not a per-component decision. Every component that hosts a typing surface ([Form Field Input](components/form-field/input.md), [Form Field Search Bar](components/form-field/search.md), [Navigation Bar Search](components/navigation-bar/search.md), and any future text-input slot) inherits the same caret recipe so the typing target reads at one weight across the system.

| Property         | Value                                          | Token                                |
|------------------|------------------------------------------------|--------------------------------------|
| Color            | High-emphasis foreground of the surface — same ink the user is typing | `sys.color.onSurface` (default), `sys.color.error` (error appearance) |
| Intended width   | 2px                                            | `sys.borderWidth.thin`               |
| Intended height  | 0.75 × the input's text line-box (computed from `line-height`) | derived               |
| Intended ends    | Rounded                                        | radius equal to half the caret width |

**Color is the only part of the recipe browsers honour.** Standard CSS exposes `caret-color` and nothing else — the caret's width, height, and end-cap shape are painted by the browser's own text engine and cannot be overridden without forfeiting the native input (and with it: IME composition, RTL support, screen-reader cursor announcement, mobile autocorrect overlays). The width / height / rounded-ends columns above are the **design intent** that the system asks browsers to approximate; the contract every implementation actually has to enforce is the colour binding.

**Why no Caret component.** A caret isn't compositional — it lives inside a text-input element rather than next to it, has no React tree, and can't accept props or children. Wrapping it would mean either (a) re-implementing the entire input surface in JS to render a fake caret on top of a `caret-color: transparent` field (breaks the platform's IME / a11y contract and is never worth the geometry), or (b) inventing a token group with nothing to wire it into. The right unit is this rule: every input-bearing component sets `caret-color: var(--sys-color-onSurface)` (or `var(--sys-color-error)` on the error appearance) and references this section in its spec. No component, no new tokens.

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

**Inheritance shortcut** — when the input element's `color` is already bound to the right ink (Form Field Input sets `color: var(--field-text)`, which resolves to `onSurface` / `onErrorContainer` per appearance), `caret-color` inherits the right value automatically and no extra rule is needed. Set `caret-color` explicitly only when the input's own `color` differs from the caret's intended colour (Navigation Bar Search's bare input, where the value text and the caret happen to share `onSurface`, is the simple case).

### Responsive behavior

Three breakpoints carve the viewport into four named tiers (mobile → tablet → laptop → desktop). Token step-ups happen once, at the mobile→tablet line; chrome layout shifts compose on top.

#### Breakpoints

Chorus names four viewport tiers and the three lines between them:

| Tier        | Range            | Crosses               |
|-------------|------------------|-----------------------|
| **mobile**  | <800px           | —                     |
| **tablet**  | 800px – 1099px   | mobile → tablet       |
| **laptop**  | 1100px – 1499px  | tablet → laptop       |
| **desktop** | ≥1500px          | laptop → desktop      |

The **mobile → tablet** line at **800px** is the only token-level breakpoint (`$responsive.web`): below it, mobile values apply; at or above, web values apply. Token step-ups stop there — every responsive token carries at most two values. The tablet→laptop and laptop→desktop lines are *layout-level* breakpoints used by chrome (e.g. side nav becomes a permanent rail at the laptop tier; the in-page nav reveals at the desktop tier). Product code reads tokens; only chrome reaches for the higher tiers.

#### What grows on web

Per-group rules for the mobile→tablet (800px) step-up. The system-wide invariant: **`md` is the responsive baseline; only sizes above it (`lg`, `xl`, `2xl`, `3xl`) grow on web.** Reading sizes, tap targets, and the entire `md`-and-below band of every layout axis stay constant — those are the values that ride directly on controls and dense surfaces, where viewport-driven growth would inflate the control past the role it describes.

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

Tap-target sizing is owned by [§Accessibility § Touch & Pointer targets](#touch--pointer-targets); §Foundations does not redefine it. The same `layout.container.sm` (12 → 16px padding) default produces a 40–48px control height that already clears the 44px iOS / 48px Material guideline on mobile.

#### Image and media

Responsive images use `max-width: 100%`. Hero compositions that arrange illustration alongside text on web fall back to stacking on mobile — the spacing rhythm carries over via the `layout.stack.*` step-down.

#### Why this split

Most design systems carry three to five breakpoints and let *every* token vary across all of them. Chorus splits the responsibilities: tokens vary at one line (mobile↔web), chrome composes the rest. Product code stays a single boolean ("mobile or web"), and the token surface stays honest — every responsive token has at most two values.

The two upper lines exist because chrome has real call sites at each: the side-nav rail needs a viewport that comfortably hosts content + 320px rail (laptop, ≥1100px), and the in-page nav needs a third column beside both (desktop, ≥1500px). Token step-ups would multiply `(token × viewport)` pairs across those tiers without payoff — most intermediate sizes get under-tested in practice — so layout shifts stay local to chrome.

#### Density

Chorus does **not** ship a global "compact mode" toggle. Density is expressed *locally*, by picking a smaller `typo.label.*` rung and a smaller `layout.container.*` step on the controls that need to be dense (table cells, dense toolbars, admin grids). The system already provides the vocabulary; layering a global density mode on top would double the surface and let two ways of asking for "smaller" drift apart.

**When you need a denser surface**, choose the smaller rung explicitly:

- Drop the label one step (`label.md` → `label.sm`), drop the matching icon (`icon.md` → `icon.sm`) — note `icon.sm` is the smallest 12px tier in the post-rebalance scale.
- Drop container padding one step (`layout.container.sm` → `layout.container.xs`).
- Keep `radius.md` and the focus-ring composition unchanged — density should not erode hit-target legibility.

---

## Accessibility

### Accessibility

Accessibility in Chorus is a property of the token system, not a checklist applied at the end. The color quartets clear contrast by construction; the focus ring is a system primitive, not a per-component flourish; the type scale and tap targets are sized so they work without zoom. This chapter consolidates the accessibility guarantees the foundations already provide and names the rules every product surface must follow on top of them.

#### Conformance targets

Chorus targets **WCAG 2.2 Level AA** as the floor for every product surface and **AAA where the foundations already meet it** (e.g. the `onSurface`/`surface` pair clears AAA at 7:1 in both modes). AA is the contract: a surface that fails AA is a bug, not a stylistic choice. Document the gap in DESIGN.md if a deliberate exception exists; otherwise fix the surface.

#### Color contrast

Contrast is enforced by the **paired-token rule**: every fill ships with its own `on*` foreground, and the pair is tuned to clear 4.5:1 for body text and 3:1 for large text and non-text UI components.

- **Never read contrast manually.** If two roles aren't paired (`primary` + `onPrimary`, `surface` + `onSurface`, …), they aren't a permitted combination. Reaching for `onSurface` text on a `primary` background bypasses the contract.
- **Surface stack is single-pair.** All `surfaceContainer*` tones read against `onSurface`. The container ladder carries *spatial meaning*, not contrast variation.
- **Lower-emphasis text uses `onSurfaceVariant`** — still ≥ 4.5:1 against every surface tone, deliberately one step lighter than `onSurface` so a two-tier text hierarchy stays inside the contrast contract.
- **Disabled is the exception.** `state.disabled` (40% element opacity) drops below AA on purpose — disabled controls are not interactive, so the WCAG 1.4.3 inactive-component carve-out applies. Never use `disabled` styling to convey live information.

#### Touch & Pointer targets

Mobile tap targets are governed by `layout.container.sm` (12 → 16px padding) on default-size controls, producing a default control height around **40–48px** depending on label size — comfortably above the 44px iOS / 48px Material guideline.

- **Minimum 44 × 44 CSS pixels** for any interactive element on touch surfaces. Icon-only buttons inflate their hit area with transparent padding rather than enlarging the glyph.
- **Independent targets need an 8px gap** (`layout.inline.md` mobile) so adjacent controls don't share a hit zone. Stacked tap targets follow the same rule via `layout.stack.xs` minimum.
- **Pointer (desktop) targets** can shrink — a 24px close button in a toolbar is fine — but never below 24px or below `borderWidth.thin` × 2 for the visible silhouette.

#### Keyboard navigation

Every interactive control must be reachable, operable, and visible to a keyboard.

- **Tab order follows DOM order.** Don't override with `tabindex` greater than `0`; if the visual order needs to differ from the source, fix the source.
- **`:focus-visible`, not `:focus`.** Mouse interactions never paint the focus ring; keyboard and programmatic focus always do. The composition is fixed (see [Focus ring composition](#focus-ring-composition)).
- **Skip link** to main content lives at the very top of every route, visually hidden until focused. Routes with persistent side-nav also offer a skip link past the nav.
- **Custom controls match native semantics.** A `div` styled as a button needs `role="button"`, `tabindex="0"`, Space + Enter activation, and `aria-pressed` / `aria-expanded` where applicable. If you can't replicate the native semantics, use the native element.
- **Arrow-key navigation inside composite widgets** (tab bars, menus, toolbars, listboxes) follows the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — Left/Right inside a tab strip, Up/Down inside a menu, Home/End to jump to ends.
- **Focus must never be trapped** outside an explicit modal context. Modals trap focus while open and restore it to the trigger on close.

#### Screen reader & Assistive tech

- **Visible label is the accessible label.** A button reading "Save" has its accessible name as "Save"; never duplicate or contradict in `aria-label`.
- **Icon-only controls require an accessible name** via `aria-label` (or visually-hidden text). Decorative icons next to a text label use `aria-hidden="true"` so the icon doesn't double-announce.
- **Live regions for async feedback.** Toasts, snackbars, and inline form-validation messages live inside an `aria-live="polite"` region (`assertive` only for genuinely interruptive failures). Don't rely on color or motion alone to communicate status.
- **Form fields own their labels.** Every input has a programmatic label (`<label for>` or `aria-labelledby`); placeholder text is not a label. Required state is conveyed both visually and via `aria-required`.
- **Error association** uses `aria-describedby` pointing at the helper-text node, plus `aria-invalid="true"` on the field — color alone never carries the error.
- **Don't override `lang`.** Mixed-script content stays under one root `<html lang="ko">` (or `en`); `<span lang>` only when a fragment genuinely switches language. Screen readers use `lang` to pick the right voice and pronunciation.

#### Motion & Animation

- **Respect `prefers-reduced-motion: reduce`.** Collapse transitions to 0ms (or near-zero) and skip transform-based animations. Treat reduced-motion as the safe default the rest of the system has to opt out of, not as an afterthought.
- **No flashing more than 3 times per second** anywhere — WCAG 2.3.1 hard requirement. Most likely failure mode is loading skeletons; cap pulse rate at 2 Hz.
- **Auto-advancing carousels and auto-playing video are forbidden** without user control. If they exist, the user must be able to pause, stop, or hide them.

#### Visual & Cognitive

- **Don't convey meaning by color alone.** Required-field markers, error states, status pills all pair color with text or an icon. The data-viz palette section makes this explicit; the rule applies system-wide.
- **Resize support to 200%.** Type scales in rem (anchored to user preference); layout doesn't break, no horizontal scroll appears at zoom 200%.
- **Reflow at 320 CSS pixels.** Mobile-narrow content reflows without horizontal scroll except for elements that genuinely need 2D scrolling (tables, code blocks, maps).
- **`prefers-contrast: more`** is honored where it matters — increase border weight from `borderWidth.hairline` to `borderWidth.thin`, switch `outlineVariant` to `outline`, drop tonal elevation cues in favor of explicit borders.
- **Plain language.** Error messages, empty states, and primary actions use the [Voice & Content](#voice--content) chapter's rules — short sentences, no jargon, the user's language.

#### Internationalization

Chorus is a Korean-first product with regular Latin admixture; the typography section already addresses mixed-script balance. The accessibility implications are smaller than they look but worth naming explicitly.

- **One typeface for both scripts** — see [Font family](#font-family). Substitute fonts for Latin-only or Korean-only regions break the mixed-script contract and can fail screen-reader pronunciation.
- **Title Case is not used** because it has no Korean analogue — see [Casing](#casing). Localized strings stay sentence case across every language.
- **Translation expansion budget.** Most layouts must absorb ~30% string growth (German, French) without breaking. Don't hardcode component widths from a Korean string measurement; use `min-width` / `max-width` based on the longest plausible localization, or let the control auto-fit.
- **Bidirectional (RTL) text** is currently out of scope (no RTL locale planned). When Chorus does adopt an RTL locale, the layout axes (`layout.inline.*`, `layout.page.*`) become logical (`inline-start` / `inline-end`) rather than physical (`left` / `right`); plan for that swap rather than baking `left`/`right` into product code today.
- **Number, date, currency formatting** uses the platform `Intl` APIs with the user's locale — not hand-rolled formatters. Korean dates default to `YYYY.MM.DD`; Latin locales default to the locale's own convention.

---

## Guidelines

### Do's & Don'ts

Quick rules distilled from the system, organized as 1-to-1 paired rows: each Do has a matching Don't on the same topic. Use them as a checklist when reviewing a surface — adopting a "do" while ignoring its matching "don't" leaves the system incoherent.

#### Do

What to reach for — the practices that keep the system coherent across surfaces and cheap to rebrand.

- **Consume system tokens (`sys.*`).** `var(--sys-color-primary)`, not `var(--ref-palette-blue-500)`. Reference variables exist for documentation only.
- **Reserve Blue 500 as the sole brand accent.** `tertiary` (purple) is a categorical / decorative accent, not a second brand hue.
- **Pair every accent fill with its `on*` foreground.** `primary` ↔ `onPrimary`, `primaryContainer` ↔ `onPrimaryContainer`. The pairs are tuned to clear AA.
- **Reach for `XContainer` + `onXContainer` for tinted surfaces.** Soft accent backgrounds — callouts, info banners, success tiles, selected rows — *are* the Container pair; the Container tone already is the tint, no overlay needed.
- **Compose state as foreground-over-base.** A single rule — `state.*` opacity layered over the element's foreground — works on every variant of every component.
- **Express lift with `elevation.*` shadows.** Let the `surfaceContainer*` names carry the spatial *meaning* (sunken → topmost) even when tones collapse.
- **Use `layout.*` for layout-participating spacing.** Page gutters, card insets, and section rhythm grow on web; reach for raw `space.*` only for fixed-footprint controls.
- **Apply `layout.page.*` once at the route root.** Nested content uses `layout.container.*` / `layout.stack.*` / `layout.inline.*`.
- **Use Pretendard for both Hangul and Latin.** The mixed-script balance is why the typeface was chosen.
- **Use `radius.md` for controls and `radius.xl` for surfaces.** Containers visually "hold" the controls inside them; compose asymmetric corners from the same scale.
- **Build every `:focus-visible` ring from the three-layer composition.** Outer `color.focus`, `state.focus` fill, inner `color.focusInset` — together they clear contrast on any background.

#### Don't

What to avoid — the patterns that erode the system's meaning, accessibility guarantees, or rebrand resilience.

- **Don't ship `ref.*` variables in product code.** They're palette internals; bypassing the system tier defeats rebrandability.
- **Don't introduce a secondary accent hue.** Two brand colors compete instead of arrange — they break the chorus.
- **Don't read foreground contrast manually or mix `on*` across roles.** A handpicked text color drifts as the palette evolves and silently breaks AA.
- **Don't compose ad-hoc tinted surfaces with `color-mix(<accent> N%, <surface>)`.** A 5–10% accent over `surface*` for a callout, banner, info block, or any "subtle" highlight bypasses the Container quartet's AA contract — the Container pair is the canonical tint. The only allowed `color-mix` involving an accent is the [state-overlay formula](#state-overlays) or a [decorative gradient stop fading to `transparent`](#four-token-quartet) where text contrast is governed by the underlying base.
- **Don't hardcode hover or pressed colors per component.** Bespoke per-(base × variant) tokens explode the surface and drift independently.
- **Don't add tonal elevation in light mode.** All `surfaceContainer*` tones resolve to `#ffffff` by design — brighter-on-brighter feels showy and breaks the calm.
- **Don't reach for raw `space.*` for layout-level rhythm.** Section gaps, card-stack rhythm, and page gutters live in `layout.*` so the web step-up reaches them.
- **Don't reapply `layout.page.*` to nested content.** Page gutters are a viewport concern; full-bleed elements opt out by negating the gutter, not by changing the token.
- **Don't substitute Latin-only or Korean-only fonts per region.** Splitting families breaks the mixed-script contract and can fail screen-reader pronunciation.
- **Don't introduce per-corner radius tokens.** They multiply the token surface and don't survive a global radius change.
- **Don't use `color.focus` alone.** A single-layer ring fails contrast against same-toned backgrounds; the full composition is the contract.

---

## Voice & Content

### Voice & Content

What the system *says* matters as much as how it looks. Voice & Content is the writing layer of Chorus — the rules that keep button labels, error messages, empty states, and microcopy coherent across surfaces and across translations.

#### Voice principles

The brand voice is **clear, calm, trustworthy** — the same three words the visual language is tuned to. In writing, that translates to four habits:

- **Plain over clever.** "Save changes" beats "Lock it in." Cleverness ages badly across translations and reads as marketing inside a product surface.
- **Direct over hedged.** "We couldn't load your settings" beats "It seems there may have been an issue loading your settings." Hedge words (`maybe`, `seems`, `appears to`) erode trust.
- **User's words, not ours.** Use the noun the user typed (`post`, `comment`, `room`) over our internal name (`thread`, `entity`, `space`). Internal vocabulary leaks in code review; product copy is where it stops.
- **Anonymous-friendly.** The product is built for users who speak more freely without their name attached. Avoid copy that personalizes from our side ("Hey John!") or assumes identity disclosure ("Tell us about yourself"). Default to second-person plural or impersonal constructions.


#### Buttons & CTAs

- **Verb + object, sentence case.** "Save changes", "Send invite", "Delete post". One verb; if you need two, the action is doing too much.
- **Primary CTA is the most likely intent**, not the most important to us. "Continue" beats "Submit" on a multi-step form because the user is continuing, not submitting.
- **Destructive actions name what's destroyed.** "Delete account" beats "Delete"; the explicit object lets a user catch the mistake before the confirm dialog.
- **Cancel is always "Cancel"** — never "Nevermind" or "Keep editing". The convention is more important than the cleverness.
- **No trailing punctuation** on button labels.

#### Error messages

Three-part structure: **what happened · why it matters to the user · what to do next.** Drop any part that isn't load-bearing — but never invert the order.

- ❌ "Error 422: validation failed."
- ✅ "Email is already in use. Try signing in instead."

- **Lead with the user's action**, not the system's state. "Couldn't send your post" (user-frame) over "Server returned 500" (system-frame).
- **Never blame the user.** "Wrong password" → "That password didn't match." Tone-shift costs nothing and softens repeated failures.
- **Avoid jargon and codes** in user-facing copy. Status codes belong in dev tools, not in toast bodies.

#### Empty states

Three lines max: **what this surface is for · why it's empty right now · the one action that fills it.**

- ✅ "No posts yet. Conversations you start or join will appear here. **Start a post.**"

The CTA inside an empty state is often the surface's primary action — make it primary visually too (`color.primary` button).

#### Loading & Success

- **Loading copy** describes the action, not "Loading…". "Saving your draft", "Sending invite", "Loading 3 of 12 posts". Concrete progress beats a vague spinner caption.
- **Success copy is short and past-tense.** "Saved.", "Sent.", "Copied to clipboard." — the period is doing work. Never use exclamation marks (`Saved!`); the brand voice is calm.

#### Form helper & Validation

- **Helper text describes the rule before the user fails it** — "8+ characters with a number" — not after. Validation messages then refer back to the same rule.
- **Required is marked once**, not on every field. Either mark required ("*") or mark optional ("(optional)") — pick the rarer label so the cognitive load is small.
- **Inline validation** fires on blur for new fields, on input for fields the user has already failed once. Don't lecture mid-typing.

#### Casing, punctuation, and numbers

The casing rules in [Casing](#casing) are the canonical source for sentence case and the segmented-sentence-case treatment of compound headings. A few additions specific to body copy:

- **Sentence-final punctuation** in toast bodies, helper text, and empty-state prose. Buttons, labels, and chips drop the period.
- **Single quotes for inner quotation, double for outer** in English. Korean uses 「 」 for inner and 『 』 for outer per Korean orthographic convention.
- **No Oxford comma** in Korean (no equivalent); honor it consistently in English copy.
- **Numbers under 10 spelled out in prose** (English); always use numerals for measurements, IDs, dates, currency. Korean uses numerals throughout.
- **`–` for ranges** (`3–5 posts`), `—` for parenthetical breaks, never `--` or two hyphens in production strings.
- **Date formats** — Korean default `YYYY.MM.DD`; English default `D MMM YYYY` (`29 Apr 2026`). Never `MM/DD/YYYY` or `DD/MM/YYYY` — the order is ambiguous across locales.

#### Localization

- **Write source strings translation-ready.** Avoid embedded HTML or markdown in strings; use placeholders for variables (`{name}`, `{count}`) so translators can reorder. Sentence fragments are harder to translate than full sentences — prefer the full sentence even if it reads slightly long in English.
- **Plurals via ICU MessageFormat**, not string concatenation. Korean has no grammatical plural; English has two; some languages have six. Concatenated `${count} items` breaks every non-English locale.
- **Don't truncate at character counts.** Translation expansion routinely doubles a Korean string in German; layouts must accommodate via `min-width` / wrap, not by hard truncation.
- **Time-sensitive strings** ("just now", "2 hours ago") use platform `Intl.RelativeTimeFormat`, not hand-rolled phrasing.

---

## Components

The token system bottoms out at components — buttons, inputs, cards, dialogs, the small set of primitives every surface in the product is built from. This chapter is the **anatomy reference**: what slots a component owns, which system tokens fill each slot, and the composition rules that hold across variants.

### Why anatomy, not a catalogue

Chorus does not ship a closed component catalogue. Product surfaces compose system tokens directly (see [Token architecture](#token-architecture)); the component tier is opt-in and currently empty. What this chapter documents is the **shape every primitive should take** when authored — slot names, token bindings, state behavior — so two teams building "the same" button arrive at the same result without coordinating.

The set below covers the components that recur most often and whose composition is most likely to drift if left informal: button, input, card, dialog, chip, tab. Components beyond this set follow the same anatomy pattern even if not enumerated here.

Each component anatomy describes:

1. **Slots** — the named regions the component owns (`container`, `label`, `leadingIcon`, `trailingIcon`, …).
2. **Tokens per slot** — which system tokens fill that slot in the default variant.
3. **Variants** — how slots re-bind for filled / tonal / outlined / text variants.
4. **States** — how the [State overlays](#state-overlays) and [Focus ring composition](#focus-ring-composition) apply to each slot.

> Per-component implementation details — slots, default bindings, variants, sizes, states, behavior — live in [`schema/components/`](components/README.md). Each component spec defers to the Chorus-wide rules in this document (color, typography, spacing, state overlays, focus ring, accessibility) and only documents what is component-specific. The component catalog itself — which families exist, their folder layout, their sub-component breakdown — is the README inside that directory; DESIGN.md does not duplicate the inventory.

What stays in this chapter is the **shape every primitive should take** plus the cross-cutting compositions that recur across all components: empty states and loading patterns. Anything component-specific belongs in its spec.

### Empty states

Three lines max — see [Empty states](#empty-states) in Voice & Content for the writing rules. The visual composition:

- **Optional illustration** at `icon.xl` or larger, centered, color `color.onSurfaceVariant` (illustrations stay monochrome unless they carry brand-moment intent).
- **Headline** in `typo.heading.sm` color `color.onSurface`, `layout.stack.sm` below illustration.
- **Body** in `typo.body.sm` color `color.onSurfaceVariant`, `layout.stack.2xs` below headline.
- **Primary CTA** as a default-size primary button, `layout.stack.md` below body.
- Whole composition centered inside the surface that would otherwise hold the data.

### Loading & Skeleton states

- **Spinners** for indeterminate loads under ~1 second of expected wait. Use `color.primary` for foreground motion on neutral surfaces; reserve to a single spinner per view.
- **Skeleton placeholders** for content shapes that will arrive — feed cards, list rows, profile headers. Skeleton color is `color.surfaceContainerHigh`; the pulse animation runs at 1.5–2 Hz (well below the WCAG flash threshold) and respects `prefers-reduced-motion: reduce` (no animation; show the skeleton statically).
- **Match the shape**, not the content. A skeleton for a feed card uses the same radius, padding, and inline rhythm as the real card so the layout doesn't jump on resolution.
- **Don't skeleton tiny surfaces.** A spinner is faster than authoring a skeleton for a 40px button.
- **Loading copy** lives inside the skeleton or beside the spinner — see [Loading & success](#loading--success) for the writing rule.

---

## Reference

Operational and reference material — how to change the system, the recurring vocabulary you'll meet across this document, and a working surface for AI agents that consume Chorus as context.

### Adapting Chorus

Chorus is intentionally editable. The editing rules below describe *how* to change a token; the governance rules that follow describe *who reviews*, *when changes ship*, and *how downstream consumers learn*. Together they keep the layered token model honest as it changes.

#### Editing rules

Six rules to apply when changing tokens, ordered by safety. Each rule names the tier you should edit at — reference, system, or component — so changes propagate predictably without breaking downstream consumers.

- **Rebrand at the reference tier, not the component tier.** If the brand shifts hue, edit `ref.palette.*` in [`schema/tokens/reference.json`](schema/tokens/reference.json). System roles (`sys.color.primary`, `sys.color.surfaceContainerHigh`, …) keep their names and their meaning; components keep working untouched.
- **Extend the system tier when a role is missing.** Add a new semantic token (e.g. `color.campaignAccent`, `space.threadRail`) rather than hardcoding values in components. **Document the new role in DESIGN.md *before* adding the JSON value** — undocumented tokens are tokens without intent.
- **Promote to the component tier only when reuse demands it.** Don't pre-emptively wrap every component in component-tier tokens; do so when a component is reused widely and its system-token composition recurs verbatim across surfaces (see [Token architecture](#token-architecture)). Otherwise, keep the composition inline at the system tier.
- **Prune what the service doesn't need.** If a role has no live use in the product and no clear future use, remove it — an unused token is a future mis-use. Remove its DESIGN.md entry first, then the JSON value.
- **Document the *why*, not the *what*.** The code already shows what a token is. DESIGN.md captures why it exists, which is what future maintainers actually need when deciding to add, modify, or remove it.
- **One system, many services.** Sub-brands and adjacent products can share the system tier (same component vocabulary, same interaction grammar) while swapping the reference tier (palette, type family) for their own identity.

#### Maturity stages

Every token, role, and component primitive carries one of four maturity stages, marked in DESIGN.md beside its first introduction:

- **Experimental** — newly added, expected to change. Product code may consume it but should expect breaking edits between minor versions. Default for any token less than a quarter old.
- **Stable** — proven across at least three real surfaces; changes follow the deprecation flow below. The default state for everything in DESIGN.md unless explicitly marked otherwise.
- **Deprecated** — superseded but still present, scheduled for removal. Carries a `**Deprecated:**` note pointing to its replacement. Removed in the next major version.
- **Removed** — the JSON entry and the DESIGN.md description are both gone. Removed entries leave a one-line tombstone in the changelog so a `git blame` from a downstream consumer surfaces the rationale.

Anything not marked is **stable**. Mark a token *experimental* explicitly when introducing it; mark *deprecated* the moment a replacement lands.

#### Change flow

Changes propagate in this order. Skipping a step is the most common source of drift.

1. **Propose in DESIGN.md.** Open a PR that edits the prose first — the role, rationale, and stage. The token JSON does not exist yet at this point.
2. **Review.** At least one design owner and one engineering owner sign off. Reviewers check: does the token clear the [Token architecture](#token-architecture) two-bar test? Does the name fit the existing vocabulary? Is the rationale specific?
3. **Land the JSON value** in the same PR or an immediate follow-up. A documented role with no value is acceptable for one merge cycle; longer than that and the doc rots.
4. **Communicate.** Add a CHANGELOG entry under the upcoming version, summarizing the change in one line and linking the PR.
5. **Adopt.** Product surfaces migrate at their own pace inside the version's deprecation window.

#### Versioning

Chorus follows **semantic versioning** at the token-system level:

- **Major** — any breaking change to a stable token: rename, removal, value shift large enough to break existing layouts (e.g. `space.200` from 16px to 12px). Major versions ship at most quarterly and bundle the migration of every deprecated token from the previous cycle.
- **Minor** — additive changes to stable tokens or any change to experimental tokens: new roles, new values inside an existing role's bounds, deprecations announcing a future removal. Ship as needed.
- **Patch** — internal-only fixes that don't affect emitted CSS values: documentation edits, JSON formatting, build pipeline tweaks. Ship freely.

A breaking change without a major version bump is a bug — fix the version, not the change.

#### Deprecation window

Deprecated tokens stay shipping for **at least one minor cycle** (~one quarter) before removal. The deprecation note in DESIGN.md spells out:

- What replaces the token.
- A one-line migration recipe (`var(--sys-color-emphasis)` → `var(--sys-color-primary)`).
- The version the removal is targeted for.

Removal moves the entry from "Deprecated" to a one-line tombstone in the version's CHANGELOG.

#### Ownership

DESIGN.md and `schema/tokens/*.json` have a single editor of record per cycle, named in the repo `README.md`. The editor is the tiebreaker on naming, vocabulary, and stage decisions; everyone else proposes, the editor merges. The role rotates so no one person owns the system long enough to grow stale.

### Glossary

A short reference to the Chorus-specific vocabulary that recurs across this document. Definitions are deliberately minimal — the section that introduces each term is the canonical source.

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

Chorus is designed to be ingested as a single canonical context by AI design agents (Claude Design, automation tools). This document is that context — pass it whole, alongside the JSON values in `schema/tokens/`, and the agent has everything it needs to produce on-system output. The three sections below are the working surface: a quick lookup table, example prompts in the system's vocabulary, and the iteration rules an agent should respect when proposing changes.

#### Quick token reference

The fastest mapping from common UI needs to system tokens — the agent's first lookup table.

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
| Categorical accent    | `color.tertiary`                                 | `#9333ea`           |
| Focus ring (outer)    | `color.focus`                                    | `#000000`           |
| Focus ring (inner)    | `color.focusInset`                               | `#ffffff`           |
| Card padding          | `layout.container.md`                            | 16 → 24px           |
| Page gutter           | `layout.page.md`                                 | 16 → 32px           |
| Section rhythm        | `layout.stack.lg`                                | 24 → 32px           |
| Control radius        | `radius.md`                                      | 8px                 |
| Surface radius        | `radius.xl`                                      | 16px                |
| Card shadow           | `elevation.raised`                               | two-layer ambient + spread |

#### Example component prompts

Reference prompts that resolve cleanly through the system tier — copy and adapt; the token vocabulary is the contract.

> "Build a primary button: `color.primary` background, `color.onPrimary` text, `radius.md` corners, `layout.container.sm` vertical padding and `layout.container.md` horizontal padding, `typo.label.md` for the label. On `:hover`, composite an 8% `onPrimary` overlay; on `:focus-visible`, apply the three-layer focus ring (see [Focus ring composition](#focus-ring-composition))."

> "Design a content card: `color.surfaceContainer` background, `radius.xl` corners, `elevation.raised` shadow, `layout.container.md` padding. Title in `typo.heading.md` `color.onSurface`; body in `typo.body.md` `color.onSurfaceVariant`. Stack title and body with `layout.stack.sm`."

> "Create a form field: `color.surfaceVariant` background, `radius.md` corners, `layout.container.sm` padding. Label above in `typo.label.sm` `color.onSurfaceVariant`. Border `1px solid color.outlineVariant`; on focus, full three-layer focus composition. Error state: border swaps to `color.error`, helper text uses `color.error` at `typo.caption.md`."

> "Build a notification banner using the primaryContainer pair: `color.primaryContainer` background, `color.onPrimaryContainer` text and icons, `radius.lg` corners, `layout.container.md` padding. Inline with `layout.inline.md` between icon and text. No shadow — containers stay flat."

#### Iteration rules

Guardrails to apply when iterating on agent-generated output.

1. Reach for `color.*` system tokens, never raw `palette.*` — palette steps are documentation-only.
2. Pair every accent fill with its `on*` foreground; never read contrast manually.
3. Use `layout.*` for layout-participating spacing; reserve raw `space.*` for fixed-footprint controls.
4. Default to `radius.md` for controls and `radius.xl` for surfaces — the size gap is the point.
5. State feedback is *foreground-over-base at state opacity*, never a hardcoded hover color.
6. The web step-up is automatic; do not branch on viewport for `layout.*`, `display.*`, or `heading.*`.
7. Pretendard is the only family — do not split fonts between Latin and Hangul.
