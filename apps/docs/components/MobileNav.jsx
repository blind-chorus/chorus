'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { useBodyScrollLock } from '../lib/scrollLock';

export { MenuIcon } from '@blind-dsai/ui/icons';

const MobileNavContext = createContext({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function MobileNavProvider({ children }) {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  const value = useMemo(
    () => ({ open, setOpen, toggle: () => setOpen(o => !o) }),
    [open],
  );

  return (
    <MobileNavContext.Provider value={value}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  return useContext(MobileNavContext);
}

