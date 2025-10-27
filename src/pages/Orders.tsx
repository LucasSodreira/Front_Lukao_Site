import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import Container from '../ui/Container';
import { Card, CardBody, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';

const GET_MY_ORDERS = gql`
  query GetMyOrders($page: Int, $size: Int) {
    myOrders(page: $page, size: $size) {
      orders {
        id
        status
        totalAmount
        shippingCost
        notes
        createdAt
        updatedAt
        items {
          id
          productTitle
          productPrice
          quantity
          totalPrice
        }
      }
      totalCount
      totalPages
    }
  }
`;

interface OrderItem {
  id: string;
  productTitle: string;
  productPrice: string;
  quantity: number;
  totalPrice: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  shippingCost: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrdersData {
  myOrders: {
    orders: Order[];
    totalCount: number;
    totalPages: number;
  };
}

const Orders = () => {
  const { loading, error, data } = useQuery<OrdersData>(GET_MY_ORDERS, {
    variables: { page: 0, size: 10 }
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

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">Carregando pedidos...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-600">Erro ao carregar pedidos: {error.message}</div>
      </Container>
    );
  }

  const orders = data?.myOrders?.orders || [];

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
                        order.items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toString()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Frete</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.shippingCost)}</span>
                  </div>
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
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Orders;
