import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PRODUCT, ADD_TO_CART, GET_MY_CART, GET_PRODUCT_RATING } from '@/graphql/queries';
import type { Product, ProductRating } from '@/types';
import { ShareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/ui/Button';
import { Container } from '@/ui/Container';
import Badge from '@/ui/Badge';
import { SizeSelector, ColorSelector, ProductRatingBar } from '@/features/products/components';

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
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [toast, setToast] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

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
      setToast('✓ Adicionado ao carrinho!');
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
          <div className="rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-3 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <Container className="pt-6 pb-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol role="list" className="flex items-center space-x-2 text-sm">
            <li>
              <button
                onClick={() => navigate('/products')}
                className="font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Produtos
              </button>
            </li>
            <li>
              <svg className="h-5 w-4 text-gray-400" fill="currentColor" viewBox="0 0 16 20">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </li>
            <li className="text-gray-500 dark:text-gray-400">{product.title}</li>
          </ol>
        </nav>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Image Gallery */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group">
              <img
                alt={product.title}
                src={mainImage.url}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {lowStock && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Poucas unidades
                </div>
              )}
              <button
                onClick={handleShare}
                title="Compartilhar"
                className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-900/90 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 shadow hover:bg-white dark:hover:bg-gray-900 transition"
              >
                <ShareIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={classNames(
                    'relative aspect-square rounded-lg overflow-hidden border-3 transition-all',
                    selectedImage === index
                      ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <img
                    alt={product.title}
                    src={image.url}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {product.title}
              </h1>
              {product.brand && typeof product.brand === 'object' && 'name' in product.brand && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Marca: <span className="font-semibold">{product.brand.name}</span>
                </p>
              )}
            </div>

            {/* Rating */}
            {rating && (
              <ProductRatingBar
                average={rating.averageRating || 0}
                count={rating.totalReviews || 0}
              />
            )}

            {/* Price and Stock */}
            <div className="border-y border-gray-200 dark:border-gray-700 py-4 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {priceBRL}
                </span>
                {(product.inventory ?? 0) > 0 && (
                  <Badge variant="success">Em estoque</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {(product.inventory ?? 0) > 0 ? `${product.inventory} unidades disponíveis` : 'Fora de estoque'}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <SizeSelector
                  sizes={product.sizes}
                  selected={selectedSize}
                  onSelect={setSelectedSize}
                  disabled={(product.inventory ?? 0) === 0}
                />
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <ColorSelector
                  colors={product.colors}
                  selected={selectedColor}
                  onSelect={setSelectedColor}
                  disabled={(product.inventory ?? 0) === 0}
                />
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quantidade:</label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || (product.inventory ?? 0) === 0}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min((product.inventory ?? 0), quantity + 1))}
                    disabled={quantity >= (product.inventory ?? 0)}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={adding || product.inventory === 0}
                className="w-full py-3 text-lg font-semibold"
              >
                {adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/cart')}
                disabled={product.inventory === 0}
                className="w-full py-3 text-lg font-semibold"
              >
                Comprar agora
              </Button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-full py-2 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                ♡ {isFavorite ? 'Remover de favoritos' : 'Adicionar a favoritos'}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Informações de Envio</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>✓ Frete grátis para compras acima de R$ 100</li>
                <li>✓ Entrega em até 7 dias úteis</li>
                <li>✓ Troca grátis em 30 dias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Description and Details Section */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            {product.description && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Descrição do Produto
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Especificações
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-4">
                      <dt className="font-semibold text-gray-900 dark:text-gray-100 flex-shrink-0">
                        {key}:
                      </dt>
                      <dd className="text-gray-700 dark:text-gray-300">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Material and Care */}
            {(product.material || product.careInstructions) && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Material e Cuidados
                </h2>
                <div className="space-y-4">
                  {product.material && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Material</h3>
                      <p className="text-gray-700 dark:text-gray-300">{product.material}</p>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Como Cuidar</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {product.careInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Informações do Produto</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">ID</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{product.id}</dd>
                </div>
                {product.category && typeof product.category === 'object' && 'name' in product.category && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Categoria</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{product.category.name}</dd>
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Adicionado em</dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                      {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-green-900 dark:text-green-100">Garantia de Qualidade</h3>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>✓ Produto 100% original</li>
                <li>✓ Embalagem premium</li>
                <li>✓ Seguro na compra</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
