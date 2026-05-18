'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.jsx';
import { useBodyScrollLock, usePortalTarget } from './internal/scrimPortal.js';
import { joinClasses } from './spec-utils.js';

export function Dialog({
  open,
  onClose,
  title,
  body,
  image,
  imageFirst = true,
  primaryAction,
  secondaryAction,
  inline = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const target = usePortalTarget();
  const cardRef = useRef(null);
  const lastFocusedRef = useRef(null);
  useBodyScrollLock(open && !inline);

  useEffect(() => {
    if (!open) return undefined;
    lastFocusedRef.current = document.activeElement;
    const primary = cardRef.current?.querySelector('.chorus-dialog__actions button');
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

  const imageEl = image ? (
    <img
      className="chorus-dialog__image"
      src={image.src}
      alt={image.alt ?? ''}
      width={image.width}
      height={image.height}
      decoding="async"
    />
  ) : null;

  const tree = (
    <div
      className={joinClasses('chorus-dialog__scrim', inline && 'chorus-dialog__scrim--inline', className)}
      role="presentation"
      onClick={() => onClose?.()}
    >
      <div
        ref={cardRef}
        className={joinClasses('chorus-dialog__card', image && 'chorus-dialog__card--with-image')}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {title ? <h2 className="chorus-dialog__title">{title}</h2> : null}
        {imageFirst ? imageEl : null}
        {body ? <p className="chorus-dialog__body">{body}</p> : null}
        {imageFirst ? null : imageEl}
        {primaryAction || secondaryAction ? (
          <div className="chorus-dialog__actions">
            {primaryAction ? (
              <Button appearance="primary" size="large" fullWidth onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button appearance="tertiary" size="large" fullWidth onClick={secondaryAction.onClick}>
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
