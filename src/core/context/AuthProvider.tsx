import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { AuthContext } from '@/core/context/AuthContext';
import type { User } from '@/types';


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      // Verifica se há cookies de autenticação antes de tentar carregar o usuário
      const hasAuthCookies = document.cookie.includes('access_token') || document.cookie.includes('refresh_token');
      
      if (!hasAuthCookies) {
        // Sem cookies de autenticação, não faz sentido tentar carregar usuário
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await authService.getMe();
        if (active) {
          setUser({ ...userData } as User);
        }
      } catch (error) {
        const shouldAttemptRefresh = error instanceof Error && error.message === 'UNAUTHORIZED';
        if (shouldAttemptRefresh) {
          try {
            const refreshed = await authService.refreshSession();
            if (refreshed) {
              const userData = await authService.getMe();
              if (active) {
                setUser({ ...userData } as User);
              }
              return;
            }
          } catch {
            // Silenciosamente falha e trata como não autenticado
            // Isso é esperado quando o backend reinicia e invalida os tokens
            console.debug('Sessão expirada, usuário será tratado como não autenticado');
          }
        }
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    const userData = await authService.getMe();
    setUser({ ...userData } as User);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    await authService.signup({ name, email, password, phone });
    const userData = await authService.getMe();
    setUser({ ...userData } as User);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Erro ao fazer logout', e);
    } finally {
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

