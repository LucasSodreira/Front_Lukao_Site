import { useMutation } from '@apollo/client/react';
import { VALIDATE_PAYMENT_INFO } from '@/graphql/checkoutQueries';
import type { PaymentInfo } from './CheckoutContext';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidatePaymentResponse {
  validatePaymentInfo: {
    isValid: boolean;
    errors: ValidationError[];
  };
}

export const useValidatePayment = () => {
  const [validateMutation, { loading: validating }] = useMutation<ValidatePaymentResponse>(
    VALIDATE_PAYMENT_INFO
  );

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

      const { data } = await validateMutation({
        variables: {
          method: normalizedMethod,
          cardNumber: payment.cardNumber,
          cardExpiry: payment.cardExpiry,
          cardCvv: payment.cardCvv,
          installments: payment.installments,
        },
      });

      return {
        isValid: data?.validatePaymentInfo.isValid || false,
        errors: data?.validatePaymentInfo.errors || [],
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
    loading: validating,
  };
};
