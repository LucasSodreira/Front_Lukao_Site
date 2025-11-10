/**
 * Tipos de domínio de Produtos
 */

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Size {
  id: string;
  name: string;
  code: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Color {
  id: string;
  name: string;
  code?: string;
  hexCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ProductVariation {
  id: string;
  sku: string;
  size: Size;
  color: Color;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
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
  artisanId?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  variations?: ProductVariation[];
  sizes?: Size[];
  colors?: Color[];
  brand?: Brand;
  material?: string;
  careInstructions?: string;
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
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
