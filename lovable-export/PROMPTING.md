# PROMPTING.md — how to ask Lovable for a Chorus screen

When a Lovable / Cursor / Claude prompt is vague about visual style, the model fills the gap with whatever the prompt's adjectives suggest. Prompts that say "clean, minimal, white background, subtle hierarchy, no decoration" get back exactly that — uncolored, image-less wireframes — even with the full Chorus system available in the repo.

This file is the **prompting contract**: a copy-paste preamble plus naming rules that make the model reach for Chorus components by default. Use it for every Lovable session.

---

## 1. Copy-paste preamble (paste at the top of every Lovable prompt)

```
You are working inside the Chorus design system mirror. Before generating
any UI, read `AGENTS.md` and `docs/catalog.md` in this repo.

Hard requirements for this task:
- Compose every screen from `@/components/chorus/*`. Do NOT introduce
  shadcn primitives (`@/components/ui/*` is intentionally not shipped) —
  if a primitive seems missing, pick the closest chorus equivalent or
  flag it as a chorus gap rather than reaching for shadcn / raw Tailwind.
- Pick components by INTENT, not by adjective. Use `docs/catalog.md` to
  map "header card" → NavigationBar/Section, "article card" → Feed,
  "company row" → List with thumbnail leading, "insight box" → Callout,
  "filter row" → Chip variant=filter, "stage tabs" → Tabs variant=underline.
- Every visible color, spacing, radius, type ramp MUST resolve to a
  Chorus token (`var(--sys-*)` / `var(--ref-*)`). No raw hex, no Tailwind
  color utilities, no off-scale px.
- CTAs use Button variants explicitly: primary commit → Button (standard,
  filled); secondary commit → Button variant=text appearance=accent;
  icon-only → Button variant=icon; floating canonical → Button variant=fab.
- Active tab indicators, like counts, D-day urgency, brand CTAs must
  carry brand color through the appropriate token — do not render them
  as plain gray text.
- Image areas (avatars, logos, article thumbs, post media) are real
  <Thumbnail> or Feed `thumbnail` slots filled with `/placeholder_thumbnail.png`
  when no context-specific asset is available. NEVER substitute an icon-
  in-tinted-circle for an image area.
- Mirror the seed pattern in `src/routes/index.tsx` — that file is the
  canonical example of how a Chorus screen is composed.

If a section in my prompt does not name a component, infer the closest
match from `docs/catalog.md` and use it. Do not invent new primitives,
do not wrap chorus components to restyle them, do not write raw
`<button>` / `<img>` / inline `style={{ color: '#…' }}`.
```

Edit it to taste, but the bullet structure is what carries weight.

---

## 2. Intent → component quick map

When you write the body of your prompt, replace generic words on the left with the component names on the right. The right column is what the model actually grounds on.

| You wrote…                       | Say instead                                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| "top bar with title"             | `NavigationBar variant=page` with `leading` back + `trailing` CTA |
| "home title bar"                 | `NavigationBar variant=home` with `trailingActions` icons         |
| "search bar that fills the top"  | `NavigationBar variant=search`                                    |
| "header card / summary card"     | `Section` with `label` + `headerAction`                           |
| "article card / post card"       | `Feed` with `channel`, `title`, `body`, `thumbnail`, `engagement` |
| "ad card / sponsored card"       | `FeedAd`                                                          |
| "company row / settings row"     | `List variant=text` with `leading={ kind: 'thumbnail' }`          |
| "drill-in row"                   | `List variant=nav` with trailing chevron                          |
| "single-select picker"           | `List variant=radio`                                              |
| "channel directory"              | `ChannelList`                                                     |
| "horizontal channel rail"        | `ChannelRail`                                                     |
| "sticky stage tabs"              | `Tabs variant=underline`                                          |
| "list/grid toggle"               | `Tabs variant=segmented`                                          |
| "filter chip row"                | `Chip variant=filter`                                             |
| "tag pill"                       | `Chip variant=tag`                                                |
| "insight box / aside"            | `Callout` (`default` or `accent`)                                 |
| "confirmation prompt"            | `Dialog`                                                          |
| "one-thumb action sheet"         | `BottomSheet`                                                     |
| "transient confirmation"         | `Toast`                                                           |
| "trigger-anchored hint"          | `Tooltip`                                                         |
| "labeled text field"             | `FormField variant=input`                                         |
| "primary CTA"                    | `Button` (standard)                                               |
| "link-style CTA / See all"       | `Button variant=text appearance=accent`                           |
| "FAB"                            | `Button variant=fab`                                              |
| "icon-only button"               | `Button variant=icon`                                             |
| "avatar / logo / list leading"   | `Thumbnail` with `src=/placeholder_thumbnail.png` until inferred  |
| "unread count / numeric pill"    | `Badge`                                                           |

(Authoritative version: `docs/catalog.md`.)

---

## 3. Anti-patterns the model will fall into without the preamble

These are the failure modes the preamble exists to prevent. If you see any of these in Lovable's output, regenerate with the preamble — they all mean the model bypassed Chorus.

- Raw `<button>` / `<a>` styled with Tailwind for primary CTAs (should be `<Button>`).
- "Card" written as a div with `border` and `rounded-lg` (should be `<Section>` or `<Feed>` or `<Callout>`).
- Lists rendered as a stack of bordered divs (should be `<List>`).
- Avatars / logos as `<div>` with a letter inside (should be `<Thumbnail src=... />`).
- Article cards with no thumbnail slot at all.
- Active tabs styled with `text-black font-bold` only (should be `<Tabs variant=underline>` so the underline indicator is the brand-token affordance).
- CTAs colored as plain text (should be `appearance=accent` to carry brand color).
- Inline `style={{ background: '#fff' }}` or `bg-white` (should be `var(--sys-color-surface)` or rely on the surface token already on the page wrapper).
- Filter chips styled as gray pills with no selected state (should be `<Chip variant=filter selected>`).

---

## 4. The image-area rule (the one most often skipped)

If you don't name image slots in the prompt, the model will omit them and the screen comes back textual. Always include explicit lines like:

- "Each company row has a `<Thumbnail size=40>` leading slot with the company logo as `src`."
- "Each article card has a `<Feed>` `thumbnail` slot with the post cover."
- "Each insight callout has a `<Callout>` `thumbnail` slot showing the cited author's avatar."

When you don't have a real asset, the placeholder path `/placeholder_thumbnail.png` is the documented default and resolves out of the box (see `AGENTS.md` §9).

---

## 5. Tone-balance phrases

These short clauses, dropped into the visual-style section of your prompt, balance "clean / minimal" so the result still carries brand color:

- "modern with clear brand accent color on key CTAs and active states"
- "Chorus brand color carries the navigational intent on See-all links, like counts, and active tab indicators"
- "semantic accents for urgency (D-day), engagement (likes), and selection (active chip)"
- "dense but readable — section labels and dividers handle the hierarchy, not extra whitespace"

Avoid in isolation: "clean," "minimal," "subtle," "white background," "no decoration," "not a feed," "not a concept poster." Each of these, unbalanced, biases the model toward removing color and images. Use them with one of the tone-balance phrases above.

---

## 6. Workflow

1. Open Lovable on the synced repo.
2. Paste the §1 preamble.
3. Write the actual feature prompt, using §2 names instead of generic words.
4. Add explicit image-slot lines (§4) and at least one tone-balance phrase (§5).
5. After Lovable generates, scan the output for the §3 anti-patterns. If any are present, reply in the same Lovable chat: "Replace the X with `<Component>` from `@/components/chorus`."
