# anti-patterns.md — common Lovable / agent failure modes

A catalogue of the wrong-shaped output Chorus consumers most often produce, paired with the right-shaped fix. Each entry names the rule, the broken snippet, and the corrected one. **Read at least once before composing a new screen** — most agent violations come from these ~12 recurring shapes. Pair with [`compose.md`](compose.md) and [`tokens.usage.json`](tokens.usage.json).

When in doubt: if your output matches a "❌ wrong" snippet below, discard and regenerate.

---

## 1. Brand red painted on the header chrome

**Rule violated**: `tokens.usage.json#sys.color.brand.forbiddenComponents` — `navigation-bar/*`. Brand is an accent marker, never the title surface.

```jsx
// ❌ Wrong — header logotype/title painted with brand color
<NavigationBar
  variant="home"
  title={<img src="/logo.svg" style={{ color: 'var(--sys-color-brand)' }} />}
/>

// ✅ Right — header chrome stays on `surface`; the wordmark paints `onSurface`
<NavigationBar
  variant="home"
  title={<img src="/blind_logotype_black.svg" alt="Chorus" />}
/>
```

Brand red is allowed on `button/fab`, `tab-bar/item--primary`, `badge`, `feed/post.like-active`, and promotional `banner` accents. **Nowhere else.** See [`tokens.usage.json#sys.color.brand`](tokens.usage.json).

---

## 2. `border:` painted on a card / list-row / feed-item / banner

**Rule violated**: DESIGN.md § Border & stroke — *no-layout strokes*. Edge strokes are inset `box-shadow` (or `::after` overlay when the surface hosts a full-bleed child). A real `border:` reflows the box on state changes.

```css
/* ❌ Wrong — border reflows the card on hover / active state */
.my-card {
  border: 1px solid var(--sys-color-outlineVariant);
  border-radius: var(--sys-radius-md);
  padding: var(--sys-layout-container-md);
}

/* ✅ Right — inset box-shadow paints the stroke without contributing to layout */
.my-card {
  box-shadow: inset 0 0 0 var(--sys-borderWidth-hairline) var(--sys-color-outlineVariant);
  border-radius: var(--sys-radius-md);
  padding: var(--sys-layout-container-md);
}

/* ✅ Right (alt) — when the card hosts a full-bleed cover child, promote the
   outline to a ::after overlay so it paints above the cover image */
.my-card { position: relative; border-radius: var(--sys-radius-md); }
.my-card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  pointer-events: none; z-index: 2;
  box-shadow: inset 0 0 0 var(--sys-borderWidth-hairline) var(--sys-color-outlineVariant);
}
```

---

## 3. Page padding paid by the page shell *and* the child component

**Rule violated**: `family.json#layoutInset: "full-bleed"` + LOVABLE.md §A.4 — *page inset is paid once at the shell*. **Twelve full-bleed families** own their own gutter and must NEVER be wrapped in a `padding-inline` div, `className="px-*"`, or `style={{ padding }}`:

`navigation-bar`, `tab-bar`, **`tabs`**, `section`, `feed`, `list`, `nav-card`, `banner`, `accordion`, `suggestion-list`, `avatar-rail`, `chip` (group).

Tabs in particular trips up agents because its inner track LOOKS like it might need centering — it doesn't. Tabs pays its own inline padding internally; wrapping adds a second gutter and the underline indicator no longer aligns with the page rail.

```jsx
// ❌ Wrong — page padding paid twice (shell px-4 + child wrapper px-4)
<main className="px-4">
  <div className="px-4">
    <Tabs variant="underline" value={tab} onChange={setTab}>…</Tabs>
  </div>
  <div className="px-4">
    <Section label="Top channels">…</Section>
  </div>
  <div style={{ padding: 16 }}>
    <Feed items={…} />
  </div>
</main>

// ✅ Right — shell pays padding-inline once, full-bleed children stretch
<main style={{ paddingInline: 'var(--sys-layout-page-md)', display: 'flex', flexDirection: 'column', gap: 'var(--sys-layout-stack-lg)' }}>
  <Tabs variant="underline" value={tab} onChange={setTab}>…</Tabs>
  <Section label="Top channels">…</Section>
  <Feed items={…} />
</main>
```

**Mental check before JSX**: if the component is in the twelve-family list, the call is a *direct child* of `<main>`. No wrapper. If you feel the urge to add `padding` for "alignment", the page shell's `padding-inline` is what needs adjusting.

After rendering, run the [§E rail self-diagnostic snippet](LOVABLE.md) — every full-bleed child should share the same `left` / `right` rail.

---

## 4. List rendered as `<div>`s with raw borders

**Rule violated**: AGENTS.md hard rule #5 + List family contract — list seam is the family's own `outlineVariant` divider; rows are the click target.

```jsx
// ❌ Wrong — DIY list with per-row border
<div className="rounded-lg overflow-hidden border border-gray-200">
  <div className="flex items-center gap-3 p-4 border-b border-gray-200">
    <img src={c.logo} className="w-10 h-10 rounded-full" />
    <span className="font-medium">{c.name}</span>
  </div>
  {/* ...more rows... */}
</div>

// ✅ Right — List with thumbnail variant
<List
  variant="thumbnail"
  items={companies.map(c => ({
    value: c.id,
    label: c.name,
    leading: <Thumbnail src={c.logo} alt={c.name} size={40} />,
  }))}
/>
```

The List family paints its own row dividers (`outlineVariant` hairline on the inset shadow), enforces row click semantics, and respects nesting / focus / state contracts.

---

## 5. Chip / pill rendered with `radius < radius.full`

**Rule violated**: `chip/*.spec.json#forbidden` — chip is always a fully-rounded pill.

```jsx
// ❌ Wrong — "chip" with 8px corner — visually a card
<button className="rounded-lg bg-gray-100 px-3 py-1">Remote Only</button>

// ✅ Right — Chip from @blind-dsai/ui
<Chip variant="filter" selected={false}>Remote Only</Chip>
```

A 4-8px-rounded "chip" is a card with the wrong content type. Pick one component. Likewise a 999-rounded "card" reads as a chip.

---

## 6. Brand red painted on more than three slots per screen

**Rule violated**: `tokens.usage.json#sys.color.brand.maxInstancesPerScreen: 3`. Brand is a marker; too many instances dilute meaning.

Canonical instances on a single screen:

1. **Create entry on `tab-bar/item--primary`** — exactly 1.
2. **Active-like state on Feed items** — ≤ 2.
3. **Promotional banner accent** — 0–1 (optional).

```jsx
// ❌ Wrong — brand red painted on every CTA, HOT badge, save icon, header
<NavigationBar title={<span style={{ color: 'var(--sys-color-brand)' }}>Blind</span>} />
<button style={{ background: 'var(--sys-color-brand)' }}>Sign up</button>
<Badge style={{ background: 'var(--sys-color-brand)' }}>HOT</Badge>
<button style={{ background: 'var(--sys-color-brand)' }}>Save</button>
<TabBar items={[{ label: 'Create', icon: <PlusIcon />, primary: true }, …]} />
// 5 brand instances — caps at 3

// ✅ Right — brand reserved for editorial markers; commits use primary
<NavigationBar title={<img src="/blind_logotype_black.svg" alt="Chorus" />} />
<Button>Sign up</Button>                              {/* primary commit */}
<Badge appearance="hot">HOT</Badge>                   {/* HOT marker — brand */}
<Button variant="text" appearance="accent">Save</Button>
<TabBar items={[{ label: 'Create', icon: <PlusIcon />, primary: true }, …]}/>
// brand instances: 1 (HOT badge) + 1 (Create tab) = 2 ≤ 3
```

---

## 7. Typography sized below 12px for visible copy

**Rule violated**: [`compose.md`](compose.md) § Type ramp picker — the smallest rung for visible copy is `sys.typo.caption.md` (12px). Below breaks Korean / CJK hierarchy and accessibility minima.

```jsx
// ❌ Wrong — 11px meta line, 10px engagement count
<span style={{ fontSize: 11 }}>익명 · 2시간 전</span>
<span style={{ fontSize: 10 }}>2.1k views</span>

// ✅ Right — meta on caption.md (12px), engagement on label.sm (12px)
<span style={{ font: 'var(--sys-typo-caption-md)' }}>익명 · 2시간 전</span>
<span style={{ font: 'var(--sys-typo-label-sm)' }}>2.1k views</span>
```

Agents commonly under-size compact text to "look denser." The 12px floor is the contract — take the next-larger rung when in doubt.

---

## 8. Feed item missing the `thumbnail` slot

**Rule violated**: `feed/post.spec.json#forbidden` — every feed post carries the thumbnail slot.

```jsx
// ❌ Wrong — feed item with no thumbnail
<Feed items={[
  { id: 1, title: '연봉협상 어떻게 하셨나요?', body: '...', meta: '익명 · 2시간 전' }
]} />

// ✅ Right — thumbnail slot filled (real subject if inferable, else placeholder)
<Feed items={[
  {
    id: 1,
    title: '연봉협상 어떻게 하셨나요?',
    body: '...',
    meta: '익명 · 2시간 전',
    thumbnail: { src: '/placeholder.png', alt: '' }, // fallback when no subject
  }
]} />
```

Same rule for FeedAd media, ProfileCarousel cover, Thumbnail itself. When no context-appropriate image can be inferred, use `/placeholder.png` — never an icon-in-a-tinted-circle, empty `src`, or inline SVG wordmark.

---

## 9. Banner painted with `brandContainer` as the default background

**Rule violated**: [`compose.md`](compose.md) § Composition guard rails #6 — banner role decides fill. Informational → `primaryContainer`; promotional → `surfaceContainerLow`; error notice → `errorContainer`. `brandContainer` is reserved for explicit *promotional* tinted strips.

```jsx
// ❌ Wrong — informational banner painted with brand tint
<Banner
  style={{ background: 'var(--sys-color-brandContainer)' }}
  title="이직, 더 똑똑하게"
  body="블라인드 하이어"
/>

// ✅ Right — informational banner uses primaryContainer
<Banner
  variant="informational"
  title="이직, 더 똑똑하게"
  body="블라인드 하이어"
/>
```

The Banner variant prop picks the fill. Don't inline-style the background.

---

## 10. Surface stacked more than two tiers deep

**Rule violated**: [`compose.md`](compose.md) § Composition guard rails #4 — surface tier cap is 2 per screen (`surface` + one `surface*Container` rung). A third nested tone reads as muddy.

```jsx
// ❌ Wrong — surface → surfaceContainerLow → surfaceContainerHigh → surfaceContainerHighest
<main style={{ background: 'var(--sys-color-surface)' }}>
  <section style={{ background: 'var(--sys-color-surfaceContainerLow)' }}>
    <div style={{ background: 'var(--sys-color-surfaceContainerHigh)' }}>
      <div style={{ background: 'var(--sys-color-surfaceContainerHighest)' }}>
        {/* four nested surface tones — visually muddy */}
      </div>
    </div>
  </section>
</main>

// ✅ Right — page surface + one container tier max; for additional grouping,
//   promote the inner block to a different component family (Banner, Card, Section)
<main style={{ background: 'var(--sys-color-surface)' }}>
  <Section label="Today's top">
    <Banner variant="informational">…</Banner>  {/* primaryContainer fill — different family */}
    <Feed items={…} />                          {/* surface — same tier as page */}
  </Section>
</main>
```

---

## 11. CTA rendered as raw `<button>` / `<a>` with Tailwind

**Rule violated**: AGENTS.md hard rule — all interactive commits go through `@blind-dsai/ui` button family.

```jsx
// ❌ Wrong — DIY button with Tailwind
<button className="rounded-full bg-blue-500 text-white px-4 py-2">
  See all
</button>

// ✅ Right — Button family by intent
<Button variant="text" appearance="accent">See all</Button>
```

Link-affordance text (See all, Follow, View details) uses `Button variant="text" appearance="accent"`. Primary commits use `Button variant="standard"`. Icon-only commits use `Button variant="icon"`.

---

## 12. FormField rendered as raw `<input>` + `<label>`

**Rule violated**: `form-field/*.spec.json#forbidden` — FormField is `visualReuse: "locked"`. The contract is the focus / error / helper-text state machine.

```jsx
// ❌ Wrong — DIY input chrome
<label>
  Email
  <input
    type="email"
    className="border rounded-lg px-3 py-2 focus:border-blue-500"
  />
</label>

// ✅ Right — FormField with the search / input / select variant
<FormField
  variant="input"
  label="Email"
  type="email"
  helperText="We never share your email."
/>
```

Same rule for search input (`variant="search"`) and select (`variant="select"`).

---

## 13. Image-area `<img src="/placeholder.png">` 404 in the consumer's public root

**Rule violated**: [`LOVABLE.md`](LOVABLE.md) § A.0 — the bundled `placeholder.png` MUST be copied into the consumer app's `public/` once at setup.

Every image-area scaffold (`<Thumbnail src="/placeholder.png">`, `<FeedAd media={{ src: '/placeholder.png' }}>`, `<ProfileCarousel items={[{ cover: { src: '/placeholder.png' } }]} />`, …) addresses a **root-relative URL**. Vite / Next / Remix serve from `public/` root; if the file is missing, the browser fetches `/placeholder.png` → 404 → paints a broken-image glyph **on top of** the CSS layer's data-URL background. The CSS fallback alone is not enough — the inline `<img>` is opaque over the background.

**Diagnostic (run before composing):** DevTools → Network → refresh → look for 404 on `/placeholder.png`. Missing request entirely = scaffold didn't address an image slot (see #8); 404 = you skipped the §A.0 copy step.

```bash
# ❌ Wrong — package installed, scaffolds reference /placeholder.png, but consumer's public/ is empty.
#    Result: every image-area slot paints a broken-image glyph over the CSS fallback.
npm install @blind-dsai/ui @blind-dsai/tokens
# (no copy step)

# ✅ Right — one command after install, then every scaffold below resolves.
npm install @blind-dsai/ui @blind-dsai/tokens
cp node_modules/@blind-dsai/ui/placeholder.png public/
```

Do NOT work around with an invented stock URL, inline SVG wordmark, `display: none` on the `<img>`, or pointing every `src` at the CDN-hosted PNG — those break the §A.0 contract and the AGENTS.md "one universal placeholder" rule. The fix is the one-line `cp`; scaffolds stay as-shipped.

---

## When you spot one of these

1. Stop composing.
2. Re-read the rule cited in the entry.
3. Discard the offending block and regenerate from the right-side snippet.
4. Run the LOVABLE.md §E pre-flight checklist + §E rail self-diagnostic.

A violation surviving both passes is a Chorus gap report, not a permission slip — flag in one line and stop.
