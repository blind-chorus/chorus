'use client';

import { useCallback, useMemo, useRef } from 'react';
import { TabsContext } from './internal/TabsContext.js';
import { TabsUnderline } from './internal/TabsUnderline.jsx';
import { TabsRounded } from './internal/TabsRounded.jsx';
import { TabsSegmented } from './internal/TabsSegmented.jsx';

const VARIANTS = {
  underline: TabsUnderline,
  rounded: TabsRounded,
  segmented: TabsSegmented,
};

export function Tabs({
  variant = 'underline',
  value,
  onChange,
  children,
  ...rest
}) {
  const Impl = VARIANTS[variant] ?? TabsUnderline;
  const tabValuesRef = useRef([]);

  const registerTab = useCallback((tabValue) => {
    if (!tabValuesRef.current.includes(tabValue)) {
      tabValuesRef.current.push(tabValue);
    }
    return () => {
      tabValuesRef.current = tabValuesRef.current.filter((v) => v !== tabValue);
    };
  }, []);

  const handleKeyDown = useCallback((e) => {
    const order = tabValuesRef.current;
    if (!order.length) return;
    const currentIdx = order.indexOf(value);
    let nextIdx = currentIdx;
    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % order.length;
    else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + order.length) % order.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = order.length - 1;
    else return;
    e.preventDefault();
    onChange?.(order[nextIdx]);
  }, [value, onChange]);

  const ctx = useMemo(() => ({
    variant,
    value,
    onChange: (v) => onChange?.(v),
    registerTab,
  }), [variant, value, onChange, registerTab]);

  return (
    <TabsContext.Provider value={ctx}>
      <Impl role="tablist" onKeyDown={handleKeyDown} {...rest}>
        {children}
      </Impl>
    </TabsContext.Provider>
  );
}
