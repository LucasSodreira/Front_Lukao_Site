/**
 * Serviço de Produtos
 * Gerencia lógica de negócio relacionada a produtos
 */

import type { Product } from '@/types';

export const productsService = {
  /**
   * Calcula a classificação média de um produto
   */
  calculateAverageRating: (ratings: number[]): number => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  },

  /**
   * Verifica se um produto está em estoque
   */
  isInStock: (inventory: number): boolean => {
    return inventory > 0;
  },

  /**
   * Formata informações do produto para exibição
   */
  formatProductInfo: (product: Product): Record<string, unknown> => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      hasImages: !!product.images && product.images.length > 0,
      inStock: product.inventory && product.inventory > 0,
    };
  },

  /**
   * Filtra produtos por disponibilidade
   */
  filterByStock: (products: Product[]): Product[] => {
    return products.filter((p) => productsService.isInStock(p.inventory || 0));
  },

  /**
   * Ordena produtos por preço
   */
  sortByPrice: (products: Product[], order: 'asc' | 'desc' = 'asc'): Product[] => {
    return [...products].sort((a, b) => {
      const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
      const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
      return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
  },
};
