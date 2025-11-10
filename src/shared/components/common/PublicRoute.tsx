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
  const { isAuthenticated } = useAuth();

  // Se o usuário já está autenticado, redireciona para a home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
