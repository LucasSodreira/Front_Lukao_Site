import { environment } from '@/config/environment';
import { ensureCsrfToken } from '@/utils/csrf';

interface AddressInput {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export const useValidateAddress = () => {
  const validateAddress = async (address: AddressInput) => {
    try {
      const csrfToken = await ensureCsrfToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      // Chamar o endpoint correto: /api/checkout/validate-shipping
      const response = await fetch(`${environment.apiUrl}/api/checkout/validate-shipping`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          cep: address.cep,
          complement: address.complement || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na validação: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        isValid: result.isValid,
        errors: result.errors || [],
      };
    } catch {
      return {
        isValid: false,
        errors: [
          {
            field: 'general',
            message: 'Erro ao validar endereço. Tente novamente.',
          },
        ],
      };
    }
  };

  const calculateShipping = async (cep: string, state: string, city: string): Promise<{ success: boolean; shippingCost?: number; estimatedDays?: number; error?: string }> => {
    try {
      const csrfToken = await ensureCsrfToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch(`${environment.apiUrl}/api/checkout/calculate-shipping`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          cep,
          state,
          city,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro no cálculo do frete: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch {
      return {
        success: false,
        error: 'Erro ao calcular frete. Tente novamente.',
      };
    }
  };

  return {
    validateAddress,
    calculateShipping,
  };
};
