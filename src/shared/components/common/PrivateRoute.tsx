/**
 * Componente para rotas privadas que requerem autenticação
 * Redireciona para login se não autenticado, preservando a rota de destino
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Aguarda o carregamento do usuário
  if (isAuthenticated === false && user === null) {
    const token = localStorage.getItem('authToken');
    // Se há token mas ainda não carregou o usuário, mostra loading
    if (token) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      );
    }
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
