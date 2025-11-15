import { authenticatedFetch } from './http-interceptor';

export interface CustomerSummary {
  id: number;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  status: string;
}

export interface CustomerDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export interface CustomerPage {
  customers: CustomerSummary[];
  totalCount: number;
  totalPages: number;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface CreateAdminRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
}

export interface AdminUserResponse {
  id: number;
  name: string;
  email: string;
}

class AdminCustomerService {
  private readonly baseUrl = '/api/admin/customers';

  async listCustomers(page = 0, size = 10, search?: string): Promise<CustomerPage> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.append('search', search);
    
    const response = await authenticatedFetch(`${this.baseUrl}?${params}`);
    if (!response.ok) throw new Error('Erro ao buscar clientes');
    return response.json();
  }

  async getCustomer(id: number): Promise<CustomerDetail> {
    const response = await authenticatedFetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar cliente');
    return response.json();
  }

  async updateCustomer(id: number, request: UpdateCustomerRequest): Promise<CustomerDetail> {
    const response = await authenticatedFetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Erro ao atualizar cliente');
    return response.json();
  }

  async createAdmin(request: CreateAdminRequest): Promise<AdminUserResponse> {
    const response = await authenticatedFetch(`${this.baseUrl}/admin-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Erro ao criar admin');
    return response.json();
  }
}

export const adminCustomerService = new AdminCustomerService();
