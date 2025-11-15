import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutBreadcrumb } from '../components/CheckoutBreadcrumb';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { useCheckoutState, useStripePayment } from '../hooks';
import { useCartRest } from '@/features/cart/hooks/useCartRest';
import { orderService } from '@/services';
import { environment } from '@/config/environment';

const stripePromise = loadStripe(environment.stripePublicKey);

export const CheckoutPaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { shippingAddress, orderId, setPaymentInfo, setCurrentStep } = useCheckoutState();
  const { createPaymentIntent, processPayment } = useStripePayment();
  
  // Obter orderId da query string se vindo de detalhes do pedido
  const queryOrderId = searchParams.get('orderId');
  const effectiveOrderId = queryOrderId ? parseInt(queryOrderId, 10) : orderId;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const paymentIntentCreated = useRef(false);

  // Buscar dados reais do carrinho (apenas se não vindo de detalhes do pedido)
  const { cart, loading: cartLoading } = useCartRest();

  // Buscar dados do pedido se vindo de detalhes do pedido
  const { 
    data: orderData, 
    isLoading: orderLoading 
  } = useQuery({
    queryKey: ['order', effectiveOrderId],
    queryFn: () => {
      if (!effectiveOrderId) throw new Error('Order ID inválido');
      return orderService.getOrderById(Number(effectiveOrderId));
    },
    enabled: !!queryOrderId && !!effectiveOrderId,
  });

  // Garantir pré-condições: endereço e orderId
  useEffect(() => {
    if (!queryOrderId && !shippingAddress && !cartLoading) {
      // Se não vindo de detalhes do pedido e sem endereço, volta para endereço
      navigate('/checkout/address');
    } else if (!queryOrderId && shippingAddress && !orderId && !cartLoading) {
      // Sem orderId (não criou pedido na revisão) volta para revisão
      navigate('/checkout/review');
    }
  }, [shippingAddress, orderId, cartLoading, navigate, queryOrderId]);

  // Criar Payment Intent quando a página carregar
  useEffect(() => {
    const initPayment = async () => {
      // Evitar múltiplas criações
      if (!effectiveOrderId || clientSecret || paymentIntentCreated.current) return;
      
      paymentIntentCreated.current = true;
      setIsProcessing(true);
    
      
      const intentResult = await createPaymentIntent(String(effectiveOrderId));
      
      if (!intentResult.success) {
        setPaymentError(intentResult.error || 'Falha ao criar intenção de pagamento');
        paymentIntentCreated.current = false; // Permitir retry em caso de erro
        setIsProcessing(false);
        return;
      }

      setClientSecret(intentResult.clientSecret || '');
      setIsProcessing(false);
    };

    initPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOrderId]);

  if (cartLoading || (queryOrderId && orderLoading)) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {queryOrderId ? 'Carregando detalhes do pedido...' : 'Carregando carrinho...'}
          </h1>
        </div>
      </main>
    );
  }

  // Se vindo de detalhes do pedido
  if (queryOrderId && !orderData) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4 py-12">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Erro ao carregar pedido
          </div>
          <button
            onClick={() => navigate(`/orders/${effectiveOrderId}`)}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Voltar para Detalhes do Pedido
          </button>
        </div>
      </main>
    );
  }

  // Se no fluxo normal e carrinho vazio
  if (!queryOrderId && (!cart || cart.items.length === 0)) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4 py-12">
          <div className="text-gray-600 dark:text-gray-400 text-lg">
            Carrinho vazio
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Voltar para Carrinho
          </button>
        </div>
      </main>
    );
  }

  // Calcular totais baseado se é pedido ou carrinho
  let subtotal = 0;
  let shipping = 0;
  let total = 0;

  if (queryOrderId && orderData) {
    // Usando dados do pedido
    subtotal = orderData.items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    shipping = Number(orderData.shippingCost || 0);
    total = Number(orderData.totalAmount || 0);
  } else if (cart) {
    // Usando dados do carrinho
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subtotal = cart.items.reduce((sum: number, item: any) => sum + Number(item.totalPrice || 0), 0);
    shipping = 20.0; // TODO: Calcular frete real do backend
    total = subtotal + shipping;
  }

  /**
   * Callback chamado quando o pagamento é confirmado com sucesso pelo Stripe Elements
   */
  const handlePaymentSuccess = async (confirmedPaymentIntentId: string) => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      if (!effectiveOrderId) {
        setPaymentError('Pedido não encontrado. Volte para revisão.');
        setIsProcessing(false);
        if (!queryOrderId) {
          navigate('/checkout/review');
        } else {
          navigate(`/orders/${effectiveOrderId}`);
        }
        return;
      }

      // Processar pagamento no backend (atualiza status do pedido)
      const paymentResult = await processPayment(String(effectiveOrderId), confirmedPaymentIntentId);

      if (!paymentResult.success) {
        setPaymentError(paymentResult.error || 'Falha ao processar pagamento');
        setIsProcessing(false);
        return;
      }

      // Salvar dados do pagamento
      setPaymentInfo({
        method: 'credit_card',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        installments: 1,
      });
      
      // Atualizar etapa atual para pagamento concluído
      setCurrentStep('payment');
      
      // Navegar para sucesso com orderId na URL
      navigate(`/checkout/success/${paymentResult.orderId}`);

    } catch {
      setPaymentError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Callback chamado quando há erro no pagamento
   */
  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const breadcrumbItems = [
    { label: 'Carrinho', path: '/cart' },
    { label: 'Endereço', path: '/checkout/address' },
    { label: 'Revisão', path: '/checkout/review' },
    { label: 'Pagamento', active: true },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:py-4">
      <CheckoutBreadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 mt-8">
        {/* Coluna Principal - Formulário de Pagamento */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-[#0e121b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Finalize seu Pagamento
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              Insira os dados do seu cartão para finalizar a compra
            </p>
          </div>

          {/* Aviso de inicialização */}
          {!clientSecret && isProcessing && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                  Preparando pagamento... Por favor, aguarde.
                </p>
              </div>
            </div>
          )}

          {/* Erro de Pagamento */}
          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm font-semibold">❌ {paymentError}</p>
            </div>
          )}

          {/* Formulário de Pagamento Stripe */}
          {clientSecret && (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                clientSecret={clientSecret}
                orderId={String(effectiveOrderId)}
                amount={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                isLoading={isProcessing}
              />
            </Elements>
          )}

          {/* Informação de Segurança */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 flex-shrink-0">verified_user</span>
            <div>
              <p className="text-green-700 dark:text-green-300 text-sm font-semibold">Compra 100% Segura</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Sua transação é processada com criptografia de ponta a ponta pelo Stripe, o maior processador de pagamentos do mundo.
              </p>
            </div>
          </div>

          {/* Botão Voltar */}
          <button
            onClick={() => queryOrderId ? navigate(`/orders/${effectiveOrderId}`) : navigate('/checkout/review')}
            className="w-full mt-6 border-2 border-gray-300 dark:border-gray-600 text-[#0e121b] dark:text-white font-bold py-3 rounded-xl text-base hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          >
            {queryOrderId ? 'Voltar para Detalhes do Pedido' : 'Voltar para Revisão'}
          </button>
        </div>

        {/* Coluna Lateral - Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-background-dark/80 p-6 md:p-8 rounded-xl shadow-sm border border-transparent dark:border-gray-800 sticky top-28">
            <h2 className="text-2xl font-bold text-[#0e121b] dark:text-white mb-6">
              Resumo do Pagamento
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-[#0e121b] dark:text-white">
                  R$ {(subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frete</span>
                <span className="font-semibold text-[#0e121b] dark:text-white">
                  R$ {shipping.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-[#0e121b] dark:text-white">Total</span>
              <span className="text-3xl font-black text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <div className="text-center text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <p>Dúvidas sobre pagamento?</p>
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

export default CheckoutPaymentPage;
