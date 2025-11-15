import { environment } from '@/config/environment';
import { buildHeadersWithCsrf } from '@/utils/csrf';

const BASE_URL = `${environment.apiUrl}/api/addresses`;

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  primary: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  primary?: boolean;
}

export const addressService = {
  async getMyAddresses(): Promise<Address[]> {
    const response = await fetch(`${BASE_URL}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch addresses: ${response.statusText}`);
    }
    const data = await response.json();

    return Array.isArray(data) ? data : [];
  },

  async createAddress(data: CreateAddressRequest): Promise<Address> {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: await buildHeadersWithCsrf(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create address: ${response.statusText}`);
    }
    return await response.json();
  },

  async updateAddress(id: string, data: CreateAddressRequest): Promise<Address> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: await buildHeadersWithCsrf(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update address: ${response.statusText}`);
    }
    return await response.json();
  },

  async deleteAddress(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: await buildHeadersWithCsrf(),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao deletar endereço:', { status: response.status, error: errorText });
      
      // Se for erro de autenticação, não propagar (evita logout forçado)
      if (response.status === 401 || response.status === 403) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      throw new Error(`Failed to delete address: ${response.statusText}`);
    }
    

    await response.json().catch(() => {});
  },

  async setPrimaryAddress(id: string): Promise<Address> {
    const response = await fetch(`${BASE_URL}/${id}/primary`, {
      method: 'POST',
      headers: await buildHeadersWithCsrf(),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to set primary address: ${response.statusText}`);
    }
    return await response.json();
  },
};
