/**
 * Constantes da API
 */

export const API_TIMEOUTS = {
  DEFAULT: 30000,
  SHORT: 5000,
  LONG: 60000,
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
} as const;

export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const CACHE_KEYS = {
  USER: 'user',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  CART: 'cart',
  ORDERS: 'orders',
  ADDRESSES: 'addresses',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'userPreferences',
} as const;
