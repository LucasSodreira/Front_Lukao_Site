/**
 * Componente para rotas públicas que redirecionam usuários autenticados
 * Usado para páginas de login e registro
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Se o usuário já está autenticado, redireciona
  if (isAuthenticated) {
    // Se é admin e está na rota de admin login, redireciona para dashboard admin
    if (user?.role === 'ADMIN' && window.location.pathname.includes('admin/login')) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Caso contrário, redireciona para home normal
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
