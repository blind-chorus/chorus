import { useState } from 'react';
import { asset } from '../../lib/asset';
import { Accordion, Badge, BottomSheet, Button, Banner, Metadata, SuggestionList, DirectoryList, NavList, AvatarRail, Carousel, Chip, Dialog, Tabs, Tab, Feed, FeedAd, FeedGroup, FormField, FormFieldGroup, Header, List, NavCard, NavCardGroup, NavigationBar, PostCarousel, Progress, ProfileCarousel, ProfileHeader, SideSheet, SideSheetGroup, Skeleton, SkeletonGroup, StatusTag, Switch, TabBar, Thumbnail, Toast, Tooltip } from '@blind-dsai/ui';
import { PlusIcon, PlusSquareFillIcon, ChevronLeftIcon, BookmarkIcon, BookmarkFillIcon, BriefcaseIcon, BriefcaseFillIcon, ChatIcon, ChatFillIcon, CheckedIcon, XIcon, BuildingIcon, BuildingFillIcon, ArrowDownIcon, ChevronRightIcon, HeartIcon, HomeIcon, HomeFillIcon, LocationIcon, MentionIcon, EllipsisHorizontalIcon, BellIcon, BellFillIcon, ProfileIcon, ProfileFillIcon, PulseIcon, SearchIcon, SearchFillIcon, StarIcon, StarFillIcon, TagIcon } from '@blind-dsai/ui/icons';

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
  bread: asset('/placeholder.png'),
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
  // AvatarRail brand-channel avatars. Real brand logos are off-limits
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
  // Person portraits — neutral headshots for member-directory / author
  // avatars where the channel topic doesn't supply the image (e.g. an
  // anonymous engineer's offer-eval post, a member row in a directory).
  personJordan: UNSPLASH('photo-1500648767791-00dcc994a43e', 160),    // man with glasses
  personTaylor: UNSPLASH('photo-1494790108377-be9c29b29330', 160),    // woman portrait
  personMorgan: UNSPLASH('photo-1438761681033-6461ffad8d80', 160),    // woman portrait, smile
  personRiley:  UNSPLASH('photo-1544005313-94ddf0286df2', 160),       // woman, plain bg
  personSam:    UNSPLASH('photo-1547425260-76bcadfb4f2c', 160),       // person, profile shot
  // Document / workspace motifs — covers for posts about offers, docs,
  // changelogs, and engineering ops where a person-portrait would feel
  // off but a plain-object photo carries the subject.
  offerDoc: UNSPLASH('photo-1554224155-6726b3ff858f', 320),           // paper documents
  workspaceDesk: UNSPLASH('photo-1499951360447-b19be8fe80f5', 320),   // laptop on desk
  // Topic motifs — channel avatars where the topic doesn't map to a
  // person but has a recognizable subject (stocks chart, ticket queue).
  stocksChart: UNSPLASH('photo-1611974789855-9c2a0a7236a3', 160),     // candlestick chart
  productLog: UNSPLASH('photo-1551434678-e076c223a692', 160),         // sticky-note kanban
  // Cover bands — wide (≈3:1) hero photos for ProfileHeader cover slot
  // and ProfileCarousel card cover. Each one paints the channel topic
  // edge-to-edge so the avatar overlapping the cover bottom reads as a
  // recognizable identity block, not a placeholder.
  topicCover:   UNSPLASH('photo-1497436072909-60f360e1d4b1', [640, 200]), // forest skyline (general)
  plantsCover:  UNSPLASH('photo-1463320726281-696a485928c7', [640, 200]), // greenhouse / leaves
  compensationCover: UNSPLASH('photo-1554224155-6726b3ff858f', [640, 200]), // documents
  companyCover: UNSPLASH('photo-1486406146926-c627a92ad1ab', [640, 200]), // skyscraper grid (companies)
  startupCover: UNSPLASH('photo-1517245386807-bb43f82c33c4', [640, 200]), // workspace
  fintechCover: UNSPLASH('photo-1611974789855-9c2a0a7236a3', [640, 200]), // chart
};

/* App-width-filling components (NavigationBar, Feed, SuggestionList, Channel
   Rail, Dialog inline, BottomSheet inline, FormField, …) cap at 400px so
   the preview stage reads as a mobile-app viewport regardless of the
   browser's actual width. Compact specimens (Button, Chip, Badge) skip
   the wrapper and sit on the stage naturally. See the "Preview width
   rule" entry in the project's collaboration notes. */
const Frame = ({ children }) => (
  <div style={{ width: '100%', maxWidth: 400 }}>{children}</div>
);

/* iOS-style virtual-keyboard mock for the BottomSheet → Keyboard preview.
   Static, decorative — purely a visual stand-in for the OS keyboard so the
   `--bottom-sheet-keyboard-inset` contract reads correctly in docs.
   Scoped to 480px max-width centered to match the sheet card's footprint
   (mobile-baseline: viewport width = sheet width = keyboard width — the
   keyboard never escapes the sheet column). Colors come from CSS custom
   properties defined on `.ios-keyboard-mock` in globals.css; the
   [data-theme="dark"] selector there flips the palette automatically. */
const IOSKeyboard = () => {
  const ROW_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const ROW_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const ROW_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  const keyStyle = {
    flex: '1 1 0',
    background: 'var(--ios-kbd-key)',
    color: 'var(--ios-kbd-ink)',
    borderRadius: 5,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    fontSize: 17,
    fontWeight: 400,
    boxShadow: 'var(--ios-kbd-shadow)',
    userSelect: 'none',
  };
  const modStyle = { ...keyStyle, background: 'var(--ios-kbd-mod)', fontSize: 14 };
  return (
    <div
      aria-hidden="true"
      className="ios-keyboard-mock"
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 0,
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        height: 280,
        boxSizing: 'border-box',
        padding: '8px 4px 12px',
        background: 'var(--ios-kbd-bg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 5, padding: '0 2px' }}>
        {ROW_1.map((k) => <span key={k} style={keyStyle}>{k}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 5, padding: '0 18px' }}>
        {ROW_2.map((k) => <span key={k} style={keyStyle}>{k}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 5, padding: '0 2px' }}>
        <span style={{ ...modStyle, flex: '1.4 1 0' }}>⇧</span>
        {ROW_3.map((k) => <span key={k} style={keyStyle}>{k}</span>)}
        <span style={{ ...modStyle, flex: '1.4 1 0' }}>⌫</span>
      </div>
      <div style={{ display: 'flex', gap: 5, padding: '0 2px' }}>
        <span style={{ ...modStyle, flex: '1.4 1 0' }}>123</span>
        <span style={{ ...keyStyle, flex: '4.5 1 0' }}>space</span>
        <span style={{ ...modStyle, flex: '1.4 1 0' }}>return</span>
      </div>
    </div>
  );
};

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
   itself — same pattern as Feed, SuggestionList, every other block
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
function SuggestionListDemo() {
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
    <SuggestionList
      label="Recommended channels"
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

/* Bottom Sheet — nested-step demo. The consumer owns step state; the
   sheet only paints the back chevron when `onBack` is wired. */
function BottomSheetNestedStepDemo() {
  const [step, setStep] = useState('rsus');
  const [value, setValue] = useState('rsus');
  const [amount, setAmount] = useState('');
  return (
    <BottomSheet
      inline
      open
      onClose={() => {}}
      title={step === 'root' ? 'Yearly Equity Value' : 'RSUs'}
      onBack={step === 'rsus' ? () => setStep('root') : undefined}
      primaryAction={{ label: 'Save', onClick: () => {} }}
    >
      {step === 'root' ? (
        <List
          variant="radio"
          value={value}
          onChange={(next) => { setValue(next); if (next === 'rsus') setStep('rsus'); }}
          aria-label="Equity type"
          /* Negate the sheet content slot's inline padding so the List
             stretches edge-to-edge and its OWN container padding becomes
             the visual leading edge — the row content (radio + label)
             lands flush with the title above. Same pattern as
             bottom-sheet/overflow. */
          style={{
            marginInline: 'calc(-1 * var(--sys-layout-container-md))',
            width: 'calc(100% + 2 * var(--sys-layout-container-md))',
            maxWidth: 'none',
          }}
          items={[
            { value: 'rsus', label: 'RSUs' },
            { value: 'none', label: 'None' },
          ]}
        />
      ) : (
        <FormField
          variant="input"
          leadingIcon="$"
          placeholder="Ex: 100,000"
          value={amount}
          onChange={setAmount}
        />
      )}
    </BottomSheet>
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
  /* Standard Button — headline appearance previews. */
  'button/standard/default':   buttonPreview('primary',   'Primary action'),
  'button/standard/secondary': buttonPreview('secondary', 'Secondary action'),
  'button/standard/outlined':  buttonPreview('outlined',  'See more'),
  'button/standard/tertiary':  buttonPreview('tertiary',  'Tertiary action'),

  /* Focused — the accessibility focus ring (2px `sys.color.focus` stroke
     outside a 1px `sys.color.focusInset` counter-ring). Its own case
     because the preview has no State control; hover / press are felt on
     the live specimens above, focus gets shown here statically. */
  'button/standard/focused': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large' }) => (
      <Button appearance="primary" size={size} state="focused">
        Primary action
      </Button>
    ),
  },

  /* Group — horizontal pairing: outlined (left, supplementary) +
     primary (right, commit) at a fixed 8px gap (`sys.layout.inline.md`). */
  'button/standard/group': {
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
  'button/standard/group-vertical': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--sys-layout-stack-xs)', width: 328 }}>
        <Button appearance="primary"   size={size} state={state} fullWidth>Save</Button>
        <Button appearance="secondary" size={size} state={state} fullWidth>Cancel</Button>
      </div>
    ),
  },

  /* Full width — single button stretched to the surrounding column. */
  'button/standard/full-width': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <Button appearance="primary" size={size} state={state} fullWidth>
        Confirm
      </Button>
    ),
  },

  /* With leading icon — Standard Button carries a leading icon only. */
  'button/standard/with-leading-icon': {
    sizes: BUTTON_SIZES,
    render: ({ size = 'large', state }) => (
      <Button appearance="primary" size={size} state={state} leadingIcon={<PlusIcon />}>
        Add item
      </Button>
    ),
  },

  /* Truncation — long label inside a width-constrained frame. */
  'button/standard/truncation': {
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
      <Button variant="fab" appearance="primary" state={state} icon={<PlusIcon />}>
        Compose
      </Button>
    ),
  },
  'button/fab/secondary': {
    states: FAB_STATES,
    render: ({ state }) => (
      <Button variant="fab" appearance="secondary" state={state} icon={<PlusIcon />}>
        Compose
      </Button>
    ),
  },
  'button/fab/icon': {
    states: FAB_STATES,
    render: ({ state }) => (
      <Button variant="fab" appearance="primary" state={state} icon={<PlusIcon />} aria-label="Add" />
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
      <Button variant="fab" appearance="primary" state={state} icon={<PlusIcon />}>Add item</Button>
    ),
  },

  /* Button → Toolbar Button — dense inline action. Three appearances
     (default / accent / inverse); reuses the Filter chip's chrome. */
  'button/toolbar/default': {
    supportsDisabled: true,
    render: ({ state, disabled }) => (
      <Button variant="toolbar" state={disabled ? 'disabled' : state}>Edit</Button>
    ),
  },
  'button/toolbar/leading-icon': {
    render: ({ state }) => (
      <Button variant="toolbar" state={state} leadingIcon={<PlusIcon />}>
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
  'button/toolbar/accent': {
    supportsDisabled: true,
    render: ({ state, disabled }) => (
      <Button variant="toolbar" appearance="accent" state={disabled ? 'disabled' : state}>Save</Button>
    ),
  },
  'button/toolbar/inverse': {
    supportsDisabled: true,
    render: ({ state, disabled }) => (
      <Button variant="toolbar" appearance="inverse" state={disabled ? 'disabled' : state}>Open</Button>
    ),
  },
  'button/toolbar/icon-only': {
    render: ({ state }) => (
      <Button variant="toolbar" state={state} leadingIcon={<PlusIcon />} aria-label="Add" />
    ),
  },
  'button/toolbar/group': {
    render: ({ state }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sys-layout-inline-sm)', flexWrap: 'wrap' }}>
        <Button variant="toolbar" state={state} leadingIcon={<PlusIcon />}>Add</Button>
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
  'button/icon/inverse': {
    sizes: ['large', 'medium'],
    render: ({ size = 'medium', state }) => (
      <Button variant="icon" size={size} appearance="inverse" icon={<XIcon />} aria-label="Dismiss" state={state} />
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
  'button/icon/custom-color': {
    states: false,
    render: () => (
      <div style={{ display: 'inline-flex', gap: 'var(--sys-layout-inline-xl)' }}>
        <Button variant="icon" icon={<StarIcon />} aria-label="Favorite — inactive" style={{ color: 'var(--sys-color-onSurfaceVariant)' }} />
        <Button variant="icon" icon={<StarIcon />} aria-label="Favorite — active"   style={{ color: 'var(--ref-palette-yellow-500)' }} />
      </div>
    ),
  },

  /* Button → Text Button — link-shaped commit. Label-coloured Semibold
     text at rest (no fill, no border), state-overlay background on hover /
     pressed, standard focus ring on focus. Three sizes (medium / small /
     xsmall) for the row's density and three appearances (default / accent
     / inverse) for emphasis and host surface. */
  'button/text/default': {
    sizes: ['medium', 'small', 'xsmall'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="text" size={size} state={disabled ? 'disabled' : state}>Not now</Button>
    ),
  },
  'button/text/accent': {
    sizes: ['medium', 'small', 'xsmall'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="text" size={size} appearance="accent" state={disabled ? 'disabled' : state}>Skip</Button>
    ),
  },
  'button/text/inverse': {
    sizes: ['medium', 'small', 'xsmall'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="text" size={size} appearance="inverse" state={disabled ? 'disabled' : state}>Undo</Button>
    ),
  },
  'button/text/on-primary': {
    sizes: ['medium', 'small', 'xsmall'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="text" size={size} appearance="onPrimary" state={disabled ? 'disabled' : state}>Got it</Button>
    ),
  },
  'button/text/leading-icon': {
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium', state }) => (
      <Button variant="text" size={size} state={state} leadingIcon={<ChevronLeftIcon />}>Back</Button>
    ),
  },
  'button/text/trailing-icon': {
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium', state }) => (
      <Button variant="text" size={size} state={state} trailingIcon={<ChevronRightIcon />}>Continue</Button>
    ),
  },
  'button/text/group': {
    sizes: ['medium', 'small', 'xsmall'],
    render: ({ size = 'medium', state }) => {
      const gap = size === 'xsmall' ? 'var(--sys-layout-inline-lg)' : 'var(--sys-layout-inline-xl)';
      return (
        <div style={{ display: 'inline-flex', gap }}>
          <Button variant="text" size={size} state={state}>Cancel</Button>
          <Button variant="text" size={size} appearance="accent" state={state}>Save</Button>
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

  /* Button → Check Button — Text Button shape with a required leading
     24px checkbox glyph and an optional 16px middle icon. The component
     renders the checkbox itself; consumers wire `onClick` to flip the
     `checked` prop. Static previews fix `checked` per case so the doc
     reader can see both states side-by-side. */
  'button/check/default': {
    sizes: ['medium', 'small'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="check" size={size} state={disabled ? 'disabled' : state}>
        Invisible to Coworkers
      </Button>
    ),
  },
  'button/check/checked': {
    sizes: ['medium', 'small'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="check" size={size} checked state={disabled ? 'disabled' : state}>
        Invisible to Coworkers
      </Button>
    ),
  },
  'button/check/icon': {
    sizes: ['medium', 'small'],
    render: ({ size = 'medium', state }) => (
      <Button variant="check" size={size} checked icon={<BookmarkFillIcon />} state={state}>
        Use 1 promotion link
      </Button>
    ),
  },
  'button/check/accent': {
    sizes: ['medium', 'small'],
    render: ({ size = 'medium', state }) => (
      <Button variant="check" size={size} appearance="accent" checked state={state}>
        Apply offer
      </Button>
    ),
  },
  'button/check/inverse': {
    sizes: ['medium', 'small'],
    supportsDisabled: true,
    render: ({ size = 'medium', state, disabled }) => (
      <Button variant="check" size={size} appearance="inverse" checked state={disabled ? 'disabled' : state}>
        Keep me signed in
      </Button>
    ),
  },
  'button/check/focused': {
    sizes: ['medium', 'small'],
    render: ({ size = 'medium' }) => (
      <Button variant="check" size={size} state="focused">Invisible to Coworkers</Button>
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
      <Chip variant="filter" state={state} trailingIcon={<XIcon />}>
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

  /* Filter chip group with a trailing accent Text Button. The trailing
     button is NOT another filter — it routes to a unique page or
     commits a unique action (managing the whole filter set, opening a
     keyword editor) that sits outside the filter axis. Composition
     mirrors Channel Rail with-overflow: `small` accent Text Button,
     `sys.layout.inline.xl` gap between the track and the button, the
     track scrolls horizontally with a trailing-edge mask fade over
     the rightmost 48px (ref.space.600). */
  'chip/filter/with-trailing-action': {
    states: false,
    render: () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sys-layout-inline-xl)',
          width: '100%',
          maxWidth: 400,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sys-layout-inline-sm)',
            flex: '1 1 auto',
            minWidth: 0,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitMaskImage:
              'linear-gradient(to right, black 0, black calc(100% - 48px), transparent 100%)',
            maskImage:
              'linear-gradient(to right, black 0, black calc(100% - 48px), transparent 100%)',
          }}
        >
          <Chip variant="filter" selected trailingIcon={<ArrowDownIcon />}>All keywords</Chip>
          <Chip variant="filter" selected trailingIcon={<ArrowDownIcon />}>All channels</Chip>
          <Chip variant="filter">Label</Chip>
          <Chip variant="filter">Saved</Chip>
        </div>
        <Button variant="text" size="small" appearance="accent" style={{ flex: '0 0 auto' }}>
          Manage
        </Button>
      </div>
    ),
  },

  /* Chip → Tag — square-cornered, filled metadata label. */
  'chip/tag/default': {
    render: ({ state }) => (
      <Chip variant="tag" state={state}>Design</Chip>
    ),
  },
  'chip/tag/accent': {
    render: ({ state }) => (
      <Chip variant="tag" appearance="accent" state={state}>#sellside</Chip>
    ),
  },
  'chip/tag/dismissable': {
    render: ({ state }) => (
      <Chip variant="tag" state={state} trailingIcon={<XIcon />}>Newsletter</Chip>
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
        <FormField
          variant="input"
          appearance="error"
          label="Label text"
          placeholder="Place holder"
          helper="Assistive text"
          disabled={disabled}
        />
      </Frame>
    ),
  },
  'form-field/input/error-no-helper': {
    supportsDisabled: true,
    render: ({ disabled }) => (
      <Frame>
        <FormField
          variant="input"
          appearance="error"
          label="Label text"
          placeholder="Place holder"
          disabled={disabled}
        />
      </Frame>
    ),
  },
  'form-field/input/focused': () => (
    <Frame>
      <FormField variant="input" placeholder="Place holder" state="focused" />
    </Frame>
  ),

  /* Input + leading icon — 16px (`sys.icon.md`) decorative glyph at the
     inner-left edge, inheriting `onSurfaceVariant` colour. Same field
     box as the bare Input; the leading slot is also available on the
     `select` sub-component. */
  'form-field/input/with-leading-icon': () => (
    <Frame>
      <FormField
        variant="input"
        label="Location"
        leadingIcon={<LocationIcon />}
        placeholder="City, region"
        helper="Used to suggest local channels"
      />
    </Frame>
  ),

  /* Select — Input-shaped picker. Read-only; clicking the box (or the
     trailing chevron) opens a BottomSheet with options. The docs render
     the field at rest only — the `BottomSheet` + option-list wiring is
     documented in select.md as a behavior contract (the consumer owns
     the sheet state) but not exercised here. `onOpen` is a no-op so the
     click affordance doesn't throw. */
  'form-field/select/default': () => (
    <Frame>
      <FormField variant="select" label="Team" placeholder="Select a team" onOpen={() => {}} />
    </Frame>
  ),
  'form-field/select/with-leading-icon': () => (
    <Frame>
      <FormField
        variant="select"
        label="Location"
        leadingIcon={<LocationIcon />}
        placeholder="Choose a city"
        onOpen={() => {}}
      />
    </Frame>
  ),
  'form-field/select/focused': () => (
    <Frame>
      <FormField variant="select" placeholder="Select an option" state="focused" onOpen={() => {}} />
    </Frame>
  ),

  /* Form field → Select → Group — horizontal pairing. One shared label /
     helper; left field is a `select` (country dial-code style), right
     field is the actual input. Both boxes sit on one row at
     `sys.layout.inline.md` gap. */
  'form-field/select/group': () => (
    <Frame>
      <FormFieldGroup
        direction="horizontal"
        label="Phone number"
        helper="We'll text a one-time code"
      >
        <FormField variant="select" value="+82" onOpen={() => {}} style={{ flex: '0 0 96px' }} />
        <FormField variant="input" placeholder="010-0000-0000" />
      </FormFieldGroup>
    </Frame>
  ),

  /* Form field → Input → Group — vertical stack. Each rung keeps its own
     label / helper; the stack inserts 16px (`sys.layout.stack.md`)
     between them. */
  'form-field/input/group': () => (
    <Frame>
      <FormFieldGroup direction="vertical">
        <FormField variant="input" label="Name" placeholder="Your name" />
        <FormField
          variant="input"
          label="Email"
          placeholder="you@example.com"
          helper="We'll send a confirmation"
        />
        <FormField variant="input" label="Bio" placeholder="One sentence about you" />
      </FormFieldGroup>
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
            { value: 'posts',   label: 'Posts',   icon: <PlusIcon /> },
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
            { value: 'latest',    label: 'Latest',    icon: <PulseIcon /> },
            { value: 'popular',   label: 'Popular',   icon: <StarIcon /> },
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
          initialValue="latest"
          state={state}
          items={[
            { value: 'latest',    label: 'Latest',    icon: <PulseIcon /> },
            { value: 'popular',   label: 'Popular',   icon: <StarIcon /> },
            { value: 'favorites', label: 'Favorites', icon: <HeartIcon /> },
            { value: 'saved',     label: 'Saved',     icon: <BookmarkIcon /> },
            { value: 'topics',    label: 'Topics',    icon: <TagIcon /> },
            { value: 'people',    label: 'People',    icon: <ProfileIcon /> },
            { value: 'mentions',  label: 'Mentions',  icon: <MentionIcon /> },
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
            { value: 'grid', label: 'Grid', icon: <PlusIcon /> },
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
    <Button variant="fab" appearance="primary" state="focused" icon={<PlusIcon />}>
      Compose
    </Button>
  ),
  'button/toolbar/focused': () => (
    <Button variant="toolbar" state="focused" leadingIcon={<PlusIcon />}>
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
    <Chip variant="tag" state="focused" trailingIcon={<XIcon />}>Newsletter</Chip>
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
    render: () => <Thumbnail size={48} src={asset("/placeholder.png")} alt="Channel" />,
  },
  'thumbnail/with-update-dot': {
    states: false,
    render: () => <Thumbnail size={48} src={asset("/placeholder.png")} alt="Channel" updateDot />,
  },
  'thumbnail/with-logo-badge': {
    states: false,
    render: () => (
      <Thumbnail
        size={48}
        src={asset("/placeholder.png")}
        alt="Channel"
        logoBadge={{ src: asset('/blind_logo_red.png'), alt: 'Workspace' }}
      />
    ),
  },
  'thumbnail/with-both': {
    states: false,
    render: () => (
      <Thumbnail
        size={48}
        src={asset("/placeholder.png")}
        alt="Channel"
        updateDot
        logoBadge={{ src: asset('/blind_logo_red.png'), alt: 'Workspace' }}
      />
    ),
  },
  /* With surface outline — 2-token (`borderWidth.thin`) `surface`-color
     halo painted as an outset `box-shadow` on the container. Staged on
     a `surfaceContainerHighest` strip so the halo is visible against a
     non-surface backdrop (mirrors the cover-image scenario from
     ProfileHeader, the canonical host of this case). */
  'thumbnail/with-outline': {
    states: false,
    render: () => (
      <div
        style={{
          background: 'var(--sys-color-surfaceContainerHighest)',
          padding: 'var(--sys-layout-container-md)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--sys-radius-md)',
        }}
      >
        <Thumbnail size={56} src={asset("/placeholder.png")} alt="Channel" outlined />
      </div>
    ),
  },
  'thumbnail/size-ladder': {
    states: false,
    render: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-xl)' }}>
        <Thumbnail size={56} src={asset("/placeholder.png")} alt="Channel A" updateDot />
        <Thumbnail size={48} src={asset("/placeholder.png")} alt="Channel B" updateDot />
        <Thumbnail size={40} src={asset("/placeholder.png")} alt="Channel C" updateDot />
        <Thumbnail size={32} src={asset("/placeholder.png")} alt="Channel D" updateDot />
        <Thumbnail size={24} src={asset("/placeholder.png")} alt="Channel E" updateDot />
        <Thumbnail size={20} src={asset("/placeholder.png")} alt="Channel F" updateDot />
        <Thumbnail size={16} src={asset("/placeholder.png")} alt="Channel G" updateDot />
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

  /* Metadata — standalone family (renamed from Byline; previously the
     Row family's `metadata` sub). Author / brand attribution cluster
     shared by Feed Post + Feed Ad. Three demonstrations: default Post
     shape (avatar + name + timestamp + meta link row), with follow
     toggle, and Sponsored (Ad subtitle + dismiss trailing). */
  'metadata/metadata-default': {
    states: false,
    render: () => (
      <Frame>
        <Metadata
          avatar={{ src: IMG.breadAvatar, alt: 'Sourdough Bakers' }}
          name="Sourdough Bakers"
          nameHref="#"
          timestamp="2h"
          meta={['Brooklyn, NY', 'Home baker', '@crustcrumb']}
        />
      </Frame>
    ),
  },
  'metadata/metadata-with-follow': {
    states: false,
    render: () => (
      <Frame>
        <Metadata
          avatar={{ src: IMG.gameAvatar, alt: 'Indie Game Devs' }}
          name="Indie Game Devs"
          nameHref="#"
          timestamp="4h"
          followAction
          meta={['Solo dev', 'First release', '@sidequest']}
        />
      </Frame>
    ),
  },
  'metadata/metadata-sponsored': {
    states: false,
    render: () => (
      <Frame>
        <Metadata
          avatar={{ src: IMG.modAvatar, alt: 'Acme Coffee' }}
          name="Acme Coffee"
          subtitle="Sponsored"
          trailing={
            <button type="button" aria-label="Dismiss ad" style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: 'var(--sys-color-onSurfaceVariant)' }}>
              <XIcon size={16} />
            </button>
          }
        />
      </Frame>
    ),
  },
  'feed/post-default': {
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
  'feed/post-with-flag': {
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
  'feed/post-with-poll': {
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
  'feed/post-with-offer': {
    states: false,
    render: () => (
      <Frame>
        <Feed
          flag="HOT"
          avatar={{ src: IMG.personSam, alt: 'Anonymous' }}
          channel="Software Engineer"
          timestamp="2h"
          followAction
          meta={['Seattle, WA', 'L5 → L6', '@offer-check']}
          title="Got a competing offer at $245k base — should I take it or stay for the next promo cycle?"
          body="Current TC sits around $278k including RSUs vesting through 2027; the new offer is $245k base + $40k sign-on + $180k RSUs over 4 years. Stay path has a strong promo signal but no guarantees. Sanity-check me."
          thumbnail={{ src: IMG.offerDoc, alt: 'Offer letter on a desk' }}
          offer={{ label: 'Offer', participants: '1,284' }}
          mention="@compensation-talk"
          engagement={{ likes: 642, comments: 213, views: 5104 }}
        />
      </Frame>
    ),
  },
  'feed/post-with-citation': {
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
  'feed/post-full': {
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

  /* feed/post-group — three Post cards bundled vertically inside a
     <FeedGroup> wrapper. The group adds no surface chrome; each inner
     Post keeps its own padding and hairline bottom divider so the bundle
     reads as a continuous slice of the stream. Used for thread-grouped
     or topic-bundled feeds. */
  'feed/post-group': {
    states: false,
    render: () => (
      <Frame>
        <FeedGroup label="Today's top discussions">
          <Feed
            avatar={{ src: IMG.breadAvatar, alt: 'Sourdough Bakers' }}
            channel="Sourdough Bakers"
            timestamp="2h"
            meta={['Brooklyn, NY', '@crustcrumb']}
            title="The 30-hour cold proof finally clicked"
            body="Tried it three times before and got the same flat, dense crumb. The fourth attempt I lowered the hydration five points and skipped the second stretch-and-fold. Open crumb, blistered crust, the works."
            engagement={{ likes: 1240, comments: 87, views: 9320 }}
          />
          <Feed
            avatar={{ src: IMG.gameAvatar, alt: 'Indie Game Dev' }}
            channel="Indie Game Dev"
            timestamp="3h"
            meta={['Solo dev', '@pixelshep']}
            title="Shipping the prototype before the polish phase ate me alive"
            body="Six months of feature creep almost killed the project. Cut three subsystems, locked the scope to one core loop, and got the playable build out by Friday — feedback was sharper than any of the demo days we delayed for."
            engagement={{ likes: 412, comments: 36, views: 3210 }}
          />
          <Feed
            avatar={{ src: IMG.plantsAvatar, alt: 'Indoor Plants' }}
            channel="Indoor Plants"
            timestamp="5h"
            meta={['Apartment grower', '@leafy']}
            title="North-facing window plant rotation — what actually survived a year"
            body="Started with sixteen plants, ended the year with eleven still healthy. The winners were the ones I stopped repositioning every season — turns out the real variable was how often I disturbed the root system, not the light."
            engagement={{ likes: 308, comments: 28, views: 2410 }}
          />
        </FeedGroup>
      </Frame>
    ),
  },

  /* FeedAd — the `ad` sub of the Feed family. Default omits dismiss (the
     trailing X is opt-in); the with-dismiss case wires `onDismiss` to
     render the close icon. Both previews read as believable feed ads:
     realistic brand copy, a hero image of the product, and a brand-Hex
     CTA plumbed through `cta.color`. */
  'feed/ad-default': {
    states: false,
    render: () => (
      <Frame>
        <FeedAd
          brand={{
            name: 'Acme Coffee',
            avatar: {
              src: UNSPLASH('photo-1559496417-e7f25cb247f3', [64, 64]),
              alt: 'Acme Coffee logo',
            },
          }}
          title="Your morning brew, on us."
          body="Sign up this week and your first bag of single-origin beans ships free — no subscription required."
          media={{
            src: UNSPLASH('photo-1559056199-641a0ac8b55e', [640, 400]),
            alt: 'A flat-lay of freshly roasted coffee beans',
          }}
          cta={{ label: 'Claim your free bag', color: '#3DB1A3' }}
        />
      </Frame>
    ),
  },
  'feed/ad-with-dismiss': {
    states: false,
    render: () => (
      <Frame>
        <FeedAd
          brand={{
            name: 'Lumen Fitness',
            avatar: {
              src: UNSPLASH('photo-1517836357463-d25dfeac3438', [64, 64]),
              alt: 'Lumen Fitness logo',
            },
          }}
          onDismiss={() => {}}
          title="Train smarter, not longer."
          body="Personalized 20-minute workouts that adapt to your recovery — free for the first 30 days, no card required."
          media={{
            src: UNSPLASH('photo-1517245386807-bb43f82c33c4', [640, 400]),
            alt: 'An athlete mid-workout in a sunlit studio',
          }}
          cta={{ label: 'Start your free trial', color: '#5E4BDB' }}
        />
      </Frame>
    ),
  },

  /* FeedCarousel — the `carousel` sub of the Feed family. Up to 5 compact
     post cards under a single section header, with a one-card-per-page
     scroll-snap pager and decorative pagination dots. Header anatomy
     delegates verbatim to SuggestionList. */
  'carousel/post-default': {
    states: false,
    render: () => (
      <Frame>
        <Carousel label="Trending right now">
        <PostCarousel
          items={[
            {
              id: 'cushion',
              avatar: { src: IMG.plantAvatar, alt: 'Beauty Channel' },
              channel: 'Beauty Talk',
              verified: true,
              followAction: true,
              title: 'Which cushion brand still works on combo skin in summer?',
              body: 'Slightly dehydrated combo skin — coverage is nice but not required. Anything that holds for a workday without sliding off? Pore-blurring a plus.',
              mention: '@beauty, @skincare-talk',
              views: '5K',
            },
            {
              id: 'promo',
              avatar: { src: IMG.plantAvatar, alt: 'Compensation' },
              channel: 'Compensation',
              verified: true,
              followAction: true,
              title: 'L5 → L6 promo packet review — what worked, what nearly killed it',
              body: 'I shipped two cross-team launches in the year, but my packet still came back with "scope of influence unclear" twice before it cleared. Sharing the rewrites that finally got me through.',
              mention: '@career, @big-tech',
              views: '12K',
            },
            {
              id: 'monstera',
              avatar: { src: IMG.plantAvatar, alt: 'Plant People' },
              channel: 'Plant People',
              verified: false,
              followAction: true,
              title: 'Monstera dropping aerial roots — repot or train?',
              body: 'Two-year-old monstera, roots crawling out of the drainage holes. Light and watering are dialed in. Looking for the lazy-but-right answer before this weekend.',
              mention: '@plant-parents',
              views: '3K',
            },
            {
              id: 'sourdough',
              avatar: { src: IMG.plantAvatar, alt: 'Sourdough Club' },
              channel: 'Sourdough Club',
              verified: false,
              followAction: true,
              title: 'The 30-hour cold proof finally clicked — here is what changed',
              body: 'Same starter, same flour, same hydration. Difference was a 12°C fridge and a longer bench rest before shaping. Open crumb on the third loaf, no scoring tricks.',
              mention: '@baking',
              views: '8K',
            },
            {
              id: 'gamedev',
              avatar: { src: IMG.plantAvatar, alt: 'Indie Devs' },
              channel: 'Indie Devs',
              verified: true,
              followAction: false,
              title: 'Shipped my first game after 14 months — 87 wishlists, 3 sales, 1 angry email',
              body: 'Solo dev, no marketing budget, no community. Numbers are tiny but everything still feels like a win. Writing up the lessons before I start the next one.',
              mention: '@gamedev',
              views: '22K',
            },
          ]}
        />
        </Carousel>
      </Frame>
    ),
  },

  /* Carousel · Post with a header action — extends the header with
     an `accent` Text Button when the screen has an index page to route
     to. Lifts the `headerAction` prop on the `<Carousel>` wrapper. */
  'carousel/post-with-header-action': {
    states: false,
    render: () => (
      <Frame>
        <Carousel label="Trending right now" headerAction={{ label: 'See all', href: '#' }}>
          <PostCarousel
            items={[
              {
                id: 'migration',
                avatar: { src: IMG.plantAvatar, alt: 'Engineering' },
                channel: 'Engineering',
                verified: true,
                followAction: true,
                title: 'The migration that finally landed after three quarters',
                body: 'Internal postmortem turned editorial — the scaffolding that held the rewrite together when the timeline did not.',
                mention: '@infra-talk',
                views: '14K',
              },
              {
                id: 'refresh',
                avatar: { src: IMG.plantAvatar, alt: 'Compensation' },
                channel: 'Compensation',
                verified: true,
                followAction: true,
                title: 'Equity refresh negotiations — what actually moves',
                body: 'A read on the conversations that get an actual refresh on the calendar versus the ones that get a polite no.',
                mention: '@career',
                views: '9K',
              },
              {
                id: 'monstera',
                avatar: { src: IMG.plantAvatar, alt: 'Plant People' },
                channel: 'Plant People',
                verified: false,
                followAction: true,
                title: 'Monstera dropping aerial roots — repot or train?',
                body: 'Two-year-old monstera, roots crawling out of the drainage holes. Light and watering are dialed in.',
                mention: '@plant-parents',
                views: '3K',
              },
            ]}
          />
        </Carousel>
      </Frame>
    ),
  },

  /* Carousel · Post — editorial cards: same one-card-per-page
     pager, but each card drops `verified` and `followAction`. Each
     card's header collapses to avatar + channel name. */
  'carousel/post-editorial': {
    states: false,
    render: () => (
      <Frame>
        <Carousel label="Editor picks">
          <PostCarousel
            items={[
              {
                id: 'staying',
                avatar: { src: IMG.plantAvatar, alt: 'Career' },
                channel: 'Career',
                title: 'The quiet math of staying versus leaving',
                body: 'Salary checks, offer evaluations, and the long thread that runs longer than any single conversation can.',
                views: '18K',
              },
              {
                id: 'refresh',
                avatar: { src: IMG.plantAvatar, alt: 'Compensation' },
                channel: 'Compensation',
                title: 'Equity refresh negotiations — what actually moves',
                body: 'A read on the conversations that get an actual refresh on the calendar versus the ones that get a polite no.',
                views: '9K',
              },
              {
                id: 'migration',
                avatar: { src: IMG.plantAvatar, alt: 'Engineering' },
                channel: 'Engineering',
                title: 'The migration that finally landed after three quarters',
                body: 'Internal postmortem turned editorial — the scaffolding that held the rewrite together when the timeline did not.',
                views: '14K',
              },
            ]}
          />
        </Carousel>
      </Frame>
    ),
  },

  /* Carousel · Profile — horizontal rail of profile-style cards
     (channels, profiles, companies). Cards fixed at 176px, Toggle Button
     follow affordance, max 5 cards. */
  'carousel/profile-default': {
    states: false,
    render: () => (
      <Frame>
        <Carousel label="Hot companies right now">
          <ProfileCarousel
            items={[
              {
                avatar: { src: IMG.brandLaptop, alt: 'Amazon' },
                cover: { src: IMG.companyCover, alt: 'High-rise office skyline' },
                name: 'Amazon',
                followers: '1,678 followers',
                metrics: [
                  { icon: 'star', value: '4.1' },
                  { icon: 'pulse', value: '81.1' },
                  { icon: 'thumb', value: '81%' },
                ],
              },
              /* Default metric set: star → yellow.500, pulse →
                 success/green.500 (filled), thumb → primary tone via
                 ThumbUpFillIcon. */
              {
                avatar: { src: IMG.brandAuto, alt: 'Tesla' },
                cover: { src: IMG.startupCover, alt: 'Modern workspace interior' },
                name: 'Tesla',
                followers: '1.4K followers',
                metrics: [
                  { icon: 'star', value: '4.7' },
                  { icon: 'pulse', value: '86' },
                  { icon: 'thumb', value: '85.3%' },
                ],
                followed: true,
              },
              {
                avatar: { src: IMG.brandChip, alt: 'Stripe' },
                cover: { src: IMG.fintechCover, alt: 'Financial dashboard' },
                name: 'Stripe',
                followers: '2.1K followers',
                metrics: [
                  { icon: 'star', value: '4.5' },
                  { icon: 'pulse', value: '92.4' },
                  { icon: 'thumb', value: '88%' },
                ],
              },
            ]}
          />
        </Carousel>
      </Frame>
    ),
  },

  /* Carousel · Profile with a header action — extends the header
     with an `accent` Text Button when the screen has an index page
     to route to. Lifts the `headerAction` prop on the `<Carousel>`
     wrapper. */
  'carousel/profile-with-header-action': {
    states: false,
    render: () => (
      <Frame>
        <Carousel label="Hot companies right now" headerAction={{ label: 'See all', href: '#' }}>
          <ProfileCarousel
            items={[
              {
                avatar: { src: IMG.brandLaptop, alt: 'Amazon' },
                cover: { src: IMG.companyCover, alt: 'High-rise office skyline' },
                name: 'Amazon',
                followers: '1,678 followers',
                metrics: [
                  { icon: 'star', value: '4.1' },
                  { icon: 'pulse', value: '81.1' },
                  { icon: 'thumb', value: '81%' },
                ],
              },
              {
                avatar: { src: IMG.brandAuto, alt: 'Tesla' },
                cover: { src: IMG.startupCover, alt: 'Modern workspace interior' },
                name: 'Tesla',
                followers: '1.4K followers',
                metrics: [
                  { icon: 'star', value: '4.7' },
                  { icon: 'pulse', value: '86' },
                  { icon: 'thumb', value: '85.3%' },
                ],
                followed: true,
              },
              {
                avatar: { src: IMG.brandChip, alt: 'Stripe' },
                cover: { src: IMG.fintechCover, alt: 'Financial dashboard' },
                name: 'Stripe',
                followers: '2.1K followers',
                metrics: [
                  { icon: 'star', value: '4.5' },
                  { icon: 'pulse', value: '92.4' },
                  { icon: 'thumb', value: '88%' },
                ],
              },
            ]}
          />
        </Carousel>
      </Frame>
    ),
  },

  /* Profile Carousel · with description — swaps the metric row for a
     two-line clamped description. The description slot reserves the
     same fixed height (two body.sm lines) as the metrics row, so card
     outer height is identical across both modes even when copy spills
     past two lines and ellipsizes. */
  'carousel/profile-with-description': {
    states: false,
    render: () => (
      <Frame>
        <Carousel label="Recommended channels">
          <ProfileCarousel
            items={[
              {
                avatar: { src: IMG.brandChip, alt: 'Engineering' },
                cover: { src: IMG.startupCover, alt: 'Engineering workspace' },
                name: 'Engineering',
                followers: '12.4K followers',
                description: 'Hands-on threads about systems, infra, and the work behind the launch.',
              },
              {
                avatar: { src: IMG.brandChat, alt: 'Compensation' },
                cover: { src: IMG.compensationCover, alt: 'Offer letters on a desk' },
                name: 'Compensation',
                followers: '8.1K followers',
                description: 'Salary checks, offer evaluations, and the quiet math of staying versus leaving — the channel that runs longer than any single conversation can.',
                followed: true,
              },
              {
                avatar: { src: IMG.brandLaptop, alt: 'Career' },
                cover: { src: IMG.companyCover, alt: 'Office skyline' },
                name: 'Career',
                followers: '5.3K followers',
                description: 'Promotion packets, scope debates, and the rewrites that actually cleared.',
              },
            ]}
          />
        </Carousel>
      </Frame>
    ),
  },

  /* ProfileHeader — identity block at the top of a profile / channel
     detail screen. Cover band + overlapping 56-rung Thumbnail avatar +
     name (heading.lg) + visibility-icon · followers meta row + trailing
     follow Toggle Button. Same "profile" contract as ProfileCarousel —
     the carousel surfaces a card, the header surfaces the page rung. */
  'profile-header/default': {
    states: false,
    render: () => (
      <Frame>
        <ProfileHeader
          name="General Topic"
          avatar={{ src: IMG.modAvatar, alt: 'General Topic' }}
          cover={{ src: IMG.topicCover, alt: 'Forest skyline at dusk' }}
          visibility="public"
          followers="999 followers"
        />
      </Frame>
    ),
  },

  'profile-header/following': {
    states: false,
    render: () => (
      <Frame>
        <ProfileHeader
          name="Plant People"
          avatar={{ src: IMG.plantAvatar, alt: 'Plant People' }}
          cover={{ src: IMG.plantsCover, alt: 'Sunlit greenhouse foliage' }}
          visibility="public"
          followers="21.7K followers"
          followed
        />
      </Frame>
    ),
  },

  'profile-header/private': {
    states: false,
    render: () => (
      <Frame>
        <ProfileHeader
          name="Compensation"
          avatar={{ src: IMG.brandChat, alt: 'Compensation' }}
          cover={{ src: IMG.compensationCover, alt: 'Offer letters on a desk' }}
          visibility="private"
          followers="8.1K followers"
        />
      </Frame>
    ),
  },

  'profile-header/with-cover': {
    states: false,
    render: () => (
      <Frame>
        <ProfileHeader
          name="Sourdough Bakers"
          avatar={{ src: IMG.breadAvatar, alt: 'Sourdough Bakers' }}
          cover={{ src: IMG.breadCover, alt: 'Sliced loaf with open crumb' }}
          visibility="public"
          followers="12.4K followers"
        />
      </Frame>
    ),
  },

  /* Channel Rail — horizontal strip of channel entry points. Items are
     anchors that route to a channel page; the trailing action is a
     "View all" link to the full directory. */
  'avatar-rail/default': {
    states: false,
    render: () => (
      <Frame>
        <AvatarRail
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

  'avatar-rail/overflow': {
    states: false,
    render: () => (
      <Frame>
        <AvatarRail
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

  'banner/default': {
    states: false,
    render: () => (
      <Frame>
        <Banner
          appearance="default"
          action={{ label: 'How levels work', href: '#level' }}
        >
          Stay active in the community to level up and unlock more of what the app offers.
        </Banner>
      </Frame>
    ),
  },

  'banner/accent': {
    states: false,
    render: () => (
      <Frame>
        <Banner
          appearance="accent"
          action={{ label: 'How levels work', href: '#level' }}
        >
          Stay active in the community to level up and unlock more of what the app offers.
        </Banner>
      </Frame>
    ),
  },

  'banner/destructive': {
    states: false,
    render: () => (
      <Frame>
        <Banner
          appearance="destructive"
          action={{ label: 'Retry connection', onClick: () => {} }}
        >
          We could not reach the integrations service. Recent changes have not been synced.
        </Banner>
      </Frame>
    ),
  },

  'banner/with-thumbnail': {
    states: false,
    render: () => (
      <Frame>
        <Banner
          appearance="accent"
          thumbnail={<Thumbnail size={40} alt="Channel" src={IMG.brandChip} />}
          action={{ label: 'How levels work', href: '#level' }}
        >
          Stay active in the community to level up and unlock more of what the app offers.
        </Banner>
      </Frame>
    ),
  },

  'banner/with-icon': {
    states: false,
    render: () => (
      <Frame>
        <Banner
          appearance="accent"
          icon={<StarIcon size={16} />}
          action={{ label: 'How levels work', href: '#level' }}
        >
          Stay active in the community to level up and unlock more of what the app offers.
        </Banner>
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

  'bottom-sheet/keyboard': {
    states: false,
    render: () => (
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 560,
          overflow: 'hidden',
          /* Simulates visualViewport's keyboard inset so the preview renders
             the end-state described in bottom-sheet.md → Keyboard. The
             value matches IOSKeyboard's intrinsic height. */
          ['--bottom-sheet-keyboard-inset']: '280px',
        }}
      >
        <BottomSheet
          inline
          open
          onClose={() => {}}
          title="Name this channel"
          primaryAction={{ label: 'Create', onClick: () => {} }}
          secondaryAction={{ label: 'Cancel', onClick: () => {} }}
        >
          <FormField
            variant="input"
            label="Channel name"
            placeholder="e.g. design-systems"
          />
        </BottomSheet>
        <IOSKeyboard />
      </div>
    ),
  },

  'bottom-sheet/nested-step': {
    states: false,
    render: () => <BottomSheetNestedStepDemo />,
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
  'suggestion-list/default': {
    states: false,
    render: () => (
      <Frame>
        <SuggestionListDemo />
      </Frame>
    ),
  },

  /* Suggestion list with a trailing header action — surfaces the
     entity-agnostic anatomy (same row shape carries suggested people
     instead of channels) and extends the header with an `accent`
     Text Button when there's a broader index page to route to. */
  'suggestion-list/with-header-action': {
    states: false,
    render: () => {
      function Demo() {
        const seed = [
          { value: 'jordan',  name: 'Jordan Lee',    followers: '342 Followers',  description: 'PM at a logistics startup. Mostly here for the threads on roadmap reviews.',     thumbnail: { src: IMG.personJordan, alt: 'Jordan Lee' },    following: false },
          { value: 'taylor',  name: 'Taylor Brooks', followers: '1.1K Followers', description: 'Frontend engineer. Writes about the bits between the framework and the user.', thumbnail: { src: IMG.personTaylor, alt: 'Taylor Brooks' }, following: true  },
          { value: 'morgan',  name: 'Morgan Park',   followers: '512 Followers',  description: 'Designer-turned-PM. Notes on the handoff layer.',                              thumbnail: { src: IMG.personMorgan, alt: 'Morgan Park' },   following: false },
        ];
        const [rows, setRows] = useState(seed);
        const items = rows.map((r) => ({
          ...r,
          active: r.following,
          onToggle: () => setRows((prev) => prev.map((p) => (p.value === r.value ? { ...p, following: !p.following } : p))),
        }));
        return (
          <SuggestionList
            label="People you may know"
            headerAction={{ label: 'See all', href: '#all' }}
            items={items}
          />
        );
      }
      return (
        <Frame>
          <Demo />
        </Frame>
      );
    },
  },

  /* DirectoryList — vertical follow-list at the `large` (48 avatar)
     rung. Sibling of SuggestionList: same row anatomy but no swipeable
     pager — the full set is scanned vertically. Demo seeds a couple of
     rows as already-following so visitors can read both states. */
  'directory-list/default': {
    states: false,
    render: () => {
      function Demo() {
        const seed = [
          { value: 'breadclub',   name: 'Sourdough Bakers',     followers: '12.4K Followers', description: 'Open-crumb obsession and cold-proof timing.',          thumbnail: { src: IMG.breadAvatar,  alt: 'Sourdough Bakers' }, following: false },
          { value: 'indiedevs',   name: 'Indie Game Devs',      followers: '8,210 Followers', description: 'Shipping logs, postmortems, marketing on a budget.',   thumbnail: { src: IMG.gameAvatar,   alt: 'Indie Game Devs' },   following: true  },
          { value: 'plantfolk',   name: 'Plant People',         followers: '21.7K Followers', description: 'Houseplant troubleshooting and propagation threads.',  thumbnail: { src: IMG.plantAvatar,  alt: 'Plant People' },      following: false },
          { value: 'moviechat',   name: 'Movie Talk',           followers: '34.2K Followers', description: 'Festival coverage, director threads, link shares.',    thumbnail: { src: IMG.cinemaAvatar, alt: 'Movie Talk' },        following: false },
          { value: 'healthbeat',  name: 'Health · Diet',        followers: '11.3K Followers', description: 'Programs, macros, and weekday-meal logistics.',        thumbnail: { src: IMG.brandChip,    alt: 'Health · Diet' },     following: false },
        ];
        const [rows, setRows] = useState(seed);
        const items = rows.map((r) => ({
          ...r,
          active: r.following,
          onToggle: () => setRows((prev) => prev.map((p) => (p.value === r.value ? { ...p, following: !p.following } : p))),
        }));
        return <DirectoryList label="New channels" items={items} />;
      }
      return (
        <Frame>
          <Demo />
        </Frame>
      );
    },
  },

  /* DirectoryList · with header action — extends the header with an
     `accent` Text Button when the screen has an index page to route to.
     Surfaces the entity-agnostic anatomy: same row shape carries
     suggested people, not just channels. */
  'directory-list/with-header-action': {
    states: false,
    render: () => {
      function Demo() {
        const seed = [
          { value: 'jordan', name: 'Jordan Lee',    followers: '342 Followers',  description: 'PM at a logistics startup. Mostly here for roadmap reviews.',          thumbnail: { src: IMG.personJordan, alt: 'Jordan Lee' },    following: false },
          { value: 'taylor', name: 'Taylor Brooks', followers: '1.1K Followers', description: 'Frontend engineer. Writes about the bits between framework and user.', thumbnail: { src: IMG.personTaylor, alt: 'Taylor Brooks' }, following: true  },
          { value: 'morgan', name: 'Morgan Park',   followers: '512 Followers',  description: 'Designer-turned-PM. Notes on the handoff layer.',                       thumbnail: { src: IMG.personMorgan, alt: 'Morgan Park' },   following: false },
        ];
        const [rows, setRows] = useState(seed);
        const items = rows.map((r) => ({
          ...r,
          active: r.following,
          onToggle: () => setRows((prev) => prev.map((p) => (p.value === r.value ? { ...p, following: !p.following } : p))),
        }));
        return (
          <DirectoryList
            label="People you may know"
            headerAction={{ label: 'See all', href: '#all' }}
            items={items}
          />
        );
      }
      return (
        <Frame>
          <Demo />
        </Frame>
      );
    },
  },

  /* NavList — vertical label-only nav list. Each row is a route
     target; trailing chevron supplied by the list/nav variant.
     Reach for it on category indexes, settings menus, and any "pick a
     sub-page" surface where no leading thumbnail belongs. */
  'nav-list/default': {
    states: false,
    render: () => (
      <Frame>
        <NavList
          label="Category"
          items={[
            { value: 'location',      label: 'Location',              onClick: () => {} },
            { value: 'job',           label: 'Job Function',          onClick: () => {} },
            { value: 'learning',      label: 'Learning & Advising',   onClick: () => {} },
            { value: 'money',         label: 'Money',                 onClick: () => {} },
            { value: 'industry',      label: 'Industry',              onClick: () => {} },
            { value: 'worklife',      label: 'Work Life',             onClick: () => {} },
            { value: 'entertainment', label: 'Entertainment',         onClick: () => {} },
            { value: 'relationships', label: 'Relationships & Social',onClick: () => {} },
            { value: 'culture',       label: 'Culture',               onClick: () => {} },
          ]}
        />
      </Frame>
    ),
  },

  /* NavList · with header action — extends the header with an
     `accent` Text Button for a sibling "Manage" / "View all" route. */
  'nav-list/with-header-action': {
    states: false,
    render: () => (
      <Frame>
        <NavList
          label="Settings"
          headerAction={{ label: 'Manage', href: '#manage' }}
          items={[
            { value: 'account',       label: 'Account',       onClick: () => {} },
            { value: 'notifications', label: 'Notifications', onClick: () => {} },
            { value: 'privacy',       label: 'Privacy',       onClick: () => {} },
            { value: 'appearance',    label: 'Appearance',    onClick: () => {} },
            { value: 'language',      label: 'Language',      onClick: () => {} },
          ]}
        />
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

  /* List — radio variant with supportingText on every row. Demonstrates
     the optional secondary line under the label — same 12 / 16 row
     padding, the row grows vertically to hold the supporting line. */
  'list/radio-with-supporting': {
    states: false,
    render: () => {
      function Demo() {
        const [value, setValue] = useState('trending');
        return (
          <List
            variant="radio"
            value={value}
            onChange={setValue}
            aria-label="Sort posts by"
            items={[
              { value: 'newest',     label: 'Newest first',  supportingText: 'Most recent posts at the top' },
              { value: 'trending',   label: 'Trending',      supportingText: 'Active threads from the last 24h' },
              { value: 'most-liked', label: 'Most liked',    supportingText: 'Highest like count this week' },
              { value: 'oldest',     label: 'Oldest first',  supportingText: 'Earliest posts at the top' },
            ]}
          />
        );
      }
      return (
        <Frame>
          <Demo />
        </Frame>
      );
    },
  },

  /* List — radio variant with one row pinned to `disabled: true`. The
     row's pointer-events are suppressed and it paints at
     `sys.state.disabled` opacity; the radio indicator dims with the row. */
  'list/radio-disabled-item': {
    states: false,
    render: () => {
      function Demo() {
        const [value, setValue] = useState('week');
        return (
          <List
            variant="radio"
            value={value}
            onChange={setValue}
            items={[
              { value: 'day',     label: 'Day' },
              { value: 'week',    label: 'Week' },
              { value: 'month',   label: 'Month' },
              { value: 'quarter', label: 'Quarter', disabled: true },
              { value: 'year',    label: 'Year' },
            ]}
          />
        );
      }
      return (
        <Frame>
          <Demo />
        </Frame>
      );
    },
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

  /* NavCard — single bounded card. `default` ships no trailing icon
     (labelled tile); `nav` auto-renders the drill-in chevron. Whole card
     is the tap target. Single-card counterpart to list/nav. */
  'nav-card/default': {
    states: false,
    render: () => (
      <Frame>
        <NavCard label="Cell label here" href="#" />
      </Frame>
    ),
  },

  'nav-card/nav': {
    states: false,
    render: () => (
      <Frame>
        <NavCard variant="nav" label="Cell label here" href="#" />
      </Frame>
    ),
  },

  'nav-card/supporting': {
    states: false,
    render: () => (
      <Frame>
        <NavCard
          variant="nav"
          label="Saved posts"
          supportingText="47 posts across 9 channels"
          href="#"
        />
      </Frame>
    ),
  },

  'nav-card/leading-icon': {
    states: false,
    render: () => (
      <Frame>
        <NavCard
          label="Notifications"
          leading={<BellIcon size={16} />}
          supportingText="3 unread mentions"
          href="#"
        />
      </Frame>
    ),
  },

  'nav-card/leading-thumbnail': {
    states: false,
    render: () => (
      <Frame>
        <NavCard
          variant="nav"
          label="Hyundai Motor"
          supportingText="Private · My company"
          leading={<Thumbnail size={32} alt="Hyundai" src={IMG.brandAuto} />}
          href="#"
        />
      </Frame>
    ),
  },

  'nav-card/group': {
    states: false,
    render: () => (
      <Frame>
        <NavCardGroup aria-label="Account">
          <NavCard variant="nav" label="Profile"       supportingText="Display name, avatar, bio"     leading={<ProfileIcon size={16} />}  href="#" />
          <NavCard variant="nav" label="Saved posts"   supportingText="47 posts across 9 channels"    leading={<BookmarkIcon size={16} />} href="#" />
          <NavCard variant="nav" label="Notifications" leading={<BellIcon size={16} />} href="#" />
        </NavCardGroup>
      </Frame>
    ),
  },

  'nav-card/surface': {
    states: false,
    render: () => (
      <Frame>
        <div
          style={{
            background: 'var(--sys-color-surfaceContainerLow)',
            padding: 'var(--sys-layout-container-md)',
            borderRadius: 'var(--sys-radius-lg)',
          }}
        >
          <NavCardGroup aria-label="Account">
            <NavCard variant="nav" appearance="surface" label="Profile"       supportingText="Display name, avatar, bio"     leading={<ProfileIcon size={16} />}  href="#" />
            <NavCard variant="nav" appearance="surface" label="Saved posts"   supportingText="47 posts across 9 channels"    leading={<BookmarkIcon size={16} />} href="#" />
            <NavCard variant="nav" appearance="surface" label="Notifications" leading={<BellIcon size={16} />} href="#" />
          </NavCardGroup>
        </div>
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

  /* List — nav variant with one row overriding the auto chevron via
     `items[i].trailingIcon`. Surfaces the per-row override path the
     spec calls out: a Badge on Notifications keeps the chevron on
     every sibling row but replaces it on this one. */
  'list/nav-trailing-override': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="nav"
          items={[
            { value: 'profile',  label: 'Profile',       supportingText: 'Display name, avatar, bio' },
            { value: 'channels', label: 'My channels',   supportingText: '12 joined · 3 muted' },
            { value: 'notif',    label: 'Notifications', trailingIcon: <Badge>3</Badge> },
            { value: 'privacy',  label: 'Privacy' },
            { value: 'account',  label: 'Account' },
          ]}
        />
      </Frame>
    ),
  },

  /* List — thumbnail variant. Each row anchored by a 40px Thumbnail.
     Staged as a "Channels you follow" surface inside the community app. */
  'list/image': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="image"
          items={[
            { value: 'sourdough', label: 'Sourdough Bakers', supportingText: '3 new posts today',  thumbnail: { src: IMG.breadAvatar,  alt: 'Sourdough Bakers' } },
            { value: 'indiedev',  label: 'Indie Game Devs',  supportingText: '12 new posts today', thumbnail: { src: IMG.gameAvatar,   alt: 'Indie Game Devs' } },
            { value: 'plants',    label: 'Plant People',     supportingText: 'No new posts',       thumbnail: { src: IMG.plantAvatar,  alt: 'Plant People' } },
          ]}
        />
      </Frame>
    ),
  },

  /* List — thumbnail without divider on the middle row. Demonstrates
     the per-row `divider: false` opt-out — the second row's hairline
     bottom rule disappears while the row's footprint and inline
     padding stay unchanged. */
  'list/image-without-divider': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="image"
          items={[
            { value: 'sourdough', label: 'Sourdough Bakers', supportingText: '3 new posts today',  thumbnail: { src: IMG.breadAvatar,  alt: 'Sourdough Bakers' } },
            { value: 'indiedev',  label: 'Indie Game Devs',  supportingText: '12 new posts today', thumbnail: { src: IMG.gameAvatar,   alt: 'Indie Game Devs' }, divider: false },
            { value: 'plants',    label: 'Plant People',     supportingText: 'No new posts',       thumbnail: { src: IMG.plantAvatar,  alt: 'Plant People' } },
          ]}
        />
      </Frame>
    ),
  },

  /* List — entry variant. Directory-entry rows that pair a leading
     Thumbnail (selectable 32 / 40 / 48 / 56 via the `size` axis below)
     with an identity group (label + optional inline `count` Badge +
     optional stacked secondary line) and an optional single-line
     description. The size axis is surfaced through the standard Size
     dropdown (largest-first per project ordering); the row payload
     (label + secondary + description + follow toggle) stays constant
     across sizes so the visual difference is the avatar rung alone.
     At `xlarge` the inter-row divider anchors to the text column
     (16 + 56 + 12 = 84) so the rule reads as separating identity
     columns under the wider avatar. */
  'list/entry': {
    states: false,
    sizes: ['xlarge', 'large', 'medium', 'small'],
    render: ({ size = 'medium' }) => (
      <Frame>
        <List
          variant="entry"
          size={size}
          items={[
            {
              value: 'sourdough',
              label: 'Sourdough Bakers',
              secondary: '12.4K Followers',
              description: 'Open-crumb obsession, cold-proof timelines, weekend bakes.',
              thumbnail: { src: IMG.breadAvatar, alt: 'Sourdough Bakers' },
              trailingIcon: (
                <Button variant="toggle" onClick={() => {}}>Follow</Button>
              ),
            },
            {
              value: 'indiedev',
              label: 'Indie Game Devs',
              secondary: '8,210 Followers',
              description: 'Solo dev diaries, first-release postmortems, jam recaps.',
              thumbnail: { src: IMG.gameAvatar, alt: 'Indie Game Devs' },
              trailingIcon: (
                <Button variant="toggle" onClick={() => {}}>Follow</Button>
              ),
            },
            {
              value: 'changelog',
              label: 'Product changelog',
              secondary: '3 new this week',
              description: 'Weekly release notes from the platform team.',
              thumbnail: { src: IMG.productLog, alt: 'Product changelog' },
              trailingIcon: (
                <Button variant="toggle" onClick={() => {}}>Follow</Button>
              ),
            },
          ]}
        />
      </Frame>
    ),
  },

  /* Entry with the single-shape star toggle contract — always
     StarFillIcon; only color flips between state. Stable trailing
     footprint across active/inactive. */
  'list/entry-with-star': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="entry"
          size="small"
          items={[
            {
              value: 'sourdough',
              label: 'Sourdough Bakers',
              count: <Badge count={12} />,
              thumbnail: { src: IMG.breadAvatar, alt: 'Sourdough Bakers' },
              trailingIcon: (
                <Button
                  variant="icon" size="medium"
                  aria-label="Favorited" aria-pressed="true"
                  icon={<StarFillIcon />}
                  style={{ color: 'var(--ref-palette-yellow-500)' }}
                  onClick={() => {}}
                />
              ),
            },
            {
              value: 'stocks',
              label: 'Stocks & Investing',
              count: <Badge count={142} />,
              thumbnail: { src: IMG.stocksChart, alt: 'Stocks & Investing' },
            },
            {
              value: 'movies',
              label: 'Movie Talk',
              count: <Badge count={24} />,
              thumbnail: { src: IMG.cinemaAvatar, alt: 'Movie Talk' },
              trailingIcon: (
                <Button
                  variant="icon" size="medium"
                  aria-label="Favorite" aria-pressed="false"
                  icon={<StarFillIcon />}
                  style={{ color: 'var(--sys-color-onSurfaceVariant)' }}
                  onClick={() => {}}
                />
              ),
            },
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
    sizes: ['medium', 'small'],
    render: ({ size = 'medium' }) => <Badge size={size}>3</Badge>,
  },
  'badge/digit-cases': {
    states: false,
    sizes: ['medium', 'small'],
    render: ({ size = 'medium' }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-lg)' }}>
        <Badge size={size} count={3} />
        <Badge size={size} count={27} />
        <Badge size={size} count={142} />
      </div>
    ),
  },
  'badge/update-dot': {
    states: false,
    sizes: ['medium', 'small'],
    render: ({ size = 'medium' }) => (
      <Badge size={size === 'small' ? 'dot-sm' : 'dot-md'} />
    ),
  },
  /* On thumbnail — Dot rung painted at the host's top-right corner. The
     canonical hosted form: Thumbnail picks `dot-md` at the 32 / 40 / 48
     rungs and `dot-sm` at 16 / 20 / 24 so the dot and its 1px `surface`
     halo stay in lockstep with the Thumbnail ladder. */
  'badge/on-thumbnail': {
    states: false,
    sizes: ['medium', 'small'],
    render: ({ size = 'medium' }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-xl)' }}>
        <Thumbnail size={size === 'small' ? 24 : 48} src={IMG.breadAvatar} alt="Sourdough Bakers" updateDot />
      </div>
    ),
  },
  /* On icon — Dot rung painted at the icon's top-right. Same composition
     contract as Thumbnail: a `position: relative` host with the Badge
     `dot-sm` rung absolutely positioned at the corner; the 2px
     `surface`-color outline keeps the dot visually discrete from the
     icon stroke on any host. The dot is fixed at `dot-sm` regardless of
     icon rung so it always reads as a *highlight*, not an *occluder*. */
  'badge/on-icon': {
    states: false,
    render: () => {
      const wrap = (icon) => (
        <span style={{ position: 'relative', display: 'inline-flex', color: 'var(--sys-color-onSurface)' }}>
          {icon}
          <Badge size="dot-sm" style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(25%, -25%)' }} />
        </span>
      );
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-2xl)' }}>
          {wrap(<BellIcon size={24} />)}
          {wrap(<ChatIcon size={24} />)}
          {wrap(<MentionIcon size={24} />)}
          {wrap(<BellIcon size={20} />)}
          {wrap(<ChatIcon size={20} />)}
          {wrap(<MentionIcon size={20} />)}
        </div>
      );
    },
  },
  'badge/with-host': {
    states: false,
    sizes: ['medium', 'small'],
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
            variant="image"
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
              src={asset("/blind_logotype_black.svg")}
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
          leading={{ icon: <ChevronLeftIcon />, 'aria-label': 'Back' }}
          trailing={<Button variant="toolbar" appearance="accent">Save</Button>}
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
          trailing={{ icon: <XIcon />, 'aria-label': 'Close' }}
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
          leading={{ icon: <ChevronLeftIcon />, 'aria-label': 'Back' }}
          trailing={{ icon: <EllipsisHorizontalIcon />, 'aria-label': 'More' }}
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
          leading={{ icon: <ChevronLeftIcon />, 'aria-label': 'Back' }}
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

  /* Overlay appearance — transparent + fixed-white icons. Staged via
     <ProfileHeader>, the canonical host documented in
     navigation-bar/page.spec.json#appearances.overlay: ProfileHeader
     internally renders the page bar at appearance="overlay" over its
     cover image. Same bare-Frame staging shape as the other
     navigation-bar/page/* previews — no inline-styled wrapper divs. */
  'navigation-bar/page/overlay': {
    states: false,
    render: () => (
      <Frame>
        <ProfileHeader
          name="General Topic"
          avatar={{ src: IMG.modAvatar, alt: 'General Topic' }}
          cover={{ src: IMG.topicCover, alt: 'Forest skyline at dusk' }}
          visibility="public"
          followers="999 followers"
        />
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

  /* Search bar with a non-empty value. The placeholder swaps for an
     onSurface text value, and the trailing clear (×) — Icon Button's
     `medium` 32 × 32 capsule, smaller than the leading back-arrow on
     purpose — appears. */
  'navigation-bar/search/with-value': {
    states: false,
    render: () => (
      <Frame>
        <NavigationBar
          variant="search"
          placeholder="Search by keyword"
          defaultValue="lighting"
          autoFocus={false}
          onBack={() => {}}
        />
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
    render: () => {
      const [value, setValue] = useState('home');
      return (
        <Frame>
          <TabBar
            aria-label="Primary"
            value={value}
            onChange={setValue}
            items={[
              { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
              { value: 'company',       label: 'Company',       icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
              { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,       activeIcon: <SearchFillIcon /> },
              { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
              { value: 'notifications', label: 'Notifications', icon: <BellIcon />, activeIcon: <BellFillIcon /> },
            ]}
          />
        </Frame>
      );
    },
  },
  'tab-bar/with-primary': {
    states: false,
    render: () => {
      const [value, setValue] = useState('home');
      return (
        <Frame>
          <TabBar
            aria-label="Primary"
            value={value}
            onChange={setValue}
            items={[
              { value: 'home',          label: 'Home',          icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
              { value: 'company',       label: 'Company',       icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
              { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,       activeIcon: <SearchFillIcon /> },
              { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
              { value: 'notifications', label: 'Notifications', icon: <BellIcon />, activeIcon: <BellFillIcon /> },
              { value: 'create',        label: 'Create',        icon: <PlusSquareFillIcon />, appearance: 'primary' },
            ]}
          />
        </Frame>
      );
    },
  },
  'tab-bar/three-destinations': {
    states: false,
    render: () => {
      const [value, setValue] = useState('explore');
      return (
        <Frame>
          <TabBar
            aria-label="Primary"
            value={value}
            onChange={setValue}
            items={[
              { value: 'home',    label: 'Home',    icon: <HomeIcon />,    activeIcon: <HomeFillIcon /> },
              { value: 'explore', label: 'Explore', icon: <SearchIcon />,  activeIcon: <SearchFillIcon /> },
              { value: 'profile', label: 'Profile', icon: <ProfileIcon />, activeIcon: <ProfileFillIcon /> },
            ]}
          />
        </Frame>
      );
    },
  },
  'tab-bar/truncation': {
    states: false,
    render: () => {
      const [value, setValue] = useState('messages');
      return (
        <Frame>
          <TabBar
            aria-label="Primary"
            value={value}
            onChange={setValue}
            items={[
              { value: 'home',          label: 'Home',                  icon: <HomeIcon />,         activeIcon: <HomeFillIcon /> },
              { value: 'company',       label: 'My organization',       icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
              { value: 'explore',       label: 'Explore communities',   icon: <SearchIcon />,       activeIcon: <SearchFillIcon /> },
              { value: 'messages',      label: 'Direct messages',       icon: <ChatIcon />,         activeIcon: <ChatFillIcon /> },
              { value: 'notifications', label: 'All notifications',     icon: <BellIcon />, activeIcon: <BellFillIcon /> },
            ]}
          />
        </Frame>
      );
    },
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
            { value: 'company',       label: 'Company',       icon: <BuildingIcon />,      activeIcon: <BuildingFillIcon /> },
            { value: 'explore',       label: 'Explore',       icon: <SearchIcon />,       activeIcon: <SearchFillIcon />, forcedState: 'focused' },
            { value: 'jobs',          label: 'Jobs',          icon: <BriefcaseIcon />,    activeIcon: <BriefcaseFillIcon /> },
            { value: 'notifications', label: 'Notifications', icon: <BellIcon />, activeIcon: <BellFillIcon /> },
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

  'toast/default': {
    states: false,
    render: () => (
      <Frame>
        <Toast>Token copied to clipboard</Toast>
      </Frame>
    ),
  },

  'toast/max-width': {
    states: false,
    render: () => (
      <Frame>
        <Toast>Saved your draft to every workspace you joined this month</Toast>
      </Frame>
    ),
  },

  'toast/truncation': {
    states: false,
    render: () => (
      <Frame>
        <Toast trailing={
          <Button
            variant="icon"
            size="medium"
            appearance="inverse"
            icon={<XIcon />}
            aria-label="Dismiss"
            onClick={() => {}}
          />
        }>
          Saved your draft and synced 12 channels across every workspace you joined this month — long enough that the body has to wrap and then truncate at two lines.
        </Toast>
      </Frame>
    ),
  },

  'toast/with-action': {
    states: false,
    render: () => (
      <Frame>
        <Toast trailing={
          <Button variant="text" size="small" appearance="inverse" onClick={() => {}}>
            Undo
          </Button>
        }>
          Message deleted
        </Toast>
      </Frame>
    ),
  },

  'toast/with-dismiss': {
    states: false,
    render: () => (
      <Frame>
        <Toast trailing={
          <Button
            variant="icon"
            size="medium"
            appearance="inverse"
            icon={<XIcon />}
            aria-label="Dismiss"
            onClick={() => {}}
          />
        }>
          Synced 12 channels in the background
        </Toast>
      </Frame>
    ),
  },

  'tooltip/default': {
    states: false,
    render: () => <Tooltip placement="top">Tooltip text</Tooltip>,
  },

  'tooltip/inverse': {
    states: false,
    render: () => <Tooltip placement="top" appearance="inverse">Tooltip text</Tooltip>,
  },

  'tooltip/with-action': {
    states: false,
    render: () => (
      <Tooltip placement="top" action={
        <Button variant="text" size="small" appearance="onPrimary" onClick={() => {}}>
          Got it
        </Button>
      }>
        Tooltip text
      </Tooltip>
    ),
  },

  'tooltip/multiline-action': {
    states: false,
    render: () => (
      <Tooltip placement="bottom" action={
        <Button variant="text" size="small" appearance="onPrimary" onClick={() => {}}>
          Learn more
        </Button>
      }>
        Tooltip text wraps onto a second line when it would push the bubble past the 240 cap.
      </Tooltip>
    ),
  },

  'tooltip/placements': {
    states: false,
    render: () => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, max-content)',
          gap: 'var(--sys-layout-container-xl)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Tooltip placement="top-start">Tooltip text</Tooltip>
        <Tooltip placement="top">Tooltip text</Tooltip>
        <Tooltip placement="top-end">Tooltip text</Tooltip>
        <Tooltip placement="bottom-start">Tooltip text</Tooltip>
        <Tooltip placement="bottom">Tooltip text</Tooltip>
        <Tooltip placement="bottom-end">Tooltip text</Tooltip>
      </div>
    ),
  },

  /* Skeleton — tonal loading placeholder that previews the footprint of
     content still being fetched. Three shapes (text/block/circle); group
     them inside SkeletonGroup to mirror the rhythm of a list row, feed
     post, or card. */
  'skeleton/default': {
    states: false,
    render: () => (
      <Frame>
        <Skeleton />
      </Frame>
    ),
  },

  'skeleton/block': {
    states: false,
    render: () => (
      <Frame>
        <Skeleton shape="block" height={120} />
      </Frame>
    ),
  },

  'skeleton/circle': {
    states: false,
    render: () => (
      <Frame>
        <Skeleton shape="circle" />
      </Frame>
    ),
  },

  'skeleton/list-row': {
    states: false,
    render: () => (
      <Frame>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sys-layout-inline-md)',
            padding: 'var(--sys-layout-container-xs) var(--sys-layout-container-md)',
          }}
        >
          <Skeleton shape="circle" />
          <SkeletonGroup aria-label="Loading row" style={{ flex: 1 }}>
            <Skeleton width="60%" />
            <Skeleton width="40%" />
          </SkeletonGroup>
        </div>
      </Frame>
    ),
  },

  'skeleton/feed-post': {
    states: false,
    render: () => (
      <Frame>
        <SkeletonGroup aria-label="Loading post" style={{ padding: 'var(--sys-layout-container-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-md)' }}>
            <Skeleton shape="circle" width={32} height={32} />
            <SkeletonGroup style={{ flex: 1 }}>
              <Skeleton width="40%" />
              <Skeleton width="25%" />
            </SkeletonGroup>
          </div>
          <Skeleton width="85%" />
          <Skeleton />
          <Skeleton width="70%" />
          <Skeleton shape="block" height={180} />
        </SkeletonGroup>
      </Frame>
    ),
  },

  /* Switch — binary on/off pill. Off paints muted track with a hairline
     outline; on paints `primary` track. Instant commit (no confirmation
     step). */
  'switch/default': {
    states: false,
    render: () => <Switch defaultChecked aria-label="Notifications" />,
  },

  'switch/off': {
    states: false,
    render: () => <Switch defaultChecked={false} aria-label="Notifications" />,
  },

  'switch/disabled': {
    states: false,
    render: () => (
      <div style={{ display: 'flex', gap: 'var(--sys-layout-inline-md)' }}>
        <Switch defaultChecked={false} disabled aria-label="Off, disabled" />
        <Switch defaultChecked disabled aria-label="On, disabled" />
      </div>
    ),
  },

  'switch/with-label': {
    states: false,
    render: () => (
      <Frame>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sys-layout-inline-md)',
            padding: 'var(--sys-layout-container-xs) var(--sys-layout-container-md)',
          }}
        >
          <span id="notif-label" style={{ fontSize: 'var(--sys-typo-body-sm-size)', color: 'var(--sys-color-onSurface)' }}>
            Push notifications
          </span>
          <Switch defaultChecked aria-labelledby="notif-label" />
        </div>
      </Frame>
    ),
  },

  /* Accordion — vertical stack of expandable rows. type='single' allows
     one open at a time; type='multiple' allows any number. Rows tile
     flush with a hairline outlineVariant divider. */
  'accordion/default': {
    states: false,
    render: () => (
      <Frame>
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
      </Frame>
    ),
  },

  'accordion/multiple': {
    states: false,
    render: () => (
      <Frame>
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
      </Frame>
    ),
  },

  'accordion/disabled-item': {
    states: false,
    render: () => (
      <Frame>
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
      </Frame>
    ),
  },

  /* Accordion → Nested list — expanded body holds a <List embedded> child
     group. The body paints a hairline outlineVariant divider at the TOP
     via a ::before overlay so parent trigger ↔ child rows read as a
     hierarchy. Five-child case mirrors the "Invest Cast + Acctg / Admin /
     Biz Dev / Consultant / Creative" directory shape. */
  'accordion/nested-list': {
    states: false,
    render: () => (
      <Frame>
        <Accordion type="single" defaultValue="invest-cast" aria-label="Company directory">
          <Accordion.Item value="invest-fund" label="Invest Fund">
            <List
              variant="text"
              embedded
              aria-label="Invest Fund roles"
              items={[
                { value: 'invest-fund-analyst',   label: 'Invest Fund + Analyst' },
                { value: 'invest-fund-associate', label: 'Invest Fund + Associate' },
                { value: 'invest-fund-partner',   label: 'Invest Fund + Partner' },
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
                { value: 'invest-fin-advisor',    label: 'INVEST Financial + Advisor' },
                { value: 'invest-fin-compliance', label: 'INVEST Financial + Compliance' },
                { value: 'invest-fin-ops',        label: 'INVEST Financial + Ops' },
              ]}
            />
          </Accordion.Item>
        </Accordion>
      </Frame>
    ),
  },

  /* Progress — linear progress bar. Single rung (8px / radius.full),
     inverseSurface indicator on a Banner-style scrim track. Two modes:
     determinate (value-driven) and indeterminate (sliding 40% segment). */
  'progress/default': {
    states: false,
    render: () => (
      <Frame>
        <Progress value={0.4} aria-label="Uploading file" />
      </Frame>
    ),
  },

  'progress/indeterminate': {
    states: false,
    render: () => (
      <Frame>
        <Progress indeterminate aria-label="Syncing in the background" />
      </Frame>
    ),
  },

  /* StatusTag — small inline status pill. Two appearances on a single
     emphasis axis: neutral (informational default) and error (rejection
     / blocked). Decorative, never a button. */
  'status-tag/default': {
    states: false,
    render: () => <StatusTag>Pending</StatusTag>,
  },

  'status-tag/error': {
    states: false,
    render: () => <StatusTag appearance="error">Rejected</StatusTag>,
  },

  'status-tag/list-row': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="image"
          aria-label="Channel approval status"
          items={[
            {
              value: 'home-baking',
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sys-layout-container-2xs)' }}>
                  Home Baking Club
                  <StatusTag>Pending</StatusTag>
                </span>
              ),
              thumbnail: { src: IMG.breadAvatar, alt: 'Home Baking Club', shape: 'circle' },
            },
            {
              value: 'leetcode-grind',
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sys-layout-container-2xs)' }}>
                  LeetCode Grind
                  <StatusTag appearance="error">Rejected</StatusTag>
                </span>
              ),
              thumbnail: { src: IMG.brandLaptop, alt: 'LeetCode Grind', shape: 'circle' },
            },
          ]}
        />
      </Frame>
    ),
  },

  'status-tag/inline': {
    states: false,
    render: () => (
      <Frame>
        <p style={{ fontSize: 'var(--sys-typo-body-sm-size)', color: 'var(--sys-color-onSurface)', margin: 0 }}>
          Shared document <StatusTag>Pending</StatusTag> is awaiting review.
        </p>
      </Frame>
    ),
  },

  /* List — Text & Thumbnail trailing-action use cases. A Text Button
     dropped into the row's trailing slot turns a display row into a
     row + action affordance without changing the row's primary
     interaction model. */
  /* FormField — textarea sub. Multi-line cousin of Input; `rows` floor +
     vertical-only resize handle. No trailing clear button. */
  'form-field/textarea': {
    states: false,
    render: () => (
      <Frame>
        <FormField
          variant="textarea"
          label="Description"
          placeholder="Add a description for your channel"
          helper="Up to 280 characters. Markdown is supported."
        />
      </Frame>
    ),
  },

  'form-field/textarea-count': {
    states: false,
    render: () => (
      <Frame>
        <FormField
          variant="textarea"
          label="Bio"
          defaultValue="Designing for clarity, building for trust."
          maxLength={140}
          rows={3}
        />
      </Frame>
    ),
  },

  'form-field/textarea-error': {
    states: false,
    render: () => (
      <Frame>
        <FormField
          variant="textarea"
          label="Description"
          defaultValue=""
          appearance="error"
          helper="Description is required."
        />
      </Frame>
    ),
  },

  'list/text-with-trailing-action': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="text"
          aria-label="Notification channels"
          items={[
            {
              value: 'email',
              label: 'Email',
              supportingText: 'work@example.com',
              trailingIcon: (
                <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
                  Edit
                </Button>
              ),
            },
            {
              value: 'sms',
              label: 'SMS',
              supportingText: '+1 (415) ***-2487',
              trailingIcon: (
                <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
                  Edit
                </Button>
              ),
            },
          ]}
        />
      </Frame>
    ),
  },

  /* Header — labelled heading + optional trailing affordance. The size
     axis (large / medium) lives in the standard sizes dropdown so the
     visitor can flip between heading-md and heading-sm typography on
     the same specimen instead of reading two parallel previews. */
  'header/default': {
    sizes: ['large', 'medium'],
    states: false,
    render: ({ size = 'large' }) => (
      <Frame>
        <Header
          size={size}
          label="Recommended channels"
          headerAction={{ label: 'See all', href: '#all' }}
        />
      </Frame>
    ),
  },

  /* With drill-in chevron — `trailingIcon` mode. The whole header is the
     tap target (becomes a <button>), the 16px chevron paints in
     onSurfaceVariant and rotates -90deg to read as chevron-right. The
     canonical drawer-column heading rung is `size="medium"`. */
  'header/with-icon-action': {
    sizes: ['large', 'medium'],
    states: false,
    render: ({ size = 'medium' }) => (
      <Frame>
        <Header
          size={size}
          label="My channels"
          trailingIcon
          onClick={() => {}}
        />
      </Frame>
    ),
  },

  /* SideSheet — off-canvas content column anchored to the leading edge.
     Canonical fill: Header (size="medium") + List(entry) directory
     stacks replicating the navigation-drawer pattern (My channels →
     Favorites → Following) + pinned footer commit. The `inline` prop
     renders the sheet next to the page in docs (skips portal, scroll
     lock, fixed positioning). */
  'side-sheet/default': {
    states: false,
    render: () => (
      <div style={{ width: '100%', maxWidth: 400, minHeight: 640 }}>
        <SideSheet
          inline
          open
          onClose={() => {}}
          aria-label="Channels drawer"
          footer={
            <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
              Browse all channels
            </Button>
          }
        >
          <SideSheetGroup>
            <Header
              size="medium"
              label="My channels"
              headerAction={{ label: 'Create', leadingIcon: <PlusIcon />, onClick: () => {} }}
            />
            <List
              variant="entry"
              embedded
              size="small"
              divider={false}
              items={[
                { value: 'team-blind',     label: 'Team Blind',         thumbnail: { src: IMG.modAvatar,   alt: 'Team Blind' } },
                { value: 'startup-lounge', label: 'Startup Lounge',     count: <Badge size="small" count={64} />, thumbnail: { src: IMG.plantAvatar, alt: 'Startup Lounge' } },
                { value: 'it-pm',          label: 'IT PM · Management', count: <Badge size="small" count={12} />, thumbnail: { src: IMG.brandLaptop, alt: 'IT PM · Management' } },
              ]}
            />
          </SideSheetGroup>

          <SideSheetGroup>
            <Header size="medium" label="Favorites" />
            <List
              variant="entry"
              embedded
              size="small"
              divider={false}
              items={[
                {
                  value: 'sourdough',
                  label: 'Sourdough Bakers',
                  count: <Badge size="small" count={12} />,
                  thumbnail: { src: IMG.breadAvatar, alt: 'Sourdough Bakers' },
                  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorited" aria-pressed="true" icon={<StarFillIcon />} style={{ color: 'var(--ref-palette-yellow-500)' }} onClick={() => {}} />,
                },
                {
                  value: 'stocks',
                  label: 'Stocks & Investing',
                  count: <Badge size="small" count={142} />,
                  thumbnail: { src: IMG.brandChip, alt: 'Stocks & Investing' },
                  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorited" aria-pressed="true" icon={<StarFillIcon />} style={{ color: 'var(--ref-palette-yellow-500)' }} onClick={() => {}} />,
                },
                {
                  value: 'movie-talk',
                  label: 'Movie Talk',
                  count: <Badge size="small" count={24} />,
                  thumbnail: { src: IMG.cinemaAvatar, alt: 'Movie Talk' },
                  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorited" aria-pressed="true" icon={<StarFillIcon />} style={{ color: 'var(--ref-palette-yellow-500)' }} onClick={() => {}} />,
                },
              ]}
            />
          </SideSheetGroup>

          <SideSheetGroup>
            <Header size="medium" label="Following" />
            <List
              variant="entry"
              embedded
              size="small"
              divider={false}
              items={[
                {
                  value: 'career',
                  label: 'Career & Jobs',
                  count: <Badge size="small" count={24} />,
                  thumbnail: { src: IMG.brandChat, alt: 'Career & Jobs' },
                  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" aria-pressed="false" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-onSurfaceVariant)' }} onClick={() => {}} />,
                },
                {
                  value: 'marketplace',
                  label: 'Marketplace',
                  count: <Badge size="small" count={12} />,
                  thumbnail: { src: IMG.brandAppliance, alt: 'Marketplace' },
                  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" aria-pressed="false" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-onSurfaceVariant)' }} onClick={() => {}} />,
                },
                {
                  value: 'fashion',
                  label: 'Fashion & Beauty',
                  thumbnail: { src: IMG.brandPhone, alt: 'Fashion & Beauty' },
                  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" aria-pressed="false" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-onSurfaceVariant)' }} onClick={() => {}} />,
                },
              ]}
            />
          </SideSheetGroup>
        </SideSheet>
      </div>
    ),
  },

  'list/image-with-trailing-action': {
    states: false,
    render: () => (
      <Frame>
        <List
          variant="image"
          aria-label="Suggested channels"
          items={[
            {
              value: 'product',
              label: 'Product Design',
              supportingText: '1,204 colleagues following',
              thumbnail: { alt: 'Product Design', shape: 'circle' },
              trailingIcon: (
                <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
                  Follow
                </Button>
              ),
            },
            {
              value: 'frontend',
              label: 'Frontend',
              supportingText: '892 colleagues following',
              thumbnail: { alt: 'Frontend', shape: 'circle' },
              trailingIcon: (
                <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
                  Follow
                </Button>
              ),
            },
          ]}
        />
      </Frame>
    ),
  },
};
