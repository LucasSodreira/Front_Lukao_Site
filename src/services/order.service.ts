import { environment } from '@/config/environment';

const BASE_URL = `${environment.apiUrl}/api/order`;

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  addressId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
}

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    const data = await response.json();
    return data.orders || [];
  },

  async getOrderById(id: string): Promise<Order> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    return await response.json();
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }
    return await response.json();
  },

  async cancelOrder(id: string): Promise<Order> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.statusText}`);
    }
    return await response.json();
  },
};
