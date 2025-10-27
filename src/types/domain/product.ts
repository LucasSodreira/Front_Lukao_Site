/**
 * Tipos de domínio de Produtos
 */

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Product {
  id: string | number;
  title: string;
  description?: string;
  price: number | string;
  images?: ProductImage[];
  inventory?: number;
  categoryId?: string;
  category?: Category;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Size {
  id: string;
  name: string;
  code: string;
}

export interface Color {
  id: string;
  name: string;
  code: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductRating {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface ProductFilter {
  categoryId?: string;
  priceRange: [number, number];
  inStock: boolean;
  search?: string;
  sizes: string[];
  colors: string[];
  brands: string[];
  rating?: number;
  sortBy: {
    field: string;
    order: 'ASC' | 'DESC';
  };
}
