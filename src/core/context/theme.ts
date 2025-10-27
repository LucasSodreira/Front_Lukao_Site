/**
 * Contexto de tema
 */

import React from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);
