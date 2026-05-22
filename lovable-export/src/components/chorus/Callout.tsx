// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import { joinClasses } from './spec-utils';

/** Props for Callout. Generated from schema/components/callout/callout.spec.json — edit there, then re-run `npm run build:lovable`. */
export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  appearance?: "default" | "accent";
  /** A 24 × 24 glyph at the container's leading edge. Inherits the callout's foreground (`currentColor`) so the mark reads as part of the body copy. Ignored when `thumbnail` is also passed. */
  icon?: React.ReactNode;
  /** A leading visual rendered by [Thumbnail](../thumbnail/thumbnail.md) — used when the aside is anchored to a channel, author, or sub-brand image rather than to a glyph. Takes precedence over `icon`. */
  thumbnail?: React.ReactNode;
  /** { label, href? , onClick? } — a follow-through link rendered as a block child below the body. */
  action?: Record<string, any>;
  /** Body text — the explanation copy. */
  children: React.ReactNode;
}

/* Callout — a self-contained block that explains a feature, capability,
   or piece of content sitting *within* the body flow but visually
   separated from it. Two appearances: `default` (low-key surface
   variant — the canonical aside) and `accent` (primary-tinted, eye-
   catching). Optional action slot renders as an inline link below the
   body. */
export function Callout({
  appearance = 'default',
  icon,
  thumbnail,
  action,
  children,
  className,
  ...rest
}: CalloutProps) {
  return (
    <div
      className={joinClasses('chorus-callout', `chorus-callout--${appearance}`, className)}
      role="note"
      {...rest}
    >
      {thumbnail ? (
        <span className="chorus-callout__thumbnail" aria-hidden="true">{thumbnail}</span>
      ) : null}
      {!thumbnail && icon ? (
        <span className="chorus-callout__icon" aria-hidden="true">{icon}</span>
      ) : null}
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
