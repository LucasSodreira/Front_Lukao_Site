import { Card, CardBody } from '@/ui/Card';

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
  };
  quantity: number;
  totalPrice: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  items: OrderItem[];
  createdAt: string;
}

interface OrderSummaryProps {
  order: Order;
  loading?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ order, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardBody className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo do Pedido</h3>
        </div>

        {/* Itens */}
        <div className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>
                <p className="text-gray-900 dark:text-gray-100">{item.product.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Qtd: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-100">R$ {Number(item.totalPrice).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Totais */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              R$ {(Number(order.totalAmount) - Number(order.shippingCost)).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Frete:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">R$ {Number(order.shippingCost).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">R$ {Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Informações */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
          <p className="text-blue-900 dark:text-blue-300">
            <strong>Pedido:</strong> {order.id}
          </p>
          <p className="text-blue-900 dark:text-blue-300">
            <strong>Status:</strong> {order.status === 'CREATED' ? 'Aguardando Pagamento' : order.status}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderSummary;
