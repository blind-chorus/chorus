# Search

The search top bar — anchored to a dedicated search page reached from a [Home](./home.md) or [Page](./page.md) bar's search trigger. Owns the entire search affordance: leading back-arrow Icon Button, single bare-text input filling the row, conditional trailing clear (×). Drops the centred title — the input *is* the focus.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell. The bar pays its own `16px inline` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

At rest with an empty field. Placeholder paints in `outline`; the clear (×) stays hidden until a value lands.

```preview
navigation-bar/search/default
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar variant="search" placeholder="Search by keyword" onBack={() => {}} />
```

## Use cases

### With value (clear visible)

A non-empty value swaps placeholder for `onSurface` text and reveals the trailing clear (×) at the medium 32 × 32 capsule — smaller than the leading back-arrow so it never out-shouts the input. Clicking clear wipes the value, returns focus to the input, and the trailing column collapses; the input's leading edge stays pixel-stable.

```preview
navigation-bar/search/with-value
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar
  variant="search"
  placeholder="Search by keyword"
  defaultValue="lighting"
  onBack={() => {}}
/>
```

## Slots

- **leading** — required. 24px back-arrow icon as the canonical [Icon Button](../button/icon.md) capsule (40 × 40 transparent, 24px glyph).
- **input** — required. Single-line **bare** text input filling the leftover middle column. *Bare* means no border, no background, no inset stroke — not a [Search bar](../form-field/search.md) field. Renders value in `sys.color.onSurface`, placeholder in `sys.color.outline` (`typo.body.md`, 16/Regular). Caret follows the [system caret rule](../../DESIGN.md#caret).
- **trailing** *(conditional)* — clear (×) [Icon Button](../button/icon.md) hosting `XCircleFillIcon`. **Always uses Icon Button's `medium` size** (32 × 32 capsule, 16px glyph) so it never over-claims weight against the bare input. Rendered only when value is non-empty; wipes value and returns focus to the input.

## Anatomy

Three-column grid (leading / input / trailing) — side columns size to content, input column takes `minmax(0, 1fr)`. When the trailing column collapses (clear hidden), the input column expands; the field never reflows its leading edge.

| Slot                  | Container                                                                               | Color                                                                          |
|-----------------------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Bar container**     | `sys.color.surface` fill, 8px block / 16px inline padding, no shadow at rest, **1px bottom divider in `sys.color.outlineVariant`** painted as inset `box-shadow`. | —                                                                              |
| **Leading**           | Transparent Icon Button capsule (8 padding around 24px glyph).                           | `sys.color.onSurface`                                                          |
| **Input**             | Bare text — no border, no background, no inset stroke.                                   | Value: `sys.color.onSurface`. Placeholder: `sys.color.outline`. Caret: `sys.color.primary`. |
| **Trailing (clear)**  | Transparent Icon Button **medium** capsule (32 × 32, 16px glyph).                        | `sys.color.onSurface`                                                          |

The 1px bottom divider (unique to Search) keeps the bare input from bleeding into the results list below; painted as inset `box-shadow` so it never participates in layout.

## Sizes

A single fixed rung. Same geometry as Page.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Container padding (block × inline)| 8 × 16               | `sys.layout.container.xs` × `sys.layout.container.md` |
| Min-height                        | 56px                 | raw                                |
| Slot gap (between slots)          | 16px                 | `sys.layout.inline.xl`             |
| Icon-capsule padding              | 8px                  | `sys.layout.container.xs`          |
| Input text                        | 16 / Regular         | `sys.typo.body.md`                 |
| Leading icon                      | 24px                 | `sys.icon.lg`                      |
| Trailing (clear) icon             | 16px (32 × 32 capsule)| `sys.icon.md` ‡                   |

‡ Clear button uses Icon Button's `medium` size, not `xlarge` — clear is a secondary affordance to typing.

## States

The bar has no interactive state of its own. Leading and trailing inherit [Icon Button](../button/icon.md)'s recipe. The input follows the **bare-text-field shape** — only the caret and placeholder ↔ value colour swap signal interaction; no overlay because the field has no chrome to tint.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Caret hidden. Empty → placeholder in `outline`; value → `onSurface`.        |

**No `disabled` state.** The Search variant deliberately omits one. The only screen a `navigation-bar/search` ever lives on is the search results page itself, and a non-typable search bar on that page reduces the surface to a dead chrome strip with no escape affordance beyond the back-arrow. If search must be gated (offline, throttled, paused indexing), gate the *trigger* on the prior screen instead and never route into this bar.

## Focus indicator

Caret paints per the [system caret rule](../../DESIGN.md#caret). Field has no focus-ring of its own — the bar *is* the page's focus; browser's default focus stays as accessibility floor. Trigger: `:focus-visible`.

## Behavior

- **Submit on Enter.** Fires `onSubmit(value)`; wrapping `<form>` submits.
- **Clear visibility.** Clear button in DOM only when value is non-empty. Click sets value to `''`, returns focus, fires `onChange('')`.
- **Escape key.** Clears non-empty value before firing `onBack` on empty — matches platform convention.
- **Back affordance.** Leading back-arrow fires `onBack`. Host owns routing.
- **Auto-focus.** `autoFocus` defaults to `true` — set `false` for hydrated queries the user is reviewing.
- **IME.** Handles composition normally — `onChange` on every keystroke; `onSubmit` only on real Enter (not IME-confirm Enter).
