export { Badge } from './Badge.jsx';
export { Banner } from './Banner.jsx';
export { BottomSheet } from './BottomSheet.jsx';
export { Button } from './Button.jsx';
export { SuggestionList } from './SuggestionList.jsx';
export { AvatarRail } from './AvatarRail.jsx';
// Deprecated aliases — historical names. Prefer SuggestionList / AvatarRail.
export { SuggestionList as ChannelList } from './SuggestionList.jsx';
export { AvatarRail as ChannelRail } from './AvatarRail.jsx';
export { Chip } from './Chip.jsx';
export { Dialog } from './Dialog.jsx';
export { Tabs } from './Tabs.jsx';
export { Tab } from './Tab.jsx';
export { Byline } from './Byline.jsx';
export { Feed, FeedGroup } from './Feed.jsx';
export { FeedAd } from './FeedAd.jsx';
export { PostCarousel } from './PostCarousel.jsx';
export { ProfileCarousel } from './ProfileCarousel.jsx';
export { ProfileHeader } from './ProfileHeader.jsx';
export { FormField, FormFieldGroup, Input, SearchBar, Select, Textarea } from './FormField.jsx';
export { Header } from './Header.jsx';
export { List } from './List.jsx';
export { NavCard, NavCardGroup } from './NavCard.jsx';
export { NavigationBar } from './NavigationBar.jsx';
export { Progress } from './Progress.jsx';
export { Section } from './Section.jsx';
export { SideSheet, SideSheetGroup } from './SideSheet.jsx';
export { Skeleton, SkeletonGroup } from './Skeleton.jsx';
export { StatusTag } from './StatusTag.jsx';
export { Switch } from './Switch.jsx';
export { Accordion } from './Accordion.jsx';
export { TabBar } from './TabBar.jsx';
export { Thumbnail } from './Thumbnail.jsx';
export { Toast } from './Toast.jsx';
export { Tooltip } from './Tooltip.jsx';

// shadcn / Material naming aliases — same runtime components under the
// names AI consumers and external designers most often reach for.
// Each alias is declared in its source spec.json via `exportAlias`,
// which is what the typed-surface generator consumes.
export { BottomSheet as Sheet } from './BottomSheet.jsx';
export { BottomSheet as Drawer } from './BottomSheet.jsx';
export { SideSheet as SideDrawer } from './SideSheet.jsx';
export { Banner as Alert } from './Banner.jsx';
export { Thumbnail as Avatar } from './Thumbnail.jsx';
export { NavigationBar as AppBar } from './NavigationBar.jsx';
export { TabBar as BottomNav } from './TabBar.jsx';

// Lovable / shadcn `<Badge variant="…">` (a text pill — "Pro", "New",
// "Beta") and Chorus `Badge` (a numeric / dot count marker) share a
// name but not an intent. The mapping lives in `schema/catalog.md`
// (Compact controls section): Lovable text-pill intent → Chorus
// `StatusTag`. A direct `Badge` alias would shadow the existing count
// marker and break every consumer that imports Badge today, so the
// translation lives in the catalog instead of in the exports.
