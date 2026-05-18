export function Button({
  variant,
  block,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const classes = [
    'btn',
    variant === 'icon' && 'btn--icon',
    block && 'btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
