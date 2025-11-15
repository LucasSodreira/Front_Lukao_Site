import { environment } from '@/config/environment';
import { buildHeadersWithCsrf } from '@/utils/csrf';
import { authenticatedFetch } from './http-interceptor';
import type { Order, OrderConnection, CheckoutRequest } from '@/types/domain/order';

const BASE_URL = `${environment.apiUrl}/api/orders`;

export interface OrderQueryParams {
  page?: number;
  size?: number;
}

export const orderService = {
  /**
   * Busca todos os pedidos do usuário autenticado
   */
  async getMyOrders(params: OrderQueryParams = {}): Promise<OrderConnection> {
    const { page = 0, size = 10 } = params;
    const url = new URL(BASE_URL);
    url.searchParams.append('page', String(page));
    url.searchParams.append('size', String(size));

    const response = await authenticatedFetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    
    return await response.json();
  },

  /**
   * Busca um pedido específico por ID
   */
  async getOrderById(id: number): Promise<Order> {
    const response = await authenticatedFetch(`${BASE_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    
    return await response.json();
  },

  /**
   * Realiza o checkout do carrinho
   */
  async checkout(data: CheckoutRequest): Promise<Order> {
    const response = await authenticatedFetch(`${BASE_URL}/checkout`, {
      method: 'POST',
      headers: await buildHeadersWithCsrf(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create order: ${response.statusText}`);
    }
    
    return await response.json();
  },

  /**
   * Cancela um pedido específico
   */
  async cancelOrder(id: number): Promise<Order> {
    const response = await authenticatedFetch(`${BASE_URL}/${id}/cancel`, {
      method: 'POST',
      headers: await buildHeadersWithCsrf(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to cancel order: ${response.statusText}`);
    }
    
    return await response.json();
  },
};
