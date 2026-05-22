// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import { Button } from './Button';
import { joinClasses } from './spec-utils';

/* Section — a labelled page region. Wraps a section heading and an
   optional trailing 'See all' link above a free-form body slot. The
   header anatomy is the family-wide source of truth — ChannelList and
   FeedCarousel paint the same header internally. The schema spec
   (schema/components/section/section.md) is the canonical contract.

   Link-affordance rule: the trailing headerAction is a Text Button
   `appearance="accent"` so the navigational intent carries chromatic
   emphasis. */
/**
 * section family wrapper. Dispatches to a per-variant impl;
 * each variant's full prop contract lives in its own spec.
 *
 * @see ./specs/section/post-carousel.spec.json — variant="post-carousel" (default)
 * @see ./specs/section/profile-carousel.spec.json — variant="profile-carousel"
 */
export function Section({
  label,
  headerAction,
  children,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  return (
    <section
      className={joinClasses('chorus-section', className)}
      aria-label={ariaLabel ?? label}
      {...rest}
    >
      {(label || headerAction) ? (
        <header className="chorus-section__header">
          {label ? <h3 className="chorus-section__label">{label}</h3> : <span />}
          {headerAction ? (
            <Button
              variant="text"
              size="xsmall"
              appearance="accent"
              className="chorus-section__header-action"
              href={headerAction.href ?? '#'}
              onClick={headerAction.onClick}
            >
              {headerAction.label}
            </Button>
          ) : null}
        </header>
      ) : null}
      <div className="chorus-section__body">{children}</div>
    </section>
  );
}
