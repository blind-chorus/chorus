/* Lightweight icon glyphs used by spec previews. Inline SVG so they inherit
   `currentColor` from the parent (the button's text color) and resize via
   the `.spec-button-icon` rules in globals.css, which bind width/height to
   the active size's `sys.icon.*` token. Add new glyphs here as previews
   need them — keep the path data hand-rolled and minimal. */

const icons = {
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12l5 5L20 7',
  close: 'M6 6l12 12M18 6L6 18',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3.5 2',
  fire: 'M12 3c1 4 4 5 4 9a4 4 0 1 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-2-5 0-8z',
  heart: 'M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11z',
  star: 'M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9z',
  bookmark: 'M6 4h12v17l-6-4-6 4z',
  back: 'M15 6l-6 6 6 6',
  chat: 'M4 5h16v11H8l-4 4z',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
};

export function SpecIcon({ name = 'plus' }) {
  const d = icons[name] ?? icons.plus;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
