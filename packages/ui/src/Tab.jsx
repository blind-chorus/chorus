'use client';

import { useEffect } from 'react';
import { useTabsContext } from './internal/TabsContext.js';
import { joinClasses } from './spec-utils.js';

const FORCEABLE_STATES = new Set(['hovered', 'pressed', 'focused']);

export function Tab({
  value: tabValue,
  state,
  leadingIcon,
  disabled = false,
  className,
  children,
  onClick,
  ...rest
}) {
  const { variant, value: activeValue, onChange, registerTab } = useTabsContext();
  const selected = activeValue === tabValue;
  const isDisabled = disabled || state === 'disabled';
  const forcedState = FORCEABLE_STATES.has(state) ? state : null;

  useEffect(() => {
    if (tabValue == null) return undefined;
    return registerTab(tabValue);
  }, [tabValue, registerTab]);

  const handleClick = (e) => {
    onClick?.(e);
    if (!e.defaultPrevented && !isDisabled) onChange(tabValue);
  };

  /* Segmented and Rounded tabs delegate their visual chrome to Filter
     chip — same `chorus-chip chorus-chip--filter` classes, same selected
     state CSS, same hover/pressed/focus overlays. Rounded additionally
     carries `chorus-chip--rounded` which overrides only `--chip-radius`
     (from full → md). Single-select is enforced by the Tabs context
     (only the segment whose `value` matches the active one gets
     `is-selected`), not by a chip-level toggle. Underline tabs keep
     their own `chorus-tab--underline` chrome and the sliding indicator. */
  const isChipBased = variant === 'segmented' || variant === 'rounded';
  const baseClass = isChipBased ? 'chorus-chip' : 'chorus-tab';
  const subClass = isChipBased ? 'chorus-chip--filter' : `chorus-tab--${variant}`;
  const radiusModClass = variant === 'rounded' ? 'chorus-chip--rounded' : null;
  const labelClass = isChipBased ? 'chorus-chip__label' : 'chorus-tab__label';
  const iconClass = isChipBased ? 'chorus-chip__icon' : 'chorus-tab__icon';

  const className_ = joinClasses(
    baseClass,
    subClass,
    radiusModClass,
    selected && 'is-selected',
    className,
  );

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={className_}
      disabled={isDisabled}
      data-force-state={forcedState ?? undefined}
      onClick={handleClick}
      {...rest}
    >
      {leadingIcon ? (
        <span className={iconClass} aria-hidden="true">{leadingIcon}</span>
      ) : null}
      {children ? <span className={labelClass}>{children}</span> : null}
    </button>
  );
}
