# Search

The search top bar — anchored to a dedicated search page reached from a [Home](./home.md) or [Page](./page.md) bar's search trigger. The bar owns the entire search affordance: leading back-arrow Icon Button, a single bare-text input filling the row, and a conditional trailing clear (×). Drops the centred title slot — the input *is* the focus.

## Default

The bar at rest. Type into the input to watch the placeholder ↔ value colour swap and the clear (×) reveal.

```preview
navigation-bar/search/default
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar variant="search" placeholder="Search by keyword" onBack={() => {}} />
```

## Slots

- **leading** — Required. 24px back-arrow icon as the canonical [Icon Button](../button/icon.md) capsule (40 × 40 transparent, 24px glyph).
- **input** — Required. Single-line **bare** text input filling the leftover middle column. *Bare* means no border, no background, no inset stroke — not a [Search Bar](../form-field/search.md) field. Renders value in `sys.color.onSurface`, placeholder in `sys.color.outline` (`typo.body.md`, 16/Regular). Caret follows the [system caret rule](../../DESIGN.md#caret).
- **trailing** (conditional) — Clear (×) [Icon Button](../button/icon.md) hosting `CloseCircleFillIcon`. **Always uses Icon Button's `medium` size** (32 × 32 capsule, 16px glyph) — keeps it from over-claiming weight against the bare input. Rendered only when value is non-empty; wipes the value and returns focus to the input.

## Anatomy

| Slot                  | Container                                                                               | Color                                                                          |
|-----------------------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Bar container**     | `sys.color.surface` fill, 8px block / 16px inline padding, no shadow at rest, **1px bottom divider in `sys.color.outlineVariant`** painted as inset `box-shadow`. | —                                                                              |
| **Leading**           | Transparent Icon Button capsule (8 padding around 24px glyph).                           | `sys.color.onSurface`                                                          |
| **Input**             | Bare text — no border, no background, no inset stroke.                                   | Value: `sys.color.onSurface`. Placeholder: `sys.color.outline`. Caret: `sys.color.primary`. |
| **Trailing (clear)**  | Transparent Icon Button **medium** capsule (32 × 32, 16px glyph).                        | `sys.color.onSurface`                                                          |

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

## Layout

Three-column grid (leading / input / trailing) — side columns `auto`, input column `minmax(0, 1fr)`. When the trailing column collapses (clear hidden), the input column expands; the field never reflows its leading edge — caret stays pixel-stable.

The bar omits a title slot — the placeholder names the field's intent. The 1px bottom divider (unique to Search) keeps the bare input from bleeding into the results list below; painted as inset `box-shadow` so it never participates in layout.

## States

The bar has no interactive state of its own. Leading and trailing inherit [Icon Button](../button/icon.md)'s recipe. The input follows the **bare-text-field shape** — only the caret and placeholder ↔ value colour swap signal interaction; no overlay because the field has no chrome to tint.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Caret hidden. Empty → placeholder in `outline`; value → `onSurface`.        |
| `disabled` | overlay suppressed         | Bar at `sys.state.disabled` (40%) opacity, clear suppressed, caret hidden.   |

## Focus indicator

Caret paints per the [system caret rule](../../DESIGN.md#caret). Field has no focus-ring of its own — the bar *is* the page's focus; browser's default focus stays as accessibility floor. Trigger: `:focus-visible`.

## Behavior

- **Submit on Enter.** Fires `onSubmit(value)`; wrapping `<form>` submits.
- **Clear visibility.** Clear button in DOM only when value is non-empty. Click sets value to `''`, returns focus, fires `onChange('')`.
- **Escape key.** Clears non-empty value before firing `onBack` on empty — matches platform convention.
- **Back affordance.** Leading back-arrow fires `onBack`. Host owns routing.
- **Auto-focus.** `autoFocus` defaults to `true` — set `false` for hydrated queries the user is reviewing.
- **IME.** Handles composition normally — `onChange` on every keystroke; `onSubmit` only on real Enter (not IME-confirm Enter).
