import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@/shared/hooks';

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
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // TODO: Implementar hook useCart() para buscar dados do carrinho
  // Por enquanto, permitimos acesso se autenticado

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
