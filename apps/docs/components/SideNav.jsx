'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@blind-dsai/ui/icons';
import { NAV } from '../lib/nav';
import { useMobileNav } from './MobileNav';

function normalize(p) {
  return p && p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

function isActive(pathname, href) {
  return normalize(pathname) === normalize(href);
}

/* Single chevron — visual state cue only, never an interactive surface.
   Always rendered as the down chevron (`ChevronDownIcon`); CSS rotates it 90°
   anti-clockwise (▶) when the parent row carries `.is-collapsed`,
   mirroring Atlassian's nav pattern (chevron pre-fix the label, the whole
   row is the toggle target). */
function Chevron() {
  return <ChevronDownIcon className="side-nav-chevron-svg" size={16} />;
}

function SideNavItem({ item, pathname }) {
  const hasSubs = !!item.subs?.length;
  /* Auto-expand when the active route is the family link or any of its
     subs, so navigating into a sub-page leaves the list open. Persist the
     toggled state in component state so the user's collapse choice is kept
     while they browse within the family. */
  const isOnFamilyTree =
    isActive(pathname, item.href) ||
    (item.subs ?? []).some((sub) => isActive(pathname, sub.href));
  const [expanded, setExpanded] = useState(isOnFamilyTree);
  useEffect(() => {
    if (isOnFamilyTree) setExpanded(true);
  }, [isOnFamilyTree]);

  /* Click on the family row navigates AND toggles expand state when the
     family has sub-components — Atlassian-style: the entire row IS the
     toggle, the chevron is decorative. The link still routes the visitor
     to the family page; the toggle just adjusts the local list state. */
  const handleClick = hasSubs ? () => setExpanded((v) => !v) : undefined;

  return (
    <li>
      <Link
        href={item.href}
        className={`side-nav-link${hasSubs ? ' side-nav-link--has-subs' : ''}${hasSubs && !expanded ? ' is-collapsed' : ''}${isActive(pathname, item.href) ? ' is-active' : ''}`}
        aria-expanded={hasSubs ? expanded : undefined}
        onClick={handleClick}
      >
        <span className="side-nav-chevron" aria-hidden="true">{hasSubs ? <Chevron /> : null}</span>
        <span className="side-nav-label">{item.label}</span>
        {item.wip ? <span className="side-nav-wip" aria-label="Work in progress">WIP</span> : null}
      </Link>
      {hasSubs && expanded ? (
        <ul className="side-nav-subs">
          {item.subs.map(sub => (
            <li key={sub.href}>
              <Link
                href={sub.href}
                className={`side-nav-link side-nav-sublink${isActive(pathname, sub.href) ? ' is-active' : ''}`}
              >
                <span className="side-nav-chevron" aria-hidden="true" />
                <span className="side-nav-label">{sub.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function SideNavGroup({ group, pathname }) {
  if (group.items.length === 1 && !group.groupHref) {
    const item = group.items[0];
    return (
      <div className="side-nav-group">
        <Link
          href={item.href}
          className={`side-nav-link side-nav-link-top${isActive(pathname, item.href) ? ' is-active' : ''}`}
        >
          <span className="side-nav-chevron" aria-hidden="true" />
          <span className="side-nav-label">{group.group}</span>
        </Link>
      </div>
    );
  }

  /* Multi-item groups carry a chevron toggle on the group title. The list
     auto-expands when the active route is inside the group (group landing,
     any item, or any sub) so navigation never lands on a hidden entry; the
     user's manual collapse persists otherwise. */
  const groupActive = group.groupHref ? isActive(pathname, group.groupHref) : false;
  const itemsActive = group.items.some((item) =>
    isActive(pathname, item.href) || (item.subs ?? []).some((sub) => isActive(pathname, sub.href)),
  );
  const isOnGroupTree = groupActive || itemsActive;
  const [expanded, setExpanded] = useState(isOnGroupTree);
  useEffect(() => {
    if (isOnGroupTree) setExpanded(true);
  }, [isOnGroupTree]);

  const toggle = () => setExpanded((v) => !v);
  const collapsedClass = expanded ? '' : ' is-collapsed';

  return (
    <div className="side-nav-group">
      {group.groupHref ? (
        <Link
          href={group.groupHref}
          className={`side-nav-group-title side-nav-group-link${groupActive ? ' is-active' : ''}${collapsedClass}`}
          aria-expanded={expanded}
          onClick={toggle}
        >
          <span className="side-nav-chevron"><Chevron /></span>
          <span className="side-nav-label">{group.group}</span>
        </Link>
      ) : (
        <button
          type="button"
          className={`side-nav-group-title side-nav-group-toggle${collapsedClass}`}
          aria-expanded={expanded}
          onClick={toggle}
        >
          <span className="side-nav-chevron"><Chevron /></span>
          <span className="side-nav-label">{group.group}</span>
        </button>
      )}
      {expanded ? (
        <ul className="side-nav-items">
          {group.items.map(item => (
            <SideNavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SideNav() {
  const pathname = usePathname();
  const { open: navOpen, setOpen: setNavOpen } = useMobileNav();

  useEffect(() => {
    if (navOpen) setNavOpen(false);
    // navOpen intentionally omitted: only react to route changes, not to opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {navOpen ? (
        <div
          className="side-nav-backdrop"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <aside
        id="site-side-nav"
        className={`side-nav${navOpen ? ' is-open' : ''}`}
        aria-label="Site sections"
      >
        <nav className="side-nav-list">
          <div className="side-nav-rule">
            {NAV.map(group => (
              <SideNavGroup key={group.group} group={group} pathname={pathname} />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
