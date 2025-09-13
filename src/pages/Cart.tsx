import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { GET_MY_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART, GET_PRODUCT } from '../graphql/queries';
import type { Cart, Product } from '../types';
import { Card, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import { useEffect, useMemo, useState } from 'react';

interface CartQueryResult {
  myCart: Cart;
}

export const CartPage = () => {
  const apollo = useApolloClient();
  const { loading, error, data } = useQuery<CartQueryResult>(GET_MY_CART, { fetchPolicy: 'network-only' });
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM, { refetchQueries: [{ query: GET_MY_CART }] });
  const [removeFromCart] = useMutation(REMOVE_FROM_CART, { refetchQueries: [{ query: GET_MY_CART }] });
  const [clearCart, { loading: clearing }] = useMutation(CLEAR_CART, { refetchQueries: [{ query: GET_MY_CART }] });

  // Estado local para armazenar produtos enriquecidos (com imagens/inventory)
  const [productDetails, setProductDetails] = useState<Record<string, Product>>({});

  // Identificar IDs de produtos que estão sem imagens
  const missingImageIds = useMemo(() => {
    const items = data?.myCart?.items ?? [];
    return items
      .filter((it) => !(it.product?.images && it.product.images.length > 0))
      .map((it) => it.product.id);
  }, [data]);

  // Buscar detalhes de produtos faltantes (um por vez para simplicidade; pode ser otimizado)
  useEffect(() => {
    let cancelled = false;
    async function fetchMissing() {
      // Evitar chamadas repetidas para os mesmos ids
      const idsToFetch = missingImageIds.filter((id) => !productDetails[id]);
      for (const id of idsToFetch) {
        try {
          const result = await apollo.query<{ product: Product }>({ query: GET_PRODUCT, variables: { id }, fetchPolicy: 'network-only' });
          const product = result.data?.product;
          if (!cancelled && product) {
            setProductDetails((prev) => ({ ...prev, [id]: product }));
          }
        } catch (e) {
          // Silenciar erro para não quebrar a UI; imagem placeholder será usada
          console.warn('Falha ao buscar produto para imagens', e);
        }
      }
    }
    if (missingImageIds.length > 0) fetchMissing();
    return () => {
      cancelled = true;
    };
  }, [missingImageIds, productDetails, apollo]);

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
        {cart.items.map((item) => {
          const enriched = productDetails[item.product.id];
          const imageUrl = enriched?.images?.[0]?.url || item.product.images?.[0]?.url || '/placeholder.jpg';
          return (
          <Card key={item.id}>
            <CardBody className="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-4 items-center">
              <img
                src={imageUrl}
                alt={item.product.title}
                className="w-28 h-28 object-cover rounded-md"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.product.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Preço unitário: R$ {item.product.price}</p>
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
        );})}
      </div>
      <Card>
        <CardBody className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total: R$ {cart.total}</h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => clearCart()} disabled={clearing}>Limpar carrinho</Button>
            <Button>Finalizar Compra</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CartPage;
