/**
 * Tipos de domínio de Carrinho
 */

export interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number | string;
    images?: Array<{
      id: string;
      url: string;
      sortOrder?: number;
    }>;
  };
  quantity: number;
  totalPrice?: number | string;
  attributes?: {
    size?: string;
    color?: string;
  };
  variation?: {
    id: string;
    sku: string;
    size: string; // code
    color: string; // name
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total?: number | string;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
  integrityToken?: string;
}
