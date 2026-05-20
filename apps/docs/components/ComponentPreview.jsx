'use client';

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import { Button } from '@blind-dsai/ui';
import {
  CheckboxIcon,
  CheckboxFillIcon,
  DuplicateIcon,
  ExpandIcon,
} from '@blind-dsai/ui/icons';
import { PREVIEWS } from './previews';

/* Register only the languages the preview source uses — `javascript`
   is highlight.js's JSX-aware grammar (it cross-embeds `xml` for the
   tag soup, hence the second registration). Keeping the registry
   minimal so the docs bundle doesn't pull every grammar highlight.js
   ships. */
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

/* SSR has no DOM to measure against; collapse `useLayoutEffect` to a noop on
   the server so React doesn't warn. The measurement runs the moment we get
   to the client. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* Collapsed code panel height — six lines at the panel's body-sm rhythm.
   Long fence sources clip to this height behind a "Show more" / "Show less"
   toggle so the per-section preview frame stays scannable; short sources
   never trip the threshold and render the button hidden. */
const CODE_COLLAPSED_PX = 144;

function CodePanel({ code }) {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  /* Highlight once per source change. The `javascript` grammar handles
     JSX in highlight.js, so a single `hljs.highlight` call covers
     `import` keywords, string literals, JSX tag names, attribute names,
     and embedded expressions. The output ships pre-styled
     `<span class="hljs-*">` markers; the GitHub theme imported in
     `app/(site)/layout.jsx` paints them, with project-specific overrides
     in globals.css → `.component-preview-code .hljs-*`. */
  const highlighted = useMemo(
    () => hljs.highlight(code ?? '', { language: 'javascript' }).value,
    [code],
  );

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflows(el.scrollHeight > CODE_COLLAPSED_PX + 1);
  }, [code]);

  return (
    <div className={`component-preview-codepanel${expanded ? ' is-expanded' : ''}`}>
      <pre
        ref={ref}
        className="component-preview-code"
        style={!expanded && overflows ? { maxHeight: CODE_COLLAPSED_PX } : undefined}
      >
        <code className="hljs language-jsx" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      {overflows ? (
        <button
          type="button"
          className="component-preview-codepanel-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </div>
  );
}

/* Frame for a live specimen pulled from a markdown ` ```preview ` fence.
   Pattern follows Atlassian Design System's `/components/<name>/examples`:
   each example is a stage + a toolbar + the implementation source. The
   markdown carries the source verbatim so an agent reading the spec lands
   on the same code the docs render — see schema/components/README.md.

   Fence body format:

       <registry-id>
       ---
       <jsx source shown in the code panel>

   The id is the only contract between markdown and the docs registry; the
   source is shown for copy / reference and never re-evaluated, so the
   registry-rendered output is the source of truth for what the user sees.

   The component spec markdown carries the full contract (slots, sizes,
   variants, states, usage). This frame intentionally renders ONLY the live
   specimen + source — no token-resolution panel — so the docs page never
   duplicates what the spec text already states. */

/* The preview has no per-stage State dropdown. Forcing a state from a
   control conflicts with the specimen's own live interactivity (hover,
   press, focus all still work on the rendered control), so states are
   instead shown the way every other facet is — as their own cases. The
   pointer-driven states (`hovered`, `pressed`, …) are documented in each
   component's spec `## States` table and felt by interacting with the
   live specimen; `focused` (the accessibility ring) gets a dedicated
   `## Focused` demo section whose registry entry renders the control
   with `state="focused"`. The only toolbar control left is the Size
   dropdown for components with a size axis. */

/* Toolbar dropdown — Filter-chip trigger + custom listbox popover. The
   native `<select>` was replaced because its option list is drawn by the
   OS, so it could not be themed with Chorus tokens (the popup never
   matched surface / outline / typography). The trigger is a real button
   carrying the chip's CSS classes (so chip `:hover` / `:focus-visible`
   rules apply unchanged); the popover is a token-driven `<ul role="listbox">`
   positioned below the trigger with keyboard nav, outside-click dismissal,
   and focus restoration. */
function ToolbarSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const currentIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[currentIndex];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(currentIndex);
    menuRef.current?.focus();
  }, [open, currentIndex]);

  /* Anchor the portaled popover to the trigger's current viewport
     position. Recomputed on resize / scroll so the menu tracks the
     trigger if the page reflows while open. We portal to <body> instead
     of nesting inside the preview frame because the frame carries
     `overflow: hidden` (for rounded-corner clipping) and its own
     stacking context, both of which would clip / trap the popover. */
  useLayoutEffect(() => {
    if (!open) return;
    function compute() {
      const t = triggerRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      setCoords({ top: r.bottom + window.scrollY, left: r.left + window.scrollX });
    }
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDocPointer(e) {
      if (triggerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onDocPointer);
    return () => document.removeEventListener('mousedown', onDocPointer);
  }, [open]);

  function commit(idx) {
    const next = options[idx];
    if (!next) return;
    onChange(next.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((v) => !v);
    }
  }

  function onMenuKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(activeIndex);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <span className="component-preview-dropdown">
      <Button
        ref={triggerRef}
        variant="text"
        size="xsmall"
        appearance="secondary"
        trailingIcon={<ExpandIcon />}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
      >
        {current?.label ?? 'Size'}
      </Button>
      {open && coords && typeof document !== 'undefined'
        ? createPortal(
            <ul
              ref={menuRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              className="component-preview-dropdown-menu"
              aria-activedescendant={`${listboxId}-opt-${activeIndex}`}
              style={{ top: coords.top, left: coords.left }}
              onKeyDown={onMenuKeyDown}
            >
              {options.map((o, idx) => (
                <li
                  key={o.value}
                  id={`${listboxId}-opt-${idx}`}
                  role="option"
                  aria-selected={o.value === value}
                  data-active={idx === activeIndex || undefined}
                  className="component-preview-dropdown-option"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => commit(idx)}
                >
                  {o.label}
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </span>
  );
}

function parseFence(body) {
  const text = String(body ?? '').replace(/\n+$/, '');
  const sepIdx = text.indexOf('\n---');
  if (sepIdx === -1) {
    return { id: text.trim(), code: '' };
  }
  const id = text.slice(0, sepIdx).trim();
  const code = text.slice(sepIdx + 4).replace(/^\n+/, '').replace(/\n+$/, '');
  return { id, code };
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function ComponentPreview({ body }) {
  const { id, code } = parseFence(body);
  const entry = PREVIEWS[id];

  /* Registry entries are either a render function (no per-stage size axis)
     or `{ render, sizes, supportsDisabled }` — `sizes` surfaces a Size
     dropdown (threaded into render props as `size`), `supportsDisabled`
     surfaces a Disabled checkbox (threaded as `disabled`). Sizes array must
     be ordered largest → smallest (project-wide size-menu convention). */
  const Render = typeof entry === 'function' ? entry : entry?.render;
  const sizes = typeof entry === 'function' ? null : entry?.sizes ?? null;
  const supportsDisabled = typeof entry === 'object' && entry?.supportsDisabled === true;

  const [size, setSize] = useState(sizes?.[0] ?? null);
  const [disabled, setDisabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transparentBg, setTransparentBg] = useState(true);

  if (!Render) {
    return (
      <div className="component-preview component-preview--missing" role="alert">
        Missing preview: <code>{id || '(empty)'}</code>
      </div>
    );
  }

  function copy() {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      },
      () => {},
    );
  }

  return (
    <div className="component-preview">
      <div
        className="component-preview-stage"
        data-bg={transparentBg ? 'transparent' : 'surface'}
      >
        <Render size={size ?? undefined} disabled={supportsDisabled ? disabled : undefined} />
      </div>
      <div className="component-preview-toolbar">
        {/* Stage background toggle — Check Button xsmall, the canonical
            option-toggle form. The component renders its own checkbox
            glyph based on `checked`; the stage uses surface fill when
            checked and transparent when unchecked. Lives in the toolbar
            so the stage area stays free of overlay chrome and every
            preview affordance reads from the same row. */}
        <Button
          variant="check"
          size="small"
          checked={!transparentBg}
          onClick={() => setTransparentBg((v) => !v)}
        >
          Background
        </Button>
        {sizes ? (
          <ToolbarSelect
            value={size}
            onChange={setSize}
            options={sizes.map((s) => ({ value: s, label: capitalize(s) }))}
          />
        ) : null}
        {supportsDisabled ? (
          /* Disabled toggle — Text Button xsmall with a leading checkbox
             glyph that flips fill → unfilled with the toggled state. The
             button itself is the toggle target; clicking it flips `disabled`
             and the specimen above re-renders. `aria-pressed` exposes the
             toggle semantics to AT (button-pressed is the right pattern for
             an on/off action that mutates the preview rather than committing
             a value into a form). */
          <Button
            variant="text"
            size="xsmall"
            appearance="secondary"
            leadingIcon={disabled ? <CheckboxFillIcon /> : <CheckboxIcon />}
            aria-pressed={disabled}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </Button>
        ) : null}
        {/* Copy action — Text Button xsmall with the Duplicate glyph.
            The label stays "Copy code" on press; success is announced by a
            transient tooltip below the button rather than a label flip, so
            the button's footprint never reflows mid-toolbar. The tooltip is
            keyed on `copied` so each press re-mounts the element and
            restarts the fade animation, even when the user copies
            repeatedly within the timeout window. */}
        <span className="component-preview-action-wrap">
          <Button
            variant="text"
            size="xsmall"
            appearance="secondary"
            leadingIcon={<DuplicateIcon />}
            onClick={copy}
            disabled={!code}
            aria-describedby={copied ? 'component-preview-copied' : undefined}
          >
            Copy code
          </Button>
          {copied ? (
            <span
              key={String(copied)}
              id="component-preview-copied"
              role="status"
              className="component-preview-action-tooltip"
            >
              Copied
            </span>
          ) : null}
        </span>
      </div>
      {code ? <CodePanel code={code} /> : null}
    </div>
  );
}
