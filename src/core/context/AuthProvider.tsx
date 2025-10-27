/**
 * Provider de autenticação
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { GET_ME, SIGN_IN } from '@/graphql/queries';
import { STORAGE_KEYS } from '@/constants';
import type { User, AuthContextType } from '@/types';
import { AuthContext } from './AuthContext';

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
  const client = useApolloClient();

  const fetchUserData = useCallback(
    async (authToken: string) => {
      try {
        const { data } = await client.query<MeQueryResult>({
          query: GET_ME,
          context: {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        });
        if (data?.me) {
          setUser(data.me);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        client.clearStore();
      }
    },
    [client]
  );

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (savedToken) {
      setToken(savedToken);
      fetchUserData(savedToken);
    }
  }, [fetchUserData]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await client.mutate<SignInMutationResult>({
        mutation: SIGN_IN,
        variables: { email, password },
      });

      if (data?.signIn) {
        const { accessToken, refreshToken } = data.signIn;
        setToken(accessToken);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        await fetchUserData(accessToken);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    client.clearStore();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
