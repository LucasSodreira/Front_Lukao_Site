import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { GET_MY_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART, GET_MY_ADDRESSES } from '@/graphql/queries';
import { AUTHENTICATED_CHECKOUT } from '@/graphql/checkoutQueries';
import type { Cart, CartItem } from '@/types';
import { Card, CardBody } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { CheckoutModal } from '../components/CheckoutModal';
import { useAuth } from '@/shared/hooks';
import { logger, ErrorHandler, InputValidator } from '@/utils';

interface CartQueryResult {
  myCart: Cart;
}

interface AddressesQueryResult {
  myAddresses: Array<{
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    primary: boolean;
    createdAt: string;
  }>;
}

interface AuthenticatedCheckoutResult {
  checkout: {
    id: string;
    status: string;
    totalAmount: number;
    shippingCost: number;
    items: Array<{
      product: {
        title: string;
      };
      quantity: number;
      totalPrice: number;
    }>;
    createdAt: string;
  };
}

const SHIPPING_COST = 15.0; // Frete fixo por enquanto

export const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { loading, error, data } = useQuery<CartQueryResult>(GET_MY_CART, { fetchPolicy: 'network-only' });
  
  // Carregar endereços se autenticado
  const { data: addressesData } = useQuery<AddressesQueryResult>(GET_MY_ADDRESSES, {
    skip: !isAuthenticated,
    fetchPolicy: 'network-only',
  });

  const [updateCartItem] = useMutation(UPDATE_CART_ITEM, { refetchQueries: [{ query: GET_MY_CART }] });
  const [removeFromCart] = useMutation(REMOVE_FROM_CART, { refetchQueries: [{ query: GET_MY_CART }] });
  const [clearCart, { loading: clearing }] = useMutation(CLEAR_CART, { refetchQueries: [{ query: GET_MY_CART }] });
  const [authenticatedCheckout] = useMutation<AuthenticatedCheckoutResult>(AUTHENTICATED_CHECKOUT);

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Carregando carrinho...</div>;
  if (error) {
    logger.error('Erro ao carregar carrinho', { error: error.message });
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
          {ErrorHandler.getUserFriendlyMessage(error)}
        </div>
        <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
      </div>
    );
  }

  const cart = data?.myCart;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Seu Carrinho</h1>
        <p className="text-gray-600 dark:text-gray-300">Seu carrinho está vazio</p>
        <Button onClick={() => navigate('/products')}>Continuar Comprando</Button>
      </div>
    );
  }

  // Verificar autenticação antes de permitir checkout
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      // Redirecionar para login com mensagem
      navigate('/login', { state: { from: '/cart', message: 'Faça login para continuar com a compra' } });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (formData: Record<string, string>) => {
    setIsProcessing(true);
    try {
      // ✅ Usuário DEVE estar autenticado para chegar aqui
      const primaryAddress = addressesData?.myAddresses.find((addr) => addr.primary);
      const addressId = primaryAddress?.id;
      
      if (!addressId) {
        throw new Error('Por favor, configure um endereço de entrega primário');
      }

      // 1. Criar o pedido (anteriormente authenticatedCheckout)
      const orderResult = await authenticatedCheckout({
        variables: {
          shippingAddressId: addressId,
          notes: formData.notes || '',
        },
      });

      const order = orderResult.data?.checkout;
      if (!order) throw new Error('Falha ao criar pedido');

      
      // Navegar para a página de checkout com o ID do pedido
      setIsCheckoutOpen(false);
      navigate(`/checkout/${order.id}`);

    } catch (err) {
      logger.error('Erro no checkout', { error: err });
      const friendlyMessage = ErrorHandler.getUserFriendlyMessage(err);
      alert(friendlyMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    // Validar ID do produto
    if (!InputValidator.validateProductId(productId)) {
      logger.error('ID de produto inválido', { productId });
      alert('Erro: ID de produto inválido');
      return;
    }

    // Validar quantidade
    if (!InputValidator.validateQuantity(newQuantity)) {
      alert('Quantidade inválida. Mínimo: 1, Máximo: 999');
      return;
    }

    updateCartItem({
      variables: { productId, quantity: newQuantity },
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Seu Carrinho</h1>

      <div className="space-y-3">
        {cart.items.map((item: CartItem) => (
          <Card key={item.id}>
            <CardBody className="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-4 items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{item.product.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">ID: {item.product.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Preço: R$ {item.product.price}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total: R$ {item.totalPrice}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= 999}
                >
                  +
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart({ variables: { productId: item.product.id } })}
                >
                  Remover
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">R$ {(Number(cart.total) || 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Frete:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">R$ {SHIPPING_COST.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Total: R$ {((Number(cart.total) || 0) + SHIPPING_COST).toFixed(2)}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => clearCart()} disabled={clearing} className="flex-1">
              Limpar Carrinho
            </Button>
            <Button onClick={handleCheckoutClick} className="flex-1">
              Finalizar Compra
            </Button>
          </div>
        </CardBody>
      </Card>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cartTotal={Number(cart.total) || 0}
        shippingCost={SHIPPING_COST}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckoutSubmit}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default CartPage;
