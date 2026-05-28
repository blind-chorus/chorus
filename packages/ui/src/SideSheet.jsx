'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock, usePortalTarget } from './internal/scrimPortal.js';
import { joinClasses } from './spec-utils.js';

/* SideSheet — off-canvas content column anchored to the leading or
   trailing edge of the viewport. Pairs with BottomSheet as the "Sheet"
   family's other anchor: BottomSheet for committed-sheet flows, SideSheet
   for off-canvas navigation columns, settings panes, channel directories.

   Composition is free-form via `children` — the canonical fill is a
   Header (size="medium") column heading + an embedded `<List
   variant="entry">` directory stack (40 avatar + label + inline count
   Badge + optional trailing icon toggle), optionally followed by
   another Header + List(entry) pair and a pinned footer action.

   Like BottomSheet: renders into a body portal when open, locks body
   scroll, returns focus to the trigger on close, and dismisses on
   Escape / backdrop tap.

   `inline` mode renders the sheet inside its parent layout (no portal,
   no fixed positioning, no body lock) — for docs previews that need to
   show the sheet card without occluding the page. */
export function SideSheet({
  open,
  onClose,
  anchor = 'left',
  width = 320,
  footer,
  children,
  inline = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const target = usePortalTarget();
  const scrimRef = useRef(null);
  const cardRef = useRef(null);
  const lastFocusedRef = useRef(null);
  useBodyScrollLock(open && !inline);

  useEffect(() => {
    if (!open || inline) return undefined;
    lastFocusedRef.current = document.activeElement;
    const focusable = cardRef.current?.querySelector(
      'button, a[href], [tabindex]:not([tabindex="-1"]), input:not([disabled])',
    );
    focusable?.focus?.();
    return () => {
      const last = lastFocusedRef.current;
      if (last && typeof last.focus === 'function') last.focus();
    };
  }, [open, inline]);

  useEffect(() => {
    if (!open || inline) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, inline, onClose]);

  if (!open) return null;
  if (!inline && !target) return null;

  const onScrimClick = (e) => {
    if (e.target === scrimRef.current) onClose?.();
  };

  const tree = (
    <div
      ref={scrimRef}
      className={joinClasses(
        'chorus-side-sheet__scrim',
        inline && 'chorus-side-sheet__scrim--inline',
        className,
      )}
      data-anchor={anchor}
      onClick={inline ? undefined : onScrimClick}
      {...rest}
    >
      <aside
        ref={cardRef}
        className="chorus-side-sheet__card"
        role="dialog"
        aria-modal={inline ? undefined : 'true'}
        aria-label={ariaLabel}
        style={{ '--side-sheet-width': typeof width === 'number' ? `${width}px` : width }}
      >
        <div className="chorus-side-sheet__body">{children}</div>
        {footer ? (
          <footer className="chorus-side-sheet__footer">{footer}</footer>
        ) : null}
      </aside>
    </div>
  );

  return inline ? tree : createPortal(tree, target);
}

/* SideSheetGroup — Header + List bundling primitive. Wrap each
   column section so the Header sits 16px (`layout.stack.md`) above
   its List, while groups themselves stack with the body's 24px
   (`layout.stack.lg`) rhythm. The grouping makes "header + items"
   read as one unit and the inter-group rhythm read as a divider. */
export function SideSheetGroup({ children, className, ...rest }) {
  return (
    <div className={joinClasses('chorus-side-sheet__group', className)} {...rest}>
      {children}
    </div>
  );
}
