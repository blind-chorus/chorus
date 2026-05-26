'use client';

import { joinClasses } from './spec-utils.js';

/* StatusTag — small inline status pill. Tonal label-style chrome at
   10px text, 4px inline / 2px block padding, `sys.radius.xs` corners.
   Two appearances:
     - neutral  : `surfaceContainerHighest` fill + `onSurfaceVariant`
                  foreground — the quiet, informational default
                  ("pending", "draft", "queued").
     - error    : `errorContainer` fill + `onErrorContainer` foreground
                  — the rejection / blocked state ("rejected", "failed").
   Decorative (`<span role="status">`) — never an interactive element.
   See schema/components/status-tag/status-tag.md. */

export function StatusTag({
  appearance = 'neutral',
  children,
  className,
  ...rest
}) {
  return (
    <span
      role="status"
      className={joinClasses(
        'chorus-status-tag',
        `chorus-status-tag--${appearance}`,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
