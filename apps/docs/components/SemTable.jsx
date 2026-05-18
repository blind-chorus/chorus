'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* SemTable — the canonical docs-table chrome.

   Three nested layers:

     .sem-table              wrapper, position: relative; hosts the
                             custom scrollbar overlay.
     .sem-table-scroll       horizontal scroll container; hides native
                             scrollbar so the custom one is the single
                             source of truth (visible + interactive).
     .sem-table-grid         the actual grid that lays out rows; subgrid
                             rows align across head + body.

   The scrollbar lives at the wrapper level so it can be sticky-positioned
   relative to the page viewport (always reachable while a tall table is
   in view) instead of sticking to the table's own bottom edge — and so
   pointer-drag interactions don't fight with the scroll container.

   Variants (`role-table`, `equal-cols`) only change the grid template;
   the scroll + scrollbar chrome is identical. */

export function SemTable({ className, children, style }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [thumb, setThumb] = useState({ visible: false, leftPct: 0, widthPct: 100 });
  const dragRef = useRef(null);

  // Sync thumb size + position to the scroll container's geometry. Runs on
  // scroll, on element resize, and on layout-affecting state changes.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const overflow = scrollWidth - clientWidth;
      if (overflow <= 1) {
        setThumb({ visible: false, leftPct: 0, widthPct: 100 });
        return;
      }
      const widthPct = Math.max(8, (clientWidth / scrollWidth) * 100);
      const leftPct = (scrollLeft / overflow) * (100 - widthPct);
      setThumb({ visible: true, leftPct, widthPct });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  // Drag-to-scroll: thumb pointerdown captures, pointermove maps the
  // pointer's track-relative position back to the scroll container's
  // scrollLeft so the table follows the cursor.
  const onThumbPointerDown = (e) => {
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!scroll || !track) return;
    e.preventDefault();
    e.target.setPointerCapture?.(e.pointerId);
    const trackRect = track.getBoundingClientRect();
    const thumbWidth = (thumb.widthPct / 100) * trackRect.width;
    const startX = e.clientX;
    const startScroll = scroll.scrollLeft;
    const overflow = scroll.scrollWidth - scroll.clientWidth;
    const trackRange = trackRect.width - thumbWidth;
    dragRef.current = { startX, startScroll, overflow, trackRange };
  };
  const onThumbPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const ratio = d.trackRange > 0 ? dx / d.trackRange : 0;
    scrollRef.current.scrollLeft = d.startScroll + ratio * d.overflow;
  };
  const onThumbPointerUp = (e) => {
    if (!dragRef.current) return;
    e.target.releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
  };

  // Click on track (outside thumb) → page-scroll one viewport in that
  // direction, matching native scrollbar click-track behavior.
  const onTrackPointerDown = (e) => {
    if (e.target !== trackRef.current) return; // ignore thumb hits
    const scroll = scrollRef.current;
    const trackRect = trackRef.current.getBoundingClientRect();
    const clickRatio = (e.clientX - trackRect.left) / trackRect.width;
    const target = clickRatio * scroll.scrollWidth - scroll.clientWidth / 2;
    scroll.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <div className={`sem-table${className ? ` ${className}` : ''}`} style={style}>
      <div className="sem-table-scroll" ref={scrollRef}>
        <div className="sem-table-grid">{children}</div>
      </div>
      <div
        className="sem-table-scrollbar"
        data-visible={thumb.visible || undefined}
        ref={trackRef}
        onPointerDown={onTrackPointerDown}
      >
        <div
          className="sem-table-scrollbar-thumb"
          style={{ left: `${thumb.leftPct}%`, width: `${thumb.widthPct}%` }}
          onPointerDown={onThumbPointerDown}
          onPointerMove={onThumbPointerMove}
          onPointerUp={onThumbPointerUp}
          onPointerCancel={onThumbPointerUp}
        />
      </div>
    </div>
  );
}
