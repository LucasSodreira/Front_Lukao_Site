// Tipos baseados no schema GraphQL
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'ARTISAN' | 'ADMIN';
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  categoryId?: string;
  artisanId?: string;
  inventory: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
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
  sortOrder: number;
  isActive: boolean;
}

export interface Color {
  id: string;
  name: string;
  hexCode?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  primary: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  status: 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  totalAmount: number;
  shippingCost: number;
  shippingAddress: Address;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  productTitle: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

// Input types
export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CreateProductInput {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface CreateAddressInput {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  primary: boolean;
}

// Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Filter types
export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  rating?: number;
}

export interface ProductSort {
  field: 'price' | 'createdAt' | 'title' | 'rating';
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
