/**
 * Enums e constantes de tipo da aplicação
 * Usando const objects em vez de enums para melhor tree-shaking
 */

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const USER_ROLE = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  ARTISAN: 'ARTISAN',
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER];

export const PRODUCT_SORT_FIELD = {
  CREATED_AT: 'createdAt',
  PRICE: 'price',
  RATING: 'rating',
  NAME: 'name',
} as const;

export type ProductSortField = typeof PRODUCT_SORT_FIELD[keyof typeof PRODUCT_SORT_FIELD];

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];

export const LANGUAGES = {
  PT_BR: 'pt-BR',
  EN: 'en',
  ES: 'es',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];
