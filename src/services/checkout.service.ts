import { environment } from '@/config/environment';

const BASE_URL = `${environment.apiUrl}/api/checkout`;

export interface ValidateAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ValidateAddressResponse {
  isValid: boolean;
  message: string;
}

export interface ValidatePaymentRequest {
  amount: number;
  currency: string;
}

export interface ValidatePaymentResponse {
  isValid: boolean;
  message: string;
  processingFee?: number;
}

export interface ProcessPaymentRequest {
  orderId: string;
  amount: number;
  paymentMethodId: string;
}

export interface ProcessPaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

export const checkoutService = {
  async validateAddress(data: ValidateAddressRequest): Promise<ValidateAddressResponse> {
    const response = await fetch(`${BASE_URL}/validate-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to validate address: ${response.statusText}`);
    }
    return await response.json();
  },

  async validatePayment(data: ValidatePaymentRequest): Promise<ValidatePaymentResponse> {
    const response = await fetch(`${BASE_URL}/validate-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to validate payment: ${response.statusText}`);
    }
    return await response.json();
  },

  async processPayment(data: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/process-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to process payment: ${response.statusText}`);
    }
    return await response.json();
  },
};
