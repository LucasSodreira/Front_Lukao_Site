import { Card, CardBody, CardTitle } from '@/ui/Card';
import Badge from '@/ui/Badge';
import { Button } from '@/ui/Button';
import type { Order, OrderStatus } from '@/types/domain/order';
import { formatCurrency, formatDate } from '@/utils';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  CREATED: { label: 'Aguardando Pagamento', variant: 'warning' },
  PAID: { label: 'Pago', variant: 'success' },
  SHIPPED: { label: 'Enviado', variant: 'warning' },
  DELIVERED: { label: 'Entregue', variant: 'success' },
  CANCELED: { label: 'Cancelado', variant: 'danger' }
};

export const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  const statusInfo = statusConfig[order.status] || { label: order.status, variant: 'default' as const };

  const toNumber = (value: string | number) => (
    typeof value === 'string' ? parseFloat(value) : value
  );

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + toNumber(item.totalPrice), 0);
  };

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <CardTitle>Pedido #{order.id}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Realizado em {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </div>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.productTitle}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quantidade: {item.quantity} × {formatCurrency(toNumber(item.productPrice))}
                </p>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(toNumber(item.totalPrice))}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(calculateSubtotal())}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Frete</span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(toNumber(order.shippingCost))}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(toNumber(order.totalAmount))}
            </span>
          </div>
        </div>

        {order.notes && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Observações:</span> {order.notes}
            </p>
          </div>
        )}

        <div className="mt-4">
          <Button
            onClick={() => onViewDetails(order.id)}
            variant="secondary"
            className="w-full"
          >
            Ver Detalhes
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
