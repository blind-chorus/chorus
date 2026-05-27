# compose.md — composition cheatsheet

A 1-page lookup for the design-token decisions every screen runs into. Skim **before composing JSX**; pair with [`tokens.usage.json`](tokens.usage.json) (which token for which slot) and [`DESIGN.md`](DESIGN.md) (deep rationale). When this file and DESIGN.md disagree, DESIGN.md wins.

The recipes below answer the five compositional situations every product surface runs into. Not new tokens — every line resolves to a step in the standard `sys.*` ladder.

---

## Spacing recipes

### Page shell horizontal gutter

| Pick | When |
| --- | --- |
| **`sys.layout.page.md`** (16px) | Default for every ordinary app route (feed, settings, compose, detail). |
| `sys.layout.page.sm` (8px) | Dashboards / admin tables / dense multi-pane. |
| `sys.layout.page.lg` (24→40px) | Marketing / editorial / landing. |
| `sys.layout.page.xl` (40→64px) | Showcase heroes only. |

**Paid once at the page shell.** All **twelve full-bleed families** inherit it — `navigation-bar`, `tab-bar`, `tabs`, `section`, `feed`, `list`, `nav-card`, `banner`, `accordion`, `suggestion-list`, `avatar-rail`, `chip` (group). Never re-pay `padding-inline` on the child. See LOVABLE.md §A.4.

### Surface interior padding

| Pick | When |
| --- | --- |
| **`sys.layout.container.md`** (16px) | Default — card, list-row, sheet content, section horizontal padding. |
| `sys.layout.container.sm` (12px) | Button / input-field padding. Also the one-rung step-down for a child nested inside a `container.md` parent. |
| `sys.layout.container.xs` (8px) | Chip body, segmented-control items, dense list rows. |
| `sys.layout.container.lg` (24→32px) | Dialog body, feature-card callouts, primary dialog interiors. |
| `sys.layout.container.xl/2xl/3xl` | Hero / marketing only. |

**Nesting rule.** Parent at `container.md` → child at `container.sm` → grandchild at `container.xs`. Same direction across the tree — never invert, never skip rungs. A 16px parent with a 4px grandchild reads as compression, not hierarchy.

### Vertical sibling rhythm (`gap` between stacked siblings)

| Pick | When |
| --- | --- |
| **`sys.layout.stack.md`** (16px) | Default — paragraph↔paragraph, card↔card, item↔item within one section. |
| `sys.layout.stack.xs` (8px) | One tightly-bound group (bullet rows, metadata lines, cluster of fields about the same entity). Also section↔section separator when paddings alone don't separate them. |
| `sys.layout.stack.2xs` (4px) | Visually bonded pairs only — label↔input, title↔subtitle, caption↔parent text. Not for general content. |
| `sys.layout.stack.sm` (12px) | Form field↔field gap. |
| `sys.layout.stack.lg` (24→32px) | Distinct content groups within a section — heading block↔body block, form group↔submit cluster. |
| `sys.layout.stack.xl` (32→40px) | Page-section break — strong content break, still one scroll region. |

**Apply on the shared parent via `gap`** (`flex-direction: column; gap: var(--sys-layout-stack-md)`). Never `margin-top` per child.

### Horizontal sibling rhythm

| Pick | When |
| --- | --- |
| **`sys.layout.inline.md`** (12→16px) | Default — button group, inline action cluster, icon button row. |
| `sys.layout.inline.sm` (8px) | Chip↔chip in a filter row, dense action cluster. |
| `sys.layout.inline.xs` (4px) | Glyph↔label inside a tight control. |
| `sys.layout.inline.lg` (12→16px) | Spacious inline pair, header trailing-action cluster. |
| `sys.layout.inline.xl/2xl` | Toolbar cluster / marketing pair. |

---

## Color quartet picker

Color tokens come in **four-token quartets** — `<role>` and `<role>Container` fills, each paired with `on<Role>` and `on<Role>Container` foregrounds. **Never split the pair.**

| Surface intent | Fill | Foreground |
| --- | --- | --- |
| **Page / card / list row / feed item** | `sys.color.surface` | `sys.color.onSurface` (primary text) + `sys.color.onSurfaceVariant` (meta text) |
| **Primary commit / link / active selection** | `sys.color.primary` | `sys.color.onPrimary` |
| **Soft primary tint (info banner, filter chip selected)** | `sys.color.primaryContainer` | `sys.color.onPrimaryContainer` |
| **Editorial / promotional / FAB** | `sys.color.brand` | `sys.color.onBrand` |
| **Soft brand tint (promotional callout)** | `sys.color.brandContainer` | `sys.color.onBrandContainer` |
| **Success state / positive metric** | `sys.color.success` | `sys.color.onSuccess` |
| **Destructive commit / error state** | `sys.color.error` | `sys.color.onError` |
| **Search input bar fill** | `sys.color.surfaceContainerLow` | `sys.color.onSurface` |
| **Banner / cover band / image-area underlay** | `sys.color.surfaceContainerHigh` | `sys.color.onSurface` |
| **Toast** | `sys.color.inverseSurface` | `sys.color.inverseOnSurface` |
| **Dialog / BottomSheet scrim** | `sys.color.scrim` | n/a (decorative) |
| **Card outline / list-row divider** | n/a (stroke) | `sys.color.outlineVariant` |
| **Form-field active stroke / high-emphasis divider** | n/a (stroke) | `sys.color.outline` |

---

## Type ramp picker — by surface intent

| Surface | Ramp |
| --- | --- |
| **Page-level title** (Home navigation-bar title, top-region heading) | `sys.typo.heading.lg` (24→32px) |
| **Section / card title** (Section label, Feed.title, Job card title) | `sys.typo.heading.md` (20px) |
| **Sub-section heading inside a card** | `sys.typo.heading.sm` (16px) |
| **Single-topic body** (article, post detail, long-form description) | `sys.typo.body.md` (16px) |
| **Mixed-group body** (settings page, compact feed item descriptions, card listing several short blocks) | `sys.typo.body.sm` (14px) |
| **Primary button label / tab label** | `sys.typo.label.lg` (16px) |
| **List-row primary label / chip label** | `sys.typo.label.md` (14px) |
| **Meta line / supporting label / counter** | `sys.typo.label.sm` or `sys.typo.caption.md` (12px) |
| **Article / figure caption / footnote** | `sys.typo.caption.md` (12px) |

**Body-size rule of thumb**: single-topic page → `body.md`. Second peer text group joins → drop to `body.sm`.

## Type ramp picker — by component slot

When composing a specific component, this table is more specific than the intent table above — pick the exact slot rather than reasoning about intent.

| Component slot | Ramp | Weight |
| --- | --- | --- |
| `navigation-bar/home.title` (page-level wordmark) | `sys.typo.heading.lg` | 600 Semibold |
| `navigation-bar/page.title` (centered title in drill-in) | `sys.typo.heading.md` | 600 Semibold |
| `section.label` (Section header) | `sys.typo.label.lg` | 600 Semibold |
| `section.headerAction` (See all link) | `sys.typo.label.md` | 500 Medium |
| `feed/post.title` (post headline) | `sys.typo.heading.md` | 600 Semibold |
| `feed/post.body` (post body preview, 2-line clamp) | `sys.typo.body.md` | 400 Regular |
| `feed/post.meta` (channel · time) | `sys.typo.caption.md` | 400 Regular |
| `feed/post.author.name` | `sys.typo.label.md` | 600 Semibold |
| `feed/post.engagement.count` (likes / comments / views) | `sys.typo.label.sm` | 400 Regular |
| `list/text.primary` (row primary label) | `sys.typo.body.md` | 400 Regular |
| `list/nav.supporting` (row supporting text) | `sys.typo.caption.md` | 400 Regular |
| `button/standard.label` | `sys.typo.label.lg` | 600 Semibold |
| `button/text.label` | `sys.typo.label.md` | 500 Medium |
| `chip.label` (filter / tag) | `sys.typo.label.md` | 500 Medium |
| `tab/underline.label` (top-tab label) | `sys.typo.label.md` | 600 Semibold (active) / 500 Medium (rest) |
| `tab-bar.item.label` (bottom-tab label) | `sys.typo.label.sm` | 500 Medium |
| `form-field.label` | `sys.typo.label.md` | 500 Medium |
| `form-field.input.value` | `sys.typo.body.md` | 400 Regular |
| `form-field.helperText` | `sys.typo.caption.md` | 400 Regular |
| `banner.title` | `sys.typo.label.lg` | 600 Semibold |
| `banner.body` | `sys.typo.body.sm` | 400 Regular |
| `toast.body` | `sys.typo.label.md` | 500 Medium |
| `dialog.title` | `sys.typo.heading.sm` | 600 Semibold |
| `dialog.body` | `sys.typo.body.md` | 400 Regular |
| `badge.label` (numeric / text) | `sys.typo.label.sm` | 600 Semibold |
| `suggestion-list.row.name` | `sys.typo.label.md` | 600 Semibold |
| `suggestion-list.row.followers` | `sys.typo.caption.md` | 400 Regular |

**Avoid the under-12px trap.** Agents often default to 11-13px for "compact" copy — that breaks Korean / CJK hierarchy. When unsure, take the next-larger rung. The smallest rung for *visible* copy is 12px (`caption.md` / `label.sm`); below is reserved for legal / aux.

---

## Composition guard rails (hard one-liners)

DESIGN.md rules condensed to a single line each. Read as **immediate-reject** triggers when reviewing your own output.

1. **Brand red is an accent marker, never a surface.** No `navigation-bar` chrome paints brand. No banner background paints brand (use `primaryContainer` for info, `surfaceContainerLow` / `secondaryContainer` for promotional). Brand instances per screen ≤ 3 — canonically: Create tab item (1), feed active-like (≤2), optional promotional banner accent (1). See [`tokens.usage.json#sys.color.brand`](tokens.usage.json).
2. **Card outlines: `outlineVariant` hairline as inset shadow** (or `::after` overlay when the card hosts a full-bleed child). **Never `border:` on a card.** A `border` reflows the box; an inset shadow / overlay does not. The reflow is the bug.
3. **List rows: only `outlineVariant` divider between rows.** No per-row `border`. The list owns the seam, the row owns the click target.
4. **Surface tier ≤ 2 levels per screen.** `surface` plus one `surface*Container` rung is the cap. A third nested surface tone reads muddy — promote one to a different family (Banner, Card, Section header) instead of layering.
5. **Chip / pill / avatar radius is always `radius.full`.** A 4px-rounded "chip" is a card; pick one component. Likewise a 999-rounded "card" reads as a chip.
6. **Banner role decides the fill.** Informational → `sys.color.primaryContainer`. Promotional → `sys.color.surfaceContainerLow` (with optional brand accent on the leading icon, *not* the background). Error notice → `sys.color.errorContainer`. **`brandContainer` is reserved for promotional tinted strips, not default banners.**
7. **Page inset is paid once at the page shell.** Every `full-bleed` family (Section, List, Feed, Banner, AvatarRail, Chip group, NavigationBar, TabBar, Tabs, SuggestionList) stretches edge-to-edge. See `family.json#layoutInset`.
8. **Nesting tightens, never widens.** Parent `container.md` → child `container.sm` → grandchild `container.xs`. Inverting reads as compression, not hierarchy.
9. **Spec slot grammar is closed.** If a slot is not declared in `spec.json#slots`, it does not exist. Do not synthesize new slots, do not pass `className` / `style` overrides.
10. **FAB count ≤ 1 per screen.** Create is the single canonical commit — additional FABs dilute the affordance.

---

## Radius picker

| Shape | Pick |
| --- | --- |
| **Card / banner / dialog body / Feed item / Section card** | `sys.radius.md` (8px) |
| **BottomSheet top corners / toast pill / large dialog** | `sys.radius.lg` (12px) |
| **Poll option row / list radio / tag pill** | `sys.radius.sm` (4px) |
| **Chip outer / pill button / circular Thumbnail / avatar** | `sys.radius.full` |
| **Hero surface** | `sys.radius.xl` / `2xl` |

---

## Stroke + elevation picker

| Slot | Pick |
| --- | --- |
| **Card outline / list-row divider / form-field rest stroke** | `sys.borderWidth.hairline` (1px) × `sys.color.outlineVariant` |
| **Form-field active / focus ring outer** | `sys.borderWidth.thin` (2px) × `sys.color.outline` or `sys.color.focus` |
| **Cards at rest / hovered list rows** | `sys.elevation.raised` |
| **FAB / floating menu / dropdown** | `sys.elevation.floating` |
| **Dialog / modal / popover above scrim** | `sys.elevation.overlay` |
| **BottomSheet** | `sys.elevation.sheet` (shadow projects upward) |

---

## Quick decision flow when composing a new surface

1. **What lives on it?**
   - Authored content (post body, article) → Feed / Section
   - Menu / settings / picker rows → List
   - Editorial collection → Section + carousel sub
   - Page-level chrome → NavigationBar / TabBar
2. **What's the surface fill?** Pick from the [color quartet picker](#color-quartet-picker) by intent.
3. **What's the interior padding?** Default `container.md`; tighten one rung per level of nesting.
4. **What's the vertical rhythm to siblings?** Default `stack.md`; tighten to `stack.xs` for one-bound-group; widen to `stack.lg` for distinct groups.
5. **What's the corner radius?** Default `radius.md`; pill / chip → `radius.full`; large sheet → `radius.lg`.
6. **Edge stroke (if any)?** `borderWidth.hairline × outlineVariant`. If the surface hosts an opaque full-bleed child (cover image, hero), promote the outline to a `::after` overlay layer (DESIGN.md § Border & stroke).

If a step has no good match — that's a **Chorus gap**, not a license to invent. Flag in one line and stop.
