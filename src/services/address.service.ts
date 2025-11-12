import { environment } from '@/config/environment';

const BASE_URL = `${environment.apiUrl}/api/address`;

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
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch addresses: ${response.statusText}`);
    }
    const data = await response.json();
    return data.addresses || [];
  },

  async createAddress(data: CreateAddressRequest): Promise<Address> {
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
      throw new Error(`Failed to create address: ${response.statusText}`);
    }
    return await response.json();
  },

  async updateAddress(id: string, data: CreateAddressRequest): Promise<Address> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update address: ${response.statusText}`);
    }
    return await response.json();
  },

  async deleteAddress(id: string): Promise<void> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete address: ${response.statusText}`);
    }
  },

  async setPrimaryAddress(id: string): Promise<Address> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/${id}/primary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to set primary address: ${response.statusText}`);
    }
    return await response.json();
  },
};
