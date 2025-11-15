import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '@/services';
import { Container } from '@/ui/Container';
import { Button } from '@/ui/Button';
import { formatDateLong } from '@/utils';
import { OrderStatusProgress, OrderItemsList, OrderSummary } from '../components';

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : undefined;
  const queryClient = useQueryClient();
  
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [cancelError, setCancelError] = useState<string>('');

  const { 
    data: order, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => {
      if (!orderId) throw new Error('ID do pedido inválido');
      return orderService.getOrderById(orderId);
    },
    enabled: !!orderId,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleRequestHelp = () => {
    // Implementar navegação para suporte ou abrir modal
    alert('Funcionalidade de suporte em desenvolvimento');
  };

  const handleCancelOrder = async () => {
    if (!orderId || !order) return;

    const confirmCancel = window.confirm(
      'Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'
    );

    if (!confirmCancel) return;

    setIsLoadingCancel(true);
    setCancelError('');

    try {
      await orderService.cancelOrder(orderId);
      
      // Atualizar cache e recarregar dados
      await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      await queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      await refetch();
      
      // Mostrar mensagem de sucesso
      alert('Pedido cancelado com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar pedido';
      setCancelError(errorMessage);
    } finally {
      setIsLoadingCancel(false);
    }
  };

  const handleContinuePayment = () => {
    if (!orderId) return;
    // Navegar para pagamento com o orderId
    navigate(`/checkout/payment?orderId=${orderId}`);
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Carregando detalhes do pedido...</div>
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-8">
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Erro ao carregar detalhes do pedido
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : 'Pedido não encontrado'}
          </p>
          <Button onClick={() => navigate('/orders')}>
            Voltar para Pedidos
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12">
      <div className="flex flex-col gap-8">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/profile/orders')}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Compras
        </button>

        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
          >
            Sua Conta
          </button>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
          <button
            onClick={() => navigate('/profile/orders')}
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
          >
            Meus Pedidos
          </button>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
          <span className="text-gray-800 dark:text-white text-sm font-medium">
            Pedido #{order.id}
          </span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-800 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Detalhes do Pedido #{order.id}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Realizado em {formatDateLong(order.createdAt)}
            </p>
          </div>
          <Button
            onClick={handlePrint}
            variant="secondary"
            className="print:hidden"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Recibo
          </Button>
        </div>

        {/* Erro ao cancelar */}
        {cancelError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm font-semibold">❌ {cancelError}</p>
          </div>
        )}

        {/* Order Status Progress */}
        <OrderStatusProgress 
          status={order.status}
          createdAt={order.createdAt}
          updatedAt={order.updatedAt}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Order Items */}
            <OrderItemsList items={order.items} />

            {/* Shipping and Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Endereço de Entrega
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>CEP: {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                {order.shippingAddress.primary && (
                  <p className="text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Endereço Principal
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Rastreamento
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-800 dark:text-white">Código:</span> BR123456789XX
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        Pedido em trânsito
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Centro de distribuição - São Paulo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Saiu para entrega
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => window.open('https://rastreamento.correios.com.br', '_blank')}
                  variant="secondary"
                  className="w-full"
                >
                  Rastrear Pedido
                </Button>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                  Observações
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Summary and Payment */}
          <div className="lg:col-span-1">
            <OrderSummary 
              order={order}
              onRequestHelp={handleRequestHelp}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-200 dark:border-gray-700">
          {/* Botão Cancelar - apenas se não foi cancelado e não foi entregue */}
          {order.status !== 'CANCELED' && order.status !== 'DELIVERED' && (
            <Button
              onClick={handleCancelOrder}
              disabled={isLoadingCancel}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingCancel ? 'Cancelando...' : 'Cancelar Pedido'}
            </Button>
          )}

          {/* Botão Continuar Pagamento - apenas se está aguardando pagamento */}
          {order.status === 'CREATED' && (
            <Button
              onClick={handleContinuePayment}
              disabled={isLoadingCancel}
              className="px-6 py-3"
            >
              Continuar para Pagamento
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default OrderDetailPage;
