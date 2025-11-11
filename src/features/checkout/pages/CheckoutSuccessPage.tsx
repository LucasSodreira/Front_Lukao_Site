import type { FC } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { Container } from '@/ui/Container';
import { Button } from '@/ui/Button';
import { OrderConfirmationDetails } from '../components/OrderConfirmationDetails';
import { GET_ORDER_BY_ID } from '@/graphql/checkoutQueries';
import { useCheckoutState } from '../hooks';
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
      image?: string;
    };
    quantity: number;
    totalPrice: number;
  }>;
  createdAt: string;
  address?: {
    fullName: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  paymentMethod?: string;
  estimatedDelivery?: string;
}

interface OrderQueryResult {
  order: Order;
}

export const CheckoutSuccessPage: FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { clearCheckout } = useCheckoutState();

  // Limpar dados de checkout quando chegar na página de sucesso
  useEffect(() => {
    clearCheckout();
  }, [clearCheckout]);

  // Buscar dados do pedido da API
  const { data: orderData, loading, error: queryError } = useQuery<OrderQueryResult>(
    GET_ORDER_BY_ID,
    {
      variables: { orderId },
      skip: !orderId,
      fetchPolicy: 'network-only',
    }
  );

  if (queryError) {
    logger.error('Erro ao carregar pedido para confirmação', { orderId, error: queryError.message });
  }

  const order = orderData?.order;

  // Mostrar loading
  if (loading) {
    return (
      <Container>
        <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="layout-content-container flex flex-col max-w-2xl flex-1 text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300">Carregando detalhes do pedido...</p>
          </div>
        </main>
      </Container>
    );
  }

  // Mostrar erro
  if (queryError || !order) {
    return (
      <Container>
        <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="layout-content-container flex flex-col max-w-2xl flex-1">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <p className="text-red-700 dark:text-red-300 font-semibold mb-2">
                Erro ao carregar o pedido
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                Não conseguimos recuperar os detalhes do seu pedido. Por favor, tente novamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => window.location.reload()}>
                  Tentar Novamente
                </Button>
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Voltar para Home
                </Button>
              </div>
            </div>
          </div>
        </main>
      </Container>
    );
  }

  return (
    <Container>
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="layout-content-container flex flex-col max-w-2xl flex-1">
          {/* Success Header */}
          <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6 sm:p-10 text-center flex flex-col items-center mb-6">
            <div className="flex items-center justify-center size-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-5">
              <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pb-1 pt-1">
              Seu Pedido {order.id}
            </p>

            <h1 className="text-gray-800 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-2">
              Obrigado pelo seu pedido!
            </h1>

            <p className="text-gray-800 dark:text-gray-300 text-base font-normal leading-normal max-w-md">
              Um e-mail de confirmação com todos os detalhes foi enviado para o seu endereço.
            </p>
          </div>

          {/* Order Details */}
          {order && <OrderConfirmationDetails order={order} />}

          {/* Info Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Você receberá um e-mail de notificação quando seu pedido for enviado.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button onClick={() => navigate('/')}>Continuar Comprando</Button>
              <Button variant="secondary" onClick={() => navigate('/orders')}>
                Ir para Meus Pedidos
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
};

export default CheckoutSuccessPage;
