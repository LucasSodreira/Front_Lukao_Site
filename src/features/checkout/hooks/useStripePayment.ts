import { environment } from '@/config/environment';

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

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  /**
   * Cria uma intenção de pagamento no Stripe
   */
  const createPaymentIntent = async (orderId: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrf = getCookie('XSRF-TOKEN');
      if (csrf) headers['X-XSRF-TOKEN'] = csrf;
      const resp = await fetch(`${apiBase}/api/payments/intent`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ orderId }),
      });
      if (!resp.ok) {
        return { success: false, error: 'Falha ao criar intenção de pagamento' };
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
  };

  /**
   * Processa o pagamento com Stripe
   * 
   * Fluxo:
   * 1. Valida dados do cartão
   * 2. Cria intenção de pagamento no Stripe
   * 3. Processa o pagamento
   * 4. Retorna resultado
   */
  const processPayment = async (
    orderId: string,
    paymentIntentId: string
  ) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrf = getCookie('XSRF-TOKEN');
      if (csrf) headers['X-XSRF-TOKEN'] = csrf;
      const resp = await fetch(`${apiBase}/api/payments/process`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ orderId: Number(orderId), paymentIntentId }),
      });
      if (!resp.ok) {
        return { success: false, error: 'Falha no processamento do pagamento' };
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
  };

  return {
    createPaymentIntent,
    processPayment,
    loading: false,
  };
};
