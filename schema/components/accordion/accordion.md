# Accordion

A vertical stack of expandable rows. Each item exposes a trigger header (label + auto-rendered trailing chevron that rotates `180°` on expand) and a content body that paints below it when open. Rows tile flush with a hairline `outlineVariant` divider between them.

**Reach for this when** a list of titled sections is too long to keep open all at once — FAQs, T&C sections, an expandable filter group, a settings group with infrequent edits, or long-form content carved into scannable pieces. **Skip when** the section bodies are short enough to read inline (use a [Section](../section/section.md) per group instead, leaving the bodies open), the user needs to act on the labels rather than read into them (use a [List/nav](../list/nav.md) for drill-in or a [List/radio](../list/radio.md) for single-select), or every item should be visible at once with no toggle (just stack [Section](../section/section.md)s).

**Layout inset.** `full-bleed` — Accordion is an **edge-to-edge** family. It sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. Each row pays its own `16px inline / 8px block` padding via `layout.container.*`. When composing a screen out of Chorus families, do **not** wrap the Accordion in another `padding-inline` / `px-*` / `style={{ padding: … }}` div — the page rail will double-pay and the Accordion's rows will land at a different inset than the section headings and list rows around it. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

The single-mode form. One item open at a time; clicking an open item collapses it (`collapsible={true}` by default), so the stack can rest with everything closed.

```preview
accordion/default
---
import { Accordion } from '@blind-dsai/ui';

<Accordion type="single" defaultValue="why" aria-label="Frequently asked questions">
  <Accordion.Item value="why" label="Why does Blind anonymise posts?">
    Anonymity is the only way employees can compare salaries, escalate misconduct, or ask candid culture questions without retaliation. Verified company badges keep the channel trustworthy without unmasking the author.
  </Accordion.Item>
  <Accordion.Item value="verify" label="How is my company verified?">
    Sign up with your corporate email — the verification code lands in your inbox, never on a public profile. Once verified, the badge persists across job changes (we re-verify when you update your employer).
  </Accordion.Item>
  <Accordion.Item value="data" label="What can other users see?">
    Other users see your company badge, your career stage, and the content you post. Your email, name, and exact title are never exposed.
  </Accordion.Item>
</Accordion>
```

## Use cases

### Multiple

`type="multiple"` lets the user open any number of items at once. Use it when the rows are independent and the user is likely to read across several at the same time — comparing T&C clauses, expanding several filter groups, reviewing multiple policy sections.

```preview
accordion/multiple
---
import { Accordion } from '@blind-dsai/ui';

<Accordion type="multiple" defaultValue={['salary', 'tenure']} aria-label="Active filters">
  <Accordion.Item value="salary" label="Compensation">
    Filter posts by salary range, equity, sign-on bonus.
  </Accordion.Item>
  <Accordion.Item value="tenure" label="Tenure">
    Filter authors by years at current company.
  </Accordion.Item>
  <Accordion.Item value="role" label="Role">
    Filter by IC level, manager track, or specialty.
  </Accordion.Item>
</Accordion>
```

### Disabled item

A single `disabled` row fades to `sys.state.disabled` opacity and ignores click / keyboard activation. The row stays in the DOM so the surrounding items keep their stable index — useful when an item is temporarily gated.

```preview
accordion/disabled-item
---
import { Accordion } from '@blind-dsai/ui';

<Accordion type="single" aria-label="Account settings">
  <Accordion.Item value="profile" label="Profile">
    Display name, avatar, bio.
  </Accordion.Item>
  <Accordion.Item value="billing" label="Billing" disabled>
    Available for verified enterprise accounts only.
  </Accordion.Item>
  <Accordion.Item value="notifications" label="Notifications">
    Email, push, and in-app notification preferences.
  </Accordion.Item>
</Accordion>
```

## Slots

- **container** — outer stack. Transparent fill so the host surface tone reads through. `role="region"` carries the accordion's accessible name (`aria-label`).
- **item** — single expandable row. Hairline `outlineVariant` divider inset 16px (`layout.container.md`) on **both** the leading and trailing edges, painted as an absolutely-positioned `::after` overlay on every row except the last.
- **trigger** — header button. Holds the label and the auto-rendered trailing chevron. `aria-expanded` reflects open-state, `aria-controls` references the content region.
- **label** — trigger label. `body.sm` / Semibold / `onSurface`. Wraps to a second line; no truncation.
- **chevron** — auto-rendered 16px `ChevronDownIcon`. Rotates from `0°` to `180°` over 120ms `ease-out` on expand. Decorative.
- **content** — body region. Paints below the trigger when open; toggled via the `hidden` attribute when closed. **Indented an extra 16px on the leading edge** so the body reads as nested INSIDE the trigger's label column (total inline padding: `32px leading / 16px trailing`). Carries a `min-height: 40px` so short single-line bodies keep a touch-target rhythm.

## Anatomy

| Slot          | Token bindings |
|---------------|----------------|
| container     | Transparent fill, no padding (full-bleed, edge-to-edge) |
| item          | Hairline `outlineVariant` divider inset 16px on both inline edges, omitted on the last row |
| trigger       | 48px min-height, 8px block / 16px inline padding, full-row click target |
| label         | `sys.typo.body.sm` (14 / Semibold), `onSurface` |
| chevron       | 16 × 16, `onSurfaceVariant`, rotates 0° → 180° over 120ms `ease-out` |
| content       | 8px block padding, `32px leading / 16px trailing` inline padding (one extra `layout.container.md` of inset to read as nested), `min-height: 40px`, `sys.typo.body.sm` (14 / Regular) at `onSurfaceVariant` |
| divider       | `sys.borderWidth.hairline` × `sys.color.outlineVariant`, inset 16px on both inline edges via `::after` overlay |

## Appearance

A single appearance — Accordion paints no fill of its own and offers no emphasis axis. The host surface tone reads through every row. Wrap the Accordion in a [Section](../section/section.md) when it needs its own labelled region.

## States

| State      | Overlay                       | Additional |
|------------|-------------------------------|------------|
| `default`  | —                             | Trigger paints at rest. |
| `hovered`  | label tone at `sys.state.hover`   | Overlay paints across the trigger row only (not the open content). |
| `pressed`  | label tone at `sys.state.pressed` | Overlay deepens; no other shift. |
| `disabled` | overlay suppressed            | Whole item at `sys.state.disabled` opacity; `pointer-events: none`. |

## Focus indicator

Inward 3-layer ring painted inside the trigger's footprint via a `::before` overlay. Trigger: `:focus-visible`. Composition rationale: items tile flush with only a hairline `outlineVariant` divider between them, so an outward ring would overlap the divider and the neighbouring row — see [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Behavior

- **Edge-to-edge composition.** Accordion is `layoutInset: full-bleed`. Compose screens so the Accordion is a direct child of the page shell (or a surface that already pays the page gutter). Wrapping it in another `padding-inline` / `px-*` div double-pays the rail and the rows land off-grid from the section headings and list rows around them. Use the negative-margin opt-out inside a bounded surface (Card / Dialog / BottomSheet).
- **Inset divider.** The 1px `outlineVariant` rule between items is inset 16px on both inline edges so it reads as separating row *content*, not the container.
- **Indented content.** The expanded body sits one extra 16px in from the trigger's label edge so the parent ↔ child hierarchy is readable at a glance.
- **Whole trigger header is the click target.** The chevron is decorative.
- **Element swap.** Each trigger is a `<button>`; the content region is a `<div role="region">` with the `hidden` attribute toggled.
- **Keyboard.** Space / Enter toggle. Arrow up/down moves focus between triggers.
- **Single mode.** Opening one item closes the previously open one. With `collapsible={true}` (default), clicking the open item closes it.
- **Multiple mode.** Each trigger toggles its own item independently. `value` is a `string[]`.
- **Wrap, not truncate.** Trigger labels wrap to a second line when long — the row grows. Truncation would hide the affordance from being scannable.
- **Content min-height.** Open content carries a `40px` floor so short single-line bodies still read as a distinct expanded row rather than as a flicker below the trigger.
- **Reduced motion.** The chevron rotation snaps instantly under `prefers-reduced-motion: reduce`.
