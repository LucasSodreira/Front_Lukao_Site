import { useMutation } from '@apollo/client/react';
import { VALIDATE_SHIPPING_ADDRESS, CALCULATE_SHIPPING } from '@/graphql/checkoutQueries';

interface ValidationError {
  field: string;
  message: string;
}

interface AddressInput {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

interface ValidateAddressResponse {
  validateShippingAddress: {
    isValid: boolean;
    errors: ValidationError[];
  };
}

interface CalculateShippingResponse {
  calculateShipping: {
    success: boolean;
    shippingCost: number;
    estimatedDays: number;
    error?: string;
  };
}

export const useValidateAddress = () => {
  const [validateMutation, { loading: validating }] = useMutation<ValidateAddressResponse>(
    VALIDATE_SHIPPING_ADDRESS
  );

  const [calculateShippingMutation, { loading: calculating }] = useMutation<CalculateShippingResponse>(
    CALCULATE_SHIPPING
  );

  const validateAddress = async (address: AddressInput) => {
    try {
      const { data } = await validateMutation({
        variables: {
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          cep: address.cep,
          complement: address.complement,
        },
      });

      return {
        isValid: data?.validateShippingAddress.isValid || false,
        errors: data?.validateShippingAddress.errors || [],
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

  const calculateShipping = async (cep: string, state: string, city: string) => {
    try {
      const { data } = await calculateShippingMutation({
        variables: {
          cep,
          state,
          city,
        },
      });

      if (data?.calculateShipping.success) {
        return {
          success: true,
          shippingCost: data.calculateShipping.shippingCost,
          estimatedDays: data.calculateShipping.estimatedDays,
        };
      } else {
        return {
          success: false,
          error: data?.calculateShipping.error || 'Não foi possível calcular o frete',
        };
      }
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
    loading: validating || calculating,
  };
};
