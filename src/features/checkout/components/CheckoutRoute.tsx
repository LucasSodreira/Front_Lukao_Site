import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';

interface CheckoutRouteProps {
  children: React.ReactNode;
}

/**
 * Guard para proteger todas as rotas de checkout
 * Verifica:
 * 1. Se o usuário está autenticado
 * 2. Se o usuário tem um carrinho válido com itens
 * 
 * Se qualquer uma das verificações falhar, redireciona para a rota apropriada
 */
export const CheckoutRoute = ({ children }: CheckoutRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Aguarda o carregamento da autenticação antes de decidir
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Verificando autenticação...</h1>
        </div>
      </main>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
