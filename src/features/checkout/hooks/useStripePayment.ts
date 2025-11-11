import { useMutation } from '@apollo/client/react';
import { PROCESS_STRIPE_PAYMENT, CREATE_PAYMENT_INTENT } from '@/graphql/checkoutQueries';

interface CreatePaymentIntentResponse {
  createPaymentIntent: {
    paymentIntentId: string;
    clientSecret: string;
    status: string;
    amount: number;
    currency: string;
  };
}

interface ProcessStripePaymentResponse {
  processStripePayment: {
    success: boolean;
    message: string;
    orderId: string;
    paymentIntentId: string;
    status: string;
    amount: number;
  };
}

export const useStripePayment = () => {
  const [createPaymentIntentMutation, { loading: creatingIntent }] = 
    useMutation<CreatePaymentIntentResponse>(CREATE_PAYMENT_INTENT);

  const [processPaymentMutation, { loading: processing }] = 
    useMutation<ProcessStripePaymentResponse>(PROCESS_STRIPE_PAYMENT);

  /**
   * Cria uma intenção de pagamento no Stripe
   */
  const createPaymentIntent = async (orderId: string) => {
    try {
      const { data } = await createPaymentIntentMutation({
        variables: { orderId },
      });

      if (data?.createPaymentIntent) {
        return {
          success: true,
          paymentIntentId: data.createPaymentIntent.paymentIntentId,
          clientSecret: data.createPaymentIntent.clientSecret,
          status: data.createPaymentIntent.status,
          amount: data.createPaymentIntent.amount,
          currency: data.createPaymentIntent.currency,
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
      const { data } = await processPaymentMutation({
        variables: {
          orderId,
          paymentIntentId,
        },
      });

      if (data?.processStripePayment.success) {
        return {
          success: true,
          orderId: data.processStripePayment.orderId,
          paymentIntentId: data.processStripePayment.paymentIntentId,
          status: data.processStripePayment.status,
          message: data.processStripePayment.message,
        };
      }

      return {
        success: false,
        error: data?.processStripePayment.message || 'Falha no processamento do pagamento',
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
    loading: creatingIntent || processing,
  };
};
