'use client';

import { useRef } from 'react';
import { Button } from './Button.jsx';
import { Thumbnail } from './Thumbnail.jsx';
import { GlobeIcon, LockIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

const PLACEHOLDER_IMAGE = '/placeholder.png';

const VISIBILITY = {
  public:  { Icon: GlobeIcon, defaultLabel: 'Public' },
  private: { Icon: LockIcon,  defaultLabel: 'Private' },
};

/* ProfileHeader — identity block at the top of a profile detail screen.
   Anatomy:
     - Cover band (200px tall, full-bleed, image-area fallback)
     - Avatar (Thumbnail at 80) overlapping the cover by half its diameter
     - Trailing follow Toggle Button on the same row as the avatar's lower half
     - Name (<h1>, heading.lg)
     - Visibility icon + label · followers (body.sm / onSurfaceVariant)
   The cover bleeds edge-to-edge inside the page-shell content box; the
   identity column pays its own 16px inline / block padding. See
   schema/components/profile-header/profile-header.md. */
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
      </div>

      <div className="chorus-profile-header__identity">
        <div className="chorus-profile-header__action-row">
          <div className="chorus-profile-header__avatar-wrap">
            <Thumbnail
              size={48}
              style={{ '--thumb-size': '80px' }}
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

        <h1 className="chorus-profile-header__name">{name}</h1>

        <div className="chorus-profile-header__meta">
          <VisibilityIcon size={16} className="chorus-profile-header__meta-icon" aria-hidden="true" />
          <span className="chorus-profile-header__meta-visibility">{visibilityText}</span>
          <span className="chorus-profile-header__meta-sep" aria-hidden="true">·</span>
          <span className="chorus-profile-header__meta-followers">{followers}</span>
        </div>
      </div>
    </section>
  );
}
