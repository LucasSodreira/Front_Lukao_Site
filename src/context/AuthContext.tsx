import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { GET_ME, SIGN_IN } from '../graphql/queries';
import type { User, AuthContextType } from '../types';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const client = useApolloClient();

  const fetchUserData = useCallback(async (authToken: string) => {
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
      // Limpar dados em caso de erro
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      client.clearStore();
    }
  }, [client]);

  useEffect(() => {
    // Verificar se há token salvo
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      // Tentar buscar dados do usuário
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
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Buscar dados do usuário após login
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    client.clearStore();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
