#!/usr/bin/env node
// Build `tokens.usage.json` — a machine-readable index every external
// agent (Lovable, Cursor, Claude Design) can read in a single hop to
// pick the right `sys.*` token for a given UI situation.
//
// `resolved.{light,dark,web}.json` carry only `path → { $value, $type }`
// — values, no semantics. `DESIGN.md` carries the semantics but at
// 1300 lines of prose; an agent has to grep across multiple sections
// just to confirm "stack.md = 16px = default card↔card rhythm". This
// file collapses the lookup: one read, one entry per agent-pickable
// token, with `role` + `usedFor` + `notFor` so the agent can both pick
// AND reject. Authored — DESIGN.md remains the human-readable canon,
// `tokens.usage.json` is the agent-readable distillation.
//
// Output: schema/tokens/tokens.usage.json. Shipped through
// `@blind-dsai/ui/agents/tokens.usage.json` via copy-agents.mjs.
//
// Usage: node schema/tokens/build-usage.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = __dirname;
const OUT = resolve(TOKENS_DIR, "tokens.usage.json");

const light = JSON.parse(readFileSync(resolve(TOKENS_DIR, "resolved.light.json"), "utf8"));
const dark = JSON.parse(readFileSync(resolve(TOKENS_DIR, "resolved.dark.json"), "utf8"));
const web = JSON.parse(readFileSync(resolve(TOKENS_DIR, "resolved.web.json"), "utf8"));

// Hand-curated metadata. Keep entries short — the agent skim-reads
// these to make a pick. The DESIGN.md anchor stays the canon for
// deep dives.
const META = {
  // ============================== LAYOUT ==============================
  "sys.layout.page.sm": {
    role: "Compact viewport-edge gutter for information-dense routes.",
    usedFor: ["dashboards", "admin tables", "multi-pane list/detail views"],
    notFor: ["ordinary app routes (use page.md)", "marketing/landing pages (use page.lg)"],
  },
  "sys.layout.page.md": {
    role: "Default viewport-edge gutter — canonical page-shell padding-inline for ordinary app routes.",
    usedFor: ["feed routes", "settings", "compose flows", "detail screens", "lists"],
    notFor: ["card interior padding (use container.md)", "section interior padding (also container.md, but paid by the section, not the shell)", "between sibling cards (use stack.md)"],
  },
  "sys.layout.page.lg": {
    role: "Generous gutter for marketing / content-forward / editorial routes.",
    usedFor: ["landing pages", "editorial routes", "high-emphasis CTAs"],
    notFor: ["ordinary app routes (use page.md — wider gutter loses density)"],
  },
  "sys.layout.page.xl": {
    role: "Widest gutter — showcase heroes and brand-moment landings.",
    usedFor: ["showcase heroes", "brand landings"],
    notFor: ["everyday app routes", "any route that shares rhythm with the rest of the app"],
  },
  "sys.layout.container.3xs": {
    role: "Hairline surface inset (2px). Density is the design intent.",
    usedFor: ["tightly-packed chip/badge interiors", "icon-only controls"],
    notFor: ["any breathing surface", "card / list-row padding"],
  },
  "sys.layout.container.2xs": {
    role: "Compact inset (4px) for small pills and dense tags.",
    usedFor: ["small pills", "dense tags", "tightly-spaced inline controls"],
    notFor: ["card / list-row padding (use container.md)"],
  },
  "sys.layout.container.xs": {
    role: "Small-control padding (8px) — chip body, segmented-control items, dense table cells.",
    usedFor: ["chip body padding", "segmented control items", "compact list rows", "dense table-cell inputs"],
    notFor: ["card padding (use container.md)"],
  },
  "sys.layout.container.sm": {
    role: "Button and input-field padding (12px). Canonical one-rung step-down for a child container nested inside a container.md parent.",
    usedFor: ["button padding", "input-field padding", "nested-card interior (when parent uses container.md)"],
    notFor: ["top-level card / list-row / sheet (use container.md)"],
  },
  "sys.layout.container.md": {
    role: "Default surface padding (16px) — card, list-row, sheet content. Also the system-wide baseline section horizontal padding.",
    usedFor: ["card padding", "list-row padding", "sheet content padding", "section horizontal padding"],
    notFor: ["page gutter (use layout.page.md, paid by the shell)", "between sibling cards (use stack.md)", "button padding (use container.sm)", "dialog padding (often container.lg)"],
  },
  "sys.layout.container.lg": {
    role: "Spacious card padding (24→32px). Higher-hierarchy surfaces — primary dialogs, feature-card callouts.",
    usedFor: ["dialog body padding", "feature-card callouts", "primary dialog bodies"],
    notFor: ["ordinary cards (use container.md)"],
  },
  "sys.layout.container.xl": {
    role: "Hero section insets and large modal bodies (32→40px).",
    usedFor: ["hero section interior", "large modal bodies"],
    notFor: ["ordinary cards", "ordinary dialogs"],
  },
  "sys.layout.container.2xl": {
    role: "Landing heroes and marketing layouts (48→64px) where padding is part of the visual composition.",
    usedFor: ["landing heroes", "marketing layouts where padding is design intent"],
    notFor: ["any app route (use container.md / lg / xl)"],
  },
  "sys.layout.container.3xl": {
    role: "Largest container inset (64→80px) — showcase heroes, extra-wide marketing.",
    usedFor: ["showcase heroes", "extra-wide marketing canvases"],
    notFor: ["app routes", "ordinary surfaces"],
  },
  "sys.layout.stack.3xs": {
    role: "Hairline vertical rhythm (2px) — visually bonded stacked pairs.",
    usedFor: ["badge↔counter line", "two metadata lines that read as one unit"],
    notFor: ["sibling cards", "form field gaps", "paragraph gaps"],
  },
  "sys.layout.stack.2xs": {
    role: "Tight rhythm (4px) — label↔input, caption↔parent text, title↔immediately-attached subtitle. Signals two elements describe the same thing.",
    usedFor: ["label↔input gap inside a FormField", "title↔subtitle", "caption↔parent text"],
    notFor: ["sibling cards", "paragraph gaps"],
  },
  "sys.layout.stack.xs": {
    role: "Compact list spacing (8px) — dense feed rows, compact menus, tightly-set metadata blocks. Also the canonical section↔section separator when needed, and the tighter rhythm for one-bound-group content blocks.",
    usedFor: ["dense feed rows", "compact menus", "tightly-set metadata blocks", "section↔section gap when paddings alone don't separate them", "content rhythm for one-bound-group blocks (bullet rows, metadata lines)"],
    notFor: ["sibling cards in a feed (use stack.md)", "section-region break (use stack.xl)"],
  },
  "sys.layout.stack.sm": {
    role: "Form field gap (12px) — between two adjacent fields or rows in a dense list.",
    usedFor: ["form field↔field gap", "dense list-row gap"],
    notFor: ["paragraph rhythm (use stack.md)", "section-region break"],
  },
  "sys.layout.stack.md": {
    role: "Default vertical sibling rhythm (16px) — paragraph↔paragraph, card↔card, item↔item within one section.",
    usedFor: ["paragraph↔paragraph gap", "card↔card gap in a vertical feed", "item↔item in a section"],
    notFor: ["page-section break (use stack.xl)", "tightly-bound pairs (use stack.2xs)", "form field gap (use stack.sm)"],
  },
  "sys.layout.stack.lg": {
    role: "Gap between distinct content groups within a section (24→32px) — heading block↔body block, form group↔submit area.",
    usedFor: ["heading block↔body block", "form group↔submit area", "list label↔scrollable track"],
    notFor: ["sibling paragraphs (use stack.md)", "page-section break (use stack.xl)"],
  },
  "sys.layout.stack.xl": {
    role: "Top-level page-section break (32→40px) — strong content break that still sits within one scroll region.",
    usedFor: ["page-section↔page-section break", "hero→feature transition"],
    notFor: ["intra-section rhythm (use stack.md/lg)"],
  },
  "sys.layout.stack.2xl": {
    role: "Strong section break on content-dense vertical pages (40→48px) — hero→feature→CTA reads as discrete chapters.",
    usedFor: ["chapter-style page breaks on content-heavy pages"],
    notFor: ["ordinary app routes"],
  },
  "sys.layout.stack.3xl": {
    role: "Widest vertical break (48→64px) — hero-scale separations on marketing pages.",
    usedFor: ["hero-scale separations", "marketing pages"],
    notFor: ["app routes"],
  },
  "sys.layout.inline.xs": {
    role: "Hairline horizontal rhythm (4px) — glyph↔label inside a tight control.",
    usedFor: ["icon↔label inside a chip", "glyph↔caption pairs"],
    notFor: ["button group gap (use inline.md)", "card row gap"],
  },
  "sys.layout.inline.sm": {
    role: "Compact horizontal gap (8px) — chip↔chip, dense button cluster.",
    usedFor: ["chip↔chip in a filter row", "dense action cluster"],
    notFor: ["button group with breathing room (use inline.md)"],
  },
  "sys.layout.inline.md": {
    role: "Default horizontal sibling gap (12→16px) — button group, inline action cluster.",
    usedFor: ["button group gap", "inline action cluster", "icon button row"],
    notFor: ["tight icon↔label (use inline.xs)"],
  },
  "sys.layout.inline.lg": {
    role: "Spacious horizontal gap (12→16px) — content-rich inline pair.",
    usedFor: ["content-rich inline pair", "header trailing-action cluster"],
    notFor: ["tight chip rows"],
  },
  "sys.layout.inline.xl": {
    role: "Wide horizontal gap (16→24px) — toolbar cluster, hero inline pair.",
    usedFor: ["toolbar cluster", "hero inline pair"],
    notFor: ["app-route action clusters (use inline.md)"],
  },
  "sys.layout.inline.2xl": {
    role: "Widest horizontal gap (24→32px) — marketing inline composition.",
    usedFor: ["marketing inline composition", "showcase pair"],
    notFor: ["app routes"],
  },

  // ============================== COLOR ==============================
  // Pair contract: <role>Container always paints with on<Role>Container.
  // Never split the pair.
  "sys.color.primary": {
    role: "Brand-blue commit color — primary CTAs, active selection, link affordance.",
    usedFor: ["primary commit button fill", "active tab indicator", "link-affordance text"],
    notFor: ["body text (use onSurface)", "destructive commits (use brand or error)", "informational tint (use primaryContainer)"],
    pairsWith: "sys.color.onPrimary",
    allowedComponents: [
      "button/standard (default appearance fill)",
      "button/text (appearance=accent — link affordance)",
      "tabs/underline (active indicator)",
      "chip/filter (selected outline + label tone)",
      "feed/post (poll icon, inline link/hashtag color)",
      "section/post-carousel (verified glyph, mention link)",
      "section/profile-carousel (thumb metric chip)",
    ],
    forbiddenComponents: [
      "navigation-bar/* (header chrome — use onSurface for title, surface for bar fill)",
      "banner/* fill (use primaryContainer for tinted info banner; primary is for the commit *inside* the banner)",
      "card outline (use outlineVariant)",
      "list-row divider (use outlineVariant)",
      "tab-bar/* (Create item uses brand, other items use onSurface)",
    ],
  },
  "sys.color.onPrimary": {
    role: "Foreground that paints ON sys.color.primary fills. Travels as a pair.",
    usedFor: ["label/icon on a primary-filled button", "text on a primary surface"],
    notFor: ["any surface that isn't sys.color.primary"],
  },
  "sys.color.primaryContainer": {
    role: "Tinted-primary surface for low-emphasis primary tints — informational chips, soft callouts.",
    usedFor: ["filter chip selected fill", "info banner background", "soft primary tint"],
    notFor: ["primary commit button (use primary)"],
    pairsWith: "sys.color.onPrimaryContainer",
  },
  "sys.color.onPrimaryContainer": {
    role: "Foreground for primaryContainer surfaces. Travels as a pair.",
    usedFor: ["label/icon on primaryContainer fills"],
    notFor: ["primary fills (use onPrimary)"],
  },
  "sys.color.secondary": {
    role: "Neutral-dark accent — secondary text, neutral active state, supporting metric.",
    usedFor: ["secondary button accent", "neutral active state", "metric values"],
    notFor: ["primary commit (use primary)", "body text on surface (use onSurface)"],
    pairsWith: "sys.color.onSecondary",
  },
  "sys.color.onSecondary": {
    role: "Foreground on sys.color.secondary fills.",
    usedFor: ["label/icon on a secondary-filled surface"],
    notFor: ["surfaces other than secondary"],
  },
  "sys.color.secondaryContainer": {
    role: "Tinted neutral surface — soft secondary tint.",
    usedFor: ["soft neutral tinted chip", "tag pill background"],
    notFor: ["plain card surface (use surface)"],
    pairsWith: "sys.color.onSecondaryContainer",
  },
  "sys.color.onSecondaryContainer": {
    role: "Foreground on secondaryContainer surfaces.",
    usedFor: ["label on secondaryContainer fills"],
    notFor: [],
  },
  "sys.color.brand": {
    role: "Blind editorial red — brand accents reserved for editorial / promotional / FAB-style commits. Brand red is an accent marker, never a CTA surface.",
    usedFor: ["FAB fill (the canonical creation commit)", "tab-bar Create item fill", "hot/new badge accent", "active-like editorial tone in the Feed"],
    notFor: ["primary inline commits (use primary)", "destructive (use error)", "general body text", "navigation-bar header logo / title", "default banner background"],
    pairsWith: "sys.color.onBrand",
    allowedComponents: [
      "button/fab (the canonical floating creation commit)",
      "tab-bar/item--primary (the Create tab item — single per screen)",
      "badge (HOT / NEW marker)",
      "feed/post (active-like heart tone)",
      "banner/* (promotional accent — only when the banner's role is promotional, not informational)",
    ],
    forbiddenComponents: [
      "button/standard fill (primary commits use sys.color.primary)",
      "navigation-bar/* (header chrome stays on surface — title is onSurface, never brand)",
      "banner fill when banner role is informational (use primaryContainer instead)",
      "card outline (use outlineVariant)",
      "list-row divider (use outlineVariant)",
      "shortcut / quick-action background tile",
      "section heading text color",
    ],
    maxInstancesPerScreen: 3,
    maxInstancesRationale: "Brand red is a marker — more than 3 instances per screen dilute its meaning. The canonical instances are: the Create entry on tab-bar (1), an active-like state inside a feed item (≤2), an optional promotional banner accent (1).",
  },
  "sys.color.onBrand": {
    role: "Foreground on sys.color.brand fills.",
    usedFor: ["icon/label on a brand-filled FAB or banner"],
    notFor: [],
  },
  "sys.color.brandContainer": {
    role: "Tinted brand surface — promotional accent without full saturation.",
    usedFor: ["promotional callout background", "hot-topic tinted strip"],
    notFor: ["primary CTA"],
    pairsWith: "sys.color.onBrandContainer",
  },
  "sys.color.onBrandContainer": {
    role: "Foreground on brandContainer surfaces.",
    usedFor: ["label on brandContainer fills"],
    notFor: [],
  },
  "sys.color.success": {
    role: "Green commit / status color — success states, positive metrics.",
    usedFor: ["success toast", "completed-state status", "positive metric (e.g. pulse metric value)"],
    notFor: ["destructive (use error)", "promotional (use brand)"],
    pairsWith: "sys.color.onSuccess",
    allowedComponents: [
      "toast (success-flavored toast accent / icon)",
      "section/profile-carousel (pulse metric chip)",
      "feed/post (offer-flavored poll label — Offer banner uses success tone)",
      "form-field (success state stroke when applicable)",
    ],
    forbiddenComponents: [
      "button fill (primary commits use primary; destructive uses error)",
      "navigation-bar/*",
      "default body text",
    ],
  },
  "sys.color.onSuccess": { role: "Foreground on success fills.", usedFor: ["label on a success-filled surface"], notFor: [] },
  "sys.color.successContainer": {
    role: "Tinted-green surface — success banner background.",
    usedFor: ["success banner background", "completed-state callout"],
    notFor: [],
    pairsWith: "sys.color.onSuccessContainer",
  },
  "sys.color.onSuccessContainer": { role: "Foreground on successContainer.", usedFor: [], notFor: [] },
  "sys.color.error": {
    role: "Red destructive / error commit color — never used for emphasis, only for destructive actions or error states.",
    usedFor: ["destructive button fill", "error message text", "destructive flavor on Button.standard"],
    notFor: ["promotional (use brand)", "primary commits (use primary)"],
    pairsWith: "sys.color.onError",
    allowedComponents: [
      "button/standard (flavor=destructive fill)",
      "form-field (error state stroke + error message text)",
      "dialog / bottom-sheet (destructive primary action label inside the sheet)",
    ],
    forbiddenComponents: [
      "navigation-bar/*",
      "banner fill (use errorContainer when banner role is error notice)",
      "default body text",
      "tab-bar/* (Create item uses brand)",
      "promotional surfaces (use brand)",
    ],
  },
  "sys.color.onError": { role: "Foreground on error fills.", usedFor: ["label on a destructive-filled button"], notFor: [] },
  "sys.color.errorContainer": {
    role: "Tinted-red surface — destructive banner / error notice.",
    usedFor: ["error banner background", "destructive callout"],
    notFor: [],
    pairsWith: "sys.color.onErrorContainer",
  },
  "sys.color.onErrorContainer": { role: "Foreground on errorContainer.", usedFor: [], notFor: [] },
  "sys.color.surface": {
    role: "Default page and card fill — the canvas every other surface paints over.",
    usedFor: ["page background", "card fill", "list row fill", "feed item fill"],
    notFor: ["tinted callouts (use *Container variants)"],
    pairsWith: "sys.color.onSurface",
  },
  "sys.color.onSurface": {
    role: "Default body text color — what most text on a `surface` fill resolves to.",
    usedFor: ["body text", "card title", "list-row primary label"],
    notFor: ["primary CTA label on primary fill (use onPrimary)"],
  },
  "sys.color.surfaceVariant": {
    role: "Subtly-tinted surface variant — input field rest fill, low-emphasis surface.",
    usedFor: ["input field rest fill", "tinted-card variant"],
    notFor: ["page background (use surface)"],
    pairsWith: "sys.color.onSurfaceVariant",
  },
  "sys.color.onSurfaceVariant": {
    role: "Secondary text color — meta lines, supporting text, placeholders, glyph chrome.",
    usedFor: ["meta line text", "supporting text", "input placeholder", "trailing chevron", "secondary icon"],
    notFor: ["primary body text (use onSurface)"],
  },
  "sys.color.surfaceContainer": {
    role: "Mid-tint surface for grouped content blocks — Feed citation card, neutral grouped surface.",
    usedFor: ["citation card fill", "neutral grouped block"],
    notFor: ["page background (use surface)"],
  },
  "sys.color.surfaceContainerLow": {
    role: "Slight tint below default surface — search input bar fill, hover-state row fill.",
    usedFor: ["search input bar fill", "hover-state row fill"],
    notFor: ["card fill (use surface)"],
  },
  "sys.color.surfaceContainerLowest": {
    role: "Deepest-low tint — barely visible surface step. Reserved for very subtle separation.",
    usedFor: ["barely-tinted separators between regions"],
    notFor: ["any default fill"],
  },
  "sys.color.surfaceContainerHigh": {
    role: "Higher tint than surface — banner backgrounds, ProfileCarousel cover band, image-area fallback.",
    usedFor: ["banner background", "ProfileCarousel cover band", "image-area underlay (with placeholder image on top)"],
    notFor: ["page background"],
  },
  "sys.color.surfaceContainerHighest": {
    role: "Highest neutral surface tint — pressed-state row fill, deepest neutral callout.",
    usedFor: ["pressed-state row fill", "deepest neutral callout"],
    notFor: ["default fill"],
  },
  "sys.color.surfaceBright": {
    role: "Light-mode bright surface step — used in dark mode to invert to a near-white surface.",
    usedFor: ["bright-mode surface in dark theme"],
    notFor: ["light-mode default fill"],
  },
  "sys.color.surfaceDim": {
    role: "Dimmer-than-default surface — slightly muted variant.",
    usedFor: ["muted surface variants"],
    notFor: ["default fill"],
  },
  "sys.color.outline": {
    role: "Strong divider line — control boundary, full-emphasis border.",
    usedFor: ["form field active stroke", "high-emphasis divider"],
    notFor: ["hairline card stroke (use outlineVariant)"],
  },
  "sys.color.outlineVariant": {
    role: "Hairline edge stroke — card outline, divider line between rows.",
    usedFor: ["card outline (as inset box-shadow or ::after overlay)", "list-row divider", "section bottom divider"],
    notFor: ["form field active stroke (use outline or primary)"],
  },
  "sys.color.inverseSurface": {
    role: "Inverse-theme surface — Toast background sits on this.",
    usedFor: ["toast background"],
    notFor: ["default page surface"],
  },
  "sys.color.inverseOnSurface": {
    role: "Foreground on inverseSurface — Toast text.",
    usedFor: ["toast text"],
    notFor: ["default body text"],
  },
  "sys.color.focus": {
    role: "Focus ring outer stroke color.",
    usedFor: ["::after focus ring outer color (paired with focusInset)"],
    notFor: ["body text", "interactive fills"],
  },
  "sys.color.focusInset": {
    role: "Focus ring inner counter-ring color — paints between the focus stroke and the control.",
    usedFor: ["::after focus ring inner counter-ring"],
    notFor: ["body text"],
  },
  "sys.color.scrim": {
    role: "Dialog / BottomSheet scrim background — semi-transparent black overlay.",
    usedFor: ["dialog scrim", "bottom-sheet scrim"],
    notFor: ["any visible surface"],
  },
  "sys.color.scrimSubtle": {
    role: "Translucent inverse-tone surface tint (~8% — black light / white dark). Surface-agnostic fill that stays visible on every host surface tier.",
    usedFor: ["Banner default background", "Chip / Tag default background", "Progress track background", "StatusTag neutral background", "Skeleton placeholder fill"],
    notFor: ["modal backdrop (use scrim)", "opaque container surfaces (use surface* ladder)"],
  },
  "sys.color.elevation": {
    role: "Elevation shadow color (compose into box-shadow).",
    usedFor: ["box-shadow color in raised/floating/overlay elevations"],
    notFor: ["visible fills"],
  },
  "sys.color.placeholderImage.start": {
    role: "Gradient start for the placeholder image-area underlay (when /placeholder.png itself is unavailable).",
    usedFor: ["image-area underlay gradient start"],
    notFor: ["foreground content"],
  },
  "sys.color.placeholderImage.end": {
    role: "Gradient end for the placeholder image-area underlay.",
    usedFor: ["image-area underlay gradient end"],
    notFor: [],
  },

  // ============================== TYPO ==============================
  // Picked at the parent step level (display/heading/body/label/caption × xs/sm/md/lg).
  "sys.typo.display.lg": {
    role: "Largest display type (48→80px) — landing page hero headline.",
    usedFor: ["landing hero headline", "marketing page hero"],
    notFor: ["app-route page titles (use heading.lg)"],
  },
  "sys.typo.display.md": {
    role: "Display type for editorial single-topic page titles (32px).",
    usedFor: ["single-topic page title (post detail, article)"],
    notFor: ["section title within a feed page (use heading.lg)"],
  },
  "sys.typo.display.sm": {
    role: "Compact display type (24px) — secondary editorial heading.",
    usedFor: ["secondary editorial heading"],
    notFor: ["body text (use body.md)"],
  },
  "sys.typo.heading.lg": {
    role: "Page-level type (24→32px) — Home / Jobs / Notifications page title in navigation-bar/home.",
    usedFor: ["home navigation-bar title", "page-level top section title"],
    notFor: ["card title (use heading.md)"],
  },
  "sys.typo.heading.md": {
    role: "Section / card title (20px) — Section.label, Feed card title, Job card title.",
    usedFor: ["section heading", "card title", "Feed.title"],
    notFor: ["page title (use heading.lg)", "list-row label (use body.md)"],
  },
  "sys.typo.heading.sm": {
    role: "Sub-section heading (16px) — small subhead inside a card.",
    usedFor: ["small subhead inside a card", "sub-section heading"],
    notFor: ["card title (use heading.md)"],
  },
  "sys.typo.body.lg": {
    role: "Spacious body text (18px) — long-form single-topic content where reading is the job.",
    usedFor: ["post body in a single-topic detail page", "article body"],
    notFor: ["mixed-group section body (use body.md or sm)"],
  },
  "sys.typo.body.md": {
    role: "Default body (16px) — single-topic page bodies, form input values.",
    usedFor: ["single-topic body paragraphs", "FormField input value"],
    notFor: ["mixed-group section body (use body.sm)"],
  },
  "sys.typo.body.sm": {
    role: "Compact body (14px) — mixed-group sections (multiple distinct text groups within one body).",
    usedFor: ["card listing several short descriptions", "settings page with mixed labels + helper text", "compact feed item descriptions"],
    notFor: ["single-topic article body (use body.md)"],
  },
  "sys.typo.label.lg": {
    role: "Largest label rung (16px) — primary button label.",
    usedFor: ["primary button label (Button.standard)", "tab label"],
    notFor: ["body text (use body.md)"],
  },
  "sys.typo.label.md": {
    role: "Default label (14px) — list-row primary text, chip label, secondary control label.",
    usedFor: ["list-row primary label", "chip label", "navigation-bar text title"],
    notFor: ["body text"],
  },
  "sys.typo.label.sm": {
    role: "Small label (12px) — chip metric value, supporting label, meta text.",
    usedFor: ["chip metric value", "supporting label", "meta line under a card header"],
    notFor: ["body paragraphs"],
  },
  "sys.typo.caption.lg": {
    role: "Largest caption (12px) — figure caption, supplementary line.",
    usedFor: ["figure caption", "supplementary annotation"],
    notFor: ["meta lines (use caption.md or label.sm)"],
  },
  "sys.typo.caption.md": {
    role: "Default caption (12px) — meta lines, helper text, follower counts, engagement counts.",
    usedFor: ["Feed meta line (channel · time)", "follower count under a profile name", "engagement counter (likes / comments / views)"],
    notFor: ["primary text"],
  },
  "sys.typo.caption.sm": {
    role: "Smallest caption (11px) — tiny annotation.",
    usedFor: ["tiny annotation", "smallest legal/aux line"],
    notFor: ["any primary or meta text"],
  },

  // ============================== RADIUS ==============================
  "sys.radius.none": {
    role: "No corner rounding (0px).",
    usedFor: ["full-bleed surfaces", "dividers", "non-rounded chrome"],
    notFor: ["cards (use radius.md)"],
  },
  "sys.radius.xs": {
    role: "Subtle rounding (2px) — barely visible.",
    usedFor: ["barely-rounded utility surfaces", "checkbox interior"],
    notFor: ["cards"],
  },
  "sys.radius.sm": {
    role: "Compact rounding (4px) — inline poll option, list radio, tag pill.",
    usedFor: ["poll option row", "list radio interior", "tag pill"],
    notFor: ["card outer corner (use radius.md)"],
  },
  "sys.radius.md": {
    role: "Default rounding (8px) — card, banner, dialog outer, Feed item, Section card.",
    usedFor: ["card outer radius", "banner radius", "dialog body radius", "feed item radius"],
    notFor: ["chip / pill (use radius.full)", "very large surfaces (use radius.lg/xl)"],
  },
  "sys.radius.lg": {
    role: "Spacious rounding (12px) — BottomSheet top corners, toast pill, large dialog.",
    usedFor: ["bottom-sheet top corner radius", "toast pill outer", "large dialog"],
    notFor: ["ordinary cards (use radius.md)"],
  },
  "sys.radius.xl": {
    role: "Hero-scale rounding (16px) — large hero surfaces.",
    usedFor: ["hero surface radius"],
    notFor: ["ordinary cards"],
  },
  "sys.radius.2xl": {
    role: "Showcase rounding (24px) — marketing hero radius.",
    usedFor: ["marketing hero radius"],
    notFor: ["app routes"],
  },
  "sys.radius.full": {
    role: "Fully circular / pill (999px).",
    usedFor: ["chip outer", "pill button", "circular Thumbnail", "avatar"],
    notFor: ["cards (use radius.md)"],
  },

  // ============================== BORDER WIDTH ==============================
  "sys.borderWidth.none": { role: "0px — no stroke.", usedFor: ["surfaces without an edge"], notFor: ["any visible boundary"] },
  "sys.borderWidth.hairline": {
    role: "1px — default edge stroke. Card outline, list-row divider, default control stroke.",
    usedFor: ["card outline (inset box-shadow or ::after overlay)", "list-row divider", "default form-field rest stroke"],
    notFor: ["active-state strokes (use thin)"],
  },
  "sys.borderWidth.thin": {
    role: "2px — active or emphasis stroke. Form-field active, focus ring outer.",
    usedFor: ["form-field active stroke", "focus ring outer stroke"],
    notFor: ["default rest stroke (use hairline)"],
  },
  "sys.borderWidth.medium": { role: "3px — medium emphasis stroke.", usedFor: ["medium-emphasis decorative stroke"], notFor: ["control strokes (use hairline/thin)"] },
  "sys.borderWidth.thick": { role: "4px — thick decorative stroke.", usedFor: ["decorative emphasis"], notFor: ["control strokes"] },

  // ============================== ICON ==============================
  "sys.icon.md": {
    role: "Default icon size (20px) — most inline icons.",
    usedFor: ["Button.icon glyph", "trailing chevron", "list-row leading icon (small)", "chip icon"],
    notFor: ["large hero icons (use icon.lg)"],
  },
  "sys.icon.lg": {
    role: "Large icon size (24px) — top-bar glyphs, FAB icon, prominent leading icon.",
    usedFor: ["navigation-bar trailing action glyphs", "FAB glyph", "prominent leading icon"],
    notFor: ["dense inline icons (use icon.md)"],
  },

  // ============================== ELEVATION ==============================
  "sys.elevation.raised": {
    role: "Subtle lift — sits-on the page.",
    usedFor: ["card at rest", "hovered list rows", "selected menu items"],
    notFor: ["modal surfaces (use floating/overlay)"],
  },
  "sys.elevation.floating": {
    role: "Free-floating above the page.",
    usedFor: ["FAB", "floating menu", "dropdown", "autocomplete panel"],
    notFor: ["flat cards (use raised or none)"],
  },
  "sys.elevation.overlay": {
    role: "Page-level overlay demanding focus.",
    usedFor: ["dialog", "modal", "popover above scrim"],
    notFor: ["non-blocking floating panels (use floating)"],
  },
  "sys.elevation.sheet": {
    role: "Edge-anchored panel projecting shadow upward (or away from the anchored edge).",
    usedFor: ["bottom-sheet", "side drawer", "pinned panel"],
    notFor: ["centered modals (use overlay)"],
  },

  // ============================== STATE ==============================
  "sys.state.hover": { role: "Hover overlay opacity (state layer).", usedFor: ["hover state on interactive controls"], notFor: ["rest state"] },
  "sys.state.focus": { role: "Focus overlay opacity.", usedFor: ["focus state on interactive controls"], notFor: ["rest state"] },
  "sys.state.pressed": { role: "Pressed overlay opacity.", usedFor: ["pressed state on interactive controls"], notFor: ["rest state"] },
  "sys.state.dragged": { role: "Dragged overlay opacity.", usedFor: ["dragged state"], notFor: ["rest state"] },
  "sys.state.disabled": { role: "Disabled foreground opacity.", usedFor: ["disabled control opacity"], notFor: ["enabled states"] },
};

function unitOf(token) {
  if (token.startsWith("sys.layout.") || token.startsWith("sys.radius.") || token.startsWith("sys.borderWidth.")) return "px";
  if (token.startsWith("sys.icon.")) return "px";
  if (token.startsWith("sys.color.")) return "hex";
  if (token.startsWith("sys.typo.")) return "object";
  if (token.startsWith("sys.elevation.")) return "shadow";
  if (token.startsWith("sys.state.")) return "opacity";
  return "n/a";
}

const out = {
  $schema: "tokens.usage.schema.json",
  description:
    "Machine-readable role + usage index for every agent-pickable `sys.*` token. One JSON read replaces grepping the 1300-line DESIGN.md prose. Pair this with `resolved.{light,dark,web}.json` (raw values) and `DESIGN.md` (deep rationale) — this file is the routing layer in between.",
  generatedFrom: "schema/tokens/build-usage.mjs",
  pairs: {
    note:
      "Color tokens marked with `pairsWith` MUST travel together — `sys.color.<role>Container` is always painted with `sys.color.on<Role>Container` foreground; `sys.color.<role>` is always painted with `sys.color.on<Role>`. Never split the pair.",
  },
  tokens: {},
};

const keys = [...new Set([...Object.keys(META), ...Object.keys(light)])].filter((k) => k.startsWith("sys."));

for (const k of Object.keys(META).sort()) {
  const meta = META[k];
  const entry = {
    role: meta.role,
    usedFor: meta.usedFor,
    notFor: meta.notFor,
  };
  if (meta.pairsWith) entry.pairsWith = meta.pairsWith;
  // High-stakes color tokens (brand / primary / error / success) carry a
  // slot allowlist that names the EXACT component sub-roles they may
  // appear in, plus a per-screen instance cap for brand. The lint at
  // schema/lint/validate-color-slots.mjs reads these to flag misuse.
  if (meta.allowedComponents) entry.allowedComponents = meta.allowedComponents;
  if (meta.forbiddenComponents) entry.forbiddenComponents = meta.forbiddenComponents;
  if (meta.maxInstancesPerScreen != null) {
    entry.maxInstancesPerScreen = meta.maxInstancesPerScreen;
    if (meta.maxInstancesRationale) entry.maxInstancesRationale = meta.maxInstancesRationale;
  }

  if (light[k]) {
    entry.value = light[k].$value;
    entry.darkValue = dark[k]?.$value;
    if (web[k]) entry.webValue = web[k].$value;
    entry.unit = unitOf(k);
  }

  out.tokens[k] = entry;
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`[build-usage] wrote ${Object.keys(out.tokens).length} entries → ${OUT}`);
