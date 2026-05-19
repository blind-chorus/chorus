'use client';

import { useEffect, useRef, useState } from 'react';
import { Toast } from '@blind-dsai/ui';

/* Global click handler for `.token-chip` elements.

   Every token reference in the docs renders as `<code class="token-chip">`
   or `<span class="token-chip">` — there are hundreds across the color,
   spacing, typography, etc. pages. Rather than convert each call site to
   a per-chip onClick, a single delegated handler on `document` covers them
   all (including chips emitted by the markdown renderer for component
   specs, which we don't author per-page).

   On click the handler grabs the chip's text content, writes it to the
   clipboard, and toggles `data-copied="true"` for ~1.2s so the CSS can
   show a transient confirmation state without per-chip React state. */
export function TokenChipCopy() {
  // Single-slot toast — visible after the last successful copy, hides on
  // its own timer. `nonce` flips on every copy so a rapid second copy
  // re-triggers the show animation even when the toast is already up.
  const [toast, setToast] = useState({ visible: false, nonce: 0 });
  const hideTimer = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      const chip = e.target.closest('.token-chip');
      if (!chip) return;
      // Some chips are inside an <a> (e.g. DESIGN.md anchor links). Don't
      // swallow navigation clicks; only intercept when the chip itself is
      // the click target.
      if (chip.closest('a[href]')) return;
      // Prefer `data-token` when present — the markdown renderer trims
      // shared namespace prefixes off chips inside tables for visual
      // density and stashes the full token name in this attribute so
      // copy still lands the canonical reference.
      const text = chip.dataset.token || chip.textContent?.trim();
      if (!text) return;
      const flash = () => {
        chip.setAttribute('data-copied', 'true');
        setTimeout(() => chip.removeAttribute('data-copied'), 1200);
        setToast((prev) => ({ visible: true, nonce: prev.nonce + 1 }));
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));
        }, 1600);
      };
      const fallback = () => {
        // Legacy path for non-secure contexts / browsers without async
        // Clipboard API. A hidden textarea + execCommand keeps the
        // copy gesture working on http previews and older Safari.
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); flash(); } catch {}
        ta.remove();
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(flash, fallback);
      } else {
        fallback();
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /* The toast itself is the canonical `Toast` component — same inverse
     pair, radius, padding, min-height, and elevation as every other
     Toast on the docs site. The anchor wrapper owns only the things
     Toast leaves to the host: fixed bottom-center position, the 8-token
     safe area, the fade / slide enter+exit transition, and the
     `pointer-events: none` rule so the toast never blocks chips. */
  return (
    <div
      className="token-copy-toast-anchor"
      data-visible={toast.visible || undefined}
    >
      <Toast>Copied to clipboard</Toast>
    </div>
  );
}
