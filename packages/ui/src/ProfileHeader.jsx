'use client';

import { useRef } from 'react';
import { Button } from './Button.jsx';
import { NavigationBar } from './NavigationBar.jsx';
import { Thumbnail } from './Thumbnail.jsx';
import { ChevronLeftIcon, GlobeIcon, LockIcon, SearchIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

const PLACEHOLDER_IMAGE = '/placeholder.png';

const VISIBILITY = {
  public:  { Icon: GlobeIcon, defaultLabel: 'Public' },
  private: { Icon: LockIcon,  defaultLabel: 'Private' },
};

/* ProfileHeader — identity block at the top of a profile detail screen.
   Anatomy (top to bottom):
     - Overlay NavigationBar (page variant, appearance="overlay") —
       transparent, fixed-white icons, floating over the cover
     - Cover band (200px tall, full-bleed, image-area fallback)
     - Action row: avatar (Thumbnail 56, overlapping cover) + follow
       Toggle Button (positioned 16px below cover bottom)
     - Heading: name (<h1>, heading.lg) + meta row (visibility · followers)
   The cover bleeds edge-to-edge inside the page-shell content box; the
   identity column pays its own 16px inline / block padding. The
   NavigationBar is absolutely positioned over the cover so the cover
   image fills the same 200px height regardless of the bar's presence.
   See schema/components/profile-header/profile-header.md. */
export function ProfileHeader({
  name,
  avatar,
  cover,
  visibility = 'public',
  visibilityLabel,
  followers,
  followed = false,
  onFollowChange,
  followLabel = 'Follow',
  followingLabel = 'Following',
  /* Overlay nav controls. Defaults to a back-arrow leading + search
     trailing. Pass `nav={false}` to opt out of the overlay bar. */
  nav,
  onBack,
  onSearch,
  backLabel = 'Back',
  searchLabel = 'Search',
  className,
  ...rest
}) {
  const ref = useRef(null);
  useFullBleedGuard(ref, 'ProfileHeader');

  const visibilityKind = VISIBILITY[visibility] ?? VISIBILITY.public;
  const VisibilityIcon = visibilityKind.Icon;
  const visibilityText = visibilityLabel ?? visibilityKind.defaultLabel;

  const handleFollowClick = () => {
    if (onFollowChange) onFollowChange(!followed);
  };

  const showNav = nav !== false;

  return (
    <section
      ref={ref}
      className={joinClasses('chorus-profile-header', className)}
      {...rest}
    >
      <div className="chorus-profile-header__cover" aria-hidden="true">
        <img
          className="chorus-profile-header__cover-image"
          src={cover?.src ?? PLACEHOLDER_IMAGE}
          alt={cover?.alt ?? ''}
        />
        {showNav ? (
          <div className="chorus-profile-header__nav">
            <NavigationBar
              variant="page"
              appearance="overlay"
              title=""
              leading={{ icon: <ChevronLeftIcon />, 'aria-label': backLabel, onClick: onBack }}
              trailing={{ icon: <SearchIcon />, 'aria-label': searchLabel, onClick: onSearch }}
            />
          </div>
        ) : null}
      </div>

      <div className="chorus-profile-header__identity">
        <div className="chorus-profile-header__action-row">
          <div className="chorus-profile-header__avatar-wrap">
            <Thumbnail
              size={56}
              {...(avatar ?? { alt: name })}
            />
          </div>
          <Button
            variant="toggle"
            active={followed}
            onClick={handleFollowClick}
          >
            {followed ? followingLabel : followLabel}
          </Button>
        </div>

        <div className="chorus-profile-header__heading">
          <h1 className="chorus-profile-header__name">{name}</h1>
          <div className="chorus-profile-header__meta">
            <VisibilityIcon size={16} className="chorus-profile-header__meta-icon" aria-hidden="true" />
            <span className="chorus-profile-header__meta-visibility">{visibilityText}</span>
            <span className="chorus-profile-header__meta-sep" aria-hidden="true">·</span>
            <span className="chorus-profile-header__meta-followers">{followers}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
