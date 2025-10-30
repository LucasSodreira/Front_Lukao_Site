/**
 * Centraliza todos os tipos da aplicação
 * Tipos organizados por domínio para melhor manutenibilidade
 */

// Domain types
export * from './domain';

// API types
export * from './api';

// Filter types (exportado aqui por compatibilidade)
export interface ProductSort {
  field: 'PRICE' | 'CREATED_AT' | 'TITLE' | 'RATING';
  order: 'ASC' | 'DESC';
}

export interface FilterState {
  categoryId?: string;
  priceRange: [number, number];
  inStock: boolean;
  search: string;
  sizes: string[];
  colors: string[];
  brands: string[];
  rating?: number;
  sortBy: ProductSort;
}
