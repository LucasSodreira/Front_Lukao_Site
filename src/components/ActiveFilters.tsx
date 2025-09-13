import React from 'react';
import type { FilterState, Category, Size, Color } from '../types';

interface ActiveFiltersProps {
  filters: FilterState;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
  onRemoveFilter: (key: keyof FilterState, value?: string | number | boolean | [number, number]) => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  categories,
  sizes,
  colors,
  onRemoveFilter,
}) => {
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

  const activeFilters = [];

  if (filters.categoryId) {
    activeFilters.push({
      key: 'categoryId',
      label: `Categoria: ${getCategoryName(filters.categoryId)}`,
      value: filters.categoryId,
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
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
      label: `Marca: ${brand}`,
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

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map((filter, index) => (
        <span
          key={`${filter.key}-${index}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-full cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200"
          onClick={() => onRemoveFilter(filter.key as keyof FilterState, filter.value)}
        >
          {filter.label}
          <span className="text-xs">×</span>
        </span>
      ))}
    </div>
  );
};

export default ActiveFilters;
