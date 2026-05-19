# @blind-dsai/tokens

## 0.3.0

### Minor Changes

- be6c9af: First public release on npmjs.org. Switch publish target from GitHub Packages (private) to the public npm registry so external tools (Lovable, v0, Cursor, Claude Code) can `npm install @blind-dsai/ui @blind-dsai/tokens` without auth.

## 0.2.0

### Minor Changes

- d2cc609: Initial release of `@blind-dsai/tokens` and `@blind-dsai/ui`.

  - `@blind-dsai/tokens`: three-tier design tokens (reference / system / component) shipped as JSON bundles and a single `tokens.css` with CSS custom properties for both light and dark themes.
  - `@blind-dsai/ui`: React component library (Badge, BottomSheet, Button, Callout, ChannelList, ChannelRail, Chip, Dialog, Feed, FormField, List, NavigationBar, Tab, TabBar, Tabs, Thumbnail) shipped as prebuilt ESM + CJS bundles with a sibling `styles.css`.
