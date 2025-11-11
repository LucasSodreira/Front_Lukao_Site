import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_MY_ADDRESSES, GET_MY_CART } from '@/graphql/queries';
import { ShippingForm } from '../components/ShippingForm';
import type { ShippingFormData } from '../components/ShippingFormFields';
import { useCheckoutState, useValidateAddress } from '../hooks';
import { useAuth } from '@/shared/hooks';
import type { Cart } from '@/types';

interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressesQueryResult {
  myAddresses: Address[];
}

interface CartQueryResult {
  myCart: Cart;
}

export const CheckoutAddressPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setShippingAddress, setSelectedAddressId, selectedAddressId, setCurrentStep } = useCheckoutState();
  const { validateAddress, calculateShipping } = useValidateAddress();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Buscar endereços do usuário
  const { data: addressData, loading: addressLoading } = useQuery<AddressesQueryResult>(GET_MY_ADDRESSES, {
    fetchPolicy: 'network-only',
  });

  // Buscar carrinho do usuário
  const { data: cartData, loading: cartLoading } = useQuery<CartQueryResult>(GET_MY_CART, {
    fetchPolicy: 'network-only',
  });

  const addresses = addressData?.myAddresses || [];
  const cart = cartData?.myCart;
  const hasAddresses = addresses.length > 0;

  const handleSelectAddress = (addressId: string) => {
    const address = addresses.find(a => a.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setShippingAddress({
        email: user?.email || '',
        fullName: user?.name || '',
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        cep: address.zipCode,
      });
      setValidationErrors({});
    }
  };

  const handleShippingSubmit = async (data: ShippingFormData) => {
    setIsProcessing(true);
    setValidationErrors({});

    try {
      // Validar endereço no backend (sem email e fullName)
      const addressValidation = await validateAddress({
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        cep: data.cep,
      });

      if (!addressValidation.isValid) {
        const errors: Record<string, string> = {};
        addressValidation.errors.forEach(error => {
          errors[error.field] = error.message;
        });
        setValidationErrors(errors);
        setIsProcessing(false);
        return;
      }

      // Calcular frete
      const shippingCalculation = await calculateShipping(data.cep, data.state, data.city);

      if (!shippingCalculation.success) {
        setValidationErrors({
          shipping: shippingCalculation.error || 'Não foi possível calcular o frete',
        });
        setIsProcessing(false);
        return;
      }

      // Se tudo validou, salvar endereço
      setShippingAddress({
        email: data.email,
        fullName: data.fullName,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        cep: data.cep,
      });
      setSelectedAddressId(null);
  // Passo concluído: endereço salvo, avançar para etapa de revisão
  setCurrentStep('review');
      navigate('/checkout/review');
    } catch {
      setValidationErrors({
        general: 'Erro ao processar endereço. Tente novamente.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueWithSelected = async () => {
    if (!selectedAddressId) return;

    setIsProcessing(true);
    setValidationErrors({});

    try {
      const address = addresses.find(a => a.id === selectedAddressId);
      if (!address) {
        setValidationErrors({ general: 'Endereço não encontrado' });
        setIsProcessing(false);
        return;
      }

      // Validar endereço selecionado
      const addressValidation = await validateAddress({
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        cep: address.zipCode,
      });

      if (!addressValidation.isValid) {
        const errors: Record<string, string> = {};
        addressValidation.errors.forEach(error => {
          errors[error.field] = error.message;
        });
        setValidationErrors(errors);
        setIsProcessing(false);
        return;
      }

      // Calcular frete
      const shippingCalculation = await calculateShipping(address.zipCode, address.state, address.city);

      if (!shippingCalculation.success) {
        setValidationErrors({
          shipping: shippingCalculation.error || 'Não foi possível calcular o frete',
        });
        setIsProcessing(false);
        return;
      }

  // Endereço selecionado válido, avança para revisão
  setCurrentStep('review');
      navigate('/checkout/review');
    } catch {
      setValidationErrors({
        general: 'Erro ao processar endereço. Tente novamente.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (addressLoading || cartLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Column: Checkout Steps */}
        <div className="lg:col-span-7">

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-800 dark:text-white text-3xl font-bold leading-tight tracking-tight">
              Informações de Envio
            </p>
          </div>
          

          {/* Endereços Salvos - Card Style */}
          {hasAddresses && !showNewAddressForm && (
            <div className="flex flex-col gap-6 p-4 mt-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Seus Endereços
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleSelectAddress(address.id)}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedAddressId === address.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    {selectedAddressId === address.id && (
                      <div className="absolute top-2 right-2">
                        <span className="material-symbols-outlined text-primary text-xl">
                          check_circle
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {address.street}, {address.number}
                      </p>
                      {address.complement && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.complement}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.neighborhood}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.city} - {address.state}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        CEP: {address.zipCode}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Card "Novo Endereço" */}
                <div
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
                >
                  <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 mb-2">
                    add_circle
                  </span>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Novo Endereço
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4">
                <a
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary/90 cursor-pointer hover:underline"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Voltar ao carrinho
                </a>
                <button
                  onClick={handleContinueWithSelected}
                  disabled={!selectedAddressId || isProcessing}
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-wide min-w-0 px-8 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Validando...
                    </>
                  ) : (
                    'Ir para Revisão do Pedido'
                  )}
                </button>
              </div>

              {/* Erro de Validação */}
              {validationErrors.general && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm font-semibold">{validationErrors.general}</p>
                </div>
              )}
            </div>
          )}

          {/* Formulário de Novo Endereço */}
          {(showNewAddressForm || !hasAddresses) && (
            <div className="flex flex-col gap-6 p-4 mt-4">
              {hasAddresses && (
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Novo Endereço
                  </h3>
                  <button
                    onClick={() => setShowNewAddressForm(false)}
                    className="flex items-center gap-1 text-sm font-semibold text-primary dark:text-primary/90 hover:underline"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Voltar para endereços
                  </button>
                </div>
              )}

              {!hasAddresses && (
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Contato</h3>
              )}

              <ShippingForm onSubmit={handleShippingSubmit} onBack={() => navigate('/cart')} />
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 lg:p-8 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              Resumo do Pedido
            </h2>

            {/* Product List */}
            {cart && cart.items && cart.items.length > 0 ? (
              <>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16"
                          style={{
                            backgroundImage: `url(${item.product.images?.[0]?.url || 'https://via.placeholder.com/64'})`,
                          }}
                        />
                        <span className="absolute -top-2 -right-2 flex items-center justify-center size-5 bg-gray-600 text-white text-xs font-semibold rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">
                        R${' '}
                        {typeof item.product.price === 'number'
                          ? item.product.price.toFixed(2)
                          : item.product.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-11 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-sm font-normal leading-normal"
                    placeholder="Cupom de desconto"
                    type="text"
                  />
                  <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold min-w-0 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Aplicar
                  </button>
                </div>

                {/* Cost Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      R${' '}
                      {typeof cart.total === 'number'
                        ? cart.total.toFixed(2)
                        : cart.total || '0.00'}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600 dark:text-gray-400">Frete</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">A calcular</p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-base font-bold text-gray-800 dark:text-white">Total</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    R${' '}
                    {typeof cart.total === 'number'
                      ? cart.total.toFixed(2)
                      : cart.total || '0.00'}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Seu carrinho está vazio
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
