/**
 * Tipos de domínio de Pedidos
 */

import type { Product } from './product';
import type { Address } from './address';

export interface OrderItem {
  id: number;
  product: Product;
  productTitle: string;
  productPrice: string | number;
  quantity: number;
  totalPrice: string | number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: string | number;
  shippingCost: string | number;
  shippingAddress: Address;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export interface OrderConnection {
  orders: Order[];
  totalCount: number;
  totalPages: number;
}

export const ORDER_STATUS = {
  CREATED: 'CREATED',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export interface CheckoutRequest {
  shippingAddressId: number;
  notes?: string;
}
