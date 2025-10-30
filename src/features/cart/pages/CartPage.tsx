import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from '@/graphql/queries';
import type { Cart, CartItem } from '@/types';
import { Card, CardBody } from '@/ui/Card';
import { Button } from '@/ui/Button';

interface CartQueryResult {
  myCart: Cart;
}

export const CartPage = () => {
  const { loading, error, data } = useQuery<CartQueryResult>(GET_MY_CART, { fetchPolicy: 'network-only' });
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM, { refetchQueries: [{ query: GET_MY_CART }] });
  const [removeFromCart] = useMutation(REMOVE_FROM_CART, { refetchQueries: [{ query: GET_MY_CART }] });
  const [clearCart, { loading: clearing }] = useMutation(CLEAR_CART, { refetchQueries: [{ query: GET_MY_CART }] });

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Carregando carrinho...</div>;
  if (error) return <div className="text-red-600">Erro ao carregar carrinho: {error.message}</div>;

  const cart = data?.myCart;

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Seu Carrinho</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Seu carrinho está vazio</p>
      </div>
    );
  }

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
                  onClick={() => updateCartItem({ variables: { productId: item.product.id, quantity: Math.max(0, item.quantity - 1) } })}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateCartItem({ variables: { productId: item.product.id, quantity: item.quantity + 1 } })}
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
        <CardBody className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total: R$ {cart.total || 0}</h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => clearCart()} disabled={clearing}>
              Limpar carrinho
            </Button>
            <Button>Finalizar Compra</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CartPage;
