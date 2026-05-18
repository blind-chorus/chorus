export const NAV = [
  {
    group: 'Introduction',
    items: [
      {
        href: '/',
        label: 'Chorus',
        toc: [
          { id: 'about-chorus',       label: 'About Chorus' },
          { id: 'what-this-means',    label: 'What this means for the system' },
          { id: 'scope',              label: 'Scope' },
          { id: 'visual-theme',       label: 'Visual theme & Atmosphere' },
          { id: 'token-architecture', label: 'Token architecture' },
        ],
      },
    ],
  },
  {
    group: 'Foundations',
    items: [
      {
        href: '/color',
        label: 'Color',
        toc: [
          { id: 'color-reference', label: 'Reference palettes' },
          { id: 'color-overlay',   label: 'Overlay palettes' },
          { id: 'color-accent',    label: 'Accent roles' },
          { id: 'color-surface',   label: 'Surface stack' },
          { id: 'color-utility',   label: 'Outline · Inverse · Focus · Scrim' },
          { id: 'color-darkmode',  label: 'Dark-mode strategy' },
          { id: 'color-dataviz',   label: 'Data visualization palette' },
        ],
      },
      {
        href: '/typography',
        label: 'Typography',
        toc: [
          { id: 'typography-pretendard',    label: 'Font family' },
          { id: 'typography-grid',          label: 'Categories × Sizes' },
          { id: 'typography-principles',    label: 'Tracking & Line-height principles' },
          { id: 'typography-letterspacing', label: 'Letter-spacing scale' },
          { id: 'typography-fontsize',      label: 'Font-size scale' },
          { id: 'typography-casing',        label: 'Casing' },
        ],
      },
      {
        href: '/iconography',
        label: 'Iconography',
        toc: [
          { id: 'icon-family', label: 'Family & Style' },
          { id: 'icon-size',   label: 'Size grid' },
          { id: 'icon-color',  label: 'Color & State' },
          { id: 'icon-align',  label: 'Alignment & Layout' },
          { id: 'icon-source', label: 'Source of truth' },
        ],
        subs: [
          { href: '/iconography/all', label: 'All icons', toc: [{ id: 'icon-catalog', label: 'All icons' }] },
        ],
      },
      {
        href: '/spacing',
        label: 'Spacing & Layout',
        toc: [
          { id: 'spacing-base',      label: '8px base unit' },
          { id: 'spacing-reference', label: 'Reference scale' },
          { id: 'spacing-axes',      label: 'Layout axes' },
          { id: 'spacing-page',      label: 'Viewport-edge gutter' },
          { id: 'spacing-container', label: 'Surface-internal padding' },
          { id: 'spacing-stack',     label: 'Vertical sibling gap' },
          { id: 'spacing-inline',    label: 'Horizontal sibling gap' },
        ],
      },
      {
        href: '/radius',
        label: 'Radius',
        toc: [
          { id: 'radius-scale',           label: 'Reference scale' },
          { id: 'radius-asymmetric',      label: 'Asymmetric radii' },
          { id: 'radius-capsule-circle',  label: 'Capsule vs circle' },
        ],
      },
      {
        href: '/border',
        label: 'Border & Stroke',
        toc: [
          { id: 'border-why',   label: 'Why a width scale' },
          { id: 'border-scale', label: 'Scale' },
        ],
      },
      { href: '/elevation', label: 'Elevation' },
      {
        href: '/state',
        label: 'State layers & Focus',
        toc: [
          { id: 'state-layer-overlays', label: 'State overlays' },
          { id: 'state-focus-ring',     label: 'Focus ring composition' },
        ],
      },
      {
        href: '/responsive',
        label: 'Responsive behavior',
        toc: [
          { id: 'responsive-breakpoint',          label: 'Breakpoints' },
          { id: 'responsive-grows-web',           label: 'What grows on web' },
          { id: 'responsive-touch-targets',       label: 'Touch targets' },
          { id: 'responsive-image-media',         label: 'Images & Media' },
          { id: 'responsive-why-one-breakpoint',  label: 'Why this split' },
          { id: 'responsive-density',             label: 'Density' },
        ],
      },
    ],
  },
  {
    group: 'Accessibility',
    items: [
      {
        href: '/accessibility',
        label: 'Accessibility',
        toc: [
          { id: 'a11y-conformance', label: 'Conformance targets' },
          { id: 'a11y-contrast',    label: 'Color contrast' },
          { id: 'a11y-targets',     label: 'Touch & Pointer targets' },
          { id: 'a11y-keyboard',    label: 'Keyboard navigation' },
          { id: 'a11y-aria',        label: 'Screen reader & Assistive tech' },
          { id: 'a11y-motion',      label: 'Motion & Animation' },
          { id: 'a11y-visual',      label: 'Visual & Cognitive' },
          { id: 'a11y-i18n',        label: 'Internationalization' },
        ],
      },
    ],
  },
  {
    group: 'Guidelines',
    items: [
      {
        href: '/guidelines',
        label: 'Guidelines',
      },
    ],
  },
  {
    group: 'Voice & Content',
    items: [
      {
        href: '/voice',
        label: 'Voice & Content',
        toc: [
          { id: 'voice-principles', label: 'Voice principles' },
          { id: 'voice-buttons',    label: 'Buttons & CTAs' },
          { id: 'voice-errors',     label: 'Error messages' },
          { id: 'voice-empty',      label: 'Empty states' },
          { id: 'voice-loading',    label: 'Loading & Success' },
          { id: 'voice-form',       label: 'Form helper & Validation' },
          { id: 'voice-casing',     label: 'Casing, punctuation, numbers' },
          { id: 'voice-l10n',       label: 'Localization' },
        ],
      },
    ],
  },
  {
    group: 'Components',
    groupHref: '/components',
    groupToc: [
      { id: 'comp-why',       label: 'Why anatomy, not a catalogue' },
      { id: 'comp-directory', label: 'Component specs' },
      { id: 'comp-empty',     label: 'Empty states' },
      { id: 'comp-loading',   label: 'Loading & Skeleton states' },
    ],
    /* Component entries are kept in alphabetical order (case-
       insensitive) so readers can locate a component by name without
       having to remember a category. Sub-components inside each family
       are alphabetized too. Keep this invariant when adding a new
       component or sub. */
    items: [
      {
        href: '/components/badge',
        label: 'Badge',
      },
      {
        href: '/components/bottom-sheet',
        label: 'Bottom Sheet',
      },
      {
        href: '/components/button',
        label: 'Button',
        subs: [
          { href: '/components/button/fab', label: 'FAB' },
          { href: '/components/button/icon', label: 'Icon Button' },
          { href: '/components/button/text', label: 'Text Button' },
          { href: '/components/button/toggle', label: 'Toggle Button' },
          { href: '/components/button/toolbar', label: 'Toolbar Button' },
        ],
      },
      {
        href: '/components/callout',
        label: 'Callout',
      },
      {
        href: '/components/channel-list',
        label: 'Channel List',
      },
      {
        href: '/components/channel-rail',
        label: 'Channel Rail',
      },
      {
        href: '/components/chip',
        label: 'Chip',
        subs: [
          { href: '/components/chip/filter', label: 'Filter' },
          { href: '/components/chip/tag', label: 'Tag' },
        ],
      },
      {
        href: '/components/dialog',
        label: 'Dialog',
      },
      {
        href: '/components/feed',
        label: 'Feed',
      },
      {
        href: '/components/form-field',
        label: 'Form Field',
        subs: [
          { href: '/components/form-field/input', label: 'Input' },
          { href: '/components/form-field/search', label: 'Search Bar' },
        ],
      },
      {
        href: '/components/list',
        label: 'List',
        subs: [
          { href: '/components/list/text',      label: 'Text List' },
          { href: '/components/list/radio',     label: 'Radio List' },
          { href: '/components/list/thumbnail', label: 'Thumbnail List' },
          { href: '/components/list/nav',       label: 'Nav List' },
        ],
      },
      {
        href: '/components/navigation-bar',
        label: 'Navigation Bar',
        subs: [
          { href: '/components/navigation-bar/home',   label: 'Home' },
          { href: '/components/navigation-bar/page',   label: 'Page' },
          { href: '/components/navigation-bar/search', label: 'Search' },
        ],
      },
      {
        href: '/components/tab-bar',
        label: 'Tab Bar',
      },
      {
        href: '/components/tabs',
        label: 'Tabs',
        subs: [
          { href: '/components/tabs/rounded', label: 'Rounded' },
          { href: '/components/tabs/segmented', label: 'Segmented' },
          { href: '/components/tabs/underline', label: 'Underline' },
        ],
      },
      {
        href: '/components/thumbnail',
        label: 'Thumbnail',
      },
    ],
  },
  {
    group: 'Reference',
    items: [
      {
        href: '/adapting',
        label: 'Adapting Chorus',
        toc: [
          { id: 'adapting',              label: 'Editing rules' },
          { id: 'adapting-maturity',     label: 'Maturity stages' },
          { id: 'adapting-change-flow',  label: 'Change flow' },
          { id: 'adapting-versioning',   label: 'Versioning' },
          { id: 'adapting-deprecation',  label: 'Deprecation window' },
          { id: 'adapting-ownership',    label: 'Ownership' },
        ],
      },
      { href: '/glossary', label: 'Glossary' },
      {
        href: '/agent-guide',
        label: 'Agent guide',
        toc: [
          { id: 'agent-quick-ref',  label: 'Quick token reference' },
          { id: 'agent-prompts',    label: 'Example component prompts' },
          { id: 'agent-iteration',  label: 'Iteration rules' },
        ],
      },
    ],
  },
];

const NAV_BY_HREF = new Map();
for (const group of NAV) {
  if (group.groupHref) {
    NAV_BY_HREF.set(group.groupHref, { label: group.group, toc: group.groupToc });
  }
  for (const item of group.items) {
    NAV_BY_HREF.set(item.href, item);
    for (const sub of item.subs ?? []) NAV_BY_HREF.set(sub.href, sub);
  }
}

export function findToc(pathname) {
  return NAV_BY_HREF.get(pathname)?.toc ?? [];
}

export function findNavLabel(pathname) {
  return NAV_BY_HREF.get(pathname)?.label ?? null;
}
