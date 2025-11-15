import type { FC } from 'react';
import type { Order } from '@/types/domain/order';

interface OrderConfirmationDetailsProps {
  order: Order;
}

export const OrderConfirmationDetails: FC<OrderConfirmationDetailsProps> = ({ order }) => {
  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Resumo do Pedido */}
      <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6 sm:p-8">
        <h3 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-tight pb-4 border-b border-gray-200 dark:border-gray-700">
          Resumo do Pedido
        </h3>

        {/* Lista de Itens */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center py-4">
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.productTitle || item.product.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quantidade: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{formatPrice(item.totalPrice)}</p>
            </div>
          ))}
        </div>

        {/* Totais */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.totalAmount) - Number(order.shippingCost))}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Frete</span>
            <span>{formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Endereço e Pagamento */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Endereço de Entrega */}
        {order.shippingAddress && (
          <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6">
            <h4 className="text-md font-bold text-gray-800 dark:text-white mb-3">Endereço de Entrega</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city} - {order.shippingAddress.state}
              <br />
              CEP: {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
        )}

        {/* Informações de Pagamento */}
        <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6">
          <h4 className="text-md font-bold text-gray-800 dark:text-white mb-3">Status do Pedido</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Status:</strong> {order.status}
          </p>
          {order.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              <strong>Observações:</strong> {order.notes}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
            <strong>Estimativa de Entrega:</strong> {order.estimatedDelivery || '5-7 dias úteis'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationDetails;
