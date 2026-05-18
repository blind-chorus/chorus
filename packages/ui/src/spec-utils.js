const RAW_RE = /^(\d+px|0|transparent|currentColor|none|auto|inherit|\d+%)$/i;

export function tokenToCss(value) {
  if (value == null) return null;
  if (typeof value !== 'string') return value;
  if (RAW_RE.test(value)) return value;
  if (value.startsWith('var(')) return value;
  return `var(--${value.replace(/\./g, '-')})`;
}

export function typoStyles(token) {
  if (!token) return {};
  const base = `--${token.replace(/\./g, '-')}`;
  return {
    fontSize: `var(${base}-size)`,
    fontWeight: `var(${base}-weight)`,
    lineHeight: `var(${base}-line)`,
    letterSpacing: `var(${base}-tracking)`,
  };
}

export function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ');
}
