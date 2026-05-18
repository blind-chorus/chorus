import { joinClasses } from './spec-utils.js';

/* Callout — a self-contained block that explains a feature, capability,
   or piece of content sitting *within* the body flow but visually
   separated from it. Two appearances: `info` (primary-tinted, eye-
   catching) and `neutral` (low-key surface variant). Optional action
   slot renders as an inline link below the body. */
export function Callout({
  appearance = 'info',
  icon,
  action,
  children,
  className,
  ...rest
}) {
  return (
    <div
      className={joinClasses('chorus-callout', `chorus-callout--${appearance}`, className)}
      role="note"
      {...rest}
    >
      {icon ? <span className="chorus-callout__icon" aria-hidden="true">{icon}</span> : null}
      <div className="chorus-callout__content">
        {children ? <p className="chorus-callout__body">{children}</p> : null}
        {action ? (
          <a
            className="chorus-callout__action"
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
