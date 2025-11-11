import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_MY_CART } from '@/graphql/queries';
import { useIsAuthenticated } from '@/shared/hooks';
import type { Cart } from '@/types';

interface CheckoutRouteProps {
  children: React.ReactNode;
}

interface CartQueryResult {
  myCart: Cart;
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

  const { data, loading: cartLoading } = useQuery<CartQueryResult>(GET_MY_CART, {
    skip: !isAuthenticated,
    fetchPolicy: 'network-only',
  });

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se ainda está carregando, mostra loading
  if (cartLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não tem carrinho ou carrinho está vazio, redireciona para o carrinho
  if (!data?.myCart || !data.myCart.items || data.myCart.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return <>{children}</>;
};
