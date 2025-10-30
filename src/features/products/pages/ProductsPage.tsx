/**
 * Página de Produtos (exemplo de refatoração)
 * Localização: src/features/products/pages/ProductsPage.tsx
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { FilterSidebar, ProductCard, ActiveFilters } from '../components';
import { GET_PRODUCTS, GET_CATEGORIES, GET_ARTISANS } from '@/graphql/queries';
import type { Product, Category, FilterState } from '@/types';

interface ProductsQueryResult {
  products: Product[];
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
    sortBy: { field: 'CREATED_AT', order: 'DESC' },
  });

  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    categories: Category[];
  }>(GET_CATEGORIES);

  const { data: artisansData } = useQuery<{
    artisans: Array<{ id: string; name: string; email: string; role: string; status: string }>;
  }>(GET_ARTISANS);

  const { data, loading, error } = useQuery<ProductsQueryResult>(GET_PRODUCTS);

  // Filtrar produtos no frontend
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let result = [...data.products];

    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de categoria
    if (filters.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId);
    }

    // Filtro de preço
    result = result.filter(p => {
      const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filtro de estoque
    if (filters.inStock) {
      result = result.filter(p => (p.inventory || 0) > 0);
    }

    // Ordenação
    result.sort((a, b) => {
      const field = filters.sortBy.field;
      const order = filters.sortBy.order === 'ASC' ? 1 : -1;

      if (field === 'PRICE') {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return (priceA - priceB) * order;
      }
      
      if (field === 'TITLE') {
        return (a.title || '').localeCompare(b.title || '') * order;
      }
      
      if (field === 'CREATED_AT') {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return (dateA - dateB) * order;
      }

      return 0;
    });

    return result;
  }, [data?.products, filters]);

  // Paginação no frontend
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(page * pageSize, (page + 1) * pageSize);

  const products = paginatedProducts;
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
      sortBy: { field: 'CREATED_AT', order: 'DESC' },
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
          Encontre os melhores produtos entre {filteredProducts.length} opções
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
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-secondary rounded hover:bg-secondary/80 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages - 1}
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
