/**
 * Hook para gerenciar filtros de produtos
 */

import { useState, useCallback } from 'react';
import type { FilterState } from '@/types';

export const useFilters = (initialFilters: FilterState) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const setFilter = useCallback((key: keyof FilterState, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key: keyof FilterState, value?: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? (prev[key] as unknown[]).filter((item) => item !== value)
        : undefined,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    setFilter,
    removeFilter,
    resetFilters,
    setFilters,
  };
};
