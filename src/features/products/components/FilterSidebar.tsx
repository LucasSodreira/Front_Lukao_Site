import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_SIZES, GET_COLORS } from '@/graphql/queries';
import type { Category, FilterState, Size, Color } from '@/types';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import Input from '@/ui/Input';
import { Button } from '@/ui/Button';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  categories: Category[];
  artisans: Artisan[];
}

interface Artisan {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
  artisans,
}) => {
  const { data: sizesData } = useQuery<{ sizes: Size[] }>(GET_SIZES);
  const { data: colorsData } = useQuery<{ colors: Color[] }>(GET_COLORS);

  const sizes = sizesData?.sizes || [];
  const colors = colorsData?.colors || [];

  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [localSearch, setLocalSearch] = useState<string>(filters.search || '');

  // Sincroniza quando filtros externos mudam
  useEffect(() => {
    setLocalFilters(filters);
    setLocalSearch(filters.search || '');
  }, [filters]);

  // Aplicar busca apenas quando usuário confirmar (Enter ou botão IR)
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nf: FilterState = { ...localFilters, search: localSearch };
    setLocalFilters(nf);
    onFiltersChange(nf);
  };

  const handleCategoryChange = (categoryId: string) => {
    const newFilters: FilterState = {
      ...localFilters,
      categoryId: localFilters.categoryId === categoryId ? undefined : categoryId,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (min: number, max: number) => {
    const newFilters: FilterState = {
      ...localFilters,
      priceRange: [min, max],
    } as FilterState;
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleInStockChange = (inStock: boolean) => {
    const newFilters: FilterState = {
      ...localFilters,
      inStock,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSizeToggle = (sizeId: string) => {
    const newSizes = localFilters.sizes.includes(sizeId)
      ? localFilters.sizes.filter((s) => s !== sizeId)
      : [...localFilters.sizes, sizeId];
    const newFilters: FilterState = { ...localFilters, sizes: newSizes };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleColorToggle = (colorId: string) => {
    const newColors = localFilters.colors.includes(colorId)
      ? localFilters.colors.filter((c) => c !== colorId)
      : [...localFilters.colors, colorId];
    const newFilters: FilterState = { ...localFilters, colors: newColors };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter((b) => b !== brand)
      : [...localFilters.brands, brand];
    const newFilters: FilterState = { ...localFilters, brands: newBrands };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters: FilterState = {
      ...localFilters,
      rating: localFilters.rating === rating ? undefined : rating,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Limpar Tudo
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardBody>
          <CardTitle>Buscar</CardTitle>
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              IR
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Availability */}
      <Card>
        <CardBody>
          <CardTitle>Disponibilidade</CardTitle>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="text-gray-900 dark:text-gray-100"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Apenas em estoque</span>
          </label>
        </CardBody>
      </Card>

      {/* Categories */}
      <Card>
        <CardBody>
          <CardTitle>Categorias</CardTitle>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Carregando categorias...</p>
            ) : (
              categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={localFilters.categoryId === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                    className="text-gray-900 dark:text-gray-100"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                </label>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Price Range */}
      <Card>
        <CardBody>
          <CardTitle>Faixa de Preço</CardTitle>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mínimo: R$ {localFilters.priceRange[0]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), localFilters.priceRange[1])}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Máximo: R$ {localFilters.priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(localFilters.priceRange[0], Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sizes */}
      <Card>
        <CardBody>
          <CardTitle>Tamanhos</CardTitle>
          <div className="flex flex-wrap gap-2">
            {sizes.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Carregando tamanhos...</p>
            ) : (
              sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSizeToggle(size.id)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    localFilters.sizes.includes(size.id)
                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-gray-900 dark:border-gray-100'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {size.name}
                </button>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Colors */}
      <Card>
        <CardBody>
          <CardTitle>Cores</CardTitle>
          <div className="flex flex-wrap gap-2">
            {colors.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Carregando cores...</p>
            ) : (
              colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorToggle(color.id)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    localFilters.colors.includes(color.id)
                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-gray-900 dark:border-gray-100'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {color.name}
                </button>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Brands */}
      <Card>
        <CardBody>
          <CardTitle>Marcas</CardTitle>
          <div className="space-y-2">
            {artisans.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Carregando marcas...</p>
            ) : (
              artisans.map((artisan) => (
                <label key={artisan.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.brands.includes(artisan.id)}
                    onChange={() => handleBrandToggle(artisan.id)}
                    className="text-gray-900 dark:text-gray-100"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{artisan.name}</span>
                </label>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Rating */}
      <Card>
        <CardBody>
          <CardTitle>Avaliação</CardTitle>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={localFilters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="text-gray-900 dark:text-gray-100"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">& acima</span>
                </div>
              </label>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default FilterSidebar;
