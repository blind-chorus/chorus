'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.jsx';
import { BackwardIcon } from './icons/index.js';
import { useBodyScrollLock, usePortalTarget } from './internal/scrimPortal.js';
import { joinClasses } from './spec-utils.js';

export function BottomSheet({
  open,
  onClose,
  title,
  body,
  children,
  primaryAction,
  secondaryAction,
  onBack,
  backLabel = 'Back',
  inline = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const target = usePortalTarget();
  const scrimRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);
  useBodyScrollLock(open && !inline);

  /* Mirror the virtual-keyboard height to the scrim as a bottom padding
     via --bottom-sheet-keyboard-inset. visualViewport shrinks when the
     keyboard opens; the inset translates the card up because the scrim
     uses align-items: flex-end. */
  useEffect(() => {
    if (!open || inline) return undefined;
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!vv) return undefined;
    const apply = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      scrimRef.current?.style.setProperty('--bottom-sheet-keyboard-inset', `${inset}px`);
    };
    apply();
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
    return () => {
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
    };
  }, [open, inline]);

  useEffect(() => {
    if (!open) return undefined;
    const el = contentRef.current;
    if (!el) return undefined;
    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of el.children) ro.observe(child);
    return () => ro.disconnect();
  }, [open, children]);

  useEffect(() => {
    if (!open) return undefined;
    lastFocusedRef.current = document.activeElement;
    const primary = cardRef.current?.querySelector('.chorus-bottom-sheet__actions button');
    primary?.focus();
    return () => {
      const last = lastFocusedRef.current;
      if (last && typeof last.focus === 'function') last.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  if (!inline && !target) return null;

  const tree = (
    <div
      ref={scrimRef}
      className={joinClasses('chorus-bottom-sheet__scrim', inline && 'chorus-bottom-sheet__scrim--inline', className)}
      role="presentation"
      onClick={() => onClose?.()}
    >
      <div
        ref={cardRef}
        className="chorus-bottom-sheet__card"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        <div className="chorus-bottom-sheet__handle" aria-hidden="true" />
        <div ref={contentRef} className="chorus-bottom-sheet__content">
          {title ? (
            onBack ? (
              <div className="chorus-bottom-sheet__title-row">
                <Button
                  variant="icon"
                  icon={<BackwardIcon />}
                  aria-label={backLabel}
                  onClick={onBack}
                />
                <h2 className="chorus-bottom-sheet__title">{title}</h2>
              </div>
            ) : (
              <h2 className="chorus-bottom-sheet__title">{title}</h2>
            )
          ) : null}
          {body ? <p className="chorus-bottom-sheet__body">{body}</p> : null}
          {children}
        </div>
        {primaryAction || secondaryAction ? (
          <div className={joinClasses('chorus-bottom-sheet__actions', overflowing && 'is-elevated')}>
            {primaryAction ? (
              <Button appearance="primary" size="large" fullWidth onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button appearance="secondary" size="large" fullWidth onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  return inline ? tree : createPortal(tree, target);
}
