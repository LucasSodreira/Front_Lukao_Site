/**
 * Tipos de domínio de Pedidos
 */

export interface OrderItem {
  id: string;
  productTitle: string;
  productPrice: string | number;
  quantity: number;
  totalPrice: string | number;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: string | number;
  shippingCost: string | number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
