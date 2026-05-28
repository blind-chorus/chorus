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
     2. `trailingIcon`   → trailing Icon Button (Button `variant="icon"`,
                           `size="medium"` — 32 × 32 around a 16px glyph),
                           canonical drill-in chevron. The Icon Button is
                           its own tap target — the surrounding `<header>`
                           stays non-interactive. Pass `trailingIcon` as
                           a boolean to get the default chevron-right
                           glyph, or as a node to override.
                           Supply `aria-label` (e.g. `"Open all"`) so
                           the icon-only button has a screen-reader name.

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
  'aria-label': ariaLabel,
  ...rest
}) {
  if (!label && !headerAction && !trailingIcon) return null;

  const useIconMode = !!trailingIcon;
  const iconNode =
    trailingIcon === true || trailingIcon === undefined ? (
      <ChevronDownIcon size={16} />
    ) : (
      trailingIcon
    );

  return (
    <Tag
      className={joinClasses('chorus-header', className)}
      data-size={size}
      {...rest}
    >
      {label ? <h3 className="chorus-header__label">{label}</h3> : <span />}
      {useIconMode ? (
        <Button
          variant="icon"
          size="medium"
          className="chorus-header__icon chorus-header__icon--chevron"
          icon={iconNode}
          aria-label={ariaLabel ?? (typeof label === 'string' ? `Open ${label}` : 'Open')}
          onClick={onClick}
          {...(href ? { as: 'a', href } : null)}
        />
      ) : headerAction ? (
        <Button
          variant="text"
          size="xsmall"
          appearance="accent"
          className="chorus-header__action"
          href={headerAction.href ?? '#'}
          onClick={headerAction.onClick}
          leadingIcon={headerAction.leadingIcon}
          trailingIcon={headerAction.trailingIcon}
        >
          {headerAction.label}
        </Button>
      ) : null}
    </Tag>
  );
}
