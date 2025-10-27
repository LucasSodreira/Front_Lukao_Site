import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PRODUCT, ADD_TO_CART, GET_MY_CART, GET_PRODUCT_RATING } from '@/graphql/queries';
import type { Product, ProductRating } from '@/types';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/ui/Button';
import { Container } from '@/ui/Container';
import Badge from '@/ui/Badge';

interface ProductQueryResult {
  product: Product;
}

interface ProductRatingResult {
  productRating: ProductRating;
}

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // O backend espera ID numérico (Long). Convertemos com segurança.
  const numericId = id && /^\d+$/.test(id) ? id : undefined;
  const { loading, error, data } = useQuery<ProductQueryResult>(GET_PRODUCT, {
    variables: { id: numericId },
    skip: !numericId,
    fetchPolicy: 'network-only',
  });

  const { data: ratingData } = useQuery<ProductRatingResult>(GET_PRODUCT_RATING, {
    variables: { productId: numericId },
    skip: !numericId,
  });

  const [addToCart, { loading: adding }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_MY_CART }],
    awaitRefetchQueries: true,
  });

  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!numericId) {
    return <div className="text-red-600">ID de produto inválido na URL.</div>;
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </Container>
    );
  }
  if (error) return <div className="text-red-600">Erro ao carregar produto: {error.message}</div>;

  const product = data?.product;
  const rating = ratingData?.productRating;

  if (!product) return <div className="text-gray-600 dark:text-gray-300">Produto não encontrado</div>;

  const handleAddToCart = async () => {
    try {
      await addToCart({ variables: { productId: Number(numericId), quantity } });
      setToast('Adicionado ao carrinho!');
      setQuantity(1);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setToast('Erro ao adicionar ao carrinho: ' + msg);
    }
  };

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [{ id: '1', url: 'https://via.placeholder.com/800x800?text=Sem+imagem', sortOrder: 0 }];
  const mainImage = images[selectedImage] || images[0];

  const priceBRL = (product.price ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const lowStock = (product.inventory ?? 0) > 0 && (product.inventory ?? 0) <= 5;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast('Link copiado!');
      }
    } catch {
      // usuário pode cancelar; não faz nada
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      {toast && (
        <div className="fixed inset-x-0 top-2 z-50 flex justify-center px-4">
          <div className="rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-2 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
      <Container className="pt-6 pb-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li>
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/products')}
                  className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400"
                >
                  Produtos
                </button>
                <svg
                  fill="currentColor"
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300 dark:text-gray-700"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <span aria-current="page" className="font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
          {/* Main image */}
          <div className="lg:col-span-2">
            <div className="group relative overflow-hidden rounded-lg">
              <img
                alt={product.title}
                src={mainImage.url}
                className="w-full aspect-square object-cover bg-gray-100 dark:bg-gray-800 transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={handleShare}
                title="Compartilhar"
                className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/80 dark:bg-gray-900/70 px-2 py-1 text-xs text-gray-700 dark:text-gray-200 shadow hover:bg-white dark:hover:bg-gray-900"
              >
                <ShareIcon className="h-4 w-4" /> Compartilhar
              </button>
            </div>
          </div>

          {/* Thumbnail gallery */}
          <div className="mt-4 lg:mt-0">
            <h3 className="sr-only">Imagens</h3>
            <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={classNames(
                    'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                    selectedImage === index
                      ? 'border-blue-500 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <img
                    alt={product.title}
                    src={image.url}
                    className="w-full h-full object-cover bg-gray-100 dark:bg-gray-800"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 dark:lg:border-gray-700 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Informações do Produto</h2>

            {/* Price */}
            <div className="flex items-center gap-3">
              <p className="text-3xl tracking-tight text-gray-900 dark:text-gray-100">
                {priceBRL}
              </p>
              {lowStock && <Badge variant="warning">Poucas unidades</Badge>}
            </div>

            {/* Rating */}
            <div className="mt-6">
              <h3 className="sr-only">Avaliações</h3>
              {rating && (
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <StarIcon
                        key={i}
                        aria-hidden="true"
                        className={classNames(
                          (rating.averageRating ?? 0) > i ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600',
                          'h-5 w-5 shrink-0'
                        )}
                      />
                    ))}
                  </div>
                  <p className="sr-only">{rating.averageRating?.toFixed(1) ?? 0} de 5 estrelas</p>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {rating.totalReviews} avaliações
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-6">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Estoque: {(product.inventory ?? 0) > 0 ? product.inventory : 'Indisponível'}
                </span>
                <span className="ml-3">
                  {(product.inventory ?? 0) > 0 ? (
                    <Badge variant={lowStock ? 'warning' : 'success'}>
                      {lowStock ? 'Baixo estoque' : 'Em estoque'}
                    </Badge>
                  ) : (
                    <Badge variant="danger">Fora de estoque</Badge>
                  )}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || (product.inventory ?? 0) === 0}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min((product.inventory ?? 0), quantity + 1))}
                    disabled={quantity >= (product.inventory ?? 0)}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={adding || product.inventory === 0}
                className="mt-4 w-full"
              >
                {adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/cart')}
                disabled={product.inventory === 0}
                className="mt-2 w-full"
              >
                Comprar agora
              </Button>
            </div>
          </div>

          {/* Description and details */}
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 dark:lg:border-gray-700 lg:pt-6 lg:pr-8 lg:pb-16">
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Descrição</h3>
                <div className="mt-4 space-y-4">
                  <p className="text-base text-gray-700 dark:text-gray-300">{product.description}</p>
                </div>
              </div>
            )}

            {/* Product details */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Detalhes do Produto</h3>
              <div className="mt-4 space-y-4">
                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="py-3 flex justify-between">
                    <dt className="font-medium text-gray-900 dark:text-gray-100">ID</dt>
                    <dd className="text-gray-600 dark:text-gray-400">{product.id}</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="font-medium text-gray-900 dark:text-gray-100">Criado em</dt>
                    <dd className="text-gray-600 dark:text-gray-400">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
