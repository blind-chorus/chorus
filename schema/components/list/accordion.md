# Accordion

Expandable-row List sub-component. Each item exposes a List-row trigger (label + auto-rendered trailing chevron that rotates `180°` on expand) and a content body that paints below it when open. Rows tile flush with the family-wide hairline `outlineVariant` divider between them; an additional hairline rule paints between the open trigger and its child row group.

**Reach for this when** a list of titled sections is too long to keep open at once — FAQs, T&C sections, expandable filter groups, settings groups with infrequent edits, hierarchical menus (companies → channels, regions → cities, categories → entries). **Skip when** the bodies are short enough to read inline (use [Section](../section/section.md) per group), the user needs to act on the labels rather than read into them (use [List/nav](./nav.md) or [List/radio](./radio.md)), or every item should be visible at once with no toggle (stack [Section](../section/section.md)s).

Row geometry, label typography, divider, state overlays, and inward focus ring all delegate to the [family-wide rules](./list.md); this sub documents only the expand/collapse contract and the top group-divider that separates the open trigger from its child rows.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge. Each row pays its own `16px inline / 8px block` padding via `layout.container.*`. Do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div — the page rail will double-pay. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

The single-mode form. One item open at a time; clicking an open item collapses it (`collapsible={true}` by default).

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

`type="multiple"` lets the user open any number of items at once. Use when rows are independent and the user reads across several — comparing T&C clauses, expanding filter groups, reviewing policy sections.

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

### Nested list

When the expanded body holds a same-kind row group rather than prose — directory sub-entries, settings sub-options, filter children, menu sub-items — drop a `<List>` straight into the content slot with `embedded={true}` so the list defers its own chrome to the host. The content body paints a hairline `outlineVariant` divider at the TOP of the child group (inset 16px on both inline edges, matching the inter-item divider rule) so the parent trigger and the child rows read as a parent ↔ child hierarchy, not as one tiled stack.

```preview
accordion/nested-list
---
import { Accordion, List } from '@blind-dsai/ui';

<Accordion type="single" defaultValue="invest-cast" aria-label="Company directory">
  <Accordion.Item value="invest-fund" label="Invest Fund">
    <List
      variant="text"
      embedded
      aria-label="Invest Fund roles"
      items={[
        { value: 'invest-fund-analyst',    label: 'Invest Fund + Analyst' },
        { value: 'invest-fund-associate',  label: 'Invest Fund + Associate' },
        { value: 'invest-fund-partner',    label: 'Invest Fund + Partner' },
      ]}
    />
  </Accordion.Item>
  <Accordion.Item value="invest-cast" label="Invest Cast">
    <List
      variant="text"
      embedded
      aria-label="Invest Cast roles"
      items={[
        { value: 'invest-cast-acctg',      label: 'Invest Cast + Acctg' },
        { value: 'invest-cast-admin',      label: 'Invest Cast + Admin' },
        { value: 'invest-cast-biz-dev',    label: 'Invest Cast + Biz Dev' },
        { value: 'invest-cast-consultant', label: 'Invest Cast + Consultant' },
        { value: 'invest-cast-creative',   label: 'Invest Cast + Creative' },
      ]}
    />
  </Accordion.Item>
  <Accordion.Item value="invest-financial" label="INVEST Financial Corporation">
    <List
      variant="text"
      embedded
      aria-label="INVEST Financial Corporation roles"
      items={[
        { value: 'invest-fin-advisor',   label: 'INVEST Financial + Advisor' },
        { value: 'invest-fin-compliance',label: 'INVEST Financial + Compliance' },
        { value: 'invest-fin-ops',       label: 'INVEST Financial + Ops' },
      ]}
    />
  </Accordion.Item>
</Accordion>
```

### Disabled item

A `disabled` row fades to `sys.state.disabled` opacity and ignores click / keyboard activation. Stays in the DOM so surrounding items keep their stable index.

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
- **item** — single expandable row. Hairline `outlineVariant` divider inset 16px (`layout.container.md`) on **both** the leading and trailing edges, painted as an absolutely-positioned `::after` overlay on every row except the last — matching the family-wide List row divider rule.
- **trigger** — header button. Holds the label and the auto-rendered trailing chevron. Same geometry as a List row (48px min-height, 8px block / 16px inline padding). `aria-expanded` reflects open-state, `aria-controls` references the content region.
- **label** — trigger label. **`16px / Regular / onSurface`** — matches the List family `label` spec exactly so the trigger reads as a List row that happens to expand. Wraps to a second line; no truncation.
- **chevron** — auto-rendered 16px `ChevronDownIcon`. Rotates from `0°` to `180°` over 120ms `ease-out` on expand. Decorative.
- **content** — body region. Paints below the trigger when open; toggled via the `hidden` attribute when closed. **Indented an extra 16px on the leading edge** so the body reads as nested INSIDE the trigger's label column (total inline padding: `32px leading / 16px trailing`). Carries a `min-height: 40px` so short single-line bodies keep a touch-target rhythm. When the body hosts a child row group (`<List embedded>`), a hairline `outlineVariant` divider paints at the TOP of the body via a `::before` overlay (inset 16px on both inline edges) so the parent trigger and the child rows read as a parent ↔ child hierarchy. Prose bodies omit the top divider — the leading indent alone communicates nesting.

## Anatomy

| Slot          | Token bindings |
|---------------|----------------|
| container     | Transparent fill, no padding (full-bleed, edge-to-edge) |
| item          | Hairline `outlineVariant` divider inset 16px on both inline edges, omitted on the last row — family-wide List divider |
| trigger       | 48px min-height, 8px block / 16px inline padding, full-row click target |
| label         | **`16 / Regular`, `onSurface`** — matches the List `label` spec |
| chevron       | 16 × 16, `onSurfaceVariant`, rotates 0° → 180° over 120ms `ease-out` |
| content       | 8px block padding, `32px leading / 16px trailing` inline padding (one extra `layout.container.md` of inset to read as nested), `min-height: 40px`, `16 / Regular` at `onSurfaceVariant` |
| divider       | `sys.borderWidth.hairline` × `sys.color.outlineVariant`, inset 16px on both inline edges via `::after` overlay |
| groupDivider  | `sys.borderWidth.hairline` × `sys.color.outlineVariant`, inset 16px on both inline edges via `::before` overlay on the content body, painted ONLY when the body hosts a `<List embedded>` child group |

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

- **Edge-to-edge composition.** `layoutInset: full-bleed` — direct child of the page shell. Wrapping in another `padding-inline` / `px-*` div double-pays the rail. Use the negative-margin opt-out inside a bounded surface.
- **Inset divider.** 1px `outlineVariant` rule inset 16px on both inline edges so it reads as separating row *content*, not the container — same as every other List sub.
- **Indented content.** Expanded body sits one extra 16px in from the trigger's label edge for parent ↔ child hierarchy.
- **Child list groups carry a top divider.** When the open body hosts a `<List embedded>`, a hairline `outlineVariant` rule paints at the top edge of the body (inset 16px on both edges) so the parent trigger and the child list rows read as parent ↔ child — never one tiled stack. Prose bodies omit the rule (the leading indent is enough).
- **Whole trigger header is the click target.** Chevron is decorative.
- **Element swap.** Trigger is `<button>`; content region is `<div role="region">` with `hidden` toggled.
- **Keyboard.** Space / Enter toggle. Arrow up/down moves focus between triggers.
- **Single mode.** Opening one item closes the previously open one. With `collapsible={true}` (default), clicking the open item closes it.
- **Multiple mode.** Each trigger toggles independently. `value` is a `string[]`.
- **Wrap, not truncate.** Trigger labels wrap to a second line; the row grows.
- **Content min-height.** Open content carries a `40px` floor so short bodies read as a distinct expanded row.
- **Reduced motion.** Chevron rotation snaps instantly under `prefers-reduced-motion: reduce`.
