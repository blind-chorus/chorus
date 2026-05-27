'use client';

import { Button } from './Button.jsx';
import { ChevronDownIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';

/* Header — labelled section heading + an optional trailing affordance.
   Two sizes (label typography axis):
     - large  (default): heading-md (20 Semibold) — section heading used
                         by Section and other top-level page regions
     - medium:           heading-sm (16 Semibold) — denser host surfaces
                         (in-sheet sub-section, bounded card, drawer
                         column heading)

   Two trailing modes (mutually exclusive):
     1. `headerAction`   → Text Button at `size="xsmall"`, `appearance="accent"`
                           ("See all" / "+ Create channel" / etc).
                           The label-affordance rule keeps navigational
                           intent in the accent tone.
     2. `trailingIcon`   → 16px decorative icon (canonical: a chevron
                           drill-in cue). When `trailingIcon` is set,
                           the WHOLE header becomes the tap target via
                           `onClick` / `href` — same contract as list/nav
                           rows. Pass `trailingIcon` as a boolean to get
                           the default chevron, or as a node to override
                           the glyph.

   When neither label nor a trailing affordance is set the component
   renders nothing (no empty container). */
export function Header({
  size = 'large',
  label,
  headerAction,
  trailingIcon,
  onClick,
  href,
  as: Tag = 'header',
  className,
  ...rest
}) {
  if (!label && !headerAction && !trailingIcon) return null;

  const useIconMode = !!trailingIcon;
  const isInteractive = useIconMode && Boolean(onClick || href);
  const RootTag = isInteractive ? (href ? 'a' : 'button') : Tag;
  const rootProps = isInteractive
    ? {
        type: href ? undefined : 'button',
        href: href,
        onClick,
      }
    : {};
  const iconNode =
    trailingIcon === true || trailingIcon === undefined ? (
      <ChevronDownIcon size={16} />
    ) : (
      trailingIcon
    );

  return (
    <RootTag
      className={joinClasses('chorus-header', className)}
      data-size={size}
      data-interactive={isInteractive ? 'true' : undefined}
      {...rootProps}
      {...rest}
    >
      {label ? <h3 className="chorus-header__label">{label}</h3> : <span />}
      {useIconMode ? (
        <span className="chorus-header__icon chorus-header__icon--chevron" aria-hidden="true">
          {iconNode}
        </span>
      ) : headerAction ? (
        <Button
          variant="text"
          size="xsmall"
          appearance="accent"
          className="chorus-header__action"
          href={headerAction.href ?? '#'}
          onClick={headerAction.onClick}
        >
          {headerAction.label}
        </Button>
      ) : null}
    </RootTag>
  );
}
