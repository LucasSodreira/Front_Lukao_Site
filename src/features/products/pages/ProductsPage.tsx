/**
 * Página de Produtos - Listagem com Filtros e Paginação
 * Localização: src/features/products/pages/ProductsPage.tsx
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { FilterSidebar, ProductCard, ActiveFilters } from '../components';
import { Breadcrumb, Pagination } from '@/shared/components/common';
import { GET_PRODUCTS, GET_SIZES, GET_COLORS, GET_CATEGORIES } from '@/graphql/queries';
import type { Product, FilterState, Size, Color, Category } from '@/types';
import { ErrorHandler, logger } from '@/utils';
import { Button } from '@/ui/Button';

interface ProductsQueryResult {
  products: Product[];
}

interface SortOption {
  label: string;
  field: 'CREATED_AT' | 'PRICE' | 'TITLE';
  order: 'ASC' | 'DESC';
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevância', field: 'CREATED_AT', order: 'DESC' },
  { label: 'Novidades', field: 'CREATED_AT', order: 'DESC' },
  { label: 'Maior Preço', field: 'PRICE', order: 'DESC' },
  { label: 'Menor Preço', field: 'PRICE', order: 'ASC' },
];

export const ProductsPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    categoryId: undefined,
    priceRange: [0, 10000],
    inStock: false,
    search: '',
    sizes: [],
    colors: [],
    brands: [],
    rating: undefined,
    sortBy: { field: 'CREATED_AT', order: 'DESC' },
  });

  const [page, setPage] = useState(0);
  const [selectedSort, setSelectedSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const pageSize = 12;

  const { data, loading, error } = useQuery<ProductsQueryResult>(GET_PRODUCTS);
  const { data: sizesData } = useQuery<{ sizes: Size[] }>(GET_SIZES);
  const { data: colorsData } = useQuery<{ colors: Color[] }>(GET_COLORS);
  const { data: categoriesData } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  const sizes = sizesData?.sizes || [];
  const colors = colorsData?.colors || [];
  const categories = categoriesData?.categories || [];

  // Filtrar e ordenar produtos no frontend
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
      const field = selectedSort.field;
      const order = selectedSort.order === 'ASC' ? 1 : -1;

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
  }, [data?.products, filters, selectedSort]);

  // Paginação no frontend
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(page * pageSize, (page + 1) * pageSize);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0); // Reset para primeira página ao filtrar
  };

  const handleClearFilters = () => {
    setFilters({
      categoryId: undefined,
      priceRange: [0, 10000],
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

  const handleRemoveFilter = (key: keyof FilterState, value?: string | number | boolean | [number, number]) => {
    const newFilters = { ...filters };
    
    if (key === 'sizes' && typeof value === 'string') {
      newFilters.sizes = newFilters.sizes.filter(s => s !== value);
    } else if (key === 'colors' && typeof value === 'string') {
      newFilters.colors = newFilters.colors.filter(c => c !== value);
    } else if (key === 'brands' && typeof value === 'string') {
      newFilters.brands = newFilters.brands.filter(b => b !== value);
    } else if (key === 'categoryId') {
      newFilters.categoryId = undefined;
    } else if (key === 'priceRange') {
      newFilters.priceRange = [0, 10000];
    } else if (key === 'inStock') {
      newFilters.inStock = false;
    } else if (key === 'search') {
      newFilters.search = '';
    } else if (key === 'rating') {
      newFilters.rating = undefined;
    }
    
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Produtos' },
        ]}
      />

      {/* Página principal */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar de Filtros */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          categories={categories}
        />

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {/* Header com Título */}
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Coleção Outono/Inverno
            </h1>
          </div>

          {/* Filtros Ativos */}
          <ActiveFilters
            filters={filters}
            categories={categories}
            sizes={sizes}
            colors={colors}
            onRemoveFilter={handleRemoveFilter}
          />

          {/* Controles de Ordenação */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex gap-2 items-center flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedSort(option)}
                  className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors text-sm font-medium ${
                    selectedSort.label === option.label
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
              Exibindo {paginatedProducts.length > 0 ? (page * pageSize) + 1 : 0} de {filteredProducts.length} produtos
            </p>
          </div>

          {/* Grid de Produtos */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Carregando produtos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
                {(() => {
                  logger.error('Erro ao carregar produtos', { error: error.message });
                  return ErrorHandler.getUserFriendlyMessage(error);
                })()}
              </div>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Nenhum produto encontrado com os filtros selecionados
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
              {paginatedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Paginação */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
