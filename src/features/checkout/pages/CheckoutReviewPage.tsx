import { useNavigate } from 'react-router-dom';
import { CheckoutBreadcrumb } from '../components/CheckoutBreadcrumb';
import { useCheckoutState } from '../hooks';
import { useCartRest } from '@/features/cart/hooks/useCartRest';
import { useState } from 'react';
import { environment } from '@/config/environment';
import { ensureCsrfToken } from '@/utils/csrf';

export const CheckoutReviewPage = () => {
  const navigate = useNavigate();
  const { shippingAddress, selectedAddressId, setOrderId, setCurrentStep } = useCheckoutState();
  
  // Buscar dados reais do carrinho
  const { cart, loading } = useCartRest();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Carregando...</h1>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Seu carrinho está vazio
          </p>
        </div>
      </main>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subtotal = cart.items.reduce((sum: number, item: any) => sum + Number(item.totalPrice || 0), 0);
  const shipping = 20.0; // TODO: Usar valor calculado na página de endereço
  const total = subtotal + shipping;

  const handleProceedToPayment = async () => {
    setCheckoutLoading(true);
    try {
      if (!shippingAddress) {
        alert('Informe um endereço para continuar.');
        navigate('/checkout/address');
        return;
      }

      if (!cart || !cart.items || cart.items.length === 0) {
        alert('Seu carrinho está vazio.');
        navigate('/cart');
        return;
      }

      // Criar pedido no backend
      const csrfToken = await ensureCsrfToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      // Se tem addressId selecionado, usar endpoint /checkout
      // Se não, criar novo endereço com /checkout-with-address
      let response;
      
      if (selectedAddressId) {
        // Usar endereço existente
        response = await fetch(`${environment.apiUrl}/api/orders/checkout`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            shippingAddressId: Number(selectedAddressId),
            notes: '',
          }),
        });
      } else {
        // Criar novo endereço
        response = await fetch(`${environment.apiUrl}/api/orders/checkout-with-address`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            address: {
              street: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zipCode: shippingAddress.cep,
              country: 'Brasil',
              primary: false,
            },
            notes: '',
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao criar pedido:', { status: response.status, error: errorText });
        alert('Erro ao criar pedido. Tente novamente.');
        setCheckoutLoading(false);
        return;
      }

      const orderData = await response.json();
      const createdOrderId = String(orderData.id);

      // Salvar orderId para uso no pagamento
      setOrderId(createdOrderId);
      // Revisão concluída, avançar para etapa de pagamento
      setCurrentStep('payment');
      navigate('/checkout/payment');
    } catch (error) {
      console.error('Erro ao criar pedido antes do pagamento:', error);
      alert('Erro ao prosseguir. Tente novamente.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Carrinho', path: '/cart' },
    { label: 'Endereço', path: '/checkout/address' },
    { label: 'Revisão', active: true },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:py-4">
      <CheckoutBreadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 mt-8">
        {/* Coluna Principal - Revisão */}
        <div className="lg:col-span-2 space-y-8">
          <div className="mb-6">
            <h1 className="text-[#0e121b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Revise seu pedido
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              Verifique todos os detalhes antes de confirmar a compra
            </p>
          </div>

          {/* Seção de Produtos */}
          <div className="bg-white dark:bg-background-dark/80 p-6 md:p-8 rounded-xl shadow-sm border border-transparent dark:border-gray-800">
            <h2 className="text-2xl font-bold text-[#0e121b] dark:text-white mb-6">
              Itens do Pedido ({cart.items.length})
            </h2>
            
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {cart.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  {/* Imagem do Produto */}
                  <div
                    className="w-20 h-20 rounded-lg bg-center bg-cover flex-shrink-0"
                    style={{
                      backgroundImage: `url(${item.product.images?.[0]?.url || 'https://via.placeholder.com/80'})`,
                    }}
                  />
                  
                  {/* Informações do Produto */}
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0e121b] dark:text-white">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Quantidade: {item.quantity}x
                    </p>
                    <p className="text-base font-semibold text-primary mt-2">
                      R$ {typeof item.product.price === 'number' 
                        ? item.product.price.toFixed(2) 
                        : item.product.price}
                    </p>
                  </div>
                  
                  {/* Subtotal do Item */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                    <p className="font-bold text-[#0e121b] dark:text-white">
                      R$ {(Number(item.totalPrice || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção de Endereço */}
          <div className="bg-white dark:bg-background-dark/80 p-6 md:p-8 rounded-xl shadow-sm border border-transparent dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0e121b] dark:text-white">
                Endereço de Entrega
              </h2>
              <button
                onClick={() => navigate('/checkout/address')}
                className="text-primary font-semibold hover:underline text-sm"
              >
                Alterar
              </button>
            </div>

            {shippingAddress ? (
              <div className="space-y-3">
                <p className="text-[#0e121b] dark:text-white font-semibold">
                  {shippingAddress.fullName}
                </p>
                <div className="text-gray-700 dark:text-gray-300 space-y-1">
                  <p>
                    {shippingAddress.street}, {shippingAddress.number}
                    {shippingAddress.complement && ` - ${shippingAddress.complement}`}
                  </p>
                  <p>
                    {shippingAddress.neighborhood}, {shippingAddress.city} - {shippingAddress.state}
                  </p>
                  <p>CEP: {shippingAddress.cep}</p>
                  <p>Email: {shippingAddress.email}</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                    📦 Entrega via SEDEX - 3 dias úteis
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum endereço selecionado
              </p>
            )}
          </div>

          {/* Informação de Segurança */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 flex-shrink-0">verified_user</span>
            <div>
              <p className="text-green-700 dark:text-green-300 text-sm font-semibold">Compra 100% Segura</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Sua transação será processada com criptografia de ponta a ponta pelo Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Coluna Lateral - Resumo Financeiro */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-background-dark/80 p-6 md:p-8 rounded-xl shadow-sm border border-transparent dark:border-gray-800 sticky top-28">
            <h2 className="text-2xl font-bold text-[#0e121b] dark:text-white mb-6">
              Resumo Financeiro
            </h2>

            {/* Detalhes de Custos */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-[#0e121b] dark:text-white">
                  R$ {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frete</span>
                <span className="font-semibold text-[#0e121b] dark:text-white">
                  R$ {shipping.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Descontos</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  R$ 0,00
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-[#0e121b] dark:text-white">Total</span>
              <span className="text-3xl font-black text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>

            {/* Botão Proceder para Pagamento */}
            <button
              onClick={handleProceedToPayment}
              disabled={checkoutLoading}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl text-base hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Criando pedido...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">credit_card</span>
                  Proceder para Pagamento
                </>
              )}
            </button>

            {/* Botão Voltar */}
            <button
              onClick={() => navigate('/checkout/address')}
              className="w-full border-2 border-gray-300 dark:border-gray-600 text-[#0e121b] dark:text-white font-bold py-3 rounded-xl text-base hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              Voltar para Endereço
            </button>

            {/* Links de Ajuda */}
            <div className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6 space-y-2">
              <p>Dúvidas?</p>
              <a href="#" className="text-primary font-semibold hover:underline block">
                Entre em contato com nosso suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutReviewPage;