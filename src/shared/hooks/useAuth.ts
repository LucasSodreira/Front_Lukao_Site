/**
 * Hook customizado para autenticação
 * Gerencia login, logout e estado do usuário
 */

import { useContext } from 'react';
import { AuthContext } from '@/core/context/AuthContext';
import type { AuthContextType } from '@/types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

/**
 * Hook para verificar se o usuário está autenticado
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook para obter o usuário logado
 */
export const useUser = () => {
  const { user } = useAuth();
  return user;
};

/**
 * Hook para executar logout
 */
export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};
