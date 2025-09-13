import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { SEARCH_PRODUCTS, GET_CATEGORIES, GET_ARTISANS, GET_SIZES, GET_COLORS } from '../graphql/queries';
import type { Product, FilterState, Category, Size, Color } from '../types';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import ActiveFilters from '../components/ActiveFilters';
import Button from '../ui/Button';

interface SearchProductsQueryResult {
  searchProducts: {
    products: Product[];
    totalCount: number;
    totalPages: number;
  };
}

const Products = () => {
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

  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];

  const { data: artisansData } = useQuery<{ artisans: { id: string; name: string; email: string; role: string; status: string }[] }>(GET_ARTISANS);
  const artisans = artisansData?.artisans || [];

  const { data: sizesData } = useQuery<{ sizes: Size[] }>(GET_SIZES);
  const sizes = sizesData?.sizes || [];

  const { data: colorsData } = useQuery<{ colors: Color[] }>(GET_COLORS);
  const colors = colorsData?.colors || [];

  const { loading, error, data } = useQuery<SearchProductsQueryResult>(SEARCH_PRODUCTS, {
    variables: {
      categoryId: filters.categoryId,
      title: filters.search || undefined,
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < 1000 ? filters.priceRange[1] : undefined,
      sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
      colors: filters.colors.length > 0 ? filters.colors : undefined,
      inStock: filters.inStock || undefined,
      rating: filters.rating,
      sortField: (
        filters.sortBy.field === 'price' ? 'PRICE' :
        filters.sortBy.field === 'createdAt' ? 'CREATED_AT' :
        filters.sortBy.field === 'title' ? 'TITLE' : 'RATING'
      ),
      sortOrder: filters.sortBy.order,
      page: 0,
      size: 50,
    },
  });

  // Filtrar e ordenar produtos (agora principalmente no backend)
  const filteredProducts = useMemo(() => {
    if (!data?.searchProducts?.products) return [];

  // Clona o array vindo do Apollo (imutável) para poder ordenar sem erros
  const filtered = [...data.searchProducts.products];

    // Ordenação adicional se necessário (o backend já filtra, mas podemos ordenar localmente)
    filtered.sort((a: Product, b: Product) => {
      const { field, order } = filters.sortBy;
      let aValue: string | number;
      let bValue: string | number;

      switch (field) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'rating':
          // Ordenação real por rating é feita no backend; aqui não reordenamos para manter consistência
          return 0;
        default:
          return 0;
      }

      if (order === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data?.searchProducts?.products, filters.sortBy]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
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
  };

  const handleRemoveFilter = (key: keyof FilterState, value?: string | number | boolean | [number, number]) => {
    if (key === 'categoryId') {
      setFilters(prev => ({ ...prev, categoryId: undefined }));
    } else if (key === 'priceRange') {
      setFilters(prev => ({ ...prev, priceRange: [0, 1000] }));
    } else if (key === 'inStock') {
      setFilters(prev => ({ ...prev, inStock: false }));
    } else if (key === 'search') {
      setFilters(prev => ({ ...prev, search: '' }));
    } else if (key === 'sizes' && typeof value === 'string') {
      setFilters(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== value),
      }));
    } else if (key === 'colors' && typeof value === 'string') {
      setFilters(prev => ({
        ...prev,
        colors: prev.colors.filter(c => c !== value),
      }));
    } else if (key === 'brands' && typeof value === 'string') {
      setFilters(prev => ({
        ...prev,
        brands: prev.brands.filter(b => b !== value),
      }));
    } else if (key === 'rating') {
      setFilters(prev => ({ ...prev, rating: undefined }));
    }
  };

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Carregando produtos...</div>;
  if (error) return <div className="text-red-600">Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-80 mr-8">
        {categoriesError ? (
          <div className="w-80 p-4">
            <div className="text-sm text-red-600 dark:text-red-400">
              Erro ao carregar categorias: {categoriesError.message}
            </div>
          </div>
        ) : categoriesLoading ? (
          <div className="w-80 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Carregando filtros...</div>
          </div>
        ) : (
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            categories={categories}
            artisans={artisans}
          />
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Catálogo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {data?.searchProducts?.totalCount || filteredProducts.length} produtos encontrados
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm text-gray-600 dark:text-gray-300">
                Ordenar por:
              </label>
              <select
                id="sort-select"
                value={`${filters.sortBy.field}-${filters.sortBy.order}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as ['price' | 'createdAt' | 'title' | 'rating', 'ASC' | 'DESC'];
                  setFilters(prev => ({
                    ...prev,
                    sortBy: { field, order },
                  }));
                }}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="createdAt-DESC">Mais recentes</option>
                <option value="price-ASC">Preço: Menor para maior</option>
                <option value="price-DESC">Preço: Maior para menor</option>
                <option value="title-ASC">Nome: A-Z</option>
                <option value="title-DESC">Nome: Z-A</option>
                <option value="rating-DESC">Melhor avaliado</option>
              </select>
            </div>
            {/* Mobile filter toggle - can be implemented later */}
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters
          filters={filters}
          categories={categories}
          sizes={sizes}
          colors={colors}
          onRemoveFilter={handleRemoveFilter}
        />

        {/* Products Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Nenhum produto encontrado com os filtros aplicados.</p>
            <Button variant="secondary" onClick={handleClearFilters} className="mt-4">
              Limpar Filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;