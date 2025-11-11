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
      const { data } = await validateMutation({
        variables: {
          method: payment.method,
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
