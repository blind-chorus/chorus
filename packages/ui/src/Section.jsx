import { Button } from './Button.jsx';
import { joinClasses } from './spec-utils.js';

/* Section — a labelled page region. Wraps a section heading and an
   optional trailing 'See all' link above a free-form body slot. The
   header anatomy is the family-wide source of truth — SuggestionList
   and FeedCarousel paint the same header internally. The schema spec
   (schema/components/section/section.md) is the canonical contract.

   Link-affordance rule: the trailing headerAction is a Text Button
   `appearance="accent"` so the navigational intent carries chromatic
   emphasis. */
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
