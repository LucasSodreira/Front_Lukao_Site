import type { FC } from 'react';

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    image?: string;
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
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="size-16 rounded-lg object-cover mr-4"
                />
              )}
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{item.product.title}</p>
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
        {order.address && (
          <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6">
            <h4 className="text-md font-bold text-gray-800 dark:text-white mb-3">Endereço de Entrega</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {order.address.fullName}
              <br />
              {order.address.street}, {order.address.number}
              {order.address.complement && `, ${order.address.complement}`}
              <br />
              {order.address.neighborhood}, {order.address.city} - {order.address.state}
              <br />
              CEP: {order.address.cep}
            </p>
          </div>
        )}

        {/* Informações de Pagamento */}
        <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6">
          <h4 className="text-md font-bold text-gray-800 dark:text-white mb-3">Pagamento</h4>
          {order.paymentMethod && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{order.paymentMethod}</p>
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
