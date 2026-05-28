'use client';

import { useRef } from 'react';
import { Button } from './Button.jsx';
import { Header } from './Header.jsx';
import { List } from './List.jsx';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* DirectoryList — labelled block of follow-able entries rendered as a
   single vertical scroll (no pager). Sits next to SuggestionList in
   the design: SuggestionList is a swipeable peek (3 rows / page at the
   xlarge 56 rung); DirectoryList is the full directory at the
   list/entry `large` (48) rung with no horizontal motion. Reach for
   DirectoryList on browse / "new channels" / "people you may know"
   surfaces where the full set is meant to be scanned vertically and
   each entry's trailing Toggle Button commits a follow in place. */
export function DirectoryList({
  label,
  headerAction,
  items = [],
  followLabel = 'Follow',
  followingLabel = 'Following',
  embedded = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const ref = useRef(null);
  useFullBleedGuard(ref, 'DirectoryList');
  return (
    <section
      ref={ref}
      className={joinClasses('chorus-directory-list', className)}
      aria-label={ariaLabel ?? label}
      data-embedded={embedded ? 'true' : undefined}
      {...rest}
    >
      <Header label={label} headerAction={headerAction} />
      <List
        variant="entry"
        size="large"
        embedded
        items={items.map((item, idx) => ({
          value: item.value ?? `row-${idx}`,
          label: item.name,
          secondary: item.followers,
          description: item.description,
          thumbnail: item.thumbnail ?? { alt: item.name },
          trailingIcon: (
            <Button variant="toggle" active={!!item.active} onClick={item.onToggle}>
              {item.active ? followingLabel : followLabel}
            </Button>
          ),
        }))}
      />
    </section>
  );
}
