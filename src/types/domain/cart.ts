/**
 * Tipos de domínio de Carrinho
 */

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number | string;
  totalPrice?: number | string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalPrice?: number | string;
  totalItems?: number;
}
