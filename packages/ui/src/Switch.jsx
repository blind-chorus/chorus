'use client';

import { useRef, useState } from 'react';
import { joinClasses } from './spec-utils.js';

/* Switch — binary on/off control. Pill-shaped track with a circular
   thumb that translates between the two ends. Selected state paints
   the track in `primary` so the on/off contract reads chromatically
   without a label. See schema/components/switch/switch.md. */

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  forcedState,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  const isControlled = checked != null;
  const [internal, setInternal] = useState(defaultChecked);
  const value = isControlled ? checked : internal;
  const ref = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next, e);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-state={value ? 'on' : 'off'}
      data-force-state={forcedState ?? undefined}
      data-disabled={disabled ? 'true' : undefined}
      disabled={disabled}
      className={joinClasses('chorus-switch', className)}
      onClick={handleClick}
      {...rest}
    >
      <span className="chorus-switch__thumb" aria-hidden="true" />
    </button>
  );
}
