import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services';
import { Container } from '@/ui/Container';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import Badge from '@/ui/Badge';
import { Button } from '@/ui/Button';

interface OrderItem {
  id: string;
  productTitle: string;
  productPrice: string | number;
  quantity: number;
  totalPrice: string | number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: string | number;
  shippingCost?: string | number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const result = await orderService.getMyOrders();
      return result as unknown as Order[];
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
      CREATED: { label: 'Criado', variant: 'default' },
      PAID: { label: 'Pago', variant: 'success' },
      SHIPPED: { label: 'Enviado', variant: 'warning' },
      DELIVERED: { label: 'Entregue', variant: 'success' },
      CANCELED: { label: 'Cancelado', variant: 'danger' }
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'default' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Carregando pedidos...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Erro ao carregar pedidos
          </div>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Nenhum pedido encontrado</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Você ainda não fez nenhum pedido.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardBody>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <CardTitle>Pedido #{order.id}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Realizado em {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.productTitle}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantidade: {item.quantity} × {formatPrice(item.productPrice)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatPrice(
                        order.items.reduce((sum: number, item: OrderItem) => {
                          const price = typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice;
                          return sum + price;
                        }, 0)
                      )}
                    </span>
                  </div>
                  {order.shippingCost !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Frete</span>
                      <span className="text-gray-900 dark:text-white">{formatPrice(order.shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Observações:</span> {order.notes}
                    </p>
                  </div>
                )}

                {/* Botão para continuar pagamento se o pedido está pendente */}
                {order.status === 'CREATED' && (
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate(`/checkout/${order.id}`)}
                      className="w-full"
                    >
                      Continuar Pagamento
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default OrdersPage;
