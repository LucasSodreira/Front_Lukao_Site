/**
 * Componente para rotas administrativas que requerem autenticação E role ADMIN
 * Redireciona para login se não autenticado
 * Redireciona para home se autenticado mas não for ADMIN
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login do admin
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Se está autenticado mas não é ADMIN, redireciona para home com mensagem
  if (user?.role !== 'ADMIN') {
    return (
      <Navigate 
        to="/" 
        state={{ 
          message: 'Você não tem permissão para acessar o painel administrativo.',
          type: 'error'
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
