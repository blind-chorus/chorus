import { joinClasses } from './spec-utils.js';

/* Banner — a self-contained block that explains a feature, capability,
   or piece of content sitting *within* the body flow but visually
   separated from it. Two appearances: `default` (low-key surface
   variant — the canonical aside) and `accent` (primary-tinted, eye-
   catching). Optional action slot renders as an inline link below the
   body. */
export function Banner({
  appearance = 'default',
  icon,
  thumbnail,
  action,
  children,
  className,
  ...rest
}) {
  return (
    <div
      className={joinClasses('chorus-banner', `chorus-banner--${appearance}`, className)}
      role="note"
      {...rest}
    >
      {thumbnail ? (
        <span className="chorus-banner__thumbnail" aria-hidden="true">{thumbnail}</span>
      ) : null}
      {!thumbnail && icon ? (
        <span className="chorus-banner__icon" aria-hidden="true">{icon}</span>
      ) : null}
      <div className="chorus-banner__content">
        {children ? <p className="chorus-banner__body">{children}</p> : null}
        {action ? (
          <a
            className="chorus-banner__action"
            href={action.href}
            onClick={action.onClick}
          >
            {action.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}
