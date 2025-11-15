import { useCallback } from 'react';
import { environment } from '@/config/environment';
import { ensureCsrfToken } from '@/utils/csrf';

type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
};

type ProcessPaymentResponse = {
  success: boolean;
  message: string;
  orderId: number;
  paymentIntentId: string;
  status: string;
  amount: number;
};

export const useStripePayment = () => {
  const apiBase = environment.apiUrl;

  /**
   * Cria uma intenção de pagamento no Stripe
   */
  const createPaymentIntent = useCallback(async (orderId: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrf = await ensureCsrfToken();
      if (csrf) headers['X-XSRF-TOKEN'] = csrf;
      const resp = await fetch(`${apiBase}/api/payments/intent`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ orderId: Number(orderId) }),
      });
      
      if (!resp.ok) {
        const errorText = await resp.text();
        let errorMessage = 'Falha ao criar intenção de pagamento';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          if (errorText) errorMessage = errorText;
        }
        console.error('Erro ao criar payment intent:', { status: resp.status, error: errorMessage });
        return { success: false, error: errorMessage };
      }
      const data: PaymentIntentResponse = await resp.json();
      if (data?.paymentIntentId) {
        return {
          success: true,
          paymentIntentId: data.paymentIntentId,
          clientSecret: data.clientSecret,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
        };
      }

      return {
        success: false,
        error: 'Falha ao criar intenção de pagamento',
      };
    } catch (error) {
      console.error('Erro ao criar intenção de pagamento:', error);
      return {
        success: false,
        error: 'Erro ao criar intenção de pagamento. Tente novamente.',
      };
    }
  }, [apiBase]);

  /**
   * Processa o pagamento consultando status no backend
   */
  const processPayment = useCallback(async (
    orderId: string,
    paymentIntentId: string
  ) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrf = await ensureCsrfToken();
      if (csrf) headers['X-XSRF-TOKEN'] = csrf;
      const resp = await fetch(`${apiBase}/api/payments/process`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ orderId: Number(orderId), paymentIntentId }),
      });
      
      if (!resp.ok) {
        const errorText = await resp.text();
        let errorMessage = 'Falha no processamento do pagamento';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          if (errorText) errorMessage = errorText;
        }
        console.error('Erro ao processar pagamento:', { status: resp.status, error: errorMessage });
        return { success: false, error: errorMessage };
      }
      const data: ProcessPaymentResponse = await resp.json();
      if (data?.success) {
        return {
          success: true,
          orderId: String(data.orderId),
          paymentIntentId: data.paymentIntentId,
          status: data.status,
          message: data.message,
        };
      }

      return {
        success: false,
        error: data?.message || 'Falha no processamento do pagamento',
      };
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      return {
        success: false,
        error: 'Erro ao processar pagamento. Tente novamente.',
      };
    }
  }, [apiBase]);

  return {
    createPaymentIntent,
    processPayment,
    loading: false,
  };
};
