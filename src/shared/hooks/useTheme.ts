/**
 * Hook customizado para tema
 * Gerencia tema claro/escuro
 */

import { useContext } from 'react';
import { ThemeContext } from '@/core/context';

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return ctx;
};

/**
 * Hook para verificar se está em modo escuro
 */
export const useIsDarkMode = (): boolean => {
  const { theme } = useTheme();
  return theme === 'dark';
};

/**
 * Hook para obter a classe CSS do tema
 */
export const useThemeClass = (): string => {
  const { theme } = useTheme();
  return theme === 'dark' ? 'dark' : 'light';
};
