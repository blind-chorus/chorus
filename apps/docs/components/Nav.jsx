'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SunIcon, MenuIcon, MoonIcon } from '@blind-dsai/ui/icons';
import { Button } from './Button';
import { useMobileNav } from './MobileNav';

function ThemeIcon({ theme }) {
  return theme === 'dark' ? <SunIcon /> : <MoonIcon />;
}

export function Nav() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let init = 'light';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        init = saved;
      } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        init = 'dark';
      }
    } catch {}
    setTheme(init);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme, mounted]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const iconTheme = mounted ? theme : 'light';
  const { open: navOpen, toggle: toggleNav } = useMobileNav();
  const navLabel = `${navOpen ? 'Close' : 'Open'} navigation`;

  return (
    <nav className="site-nav" aria-label="Site navigation">
      <div className="site-nav-inner">
        <div className="site-nav-lead">
          <Button
            variant="icon"
            className="site-nav-menu"
            onClick={toggleNav}
            aria-label={navLabel}
            aria-expanded={navOpen}
            aria-controls="site-side-nav"
            title={navLabel}
          >
            <MenuIcon />
          </Button>
          <Link href="/" className="site-nav-brand" aria-label="Chorus .md — Introduction">
          <svg
            className="site-nav-brand-mark"
            width="16"
            height="16"
            viewBox="0 0 32 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <clipPath id="site-nav-brand-clip">
              <rect width="32" height="32" rx="16" />
            </clipPath>
            <g clipPath="url(#site-nav-brand-clip)">
              <path d="M32 16.8634C31.5718 25.0278 25.0275 31.572 16.863 32L32 16.8634Z" />
              <path d="M16.0111 0C19.7109 0 23.1173 1.2553 25.8285 3.36269L3.36269 25.8285C1.2553 23.1173 0 19.7109 0 16.0111C0 7.16843 7.16843 0 16.0111 0Z" />
              <path d="M28.6586 6.19278C29.9267 7.82385 30.8833 9.7074 31.4467 11.7543L11.7543 31.4467C9.7074 30.8832 7.82386 29.9266 6.19279 28.6586L28.6586 6.19278Z" />
            </g>
          </svg>
          <span><strong>Chorus</strong> .md</span>
        </Link>
        </div>
        <Button
          variant="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${nextTheme} mode`}
          title={`Switch to ${nextTheme} mode`}
        >
          <ThemeIcon theme={iconTheme} />
        </Button>
      </div>
    </nav>
  );
}
