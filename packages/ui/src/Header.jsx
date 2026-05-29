'use client';

import { Button } from './Button.jsx';
import { ChevronDownIcon, ChevronUpIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';

/* Header — labelled section heading + an optional trailing affordance.
   Two sizes (label typography axis):
     - large  (default): heading-md (20 Semibold) — section heading used
                         by Section and other top-level page regions
     - medium:           heading-sm (16 Semibold) — denser host surfaces
                         (in-sheet sub-section, bounded card, drawer
                         column heading)

   Three trailing modes (mutually exclusive):
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
     3. `headerDropdown` → trailing Text Button dropdown (size="xsmall",
                           default appearance) whose label IS the current
                           selected value and whose trailing chevron flips
                           with `open` as a state signal — the canonical
                           "Sort by", "Filter", "Range" disclosure pattern
                           described in schema/components/button/text.md
                           §Dropdown. Consumer owns the menu surface and
                           the `open` state; Header only renders the
                           trigger.

   When none of label / headerAction / trailingIcon / headerDropdown is
   set the component renders nothing (no empty container). When only
   `label` is set the row collapses to a single heading with no trailing
   slot — the canonical "labelled region without affordance" case. */
export function Header({
  size = 'large',
  label,
  headerAction,
  trailingIcon,
  headerDropdown,
  onClick,
  href,
  as: Tag = 'header',
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  if (!label && !headerAction && !trailingIcon && !headerDropdown) return null;

  const useIconMode = !!trailingIcon;
  const useDropdownMode = !useIconMode && !headerAction && !!headerDropdown;
  const iconNode =
    trailingIcon === true || trailingIcon === undefined ? (
      <ChevronDownIcon size={16} />
    ) : (
      trailingIcon
    );
  const dropdownOpen = !!headerDropdown?.open;

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
      ) : useDropdownMode ? (
        <Button
          variant="text"
          size="xsmall"
          className="chorus-header__dropdown"
          trailingIcon={dropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          aria-haspopup={headerDropdown['aria-haspopup'] ?? 'listbox'}
          aria-expanded={dropdownOpen}
          aria-controls={headerDropdown['aria-controls']}
          onClick={headerDropdown.onClick}
        >
          {headerDropdown.label}
        </Button>
      ) : null}
    </Tag>
  );
}
