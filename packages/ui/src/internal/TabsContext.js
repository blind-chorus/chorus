import { createContext, useContext } from 'react';

export const TabsContext = createContext({
  variant: 'underline',
  value: null,
  onChange: () => {},
  registerTab: () => () => {},
  focusValue: null,
  setFocusValue: () => {},
});

export function useTabsContext() {
  return useContext(TabsContext);
}
