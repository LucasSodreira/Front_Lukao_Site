import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { AuthContext } from '@/core/context/AuthContext';
import type { User } from '@/types';


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = authService.getAuthToken();
      if (token) {
        try {
          const userData = await authService.getMe(token);
          setUser({ ...userData } as User);
        } catch {
          authService.clearTokens();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    authService.setAuthToken(response.accessToken);
    authService.setRefreshToken(response.refreshToken);
    const userData = await authService.getMe(response.accessToken);
    setUser({ ...userData } as User);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    const response = await authService.signup({ name, email, password, phone });
    authService.setAuthToken(response.accessToken);
    authService.setRefreshToken(response.refreshToken);
    const userData = await authService.getMe(response.accessToken);
    setUser({ ...userData } as User);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Erro ao fazer logout', e);
    } finally {
      authService.clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

