import React from 'react';
import type { Category, FilterState, Size, Color, Brand } from '@/types';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  onRemoveFilter?: (key: keyof FilterState, value?: string | number | boolean | [number, number]) => void;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
  brands: Brand[];
  isLoading?: boolean;
  priceLimits?: {
    min: number;
    max: number;
  };
}

const RATING_OPTIONS = [5, 4, 3, 2];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  onRemoveFilter,
  categories,
  sizes,
  colors,
  brands,
  isLoading = false,
  priceLimits = { min: 0, max: 10000 },
}) => {
  const updateFilters = (partial: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const handleArrayToggle = (key: 'colors' | 'sizes' | 'brands', value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    updateFilters({ [key]: updated } as Partial<FilterState>);
  };

  const handleCategoryToggle = (categoryId: string) => {
    updateFilters({ categoryId: filters.categoryId === categoryId ? undefined : categoryId });
  };

  const handlePriceInput = (index: 0 | 1, value: number) => {
    const clamped = Math.min(Math.max(value, priceLimits.min), priceLimits.max);
    const range = [...filters.priceRange] as [number, number];
    if (index === 0) {
      range[0] = Math.min(clamped, range[1]);
    } else {
      range[1] = Math.max(clamped, range[0]);
    }
    updateFilters({ priceRange: range });
  };

  const handleStockToggle = () => {
    updateFilters({ inStock: !filters.inStock });
  };

  const handleRatingChange = (rating?: number) => {
    updateFilters({ rating });
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  // Funções para obter nomes de IDs
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const getSizeName = (sizeId: string) => {
    const size = sizes.find(s => s.id === sizeId);
    return size?.name || sizeId;
  };

  const getColorName = (colorId: string) => {
    const color = colors.find(c => c.id === colorId);
    return color?.name || colorId;
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand?.name || brandId;
  };

  // Construir lista de filtros ativos
  const activeFilters: Array<{
    key: keyof FilterState;
    label: string;
    value: string | number | boolean | [number, number];
  }> = [];

  if (filters.categoryId) {
    activeFilters.push({
      key: 'categoryId',
      label: `Categoria: ${getCategoryName(filters.categoryId)}`,
      value: filters.categoryId,
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
    activeFilters.push({
      key: 'priceRange',
      label: `Preço: R$ ${filters.priceRange[0]} - R$ ${filters.priceRange[1]}`,
      value: filters.priceRange,
    });
  }

  if (filters.inStock) {
    activeFilters.push({
      key: 'inStock',
      label: 'Em estoque',
      value: true,
    });
  }

  if (filters.search) {
    activeFilters.push({
      key: 'search',
      label: `Busca: "${filters.search}"`,
      value: filters.search,
    });
  }

  filters.sizes.forEach(size => {
    activeFilters.push({
      key: 'sizes',
      label: `Tamanho: ${getSizeName(size)}`,
      value: size,
    });
  });

  filters.colors.forEach(color => {
    activeFilters.push({
      key: 'colors',
      label: `Cor: ${getColorName(color)}`,
      value: color,
    });
  });

  filters.brands.forEach(brand => {
    activeFilters.push({
      key: 'brands',
      label: `Marca: ${getBrandName(brand)}`,
      value: brand,
    });
  });

  if (filters.rating) {
    activeFilters.push({
      key: 'rating',
      label: `${filters.rating} estrelas ou mais`,
      value: filters.rating,
    });
  }

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div
        className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-5 px-4 lg:px-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D1D5DB transparent',
          msOverflowStyle: '-ms-autohiding-scrollbar',
        }}
      >
        <div className="flex justify-between items-center lg:sticky lg:top-0 lg:bg-white lg:dark:bg-slate-950 lg:z-20 lg:pb-4 lg:pt-4 mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filtros</h3>
          <button onClick={onClearFilters} className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors">
            Limpar tudo
          </button>
        </div>

        {/* FILTROS ATIVOS */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {activeFilters.map((filter, index) => (
              <button
                key={`${filter.key}-${index}`}
                onClick={() => onRemoveFilter && onRemoveFilter(filter.key, filter.value)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-primary text-white rounded-full hover:bg-primary/90 active:scale-95 transition-all"
                title={`Remover ${filter.label}`}
              >
                {filter.label}
                <span className="text-sm font-bold leading-none">×</span>
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Carregando filtros...</p>
          </div>
        ) : (
          <div className="space-y-5 lg:pb-6">
            {/* CATEGORIA - PRIMEIRO */}
            {categories.length > 0 && (
              <>
                <details className="group" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">category</span>
                      Categoria
                    </span>
                    <span className="transition-transform group-open:rotate-180">
                      <span className="material-symbols-outlined !text-base">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-3 space-y-2.5">
                    {categories.map((category: Category) => (
                      <label key={category.id} className="flex items-center gap-3 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                        <input
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          type="radio"
                          name="category"
                          checked={filters.categoryId === category.id}
                          onChange={() => handleCategoryToggle(category.id)}
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                </details>
                <div className="h-px bg-gray-200 dark:bg-gray-700" />
              </>
            )}

            {/* PREÇO - SEGUNDO */}
            <details className="group" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">local_offer</span>
                  Preço
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <span className="material-symbols-outlined !text-base">expand_more</span>
                </span>
              </summary>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
                  <span>{formatCurrency(filters.priceRange[0])}</span>
                  <span>até</span>
                  <span>{formatCurrency(filters.priceRange[1])}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                    value={filters.priceRange[0]}
                    min={priceLimits.min}
                    max={priceLimits.max}
                    onChange={(event) => handlePriceInput(0, Number(event.target.value))}
                  />
                  <span className="text-xs text-gray-400">—</span>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                    value={filters.priceRange[1]}
                    min={priceLimits.min}
                    max={priceLimits.max}
                    onChange={(event) => handlePriceInput(1, Number(event.target.value))}
                  />
                </div>

                {/* SUGESTÕES DE PREÇO */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                    Sugestões
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        updateFilters({ priceRange: [0, 100] });
                      }}
                      className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all hover:border-primary ${
                        filters.priceRange[0] === 0 && filters.priceRange[1] === 100
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      Até R$ 100
                    </button>
                    <button
                      onClick={() => {
                        updateFilters({ priceRange: [100, 500] });
                      }}
                      className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all hover:border-primary ${
                        filters.priceRange[0] === 100 && filters.priceRange[1] === 500
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      R$ 100-500
                    </button>
                    <button
                      onClick={() => {
                        updateFilters({ priceRange: [500, priceLimits.max] });
                      }}
                      className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all hover:border-primary ${
                        filters.priceRange[0] === 500 && filters.priceRange[1] === priceLimits.max
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      Acima de R$ 500
                    </button>
                  </div>
                </div>
              </div>
            </details>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* COR - TERCEIRO */}
            <details className="group" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">palette</span>
                  Cor
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <span className="material-symbols-outlined !text-base">expand_more</span>
                </span>
              </summary>
              <div className="mt-3 flex flex-wrap gap-2">
                {colors.map((color: Color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleArrayToggle('colors', color.id)}
                    className={`size-9 rounded-full border-2 transition-all hover:scale-110 ${
                      filters.colors.includes(color.id)
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary/70'
                    }`}
                    style={{ backgroundColor: color.hexCode || '#000000' }}
                    aria-label={`Cor ${color.name}`}
                    title={color.name}
                  />
                ))}
              </div>
            </details>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* TAMANHO - QUARTO */}
            <details className="group" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">straighten</span>
                  Tamanho
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <span className="material-symbols-outlined !text-base">expand_more</span>
                </span>
              </summary>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {sizes.map((size: Size) => (
                  <label
                    key={size.id}
                    className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all hover:border-primary ${
                      filters.sizes.includes(size.id)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      className="sr-only"
                      name="size"
                      type="checkbox"
                      checked={filters.sizes.includes(size.id)}
                      onChange={() => handleArrayToggle('sizes', size.id)}
                    />
                    {size.name}
                  </label>
                ))}
              </div>
            </details>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* MARCA - QUINTO */}
            {brands.length > 0 && (
              <>
                <details className="group" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">business</span>
                      Marca
                    </span>
                    <span className="transition-transform group-open:rotate-180">
                      <span className="material-symbols-outlined !text-base">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-3 space-y-2.5 max-h-48 overflow-y-auto pr-2" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#D1D5DB transparent',
                  }}>
                    {brands.map((brand: Brand) => (
                      <label key={brand.id} className="flex items-center gap-3 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={filters.brands.includes(brand.id)}
                          onChange={() => handleArrayToggle('brands', brand.id)}
                        />
                        <span>{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </details>
                <div className="h-px bg-gray-200 dark:bg-gray-700" />
              </>
            )}

            {/* AVALIAÇÃO - SEXTO */}
            <details className="group" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">star</span>
                  Avaliação
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <span className="material-symbols-outlined !text-base">expand_more</span>
                </span>
              </summary>
              <div className="mt-3 space-y-2">
                {RATING_OPTIONS.map((rating) => (
                  <label key={rating} className="flex items-center gap-3 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                    <input
                      type="radio"
                      name="rating"
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(filters.rating === rating ? undefined : rating)}
                    />
                    <span className="flex items-center gap-1">
                      {rating}
                      <span className="material-symbols-outlined !text-sm text-yellow-400">star</span>
                      <span className="text-xs text-gray-500">ou mais</span>
                    </span>
                  </label>
                ))}
                <button
                  onClick={() => handleRatingChange(undefined)}
                  className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors mt-1"
                >
                  Limpar
                </button>
              </div>
            </details>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* DISPONIBILIDADE - SÉTIMO */}
            <details className="group" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  Disponibilidade
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <span className="material-symbols-outlined !text-base">expand_more</span>
                </span>
              </summary>
              <div className="mt-3">
                <label className="flex items-center gap-3 text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    checked={filters.inStock}
                    onChange={handleStockToggle}
                  />
                  Apenas em estoque
                </label>
              </div>
            </details>
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
