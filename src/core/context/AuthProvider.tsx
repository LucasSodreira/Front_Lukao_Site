/**
 * Provider de autenticação
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { GET_ME, SIGN_IN, LOGOUT } from '@/graphql/queries';
import type { User, AuthContextType } from '@/types';
import { AuthContext } from './AuthContext';
import { logger } from '@/utils';

interface MeQueryResult {
  me: User;
}

interface SignInMutationResult {
  signIn: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  /**
   * Busca dados do usuário autenticado
   * Só deve ser chamado se houver indícios de autenticação (cookie ou após login)
   */
  const fetchUserData = useCallback(async () => {
    try {
      const { data } = await client.query<MeQueryResult>({
        query: GET_ME,
        fetchPolicy: 'network-only',
      });
      
      if (data?.me) {
        setUser(data.me);
        setToken('authenticated');
        return true;
      }
      return false;
    } catch (error: unknown) {
      const errorObj = error as {
        networkError?: { statusCode?: number };
        graphQLErrors?: Array<{ message?: string; extensions?: { classification?: string } }>;
        message?: string;
      };

      const statusCode = errorObj.networkError?.statusCode;
      const graphQLErrors = errorObj.graphQLErrors;
      
      // Verifica se é erro de autenticação (401/403 ou Unauthorized)
      const isAuthError = 
        statusCode === 401 || 
        statusCode === 403 || 
        graphQLErrors?.some(err => 
          err.message?.includes('Unauthorized') || 
          err.message?.includes('Access Denied') ||
          err.extensions?.classification === 'UNAUTHORIZED'
        );
      
      if (isAuthError) {
        // ✅ Token inválido/expirado - limpa estado (sem log, é esperado)
        setUser(null);
        setToken(null);
        return false;
      } else {
        // ❌ Erro real (rede, servidor) - loga para debug
        logger.error('Erro ao buscar dados do usuário', errorObj.message || 'Erro desconhecido');
        setUser(null);
        setToken(null);
        return false;
      }
    }
  }, [client]);

  // Inicializa autenticação ao montar: tenta buscar dados do usuário mesmo com cookie HttpOnly.
  // Não confiamos em document.cookie para tokens HttpOnly; fetchUserData trata 401/403 silenciosamente.
  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUserData]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await client.mutate<SignInMutationResult>({
        mutation: SIGN_IN,
        variables: { email, password },
      });

      if (data?.signIn) {
        // ✅ Backend definiu cookies HttpOnly
        setToken('authenticated');
        
        // ✅ Busca dados do usuário usando o cookie definido
        const success = await fetchUserData();
        
        if (!success) {
          throw new Error('Falha ao buscar dados do usuário após login');
        }
      }
    } catch (err) {
      // Limpa qualquer estado de autenticação em caso de erro
      setUser(null);
      setToken(null);
      logger.error('Erro no login', (err as Error).message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Chama mutation de logout no backend para limpar cookies
      await client.mutate({
        mutation: LOGOUT,
      });
    } catch {
      logger.error('Erro ao fazer logout no servidor');
    } finally {
      setUser(null);
      setToken(null);
      client.clearStore();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  // ✅ Mostra loading apenas durante inicialização
  if (loading) {
    return null; // ou um componente de loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
