import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/features/products/hooks/useProducts';
import { Breadcrumb, QuantitySelector } from '@/shared/components/common';
import { ProductGallery, ProductTabs, RelatedProducts } from '@/features/products/components';
import { logger } from '@/utils';
import { useCartRest } from '@/features/cart/hooks/useCartRest';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Branco');
  const [toast, setToast] = useState<string | null>(null);

  const numericId = id && /^\d+$/.test(id) ? id : undefined;
  
  const { data: product, isLoading: loading, error } = useProduct(numericId || '');
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartRest();

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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="w-full aspect-[4/5] bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    logger.error('Erro ao carregar produto', { productId: numericId, error });
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Erro ao carregar o produto
          </div>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Voltar para Produtos
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 dark:text-gray-300">Produto não encontrado</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      if (!product) return;
      // Resolve variationId com base em cor/tamanho selecionados (se disponível)
      const variationId = Array.isArray(product.variations)
        ? product.variations.find(v => v.color?.name === selectedColor && v.size?.name === selectedSize)?.id
        : undefined;
      await addItem(
        { id: product.id as unknown as string },
        quantity,
        { variationId: variationId ? Number(variationId) : undefined }
      );
      setToast('✓ Adicionado ao carrinho!');
      setQuantity(1);
    } catch (e) {
      logger.error('Erro ao adicionar ao carrinho', { productId: numericId, quantity, error: e });
      setToast('Erro ao adicionar ao carrinho');
    } finally {
      setAdding(false);
    }
  };

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [];

  const priceBRL = (product.price ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Cores disponíveis do produto
  const availableColors = product.variations
    ? Array.from(new Set(product.variations.map(v => v.color?.name).filter(Boolean)))
    : [];

  // Tamanhos disponíveis para a cor selecionada
  const availableSizes = product.variations
    ? product.variations
        .filter(v => v.color?.name === selectedColor)
        .map(v => v.size?.name)
        .filter(Boolean)
    : [];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Roupas', href: '/products' },
    { label: 'Camisetas', href: '/products?category=camisetas' },
    { label: product.title }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {toast && (
        <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4">
          <div className="rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 text-sm font-medium shadow-xl">
            {toast}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          {/* Galeria de Imagens */}
          <ProductGallery images={images} productTitle={product.title} />

          {/* Informações do Produto */}
          <div className="flex flex-col gap-6">
            <div>
              {product.brand && typeof product.brand === 'object' && 'name' in product.brand && (
                <p className="text-sm font-semibold text-primary">
                  {product.brand.name}
                </p>
              )}
              <h1 className="text-text-light dark:text-text-dark text-4xl font-bold leading-tight tracking-tight mt-1">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined !text-xl">
                      star
                    </span>
                  ))}
                </div>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  (123 avaliações)
                </p>
              </div>
            </div>

            <p className="text-4xl font-bold text-text-light dark:text-text-dark">
              {priceBRL}
            </p>

            {/* Seleção de Cor e Tamanho */}
            <div className="flex flex-col gap-4">
              {availableColors.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-text-light dark:text-text-dark">
                    Cor: <span className="font-bold">{selectedColor}</span>
                  </label>
                  <div className="flex gap-3 mt-2">
                    {availableColors.map((color) => {
                      const variation = product.variations?.find(v => v.color?.name === color);
                      const hexCode = variation?.color?.hexCode || '#cccccc';
                      const isSelected = selectedColor === color;
                      
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color as string)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary ring-offset-2'
                              : 'border-border-light dark:border-border-dark hover:border-primary'
                          }`}
                          style={{ backgroundColor: hexCode }}
                          title={color as string}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-medium text-text-light dark:text-text-dark">
                      Tamanho
                    </label>
                    <a
                      href="#"
                      className="text-xs text-subtle-light dark:text-subtle-dark hover:text-primary"
                    >
                      Guia de tamanhos
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size as string)}
                          className={`flex items-center justify-center rounded-lg h-10 px-4 text-sm font-bold transition-all ${
                            isSelected
                              ? 'border-2 border-primary bg-primary/10 text-primary'
                              : 'border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-primary'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quantidade */}
            <div className="flex flex-col">
              <label className="text-sm font-normal text-text-light dark:text-text-dark mb-2">
                Quantidade
              </label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={product.inventory ?? 100}
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border-light dark:border-border-dark">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.inventory === 0}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                {adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </button>
              <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-primary border-2 border-primary gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">favorite</span>
                Adicionar à Lista de Desejos
              </button>
            </div>

            {/* Calcular Frete */}
            <div className="border-t border-border-light dark:border-border-dark pt-4">
              <p className="text-sm font-medium text-text-light dark:text-text-dark">
                Calcular frete e prazo
              </p>
              <div className="flex items-start gap-2 mt-2">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark !text-xl">
                    local_shipping
                  </span>
                  <input
                    type="text"
                    placeholder="Digite seu CEP"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 placeholder:text-subtle-light dark:placeholder:text-subtle-dark pl-10 pr-4 text-sm font-normal leading-normal"
                  />
                </div>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 shrink-0 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                  Simular
                </button>
              </div>
              <a
                href="#"
                className="text-xs text-subtle-light dark:text-subtle-dark hover:text-primary mt-1 inline-block"
              >
                Não sei meu CEP
              </a>
            </div>

            {/* Descrição */}
            {product.description && (
              <p className="text-base text-subtle-light dark:text-subtle-dark leading-relaxed pt-4">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Tabs de Detalhes */}
        <div className="py-16">
          <ProductTabs
            tabs={[
              {
                title: 'Detalhes do Produto',
                content: (
                  <div className="text-subtle-light dark:text-subtle-dark prose prose-sm max-w-none">
                    <p>
                      {product.description || 
                        'Nossa camiseta premium redefine o conceito de básico. Com modelagem contemporânea e atenção aos detalhes, é a peça que você vai querer usar todos os dias.'}
                    </p>
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                      <ul className="mt-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ),
                defaultOpen: true
              },
              {
                title: 'Composição e Cuidados',
                content: (
                  <div className="text-subtle-light dark:text-subtle-dark prose prose-sm max-w-none">
                    {product.material && (
                      <p>
                        <strong>Material:</strong> {product.material}
                      </p>
                    )}
                    {product.careInstructions ? (
                      <p className="whitespace-pre-wrap">{product.careInstructions}</p>
                    ) : (
                      <ul>
                        <li>Lavar à mão ou na máquina com água fria</li>
                        <li>Não usar alvejante</li>
                        <li>Passar em temperatura baixa se necessário</li>
                        <li>Não lavar a seco</li>
                      </ul>
                    )}
                  </div>
                )
              },
              {
                title: 'Avaliações de Clientes (123)',
                content: (
                  <div className="text-subtle-light dark:text-subtle-dark prose prose-sm max-w-none">
                    <p>Veja o que nossos clientes estão dizendo sobre este produto.</p>
                  </div>
                )
              }
            ]}
          />
        </div>

        {/* Produtos Relacionados */}
        <RelatedProducts products={[]} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
