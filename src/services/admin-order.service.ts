import { authenticatedFetch } from './http-interceptor';

export interface OrderSummary {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  address: string;
}

export interface OrderLine {
  id: number;
  productTitle: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderDetail {
  id: number;
  status: string;
  totalAmount: number;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderLine[];
}

export interface OrderPage {
  orders: OrderSummary[];
  totalCount: number;
  totalPages: number;
}

export interface Transaction {
  id: number;
  orderId: number;
  customer: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalPaid: number;
  pending: number;
  failed: number;
  totalCount: number;
  totalPages: number;
}

class AdminOrderService {
  private readonly baseUrl = '/api/admin/orders';

  async listOrders(page = 0, size = 10, status?: string, search?: string): Promise<OrderPage> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await authenticatedFetch(`${this.baseUrl}?${params}`);
    if (!response.ok) throw new Error('Erro ao buscar pedidos');
    return response.json();
  }

  async getOrder(id: number): Promise<OrderDetail> {
    const response = await authenticatedFetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar pedido');
    return response.json();
  }

  async updateStatus(id: number, status: string): Promise<OrderDetail> {
    const response = await authenticatedFetch(`${this.baseUrl}/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar status do pedido');
    return response.json();
  }

  async listTransactions(page = 0, size = 10, search?: string, status?: string): Promise<TransactionResponse> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    
    const response = await authenticatedFetch(`${this.baseUrl}/transactions?${params}`);
    if (!response.ok) throw new Error('Erro ao buscar transações');
    return response.json();
  }
}

export const adminOrderService = new AdminOrderService();
