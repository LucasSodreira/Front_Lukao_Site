import type { PaymentInfo } from './CheckoutContext';
import { environment } from '@/config/environment';
import { ensureCsrfToken } from '@/utils/csrf';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidatePaymentResponse {
  isValid: boolean;
  errors: ValidationError[];
}

export const useValidatePayment = () => {
  const apiBase = environment.apiUrl;

  const validatePayment = async (payment: PaymentInfo) => {
    try {
      // Normaliza o método para o formato aceito pelo backend
      const METHOD_MAP: Record<string, string> = {
        credit_card: 'CREDIT_CARD',
        debit_card: 'DEBIT_CARD',
        pix: 'PIX',
        boleto: 'BOLETO',
        paypal: 'PAYPAL',
      };
      const normalizedMethod = METHOD_MAP[(payment.method || '').toLowerCase()] || payment.method?.toUpperCase() || '';
      // Caso futuro de adição de novos métodos (ex: APPLE_PAY), basta incluir no METHOD_MAP.
      // O backend atualmente valida apenas os métodos explícitos via equals().

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrfToken = await ensureCsrfToken();
      if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;

      const resp = await fetch(`${apiBase}/api/payments/validate`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          method: normalizedMethod,
          cardNumber: payment.cardNumber,
          cardExpiry: payment.cardExpiry,
          cardCvv: payment.cardCvv,
          installments: payment.installments,
        }),
      });
      if (!resp.ok) {
        throw new Error('Erro ao validar pagamento');
      }
      const data: ValidatePaymentResponse = await resp.json();
      return {
        isValid: data?.isValid || false,
        errors: data?.errors || [],
      };
    } catch {
      return {
        isValid: false,
        errors: [
          {
            field: 'general',
            message: 'Erro ao validar pagamento. Tente novamente.',
          },
        ],
      };
    }
  };

  return {
    validatePayment,
    loading: false,
  };
};
