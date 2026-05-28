'use client';

import { useEffect, useState } from 'react';

function flatten(items) {
  const out = [];
  for (const item of items) {
    out.push(item);
    if (item.children) out.push(...flatten(item.children));
  }
  return out;
}

export function PageNav({ items }) {
  const flat = flatten(items);
  // Hide the page nav when there are 2 or fewer scroll targets — at that
  // count the TOC is just a label for the page itself (no navigation value).
  const hidden = flat.length <= 2;
  const [activeId, setActiveId] = useState(flat[0]?.id);

  useEffect(() => {
    if (hidden) return;
    const elements = flat
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    const update = () => {
      const trigger = window.innerHeight * 0.25;
      let current = elements[0]?.id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - trigger <= 0) current = el.id;
        else break;
      }
      if (current) setActiveId(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  if (hidden) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  const renderItem = ({ id, label, children }) => (
    <li key={id}>
      <a
        href={`#${id}`}
        className={`page-nav-link${activeId === id ? ' is-active' : ''}`}
        onClick={(e) => handleClick(e, id)}
      >
        {label}
      </a>
      {children?.length ? (
        <ol className="page-nav-sublist">
          {children.map(renderItem)}
        </ol>
      ) : null}
    </li>
  );

  return (
    <aside className="page-nav" aria-label="Page navigation">
      <ol className="page-nav-list">
        {items.map(renderItem)}
      </ol>
    </aside>
  );
}
