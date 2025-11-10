import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PROCESS_STRIPE_PAYMENT, GET_ORDER_BY_ID, CREATE_PAYMENT_INTENT } from '@/graphql/checkoutQueries';
import type { PaymentIntentResponse, StripePaymentResponse } from '@/types/domain';
import { OrderSummary, StripePaymentForm, ShippingForm, type ShippingFormData } from '../components';
import { Container } from '@/ui/Container';
import { Button } from '@/ui/Button';
import { logger } from '@/utils';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  items: Array<{
    id: string;
    product: {
      id: string;
      title: string;
    };
    quantity: number;
    totalPrice: number;
  }>;
  createdAt: string;
}

interface OrderQueryResult {
  order: Order;
}

interface PaymentIntentMutationResult {
  createPaymentIntent: PaymentIntentResponse;
}

interface StripePaymentResult {
  processStripePayment: StripePaymentResponse;
}

// Validar chave do Stripe
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  throw new Error('VITE_STRIPE_PUBLISHABLE_KEY não configurada');
}
const stripePromise = loadStripe(stripeKey);

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export const CheckoutPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  // Buscar dados do pedido do backend (mais seguro)
  const { data: orderData, loading: orderLoading, error: orderError } = useQuery<OrderQueryResult>(
    GET_ORDER_BY_ID,
    {
      variables: { orderId },
      skip: !orderId,
      fetchPolicy: 'network-only',
    }
  );

  const order = orderData?.order;

  // Mutation para criar payment intent
  const [createPaymentIntent, { loading: paymentLoading }] = useMutation<PaymentIntentMutationResult>(
    CREATE_PAYMENT_INTENT,
    {
      variables: { orderId },
      onCompleted: (data) => {
        if (data?.createPaymentIntent) {
          setPaymentIntent(data.createPaymentIntent);
          logger.info('Payment intent criado com sucesso', { paymentIntentId: data.createPaymentIntent.paymentIntentId });
        }
      },
      onError: (err) => {
        logger.error('Erro ao criar payment intent', { orderId, error: err.message });
        setError('Erro ao criar intenção de pagamento. Tente novamente.');
      },
    }
  );

  const [processStripePayment] = useMutation<StripePaymentResult>(PROCESS_STRIPE_PAYMENT);

  // Validar que temos o orderId
  useEffect(() => {
    if (!orderId) {
      logger.warn('Tentativa de acesso ao checkout sem orderId');
      navigate('/cart');
    }
  }, [orderId, navigate]);

  // Criar payment intent quando necessário
  useEffect(() => {
    if (currentStep === 'payment' && order && !paymentIntent && !paymentLoading) {
      createPaymentIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, order?.id]);

  // Lidar com erros de carregamento
  useEffect(() => {
    if (orderError) {
      logger.error('Erro ao carregar pedido', { orderId, error: orderError.message });
      setError('Erro ao carregar dados do pedido. Tente novamente.');
    }
  }, [orderError, orderId]);

  const handleShippingSubmit = async (data: ShippingFormData) => {
    setShippingData(data);
    // Você pode salvar os dados de envio no servidor aqui
    logger.info('Dados de envio salvos', { data });
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!orderId) {
      setError('Order ID não encontrado');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processStripePayment({
        variables: {
          orderId: orderId,
          paymentIntentId: paymentIntentId,
        },
      });

      if (result.data?.processStripePayment.success) {
        // Redirecionar para confirmação
        navigate(`/order-confirmation/${orderId}`, {
          state: {
            order: {
              ...order,
              status: 'PAID',
              address: shippingData,
            },
            paymentIntentId,
          },
        });
      } else {
        setError(result.data?.processStripePayment.message || 'Falha ao processar pagamento');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  const handleBackToShipping = () => {
    setCurrentStep('shipping');
  };

  // Mostrar loading enquanto carrega os dados
  if (orderLoading) {
    return (
      <Container>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carregando dados do pedido...</h1>
          <p className="text-gray-600 dark:text-gray-300">Aguarde um momento</p>
        </div>
      </Container>
    );
  }

  // Se não tem dados, redirecionar para carrinho
  if (!order) {
    return (
      <Container>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedido não encontrado</h1>
          <p className="text-gray-600 dark:text-gray-300">Redirecionando para o carrinho...</p>
          <Button onClick={() => navigate('/cart')}>Voltar ao Carrinho</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Coluna Esquerda: Formulários */}
          <div className="lg:col-span-7">
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-700 dark:text-red-300">
                <p className="font-semibold">❌ Erro</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm underline mt-2 hover:no-underline"
                >
                  Descartar
                </button>
              </div>
            )}

            {currentStep === 'shipping' && (
              <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  onBack={() => navigate('/cart')}
                  isLoading={isProcessing}
                  initialData={shippingData || undefined}
                />
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                {/* Mostrar resumo do envio */}
                {shippingData && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Informações de Envio</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {shippingData.fullName}
                      <br />
                      {shippingData.street}, {shippingData.number}
                      {shippingData.complement && `, ${shippingData.complement}`}
                      <br />
                      {shippingData.city} - {shippingData.state}, {shippingData.cep}
                    </p>
                  </div>
                )}

                {paymentIntent ? (
                  <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent.clientSecret }}>
                    <StripePaymentForm
                      clientSecret={paymentIntent.clientSecret}
                      orderId={orderId!}
                      amount={Number(order.totalAmount)}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isLoading={isProcessing}
                    />
                  </Elements>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-300">Preparando formulário de pagamento...</p>
                  </div>
                )}

                <Button
                  variant="secondary"
                  onClick={handleBackToShipping}
                  disabled={isProcessing || paymentLoading}
                  className="w-full"
                >
                  Voltar para Envio
                </Button>
              </div>
            )}
          </div>

          {/* Coluna Direita: Resumo do Pedido */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6 lg:p-8 sticky top-8">
              <OrderSummary order={order} loading={orderLoading} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPage;
