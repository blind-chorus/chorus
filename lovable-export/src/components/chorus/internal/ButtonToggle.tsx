// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import { Chip } from '../Chip';

/* Toggle Button is a reversible-commit button whose visual chrome is the
   Toolbar Button / Filter capsule with a different container/label pair
   on each side of the toggle (primary fill when urging, surface+hairline
   when committed). The DOM and CSS-var machinery are identical to Chip's
   selectionStates branch, so we delegate verbatim and just rename the
   public boolean from `selected` (chip selection) to `active` (action
   committed). aria-pressed is set inside Chip when variant === 'toggle'. */
export function ButtonToggle({ active = false, ...rest }) {
  return <Chip variant="toggle" selected={active} {...rest} />;
}
