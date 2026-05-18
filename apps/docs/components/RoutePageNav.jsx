'use client';

import { usePathname } from 'next/navigation';
import { PageNav } from './PageNav';
import { findToc } from '../lib/nav';

export function RoutePageNav() {
  const pathname = usePathname();
  const items = findToc(pathname);
  if (!items.length) return null;
  return <PageNav items={items} />;
}
