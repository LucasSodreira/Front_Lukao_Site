import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PROCESS_STRIPE_PAYMENT, GET_ORDER_BY_ID, CREATE_PAYMENT_INTENT } from '@/graphql/checkoutQueries';
import type { PaymentIntentResponse, StripePaymentResponse } from '@/types/domain';
import { OrderSummary, StripePaymentForm } from '../components';
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

export const CheckoutPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);

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

  // Criar payment intent quando o pedido for carregado 
  useEffect(() => {
    if (order && !paymentIntent && !paymentLoading) {
      createPaymentIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]); // Só executa quando o orderId mudar

  // Lidar com erros de carregamento
  useEffect(() => {
    if (orderError) {
      logger.error('Erro ao carregar pedido', { orderId, error: orderError.message });
      setError('Erro ao carregar dados do pedido. Tente novamente.');
    }
  }, [orderError, orderId]);

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

  // Mostrar loading enquanto carrega os dados
  if (orderLoading || paymentLoading) {
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
  if (!order || !paymentIntent) {
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

  const stripeOptions = {
    clientSecret: paymentIntent.clientSecret,
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finalizar Pagamento</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Pedido #{order.id}</p>
        </div>

        {/* Progresso */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Dados</span>
          </div>
          <div className="flex-1 h-1 bg-green-500 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              2
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Pagamento</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold">
              3
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Confirmação</span>
          </div>
        </div>

        {/* Erro Global */}
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

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Coluna Esquerda: Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise} options={stripeOptions}>
              <StripePaymentForm
                clientSecret={paymentIntent.clientSecret}
                orderId={orderId!}
                amount={Number(order.totalAmount)}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                isLoading={isProcessing}
              />
            </Elements>
          </div>

          {/* Coluna Direita: Resumo do Pedido */}
          <div>
            <OrderSummary order={order} />
          </div>
        </div>

        {/* Botão de Voltar */}
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => navigate('/cart')}
            disabled={isProcessing}
          >
            Voltar ao Carrinho
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPage;
