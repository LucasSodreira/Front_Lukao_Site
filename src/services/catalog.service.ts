import { environment } from '@/config/environment';
import type { Product } from '@/types/domain/product';

const BASE_URL = `${environment.apiUrl}/api/catalog`;

export interface SearchProductsParams {
  categoryId?: string;
  title?: string;
  artisanId?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  rating?: number;
  page?: number;
  size?: number;
}

export interface SearchProductsResponse {
  products: Product[];
  totalCount: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
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
  hexCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
}

export const catalogService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const raw = await response.json();
    // Tipos flexíveis de resposta: array direto ou objeto wrapper
    if (Array.isArray(raw)) return raw as Product[];
    if (raw && typeof raw === 'object' && Array.isArray((raw as { products?: unknown }).products)) {
      return (raw as { products: Product[] }).products;
    }
    return [];
  },

  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return await response.json();
  },

  async searchProducts(params: SearchProductsParams): Promise<SearchProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.title) queryParams.append('title', params.title);
    if (params.artisanId) queryParams.append('artisanId', params.artisanId);
    if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
    if (params.rating !== undefined) queryParams.append('rating', params.rating.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sizes?.length) queryParams.append('sizes', params.sizes.join(','));
    if (params.colors?.length) queryParams.append('colors', params.colors.join(','));

    const response = await fetch(`${BASE_URL}/products/search?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }
    return await response.json();
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const raw = await response.json();
    if (Array.isArray(raw)) return raw as Category[];
    if (raw && typeof raw === 'object' && Array.isArray((raw as { categories?: unknown }).categories)) {
      return (raw as { categories: Category[] }).categories;
    }
    return [];
  },

  async getSizes(): Promise<Size[]> {
    const response = await fetch(`${BASE_URL}/sizes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sizes: ${response.statusText}`);
    }
    const raw = await response.json();
    if (Array.isArray(raw)) return raw as Size[];
    if (raw && typeof raw === 'object' && Array.isArray((raw as { sizes?: unknown }).sizes)) {
      return (raw as { sizes: Size[] }).sizes;
    }
    return [];
  },

  async getColors(): Promise<Color[]> {
    const response = await fetch(`${BASE_URL}/colors`);
    if (!response.ok) {
      throw new Error(`Failed to fetch colors: ${response.statusText}`);
    }
    const raw = await response.json();
    if (Array.isArray(raw)) return raw as Color[];
    if (raw && typeof raw === 'object' && Array.isArray((raw as { colors?: unknown }).colors)) {
      return (raw as { colors: Color[] }).colors;
    }
    return [];
  },

  async getBrands(): Promise<Brand[]> {
    const response = await fetch(`${BASE_URL}/brands`);
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.statusText}`);
    }
    const raw = await response.json();
    if (Array.isArray(raw)) return raw as Brand[];
    if (raw && typeof raw === 'object' && Array.isArray((raw as { brands?: unknown }).brands)) {
      return (raw as { brands: Brand[] }).brands;
    }
    return [];
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }
    return await response.json();
  },
};
