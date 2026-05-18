import { useState } from 'react';
import { Badge, BottomSheet, Button, Callout, ChannelList, ChannelRail, Chip, Dialog, Tabs, Tab, Feed, FormField, List, NavigationBar, TabBar, Thumbnail } from '@blind-chorus/ui';
import { AddIcon, AddSquareFillIcon, BackwardIcon, BookmarkIcon, BriefcaseIcon, BriefcaseFillIcon, ChatIcon, CheckedIcon, CloseIcon, CompanyIcon, CompanyFillIcon, ForwardIcon, HeartIcon, HomeIcon, HomeFillIcon, MenuIcon, MoreIcon, NotificationIcon, NotificationFillIcon, ProfileIcon, ProfileFillIcon, SearchIcon, StarIcon } from '@blind-chorus/ui/icons';
import { SpecIcon } from './SpecIcon';

/* Imagery for the community-feed previews. URLs point at Unsplash's CDN
   (clean license for docs reuse). Helper builds query params for size +
   focus so a single photo serves both the small avatar (160px square)
   and the larger card cover (320px square) without hosting our own
   assets. If any photo 404s, swap the path — only this map needs to
   change. */
const UNSPLASH = (path, size) => {
  const [w, h] = Array.isArray(size) ? size : [size, size];
  return `https://images.unsplash.com/${path}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
};

const IMG = {
  // Sourdough loaf with open crumb — Monika Grabkowska
  bread: '/placeholder.png',
  breadCover: UNSPLASH('photo-1509440159596-0249088772ff', 320),
  breadAvatar: UNSPLASH('photo-1509440159596-0249088772ff', 160),
  breadHero16x9: UNSPLASH('photo-1509440159596-0249088772ff', [640, 360]),
  // Pixel-art game / arcade machines
  gameCover: UNSPLASH('photo-1493711662062-fa541adb3fc8', 320),
  gameAvatar: UNSPLASH('photo-1493711662062-fa541adb3fc8', 160),
  // Monstera / houseplant
  plantCover: UNSPLASH('photo-1545241047-6083a3684587', 320),
  plantAvatar: UNSPLASH('photo-1545241047-6083a3684587', 160),
  // Empty cinema seats — Felix Mooneeram (avatar + citation hero)
  cinemaAvatar: UNSPLASH('photo-1517604931442-7e0c8ed2963c', 160),
  cinemaHero: UNSPLASH('photo-1517604931442-7e0c8ed2963c', 320),
  // Calendar / event motif for community AMA citation hero
  eventHero: UNSPLASH('photo-1540575467063-178a50c2df87', 320),
  // Abstract pattern for moderator / community banner
  modCover: UNSPLASH('photo-1517245386807-bb43f82c33c4', 320),
  modAvatar: UNSPLASH('photo-1517245386807-bb43f82c33c4', 160),
  // ChannelRail brand-channel avatars. Real brand logos are off-limits
  // (trademark); these Unsplash photos depict the industry the channel
  // covers — automotive, consumer electronics, semiconductor, etc. — so
  // the rail reads as a varied set of company channels without using
  // any company's mark.
  brandAuto: UNSPLASH('photo-1503376780353-7e6692767b70', 160),       // sports car
  brandPhone: UNSPLASH('photo-1511707171634-5f897ff02aa9', 160),      // smartphone
  brandLaptop: UNSPLASH('photo-1517694712202-14dd9538aa97', 160),     // laptop / screen
  brandEngine: UNSPLASH('photo-1492144534655-ae79c964c9d7', 160),     // engine / parts
  brandChat: UNSPLASH('photo-1521791136064-7986c2920216', 160),       // colleagues talking
  brandAppliance: UNSPLASH('photo-1593359677879-a4bb92f829d1', 160),  // home appliance
  brandChip: UNSPLASH('photo-1518770660439-4636190af475', 160),       // circuit board
  brandSuv: UNSPLASH('photo-1542362567-b07e54358753', 160),           // suv
};

/* App-width-filling components (NavigationBar, Feed, ChannelList, Channel
   Rail, Dialog inline, BottomSheet inline, FormField, …) cap at 400px so
   the preview stage reads as a mobile-app viewport regardless of the
   browser's actual width. Compact specimens (Button, Chip, Badge) skip
   the wrapper and sit on the stage naturally. See the "Preview width
   rule" entry in the project's collaboration notes. */
const Frame = ({ children }) => (
  <div style={{ width: '100%', maxWidth: 400 }}>{children}</div>
);

/* Stateful tabs preview wrapper — `Tabs` is controlled, so the registry
   render needs its own React state to make the demo interactive (click a
   tab to switch it). `focusedValue`, when given, pins the accessibility
   focus ring on that one tab — used by the `/focused` demo cases so the
   ring shows statically without forcing it onto the whole row. */
function TabsDemo({ variant, items, initialValue, focusedValue }) {
  const [value, setValue] = useState(initialValue);
  return (
    <Tabs variant={variant} value={value} onChange={setValue} aria-label="Demo">
      {items.map(({ value: v, label, icon, ariaLabel }) => (
        <Tab
          key={v}
          value={v}
          state={v === focusedValue ? 'focused' : undefined}
          leadingIcon={icon}
          aria-label={ariaLabel}
        >
          {label}
        </Tab>
      ))}
    </Tabs>
  );
}

/* Dialog is shown always-open so the specimen reads as the dialog
   itself — same pattern as Feed, ChannelList, every other block
   component. `onClose` is a no-op inside the preview frame. */
function DialogDefaultDemo() {
  return (
    <Dialog
      inline
      open
      onClose={() => {}}
      title="Pick your major and get tailored job recommendations"
      body="We'll surface the companies and roles your seniors applied to most often, first."
      primaryAction={{ label: 'Pick major', onClick: () => {} }}
      secondaryAction={{ label: 'Later', onClick: () => {} }}
    />
  );
}

function DialogWithImageDemo() {
  return (
    <Dialog
      inline
      open
      onClose={() => {}}
      title="You earned the Sourdough Starter badge"
      body="Three open-crumb bakes shared this week — your channel just lit up."
      image={{ src: IMG.breadHero16x9, alt: 'Sourdough Starter badge', width: 640, height: 360 }}
      primaryAction={{ label: 'Share to channel', onClick: () => {} }}
      secondaryAction={{ label: 'Not now', onClick: () => {} }}
    />
  );
}

/* Stateful wrapper for the Channel List preview — each row owns a
   `following` boolean toggled by its trailing Toggle Button. The demo
   seeds a couple of rows as already-following so visitors can read
   both states (Follow / Following) on the live block. */
function ChannelListDemo() {
  const seed = [
    { value: 'sourdough', name: 'Sourdough Bakers', followers: '12.4K Followers', description: 'Open-crumb obsession, cold-proof timing, starter help.', thumbnail: { src: IMG.breadAvatar,  alt: 'Sourdough Bakers' }, following: false },
    { value: 'indiedev',  name: 'Indie Game Devs',  followers: '8,210 Followers', description: 'Shipping logs, postmortems, marketing on a budget.', thumbnail: { src: IMG.gameAvatar,   alt: 'Indie Game Devs' }, following: false },
    { value: 'plants',    name: 'Plant People',     followers: '21.7K Followers', description: 'Houseplant troubleshooting and propagation threads.', thumbnail: { src: IMG.plantAvatar,  alt: 'Plant People' }, following: true  },
    { value: 'movies',    name: 'Movie Talk',       followers: '34.2K Followers', description: 'Festival coverage, director threads, link shares.', thumbnail: { src: IMG.cinemaAvatar, alt: 'Movie Talk' }, following: false },
    { value: 'mods',      name: 'Community Mods',   followers: '1,840 Followers', description: 'Weekly digests and rules discussion across channels.', thumbnail: { src: IMG.modAvatar,    alt: 'Community Mods' }, following: false },
    { value: 'amas',      name: 'AMAs',             followers: '5,120 Followers', description: 'Scheduled Q&A sessions with founders and creators.', thumbnail: { src: IMG.brandChat,    alt: 'AMAs' }, following: true  },
  ];
  const [rows, setRows] = useState(seed);
  const items = rows.map((r) => ({
    ...r,
    active: r.following,
    onToggle: () => setRows((prev) => prev.map((p) => (p.value === r.value ? { ...p, following: !p.following } : p))),
  }));
  return (
    <ChannelList
      label="Recommended channels"
      headerAction={{ label: 'See all', href: '#all' }}
      items={items}
    />
  );
}

/* Stateful wrapper for the radio List preview — `List` is controlled
   on its `value`, so the demo holds local state to make the picker
   interactive in the docs. */
function RadioListDemo() {
  const [value, setValue] = useState('trending');
  return (
    <List
      variant="radio"
      value={value}
      onChange={setValue}
      aria-label="Sort posts by"
      items={[
        { value: 'newest',     label: 'Newest first' },
        { value: 'trending',   label: 'Trending' },
        { value: 'most-liked', label: 'Most liked' },
        { value: 'most-reply', label: 'Most replies' },
        { value: 'oldest',     label: 'Oldest first' },
      ]}
    />
  );
}

/* Registry of preview specimens referenced from component spec markdown via
   ` ```preview\n<id>\n``` ` fences. The component spec markdown
   (`schema/components/<name>/<name>.md`) is the single source of truth for
   slots / sizes / variants / states; this registry only maps a fence id to
   the live JSX the docs renders, so visitors can poke the actual control
   while reading the spec.

   API convention: `variant` is the family slot (Button: cta / fab / compact;
   Chip: filter / tag); `appearance` is the per-family emphasis (CTA:
   primary / secondary / outlined / tertiary; FAB: primary / surface).

   Sizes lists largest → smallest per the project size-menu ordering
   convention. */

const BUTTON_SIZES = ['large', 'medium', 'small'];
const FAB_STATES = ['default', 'hovered', 'pressed', 'focused'];

/* Per-appearance previews opt in to `supportsDisabled` so the stage toolbar
   surfaces a Disabled checkbox; flipping it forces `state="disabled"` on the
   live specimen, replacing the need for a parallel "disabled" preview row.
   Use-case previews (With icon / Full width / Group / Truncation / Focused)
   do not expose the toggle — the disabled tone is already documented inside
   the Appearance bucket. */
function buttonPreview(appearance, label) {
  return {
    sizes: BUTTON_SIZES,
    supportsDisabled: true,
    render: ({ size = 'large', state, disabled }) => (
      <Button appearance={appearance} size={size} state={disabled ? 'disabled' : state}>
        {label}
      </Button>
    ),
  };
}

export const PREVIEWS = {
  /* Headline appearance previews. */
  'button/primary':   buttonPreview('primary',   'Primary action'),
  'button/secondary': buttonPreview('secondary', 'Secondary action'),
  'button/outlined':  buttonPreview('outlined',  'See more'),
  'button/tertiary':  buttonPreview('tertiary',  'Tertiary action'),

  /* Focused — the accessibility focus ring (2px `sys.color.focus` stroke
     outside a 1px `sys.color.focusInset` counter-ring). Its own case
     because the preview has no State control; hover / press are felt on
     the live specimens above, focus gets shown here statically. */
  'button/focused': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large' }) => (
      <Button appearance="primary" size={size} state="focused">
        Primary action
      </Button>
    ),
  },

  /* Group — horizontal pairing: outlined (left, supplementary) +
     primary (right, commit) at a fixed 8px gap (`sys.layout.inline.md`). */
  'button/button-group': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sys-layout-inline-md)' }}>
        <Button appearance="outlined" size={size} state={state}>See more</Button>
        <Button appearance="primary"  size={size} state={state}>Confirm</Button>
      </div>
    ),
  },

  /* Group — vertical pairing: primary (top, commit) over secondary
     (bottom, opposing) at the same 8px gap (`sys.layout.stack.xs`). */
  'button/button-group-vertical': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--sys-layout-stack-xs)', width: 328 }}>
        <Button appearance="primary"   size={size} state={state} fullWidth>Save</Button>
        <Button appearance="secondary" size={size} state={state} fullWidth>Cancel</Button>
      </div>
    ),
  },

  /* Full width — single button stretched to the surrounding column. */
  'button/full-width': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <Button appearance="primary" size={size} state={state} fullWidth>
        Confirm
      </Button>
    ),
  },

  /* With icon — standard Button carries a leading icon only. */
  'button/icon-leading': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <Button appearance="primary" size={size} state={state} leadingIcon={<AddIcon />}>
        Add item
      </Button>
    ),
  },

  /* Truncation — long label inside a width-constrained frame. */
  'button/truncation': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <div style={{ width: 200, maxWidth: '100%' }}>
        <Button appearance="primary" size={size} state={state} truncate fullWidth>
          A very long label that should truncate gracefully
        </Button>
      </div>
    ),
  },

  /* FAB — single sizing rung, two appearances (primary/surface), three slot
     forms (icon / text / icon + text). FAB has no `disabled` state. */
  'button/fab/primary': {
    states: FAB_STATES,
    render: ({ state }) => (
      <Button variant="fab" appearance="primary" state={state} icon={<AddIcon />}>
        Compose
      </Button>
    ),
  },
  'button/fab/secondary': {
    states: FAB_STATES,
    render: ({ state }) => (
      <Button variant="fab" appearance="secondary" state={state} icon={<AddIcon />}>
        Compose
      </Button>
    ),
  },
  'button/fab/icon': {
    states: FAB_STATES,
    render: ({ state }) => (
      <Button variant="fab" appearance="primary" state={state} icon={<AddIcon />} aria-label="Add" />
    ),
  },
  'button/fab/text': {
    states: FAB_STATES,
    render: ({ state }) => (
      <Button variant="fab" appearance="primary" state={state}>Compose</Button>
    ),
  },
  'button/fab/extended': {
    states: FAB_STATES,
    render: ({ state }) => (
      <Button variant="fab" appearance="primary" state={state} icon={<AddIcon />}>Add item</Button>
    ),
  },

  /* Button → Toolbar Button — dense inline action. Single appearance;
     reuses the Filter chip's chrome. */
  'button/toolbar/secondary': {
    supportsDisabled: true,
    render: ({ state, disabled }) => (
      <Button variant="toolbar" state={disabled ? 'disabled' : state}>Edit</Button>
    ),
  },
  'button/toolbar/leading-icon': {
    render: ({ state }) => (
      <Button variant="toolbar" state={state} leadingIcon={<AddIcon />}>
        Add row
      </Button>
    ),
  },
  'button/toolbar/trailing-icon': {
    render: ({ state }) => (
      <Button variant="toolbar" state={state} trailingIcon={<CheckedIcon />}>
        Sort by date
      </Button>
    ),
  },
  'button/toolbar/primary': {
    supportsDisabled: true,
    render: ({ state, disabled }) => (
      <Button variant="toolbar" appearance="primary" state={disabled ? 'disabled' : state}>Save</Button>
    ),
  },
  'button/toolbar/icon-only': {
    render: ({ state }) => (
      <Button variant="toolbar" state={state} leadingIcon={<AddIcon />} aria-label="Add" />
    ),
  },
  'button/toolbar/group': {
    render: ({ state }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sys-layout-inline-sm)', flexWrap: 'wrap' }}>
        <Button variant="toolbar" state={state} leadingIcon={<AddIcon />}>Add</Button>
        <Button variant="toolbar" state={state}>Edit</Button>
        <Button variant="toolbar" state={state} trailingIcon={<CheckedIcon />}>Sort</Button>
      </div>
    ),
  },

  /* Button → Icon Button — icon-only commit at a 40 × 40 transparent
     capsule. Sized by padding around a 24-glyph; transparent at rest,
     state overlays on hover / pressed / focus. */
  'button/icon/default': {
    sizes: ['large', 'medium'],
    render: ({ size = 'large', state }) => (
      <Button variant="icon" size={size} icon={<SearchIcon />} aria-label="Search" state={state} />
    ),
  },
  'button/icon/group': {
    sizes: ['large', 'medium'],
    render: ({ size = 'large', state }) => (
      <div style={{ display: 'inline-flex', gap: 'var(--sys-layout-inline-xl)' }}>
        <Button variant="icon" size={size} icon={<SearchIcon />}  aria-label="Search"   state={state} />
        <Button variant="icon" size={size} icon={<ChatIcon />}    aria-label="Messages" state={state} />
        <Button variant="icon" size={size} icon={<ProfileIcon />} aria-label="Profile"  state={state} />
      </div>
    ),
  },
  'button/icon/focused': {
    sizes: ['large', 'medium'],
    render: ({ size = 'large' }) => (
      <Button variant="icon" size={size} icon={<SearchIcon />} aria-label="Search" state="focused" />
    ),
  },

  /* Button → Text Button — link-shaped commit. Label-coloured Semibold
     text at rest (no fill, no border), state-overlay background on hover /
     pressed, standard focus ring on focus. Three sizes (medium / small /
     xsmall) for the row's density and two appearances (primary / secondary)
     for emphasis. */
  'button/text/primary': {
    sizes: ['medium', 'small', 'xsmall'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="text" size={size} appearance="primary" state={disabled ? 'disabled' : state}>Skip</Button>
    ),
  },
  'button/text/secondary': {
    sizes: ['medium', 'small', 'xsmall'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="text" size={size} appearance="secondary" state={disabled ? 'disabled' : state}>Not now</Button>
    ),
  },
  'button/text/leading-icon': {
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium', state }) => (
      <Button variant="text" size={size} state={state} leadingIcon={<BackwardIcon />}>Back</Button>
    ),
  },
  'button/text/trailing-icon': {
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium', state }) => (
      <Button variant="text" size={size} state={state} trailingIcon={<ForwardIcon />}>Continue</Button>
    ),
  },
  'button/text/group': {
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium', state }) => {
      const gap = size === 'xsmall' ? 'var(--sys-layout-inline-lg)' : 'var(--sys-layout-inline-xl)';
      return (
        <div style={{ display: 'inline-flex', gap }}>
          <Button variant="text" size={size} appearance="secondary" state={state}>Cancel</Button>
          <Button variant="text" size={size} state={state}>Save</Button>
        </div>
      );
    },
  },
  'button/text/focused': {
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium' }) => (
      <Button variant="text" size={size} state="focused">Skip</Button>
    ),
  },

  /* Button → Toggle Button — reversible commit at the Toolbar footprint.
     Inactive = primary fill; active = surface + hairline outline. */
  'button/toggle/inactive': {
    render: ({ state }) => (
      <Button variant="toggle" state={state}>Follow</Button>
    ),
  },
  'button/toggle/active': {
    render: ({ state }) => (
      <Button variant="toggle" active state={state}>Following</Button>
    ),
  },
  'button/toggle/with-icon': {
    render: ({ state }) => (
      <Button variant="toggle" active state={state} leadingIcon={<CheckedIcon />}>
        Following
      </Button>
    ),
  },

  /* Chip → Filter — selectable, capsule-shaped toggle. */
  'chip/filter/unselected': {
    render: ({ state }) => (
      <Chip variant="filter" state={state}>All</Chip>
    ),
  },
  'chip/filter/selected': {
    render: ({ state }) => (
      <Chip variant="filter" state={state} selected>All</Chip>
    ),
  },
  'chip/filter/leading-icon': {
    render: ({ state }) => (
      <Chip variant="filter" state={state} selected leadingIcon={<CheckedIcon />}>
        Selected
      </Chip>
    ),
  },
  'chip/filter/trailing-icon': {
    render: ({ state }) => (
      <Chip variant="filter" state={state} trailingIcon={<CloseIcon />}>
        Today
      </Chip>
    ),
  },
  'chip/filter/group': {
    render: ({ state }) => (
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-sm)', flexWrap: 'wrap' }}>
        <Chip variant="filter" state={state} selected>All</Chip>
        <Chip variant="filter" state={state}>Open</Chip>
        <Chip variant="filter" state={state}>Closed</Chip>
        <Chip variant="filter" state={state}>Archived</Chip>
      </div>
    ),
  },

  /* Chip → Tag — square-cornered, filled metadata label. */
  'chip/tag/default': {
    render: ({ state }) => (
      <Chip variant="tag" state={state}>Design</Chip>
    ),
  },
  'chip/tag/dismissable': {
    render: ({ state }) => (
      <Chip variant="tag" state={state} trailingIcon={<CloseIcon />}>Newsletter</Chip>
    ),
  },
  'chip/tag/group': {
    render: ({ state }) => (
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexWrap: 'wrap', gap: 'var(--sys-layout-inline-sm)' }}>
        <Chip variant="tag" state={state}>Design</Chip>
        <Chip variant="tag" state={state}>Engineering</Chip>
        <Chip variant="tag" state={state}>Research</Chip>
        <Chip variant="tag" state={state}>Product</Chip>
        <Chip variant="tag" state={state}>Marketing</Chip>
        <Chip variant="tag" state={state}>Operations</Chip>
        <Chip variant="tag" state={state}>Customer success</Chip>
      </div>
    ),
  },

  /* Form field → Input — single-line text field. The wrapper carries the
     border / fill / overlay / focus ring. The interactive feedback states
     (Default / hover / press / active) — and the value lifecycle (empty
     → placeholder in the recessed colour; typed → full-strength text +
     the trailing "×" clear button auto-appears) — are all felt by
     interacting with the Default specimen, so they get no separate case;
     only `focused` (the a11y ring, which can't be triggered by hovering)
     is broken out below. */
  'form-field/input/default': {
    supportsDisabled: true,
    render: ({ disabled }) => (
      <Frame>
        <FormField variant="input" placeholder="Place holder" disabled={disabled} />
      </Frame>
    ),
  },
  'form-field/input/with-label': () => (
    <Frame>
      <FormField
        variant="input"
        label="Label text"
        placeholder="Place holder"
        helper="Assistive text"
      />
    </Frame>
  ),
  'form-field/input/with-count': () => (
    <Frame>
      <FormField
        variant="input"
        label="Label text"
        placeholder="Place holder"
        defaultValue="Text"
        maxLength={30}
      />
    </Frame>
  ),
  'form-field/input/error': {
    supportsDisabled: true,
    render: ({ disabled }) => (
      <Frame>
        <FormField variant="input" appearance="error" placeholder="Place holder" disabled={disabled} />
      </Frame>
    ),
  },
  'form-field/input/focused': () => (
    <Frame>
      <FormField variant="input" placeholder="Place holder" state="focused" />
    </Frame>
  ),

  /* Form field → Search bar — search-shaped sibling of Input. Same field,
     pinned SearchIcon at the inner-left edge + `sys.radius.full` pill
     corner. Same lifecycle (placeholder → typed value; trailing clear
     auto-appears when focused with a value); the leading glyph is
     decorative (aria-hidden) and the search action runs through the input
     itself. */
  'form-field/search/default': {
    supportsDisabled: true,
    render: ({ disabled }) => (
      <Frame>
        <FormField variant="search" placeholder="Search" disabled={disabled} />
      </Frame>
    ),
  },
  'form-field/search/error': {
    supportsDisabled: true,
    render: ({ disabled }) => (
      <Frame>
        <FormField variant="search" appearance="error" placeholder="Search" disabled={disabled} />
      </Frame>
    ),
  },
  'form-field/search/focused': () => (
    <Frame>
      <FormField variant="search" placeholder="Search" state="focused" />
    </Frame>
  ),

  /* Tabs → Underline — content-section switcher. The selected tab carries
     a 2px primary-blue indicator that paints over the row's bottom divider
     so the active tab attaches to its panel. */
  'tabs/underline/default': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="underline"
          initialValue="posts"
          state={state}
          items={[
            { value: 'posts',   label: 'Posts' },
            { value: 'replies', label: 'Replies' },
            { value: 'likes',   label: 'Likes' },
          ]}
        />
      </Frame>
    ),
  },
  'tabs/underline/overflow': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="underline"
          initialValue="posts"
          state={state}
          items={[
            { value: 'posts',     label: 'Posts' },
            { value: 'replies',   label: 'Replies' },
            { value: 'likes',     label: 'Likes' },
            { value: 'media',     label: 'Media' },
            { value: 'saved',     label: 'Saved' },
            { value: 'drafts',    label: 'Drafts' },
            { value: 'about',     label: 'About' },
          ]}
        />
      </Frame>
    ),
  },
  'tabs/underline/leading-icon': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="underline"
          initialValue="posts"
          state={state}
          items={[
            { value: 'posts',   label: 'Posts',   icon: <AddIcon /> },
            { value: 'replies', label: 'Replies' },
            { value: 'likes',   label: 'Likes',   icon: <CheckedIcon /> },
          ]}
        />
      </Frame>
    ),
  },
  /* Auto-fit — the wider terminal of Adaptive width. The host is
     uncapped (per the preview width contract for app-width-filling
     specimens, but the row's *own* logic decides the terminal): the
     three short labels' intrinsic widths sum well under the row's
     `clientWidth`, so `useAdaptiveFit` writes `data-fit="stretch"` and
     each tab claims 1/3 of the row. */
  'tabs/underline/auto-fit': {
    render: ({ state }) => (
      <div style={{ width: '100%' }}>
        <TabsDemo
          variant="underline"
          initialValue="feed"
          state={state}
          items={[
            { value: 'feed',     label: 'Feed' },
            { value: 'channels', label: 'Channels' },
            { value: 'members',  label: 'Members' },
          ]}
        />
      </div>
    ),
  },

  /* Tabs → Rounded — chip-delegated tabs with a soft 8px corner radius
     (one step down from Segmented's capsule). Three usage forms:
     label-only, label+icon, icon-only. Selected = inverseSurface fill;
     unselected = surfaceContainerHigh + outlineVariant hairline. */
  'tabs/rounded/default': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="rounded"
          initialValue="latest"
          state={state}
          items={[
            { value: 'latest',    label: 'Latest' },
            { value: 'popular',   label: 'Popular' },
            { value: 'following', label: 'Following' },
          ]}
        />
      </Frame>
    ),
  },
  'tabs/rounded/leading-icon': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="rounded"
          initialValue="latest"
          state={state}
          items={[
            { value: 'latest',    label: 'Latest',    icon: <SpecIcon name="clock"    /> },
            { value: 'popular',   label: 'Popular',   icon: <SpecIcon name="fire"     /> },
            { value: 'favorites', label: 'Favorites', icon: <HeartIcon /> },
            { value: 'saved',     label: 'Saved',     icon: <BookmarkIcon /> },
          ]}
        />
      </Frame>
    ),
  },
  'tabs/rounded/icon-only': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="rounded"
          initialValue="featured"
          state={state}
          items={[
            { value: 'featured', icon: <StarIcon />, ariaLabel: 'Featured' },
            { value: 'saved',    icon: <BookmarkIcon />, ariaLabel: 'Saved'    },
            { value: 'loved',    icon: <HeartIcon />, ariaLabel: 'Loved'    },
          ]}
        />
      </Frame>
    ),
  },
  'tabs/rounded/overflow': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="rounded"
          initialValue="day"
          state={state}
          items={[
            { value: 'day',     label: 'Day',     icon: <SpecIcon name="clock" /> },
            { value: 'week',    label: 'Week',    icon: <SpecIcon name="clock" /> },
            { value: 'month',   label: 'Month',   icon: <SpecIcon name="clock" /> },
            { value: 'quarter', label: 'Quarter', icon: <SpecIcon name="clock" /> },
            { value: 'year',    label: 'Year',    icon: <SpecIcon name="clock" /> },
            { value: 'decade',  label: 'Decade',  icon: <SpecIcon name="clock" /> },
            { value: 'century', label: 'Century', icon: <SpecIcon name="clock" /> },
          ]}
        />
      </Frame>
    ),
  },

  /* Tabs → Segmented — capsule of pill-fill segments. Selected segment
     fills with `inverseSurface` against the surrounding `surfaceContainerHigh`
     container. Shares per-segment footprint with Filter chip / Toolbar Button. */
  'tabs/segmented/default': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="segmented"
          initialValue="list"
          state={state}
          items={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
        />
      </Frame>
    ),
  },
  'tabs/segmented/leading-icon': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="segmented"
          initialValue="grid"
          state={state}
          items={[
            { value: 'list', label: 'List', icon: <CheckedIcon /> },
            { value: 'grid', label: 'Grid', icon: <AddIcon /> },
          ]}
        />
      </Frame>
    ),
  },

  /* ── Focused cases ──────────────────────────────────────────────────
     The accessibility focus ring (2px `sys.color.focus` stroke outside a
     1px `sys.color.focusInset` counter-ring) shown statically per
     control. The pointer-driven states (hover / press) are felt on the
     live specimens above; focus gets its own case because it can't be
     triggered by hovering and must never be a control's only focus
     signal. Each renders the control with `state="focused"`; for tabs the
     ring is pinned to one tab via `focusedValue`. */
  'button/fab/focused': () => (
    <Button variant="fab" appearance="primary" state="focused" icon={<AddIcon />}>
      Compose
    </Button>
  ),
  'button/toolbar/focused': () => (
    <Button variant="toolbar" state="focused" leadingIcon={<AddIcon />}>
      Add row
    </Button>
  ),
  'button/toggle/focused': () => (
    <Button variant="toggle" state="focused">Follow</Button>
  ),
  'chip/filter/focused': () => (
    <Chip variant="filter" state="focused">All</Chip>
  ),
  'chip/tag/focused': () => (
    <Chip variant="tag" state="focused" trailingIcon={<CloseIcon />}>Newsletter</Chip>
  ),
  'tabs/underline/focused': () => (
    <Frame>
      <TabsDemo
        variant="underline"
        initialValue="posts"
        focusedValue="posts"
        items={[
          { value: 'posts',   label: 'Posts' },
          { value: 'replies', label: 'Replies' },
          { value: 'likes',   label: 'Likes' },
        ]}
      />
    </Frame>
  ),
  'tabs/rounded/focused': () => (
    <Frame>
      <TabsDemo
        variant="rounded"
        initialValue="latest"
        focusedValue="latest"
        items={[
          { value: 'latest',    label: 'Latest' },
          { value: 'popular',   label: 'Popular' },
          { value: 'following', label: 'Following' },
        ]}
      />
    </Frame>
  ),
  'tabs/segmented/focused': () => (
    <Frame>
      <TabsDemo
        variant="segmented"
        initialValue="list"
        focusedValue="list"
        items={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
        ]}
      />
    </Frame>
  ),

  /* Thumbnail — small-rung circular image. */
  'thumbnail/default': {
    states: false,
    render: () => <Thumbnail size={48} src="/placeholder.png" alt="Channel" />,
  },
  'thumbnail/with-update-dot': {
    states: false,
    render: () => <Thumbnail size={48} src="/placeholder.png" alt="Channel" updateDot />,
  },
  'thumbnail/with-logo-badge': {
    states: false,
    render: () => (
      <Thumbnail
        size={48}
        src="/placeholder.png"
        alt="Channel"
        logoBadge={{ src: '/placeholder_logo.png', alt: 'Workspace' }}
      />
    ),
  },
  'thumbnail/with-both': {
    states: false,
    render: () => (
      <Thumbnail
        size={48}
        src="/placeholder.png"
        alt="Channel"
        updateDot
        logoBadge={{ src: '/placeholder_logo.png', alt: 'Workspace' }}
      />
    ),
  },
  'thumbnail/size-ladder': {
    states: false,
    render: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Thumbnail size={48} src="/placeholder.png" alt="Channel A" updateDot />
        <Thumbnail size={40} src="/placeholder.png" alt="Channel B" updateDot />
        <Thumbnail size={32} src="/placeholder.png" alt="Channel C" updateDot />
        <Thumbnail size={24} src="/placeholder.png" alt="Channel D" updateDot />
        <Thumbnail size={20} src="/placeholder.png" alt="Channel E" updateDot />
        <Thumbnail size={16} src="/placeholder.png" alt="Channel F" updateDot />
      </div>
    ),
  },

  /* Feed — composite content card. Copy is staged as a multi-channel
     community feed: a hobbyist sourdough channel, an indie game-dev
     discussion, an indoor-plants poll, an arts-and-culture link share,
     and a pinned moderator post. The variety is intentional — readers
     should feel the slot grammar in action, not a single brand. Channel
     names stay neutral (plain capitalised phrases, no platform-specific
     prefixes) so the previews read across any community product. */
  'feed/default': {
    states: false,
    render: () => (
      <Frame>
        <Feed
          avatar={{ src: IMG.breadAvatar, alt: 'Sourdough Bakers' }}
          channel="Sourdough Bakers"
          timestamp="2h"
          followAction
          meta={['Brooklyn, NY', 'Home baker', '@crustcrumb']}
          title="The 30-hour cold proof finally clicked — here's what changed"
          body="Tried it three times before and got the same flat, dense crumb. The fourth attempt I lowered the hydration five points and skipped the second stretch-and-fold. Open crumb, blistered crust, the works. Photos and the schedule in the comments for anyone else stuck on the same wall."
          thumbnail={{ src: IMG.breadCover, alt: 'Sliced loaf with open crumb', stacked: true }}
          mention="@beginner-bakers"
          engagement={{ likes: 1240, comments: 87, views: 9320 }}
        />
      </Frame>
    ),
  },
  'feed/with-flag': {
    states: false,
    render: () => (
      <Frame>
        <Feed
          flag="HOT"
          avatar={{ src: IMG.gameAvatar, alt: 'Indie Game Devs' }}
          channel="Indie Game Devs"
          timestamp="4h"
          followAction
          meta={['Solo dev', 'First release', '@sidequest']}
          title="Shipped my first game after 14 months — 87 wishlists, 3 sales, 1 angry email"
          body="Launched on Saturday with zero marketing budget. The angry email was about the controls, which is fair. Everything else exceeded my (very low) expectations and I'm already writing the patch notes. Honest postmortem inside if anyone is thinking about pulling the trigger."
          thumbnail={{ src: IMG.gameCover, alt: 'Pixel-art screenshot of the game', stacked: true }}
          mention="@gamedev-feedback"
          engagement={{ likes: 3210, comments: 412, views: 18740 }}
        />
      </Frame>
    ),
  },
  'feed/with-poll': {
    states: false,
    render: () => (
      <Frame>
        <Feed
          flag="NEW"
          avatar={{ src: IMG.plantAvatar, alt: 'Plant People' }}
          channel="Plant People"
          timestamp="14m"
          followAction
          meta={['Toronto', 'Two cats, no green thumb', '@leafluck']}
          title="Monstera is throwing aerial roots everywhere — repot, train, or leave it?"
          body="It's been in the same pot for two years and the roots are starting to crawl out the drainage holes. Light is fine, watering is fine, but I'm getting nervous about doing nothing. Voting before I pick up a new pot this weekend."
          thumbnail={{ src: IMG.plantCover, alt: 'Monstera with visible aerial roots' }}
          poll={{ label: 'Poll', participants: '1,284' }}
          mention="@plant-parents"
          engagement={{ likes: 642, comments: 213, views: 5104 }}
        />
      </Frame>
    ),
  },
  'feed/with-citation': {
    states: false,
    render: () => (
      <Frame>
        <Feed
          avatar={{ src: IMG.cinemaAvatar, alt: 'Movie Talk' }}
          channel="Movie Talk"
          timestamp="1d"
          meta={['Mumbai', 'Festival programmer', '@reelist']}
          title="A24's box office slump is a warning shot for mid-budget cinema"
          body="The piece argues the slump isn't about the films but about the windowing — streaming dates kept inching closer to release and the in-theatre incentive collapsed with it. Worth reading even if you disagree with the prescription at the end."
          citation={{
            title: 'A24 stumbles at the box office, and the indie-distribution model wobbles with it',
            source: 'The New York Times',
            hero: { src: IMG.cinemaHero, alt: 'Empty cinema seats' },
          }}
          engagement={{ likes: 312, comments: 41, views: 2870 }}
        />
      </Frame>
    ),
  },
  'feed/full': {
    states: false,
    render: () => (
      <Frame>
        <Feed
          flag="PINNED"
          avatar={{ src: IMG.modAvatar, alt: 'Community Mods' }}
          channel="Community Mods"
          timestamp="Now"
          followAction
          meta={['Mod team', 'Weekly digest', '@mods']}
          title="Weekly recap — top posts, new channels, and the AMA we just announced"
          body="Five posts crossed 1k upvotes this week, three new channels graduated out of beta, and we just locked in next Thursday's AMA with the co-founder of a tool half of you already use. Vote on the questions before Wednesday — the link's pinned in the citation card."
          thumbnail={{ src: IMG.modCover, alt: 'Banner: community weekly recap', stacked: true }}
          poll={{ label: 'Poll', participants: '3,210' }}
          citation={{
            title: 'AMA — Thursday 10am PT. Pre-submit your questions before the thread opens',
            source: 'Community Events',
            hero: { src: IMG.eventHero, alt: 'Calendar marking an event date' },
          }}
          mention="@all-members"
          engagement={{ likes: 4820, comments: 192, views: 27410 }}
        />
      </Frame>
    ),
  },

  /* Channel Rail — horizontal strip of channel entry points. Items are
     anchors that route to a channel page; the trailing action is a
     "View all" link to the full directory. */
  'channel-rail/default': {
    states: false,
    render: () => (
      <Frame>
        <ChannelRail
          aria-label="Subscribed channels"
          items={[
            { value: 'hyundai', label: 'Hyundai Motor', href: '#hyundai', thumbnail: { src: IMG.brandAuto,   alt: 'Hyundai',       updateDot: true } },
            { value: 'samsung', label: 'Samsung',       href: '#samsung', thumbnail: { src: IMG.brandPhone,  alt: 'Samsung',       updateDot: true } },
            { value: 'naver',   label: 'Naver',         href: '#naver',   thumbnail: { src: IMG.brandLaptop, alt: 'Naver' } },
            { value: 'mobis',   label: 'Hyundai Mobis', href: '#mobis',   thumbnail: { src: IMG.brandEngine, alt: 'Hyundai Mobis', updateDot: true } },
          ]}
          trailingAction={{ label: 'View all', href: '#all' }}
        />
      </Frame>
    ),
  },

  'channel-rail/overflow': {
    states: false,
    render: () => (
      <Frame>
        <ChannelRail
          aria-label="Subscribed channels"
          items={[
            { value: 'hyundai', label: 'Hyundai Motor',  href: '#hyundai', thumbnail: { src: IMG.brandAuto,      alt: 'Hyundai',       updateDot: true } },
            { value: 'samsung', label: 'Samsung',        href: '#samsung', thumbnail: { src: IMG.brandPhone,     alt: 'Samsung',       updateDot: true } },
            { value: 'naver',   label: 'Naver',          href: '#naver',   thumbnail: { src: IMG.brandLaptop,    alt: 'Naver' } },
            { value: 'mobis',   label: 'Hyundai Mobis',  href: '#mobis',   thumbnail: { src: IMG.brandEngine,    alt: 'Hyundai Mobis', updateDot: true } },
            { value: 'kakao',   label: 'Kakao',          href: '#kakao',   thumbnail: { src: IMG.brandChat,      alt: 'Kakao' } },
            { value: 'lg',      label: 'LG Electronics', href: '#lg',      thumbnail: { src: IMG.brandAppliance, alt: 'LG',            updateDot: true } },
            { value: 'sk',      label: 'SK Hynix',       href: '#sk',      thumbnail: { src: IMG.brandChip,      alt: 'SK Hynix' } },
            { value: 'kia',     label: 'Kia',            href: '#kia',     thumbnail: { src: IMG.brandSuv,       alt: 'Kia' } },
          ]}
          trailingAction={{ label: 'View all', href: '#all' }}
        />
      </Frame>
    ),
  },

  'bottom-sheet/default': {
    states: false,
    render: () => (
      <BottomSheet
        inline
        open
        onClose={() => {}}
        title="Channel settings"
        body="Manage how this channel shows up in your feed and who can reach you here."
        primaryAction={{ label: 'Done', onClick: () => {} }}
        secondaryAction={{ label: 'Cancel', onClick: () => {} }}
      >
        <List
          variant="nav"
          aria-label="Channel settings"
          style={{
            marginInline: 'calc(-1 * var(--sys-layout-container-md))',
            width: 'calc(100% + 2 * var(--sys-layout-container-md))',
            maxWidth: 'none',
          }}
          items={[
            { value: 'notifications', label: 'Notifications',  supportingText: 'On for all posts' },
            { value: 'mute',          label: 'Muted members',  supportingText: '0 muted' },
            { value: 'members',       label: 'Members',        supportingText: '1,243 joined' },
            { value: 'pinned',        label: 'Pinned posts',   supportingText: '5 pins' },
            { value: 'about',         label: 'About',          supportingText: 'Channel info and rules' },
          ]}
        />
      </BottomSheet>
    ),
  },

  'callout/info': {
    states: false,
    render: () => (
      <Frame>
        <Callout
          appearance="info"
          action={{ label: 'How levels work', href: '#level' }}
        >
          Stay active in the community to level up and unlock more of what the app offers.
        </Callout>
      </Frame>
    ),
  },

  'callout/with-icon': {
    states: false,
    render: () => (
      <Frame>
        <Callout
          appearance="info"
          icon={<img src={IMG.brandChip} alt="" />}
          action={{ label: 'How levels work', href: '#level' }}
        >
          Stay active in the community to level up and unlock more of what the app offers.
        </Callout>
      </Frame>
    ),
  },

  'callout/neutral': {
    states: false,
    render: () => (
      <Frame>
        <Callout
          appearance="neutral"
          action={{ label: 'How levels work', href: '#level' }}
        >
          Stay active in the community to level up and unlock more of what the app offers.
        </Callout>
      </Frame>
    ),
  },

  'bottom-sheet/overflow': {
    states: false,
    render: () => (
      <BottomSheet
        inline
        open
        onClose={() => {}}
        title="Channels you follow"
        body="Tap a channel to manage notifications, members, and pinned posts."
        primaryAction={{ label: 'Done', onClick: () => {} }}
        secondaryAction={{ label: 'Cancel', onClick: () => {} }}
        style={{ maxHeight: 520 }}
      >
        <List
          variant="nav"
          aria-label="Followed channels"
          style={{
            marginInline: 'calc(-1 * var(--sys-layout-container-md))',
            width: 'calc(100% + 2 * var(--sys-layout-container-md))',
            maxWidth: 'none',
          }}
          items={[
            { value: 'hyundai',  label: 'Hyundai Motor',     supportingText: '12,840 members · 3 new posts' },
            { value: 'samsung',  label: 'Samsung Electronics', supportingText: '24,102 members · 8 new posts' },
            { value: 'naver',    label: 'Naver',             supportingText: '9,531 members · Quiet today' },
            { value: 'mobis',    label: 'Hyundai Mobis',     supportingText: '4,217 members · 2 new posts' },
            { value: 'kakao',    label: 'Kakao',             supportingText: '18,664 members · 5 new posts' },
            { value: 'lg',       label: 'LG Electronics',    supportingText: '11,008 members · Quiet today' },
            { value: 'sk',       label: 'SK Hynix',          supportingText: '6,142 members · 1 new post' },
            { value: 'kia',      label: 'Kia',               supportingText: '7,889 members · 4 new posts' },
            { value: 'posco',    label: 'POSCO',             supportingText: '3,221 members · Quiet today' },
            { value: 'celltrion', label: 'Celltrion',        supportingText: '2,488 members · 1 new post' },
          ]}
        />
      </BottomSheet>
    ),
  },

  'dialog/default': {
    states: false,
    render: () => <DialogDefaultDemo />,
  },

  'dialog/with-image': {
    states: false,
    render: () => <DialogWithImageDemo />,
  },

  /* Channel List — swipeable pager of channel suggestions. Each page
     stacks three rows (avatar 48 + name / followers / description +
     Toggle Button); the next page peeks to invite the horizontal
     swipe. The demo seeds two rows as already-following so visitors
     can read both Follow / Following states inline. */
  'channel-list/default': {
    states: false,
    render: () => (
      <Frame>
        <ChannelListDemo />
      </Frame>
    ),
  },

  /* List — text variant (default). Plain rows; no selection model.
     Staged as a community member's "Account" menu — the rows are the
     surfaces every social product reaches for. */
  'list/text': {
    states: false,
    render: () => (
      <Frame>
        <List
          items={[
            { value: 'profile',     label: 'Profile',          supportingText: 'Display name, avatar, bio' },
            { value: 'channels',    label: 'My channels',      supportingText: '12 joined · 3 muted' },
            { value: 'saved',       label: 'Saved posts',      supportingText: '47 posts across 9 channels' },
            { value: 'drafts',      label: 'Drafts',           supportingText: '2 unposted replies' },
            { value: 'blocked',     label: 'Blocked members' },
            { value: 'account',     label: 'Account' },
          ]}
        />
      </Frame>
    ),
  },

  /* List — radio variant (controlled single-select). Stateful wrapper
     so the preview is interactive; the spec example uses the same
     useState shape. */
  'list/radio': {
    states: false,
    render: () => (
      <Frame>
        <RadioListDemo />
      </Frame>
    ),
  },

  /* List — focus indicator stage. A nav-variant list with one row
     pinned to its focused state via `forcedState: 'focused'`, so the
     inward 3-layer ring composition can be inspected statically. */
  'list/focus-indicator': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="nav"
          items={[
            { value: 'profile',  label: 'Profile',         supportingText: 'Display name, avatar, bio' },
            { value: 'channels', label: 'My channels',     supportingText: '12 joined · 3 muted',          forcedState: 'focused' },
            { value: 'notif',    label: 'Notifications' },
            { value: 'privacy',  label: 'Privacy' },
            { value: 'account',  label: 'Account' },
          ]}
        />
      </Frame>
    ),
  },

  /* List — nav variant. Same anatomy as text, but every row auto-
     renders a right-pointing chevron at the trailing edge so the list
     reads as a "drill-into-another-screen" surface. */
  'list/nav': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="nav"
          items={[
            { value: 'profile',  label: 'Profile',         supportingText: 'Display name, avatar, bio' },
            { value: 'channels', label: 'My channels',     supportingText: '12 joined · 3 muted' },
            { value: 'notif',    label: 'Notifications' },
            { value: 'privacy',  label: 'Privacy' },
            { value: 'account',  label: 'Account' },
          ]}
        />
      </Frame>
    ),
  },

  /* List — thumbnail variant. Each row anchored by a 40px Thumbnail.
     Staged as a "Channels you follow" surface inside the community app. */
  'list/thumbnail': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="thumbnail"
          items={[
            { value: 'sourdough', label: 'Sourdough Bakers', supportingText: '3 new posts today',  thumbnail: { src: IMG.breadAvatar,  alt: 'Sourdough Bakers' } },
            { value: 'indiedev',  label: 'Indie Game Devs',  supportingText: '12 new posts today', thumbnail: { src: IMG.gameAvatar,   alt: 'Indie Game Devs' } },
            { value: 'plants',    label: 'Plant People',     supportingText: 'No new posts',       thumbnail: { src: IMG.plantAvatar,  alt: 'Plant People' } },
          ]}
        />
      </Frame>
    ),
  },

  /* Badge — numeric count pill attached to a host label. Presentational,
     so the state dropdown is opted out via `states: false`; the size axis
     is surfaced via the standard Size dropdown (medium → small, project
     largest-first convention). */
  'badge/default': {
    states: false,
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium' }) => <Badge size={size}>3</Badge>,
  },
  'badge/digit-cases': {
    states: false,
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium' }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-lg)' }}>
        <Badge size={size} count={3} />
        <Badge size={size} count={27} />
        <Badge size={size} count={142} />
      </div>
    ),
  },
  'badge/with-host': {
    states: false,
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium' }) => {
      const labelWithBadge = (text, count) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sys-layout-inline-md)', minWidth: 0 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
          <Badge size={size} count={count} />
        </span>
      );
      return (
        <Frame>
          <List
            variant="thumbnail"
            items={[
              { value: 'amazon',  label: labelWithBadge('Amazon',  142), supportingText: 'Private · My company', thumbnail: { src: IMG.brandLaptop, alt: 'Amazon' } },
              { value: 'samsung', label: labelWithBadge('Samsung',  27), supportingText: 'Private · My company', thumbnail: { src: IMG.brandPhone,  alt: 'Samsung' } },
              { value: 'naver',   label: labelWithBadge('Naver',     3), supportingText: 'Public · Tech',        thumbnail: { src: IMG.brandChip,   alt: 'Naver' } },
            ]}
          />
        </Frame>
      );
    },
  },

  /* Navigation Bar → Home — landing-screen top bar. Left-aligned 24/Semibold
     title; conventional leading menu icon + up to three trailing action
     icons. Min-height 56 with 16/16 padding. */
  'navigation-bar/home/default': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="home"
          title={
            <img
              src="/logotype.svg"
              alt="Chorus"
              className="chorus-brand-logotype"
              style={{ height: 24, width: 'auto', display: 'block' }}
            />
          }
          trailingActions={[
            { icon: <SearchIcon />,  'aria-label': 'Search' },
            { icon: <ChatIcon />,    'aria-label': 'Messages' },
            { icon: <ProfileIcon />, 'aria-label': 'Profile' },
          ]}
        />
      </Frame>
    ),
  },
  'navigation-bar/home/default--text-title': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="home"
          title="Home"
          trailingActions={[
            { icon: <SearchIcon />,  'aria-label': 'Search' },
            { icon: <ChatIcon />,    'aria-label': 'Messages' },
            { icon: <ProfileIcon />, 'aria-label': 'Profile' },
          ]}
        />
      </Frame>
    ),
  },
  'navigation-bar/home/single-action': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="home"
          title="Inbox"
          trailingActions={[{ icon: <SearchIcon />, 'aria-label': 'Search' }]}
        />
      </Frame>
    ),
  },
  'navigation-bar/home/truncation': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="home"
          title="A very long screen title that should truncate"
          trailingActions={[
            { icon: <SearchIcon />,  'aria-label': 'Search' },
            { icon: <ChatIcon />,    'aria-label': 'Messages' },
            { icon: <ProfileIcon />, 'aria-label': 'Profile' },
          ]}
        />
      </Frame>
    ),
  },

  /* Navigation Bar → Page — drill-in top bar. Centred 16/Semibold title in a
     three-column grid (leading / title / trailing); the title stays
     geometrically centred against the row regardless of side-slot width. */
  'navigation-bar/page/default': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="page"
          title="Edit profile"
          leading={{ icon: <SpecIcon name="back" />, 'aria-label': 'Back' }}
          trailing={<Button variant="toolbar" appearance="primary">Save</Button>}
        />
      </Frame>
    ),
  },
  'navigation-bar/page/external-page': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="page"
          title="Help center"
          trailing={{ icon: <CloseIcon />, 'aria-label': 'Close' }}
        />
      </Frame>
    ),
  },
  'navigation-bar/page/icon-trailing': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="page"
          title="Thread"
          leading={{ icon: <SpecIcon name="back" />, 'aria-label': 'Back' }}
          trailing={{ icon: <MoreIcon />, 'aria-label': 'More' }}
        />
      </Frame>
    ),
  },
  'navigation-bar/page/link-trailing': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="page"
          title="Pick your interests"
          leading={{ icon: <SpecIcon name="back" />, 'aria-label': 'Back' }}
          trailing={{ label: 'Skip', href: '#skip' }}
        />
      </Frame>
    ),
  },
  'navigation-bar/page/title-only': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar variant="page" title="Terms of service" />
      </Frame>
    ),
  },

  /* Navigation Bar → Search — search-page top bar. Three-column grid
     (leading / bare input / conditional clear) over the same 56 / 8-8
     geometry as Home and Page. Clear (×) reveals only when the value is
     non-empty; the input column reflows to fill the freed space without
     moving its leading edge. autoFocus is suppressed inside the docs
     preview so the page doesn't yank focus on render. */
  'navigation-bar/search/default': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar variant="search" placeholder="Search by keyword" autoFocus={false} onBack={() => {}} />
      </Frame>
    ),
  },

  /* Tab Bar — bottom primary navigation. Each item stacks a 24-glyph
     over a 10-rank label; the active item swaps to the filled companion
     glyph and the `onSurface` colour. Items are distributed with
     `space-evenly` so start padding, inter-item gap, and end padding
     are all the same visible whitespace. */
  'tab-bar/default': {
    states: false,
    render: () => (
      <Frame>
        <TabBar
          aria-label="Primary"
          value="home"
          items={[
            { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
            { value: 'company',       label: 'Company',       icon: <CompanyIcon />,      activeIcon: <CompanyFillIcon /> },
            { value: 'explore',       label: 'Explore',       icon: <SearchIcon /> },
            { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
            { value: 'notifications', label: 'Notifications', icon: <NotificationIcon />, activeIcon: <NotificationFillIcon /> },
          ]}
        />
      </Frame>
    ),
  },
  'tab-bar/with-primary': {
    states: false,
    render: () => (
      <Frame>
        <TabBar
          aria-label="Primary"
          value="home"
          items={[
            { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
            { value: 'company',       label: 'Company',       icon: <CompanyIcon /> },
            { value: 'explore',       label: 'Explore',       icon: <SearchIcon /> },
            { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon /> },
            { value: 'notifications', label: 'Notifications', icon: <NotificationIcon /> },
            { value: 'create',        label: 'Create',        icon: <AddSquareFillIcon />, appearance: 'primary' },
          ]}
        />
      </Frame>
    ),
  },
  'tab-bar/three-destinations': {
    states: false,
    render: () => (
      <Frame>
        <TabBar
          aria-label="Primary"
          value="explore"
          items={[
            { value: 'home',    label: 'Home',    icon: <HomeIcon />,    activeIcon: <HomeFillIcon /> },
            { value: 'explore', label: 'Explore', icon: <SearchIcon /> },
            { value: 'profile', label: 'Profile', icon: <ProfileIcon />, activeIcon: <ProfileFillIcon /> },
          ]}
        />
      </Frame>
    ),
  },
  'tab-bar/truncation': {
    states: false,
    render: () => (
      <Frame>
        <TabBar
          aria-label="Primary"
          value="messages"
          items={[
            { value: 'home',          label: 'Home',                  icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
            { value: 'company',       label: 'My organization',       icon: <CompanyIcon />,      activeIcon: <CompanyFillIcon /> },
            { value: 'explore',       label: 'Explore communities',   icon: <SearchIcon /> },
            { value: 'messages',      label: 'Direct messages',       icon: <ChatIcon /> },
            { value: 'notifications', label: 'All notifications',     icon: <NotificationIcon />, activeIcon: <NotificationFillIcon /> },
          ]}
        />
      </Frame>
    ),
  },
  'tab-bar/focused': {
    states: false,
    render: () => (
      <Frame>
        <TabBar
          aria-label="Primary"
          value="home"
          items={[
            { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
            { value: 'company',       label: 'Company',       icon: <CompanyIcon />,      activeIcon: <CompanyFillIcon /> },
            { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,                                              forcedState: 'focused' },
            { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
            { value: 'notifications', label: 'Notifications', icon: <NotificationIcon />, activeIcon: <NotificationFillIcon /> },
          ]}
        />
      </Frame>
    ),
  },

  'tabs/segmented/overflow': {
    render: ({ state }) => (
      <Frame>
        <TabsDemo
          variant="segmented"
          initialValue="day"
          state={state}
          items={[
            { value: 'day',     label: 'Day' },
            { value: 'week',    label: 'Week' },
            { value: 'month',   label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
            { value: 'year',    label: 'Year' },
            { value: 'decade',  label: 'Decade' },
            { value: 'century', label: 'Century' },
          ]}
        />
      </Frame>
    ),
  },
};
