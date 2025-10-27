/**
 * Página de Produtos (exemplo de refatoração)
 * Localização: src/features/products/pages/ProductsPage.tsx
 */

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FilterSidebar, ProductCard, ActiveFilters } from '../components';
import { SEARCH_PRODUCTS, GET_CATEGORIES, GET_ARTISANS } from '@/graphql/queries';
import type { Product, Category, FilterState } from '@/types';

interface SearchProductsQueryResult {
  searchProducts: {
    products: Product[];
    totalCount: number;
    totalPages: number;
  };
}

export const ProductsPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    categoryId: undefined,
    priceRange: [0, 1000],
    inStock: false,
    search: '',
    sizes: [],
    colors: [],
    brands: [],
    rating: undefined,
    sortBy: { field: 'createdAt', order: 'DESC' },
  });

  const [page, setPage] = useState(0);

  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    categories: Category[];
  }>(GET_CATEGORIES);

  const { data: artisansData } = useQuery<{
    artisans: Array<{ id: string; name: string; email: string; role: string; status: string }>;
  }>(GET_ARTISANS);

  const { data, loading, error } = useQuery<SearchProductsQueryResult>(SEARCH_PRODUCTS, {
    variables: {
      search: filters.search,
      categoryId: filters.categoryId,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      inStock: filters.inStock,
      sizes: filters.sizes,
      colors: filters.colors,
      brands: filters.brands,
      rating: filters.rating,
      page,
      size: 20, // Default page size
      sortBy: filters.sortBy.field,
      sortOrder: filters.sortBy.order,
    },
  });

  const products = data?.searchProducts.products || [];
  const categories = categoriesData?.categories || [];
  const artisans = artisansData?.artisans || [];

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0); // Reset para primeira página ao filtrar
  };

  const handleClearFilters = () => {
    setFilters({
      categoryId: undefined,
      priceRange: [0, 1000],
      inStock: false,
      search: '',
      sizes: [],
      colors: [],
      brands: [],
      rating: undefined,
      sortBy: { field: 'createdAt', order: 'DESC' },
    });
    setPage(0);
  };

  if (categoriesLoading) {
    return <div className="text-center py-8">Carregando categorias...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
        <p className="text-muted-foreground mt-1">
          Encontre os melhores produtos entre {data?.searchProducts.totalCount || 0} opções
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Filtros */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            categories={categories}
            artisans={artisans}
          />
        </div>

        {/* Produtos */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filtros Ativos */}
          <ActiveFilters
            filters={filters}
            categories={categories}
            sizes={[]} // Get from API
            colors={[]} // Get from API
            onRemoveFilter={() => {
              // Implementar lógica de remoção de filtro
            }}
          />

          {/* Grid de Produtos */}
          {loading ? (
            <div className="text-center py-8">Carregando produtos...</div>
          ) : error ? (
            <div className="text-center text-destructive py-8">
              Erro ao carregar produtos
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto encontrado
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Paginação */}
          {data && data.searchProducts.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-secondary rounded hover:bg-secondary/80 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2">
                Página {page + 1} de {data.searchProducts.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.searchProducts.totalPages - 1}
                className="px-4 py-2 bg-secondary rounded hover:bg-secondary/80 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
