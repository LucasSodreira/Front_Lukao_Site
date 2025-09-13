import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PRODUCT, ADD_TO_CART, GET_MY_CART } from '../graphql/queries';
import type { Product } from '../types';
import { Card, CardBody } from '../ui/Card';
import Button from '../ui/Button';

interface ProductQueryResult {
  product: Product;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  // O backend espera ID numérico (Long). Convertemos com segurança.
  const numericId = id && /^\d+$/.test(id) ? id : undefined;
  const { loading, error, data } = useQuery<ProductQueryResult>(GET_PRODUCT, {
    variables: { id: numericId },
    skip: !numericId,
    fetchPolicy: 'network-only',
  });

  const [addToCart, { loading: adding }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_MY_CART }],
  });

  if (!numericId) {
    return <div className="text-red-600">ID de produto inválido na URL.</div>;
  }

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Carregando produto...</div>;
  if (error) return <div className="text-red-600">Erro ao carregar produto: {error.message}</div>;

  const product = data?.product;

  if (!product) return <div className="text-gray-600 dark:text-gray-300">Produto não encontrado</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-2 gap-2 p-2">
          {product.images?.map((image) => (
            <img key={image.id} src={image.url} alt={product.title} className="w-full h-56 object-cover rounded-md" />
          ))}
        </div>
      </Card>

      <Card>
        <CardBody>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{product.title}</h1>
          {product.description && <p className="mt-2 text-gray-600 dark:text-gray-300">{product.description}</p>}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">R$ {product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Estoque: {product.inventory}</p>
            </div>
            <Button
              onClick={async () => {
                try {
                  await addToCart({ variables: { productId: numericId, quantity: 1 } });
                  // feedback simples
                  alert('Adicionado ao carrinho!');
                } catch (e) {
                  const msg = e instanceof Error ? e.message : String(e);
                  alert('Erro ao adicionar ao carrinho: ' + msg);
                }
              }}
              disabled={adding}
            >
              {adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductDetail;
