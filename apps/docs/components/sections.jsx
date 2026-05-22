import { Fragment } from 'react';
import Link from 'next/link';
import { Badge } from '@blind-dsai/ui';
import { NotificationIcon, ChatIcon, MentionIcon } from '@blind-dsai/ui/icons';
import { asset } from '../lib/asset';
import { groupByPrefix, toCssVarName } from '../lib/tokens';
import { slugify as slugifyTitle } from '../lib/slugify';
import { SemTable } from './SemTable';
import { TokenChip, TokenTrimScope, TokenTrimContext } from './TokenTrim';

// Render the inline-markdown subset DESIGN.md uses inside table Role cells:
// `code`, **strong**. No links / lists / nesting — keep it small.
function renderInline(text) {
  if (text == null) return null;
  const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <TokenChip key={i}>{part.slice(1, -1)}</TokenChip>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Render the DESIGN.md "Value" column as a meta line. Falls back to base
// $value, expands to "mobile → web" when a token defines a $responsive.web
// step-up (matching the DESIGN.md "Value (mobile → web)" header).
function formatTokenValue(token) {
  if (!token) return null;
  const base = token.$value;
  const web = token.$responsive?.web;
  if (web != null && web !== base) return `${base} → ${web}`;
  return base ?? null;
}

// Token-cell head: chip + optional value, baseline-aligned on the same row.
// Value sits right of the chip so the description below carries only prose.
function TokenHead({ name, value, rem, multiplier, swatch }) {
  const hasMeta = value != null || rem || multiplier;
  return (
    <div className="sem-cell sem-cell-token">
      <TokenChip swatch={swatch}>{name}</TokenChip>
      {hasMeta ? (
        <span className="sem-role-meta">
          {multiplier ? <>{multiplier}<span className="sem-role-meta-rem"> · </span></> : null}
          {rem ? <>{rem}<span className="sem-role-meta-rem"> · </span></> : null}
          {value != null ? value : null}
        </span>
      ) : null}
    </div>
  );
}

function BreakpointLabel({ breakpoint }) {
  const label = breakpoint === 'web' ? 'WEB' : 'MOB';
  return <span className="breakpoint-label">{label}</span>;
}

// Role-table head — Token / Role / Preview labels. The shared default for
// every `<RoleTable>`; callers can pass a custom JSX `head` to override.
function RoleTableHead({ tokenLabel = 'Token', roleLabel = 'Role', previewLabel = 'Preview', showChip = true }) {
  return (
    <div className={`sem-table-head${showChip ? '' : ' sem-table-head--no-chip'}`}>
      <div className="sem-cell sem-cell-token">{tokenLabel}</div>
      <div className="sem-cell sem-cell-role">{roleLabel}</div>
      {showChip ? <div className="sem-cell sem-cell-chip">{previewLabel}</div> : null}
    </div>
  );
}

// Role-table — token + prose + chip preview, three columns, header visible.
// `head` accepts either JSX (custom head) or an options object spread into
// the default `<RoleTableHead>`. `head={null}` suppresses the head.
// `tokens` (optional) is an explicit list of fully-qualified token names
// rendered inside this table; when present, chips matching the list have
// their shared namespace prefix trimmed at display time. See TokenTrim.
function RoleTable({ title, head, tokens, className, children }) {
  let headEl;
  if (head === null) headEl = null;
  else if (head == null) headEl = <RoleTableHead />;
  else if (typeof head === 'object' && !head.type) headEl = <RoleTableHead {...head} />;
  else headEl = head;
  const table = (
    <SemTable className={className ? `role-table ${className}` : 'role-table'}>
      {title ? <div className="sem-table-title">{title}</div> : null}
      {headEl}
      <div className="sem-table-body">{children}</div>
    </SemTable>
  );
  return tokens ? <TokenTrimScope tokens={tokens}>{table}</TokenTrimScope> : table;
}

// Equal-column table — N columns share the row at 1:1:...:1, head visible.
// Use for DESIGN.md tables whose columns carry equal weight (need/token/value
// lookups, axis comparisons) rather than the token-vs-prose proportions of
// RoleTable. The CSS variable `--equal-cols` drives the grid.
// `tokens` (optional) — see RoleTable.
function EqualTable({ headers, rows, tokens }) {
  const table = (
    <SemTable className="equal-cols" style={{ '--equal-cols': headers.length }}>
      <div className="sem-table-head">
        {headers.map((h, i) => (
          <div key={i} className="sem-cell">{h}</div>
        ))}
      </div>
      <div className="sem-table-body">
        {rows.map((cells, i) => (
          <div key={i} className="sem-row">
            {cells.map((c, j) => (
              <div key={j} className="sem-cell">{c}</div>
            ))}
          </div>
        ))}
      </div>
    </SemTable>
  );
  return tokens ? <TokenTrimScope tokens={tokens}>{table}</TokenTrimScope> : table;
}

function RefAndValue({ refPath, value }) {
  return (
    <>
      {refPath ? <TokenChip>${refPath}</TokenChip> : null}
      {refPath && value != null ? <span className="sem-dot"> · </span> : null}
      {value != null ? <span>{value}</span> : null}
    </>
  );
}

function RoleCell({ role }) {
  return (
    <div className="sem-cell sem-cell-role">
      {role != null ? <span className="sem-role-text">{role}</span> : null}
    </div>
  );
}

/* Section + ProseSection emit flat fragments — h2 / h3 / p with no extra
   classes, and any further children. Typography and spacing are owned by
   tag selectors under .page-content in globals.css (markdown-preview style),
   so the markup stays as small as a rendered markdown document. The id
   attaches to the h2 for anchor linking. */
function Section({ id, title, description, children }) {
  const sectionId = id ?? (title ? slugifyTitle(title) : undefined);
  return (
    <>
      {title ? <h2 id={sectionId}>{title}</h2> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </>
  );
}

function ProseSection({ title, id, children }) {
  const headingId = id ?? (title ? slugifyTitle(title) : undefined);
  return (
    <>
      {title ? <h3 id={headingId}>{title}</h3> : null}
      {children}
    </>
  );
}

function ColorBar({ path, value, step, overlay }) {
  const stepNum = step != null ? parseInt(step, 10) : null;
  const hasStep = stepNum != null && !Number.isNaN(stepNum);
  // Solid palettes: step ≤400 is a light hue → dark text; ≥500 is a dark hue → light text.
  // Yellow is the exception — its 500 stays bright (does not pass white-on-color contrast),
  // so the dark-band threshold lifts to 600 just for yellow.
  // Overlay palettes: composite over the backing only crosses 50% lightness between
  // step 700 (40% alpha) and 800 (64% alpha) — push the threshold up so the lower
  // overlay steps still render readable text on their fixed backing.
  const isYellow = typeof path === 'string' && path.startsWith('yellow.');
  const lowThreshold = overlay ? 700 : isYellow ? 500 : 400;
  const stepRange = hasStep && stepNum <= lowThreshold ? 'low' : 'high';

  return (
    <div
      className="color-bar"
      data-overlay={overlay || undefined}
      data-step-range={hasStep ? stepRange : undefined}
      style={{ background: value }}
    >
      <span className="color-bar-name">{path}</span>
      <span className="color-bar-meta">{value}</span>
    </div>
  );
}

export function TokenArchitecture() {
  return (
    <Section
      title="Token architecture"
      id="token-architecture"
      description={
        <>Three tiers — <em>reference → system → component</em> — partition the token surface by intent.</>
      }
    >
      <ProseSection>
        <ul className="rule-list">
          <li><strong>Reference tier</strong> (<code>ref.*</code>) — raw palettes and scales with no opinion about usage. <code>ref.palette.neutral.500</code>, <code>ref.fontSize.200</code>, <code>ref.space.400</code>. The material.</li>
          <li><strong>System tier</strong> (<code>sys.*</code>) — semantic roles that consume the reference tier. <code>sys.color.primary</code>, <code>sys.layout.page.md</code>, <code>sys.elevation.floating</code>. The vocabulary product surfaces speak in.</li>
          <li><strong>Component tier</strong> (<code>comp.*</code>) — per-component tokens that bind system roles to a component&apos;s own contract. Reserved for components reused widely enough that naming the composition earns its keep.</li>
        </ul>
        <p><strong>Default to two tiers.</strong> Most surfaces consume the system tier directly. The component tier is opt-in: a new <code>comp.*</code> token must clear two bars — (1) the component is reused broadly across the product, and (2) the same composition of system roles recurs in enough places that giving it a name reduces drift more than the indirection costs.</p>
        <p><strong>Components never reference the palette directly.</strong> Whether a component speaks system tokens inline or resolves through component-tier tokens, the chain always lands on system → reference. This is what makes rebrands cheap: swap <code>ref.*</code>, the system keeps its shape, and every component follows.</p>
        <p>In CSS the tokens surface as custom properties under the pattern <code>--&lt;tier&gt;-&lt;group&gt;-&lt;name&gt;</code>: <code>var(--sys-color-primary)</code>, <code>var(--ref-space-200)</code>, <code>var(--sys-layout-page-md)</code>. The tier prefix is preserved in CSS so a <code>var(--ref-…)</code> reference inside a component shows up as a code-review signal.</p>
        <p><strong>JSON shape.</strong> Token files follow the <a href="https://tr.designtokens.org" target="_blank" rel="noreferrer">Design Tokens Community Group (DTCG)</a> draft: each leaf carries <code>$value</code>, optional <code>$type</code>, and Chorus-specific extensions (<code>$rem</code>, <code>$multiplier</code>, <code>$responsive.web</code>) namespaced under <code>$</code> so DTCG-aware tooling reads the values without choking on the extras. Aliases use the DTCG <code>{'{ref.palette.blue.500}'}</code> reference syntax. Conformance is partial-by-intent: Chorus follows the schema where it helps interop and adds what it needs where the spec is silent.</p>
      </ProseSection>
    </Section>
  );
}

export function AboutChorus() {
  return (
    <Section
      title="About Chorus"
      id="about-chorus"
      description={
        <><strong>Chorus</strong> is the design system behind our product — a platform built on the belief that <em>your voice matters</em>.</>
      }
    >
      <ProseSection>
        <p>A chorus is what happens when individual voices, each with its own timbre, come together without losing what makes them distinct. No single voice is drowned out; the whole exists only because every part is heard. That is the shape of the community we build for: workplace professionals, students, and anyone who speaks more freely when their name is not the thing being judged.</p>
      </ProseSection>
    </Section>
  );
}

export function WhatThisMeans() {
  return (
    <Section
      title="What this means for the system"
      id="what-this-means"
      description={
        <>Four convictions follow from the <em>your voice matters</em> premise — the principles every concrete decision in this document derives from.</>
      }
    >
      <ProseSection>
        <ul className="rule-list">
          <li><strong>Every voice matters, so every token matters.</strong> Color, type, space, radius, and elevation are the smallest units of our product&apos;s voice. They are defined once, in the open, and every surface sings from the same score.</li>
          <li><strong>Harmony over uniformity.</strong> Chorus does not flatten difference — it arranges it. Components are built to stay recognizably themselves across contexts (light and dark, professional and student, mobile and desktop) while still belonging to one system.</li>
          <li><strong>Clarity is how we amplify.</strong> An anonymous voice only carries when the interface around it is legible, calm, and trustworthy. Chorus exists to remove friction between what a person wants to say and how clearly it reaches the people who should hear it.</li>
          <li><strong>The system is the score, not the performance.</strong> Product surfaces are the performance; Chorus is the notation that makes the performance repeatable, reviewable, and shared. When the score changes, the whole chorus changes together.</li>
        </ul>
      </ProseSection>
    </Section>
  );
}

export function Scope() {
  return (
    <Section
      title="Scope"
      id="scope"
      description="Chorus covers the foundations — tokens, typography, spacing, color, elevation, and the primitive components built on top of them — and the documentation that keeps them coherent as the product and the community grow."
    />
  );
}

export function VisualTheme() {
  return (
    <Section
      title="Visual theme & Atmosphere"
      id="visual-theme"
      description={
        <>Chorus is the design language of a community product where text volume is high, mixed-script (Hangul + Latin) is the norm, and the brand voice is <em>clear, calm, trustworthy</em>. The system reads the way a well-tuned chorus sounds: distinct voices arranged into one coherent whole. Visually, that translates to a near-monochromatic neutral foundation, a single restrained brand accent (Blue 500 <code>#2563eb</code>), and shape and tone choices that prefer composure over expressiveness.</>
      }
    >
      <ProseSection>
        <p>Chorus is modeled after <strong>Material Design 3 (M3)</strong> — specifically, its three-tier <em>reference → system → component</em> token architecture and its semantic color role vocabulary. M3 is Chorus&apos;s only external reference point; every other decision is Chorus&apos;s own. The single typeface is <strong>Pretendard</strong>, chosen for its mixed-script balance.</p>
      </ProseSection>
    </Section>
  );
}

/* ============================================================
   Color
   ============================================================ */

const REFERENCE_PALETTES = ['neutral', 'red', 'green', 'blue', 'yellow', 'purple'];
const OVERLAY_PALETTES   = ['black', 'white'];

function PaletteGroup({ tokens, name, overlay }) {
  const items = groupByPrefix(tokens, `ref.palette.${name}`);
  return (
    <div className="color-group">
      <div className="color-group-name">{name}</div>
      <div className="color-stack">
        {Object.entries(items).map(([key, token]) => (
          <ColorBar
            key={key}
            path={`${name}.${key}`}
            step={key}
            value={token.$value}
            overlay={overlay}
          />
        ))}
      </div>
    </div>
  );
}

function ColorReferencePalettes({ tokens }) {
  return (
    <Section
      title="Reference palettes"
      id="color-reference"
      description="Six solid palettes share a single 0–1000 lightness curve, tuned so the same numeric step lands at a perceptually similar brightness across hues. This consistency is what lets the system meet WCAG AA contrast by construction: pairing a 50–400 background with a 700–900 foreground (or vice versa) clears the 4.5:1 threshold for body text across every palette, and the same pairing rules transfer cleanly between hues."
    >
      <ProseSection title="Lightness ramp">
        <p>Each palette is a one-dimensional ramp keyed by lightness (light → dark, 0 → 1000), partitioned into four functional bands plus two endpoint anchors. The band a step falls in determines the kind of role it can serve: <strong>endpoints (0, 1000)</strong> anchor pure ends, <strong>lower bands (50–400)</strong> carry surfaces, <strong>brand step (500)</strong> anchors hue identity, <strong>upper bands (600–900)</strong> carry foregrounds. Numeric step is identical across hues, so a role defined on one palette transfers to another by swapping the hue family.</p>
        <p><strong>Only system tokens may reference these palette steps.</strong> Components never consume <code>ref.palette.*</code> directly.</p>
      </ProseSection>
      <div className="specimen-grid">
        {REFERENCE_PALETTES.map(name => (
          <PaletteGroup key={name} tokens={tokens} name={name} />
        ))}
      </div>
    </Section>
  );
}

function ColorOverlayPalettes({ tokens }) {
  return (
    <Section
      title="Overlay palettes"
      id="color-overlay"
      description={
        <><code>ref.palette.black</code> and <code>ref.palette.white</code> share the 0–1000 step axis with the solid palettes, but the axis is <strong>opacity</strong>, not lightness. Each step's alpha value is drawn from the <a href={asset("/spacing#base-unit-ladder")}>base-unit ladder</a> read as percent, so the alphas snap to the same numeric set the spacing scale uses. Compositing over the underlying surface lets the surface tint bleed through, which keeps overlays consistent across themed backgrounds.</>
      }
    >
      <ProseSection title="Opacity ramp">
        <p>A single one-dimensional opacity ramp (<code>0</code> → <code>1000</code>), partitioned into three functional bands by alpha intensity. The ladder rungs (<code>0 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 64 · 80 · 100%</code>) are drawn from the <a href={asset("/spacing#base-unit-ladder")}>base-unit ladder</a> read as percent — same numeric set as the spacing scale, with <code>100%</code> appended as a color-specific endpoint for fully-opaque overlays (<code>color.focus</code>, <code>color.elevation</code>). Three bands: <em>veil</em> (50–600 / 4–24%, used by <code>sys.elevation.*</code> shadows and <code>sys.state.*</code> overlays), <em>scrim</em> (700–900 / 40–80%, used by <code>color.scrim</code> and heavy modal/drawer dim), and <em>endpoint</em> (<code>0</code> transparent · <code>1000</code> fully opaque). <code>ref.palette.white.*</code> mirrors <code>ref.palette.black.*</code> step-for-step so dark-mode equivalents resolve identically.</p>
      </ProseSection>
      <div className="specimen-grid">
        {OVERLAY_PALETTES.map(name => (
          <PaletteGroup key={name} tokens={tokens} name={name} overlay={name} />
        ))}
      </div>
    </Section>
  );
}

function SystemRow({ tokens, name, role }) {
  const token = tokens[`sys.color.${name}`];
  if (!token) return null;
  const cssVar = toCssVarName(`sys.color.${name}`);
  return (
    <div className="sem-row sem-row--no-chip">
      <div className="sem-cell sem-cell-token">
        <TokenChip swatch={`var(${cssVar})`}>$sys.color.{name}</TokenChip>
      </div>
      <RoleCell role={renderInline(role)} />
    </div>
  );
}

function SystemTable({ tokens, title, rows }) {
  // Each row renders `<TokenChip>$sys.color.{name}</TokenChip>` — feed those
  // names to the trim scope so the chips render as `$primary` / `$onPrimary`
  // / etc. instead of all repeating `$sys.color.`.
  const chipTokens = rows.map((r) => `$sys.color.${r.name}`);
  return (
    <RoleTable title={title} tokens={chipTokens} head={{ showChip: false }} className="sem-table--color">
      {rows.map(r => (
        <SystemRow key={r.name} tokens={tokens} name={r.name} role={r.role} />
      ))}
    </RoleTable>
  );
}

const ACCENT_GROUPS = [
  {
    title: 'Primary',
    rows: [
      { name: 'primary',            role: 'The brand color and highest-attention accent. Use sparingly for one dominant action per view (primary CTA, selected tab underline, active toggle fill, progress indicator). Two primary buttons in a view collapse the hierarchy. Resolves to `ref.palette.blue.500` in both modes — the brand hue is saturated enough to clear AA against `surface` in both light (white) and dark (`neutral.900`), so the CTA reads as the same blue across themes without a tonal nudge.' },
      { name: 'onPrimary',          role: 'Foreground placed on top of `primary`. Label text, icons, and spinners inside primary-filled surfaces. Always pair with `primary`; never against a neutral surface. Resolves to `ref.palette.neutral.50`.' },
      { name: 'primaryContainer',   role: 'Low-chroma tinted surface in the primary family. Selected-state list backgrounds, informational callouts, highlighted message bubbles, brand-flavored section banners. Safe on larger areas where `primary` would overwhelm. Resolves to `ref.palette.blue.50` (light) / `ref.palette.blue.900` (dark) — light sits one step brighter than the other accent containers (`error` uses `*.100`) because primary appears most often and a heavier tint competes with content.' },
      { name: 'onPrimaryContainer', role: 'Foreground for content placed on `primaryContainer`. Text, icons, and links inside primary-tinted surfaces. Resolves to `ref.palette.blue.600` (light) / `ref.palette.blue.400` (dark) — both stay in the saturated primary family so the foreground reads as *blue* on both tinted backgrounds, instead of collapsing to near-black on the light tint or muddying into the deep container on the dark tint. The dark step lifts one band higher than light’s mirror would suggest because identical luminance gaps read darker on dark surfaces.' },
    ],
  },
  {
    title: 'Secondary',
    rows: [
      { name: 'secondary',            role: 'A neutral accent for supporting actions that should feel present but not brand-loud. Secondary CTAs paired beside a primary button, quiet filled controls, selection highlights where a colored brand fill would be distracting. Unlike the chromatic accents, this family inverts between light and dark modes. Resolves to `ref.palette.neutral.700` (light) / `ref.palette.neutral.300` (dark).' },
      { name: 'onSecondary',          role: 'Foreground placed on top of `secondary`. Label text and icons inside secondary-filled surfaces. Resolves to `ref.palette.neutral.50` (light) / `ref.palette.neutral.900` (dark).' },
      { name: 'secondaryContainer',   role: 'Low-contrast neutral surface in the secondary family. Subtle backgrounds that need to separate from the page without implying brand meaning: tonal chip fills, quiet badges, muted selection backgrounds, segmented-control tracks, secondary button fills. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.600` (dark). The dark step sits two bands lighter than the main surface ladder (`neutral.800`) — one extra step beyond `neutral.700` so the secondary fill stays distinct from `surfaceContainerHighest` (the topmost surface band) on overlay hosts like menus, tooltips, and filled inputs.' },
      { name: 'onSecondaryContainer', role: 'Foreground for content placed on `secondaryContainer`. Resolves to `ref.palette.neutral.900` (light) / `ref.palette.neutral.100` (dark).' },
    ],
  },
  {
    title: 'Brand',
    rows: [
      { name: 'brand',            role: 'The product\'s signature red — a high-attention accent reserved for notification counts, unread badges, eyebrow flags, and brand-identity moments (logomark fills, brand-tagged callouts). One tonal step brighter than `error` in both modes (`red.500` brand vs. `red.600` / `red.700` error), so the two reds stay visually distinct on the same surface: brand reads as energetic identity, error reads as a deeper destructive signal. Resolves to `ref.palette.red.500` in **both** light and dark modes — brand identity stays stable across themes, and the 500 step is the brightest red the palette ships that still clears AA against `onBrand` (`neutral.50`) for white-on-brand labels.' },
      { name: 'onBrand',          role: 'Foreground placed on top of `brand`. Label text and icons inside brand-filled surfaces (notification counts, brand badges). Resolves to `ref.palette.neutral.50`. White-on-`red.500` lands at ~4.7:1 — clears AA for normal text in both modes.' },
      { name: 'brandContainer',   role: 'Low-chroma tinted surface in the brand family. Soft brand callouts, "what\'s new" banners, promotional tiles, marketing surfaces where the energy of `brand` would overwhelm. Resolves to `ref.palette.red.50` (light) / `ref.palette.red.900` (dark). Light is one step lighter than `errorContainer` (`red.50` vs. `red.100`) so the brand callout reads as a quiet identity touch rather than a warning.' },
      { name: 'onBrandContainer', role: 'Foreground for content placed on `brandContainer`. Resolves to `ref.palette.red.600` (light) / `ref.palette.red.400` (dark) — both stay in the saturated red family so the foreground reads as *red on tinted red*, not as *near-black on tinted red*. The dark step lifts one band higher than light\'s mirror would suggest because identical luminance gaps read darker on dark surfaces.' },
    ],
  },
  {
    title: 'Success',
    rows: [
      { name: 'success',            role: 'The signal color for positive confirmation — completed states, success toasts, "saved" pills, validated form fields, healthy status indicators. Reserved strictly for affirmative outcomes; decorative use erodes its signaling power. Resolves to `ref.palette.green.500` in **both** light and dark modes — mirrors `brand`\'s cross-mode stability so the success signal reads as the same green across themes, and the 500 step is the brightest green the palette ships that still clears AA against `onSuccess` (`neutral.50`) for white-on-success labels.' },
      { name: 'onSuccess',          role: 'Foreground placed on top of `success`. Label text and icons inside success-filled surfaces. Resolves to `ref.palette.neutral.50`.' },
      { name: 'successContainer',   role: 'Low-chroma tinted surface in the success family. Soft success callouts, "you\'re all set" banners, completed-task tiles where `success` would overwhelm. Resolves to `ref.palette.green.50` (light) / `ref.palette.green.900` (dark) — mirrors `brandContainer`\'s shallow-light / deep-dark structure.' },
      { name: 'onSuccessContainer', role: 'Foreground for content placed on `successContainer`. Resolves to `ref.palette.green.600` (light) / `ref.palette.green.400` (dark) — both stay in the saturated green family so the foreground reads as *green on tinted green*, not as *near-black on tinted green*. The dark step lifts one band higher than light\'s mirror would suggest because identical luminance gaps read darker on dark surfaces.' },
    ],
  },
  {
    title: 'Error',
    rows: [
      { name: 'error',            role: 'The signal color for destructive and error states. Destructive CTAs (Delete, Remove), form-field error outlines, critical status indicators, alert icons. Reserved strictly for negative or dangerous meaning — decorative use erodes its signaling power. One tonal step darker than `brand` (red.500) in both modes so destructive moments sit deeper and graver than brand-identity moments on the same screen. Resolves to `ref.palette.red.600` (light) / `ref.palette.red.700` (dark).' },
      { name: 'onError',          role: 'Foreground placed on top of `error`. Label text and icons inside error-filled surfaces. Resolves to `ref.palette.neutral.50`.' },
      { name: 'errorContainer',   role: 'Low-chroma tinted surface in the error family. Inline error message backgrounds, warning banners, failed-state tiles. Less alarming than `error`, so appropriate for larger areas. Resolves to `ref.palette.red.100` (light) / `ref.palette.red.900` (dark).' },
      { name: 'onErrorContainer', role: 'Foreground for content placed on `errorContainer`. Resolves to `ref.palette.red.700` (light) / `ref.palette.red.500` (dark).' },
    ],
  },
];

const SURFACE_BASE_ROWS = [
  { name: 'surface',          role: 'The base page background — the canvas everything else sits on. Root app background, empty regions, any large flat area that should read as the "ground" of the UI. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.900` (dark).' },
  { name: 'onSurface',        role: 'Primary foreground against `surface`. Body copy, headings, primary icons. Clears WCAG AA against every `surface*` token. Resolves to `ref.palette.neutral.900` (light) / `ref.palette.neutral.50` (dark).' },
  { name: 'surfaceVariant',   role: 'A quiet alternate surface tone. Visually separates a region from the page without raising it: input field fills, disabled control backgrounds, zebra-striping, muted section backgrounds. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.800` (dark).' },
  { name: 'onSurfaceVariant', role: 'Secondary foreground for lower-emphasis text on any surface tone. Supporting copy, placeholders, helper text, metadata, inactive icon fills. Deliberately lighter than `onSurface` to establish a two-tier text hierarchy. Resolves to `ref.palette.neutral.700` (light) / `ref.palette.neutral.300` (dark).' },
  { name: 'surfaceDim',       role: 'A darker variant of `surface` — the darkest base background. Use when the page behind an elevated element needs to recede (dimmed canvas behind a modal/drawer, "quiet" screens where raised cards carry the focus). Resolves to `ref.palette.neutral.200` (light) / `ref.palette.neutral.900` (dark).' },
  { name: 'surfaceBright',    role: 'A brighter variant of `surface` — the brightest base background. Spotlight moments where the base layer itself should feel elevated (hero regions, focus screens, brightened split-view panels). Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.800` (dark).' },
];

const SURFACE_CONTAINER_ROWS = [
  { name: 'surfaceContainerLowest',  role: 'Elevation level 0 — the lowest tier in the container stack. The most recessed tone: a soft notch beneath `surface` in light mode, the true palette floor (pure black) in dark mode. Sunken or inset regions: input wells, disabled control bodies, trough/rail backgrounds, page-header recessed bands. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.1000` (dark).' },
  { name: 'surfaceContainerLow',     role: 'Elevation level 1 — low-prominence containers. Backgrounded secondary panels, sidebar sections, cards that should feel "attached" to the page rather than floating. Less recessed than `surfaceContainerLowest`. Resolves to `ref.palette.neutral.100` (light) / `ref.palette.neutral.900` (dark).' },
  { name: 'surfaceContainer',        role: 'Elevation level 2 — the default container tone. Standard cards, list items, feed tiles, most everyday content surfaces. Start here when in doubt. In light mode this matches `surface`; in dark mode it is one tonal step above `surface`. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.800` (dark).' },
  { name: 'surfaceContainerHigh',    role: 'Elevation level 3 — the "raised" tone. Two families share this fill: (a) **scrim-anchored interruptions** — modals and dialogs, search view, bottom sheets, expanded navigation drawers; and (b) **in-page raised chrome** — bottom app bar, FAB surface variant, filter / toolbar / toggle button bodies (and the chip-chrome tabs that inherit them), selected cards, nested emphasized sections, neutral placeholder fills. Tonally identical to `surfaceContainer` in both modes — visible lift comes from `elevation.overlay` (for scrim-anchored surfaces) or `elevation.floating` (for in-page raised containers), not an ever-brightening fill. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.800` (dark).' },
  { name: 'surfaceContainerHighest', role: 'Elevation level 4 — the topmost container tone, reserved for the *most* lifted surfaces that float over everything else without their own scrim. Menus, tooltips, popovers, filled text-field bodies, search bars. In light mode matches `surfaceContainer`; in dark mode steps up one tier so the topmost layer reads against the stack beneath it, reinforced by `elevation.overlay`. Resolves to `ref.palette.neutral.0` (light) / `ref.palette.neutral.700` (dark).' },
];

const UTILITY_GROUPS = [
  {
    title: 'Outline',
    rows: [
      { name: 'outline',        role: 'High-emphasis border. Outlined buttons, form field borders, selected-state strokes, dividers that need to carry visual weight. Resolves to `ref.palette.neutral.400` (light) / `ref.palette.neutral.500` (dark).' },
      { name: 'outlineVariant', role: 'Low-emphasis border. Subtle dividers, table row separators, card edges, decorative hairlines where `outline` would be too loud. Resolves to `ref.palette.neutral.200` (light) / `ref.palette.neutral.800` (dark).' },
    ],
  },
  {
    title: 'Inverse',
    rows: [
      { name: 'inverseSurface',   role: 'A surface that deliberately reverses the current mode — dark in light mode, light in dark mode. Components that must visually contrast with the surrounding page to grab attention: snackbars, toast backgrounds, coach-mark tooltips, onboarding highlights. Resolves to `ref.palette.neutral.900` (light) / `ref.palette.neutral.50` (dark).' },
      { name: 'inverseOnSurface', role: 'Foreground on `inverseSurface`. Text and icons inside inverted surfaces. Resolves to `ref.palette.neutral.50` (light) / `ref.palette.neutral.900` (dark).' },
    ],
  },
  {
    title: 'Focus',
    rows: [
      { name: 'focus',      role: 'Outer focus-ring color. Intentionally inverse-toned — dark in light mode, light in dark mode — so the ring reads against any surface in the stack regardless of the control’s own fill. See [Focus ring composition](#focus-ring-composition) for the full three-layer rule. Resolves to `ref.palette.black.1000` (light) / `ref.palette.white.1000` (dark).' },
      { name: 'focusInset', role: 'Inner counter-ring paired with `focus`. Mirrors `focus` in the opposite direction so even when the outer ring meets a similarly-toned background, the inset edge keeps the indicator legible. Resolves to `ref.palette.white.1000` (light) / `ref.palette.black.1000` (dark).' },
    ],
  },
  {
    title: 'Overlay',
    rows: [
      { name: 'scrim',     role: 'Translucent black used to dim content behind a raised overlay. The backdrop behind modals, drawers, menus, and bottom sheets — focuses attention on the foreground and blocks interaction with the obscured layer. Resolves to `ref.palette.black.800`.' },
      { name: 'elevation', role: 'Base color used to build elevation shadows (composited with opacity inside `elevation.*` definitions). Not for fills — reference only from elevation definitions. Resolves to `ref.palette.black.1000`.' },
    ],
  },
];

function ColorAccentRoles({ tokens }) {
  return (
    <Section
      title="Accent roles"
      id="color-accent"
      description={
        <>Five role families covering brand emphasis (<code>primary</code>), neutral support (<code>secondary</code>), brand-identity attention (<code>brand</code>), positive confirmation (<code>success</code>), and destructive signal (<code>error</code>). The role decides <em>what the color means</em>; the structure below decides <em>how to compose it</em>.</>
      }
    >
      <ProseSection title="Four-token quartet">
        <p>Each accent role (<code>primary</code> / <code>secondary</code> / <code>brand</code> / <code>success</code> / <code>error</code>) ships as a fixed <strong>four-token quartet</strong>: a high-emphasis pair and a low-emphasis pair, with foreground always paired to its background. The quartet is the unit of meaning — never use a fill without its <code>on*</code> foreground, and never read contrast manually. Across the five accents, the <em>role of the accent</em> differs (brand / supporting / identity / confirmation / destructive) but the <em>internal four-slot structure</em> is identical, so the same composition rule (background + paired foreground) applies everywhere.</p>
        <p>The four slots:</p>
        <ul className="rule-list">
          <li><strong>Main pair</strong> — <code>X</code> / <code>onX</code> — high-attention fill for CTAs, emphasis badges, status chips. Use sparingly per view.</li>
          <li><strong>Container pair</strong> — <code>XContainer</code> / <code>onXContainer</code> — low-chroma tinted surface in the same family for callouts, notification tiles, subtle banners. Lower visual weight than the main pair, so safe to use on larger surface areas.</li>
        </ul>
      </ProseSection>
      {ACCENT_GROUPS.map(g => (
        <SystemTable key={g.title} tokens={tokens} title={g.title} rows={g.rows} />
      ))}
    </Section>
  );
}

function ColorSurfaceStack({ tokens }) {
  return (
    <Section
      title="Surface stack"
      id="color-surface"
      description={
        <>Page background and the elevation-tier container surfaces.</>
      }
    >
      <ProseSection title="Three sub-groups">
        <p>Organized along an explicit hierarchy:</p>
        <ol className="rule-list">
          <li><strong>Base canvas</strong> (<code>surface</code> / <code>onSurface</code>) — the foundation everything else sits on. Foreground always pairs with the canvas.</li>
          <li><strong>Canvas modifiers</strong> (<code>surfaceVariant</code> / <code>onSurfaceVariant</code> / <code>surfaceDim</code> / <code>surfaceBright</code>) — alternate base tones for quiet separation, recess, or spotlight. <code>surfaceVariant</code> carries its own paired foreground for two-tier text hierarchy; <code>Dim</code> / <code>Bright</code> keep <code>onSurface</code> as foreground.</li>
          <li><strong>Container ladder</strong> (<code>surfaceContainerLowest</code> → <code>Low</code> → <code>default</code> → <code>High</code> → <code>Highest</code>) — five ordered tiers indicating <em>spatial role</em> (sunken → recessed → default → raised → topmost). In light mode the tones collapse onto <code>#ffffff</code> by design; lift comes from <code>elevation.*</code> shadows. The names carry semantic weight even when the tone is identical.</li>
        </ol>
        <p><code>onSurface</code> is the canonical foreground for the entire stack — every container tier reads against it.</p>
      </ProseSection>
      <SystemTable tokens={tokens} title="Base & Variants"  rows={SURFACE_BASE_ROWS} />
      <SystemTable tokens={tokens} title="Container ladder" rows={SURFACE_CONTAINER_ROWS} />
      <ProseSection>
        <p><strong>Tonal elevation is capped, not stacked.</strong> This is a deliberate divergence from M3&apos;s tonal-elevation spec. The Chorus brand goal is <em>calm and trustworthy</em>; ever-brightening surfaces feel showy and break the calm. Lift is expressed by <code>elevation.*</code> shadows; the surface names carry semantic weight (&ldquo;this is a modal&rdquo;) even when the tone is identical to a card.</p>
      </ProseSection>
    </Section>
  );
}

function ColorUtilities({ tokens }) {
  return (
    <Section
      title="Outline · Inverse · Focus · Scrim"
      id="color-utility"
      description={
        <>Five small role-clusters that don&apos;t fit the accent quartet or the surface stack. Each cluster is paired or solo by intent, not by a shared scale.</>
      }
    >
      <ProseSection title="Five role-clusters">
        <ul className="rule-list">
          <li><strong>Outline cluster</strong> (<code>outline</code> / <code>outlineVariant</code>) — high vs. low emphasis border pair.</li>
          <li><strong>Inverse cluster</strong> (<code>inverseSurface</code> / <code>inverseOnSurface</code>) — mini-stack for elements that must contrast with the page (snackbars, tooltips). <code>inverseSurface</code> is the canvas, <code>inverseOnSurface</code> is the foreground. Action accents inside inverted components fall back to the regular <code>primary</code> family.</li>
          <li><strong>Focus cluster</strong> (<code>focus</code> / <code>focusInset</code>) — outer ring + inner counter-ring pair. Always composed together.</li>
          <li><strong>Scrim</strong> (solo) — translucent black for backdrop dimming.</li>
          <li><strong>Elevation ink</strong> (solo) — base shadow color, referenced only from <code>elevation.*</code> definitions, never as a fill.</li>
        </ul>
      </ProseSection>
      {UTILITY_GROUPS.map(g => (
        <SystemTable key={g.title} tokens={tokens} title={g.title} rows={g.rows} />
      ))}
    </Section>
  );
}

function ColorDarkMode() {
  return (
    <Section
      title="Dark-mode strategy"
      id="color-darkmode"
      description="Two different inversion rules apply across the system. Tap the theme toggle to inspect the dark hex value beside each light value in the tables above."
    >
      <ul className="rule-list">
        <li><strong>Chromatic accents (<code>primary</code>, <code>brand</code>, <code>success</code>, <code>error</code>) do not invert their on-pair between modes.</strong> <code>error</code> nudges one tonal step in dark (<code>red.600</code> → <code>red.700</code>) so the fill still reads against a dark page; <code>primary</code> stays at <code>blue.500</code>, <code>brand</code> stays at <code>red.500</code>, and <code>success</code> stays at <code>green.500</code> in both modes because each hue clears AA against both <code>surface</code> tones without a nudge. The <code>on*</code> foreground stays at <code>neutral.50</code>. Brand identity stays stable across modes.</li>
        <li><strong>Neutral roles (<code>secondary</code>, <code>surface*</code>, <code>onSurface*</code>, <code>outline*</code>) invert as usual.</strong> Light surfaces become dark, dark text becomes light.</li>
        <li><strong>Container pairs flip the <em>container</em>, not the foreground family.</strong> In light mode the container is shallow (e.g. <code>blue.50</code> for primary, <code>red.50</code> / <code>green.50</code> for brand / success, <code>red.100</code> for error) with a saturated mid-band foreground (<code>blue.600</code>); in dark mode the container goes deep (<code>blue.900</code>) with a brighter mid-band foreground (<code>blue.400</code>). Both modes keep the foreground in the saturated primary family so the pair reads as <em>blue on tinted blue</em>, not as <em>near-black on tinted blue</em>. Primary's light container sits one step brighter than the other quartets because it appears most often (active nav rows, brand callouts) — a heavier tint at that frequency competes with content. The dark foreground lifts one band higher than a strict mirror would suggest (<code>blue.400</code> instead of <code>blue.500</code>) because equal luminance gaps appear shallower on dark surfaces.</li>
        <li><strong>Focus ring inverts</strong> so the outer ring is always inverse-toned to the page, guaranteeing legibility on every surface in the stack.</li>
      </ul>
    </Section>
  );
}

function ColorDataViz() {
  return (
    <Section
      title="Data visualization palette"
      id="color-dataviz"
      description="Charts, graphs, and category-coded surfaces draw from a small palette derived from the same six reference hues — never invented per-chart. Three intent groups each pick specific reference steps so the chart palette transfers across themes."
    >
      <EqualTable
        headers={['Palette', 'Source', 'Ordered?', 'Use']}
        rows={[
          [
            'Categorical',
            <span><TokenChip>blue.500</TokenChip> · <TokenChip>green.500</TokenChip> · <TokenChip>yellow.500</TokenChip> · <TokenChip>purple.500</TokenChip> · <TokenChip>red.500</TokenChip> · <TokenChip>neutral.700</TokenChip></span>,
            'No',
            'Discrete categories with no inherent order — series in a stacked bar, slices of a pie.',
          ],
          [
            'Sequential',
            <span>One palette ramp, steps <TokenChip>200 → 800</TokenChip></span>,
            'Yes',
            'A single quantitative variable along a magnitude axis — heatmaps, choropleths, ranked bars. Default to blue.*; use neutral.* when content-secondary.',
          ],
          [
            'Diverging',
            <span><TokenChip>red.700</TokenChip> · <TokenChip>red.400</TokenChip> · <TokenChip>neutral.200</TokenChip> · <TokenChip>blue.400</TokenChip> · <TokenChip>blue.700</TokenChip></span>,
            'Yes (centered)',
            'A variable with a meaningful midpoint — gain/loss, sentiment, deviation. Center neutral.200 is the zero anchor.',
          ],
        ]}
      />
      <ProseSection title="Rules">
        <ul className="rule-list">
          <li><strong>Six maximum for categorical.</strong> Past six categories, color stops being a useful encoding — group the long tail into &ldquo;Other&rdquo; or add a secondary visual channel.</li>
          <li><strong>Brand color comes first only when it carries meaning.</strong> If categories are equal, rotate the order or pick a non-brand starting hue.</li>
          <li><strong>Reuse <code>color.error</code> for negative coding.</strong> Don&apos;t introduce a chart-specific red; the system role already encodes the meaning. Positive / success coding currently has no dedicated system role — reach for <code>ref.palette.green.500</code> directly inside a chart palette (the only exception to the &ldquo;no <code>ref.*</code> in components&rdquo; rule, scoped to dataviz) until a <code>color.success</code> role lands.</li>
          <li><strong>Dark mode shifts the steps, not the hues.</strong> Light mode chart palettes use the lighter end of each ramp (<code>*.500</code> for categorical); dark mode shifts to <code>*.400</code>/<code>*.300</code> so contrast against the dark canvas holds.</li>
          <li><strong>Pair with a non-color channel</strong> — pattern fills, direct labels, or shape differentiation. Around 4% of users cannot distinguish red from green; categorical charts that rely on hue alone fail them silently.</li>
        </ul>
      </ProseSection>
    </Section>
  );
}

export function Color({ tokens }) {
  return (
    <>
      <ColorReferencePalettes tokens={tokens} />
      <ColorOverlayPalettes   tokens={tokens} />
      <ColorAccentRoles       tokens={tokens} />
      <ColorSurfaceStack      tokens={tokens} />
      <ColorUtilities         tokens={tokens} />
      <ColorDarkMode />
      <ColorDataViz />
    </>
  );
}

/* ============================================================
   Typography
   ============================================================ */

const TYPE_CATEGORIES = ['display', 'heading', 'body', 'label', 'caption'];
const TYPE_LEVELS = ['lg', 'md', 'sm'];
const LEVEL_NAME = { lg: 'Large', md: 'Medium', sm: 'Small' };

function getSample(category, level) {
  switch (category) {
    case 'display': return `Display ${LEVEL_NAME[level]}`;
    case 'heading': return `Heading ${LEVEL_NAME[level]}`;
    case 'body':    return 'A design system is a shared language for building consistent user experiences. The quick brown fox jumps over the lazy dog.';
    case 'label':   return 'Get started · Learn more';
    case 'caption': return '2 min ago · 3 comments · 12 likes';
    default: return '';
  }
}

function TypographyPretendard() {
  return (
    <Section
      title="Font family"
      id="typography-pretendard"
      description={
        <>Our product is a community service where text volume is high and Hangul (국문) and Latin (영문) frequently appear together in the same line. Pretendard is designed so its Hangul and Latin share compatible x-height, weight, and optical rhythm — mixed-script lines read as one continuous texture rather than two pasted-together systems. Used as the single UI typeface across every surface; do not substitute a different family for Latin-only or Korean-only regions.</>
      }
    />
  );
}

function TypographyGrid({ tokens }) {
  const items = [];
  for (const category of TYPE_CATEGORIES) {
    for (const level of TYPE_LEVELS) {
      const size     = tokens[`sys.typo.${category}.${level}.size`];
      const weight   = tokens[`sys.typo.${category}.${level}.weight`];
      const line     = tokens[`sys.typo.${category}.${level}.line`];
      const tracking = tokens[`sys.typo.${category}.${level}.tracking`];
      if (!size) continue;
      const sizeRem    = size.$valueRef ? tokens[size.$valueRef]?.$rem : null;
      const sizeWebRem = size.$responsiveRef?.web ? tokens[size.$responsiveRef.web]?.$rem : null;
      items.push({
        key:    `${category}.${level}`,
        sample: getSample(category, level),
        sizeVar:     toCssVarName(`sys.typo.${category}.${level}.size`),
        weightVar:   toCssVarName(`sys.typo.${category}.${level}.weight`),
        lineVar:     toCssVarName(`sys.typo.${category}.${level}.line`),
        trackingVar: toCssVarName(`sys.typo.${category}.${level}.tracking`),
        size:   size.$value,
        sizeRem,
        sizeWeb: size.$responsive?.web,
        sizeWebRem,
        weight: weight?.$value,
        line:     line?.$value,
        lineWeb:  line?.$responsive?.web,
        tracking: tracking?.$value,
      });
    }
  }

  return (
    <Section
      title="Categories × Sizes"
      id="typography-grid"
      description="Five purpose categories × three size levels = 15 type roles, each composed of four atomic properties."
    >
      <ProseSection>
        <ul className="rule-list">
          <li><strong>Category axis (purpose)</strong> — <code>display</code> (hero) → <code>heading</code> (structural title) → <code>body</code> (reading) → <code>label</code> (control) → <code>caption</code> (metadata). Position on this axis determines weight and line-height by purpose, not by size.</li>
          <li><strong>Size axis (emphasis within a category)</strong> — <code>lg</code> / <code>md</code> / <code>sm</code>. The middle step <code>md</code> is the default within most categories.</li>
          <li><strong>Composition</strong> — each grid cell composes four reference-tier values: <code>size</code> / <code>weight</code> / <code>line</code> / <code>tracking</code>. The four together define the role; never mix-and-match across cells (e.g. body&apos;s weight on a heading&apos;s size).</li>
          <li><strong>Responsive scaling grows with hierarchy.</strong> Display jumps two scale steps on web (≥800px, the mobile→tablet line); heading jumps one; body / label / caption stay constant. Larger type benefits from more presence on wider viewports; reading and tap targets do not.</li>
        </ul>
      </ProseSection>
      <div className="type-list">
        {items.map(item => (
          <div key={item.key} className="type-item">
            <div
              className="type-sample"
              style={{
                fontSize:      `var(${item.sizeVar})`,
                fontWeight:    `var(${item.weightVar})`,
                lineHeight:    `var(${item.lineVar})`,
                letterSpacing: `var(${item.trackingVar})`,
              }}
            >
              {item.sample}
            </div>
            <div className="type-meta">
              <TokenChip>{`sys.typo.${item.key}`}</TokenChip>
              <span className="sem-dot"> · </span>
              {item.sizeWeb ? (
                <>
                  <BreakpointLabel breakpoint="mobile" />
                  <span>{item.size}{item.sizeRem ? ` (${item.sizeRem})` : ''}</span>
                  <BreakpointLabel breakpoint="web" />
                  <span>{item.sizeWeb}{item.sizeWebRem ? ` (${item.sizeWebRem})` : ''}</span>
                </>
              ) : (
                <span>{item.size}{item.sizeRem ? ` (${item.sizeRem})` : ''}</span>
              )}
              <span className="sem-dot"> · </span>
              <span>{item.weight}</span>
              <span className="sem-dot"> · </span>
              {item.lineWeb ? (
                <>
                  <BreakpointLabel breakpoint="mobile" />
                  <span>line {item.line}</span>
                  <BreakpointLabel breakpoint="web" />
                  <span>line {item.lineWeb}</span>
                </>
              ) : (
                <span>line {item.line}</span>
              )}
              <span className="sem-dot"> · </span>
              <span>tracking {item.tracking}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TypographyPrinciples() {
  return (
    <Section
      title="Tracking & Line-height principles"
      id="typography-principles"
      description={
        <>Three rules govern how weight, tracking, and line-height combine across the fifteen <code>typo.*</code> roles — so each property carries consistent meaning regardless of which cell of the grid it lands in.</>
      }
    >
      <ul className="rule-list">
        <li><strong>Bold display, semibold heading, regular body, medium label, regular caption.</strong> Weight differentiates roles at the same size — <code>body.md</code> (400) and <code>label.lg</code> (500) share 16px but read differently because of weight.</li>
        <li><strong>Tracking only diverges at the extremes.</strong> Display compresses (<code>-0.02em</code>) so oversized glyphs settle as a block; small UI text and uppercase widens (<code>0.02em</code>) so dense labels stay readable. Body, label-md, and caption-lg use the typeface&apos;s intended spacing (<code>0em</code>).</li>
        <li><strong>Line-height splits by purpose, not size.</strong> Display and heading use <code>tight</code> (1.25) to keep large type compact; body / label / caption use <code>normal</code> (1.5) for reading comfort.</li>
      </ul>
    </Section>
  );
}

const LETTER_SPACING_ROWS = [
  { name: 'tight',  role: 'Compressed tracking for oversized display type — large glyphs settle closer so the block reads as a unit.' },
  { name: 'snug',   role: 'Subtly tightened for headings and mid-large type — sharpens silhouette without marketing compression.' },
  { name: 'normal', role: "Default. The typeface's intended spacing — body copy, reading text, standard UI controls." },
  { name: 'wide',   role: 'Slight widening for small UI text (≈12px and below) — measurably improves glance-readability of dense labels.' },
  { name: 'wider',  role: 'Pronounced tracking for uppercase eyebrows, overlines, and small-caps category markers. Restores rhythm lost in all caps.' },
];

function TypographyLetterSpacing({ tokens }) {
  return (
    <Section
      title="Letter-spacing scale"
      id="typography-letterspacing"
      description={
        <>A ramp from compressed to widened, em-relative so the value scales with font-size. The ramp parallels <code>lineHeight</code> but inverts its direction: large display type compresses while small UI text widens. <code>normal</code> is the anchor (the typeface&apos;s intended spacing); the four extremes are intentional optical corrections, not stylistic flourishes.</>
      }
    >
      <ProseSection>
        <p>Mapping into <code>typo.*</code>: display → <code>tight</code>, heading → <code>snug</code>, body / reading → <code>normal</code>, small UI labels → <code>wide</code>, uppercase overlines → <code>wider</code>.</p>
      </ProseSection>
      <RoleTable
        head={{ showChip: false }}
        tokens={LETTER_SPACING_ROWS.map(({ name }) => `ref.letterSpacing.${name}`)}
      >
        {LETTER_SPACING_ROWS.map(({ name, role }) => {
          const token = tokens[`ref.letterSpacing.${name}`];
          if (!token) return null;
          return (
            <div key={name} className="sem-row sem-row--no-chip">
              <TokenHead name={`ref.letterSpacing.${name}`} value={formatTokenValue(token)} />
              <RoleCell role={renderInline(role)} />
            </div>
          );
        })}
      </RoleTable>
    </Section>
  );
}

function TypographyFontSize() {
  return (
    <Section
      title="Font-size scale"
      id="typography-fontsize"
      description={
        <>Built on the 8px base (<code>ref.fontSize.100</code> = 8px = 1×, <code>ref.fontSize.200</code> = 16px = 2×), with finer in-between rungs (10 / 14 / 18 / 56 / 72px) added only where legibility demands resolution the spacing scale cannot provide. Each rung carries <code>$rem</code> alongside <code>$value</code> so consumers can emit rem units — the accessibility-recommended unit for text, which respects the user&apos;s browser font-size preference.</>
      }
    >
      <p>The reference ladder is <em>material</em>, not vocabulary: system <code>typo.*</code> categories pick rungs from it; product code never references <code>fontSize.*</code> directly.</p>
    </Section>
  );
}

function TypographyCasing() {
  const segmentedRows = [
    ['Spacing & layout',                  'Spacing & Layout'],
    ['Visual theme & atmosphere',         'Visual theme & Atmosphere'],
    ['State layer & focus',               'State layer & Focus'],
    ['Do’s & don’ts',           'Do’s & Don’ts'],
    ['Tracking & line-height principles', 'Tracking & Line-height principles'],
  ];
  return (
    <Section
      title="Casing"
      id="typography-casing"
      description={
        <>Sentence case is the default for every piece of UI text — navigation items, section titles, button and label text, page titles, dialog and toast bodies. Title case is not used anywhere in product surfaces; it competes with the typographic hierarchy already encoded by <code>typo.*</code> and has no analogue in Korean. UPPERCASE is reserved for in-content category markers (eyebrows, overlines) paired with <code>letterSpacing.wider</code>, applied via CSS <code>text-transform</code> so the underlying text stays sentence case. Proper nouns, product names, code identifiers, and acronyms keep their natural casing.</>
      }
    >
      <ProseSection title="Segmented sentence case">
        <p>When a heading or label joins multiple ideas with a separator (<code>&amp;</code>, <code>/</code>, <code>·</code>, <code>×</code>, <code>:</code>, <code>→</code>), apply <strong>sentence case to each segment independently</strong> — capitalize the first word of every segment, lowercase the rest. The separator marks a fresh &ldquo;sentence-start,&rdquo; so the second half of a compound heading is <em>not</em> a continuation of the first.</p>
        <EqualTable
          headers={['Wrong (single sentence case)', 'Right (segmented sentence case)']}
          rows={segmentedRows.map(([wrong, right]) => [<code key="w">{wrong}</code>, <code key="r">{right}</code>])}
        />
        <p>Hyphenated compounds inside a segment (<code>line-height</code>, <code>top-level</code>) do <strong>not</strong> start a new segment — they follow sentence case as one word. Only the major separators above split a label into segments.</p>
        <p><strong>Parentheses do not shield segments.</strong> A separator that appears inside <code>(…)</code> still splits the label into segments, and the word <em>after</em> the separator is capitalized as a fresh segment-start — <code>Default bindings (assist / Filter chip)</code>, <code>IA mapping (heading → Docs surface)</code>. The opening parenthesis is not itself a separator: the word immediately after <code>(</code> stays lowercase when nothing but the parenthetical-opening preceded it, because it is still mid-segment. Only the major separators listed above promote a word to segment-initial.</p>
        <p><strong>Why</strong> — Capitalizing the segment-initial word anchors the parallelism the separator is there to express, without escalating to title case (no second word is capitalized) — and stays cleanly translatable since the convention drops cleanly in Korean.</p>
      </ProseSection>
    </Section>
  );
}

export function Typography({ tokens }) {
  return (
    <>
      <TypographyPretendard />
      <TypographyGrid          tokens={tokens} />
      <TypographyPrinciples />
      <TypographyLetterSpacing tokens={tokens} />
      <TypographyFontSize />
      <TypographyCasing />
    </>
  );
}

/* ============================================================
   Spacing & Layout
   ============================================================ */

function SpacingBaseUnit() {
  return (
    <Section
      title="8px base unit"
      id="spacing-base"
      description={
        <>Every spacing value in Chorus is a multiple — or sub-multiple — of <strong>8px</strong>. The base is what makes grid alignment automatic: any two surfaces composed from <code>ref.space.*</code> land on the same rhythm without per-component adjustment, and a global density change is a single-file edit at the reference tier. 8 divides cleanly at every common display density (1× / 1.5× / 2× / 3×) without sub-pixel artifacts and matches the rhythm of the type system.</>
      }
    >
      <ProseSection title="Naming reflects the multiplier">
        <p><code>ref.space.100</code> is the canonical unit (8px = 1×). The numeric suffix on every other step expresses its value as a percentage of that unit, so the multiplier is readable from the token name alone: <code>ref.space.200</code> = 200% = 16px, <code>ref.space.50</code> = 50% = 4px, <code>ref.space.400</code> = 400% = 32px. Sub-base steps (<code>25</code> / <code>50</code> / <code>75</code>) exist for hairline rhythms the 8px grid can&apos;t resolve; everything from <code>100</code> upward is an integer multiple of the base.</p>
      </ProseSection>
      <ProseSection title="Base-unit ladder">
        <p>The discrete numeric values that fall out of the 8px base form a <strong>single canonical ladder</strong> every other scale in Chorus draws from: <code>0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 48 · 64 · 80</code>. The ladder is unitless — different scales bind it to different units:</p>
        <ul className="rule-list">
          <li><strong>Spacing</strong> binds it to <strong>pixels</strong> — each rung is a <code>ref.space.*</code> step (<code>0px</code> … <code>80px</code>); see <a href={asset("/spacing#spacing-reference")}>Reference scale</a> for the per-step table.</li>
          <li><strong>Type rungs</strong> bind it to <strong>pixels</strong> for the rungs that fall on the ladder (8 / 16 / 24 / 32 / 40 / 48 / 64 / 80px); finer typographic resolution adds in-between rungs only where legibility demands it.</li>
          <li><strong>Opacity</strong> binds it to <strong>percent</strong> — <code>ref.palette.black.*</code> / <code>ref.palette.white.*</code> alphas are drawn from the ladder read as percent (the 12 palette steps pick a subset of the rungs), plus a color-specific endpoint at <code>100%</code> for fully-opaque overlays (<code>color.focus</code>, <code>color.elevation</code>). <code>100</code> is not part of the spacing/typography ladder because spacing has no equivalent of &ldquo;fully opaque.&rdquo;</li>
        </ul>
        <p>Surfaces that need a value outside the ladder are a code-review signal — either the value belongs on the ladder (and the ladder needs a step), or the surface is reaching past the system tier.</p>
      </ProseSection>
    </Section>
  );
}

const SPACE_ROLES = {
  '0':    'No space. Reset inherited spacing or collapse a gap without removing the property.',
  '25':   'Hairline. Visually bonded pairs — counter badge ↔ anchor, glyph ↔ diacritic.',
  '50':   'Very tight. Compact icon + adjacent label inside small controls; dense pill/tag padding.',
  '75':   'Tight intermediate. Use when 4px feels cramped but 8px breaks rhythm.',
  '100':  'Base unit. Icon-label gap inside buttons/inputs; compact list item spacing.',
  '150':  'Button / input-field padding; gap between adjacent buttons in a toolbar.',
  '200':  'Default. Card / list-row / sheet content padding; paragraph and card-stack gap.',
  '250':  'Between default and spacious. Slightly roomier card padding on web.',
  '300':  'Spacious card padding, dialog body insets, gap between distinct content groups.',
  '400':  'Page-level gutters, hero section insets, large modal bodies, top-level section gaps.',
  '500':  'Landing heroes and marketing pages that demand wide margins.',
  '600':  'Showcase hero layouts; extra-wide marketing canvases.',
  '800':  'Oversize breaks between distinct page regions on very wide displays.',
  '1000': 'Maximum scale step. Reserved for the widest page-level framing.',
};

function SpacingReferenceScale({ tokens }) {
  const items = Object.entries(groupByPrefix(tokens, 'ref.space'))
    .filter(([k]) => !k.includes('.'));
  items.sort((a, b) => Number(a[0]) - Number(b[0]));
  return (
    <Section
      title="Reference scale"
      id="spacing-reference"
      description={
        <>A flat scale of discrete dimension steps that every other spacing token resolves to. Components consume the <code>sys.layout.*</code> system tokens for layout participation; raw scale steps are reserved for <strong>fixed-footprint controls</strong> (buttons, chips, table cells) whose padding/gap must stay constant across breakpoints.</>
      }
    >
      <ProseSection title="Bands and anchors">
        <p>The <code>ref.space.*</code> rungs that materialize the spacing binding of the <a href={asset("/spacing#base-unit-ladder")}>base-unit ladder</a>. The ladder partitions naturally into bands: <strong>0</strong> is reset, <strong>25–75</strong> are sub-base hairlines, <strong>100–300</strong> are control-and-content rhythm, <strong>400–1000</strong> are page-and-section framing. <code>ref.space.100</code> (base) and <code>ref.space.200</code> (default) are the two anchor steps the rest of the system aligns against.</p>
        <p>Each rung carries a <code>$multiplier</code> (× the 8px base), a <code>$rem</code> value, and a pixel <code>$value</code>. The rem convention is the <strong>browser-default <code>1rem = 16px</code></strong> — same convention as <code>ref.fontSize.*</code>, so the same px lands at the same rem across both scales (<code>ref.space.200</code> = <code>ref.fontSize.200</code> = 16px = <code>1rem</code>). The pixel column is what tokens compile to in CSS; consumers that want a value that respects the user&apos;s browser font-size preference can emit <code>$rem</code> instead.</p>
      </ProseSection>
      <TokenTrimScope map={new Map(items.map(([key]) => [`ref.space.${key}`, `space.${key}`]))}>
        <RoleTable>
          {items.map(([key, token]) => {
            const varName = toCssVarName(`ref.space.${key}`);
            return (
              <div key={key} className="sem-row">
                <TokenHead name={`ref.space.${key}`} value={formatTokenValue(token)} rem={token.$rem} multiplier={token.$multiplier} />
                <RoleCell role={renderInline(SPACE_ROLES[key])} />
                <div className="sem-cell sem-cell-chip spacing-bar-cell">
                  <div className="spacing-bar" style={{ width: `var(${varName})` }} />
                </div>
              </div>
            );
          })}
        </RoleTable>
      </TokenTrimScope>
    </Section>
  );
}

const LAYOUT_AXES_ROWS = [
  {
    name: 'sys.layout.page.*',
    role:  'Scope: viewport ↔ content. How far should any content stay from the screen edge? Owned by the page shell (applied once per route).',
  },
  {
    name: 'sys.layout.container.*',
    role:  "Scope: surface ↔ its content. How much breathing room does this card / sheet / dialog give? Owned by the individual surface.",
  },
  {
    name: 'sys.layout.stack.*',
    role:  'Scope: sibling ↔ sibling (vertical). How much vertical gap between these two column siblings? Owned by the flex/grid parent.',
  },
  {
    name: 'sys.layout.inline.*',
    role:  'Scope: sibling ↔ sibling (horizontal). How much horizontal gap between these two row siblings? Owned by the flex/grid parent.',
  },
];

function SpacingAxes() {
  return (
    <Section
      title="Layout axes"
      id="spacing-axes"
      description={
        <>Where the spacing scale graduates from raw values into layout vocabulary. The reference ladder is <em>material</em>; the four axes below are how product surfaces actually consume it.</>
      }
    >
      <ProseSection title="Four orthogonal axes">
        <p>Ordered by spatial scope from outermost to innermost: <code>page</code> → <code>container</code> → <code>stack</code> → <code>inline</code>. Each axis owns one specific spatial relationship and is applied by exactly one kind of element. Axes never substitute for each other: page gutter is not container padding, vertical sibling gap is not horizontal. <code>page</code> and <code>container</code> stack: a card inside a page is inset from the viewport by <code>page</code> padding plus its own <code>container</code> padding. Every axis carries an internal T-shirt scale; steps above <code>md</code> (i.e. <code>lg</code>, <code>xl</code>, <code>2xl</code>, <code>3xl</code>) carry a mobile→web step-up baked into the token, while <code>md</code> and below stay constant.</p>
      </ProseSection>
      <RoleTable tokens={LAYOUT_AXES_ROWS.map((r) => r.name)}>
        {LAYOUT_AXES_ROWS.map(row => (
          <div key={row.name} className="sem-row">
            <div className="sem-cell sem-cell-token"><TokenChip>{row.name}</TokenChip></div>
            <RoleCell role={renderInline(row.role)} />
            <div className="sem-cell sem-cell-chip" />
          </div>
        ))}
      </RoleTable>
    </Section>
  );
}

const SEMANTIC_TSHIRT = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const tshirtIdx = k => {
  const i = SEMANTIC_TSHIRT.indexOf(k);
  return i === -1 ? 999 : i;
};

const LAYOUT_PAGE_ROLES = {
  sm: 'Compact gutter for information-dense routes — dashboards, admin tables, multi-pane list/detail views. Resolves to `ref.space.100`.',
  md: 'Default. Canonical page gutter for ordinary app routes. Resolves to `ref.space.200`.',
  lg: 'Generous gutter for marketing and content-forward pages — landings, editorial routes, high-emphasis CTAs. Resolves to `ref.space.300` (mobile) / `ref.space.500` (web).',
  xl: 'Widest gutter. Showcase heroes and brand-moment landings. Use sparingly — overuse breaks the shared page rhythm `md` establishes. Resolves to `ref.space.500` (mobile) / `ref.space.800` (web).',
};

const LAYOUT_CONTAINER_ROLES = {
  '3xs': 'Hairline inset. Tightly packed chip/badge interiors, icon-only controls. Density is the design intent. Resolves to `ref.space.25`.',
  '2xs': 'Compact inset for small pills, dense tags, tightly-spaced inline controls. Resolves to `ref.space.50`.',
  xs:    'Small-control padding. Chip body padding, segmented-control items, compact list rows, dense table-cell inputs. Resolves to `ref.space.100`.',
  sm:    "Button and input-field padding. One step below the card default — control's inset doesn't compete with surrounding surface padding. Resolves to `ref.space.150`.",
  md:    'Default. Card, list-row, and sheet-content padding. The baseline for content-bearing containers. Resolves to `ref.space.200`.',
  lg:    'Spacious card padding, dialog body insets. Higher-hierarchy surfaces — primary dialogs, feature-card callouts. Resolves to `ref.space.300` (mobile) / `ref.space.400` (web).',
  xl:    'Hero section insets and large modal bodies. Surfaces carrying top-level page weight. Resolves to `ref.space.400` (mobile) / `ref.space.500` (web).',
  '2xl': 'Landing heroes and marketing layouts where padding is part of the visual composition. Resolves to `ref.space.600` (mobile) / `ref.space.800` (web).',
  '3xl': 'Largest container inset — showcase heroes, extra-wide marketing canvases. Use sparingly. Resolves to `ref.space.800` (mobile) / `ref.space.1000` (web).',
};

const LAYOUT_STACK_ROLES = {
  '3xs': 'Hairline rhythm. Visually bonded stacked pairs — badge ↔ counter line, two metadata lines that should read as one unit. Resolves to `ref.space.25`.',
  '2xs': 'Tight rhythm. Label ↔ input, caption ↔ parent text, title ↔ immediately-attached subtitle. Signals the two elements describe the same thing. Resolves to `ref.space.50`.',
  xs:    'Compact list spacing and small-element grouping — dense feed rows, compact menus, tightly-set metadata blocks. Resolves to `ref.space.100`.',
  sm:    'Form field gap — between two adjacent fields or between rows in a dense list. Fields belong to the same logical block. Resolves to `ref.space.150`.',
  md:    'Default. Paragraph spacing and the baseline gap between cards in a vertical feed. Resolves to `ref.space.200`.',
  lg:    'Gap between distinct content groups within a section — heading block ↔ body block, form group ↔ submit area. Resolves to `ref.space.300` (mobile) / `ref.space.400` (web).',
  xl:    'Gap between top-level page sections. Strong content break that still sits within a single scroll region. Resolves to `ref.space.400` (mobile) / `ref.space.500` (web).',
  '2xl': 'Strong section break on content-dense vertical pages — hero → feature → CTA reads as discrete chapters. Resolves to `ref.space.500` (mobile) / `ref.space.600` (web).',
  '3xl': 'Widest vertical break — hero-scale separations on marketing, landing, long-form pages. Use sparingly. Resolves to `ref.space.600` (mobile) / `ref.space.800` (web).',
};

const LAYOUT_INLINE_ROLES = {
  xs: 'Almost touching. Visually bonded inline pairs — character ↔ diacritic, counter ↔ anchor, currency ↔ amount. Resolves to `ref.space.25`.',
  sm: 'Very tight. Icon + label inside small controls — dense chips, icon buttons, filter pills. Resolves to `ref.space.50`.',
  md: 'Default. Icon-label spacing inside buttons and inputs; gap between tightly related inline elements. Resolves to `ref.space.100`.',
  lg: 'Gap between adjacent buttons in a toolbar, chips in a chip group, tabs in a tab bar. Independent targets, equal weight. Resolves to `ref.space.150` (mobile) / `ref.space.200` (web).',
  xl: 'Spacious gap. Separates distinct inline groups — top-nav links, breadcrumb segments, toolbar clusters. Resolves to `ref.space.200` (mobile) / `ref.space.300` (web).',
  '2xl': 'Widest horizontal break. Rail-scale separations — the gap between a horizontally-scrolling track and its anchored trailing action, or between two unrelated horizontal clusters on the same row. Use sparingly. Resolves to `ref.space.300` (mobile) / `ref.space.400` (web).',
};

const LAYOUT_ROLE_MAPS = {
  'layout.page':      LAYOUT_PAGE_ROLES,
  'layout.container': LAYOUT_CONTAINER_ROLES,
  'layout.stack':     LAYOUT_STACK_ROLES,
  'layout.inline':    LAYOUT_INLINE_ROLES,
};

function LayoutAxisSection({ tokens, prefix, id, title, description, scaleHeading, scaleBody }) {
  const items = Object.entries(groupByPrefix(tokens, `sys.${prefix}`));
  items.sort((a, b) => tshirtIdx(a[0]) - tshirtIdx(b[0]));
  const roles = LAYOUT_ROLE_MAPS[prefix] ?? {};
  /* Spacing-page layout tables strip both `sys.` and `layout.` — chips
     keep just the axis tail (`page.md`, `container.md`, …) since the
     section heading already names the family. */
  const axisTail = prefix.replace(/^layout\./, '');
  const trimMap = new Map(items.map(([key]) => [`sys.${prefix}.${key}`, `${axisTail}.${key}`]));
  return (
    <Section title={title} id={id} description={description}>
      {scaleHeading ? (
        <ProseSection title={scaleHeading}>
          {scaleBody ? <p>{scaleBody}</p> : null}
        </ProseSection>
      ) : null}
      <TokenTrimScope map={trimMap}>
        <RoleTable>
          {items.map(([key, token]) => {
            const varName = toCssVarName(`sys.${prefix}.${key}`);
            return (
              <div key={key} className="sem-row">
                <TokenHead name={`sys.${prefix}.${key}`} value={formatTokenValue(token)} />
                <RoleCell role={renderInline(roles[key])} />
                <div className="sem-cell sem-cell-chip spacing-bar-cell">
                  <div className="spacing-bar" style={{ width: `var(${varName})` }} />
                </div>
              </div>
            );
          })}
        </RoleTable>
      </TokenTrimScope>
    </Section>
  );
}

const LAYOUT_AXES = [
  {
    prefix: 'layout.page',
    id: 'spacing-page',
    title: 'Viewport-edge gutter',
    description: 'The outermost gutter between the viewport edge and any page content. Applied once per route at the page shell. Full-bleed elements opt out by negating this padding, not by changing the token.',
    scaleHeading: 'Four-step T-shirt scale',
    scaleBody: 'sm / md / lg / xl, where md is the canonical default for ordinary app routes; the other steps shift the page personality (compact / canonical / generous / showcase) without changing what the token is. No xs or 2xl+ — page gutter is intentionally a narrow vocabulary so routes share rhythm.',
  },
  {
    prefix: 'layout.container',
    id: 'spacing-container',
    title: 'Surface-internal padding',
    description: 'Padding inside a bounded surface — cards, sheets, dialogs, popovers, list rows, toolbars. If removing the container would make the padding meaningless, it belongs here.',
    scaleHeading: 'Nine-step T-shirt scale',
    scaleBody: '3xs → 3xl, covering the full range from hairline chip insets to oversized hero canvases. md is the default (ordinary card / list-row / sheet padding). Lower steps (3xs / 2xs / xs / sm) cover control-density surfaces (chips, buttons, dense cells); upper steps (lg / xl / 2xl / 3xl) cover content-emphasis surfaces (dialogs, hero blocks, marketing canvases). The wide range exists because container is the most diverse axis — the same role spans a 2px chip and a 64px hero.',
  },
  {
    prefix: 'layout.stack',
    id: 'spacing-stack',
    title: 'Vertical sibling gap',
    description: 'Vertical gap between stacked elements in a column — between form fields, list items, sections.',
    scaleHeading: 'Nine-step T-shirt scale',
    scaleBody: '3xs → 3xl, the same range as container.* because vertical layouts span the same scale spectrum (from intra-pair hairlines to hero-section breaks). md is the default (paragraph / card-stack rhythm). The lower steps (3xs / 2xs) signal visually bonded pairs (label↔input, title↔subtitle); the upper steps (xl / 2xl / 3xl) signal page-section breaks. Stack runs deeper than inline.* because long scrolling pages stack many more blocks than a row fits.',
  },
  {
    prefix: 'layout.inline',
    id: 'spacing-inline',
    title: 'Horizontal sibling gap',
    description: 'Horizontal gap between sibling elements on a single row.',
    scaleHeading: 'Six-step T-shirt scale',
    scaleBody: 'xs / sm / md / lg / xl / 2xl — the narrowest layout axis because rows have less spatial range than columns. md is the default (icon-label gap inside controls). All steps at and below md (xs / sm / md) sit constant across breakpoints — they describe bonded inline pairs whose proximity is the design intent; the upper steps (lg / xl / 2xl) carry the web step-up so toolbar, breadcrumb, and rail-scale gaps breathe on wider viewports.',
  },
];

export function Spacing({ tokens }) {
  return (
    <>
      <SpacingBaseUnit />
      <SpacingReferenceScale tokens={tokens} />
      <SpacingAxes />
      {LAYOUT_AXES.map(axis => (
        <LayoutAxisSection key={axis.prefix} tokens={tokens} {...axis} />
      ))}
    </>
  );
}

/* ============================================================
   Radius
   ============================================================ */

const RADIUS_SCALE_KEYS  = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];

const RADIUS_ROLES = {
  none: 'Square corners. Use when the shape itself is load-bearing — dividers, table cells, full-bleed media. Also when a parent already clips to a radius and the child needs to sit flush.',
  xs:   'Hairline softening. Removes optical sharpness without reading as "rounded" — tags, badges, code chips, inline image thumbnails, small swatches.',
  sm:   'Subtle round that still reads as precise. Dense controls, table-cell inputs, filter chips, small meta chips. Good for utilitarian, data-dense surfaces.',
  md:   'Default control radius. Buttons, inputs, selects, segmented controls, tabs. Soft enough to feel friendly, tight enough to read as a precise hit target.',
  lg:   'Mid-surface corner. Small cards, list-item tiles, popovers, tooltips, toast-style surfaces. Also the right step for oversized controls (hero CTA buttons) where extra rounding keeps the silhouette in proportion.',
  xl:   'Default surface radius. Cards, sheets, dialogs, modals, banners. Larger than control radii so containers visually "hold" the controls they contain.',
  '2xl': 'Hero / marketing surface corner. Showcase cards, feature tiles, landing-page blocks where shape contributes to visual warmth. Use sparingly.',
  full: 'Fully rounded — capsule on any rectangle, perfect circle on any square. Pill buttons, status chips, avatar frames, FABs, progress indicators.',
};

function RadiusScale({ tokens }) {
  const all = groupByPrefix(tokens, 'sys.radius');
  const scaleItems = RADIUS_SCALE_KEYS
    .map(k => [k, all[k]])
    .filter(([, token]) => token);
  return (
    <Section
      title="Scale"
      id="radius-scale"
      description={
        <>The full radius vocabulary available to product code, ordered from <code>none</code> (square) to <code>full</code> (capsule). Each step plays one specific visual role; controls and surfaces have anchored defaults (<code>md</code>, <code>xl</code>) so most components inherit the right value without choosing.</>
      }
    >
      <ProseSection>
        <ul className="rule-list">
          <li><strong>Endpoints</strong> — <code>none</code> (load-bearing geometry) and <code>full</code> (pills, circles). Either-or, not on the rounding ramp.</li>
          <li><strong>Control band</strong> — <code>xs</code> / <code>sm</code> / <code>md</code>. Small, precise corners for hit-target elements. <strong><code>md</code> (8px)</strong> is the default control radius.</li>
          <li><strong>Surface band</strong> — <code>lg</code> / <code>xl</code> / <code>2xl</code>. Larger corners for content containers. <strong><code>xl</code> (16px)</strong> is the default surface radius. A button (<code>radius.md</code>, 8px) inside a card (<code>radius.xl</code>, 16px) reads as <em>inside</em> the card rather than floating on top — the size difference does the work.</li>
        </ul>
      </ProseSection>
      <TokenTrimScope map={new Map(scaleItems.map(([key]) => [`sys.radius.${key}`, `radius.${key}`]))}>
        <RoleTable>
          {scaleItems.map(([key, token]) => (
            <div key={key} className="sem-row">
              <TokenHead name={`sys.radius.${key}`} value={formatTokenValue(token)} />
              <RoleCell role={renderInline(RADIUS_ROLES[key])} />
              <div className="sem-cell sem-cell-chip">
                <div className="radius-bar" style={{ borderRadius: token.$value }} />
              </div>
            </div>
          ))}
        </RoleTable>
      </TokenTrimScope>
    </Section>
  );
}

function RadiusAsymmetric() {
  return (
    <Section
      title="Asymmetric radii"
      id="radius-asymmetric"
      description={
        <>For edge-anchored surfaces — bottom sheets, side drawers, popover tails, attached tabs — round only the corners that don&apos;t touch the anchor. A bottom sheet rounds its top two corners at <code>radius.xl</code> and leaves the bottom two at <code>0</code>; a left-anchored drawer rounds only its right edge; a tab attached to a panel rounds only the corners that face away from the panel.</>
      }
    >
      <p>This is composition, not a new vocabulary: apply the existing <code>sys.radius.*</code> value to the specific corners that need it (<code>border-top-left-radius</code>, <code>border-top-right-radius</code>, etc.). <strong>Don&apos;t introduce per-corner tokens</strong> — they multiply the token surface, drift independently, and don&apos;t survive a global radius change. The full radius scale already covers every value the corners need; asymmetry is <em>whether</em> to apply it.</p>
      <div className="specimen-grid">
        <div className="demo-cell radius-asym-cell--sheet">
          <div className="demo-stage">
            <div
              className="radius-asym-demo radius-asym-demo--sheet"
              style={{ borderRadius: 'var(--sys-radius-xl) var(--sys-radius-xl) 0 0' }}
            />
          </div>
          <div className="demo-meta">
            <div className="demo-header">
              <span className="token-chip">radius.xl</span>
              <span className="demo-value">top corners only</span>
            </div>
            <p className="demo-desc">Anchored to the viewport bottom. Top corners take the full surface radius; bottom corners stay flush against the edge.</p>
          </div>
        </div>
        <div className="demo-cell radius-asym-cell--drawer">
          <div className="demo-stage">
            <div
              className="radius-asym-demo radius-asym-demo--drawer"
              style={{ borderRadius: '0 var(--sys-radius-xl) var(--sys-radius-xl) 0' }}
            />
          </div>
          <div className="demo-meta">
            <div className="demo-header">
              <span className="token-chip">radius.xl</span>
              <span className="demo-value">trailing corners only</span>
            </div>
            <p className="demo-desc">Anchored to the leading edge. Right corners round; left corners stay flush against the viewport edge.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function RadiusCapsuleCircle() {
  return (
    <Section
      title="Capsule vs circle"
      id="radius-capsule-circle"
      description={
        <><code>sys.radius.full</code> (9999px) is intentionally larger than any conceivable control dimension, so the resulting shape is determined by the <em>element&apos;s aspect ratio</em>, not by the radius value: a perfect capsule on any rectangle, a perfect circle on any square. One token, two shapes — pick the aspect ratio you want and <code>full</code> does the rest.</>
      }
    >
      <p>Do not approximate a capsule with <code>radius.2xl</code> or any finite step — the corners drift as content length changes, and a row of pills with the same token reads as visibly different shapes. If you want a capsule, use <code>full</code>.</p>
      <div className="specimen-grid">
        <div className="demo-cell">
          <div className="demo-stage">
            <div
              className="radius-asym-demo radius-asym-demo--capsule"
              style={{ borderRadius: 'var(--sys-radius-full)' }}
            >
              <span className="radius-asym-label">Pill button</span>
            </div>
          </div>
          <div className="demo-meta">
            <div className="demo-header">
              <span className="token-chip">radius.full</span>
              <span className="demo-value">capsule</span>
            </div>
            <p className="demo-desc">Wide rectangle. Pill buttons, status chips, badges, progress tracks, segmented-control thumbs — anything whose width changes with content.</p>
          </div>
        </div>
        <div className="demo-cell">
          <div className="demo-stage">
            <div
              className="radius-asym-demo radius-asym-demo--circle"
              style={{ borderRadius: 'var(--sys-radius-full)' }}
            >
              <span className="radius-asym-label">FAB</span>
            </div>
          </div>
          <div className="demo-meta">
            <div className="demo-header">
              <span className="token-chip">radius.full</span>
              <span className="demo-value">circle</span>
            </div>
            <p className="demo-desc">1:1 square. Avatars, FABs, circular icon buttons, radio dots, single-character indicators.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Radius({ tokens }) {
  return (
    <>
      <RadiusScale tokens={tokens} />
      <RadiusAsymmetric />
      <RadiusCapsuleCircle />
    </>
  );
}

/* ============================================================
   Elevation
   ============================================================ */

const ELEVATION_ROLES = {
  raised:   'Subtle lift. Cards at rest, hovered list rows, selected menu items, buttons that should read as gently elevated without demanding attention.',
  floating: 'Free-floating above the page. FABs, floating menus, dropdowns, autocomplete panels — elements that detach from the flow and hover over content.',
  overlay:  'Page-level overlay demanding user focus. Modals, dialogs, popovers, full-screen prompts that sit above a scrim and block interaction below.',
  sheet:    'Edge-anchored panel projecting shadow away from its anchored edge (here, anchored bottom — shadow rises). Bottom sheets, side drawers, pinned panels.',
};

export function Elevation({ tokens }) {
  const items = Object.entries(groupByPrefix(tokens, 'sys.elevation'));
  return (
    <Section
      title="Scale"
      id="elevation"
      description="The full elevation vocabulary available to product code. Each preset is a self-contained two-layer shadow (tight ambient + wider spread) tuned to one spatial role; components consume the role, never assemble shadows themselves."
    >
      <ProseSection>
        <ul className="rule-list">
          <li><strong>Lift ramp</strong> — <code>raised</code> (subtle) → <code>floating</code> (free-floating) → <code>overlay</code> (page-blocking). Each step deepens the spread layer&apos;s blur and alpha; meaning is the spatial relationship to the page (sits-on vs hovers-above vs blocks).</li>
          <li><strong>Direction-special</strong> — <code>sheet</code>. Same intensity family as <code>floating</code>, but the offset is inverted so the shadow projects <em>away from the anchored edge</em> (bottom sheets cast upward).</li>
          <li><strong>Two-layer composition.</strong> Each preset is a tight ambient layer plus a wider spread layer, mirroring physical light behavior so edges stay crisp while the diffuse halo fades naturally.</li>
          <li><strong>Shadow alphas come from the overlay palettes.</strong> <code>ref.palette.black.*</code> draws from the <a href={asset("/spacing#base-unit-ladder")}>base-unit ladder</a> read as percent — every shadow alpha (4 / 6 / 8 / 12 / 16 / 20%) is a step on that ladder, so a step rebalance in the palette propagates through every elevation preset without re-authoring shadows.</li>
        </ul>
      </ProseSection>
      <div className="specimen-grid">
        {items.map(([key, token]) => (
          <div key={key} className={`demo-cell elevation-cell--${key}`}>
            <div className="demo-stage">
              <div className="elevation-box" style={{ boxShadow: token.$value }}>
                {key === 'floating' && <span className="elevation-box-label">Button</span>}
              </div>
            </div>
            <div className="demo-meta">
              <div className="demo-header">
                <span className="token-chip">{`elevation.${key}`}</span>
                <span className="demo-value">{token.$value}</span>
              </div>
              <p className="demo-desc">{ELEVATION_ROLES[key]}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================
   State layers & Focus
   ============================================================ */

const STATE_ROWS = [
  {
    name: 'hover',
    role: 'Pointer is over the element. Lowest-intensity layer — gentle highlight, not a commitment. Resolves to `ref.opacity.8`.',
    inDemo: true,
  },
  {
    name: 'focus',
    role: 'Element holds keyboard or programmatic focus. Stronger than hover so focused controls remain visible to keyboard users even when the pointer is elsewhere. Pair with the focus ring composition (see Focus ring composition). Resolves to `ref.opacity.12`.',
    inDemo: true,
  },
  {
    name: 'pressed',
    role: 'Active press / tap / click. Strongest persistent layer — provides tactile feedback before the action completes. Resolves to `ref.opacity.16`.',
    inDemo: true,
  },
  {
    name: 'dragged',
    role: 'Element being dragged (reorderable list items, draggable cards, slider thumbs mid-drag). Matches `pressed` intensity — both represent sustained interaction. Resolves to `ref.opacity.16`.',
  },
  {
    name: 'disabled',
    role: 'Element-level opacity (not an overlay). Indicates the control is non-interactive. Suppress hover/focus/pressed layers and use a non-interactive cursor. Resolves to `ref.opacity.40`.',
    inDemo: true,
  },
];
const STATE_DEMO_ORDER = ['hover', 'pressed', 'disabled', 'focus'];

function StateLayerStage({ name, value }) {
  if (name === 'disabled') {
    return (
      <div className="state-stage-demo" data-variant="disabled">
        <span className="state-demo-base" style={{ opacity: value }}>Button</span>
      </div>
    );
  }
  return (
    <div className="state-stage-demo">
      <span className="state-demo-base">Button</span>
      <span className="state-demo-overlay" style={{ opacity: value }} />
    </div>
  );
}

export function StateLayer({ tokens }) {
  return (
    <>
      <Section
        title="State overlays"
        id="state-layer-overlays"
        description={
          <>Interactive controls need visible feedback for four states — hover, focus, pressed, dragged — across many base colors and component variants (filled / tonal / outlined / text). Hand-picking a bespoke hover color for every (base × variant) combination would explode the token surface; Chorus avoids it by expressing state as <strong>a single rule</strong> (the foreground-over-base composition introduced above), so adding a new color role or component variant requires zero new state tokens.</>
        }
      >
        <ProseSection title="Intensity ramp plus a categorical">
          <p>Five tokens organized as follows:</p>
          <ul className="rule-list">
            <li><strong>Interaction ramp</strong> — <code>hover</code> (8%) → <code>focus</code> (12%) → <code>pressed</code> / <code>dragged</code> (16%). Ascending intensity, ascending commitment. <code>pressed</code> and <code>dragged</code> share the same opacity because both represent sustained active engagement.</li>
            <li><strong>Categorical special</strong> — <code>disabled</code> (40%). Not on the overlay ramp at all; it is the <em>element&apos;s own opacity</em>, applied directly to the control, with all overlay layers suppressed.</li>
            <li><strong>Stacking rule</strong> — overlay layers from the ramp stack additively when states coexist (focus + hover → 8% + 12%, composited). <code>disabled</code> is exclusive: when active, the ramp is suppressed.</li>
          </ul>
        </ProseSection>
        <ProseSection title="How to apply">
          <ol className="rule-list">
            <li>
              <strong>Pick the overlay color</strong> — it is the element&apos;s foreground (the color used for text/icons on that surface).
              <ul>
                <li>Filled primary button → overlay color is <code>color.onPrimary</code>.</li>
                <li>Tonal button on <code>primaryContainer</code> → overlay is <code>color.onPrimaryContainer</code>.</li>
                <li>Text / ghost button on <code>surface</code> → overlay is <code>color.primary</code> (the ink becomes the overlay when there is no fill).</li>
                <li>Selectable surface (list row, menu item) → overlay is <code>color.onSurface</code>.</li>
              </ul>
            </li>
            <li><strong>Pick the opacity from <code>sys.state.*</code></strong> based on which state is active.</li>
            <li><strong>Composite</strong> — render the overlay as a layer (pseudo-element, extra background-image, or CSS <code>color-mix</code>) covering the interactive region, clipped to the element&apos;s shape (radius included).</li>
            <li><strong>Stack additively</strong> when states coexist. A focused element that is also hovered shows <em>both</em> layers — 8% + 12% composited, not replaced. Pressed during focus → 12% + 16%.</li>
            <li><strong><code>disabled</code> is different</strong>: it is the element&apos;s own opacity (40%), not an overlay. When disabled, suppress hover/focus/pressed layers entirely and switch the cursor to <code>not-allowed</code>.</li>
          </ol>
        </ProseSection>
        <ProseSection title="Scope">
          <p>Apply to any control the user can hover, focus, press, or drag: buttons, chips, list items, menu items, tabs, switches, checkboxes, icon buttons, draggable cards. Do not apply to static surfaces (page background, plain text, dividers) — they have no interaction to signal.</p>
        </ProseSection>
        <TokenTrimScope map={new Map(STATE_ROWS.map(({ name }) => [`$sys.state.${name}`, `state.${name}`]))}>
          <RoleTable head={{ showChip: false }}>
            {STATE_ROWS.map(({ name, role }) => {
              const token = tokens[`sys.state.${name}`];
              if (!token) return null;
              const baseVar = name === 'disabled' ? '--sys-color-primary' : '--sys-color-onSurface';
              const swatch = `color-mix(in srgb, var(${baseVar}) ${token.$value * 100}%, transparent)`;
              return (
                <div key={name} className="sem-row sem-row--no-chip">
                  <TokenHead name={`$sys.state.${name}`} value={`${Math.round(token.$value * 100)}%`} swatch={swatch} />
                  <RoleCell role={renderInline(role)} />
                </div>
              );
            })}
          </RoleTable>
        </TokenTrimScope>
        <TokenTrimScope
          tokens={STATE_DEMO_ORDER
            .map((name) => tokens[`sys.state.${name}`]?.$valueRef)
            .filter(Boolean)
            .map((p) => `$${p}`)}
        >
          <div className="specimen-grid">
            {STATE_DEMO_ORDER.map(name => {
              const row = STATE_ROWS.find(r => r.name === name);
              const token = tokens[`sys.state.${name}`];
              if (!row || !token) return null;
              return (
                <div key={name} className="demo-cell">
                  <div className="demo-stage">
                    <StateLayerStage name={name} value={token.$value} />
                  </div>
                  <div className="demo-meta">
                    <div className="demo-header">
                      <span className="token-chip">{`state.${name}`}</span>
                      <span className="demo-value">
                        <RefAndValue refPath={token.$valueRef} value={token.$value} />
                      </span>
                    </div>
                    <p className="demo-desc">{renderInline(row.role)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </TokenTrimScope>
      </Section>
      <Section
        title="Focus ring composition"
        id="state-focus-ring"
        description={
          <>The <code>sys.state.focus</code> overlay alone does not meet keyboard-accessibility contrast. Pair it with a visible focus ring composed outward from the control's edge: <strong>fill (state.focus 12%) on the control → 1px <code>sys.color.focusInset</code> inner counter-ring → 2px <code>sys.color.focus</code> outer ring</strong> (3px total outward). The ring is a <strong>dedicated overlay layer</strong> — a <code>position: absolute</code> pseudo-element on top of the control, carrying the multi-shadow — so it <strong>never affects layout</strong>: focus moving across a row never reflows a sibling. For a control inside a clipping scroller (a Tab row, a horizontal rail) the same layer is re-anchored <em>inward</em> so it isn't sliced at the scroller's edge — same two layers, only the offset flips. Apply on <code>:focus-visible</code> only; suppress while <code>disabled</code>.</>
        }
      >
        <div className="specimen-grid">
          <div className="demo-cell demo-cell--wide">
            <div className="demo-stage">
              <div className="state-stage-demo focus-ring-stage">
                <span className="state-demo-base">Button</span>
                <span
                  className="focus-ring-layer focus-ring-layer--state"
                  style={{ opacity: tokens['sys.state.focus']?.$value }}
                />
                <span className="focus-ring-layer focus-ring-layer--ring" />
              </div>
            </div>
            <div className="demo-meta">
              <div className="demo-header">
                <span className="token-chip">color.focus</span>
                <span className="token-chip">color.focusInset</span>
                <span className="token-chip">state.focus</span>
              </div>
              <p className="demo-desc">
                A <code>sys.state.focus</code> fill (12% foreground composited onto the variant's container) painted ON the control, then a <code>1px</code> <code>sys.color.focusInset</code> inner counter-ring at <code>0..1px</code> outside the control, then a <code>2px</code> <code>sys.color.focus</code> outer ring at <code>1..3px</code> outside — all carried by a <code>::after</code> overlay layer (<code>position: absolute</code>, <code>z-index</code> above the state-overlay <code>::before</code> and the label) rather than an <code>outline</code> / <code>box-shadow</code> on the control, so the ring is layout-free and draws cleanly over the state tint. Border-radius inherits from the control. Both rings always visible — the one-pixel inverse-toned counter-ring guarantees an edge against any surface. Inside a scroller the layer is re-anchored inward (offset flips from <code>0..3px outside</code> to <code>0..3px inside</code>). Suppressed while <code>disabled</code>.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ============================================================
   Do's & Don'ts
   ============================================================ */

const DOS = [
  <><strong>Consume system tokens (<code>sys.*</code>).</strong> <code>var(--sys-color-primary)</code>, not <code>var(--ref-palette-blue-500)</code>. Reference variables exist for documentation only.</>,
  <><strong>Reserve Blue 500 as the sole brand-emphasis accent.</strong> <code>brand</code> (red) is the identity accent and <code>success</code> (green) is the affirmative status accent — neither is a second brand-emphasis hue.</>,
  <><strong>Pair every accent fill with its <code>on*</code> foreground.</strong> <code>primary</code> ↔ <code>onPrimary</code>, <code>primaryContainer</code> ↔ <code>onPrimaryContainer</code>. The pairs are tuned to clear AA.</>,
  <><strong>Compose state as foreground-over-base.</strong> A single rule — <code>state.*</code> opacity layered over the element&apos;s foreground — works on every variant of every component.</>,
  <><strong>Express lift with <code>elevation.*</code> shadows.</strong> Let the <code>surfaceContainer*</code> names carry the spatial <em>meaning</em> (sunken → topmost) even when tones collapse.</>,
  <><strong>Use <code>layout.*</code> for layout-participating spacing.</strong> Page gutters, card insets, and section rhythm grow on web; reach for raw <code>space.*</code> only for fixed-footprint controls.</>,
  <><strong>Apply <code>layout.page.*</code> once at the route root.</strong> Nested content uses <code>layout.container.*</code> / <code>layout.stack.*</code> / <code>layout.inline.*</code>.</>,
  <><strong>Use Pretendard for both Hangul and Latin.</strong> The mixed-script balance is why the typeface was chosen.</>,
  <><strong>Use <code>radius.md</code> for controls and <code>radius.xl</code> for surfaces.</strong> Containers visually &ldquo;hold&rdquo; the controls inside them; compose asymmetric corners from the same scale.</>,
  <><strong>Build every <code>:focus-visible</code> ring from the three-layer composition, on a <code>::after</code> overlay layer.</strong> A <code>position: absolute</code> pseudo-element carries the multi-shadow (so the ring never affects layout): <code>state.focus</code> fill on the control, then <code>1px color.focusInset</code> counter-ring, then <code>2px color.focus</code> outer ring (inline <code>box-shadow</code>; never wrap the multi-shadow in a <code>var()</code>). Inside a clipping scroller, re-anchor the same layer inward.</>,
];

const DONTS = [
  <><strong>Don&apos;t ship <code>ref.*</code> variables in product code.</strong> They&apos;re palette internals; bypassing the system tier defeats rebrandability.</>,
  <><strong>Don&apos;t introduce a secondary accent hue.</strong> Two brand colors compete instead of arrange — they break the chorus.</>,
  <><strong>Don&apos;t read foreground contrast manually or mix <code>on*</code> across roles.</strong> A handpicked text color drifts as the palette evolves and silently breaks AA.</>,
  <><strong>Don&apos;t hardcode hover or pressed colors per component.</strong> Bespoke per-(base × variant) tokens explode the surface and drift independently.</>,
  <><strong>Don&apos;t add tonal elevation in light mode.</strong> All <code>surfaceContainer*</code> tones resolve to <code>#ffffff</code> by design — brighter-on-brighter feels showy and breaks the calm.</>,
  <><strong>Don&apos;t reach for raw <code>space.*</code> for layout-level rhythm.</strong> Section gaps, card-stack rhythm, and page gutters live in <code>layout.*</code> so the web step-up reaches them.</>,
  <><strong>Don&apos;t reapply <code>layout.page.*</code> to nested content.</strong> Page gutters are a viewport concern; full-bleed elements opt out by negating the gutter, not by changing the token.</>,
  <><strong>Don&apos;t substitute Latin-only or Korean-only fonts per region.</strong> Splitting families breaks the mixed-script contract and can fail screen-reader pronunciation.</>,
  <><strong>Don&apos;t introduce per-corner radius tokens.</strong> They multiply the token surface and don&apos;t survive a global radius change.</>,
  <><strong>Don&apos;t use <code>color.focus</code> alone.</strong> A single-layer ring fails contrast against same-toned backgrounds; the full composition is the contract.</>,
];

function DoIcon() {
  return (
    <svg className="guidelines-marker" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.89303 15.8928C10.2836 16.2833 10.9167 16.2833 11.3072 15.8928L16.9501 10.2499C17.3367 9.86331 17.3367 9.23652 16.9501 8.84992C16.5635 8.46332 15.9367 8.46332 15.5501 8.84992L10.6001 13.7999L8.45014 11.6499C8.06354 11.2633 7.43674 11.2633 7.05014 11.6499C6.66354 12.0365 6.66354 12.6633 7.05014 13.0499L9.89303 15.8928ZM12 21.9999C6.47721 21.9999 1.99998 17.5228 1.99998 12C1.99998 6.47713 6.47723 1.99999 12.0001 2.00002C17.5228 2.00004 22 6.47712 22.0001 11.9999C22.0001 17.5227 17.5229 21.9999 12 21.9999Z" fill="currentColor"/>
    </svg>
  );
}

function DontIcon() {
  return (
    <svg className="guidelines-marker" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1.9999 11.9999C1.99994 6.47711 6.47719 2 12 2C17.5229 2 22.0001 6.47715 22.0001 12C22.0001 17.5228 17.5229 22 12 22C6.47713 22 1.99986 17.5228 1.9999 11.9999ZM8.5001 11C7.94782 11 7.5001 11.4477 7.5001 12C7.5001 12.5523 7.94782 13 8.5001 13H15.5001C16.0524 13 16.5001 12.5523 16.5001 12C16.5001 11.4477 16.0524 11 15.5001 11H8.5001Z" fill="currentColor"/>
    </svg>
  );
}

export function Guidelines() {
  const pairCount = Math.max(DOS.length, DONTS.length);
  return (
    <Section id="guidelines">
      <div className="guidelines-grid">
        <h3 className="guidelines-col-title guidelines-col--do">
          <DoIcon />
          <span>Do</span>
        </h3>
        <h3 className="guidelines-col-title guidelines-col--dont">
          <DontIcon />
          <span>Don&apos;t</span>
        </h3>
        {Array.from({ length: pairCount }).map((_, i) => (
          <Fragment key={i}>
            {DOS[i] != null
              ? <div className="guidelines-item">{DOS[i]}</div>
              : <div aria-hidden="true" />}
            {DONTS[i] != null
              ? <div className="guidelines-item">{DONTS[i]}</div>
              : <div aria-hidden="true" />}
          </Fragment>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================
   Foundations — Responsive behavior
   ============================================================ */

const RESPONSIVE_GROWS = [
  { group: 'typo.display.lg',                                      step: '+2 scale steps (48 → 80px)' },
  { group: 'typo.heading.lg',                                      step: '+1 scale step (24 → 32px)' },
  { group: 'typo.display.md/sm, typo.heading.md/sm',               step: 'unchanged — already small enough on any viewport' },
  { group: 'typo.body.*, typo.label.*, typo.caption.*',            step: 'unchanged — reading and tap targets stay constant' },
  { group: 'layout.* at lg and above',                             step: '+1 step (e.g. layout.container.lg 24 → 32px)' },
  { group: 'layout.* at md and below',                             step: 'unchanged — flat across the mobile↔web line' },
  { group: 'Elevation, radius, color, state',                      step: 'unchanged' },
];

const RESPONSIVE_TIERS = [
  { tier: 'mobile',  range: '<800px',          crosses: '—' },
  { tier: 'tablet',  range: '800px – 1099px',  crosses: 'mobile → tablet' },
  { tier: 'laptop',  range: '1100px – 1499px', crosses: 'tablet → laptop' },
  { tier: 'desktop', range: '≥1500px',         crosses: 'laptop → desktop' },
];

function ResponsiveBreakpoint() {
  return (
    <Section
      title="Breakpoints"
      id="responsive-breakpoint"
      description="Chorus names four viewport tiers and the three lines between them. The mobile → tablet line at 800px is the only token-level breakpoint; the upper two are chrome-level."
    >
      <EqualTable
        headers={['Tier', 'Range', 'Crosses']}
        rows={RESPONSIVE_TIERS.map(({ tier, range, crosses }) => [
          <TokenChip>{tier}</TokenChip>,
          range,
          crosses,
        ])}
      />
      <ProseSection>
        <p>The <strong>mobile → tablet</strong> line at <strong>800px</strong> is the only token-level breakpoint (<code>$responsive.web</code>): below it, mobile values apply; at or above, web values apply. Token step-ups stop there — every responsive token carries at most two values. The tablet→laptop and laptop→desktop lines are <em>layout-level</em> breakpoints used by chrome (e.g. side nav becomes a permanent rail at the laptop tier; the in-page nav reveals at the desktop tier). Product code reads tokens; only chrome reaches for the higher tiers.</p>
      </ProseSection>
    </Section>
  );
}

function ResponsiveGrows() {
  return (
    <Section
      title="What grows on web"
      id="responsive-grows-web"
      description="Responsive scaling is baked into the tokens themselves. The system-wide rule: md is the responsive baseline; only sizes above it (lg, xl, 2xl, 3xl) step up at the mobile→tablet line (800px). Reading sizes, tap targets, and the entire md-and-below band of every layout axis stay constant."
    >
      <EqualTable
        headers={['Group', 'Web step-up']}
        rows={RESPONSIVE_GROWS.map(({ group, step }) => [
          <TokenChip>{group}</TokenChip>,
          step,
        ])}
      />
    </Section>
  );
}

function ResponsiveTouchTargets() {
  return (
    <Section
      title="Touch targets"
      id="responsive-touch-targets"
      description={
        <>Tap-target sizing is owned by <a href={asset("/accessibility#a11y-targets")}>Accessibility › Touch &amp; Pointer targets</a>; §Foundations does not redefine it. The same <code>layout.container.sm</code> (12 → 16px padding) default produces a 40–48px control height that already clears the 44px iOS / 48px Material guideline on mobile.</>
      }
    />
  );
}

function ResponsiveImage() {
  return (
    <Section
      title="Images & Media"
      id="responsive-image-media"
      description={
        <>Responsive images use <code>max-width: 100%</code>. Hero compositions that arrange illustration alongside text on web fall back to stacking on mobile — the spacing rhythm carries over via the <code>layout.stack.*</code> step-down.</>
      }
    />
  );
}

function WhyOneBreakpoint() {
  return (
    <Section
      title="Why this split"
      id="responsive-why-one-breakpoint"
      description="Most design systems carry three to five breakpoints and let every token vary across all of them. Chorus splits the responsibilities: tokens vary at one line (mobile↔web), chrome composes the rest."
    >
      <ProseSection>
        <p>Product code stays a single boolean (&ldquo;mobile or web&rdquo;), and the token surface stays honest — every responsive token has at most two values.</p>
        <p>The two upper lines exist because chrome has real call sites at each: the side-nav rail needs a viewport that comfortably hosts content + 320px rail (laptop, ≥1100px), and the in-page nav needs a third column beside both (desktop, ≥1500px). Token step-ups would multiply <code>(token × viewport)</code> pairs across those tiers without payoff — most intermediate sizes get under-tested in practice — so layout shifts stay local to chrome.</p>
      </ProseSection>
    </Section>
  );
}

function PatternDensity() {
  return (
    <Section
      title="Density"
      id="responsive-density"
      description={
        <>Chorus does <strong>not</strong> ship a global &ldquo;compact mode&rdquo; toggle. Density is expressed locally, by picking a smaller <code>typo.label.*</code> rung and a smaller <code>layout.container.*</code> step on the controls that need to be dense. The system already provides the vocabulary; layering a global density mode on top would double the surface and let two ways of asking for &ldquo;smaller&rdquo; drift apart.</>
      }
    >
      <ProseSection title="When you need a denser surface">
        <ul className="rule-list">
          <li>Drop the label one step (<code>label.md</code> → <code>label.sm</code>), drop the matching icon (<code>icon.md</code> → <code>icon.sm</code>).</li>
          <li>Drop container padding one step (<code>layout.container.sm</code> → <code>layout.container.xs</code>).</li>
          <li>Keep <code>radius.md</code> and the focus-ring composition unchanged — density should not erode hit-target legibility.</li>
        </ul>
      </ProseSection>
    </Section>
  );
}

export function Responsive() {
  return (
    <>
      <ResponsiveBreakpoint />
      <ResponsiveGrows />
      <ResponsiveTouchTargets />
      <ResponsiveImage />
      <WhyOneBreakpoint />
      <PatternDensity />
    </>
  );
}

/* ============================================================
   Adapting Chorus
   ============================================================ */

function AdaptingEditingRules() {
  return (
    <Section
      title="Editing rules"
      id="adapting"
      description="Six rules to apply when changing tokens, ordered by safety. Each rule names the tier you should edit at — reference, system, or component — so changes propagate predictably without breaking downstream consumers."
    >
      <ul className="rule-list">
        <li><strong>Rebrand at the reference tier, not the component tier.</strong> If the brand shifts hue, edit <code>ref.palette.*</code>. System roles keep their names and meaning; components keep working untouched.</li>
        <li><strong>Extend the system tier when a role is missing.</strong> Add a new semantic token rather than hardcoding values in components. Document the new role in DESIGN.md <em>before</em> adding the JSON value.</li>
        <li><strong>Promote to the component tier only when reuse demands it.</strong> Don&apos;t pre-emptively wrap every component in component-tier tokens; do so when a component is reused widely and its system-token composition recurs verbatim across surfaces.</li>
        <li><strong>Prune what the service doesn&apos;t need.</strong> If a role has no live use and no clear future use, remove it. Remove its DESIGN.md entry first, then the JSON value.</li>
        <li><strong>Document the <em>why</em>, not the <em>what</em>.</strong> The code already shows what a token is. DESIGN.md captures why it exists.</li>
        <li><strong>One system, many services.</strong> Sub-brands and adjacent products can share the system tier while swapping the reference tier for their own identity.</li>
      </ul>
    </Section>
  );
}

function AdaptingMaturity() {
  return (
    <Section
      title="Maturity stages"
      id="adapting-maturity"
      description="Every token, role, and component primitive carries one of four maturity stages, marked in DESIGN.md beside its first introduction."
    >
      <ul className="rule-list">
        <li><strong>Experimental</strong> — newly added, expected to change. Product code may consume it but should expect breaking edits between minor versions. Default for any token less than a quarter old.</li>
        <li><strong>Stable</strong> — proven across at least three real surfaces; changes follow the deprecation flow. The default state for everything in DESIGN.md unless explicitly marked otherwise.</li>
        <li><strong>Deprecated</strong> — superseded but still present, scheduled for removal. Carries a note pointing to its replacement. Removed in the next major version.</li>
        <li><strong>Removed</strong> — the JSON entry and the DESIGN.md description are both gone. Removed entries leave a one-line tombstone in the changelog.</li>
      </ul>
    </Section>
  );
}

function AdaptingChangeFlow() {
  return (
    <Section
      title="Change flow"
      id="adapting-change-flow"
      description="Changes propagate in this order. Skipping a step is the most common source of drift."
    >
      <ol className="rule-list">
        <li><strong>Propose in DESIGN.md.</strong> Open a PR that edits the prose first — the role, rationale, and stage. The token JSON does not exist yet at this point.</li>
        <li><strong>Review.</strong> At least one design owner and one engineering owner sign off. Reviewers check the two-bar test, naming fit, and rationale specificity.</li>
        <li><strong>Land the JSON value</strong> in the same PR or an immediate follow-up. A documented role with no value is acceptable for one merge cycle; longer than that and the doc rots.</li>
        <li><strong>Communicate.</strong> Add a CHANGELOG entry under the upcoming version, summarizing the change in one line and linking the PR.</li>
        <li><strong>Adopt.</strong> Product surfaces migrate at their own pace inside the version&apos;s deprecation window.</li>
      </ol>
    </Section>
  );
}

function AdaptingVersioning() {
  return (
    <Section
      title="Versioning"
      id="adapting-versioning"
      description="Chorus follows semantic versioning at the token-system level. A breaking change without a major version bump is a bug — fix the version, not the change."
    >
      <ul className="rule-list">
        <li><strong>Major</strong> — any breaking change to a stable token: rename, removal, value shift large enough to break existing layouts. Major versions ship at most quarterly and bundle the migration of every deprecated token from the previous cycle.</li>
        <li><strong>Minor</strong> — additive changes to stable tokens or any change to experimental tokens: new roles, new values inside an existing role&apos;s bounds, deprecations announcing a future removal. Ship as needed.</li>
        <li><strong>Patch</strong> — internal-only fixes that don&apos;t affect emitted CSS values: documentation edits, JSON formatting, build pipeline tweaks. Ship freely.</li>
      </ul>
    </Section>
  );
}

function AdaptingDeprecation() {
  return (
    <Section
      title="Deprecation window"
      id="adapting-deprecation"
      description="Deprecated tokens stay shipping for at least one minor cycle (~one quarter) before removal. The deprecation note in DESIGN.md spells out what replaces it, a one-line migration recipe, and the version the removal is targeted for."
    />
  );
}

function AdaptingOwnership() {
  return (
    <Section
      title="Ownership"
      id="adapting-ownership"
      description="DESIGN.md and schema/tokens/*.json have a single editor of record per cycle, named in the repo README.md. The editor is the tiebreaker on naming, vocabulary, and stage decisions; everyone else proposes, the editor merges. The role rotates so no one person owns the system long enough to grow stale."
    />
  );
}

export function Adapting() {
  return (
    <>
      <AdaptingEditingRules />
      <AdaptingMaturity />
      <AdaptingChangeFlow />
      <AdaptingVersioning />
      <AdaptingDeprecation />
      <AdaptingOwnership />
    </>
  );
}

/* ============================================================
   Agent guide
   ============================================================ */

const AGENT_QUICK_REF = [
  { need: 'Page background',    token: 'color.surface',                light: '#ffffff' },
  { need: 'Primary text',       token: 'color.onSurface',              light: '#121212' },
  { need: 'Secondary text',     token: 'color.onSurfaceVariant',       light: '#3d3d3d' },
  { need: 'Card surface',       token: 'color.surfaceContainer',       light: '#ffffff' },
  { need: 'Card border',        token: 'color.outlineVariant',         light: '#e6e6e6' },
  { need: 'Primary CTA fill',   token: 'color.primary',                light: '#2563eb' },
  { need: 'Primary CTA text',   token: 'color.onPrimary',              light: '#fafafa' },
  { need: 'Link',               token: 'color.primary',                light: '#2563eb' },
  { need: 'Error',              token: 'color.error',                  light: '#b42222' },
  { need: 'Success',            token: 'color.success',                light: '#008838' },
  { need: 'Focus ring (outer)', token: 'color.focus',                  light: '#000000' },
  { need: 'Focus ring (inner)', token: 'color.focusInset',             light: '#ffffff' },
  { need: 'Card padding',       token: 'layout.container.md',          light: '16px' },
  { need: 'Page gutter',        token: 'layout.page.md',               light: '16px' },
  { need: 'Section rhythm',     token: 'layout.stack.lg',              light: '24 → 32px' },
  { need: 'Control radius',     token: 'radius.md',                    light: '8px' },
  { need: 'Surface radius',     token: 'radius.xl',                    light: '16px' },
  { need: 'Card shadow',        token: 'elevation.raised',             light: 'two-layer ambient + spread' },
];

const AGENT_PROMPTS = [
  '"Build a primary button: color.primary background, color.onPrimary text, radius.md corners, layout.container.sm vertical padding and layout.container.md horizontal padding, typo.label.md for the label. On :hover, composite an 8% onPrimary overlay; on :focus-visible, apply the three-layer focus ring."',
  '"Design a content card: color.surfaceContainer background, radius.xl corners, elevation.raised shadow, layout.container.md padding. Title in typo.heading.md color.onSurface; body in typo.body.md color.onSurfaceVariant. Stack title and body with layout.stack.sm."',
  '"Create a form field: color.surfaceVariant background, radius.md corners, layout.container.sm padding. Label above in typo.label.sm color.onSurfaceVariant. Border 1px solid color.outlineVariant; on focus, full three-layer focus composition. Error state: border swaps to color.error, helper text uses color.error at typo.caption.md."',
  '"Build a notification banner using the primaryContainer pair: color.primaryContainer background, color.onPrimaryContainer text and icons, radius.lg corners, layout.container.md padding. Inline with layout.inline.md between icon and text. No shadow — containers stay flat."',
];

const AGENT_PRINCIPLES = [
  <>
    <strong>Design-system-first (Source of Truth).</strong> Chorus is the source of truth for every surface you design. Start from Chorus tokens, components, and patterns — not from generic UI libraries, screenshot inference, or invented values. Read <code>schema/manifest.json</code> + <code>schema/catalog.md</code> before crawling.
  </>,
  <>
    <strong>Component flexibility — extrapolate, don&apos;t fork.</strong> Chorus components ship with reference compositions and per-spec guidelines. Read the intent and respect each component&apos;s anatomy invariants, but feel free to flex how it&apos;s composed (slot fill, layout placement, modifier props) to fit a specific UI/UX context. The contract is the token bindings and the spec&apos;s slot/sizing rules, not the example screenshot.
  </>,
  <>
    <strong>New surfaces stay token-true.</strong> When Chorus has no component for what the surface needs, design a brand-new screen or primitive. The design MUST still resolve every color, spacing, typography, radius, and border-width through Chorus design tokens and foundation rules. No raw hex, no off-scale px, no third-party type ramp — that is the floor regardless of how novel the composition is.
  </>,
  <>
    <strong>Lego-block composition.</strong> Build new surfaces by combining and extending existing Chorus components like Lego blocks — nest, group, sequence, and re-purpose primitives in creative arrangements. Token usage stays non-negotiable; the components themselves are the flexible part. A novel screen should still read as one harmony with the rest of the system.
  </>,
  <>
    <strong>UX-pattern consistency.</strong> Pick components from the interaction the user expects — Dialog for modal commits, BottomSheet for committed-sheet flows, Toast for non-blocking feedback, List for menus/pickers, Feed for authored content streams. Across a single flow, behavior, motion, and affordance language stay predictable; do not reach for a Chip when the user expects a Button, or a Dialog when a Toast is the right rung.
  </>,
];

const AGENT_RULES = [
  <>Reach for <code>color.*</code> system tokens, never raw <code>palette.*</code> — palette steps are documentation-only.</>,
  <>Pair every accent fill with its <code>on*</code> foreground; never read contrast manually.</>,
  <>Use <code>layout.*</code> for layout-participating spacing; reserve raw <code>space.*</code> for fixed-footprint controls.</>,
  <>Default to <code>radius.md</code> for controls and <code>radius.xl</code> for surfaces — the size gap is the point.</>,
  <>State feedback is <em>foreground-over-base at state opacity</em>, never a hardcoded hover color.</>,
  <>The web step-up is automatic; do not branch on viewport for <code>layout.*</code>, <code>display.*</code>, or <code>heading.*</code>.</>,
  <>Pretendard is the only family — do not split fonts between Latin and Hangul.</>,
];

function AgentPrinciples() {
  return (
    <Section
      title="Design principles"
      id="agent-principles"
      description="The five directives every agent — Lovable, Cursor, Claude Design, v0 — applies before reaching for hex values or generic UI libraries. Apply them in order; later directives never override earlier ones."
    >
      <ol className="rule-list">
        {AGENT_PRINCIPLES.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
    </Section>
  );
}

function AgentQuickRef() {
  return (
    <Section
      title="Quick token reference"
      id="agent-quick-ref"
      description="The fastest mapping from common UI needs to system tokens. Pass DESIGN.md whole alongside the JSON values in schema/tokens/ for full agent context."
    >
      <EqualTable
        headers={['Need', 'Token', 'Light value']}
        rows={AGENT_QUICK_REF.map(({ need, token, light }) => [
          need,
          <TokenChip>{token}</TokenChip>,
          <span className="sem-role-meta">{light}</span>,
        ])}
      />
    </Section>
  );
}

function AgentPrompts() {
  return (
    <Section
      title="Example component prompts"
      id="agent-prompts"
      description="Reference prompts that resolve cleanly through the system tier. Copy and adapt; the token vocabulary is the contract."
    >
      <ul className="rule-list">
        {AGENT_PROMPTS.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </Section>
  );
}

function AgentRules() {
  return (
    <Section
      title="Iteration rules"
      id="agent-iteration"
      description="Apply these as guardrails when iterating on agent-generated output."
    >
      <ol className="rule-list">
        {AGENT_RULES.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ol>
    </Section>
  );
}

export function AgentGuide() {
  return (
    <>
      <AgentPrinciples />
      <AgentQuickRef />
      <AgentPrompts />
      <AgentRules />
    </>
  );
}

/* ============================================================
   Iconography
   ============================================================ */

const ICON_SIZES = [
  { token: 'icon.md', px: '16 px', pairs: 'typo.label.md, typo.body.md, typo.body.sm',     use: 'Default. Buttons, list items, menu items, form-field affixes, toolbars, chips, tabs, medium Icon Button, Feed engagement counters.' },
  { token: 'icon.lg', px: '24 px', pairs: 'typo.label.lg, typo.body.lg, typo.heading.sm', use: 'Primary CTAs, prominent toolbar actions, section headers, FAB, Navigation Bar slots, large Icon Button.' },
];

export function Iconography() {
  return (
    <>
      <Section
        title="Family & Style"
        id="icon-family"
        description="Chorus uses one icon family for the entire product. Mixing libraries drifts in stroke weight, terminal style, and corner radius the moment the catalogue grows past a few dozen glyphs; one family keeps the visual language coherent without per-icon review."
      >
        <ul className="rule-list">
          <li><strong>Style</strong> — outlined glyphs at rest, filled glyphs to mark a <em>selected / active / committed</em> state on the same icon. Filled vs outlined is a state signal, not a stylistic choice.</li>
          <li><strong>Stroke weight</strong> — match the weight of the adjacent type. A <code>label.md</code> row pairs with a 1.5–2px stroke; a <code>display.lg</code> hero pairs with a 2.5–3px stroke. The icon should read as <em>part of the line</em>.</li>
          <li><strong>Custom icons</strong> — when a glyph the family doesn&apos;t provide is needed, draw it on the same grid, with the same stroke weight and corner radius as the family&apos;s nearest analogue.</li>
        </ul>
      </Section>
      <Section
        title="Size grid"
        id="icon-size"
        description="Four canonical sizes that align to the type ladder rather than introducing a new scale. Each size matches a category of typo.* so the icon's optical height equals the cap-height of the text beside it."
      >
        <EqualTable
          headers={['Token', 'Pixel size', 'Pairs with', 'Use']}
          rows={ICON_SIZES.map(({ token, px, pairs, use }) => [
            <TokenChip>{token}</TokenChip>,
            px,
            <span className="sem-role-meta">{pairs}</span>,
            use,
          ])}
        />
        <ProseSection>
          <p>The grid is <strong>drawing-area, not bounding-box</strong>. A 20px icon should occupy ~16px of optical weight inside a 20px frame — the 2px breathing margin is what keeps icons aligned with descender-free text. Glyphs designed to a literal 20×20 fill always read too heavy beside the type.</p>
        </ProseSection>
      </Section>
      <Section
        title="Color & State"
        id="icon-color"
        description="Icons consume the same on* foreground tokens as the text they sit with — never a dedicated icon color."
      >
        <ul className="rule-list">
          <li><strong>Solo icon (icon-only button)</strong> — color is the parent control&apos;s foreground role (<code>color.onSurface</code> for a ghost button, <code>color.onPrimary</code> inside a primary fill).</li>
          <li><strong>Icon + label</strong> — both use the same foreground; never paint the icon a different hue for emphasis. Hierarchy belongs to the label.</li>
          <li><strong>Inactive / disabled</strong> — inherit from the surrounding <code>state.disabled</code> opacity; do not pre-darken the icon SVG.</li>
          <li><strong>Status icons</strong> — follow the accent role they signal: <code>color.success</code> for success, <code>color.error</code> for error, paired with their <code>on*</code> foreground when sitting on a filled accent.</li>
          <li><strong>Inline decoration (free-tinting exception)</strong> — when an icon participates as an <em>inline element</em> inside a UI composition (a category glyph that carries its own brand colour, a chart legend swatch, an illustrative pictogram inside a callout) rather than as the foreground of a control, it may paint directly from <code>ref.palette.*</code>. The <code>sys.color.on*</code> contract above governs <em>control foregrounds</em>; an inline decorative glyph has no host foreground to inherit, so reach into the reference palette for the hue the composition needs. Keep it to a single icon-scoped colour (no gradients, no per-stroke retoning), and prefer a system role whenever one fits — the palette escape is for cases where no semantic role matches.</li>
        </ul>
      </Section>
      <Section
        title="Alignment & Layout participation"
        id="icon-align"
        description={
          <>Icons participate in <code>layout.inline.*</code> like any other inline element — the gap between an icon and its label is <code>layout.inline.md</code> by default, <code>layout.inline.sm</code> inside compact controls. Don&apos;t compensate with margin overrides; the gap token is the contract.</>
        }
      >
        <ProseSection>
          <p>For optical centering inside a container, prefer <code>display: inline-flex</code> + <code>align-items: center</code> over <code>vertical-align</code> hacks. Icons drawn off-grid will still betray their misalignment; fix the SVG, not the layout.</p>
        </ProseSection>
      </Section>
      <Section
        title="With update dot"
        id="icon-update-dot"
        description={
          <>An icon may host a <Link href="/components/badge">Badge</Link> <code>dot-sm</code> rung at its top-right to flag new activity behind that target — the same composition contract <Link href="/components/thumbnail">Thumbnail</Link> uses for its <code>updateDot</code> slot. The dot is fixed at <code>dot-sm</code> (6 × 6) regardless of icon rung — at <code>icon.md</code> (20) it lands proportional to the glyph; at <code>icon.lg</code> (24) it stays a <em>highlight</em> rather than a competing chip. The 2px <code>surface</code>-color outline paints as a <code>box-shadow</code>, carving the dot out of whatever sits beside it (icon stroke, list row, navigation surface) so the brand fill always reads as a discrete chip.</>
        }
      >
        <div className="component-preview">
          <div className="component-preview-stage" style={{ gap: 'var(--ref-space-400)', justifyContent: 'center' }}>
            {[NotificationIcon, ChatIcon, MentionIcon].map((Icon, i) => (
              <span key={`lg-${i}`} style={{ position: 'relative', display: 'inline-flex', color: 'var(--sys-color-onSurface)' }}>
                <Icon size={24} />
                <Badge size="dot-sm" style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(25%, -25%)' }} />
              </span>
            ))}
            {[NotificationIcon, ChatIcon, MentionIcon].map((Icon, i) => (
              <span key={`md-${i}`} style={{ position: 'relative', display: 'inline-flex', color: 'var(--sys-color-onSurface)' }}>
                <Icon size={20} />
                <Badge size="dot-sm" style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(25%, -25%)' }} />
              </span>
            ))}
          </div>
        </div>
        <ProseSection>
          <p>The composition is a one-rule pattern: a <code>position: relative</code> host (the icon's inline-flex wrapper), with the Badge <code>dot-sm</code> absolutely positioned at the top-right and nudged a quarter-step outward so the brand fill sits flush against the icon's outer edge. No new icon-scoped tokens; the dot keeps its <code>sys.color.brand</code> fill, <code>radius.full</code> corner, and 2px <code>surface</code>-color outline regardless of host.</p>
        </ProseSection>
      </Section>
      <Section
        title="Source of truth"
        id="icon-source"
        description={
          <>All product icons — across both component code (<code>packages/ui</code>) and documentation surfaces (<code>apps/docs</code>) — must come from <code>@blind-dsai/ui/icons</code>. This is not a recommendation; it is the only sanctioned source. The catalog below is the canonical list — browse it before drawing a new glyph. To add a new icon: drop a <code>.svg</code> file in <code>packages/ui/src/icons/svg/</code> for the original artwork, then register it in <code>packages/ui/src/icons/index.js</code> as a <code>makeIcon(...)</code> entry (the registry powers this catalog automatically).</>
        }
      >
        <ProseSection>
          <p>Inline <code>&lt;svg&gt;</code> in component or page files is permitted in exactly two cases: (a) the brand mark itself — the Chorus logo, which is identity, not iconography, and (b) decorative illustrations bound to a single layout. Anything that could plausibly appear in two places must be in the library, full stop.</p>
          <p>A component lives in the library when it satisfies all three: drawn on the 24×24 grid, uses <code>currentColor</code> for fill/stroke so it picks up the surrounding <code>on*</code> foreground, and renders without a hardcoded pixel size (callers pass <code>size</code>, defaulting to <code>icon.md</code>). These three rules are what make every icon size-, color-, and theme-correct by default — bypassing the library forfeits all three guarantees and silently breaks dark-mode contrast or token-driven density changes.</p>
        </ProseSection>
      </Section>
    </>
  );
}

/* `AllIcons` lives in its own client-side file (search input + filter
   state). Re-exported here so existing imports from `./sections` keep
   working. */
export { AllIcons } from './AllIcons';

/* ============================================================
   Border & Stroke
   ============================================================ */

const BORDER_WIDTHS = [
  { token: 'borderWidth.none',     value: '0px', role: 'No stroke. The width values here are what a control\'s stroke reads at; a control whose stroke should disappear in some state sets its colour transparent, not its width to 0px (see the box-model note below). borderWidth.none is for the rare layout where dropping the stroke\'s box is the intent — e.g. a divider that should genuinely collapse.' },
  { token: 'borderWidth.hairline', value: '1px', role: 'Default. Subtle dividers (table rows, list separators), card edges, input borders, outlined buttons.' },
  { token: 'borderWidth.thin',     value: '2px', role: 'Emphasis borders — focus ring outer, selected-state outlines, error-state field borders.' },
  { token: 'borderWidth.thick',    value: '4px', role: 'Load-bearing strokes — keyboard-focus emphasis on touch surfaces, active tab underline at hero scale, decorative rules. Use sparingly.' },
];

export function BorderStroke() {
  return (
    <>
      <Section
        title="Why a width scale"
        id="border-why"
        description="Hardcoded values (border: 1px, border: 2px) accumulate inconsistently across components. A small named scale gives every stroke a reason for its weight, the same way radius.* gives every corner a reason for its softness."
      />
      <Section
        title="Scale"
        id="border-scale"
        description="Four steps from no border to a load-bearing stroke."
      >
        <EqualTable
          headers={['Token', 'Value', 'Role']}
          rows={BORDER_WIDTHS.map(({ token, value, role }) => [
            <TokenChip>{token}</TokenChip>,
            value,
            role,
          ])}
        />
        <ProseSection>
          <p>The focus ring composition consumes <code>borderWidth.thin</code> for the outer ring and a 1px inner counter-ring; the 1px counter is a `borderWidth.hairline`-equivalent literal kept inline so the focus recipe is one self-contained `box-shadow`.</p>
          <p><strong>Sub-pixel widths are forbidden.</strong> A 0.5px hairline renders inconsistently across DPR (retina shows it; non-retina drops it entirely). When a thinner-than-1px effect is needed, lower the <em>opacity</em> of the stroke color, not the width.</p>
          <p><strong>A control&apos;s stroke never touches the box model — implement it as an inset <code>box-shadow</code>, not a <code>border</code>.</strong> Every interactive control (Button, Chip, Toggle / Toolbar Button, the Tabs that delegate to Chip, Form field input, …) draws its edge stroke as <code>box-shadow: inset 0 0 0 &lt;width&gt; &lt;colour&gt;</code> on the control box, with <code>border: none</code>. A box-shadow is paint, not layout, so: an <code>outlined</code> Button is the <em>same size</em> as a filled one (no <code>+2px</code>); a Filter chip / Segmented tab swapping selected ↔ unselected changes only the shadow&apos;s <em>colour</em> (<code>transparent</code> where the stroke should read as gone), so a chip row never jitters; a text field stepping from a <code>hairline</code> rest stroke to a <code>thin</code> active stroke just widens the shadow, so its height stays exactly <code>content + padding</code> (40px, never 42) and the caret doesn&apos;t move. Same reasoning as the <a href={asset("/state#state-focus-ring")}>focus ring</a> being a <code>position: absolute</code> overlay layer: a stroke, a state change to one, or a focus indicator must never reflow a layout. Set <code>box-sizing: border-box</code> on the control too (don&apos;t rely on the consumer&apos;s reset). (Structural dividers between rows are a different thing — those <em>are</em> layout and a real <code>border</code> is fine; this is about a control&apos;s own edge stroke.)</p>
        </ProseSection>
      </Section>
    </>
  );
}

/* ============================================================
   Accessibility
   ============================================================ */

export function Accessibility() {
  return (
    <>
      <Section
        title="Conformance targets"
        id="a11y-conformance"
        description="Chorus targets WCAG 2.2 Level AA as the floor for every product surface, and AAA where the foundations already meet it (e.g. the onSurface/surface pair clears AAA at 7:1 in both modes). AA is the contract: a surface that fails AA is a bug, not a stylistic choice."
      />
      <Section
        title="Color contrast"
        id="a11y-contrast"
        description="Contrast is enforced by the paired-token rule: every fill ships with its own on* foreground, and the pair is tuned to clear 4.5:1 for body text and 3:1 for large text and non-text UI components."
      >
        <ul className="rule-list">
          <li><strong>Never read contrast manually.</strong> If two roles aren&apos;t paired (<code>primary</code> + <code>onPrimary</code>, <code>surface</code> + <code>onSurface</code>), they aren&apos;t a permitted combination.</li>
          <li><strong>Surface stack is single-pair.</strong> All <code>surfaceContainer*</code> tones read against <code>onSurface</code>. The container ladder carries spatial meaning, not contrast variation.</li>
          <li><strong>Lower-emphasis text uses <code>onSurfaceVariant</code></strong> — still ≥ 4.5:1 against every surface tone, deliberately one step lighter than <code>onSurface</code>.</li>
          <li><strong>Disabled is the exception.</strong> <code>state.disabled</code> (40% element opacity) drops below AA on purpose — disabled controls are not interactive. Never use disabled styling to convey live information.</li>
        </ul>
      </Section>
      <Section
        title="Touch & Pointer targets"
        id="a11y-targets"
        description="Mobile tap targets are governed by layout.container.sm (12 → 16px padding) on default-size controls, producing a default control height around 40–48px — comfortably above the 44px iOS / 48px Material guideline."
      >
        <ul className="rule-list">
          <li><strong>Minimum 44 × 44 CSS pixels</strong> for any interactive element on touch surfaces. Icon-only buttons inflate their hit area with transparent padding.</li>
          <li><strong>Independent targets need an 8px gap</strong> (<code>layout.inline.md</code> mobile) so adjacent controls don&apos;t share a hit zone.</li>
          <li><strong>Pointer (desktop) targets</strong> can shrink — a 24px close button in a toolbar is fine — but never below 24px or below <code>borderWidth.thin</code> × 2 for the visible silhouette.</li>
        </ul>
      </Section>
      <Section
        title="Keyboard navigation"
        id="a11y-keyboard"
        description="Every interactive control must be reachable, operable, and visible to a keyboard."
      >
        <ul className="rule-list">
          <li><strong>Tab order follows DOM order.</strong> Don&apos;t override with <code>tabindex</code> greater than <code>0</code>.</li>
          <li><strong><code>:focus-visible</code>, not <code>:focus</code>.</strong> Mouse interactions never paint the focus ring; keyboard and programmatic focus always do.</li>
          <li><strong>Skip link</strong> to main content lives at the very top of every route, visually hidden until focused.</li>
          <li><strong>Custom controls match native semantics.</strong> If you can&apos;t replicate the native semantics (role, keyboard activation, ARIA state), use the native element.</li>
          <li><strong>Arrow-key navigation inside composite widgets</strong> (tab bars, menus, toolbars) follows the WAI-ARIA Authoring Practices.</li>
          <li><strong>Focus must never be trapped</strong> outside an explicit modal context. Modals trap focus while open and restore it to the trigger on close.</li>
        </ul>
      </Section>
      <Section
        title="Screen reader & Assistive tech"
        id="a11y-aria"
        description="Programmatic semantics carry the same weight as visual ones."
      >
        <ul className="rule-list">
          <li><strong>Visible label is the accessible label.</strong> Never duplicate or contradict in <code>aria-label</code>.</li>
          <li><strong>Icon-only controls require an accessible name</strong> via <code>aria-label</code>. Decorative icons next to a text label use <code>aria-hidden=&quot;true&quot;</code>.</li>
          <li><strong>Live regions for async feedback.</strong> Toasts, snackbars, and inline form-validation messages live inside <code>aria-live=&quot;polite&quot;</code> (<code>assertive</code> only for genuinely interruptive failures).</li>
          <li><strong>Form fields own their labels.</strong> Every input has a programmatic label; placeholder text is not a label. Required state is conveyed both visually and via <code>aria-required</code>.</li>
          <li><strong>Error association</strong> uses <code>aria-describedby</code> pointing at the helper-text node, plus <code>aria-invalid=&quot;true&quot;</code> on the field.</li>
          <li><strong>Don&apos;t override <code>lang</code>.</strong> Mixed-script content stays under one root <code>&lt;html lang=&quot;ko&quot;&gt;</code>; <code>&lt;span lang&gt;</code> only when a fragment genuinely switches language.</li>
        </ul>
      </Section>
      <Section
        title="Motion & Animation"
        id="a11y-motion"
        description="Treat reduced-motion as the safe default the rest of the system has to opt out of."
      >
        <ul className="rule-list">
          <li><strong>Respect <code>prefers-reduced-motion: reduce</code>.</strong> Collapse transitions to 0ms (or near-zero) and skip transform-based animations.</li>
          <li><strong>No flashing more than 3 times per second</strong> anywhere — WCAG 2.3.1 hard requirement. Most likely failure mode is loading skeletons; cap pulse rate at 2 Hz.</li>
          <li><strong>Auto-advancing carousels and auto-playing video are forbidden</strong> without user control.</li>
        </ul>
      </Section>
      <Section
        title="Visual & Cognitive"
        id="a11y-visual"
        description="Accessibility extends past contrast and keyboards — consider zoom, reflow, and contrast preferences."
      >
        <ul className="rule-list">
          <li><strong>Don&apos;t convey meaning by color alone.</strong> Required-field markers, error states, status pills all pair color with text or an icon.</li>
          <li><strong>Resize support to 200%.</strong> Type scales in rem (anchored to user preference); layout doesn&apos;t break, no horizontal scroll appears at zoom 200%.</li>
          <li><strong>Reflow at 320 CSS pixels.</strong> Mobile-narrow content reflows without horizontal scroll except for elements that genuinely need 2D scrolling.</li>
          <li><strong><code>prefers-contrast: more</code></strong> is honored where it matters — increase border weight from <code>borderWidth.hairline</code> to <code>borderWidth.thin</code>, switch <code>outlineVariant</code> to <code>outline</code>.</li>
          <li><strong>Plain language.</strong> Error messages, empty states, and primary actions use the Voice & Content rules — short sentences, no jargon, the user&apos;s language.</li>
        </ul>
      </Section>
      <Section
        title="Internationalization"
        id="a11y-i18n"
        description="Chorus is a Korean-first product with regular Latin admixture. The accessibility implications are smaller than they look but worth naming explicitly."
      >
        <ul className="rule-list">
          <li><strong>One typeface for both scripts.</strong> Substitute fonts for Latin-only or Korean-only regions break the mixed-script contract and can fail screen-reader pronunciation.</li>
          <li><strong>Title Case is not used</strong> because it has no Korean analogue. Localized strings stay sentence case across every language.</li>
          <li><strong>Translation expansion budget.</strong> Most layouts must absorb ~30% string growth (German, French) without breaking. Use <code>min-width</code> / <code>max-width</code> based on the longest plausible localization.</li>
          <li><strong>Bidirectional (RTL) text</strong> is currently out of scope. When Chorus does adopt an RTL locale, the layout axes become logical (<code>inline-start</code> / <code>inline-end</code>); plan for that swap rather than baking <code>left</code>/<code>right</code> into product code today.</li>
          <li><strong>Number, date, currency formatting</strong> uses the platform <code>Intl</code> APIs with the user&apos;s locale — not hand-rolled formatters.</li>
        </ul>
      </Section>
    </>
  );
}

/* ============================================================
   Voice & Content
   ============================================================ */

export function VoiceContent() {
  return (
    <>
      <Section
        title="Voice principles"
        id="voice-principles"
        description="The brand voice is clear, calm, trustworthy — the same three words the visual language is tuned to. In writing, that translates to four habits."
      >
        <ul className="rule-list">
          <li><strong>Plain over clever.</strong> &ldquo;Save changes&rdquo; beats &ldquo;Lock it in.&rdquo; Cleverness ages badly across translations and reads as marketing inside a product surface.</li>
          <li><strong>Direct over hedged.</strong> &ldquo;We couldn&apos;t load your settings&rdquo; beats &ldquo;It seems there may have been an issue loading your settings.&rdquo; Hedge words erode trust.</li>
          <li><strong>User&apos;s words, not ours.</strong> Use the noun the user typed (<em>post</em>, <em>comment</em>, <em>room</em>) over our internal name (<em>thread</em>, <em>entity</em>, <em>space</em>).</li>
          <li><strong>Anonymous-friendly.</strong> The product is built for users who speak more freely without their name attached. Default to second-person plural or impersonal constructions.</li>
        </ul>
      </Section>
      <Section
        title="Buttons & CTAs"
        id="voice-buttons"
        description="The contract that keeps button labels coherent across surfaces."
      >
        <ul className="rule-list">
          <li><strong>Intuitive and concise.</strong> Drop the object when the surrounding surface already names it. A &ldquo;Manage&rdquo; affordance trailing a keyword-filter row reads as &ldquo;manage these keywords&rdquo; without restating &ldquo;Manage keywords&rdquo;. Shorter labels lower the reader&apos;s parse cost and keep the row compact — but never shorten when the verb alone is ambiguous (see destructive-actions rule below).</li>
          <li><strong>Verb + object, sentence case.</strong> &ldquo;Save changes&rdquo;, &ldquo;Send invite&rdquo;, &ldquo;Delete post&rdquo;. One verb; if you need two, the action is doing too much. Reach for the explicit object whenever the surrounding context doesn&apos;t already pin it down.</li>
          <li><strong>Primary CTA is the most likely intent</strong>, not the most important to us. &ldquo;Continue&rdquo; beats &ldquo;Submit&rdquo; on a multi-step form.</li>
          <li><strong>Destructive actions name what&apos;s destroyed.</strong> &ldquo;Delete account&rdquo; beats &ldquo;Delete&rdquo;; the explicit object lets a user catch the mistake before the confirm dialog. This is the carve-out from the concise rule — danger trumps brevity.</li>
          <li><strong>Cancel is always &ldquo;Cancel&rdquo;</strong> — never &ldquo;Nevermind&rdquo; or &ldquo;Keep editing&rdquo;. The convention is more important than the cleverness.</li>
          <li><strong>No trailing punctuation</strong> on button labels.</li>
        </ul>
      </Section>
      <Section
        title="Error messages"
        id="voice-errors"
        description="Three-part structure: what happened · why it matters to the user · what to do next. Drop any part that isn't load-bearing — but never invert the order."
      >
        <ul className="rule-list">
          <li>❌ &ldquo;Error 422: validation failed.&rdquo; ✅ &ldquo;Email is already in use. Try signing in instead.&rdquo;</li>
          <li><strong>Lead with the user&apos;s action</strong>, not the system&apos;s state. &ldquo;Couldn&apos;t send your post&rdquo; over &ldquo;Server returned 500&rdquo;.</li>
          <li><strong>Never blame the user.</strong> &ldquo;Wrong password&rdquo; → &ldquo;That password didn&apos;t match.&rdquo;</li>
          <li><strong>Avoid jargon and codes</strong> in user-facing copy. Status codes belong in dev tools, not in toast bodies.</li>
        </ul>
      </Section>
      <Section
        title="Empty states"
        id="voice-empty"
        description="Three lines max: what this surface is for · why it's empty right now · the one action that fills it."
      >
        <ProseSection>
          <p>✅ &ldquo;No posts yet. Conversations you start or join will appear here. <strong>Start a post.</strong>&rdquo;</p>
          <p>The CTA inside an empty state is often the surface&apos;s primary action — make it primary visually too (<code>color.primary</code> button).</p>
        </ProseSection>
      </Section>
      <Section
        title="Loading & Success"
        id="voice-loading"
        description="Concrete progress beats a vague spinner caption. Success copy is short and past-tense."
      >
        <ul className="rule-list">
          <li><strong>Loading copy</strong> describes the action, not &ldquo;Loading…&rdquo;. &ldquo;Saving your draft&rdquo;, &ldquo;Sending invite&rdquo;, &ldquo;Loading 3 of 12 posts&rdquo;.</li>
          <li><strong>Success copy is short and past-tense.</strong> &ldquo;Saved.&rdquo;, &ldquo;Sent.&rdquo;, &ldquo;Copied to clipboard.&rdquo; — the period is doing work. Never use exclamation marks; the brand voice is calm.</li>
        </ul>
      </Section>
      <Section
        title="Form helper & Validation"
        id="voice-form"
        description="Helper text describes the rule before the user fails it; validation messages refer back to the same rule."
      >
        <ul className="rule-list">
          <li><strong>Helper before failure.</strong> &ldquo;8+ characters with a number&rdquo; — not after.</li>
          <li><strong>Required is marked once</strong>, not on every field. Either mark required (&ldquo;*&rdquo;) or mark optional — pick the rarer label so the cognitive load is small.</li>
          <li><strong>Inline validation</strong> fires on blur for new fields, on input for fields the user has already failed once. Don&apos;t lecture mid-typing.</li>
        </ul>
      </Section>
      <Section
        title="Casing, punctuation, numbers"
        id="voice-casing"
        description="The Casing rules in Typography are the canonical source. A few additions specific to body copy."
      >
        <ul className="rule-list">
          <li><strong>Sentence-final punctuation</strong> in toast bodies, helper text, and empty-state prose. Buttons, labels, and chips drop the period.</li>
          <li><strong>Single quotes for inner quotation, double for outer</strong> in English. Korean uses 「 」 for inner and 『 』 for outer per Korean orthographic convention.</li>
          <li><strong>No Oxford comma in Korean</strong> (no equivalent); honor it consistently in English copy.</li>
          <li><strong>Numbers under 10 spelled out in prose</strong> (English); always use numerals for measurements, IDs, dates, currency. Korean uses numerals throughout.</li>
          <li><strong><code>–</code> for ranges</strong> (3–5 posts), <code>—</code> for parenthetical breaks, never <code>--</code> or two hyphens in production strings.</li>
          <li><strong>Date formats</strong> — Korean default <code>YYYY.MM.DD</code>; English default <code>D MMM YYYY</code>. Never <code>MM/DD/YYYY</code> — the order is ambiguous across locales.</li>
        </ul>
      </Section>
      <Section
        title="Localization"
        id="voice-l10n"
        description="Write source strings translation-ready."
      >
        <ul className="rule-list">
          <li><strong>Avoid embedded HTML or markdown in strings</strong>; use placeholders (<code>{'{name}'}</code>, <code>{'{count}'}</code>) so translators can reorder. Sentence fragments are harder to translate than full sentences.</li>
          <li><strong>Plurals via ICU MessageFormat</strong>, not string concatenation. Korean has no grammatical plural; English has two; some languages have six.</li>
          <li><strong>Don&apos;t truncate at character counts.</strong> Translation expansion routinely doubles a Korean string in German; layouts must accommodate via <code>min-width</code> / wrap.</li>
          <li><strong>Time-sensitive strings</strong> (&ldquo;just now&rdquo;, &ldquo;2 hours ago&rdquo;) use platform <code>Intl.RelativeTimeFormat</code>, not hand-rolled phrasing.</li>
        </ul>
      </Section>
    </>
  );
}

/* ============================================================
   Components — anatomy
   ============================================================ */

// `Components` is the directory of links to each component's sub-page —
// pure docs navigation, not Chorus-spec content. The framework-level
// sections (Why anatomy / Empty / Loading) are pulled out of DESIGN.md by
// the page itself so the docs never re-author what the spec already says.
/* Component entries are kept in alphabetical order (case-insensitive)
   so readers can locate a component by name without remembering a
   category. Mirrors the side-nav order in `apps/docs/lib/nav.js`. */
const COMPONENT_INDEX = [
  ['badge',         'Badge',         'Numeric count pill (medium / small) that attaches to a host label — channel entry, list row, thumbnail corner — and reports the unread or update count.'],
  ['banner',        'Banner',        'An in-body tinted block (default / accent) that explains a feature or annotates content — short paragraph plus an optional follow-through link, with no decision attached.'],
  ['bottom-sheet',  'Bottom Sheet',  'A bottom-anchored panel rising from the viewport edge over a scrim — drag handle, scrollable content (title / body / custom), and a pinned primary action; for explanations and decisions that need more room than a Dialog.'],
  ['button',        'Button',        'The action-surface family — Standard Button (three sizes × four appearances), FAB (canvas-anchored floating commit), Icon / Text / Toolbar Buttons (icon-only, link-shaped, dense-inline), Toggle (reversible Follow ↔ Following), and Check (option-toggle with leading checkbox).'],
  ['channel-list',  'Channel List',  'A swipeable pager of channel suggestions — three rows per page (Thumbnail 48 + name / followers / description + Toggle Button), with the next page peeking to invite the swipe.'],
  ['channel-rail',  'Channel Rail',  'A horizontally-scrolling rail of subscribed channels — circular thumbnail + name, with an edge fade indicating off-screen items and an optional trailing "View all" action.'],
  ['chip',          'Chip',          'A small, content-shaped control or label — Filter (selectable, single-toggle) and Tag (informational metadata).'],
  ['dialog',        'Dialog',        'A centred card over a scrim that interrupts the surface for a single decision — title + body + a vertical stack of primary / tertiary actions, dismissible via the scrim or the Esc key.'],
  ['feed',          'Feed',          'The scrolling-stream card family — Post (authored content card: channel header, body block, optional inline modules, engagement footer) and Ad (in-feed sponsored placement: brand row, optional headline + body, a hero + CTA slab, no engagement row).'],
  ['form-field',    'Form Field',    'Text-entry primitives — Input (single-line field, hairline outline at rest, heavier focus ring, optional leading icon and clear button, error re-tone), Search (the same field with a leading SearchIcon and a pill `radius.full` corner), and Select (Input-shaped picker that opens a BottomSheet). Compose multiple fields into shared-label rows or 16px vertical stacks via FormFieldGroup.'],
  ['list',          'List',          'A vertical sequence of rows for menus, settings panels, and picker sheets — Text (display / nav), Radio (single-select picker), Thumbnail (avatar-anchored), Nav (drill-in chevron). One row anatomy; per-sub leading slot and selection contract.'],
  ['navigation-bar', 'Navigation Bar', 'Top app bar — Home (left-aligned 24/Semibold title + leading menu + up to three trailing icons), Page (centred 16/Semibold title + leading back + trailing icon/button/link), and Search (leading back + bare-text input filling the row + conditional clear). All three at a 56 min-height with 8/8 padding.'],
  ['tab-bar',       'Tab Bar',       'Bottom-anchored primary navigation — a horizontal row of icon + 10/Regular label items at a 56 min-height. Items are distributed with optical alignment (start padding = inter-item gap = end padding); the active item swaps to the filled companion glyph at onSurface.'],
  ['tabs',          'Tabs',          'Horizontal mutually-exclusive selectors — Underline (content-section switcher with primary indicator), Rounded (chip-delegated soft rectangles), and Segmented (chip-delegated capsule track).'],
  ['thumbnail',     'Thumbnail',     'A small-rung circular image (16 / 20 / 24 / 32 / 40 / 48) with optional top-right update dot and bottom-right logo badge.'],
];

export function Components() {
  return (
    <Section
      title="Component specs"
      id="comp-directory"
      description="One page per component, sourced from the matching markdown spec in schema/components/. Open a component for slots, default bindings, variants, sizes, states, and behavior."
    >
      <ul className="rule-list">
        {COMPONENT_INDEX.map(([slug, label, summary]) => (
          <li key={slug}>
            <Link href={`/components/${slug}`}><strong>{label}</strong></Link> — {summary}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ============================================================
   Glossary
   ============================================================ */

const GLOSSARY = [
  ['Reference tier (ref.*)', 'Raw palettes, scales, and typeface metrics with no opinion about usage. Components never consume the reference tier directly.'],
  ['System tier (sys.*)', 'Semantic roles that consume the reference tier and form the vocabulary product surfaces speak in. The default tier for any product code.'],
  ['Component tier (comp.*)', 'Per-component tokens that bind system roles to a component’s contract. Opt-in; currently empty by design.'],
  ['Quartet', 'The fixed four-token unit every accent role ships as: X / onX / XContainer / onXContainer. The unit of meaning; never use a fill without its on*.'],
  ['Container ladder', 'The five-step surfaceContainerLowest → Lowest → default → High → Highest stack. Encodes spatial role, not five distinct fill tones.'],
  ['Base-unit ladder', 'The single canonical numeric ladder (0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 40 · 48 · 64 · 80) that spacing (px), type (px), and opacity (%) all draw from.'],
  ['Layout axis', 'One of four orthogonal spacing roles: page, container, stack, inline. Each owns one spatial relationship and is applied by exactly one kind of element.'],
  ['Veil / Scrim / Endpoint', 'The three opacity bands of palette.black / palette.white: veil (4–24%) for state overlays, scrim (40–80%) for backdrop dimming, endpoint (0% / 100%) for reset and fully-opaque uses.'],
  ['Tonal elevation', 'M3’s pattern of expressing lift via brighter surface tones. Chorus caps tonal elevation in light mode (all surfaceContainer* collapse onto #ffffff); lift comes from elevation.* shadows.'],
  ['State overlay', 'The single rule that paints a translucent layer of an element’s foreground color over its base, at the opacity defined by state.*. One rule, every variant.'],
  ['Focus ring composition', 'The fixed three-layer focus indicator: outer ring + fill + inner counter-ring. Every interactive control uses the same composition; never single-layer rings. Drawn as a position:absolute ::after overlay layer so it never affects layout (re-anchored inward for controls inside a clipping scroller).'],
  ['Slot', 'A named region inside a component anatomy (container, label, leadingIcon, …). Tokens bind to slots, not to components as a whole.'],
  ['$rem, $multiplier, $responsive.web', 'Chorus extensions to the DTCG token format.'],
  ['Maturity stage', 'One of experimental / stable / deprecated / removed; marked beside a token’s first introduction.'],
];

export function Glossary() {
  return (
    <EqualTable
      headers={['Term', 'Definition']}
      rows={GLOSSARY.map(([term, def]) => [term, def])}
    />
  );
}
