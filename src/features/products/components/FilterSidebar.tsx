import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_SIZES, GET_COLORS } from "@/graphql/queries";
import type { Category, FilterState, Size, Color } from "@/types";

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  categories: Category[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
}) => {
  const { data: sizesData } = useQuery<{ sizes: Size[] }>(GET_SIZES);
  const { data: colorsData } = useQuery<{ colors: Color[] }>(GET_COLORS);
  const sizes = sizesData?.sizes || [];
  const colors = colorsData?.colors || [];

  const handleColorToggle = (colorId: string) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter((c) => c !== colorId)
      : [...filters.colors, colorId];
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handleSizeToggle = (sizeId: string) => {
    const newSizes = filters.sizes.includes(sizeId)
      ? filters.sizes.filter((s) => s !== sizeId)
      : [...filters.sizes, sizeId];
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handleCategoryToggle = (categoryId: string) => {
    onFiltersChange({ 
      ...filters, 
      categoryId: filters.categoryId === categoryId ? undefined : categoryId 
    });
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div 
        className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto space-y-8"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9CA3AF transparent'
        }}
      >
        <div className="flex justify-between items-center lg:sticky lg:top-0 lg:bg-background-light lg:dark:bg-background-dark lg:z-10 lg:pb-4 lg:pt-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Filtros
          </h3>
          <button
            onClick={onClearFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            Limpar
          </button>
        </div>
        <div className="space-y-6 lg:pb-4">
          <details className="group" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-gray-800 dark:text-white text-base">
              Cor
              <span className="transition-transform group-open:rotate-180">
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </span>
            </summary>
            <div className="mt-4 flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorToggle(color.id)}
                  className={`size-8 rounded-full border-2 transition-all ${
                    filters.colors.includes(color.id)
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: color.hexCode || "#000000" }}
                  aria-label={`Cor ${color.name}`}
                  title={color.name}
                />
              ))}
            </div>
          </details>
          <hr className="border-gray-200 dark:border-gray-700" />
          <details className="group" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-gray-800 dark:text-white text-base">
              Tamanho
              <span className="transition-transform group-open:rotate-180">
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </span>
            </summary>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <label
                  key={size.id}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer hover:border-primary transition-colors text-sm font-medium ${
                    filters.sizes.includes(size.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white"
                  }`}
                >
                  <input
                    className="sr-only peer"
                    name="size"
                    type="checkbox"
                    checked={filters.sizes.includes(size.id)}
                    onChange={() => handleSizeToggle(size.id)}
                  />
                  {size.name}
                </label>
              ))}
            </div>
          </details>
          <hr className="border-gray-200 dark:border-gray-700" />
          {categories.length > 0 && (
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-gray-800 dark:text-white text-base">
                Categoria
                <span className="transition-transform group-open:rotate-180">
                  <span className="material-symbols-outlined text-base">
                    expand_more
                  </span>
                </span>
              </summary>
              <div className="mt-4 space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <input
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      type="radio"
                      name="category"
                      checked={filters.categoryId === category.id}
                      onChange={() => handleCategoryToggle(category.id)}
                    />
                    <span className="text-gray-800 dark:text-white">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
