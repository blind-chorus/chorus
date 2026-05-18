'use client';

import { createContext, useContext, useMemo } from 'react';

/* Token chip prefix trimming.

   Tables across the docs reference design tokens by their fully-qualified
   names (`sys.color.primary`, `$sys.layout.container.md`, `ref.space.500`).
   Within a single scope — a column of a sem-table, the contents of a
   single cell, the rows of a foundation table — the namespace prefix is
   repeated and adds no information past the column header. Trim the
   shared dot-prefix at render time so the visible chip reads `primary`
   while the chip's `data-token` still carries the canonical full name
   (the contract every downstream consumer reads).

   Activation rules:
     - Every token in scope matches `^\$?(?:sys|ref|comp)\.[\w.]+$`.
     - All tokens in scope share the same first segment (no cross-tier
       mix like `sys.* + ref.*`).
     - The longest common dot-bounded prefix leaves at least one segment
       as the display.
     - The optional leading `$` is preserved on display (foundation
       tables use `$sys.color.primary` as a typed-chip convention; the
       `$` is part of the visible chip, not the resolvable path).

   Two consumption paths:

     - <TokenTrimScope tokens={[...]}>{...}</TokenTrimScope>
         Wrap any JSX subtree; the explicit `tokens` array seeds a
         single-scope trim map. Used by the foundation-table renderers
         in `sections.jsx` and any caller that knows its tokens
         declaratively.

     - <TokenTrimContext.Provider value={multiScopeMap}>{...}
         Direct context use for callers that compose a map from multiple
         scopes (e.g. ComponentMd builds a column-level + cell-level
         map from the markdown AST). */

const TokenTrimContext = createContext(null);
export { TokenTrimContext };

const TOKEN_RE = /^\$?(?:sys|ref|comp)\.[\w.]+$/;

function normalize(t) {
  return t.startsWith('$') ? t.slice(1) : t;
}
function isToken(t) {
  return TOKEN_RE.test(t);
}

function longestCommonDotPrefix(strs) {
  if (strs.length < 2) return '';
  const segs = strs.map((s) => normalize(s).split('.'));
  const min = Math.min(...segs.map((s) => s.length));
  let common = 0;
  // Leave at least one segment as the display tail.
  for (let i = 0; i < min - 1; i++) {
    const head = segs[0][i];
    if (segs.every((s) => s[i] === head)) common++;
    else break;
  }
  if (common === 0) return '';
  return segs[0].slice(0, common).join('.') + '.';
}

/* Build a trim map for a single scope (one array of tokens).
   Returns null if the scope doesn't qualify. */
export function trimForScope(tokens) {
  const valid = tokens.filter(isToken);
  if (valid.length < 2) return null;
  const tiers = new Set(valid.map((t) => normalize(t).split('.', 1)[0]));
  if (tiers.size > 1) return null;
  const prefix = longestCommonDotPrefix(valid);
  if (!prefix) return null;
  const map = new Map();
  for (const t of valid) {
    const stripped = normalize(t).slice(prefix.length);
    if (!stripped) continue;
    const display = t.startsWith('$') ? `$${stripped}` : stripped;
    map.set(t, display);
  }
  return map;
}

/* Merge multiple scopes into a single trim map.
   When the same token appears in more than one scope, the entry whose
   display string is shortest wins (more aggressive trim — happens
   when a cell-level scope contains tokens that share more prefix than
   the surrounding column does). */
export function buildTrimMapFromScopes(scopes) {
  const out = new Map();
  for (const tokens of scopes) {
    const m = trimForScope(tokens);
    if (!m) continue;
    for (const [k, v] of m) {
      const cur = out.get(k);
      if (!cur || v.length < cur.length) out.set(k, v);
    }
  }
  return out.size > 0 ? out : null;
}

export function TokenTrimScope({ tokens, children }) {
  const map = useMemo(() => {
    const list = Array.isArray(tokens) ? tokens : [];
    return trimForScope(list);
  }, [tokens]);
  return <TokenTrimContext.Provider value={map}>{children}</TokenTrimContext.Provider>;
}

export function TokenChip({ children, className }) {
  const trimMap = useContext(TokenTrimContext);
  const raw = typeof children === 'string'
    ? children
    : Array.isArray(children)
      ? children.map((c) => (typeof c === 'string' ? c : '')).join('')
      : '';
  const key = raw.trim();
  const trimmed = trimMap?.get(key);
  const cls = className ? `token-chip ${className}` : 'token-chip';
  if (trimmed) {
    return <code className={cls} data-token={key} title={key}>{trimmed}</code>;
  }
  return <code className={cls}>{children}</code>;
}
