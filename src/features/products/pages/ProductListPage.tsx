import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../hooks/useProducts";
import { FilterSidebar, ProductCard } from "../components";
import { Breadcrumb, Pagination } from "@/shared/components/common";
import { catalogService } from "@/services";
import { Button } from "@/ui/Button";
import { Container } from "@/ui/Container";
import type {
  Product,
  FilterState,
  Category,
  Size,
  Color,
  Brand,
  ProductSort,
} from "@/types";

interface SortOption extends ProductSort {
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Relevância", field: "CREATED_AT", order: "DESC" },
  { label: "Novidades", field: "CREATED_AT", order: "DESC" },
  { label: "Maior Preço", field: "PRICE", order: "DESC" },
  { label: "Menor Preço", field: "PRICE", order: "ASC" },
  { label: "Melhor Avaliação", field: "RATING", order: "DESC" },
];

const PRICE_LIMITS = { min: 0, max: 10000 } as const;

const createInitialFilters = (): FilterState => ({
  categoryId: undefined,
  priceRange: [PRICE_LIMITS.min, PRICE_LIMITS.max],
  inStock: false,
  search: "",
  sizes: [],
  colors: [],
  brands: [],
  rating: undefined,
  sortBy: { field: "CREATED_AT", order: "DESC" },
});

const PAGE_SIZE = 12;

const ProductListPage = () => {
  const [filters, setFilters] = useState<FilterState>(() =>
    createInitialFilters()
  );
  const [page, setPage] = useState(0);

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useProducts();

  const { data: sizes = [], isLoading: sizesLoading } = useQuery({
    queryKey: ["sizes"],
    queryFn: catalogService.getSizes,
  });

  const { data: colors = [], isLoading: colorsLoading } = useQuery({
    queryKey: ["colors"],
    queryFn: catalogService.getColors,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogService.getCategories,
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: catalogService.getBrands,
  });

  const filtersLoading = sizesLoading || colorsLoading || brandsLoading;

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters(createInitialFilters());
    setPage(0);
  };

  const handleRemoveFilter = (
    key: keyof FilterState,
    value?: string | number | boolean | [number, number]
  ) => {
    setFilters((prev) => {
      if (key === "sizes" && typeof value === "string") {
        return { ...prev, sizes: prev.sizes.filter((s) => s !== value) };
      }
      if (key === "colors" && typeof value === "string") {
        return { ...prev, colors: prev.colors.filter((c) => c !== value) };
      }
      if (key === "brands" && typeof value === "string") {
        return { ...prev, brands: prev.brands.filter((b) => b !== value) };
      }
      if (key === "categoryId") {
        return { ...prev, categoryId: undefined };
      }
      if (key === "priceRange") {
        return { ...prev, priceRange: [PRICE_LIMITS.min, PRICE_LIMITS.max] };
      }
      if (key === "inStock") {
        return { ...prev, inStock: false };
      }
      if (key === "search") {
        return { ...prev, search: "" };
      }
      if (key === "rating") {
        return { ...prev, rating: undefined };
      }
      return prev;
    });
    setPage(0);
  };

  const handleSortChange = (option: SortOption) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: { field: option.field, order: option.order },
    }));
    setPage(0);
  };

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [] as Product[];
    }

    const matchesSearch = (product: Product) => {
      if (!filters.search.trim()) return true;
      const searchLower = filters.search.toLowerCase();
      return (
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    };

    const matchesCategory = (product: Product) => {
      if (!filters.categoryId) return true;
      const productCategoryId = product.categoryId || product.category?.id;
      return productCategoryId === filters.categoryId;
    };

    const matchesPrice = (product: Product) => {
      const price =
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    };

    const matchesStock = (product: Product) => {
      if (!filters.inStock) return true;
      return (
        (product.inventory || 0) > 0 ||
        product.variations?.some((variation) => variation.quantity > 0)
      );
    };

    const matchesSizes = (product: Product) => {
      if (!filters.sizes.length) return true;
      const sizeIds = new Set<string>();
      product.variations?.forEach((variation) => {
        const id = variation.size?.id || variation.size?.code;
        if (id) sizeIds.add(id);
      });
      product.sizes?.forEach((size) => {
        if (size.id) sizeIds.add(size.id);
        if (size.code) sizeIds.add(size.code);
      });
      return filters.sizes.some((sizeId) => sizeIds.has(sizeId));
    };

    const matchesColors = (product: Product) => {
      if (!filters.colors.length) return true;
      const colorIds = new Set<string>();
      product.variations?.forEach((variation) => {
        const id = variation.color?.id || variation.color?.code;
        if (id) colorIds.add(id);
      });
      product.colors?.forEach((color) => {
        if (color.id) colorIds.add(color.id);
        if (color.code) colorIds.add(color.code);
      });
      return filters.colors.some((colorId) => colorIds.has(colorId));
    };

    const matchesBrands = (product: Product) => {
      if (!filters.brands.length) return true;
      const brandId = product.brand?.id?.toString();
      return brandId ? filters.brands.includes(brandId) : false;
    };

    const matchesRating = (product: Product) => {
      if (!filters.rating) return true;
      const rating = product.rating ?? 0;
      return rating >= filters.rating;
    };

    const sortProducts = (list: Product[]) => {
      const { field, order } = filters.sortBy;
      const direction = order === "ASC" ? 1 : -1;

      return [...list].sort((a, b) => {
        if (field === "PRICE") {
          const priceA =
            typeof a.price === "string" ? parseFloat(a.price) : a.price;
          const priceB =
            typeof b.price === "string" ? parseFloat(b.price) : b.price;
          return (priceA - priceB) * direction;
        }

        if (field === "TITLE") {
          return (a.title || "").localeCompare(b.title || "") * direction;
        }

        if (field === "RATING") {
          const ratingA = a.rating ?? 0;
          const ratingB = b.rating ?? 0;
          return (ratingA - ratingB) * direction;
        }

        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return (dateA - dateB) * direction;
      });
    };

    const filtered = products.filter(
      (product) =>
        matchesSearch(product) &&
        matchesCategory(product) &&
        matchesPrice(product) &&
        matchesStock(product) &&
        matchesSizes(product) &&
        matchesColors(product) &&
        matchesBrands(product) &&
        matchesRating(product)
    );

    return sortProducts(filtered);
  }, [products, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );
  const paginatedProducts = filteredProducts.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  return (
    <Container>
      <div className="py-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Produtos" }]}
        />

        <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onRemoveFilter={handleRemoveFilter}
            categories={categories as Category[]}
            sizes={sizes as Size[]}
            colors={colors as Color[]}
            brands={brands as Brand[]}
            isLoading={filtersLoading}
            priceLimits={PRICE_LIMITS}
          />

          <div className="w-full">

            <div className="flex-1">
              <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-primary uppercase tracking-widest">
                      Coleção Exclusiva
                    </p>
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                      Todos os Produtos
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {filteredProducts.length} produtos encontrados
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleSortChange(option)}
                      className={`flex items-center justify-center gap-2 h-9 px-4 rounded-full border text-sm font-medium transition-colors ${
                        filters.sortBy.field === option.field &&
                        filters.sortBy.order === option.order
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {productsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Carregando produtos...
                </p>
              </div>
            ) : productsError ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
                  Ocorreu um erro ao carregar os produtos
                </div>
                <Button onClick={() => window.location.reload()}>
                  Tentar novamente
                </Button>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-6xl text-gray-300 dark:text-gray-700">
                  <span className="material-symbols-outlined !text-7xl">shopping_bag</span>
                </div>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  Nenhum produto encontrado
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Tente ajustar os filtros e procure novamente
                </p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
                {paginatedProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductListPage;
