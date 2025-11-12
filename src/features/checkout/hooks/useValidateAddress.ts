import { checkoutService } from '@/services';

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
      const result = await checkoutService.validateAddress({
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.cep,
        country: 'Brasil',
      });

      return {
        isValid: result.isValid,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors: (result as any).errors || [],
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

  const calculateShipping = async (): Promise<{ success: boolean; shippingCost: number; estimatedDays: number }> => {
    // Implementação simplificada - frete fixo por enquanto
    return {
      success: true,
      shippingCost: 15.00,
      estimatedDays: 7,
    };
  };

  return {
    validateAddress,
    calculateShipping,
  };
};
