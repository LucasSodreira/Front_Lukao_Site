import { useState } from 'react';

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    images?: Array<{
      id: string;
      url: string;
      sortOrder?: number;
    }>;
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
  const [couponCode, setCouponCode] = useState('');

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  const shipping = order.shippingCost || 0;
  const total = subtotal + shipping;

  const handleApplyCoupon = () => {
    // TODO: Implementar lógica de cupom
    console.log('Aplicar cupom:', couponCode);
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        Resumo do Pedido
      </h2>

      {/* Product List */}
      <div className="space-y-4">
        {order.items.map((item) => {
          const imageUrl = item.product.images && item.product.images.length > 0
            ? item.product.images[0].url
            : 'https://via.placeholder.com/64';

          return (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                />
                <span className="absolute -top-2 -right-2 flex items-center justify-center size-5 bg-gray-600 text-white text-xs font-semibold rounded-full">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                  {item.product.title}
                </p>
              </div>
              <p className="font-semibold text-sm text-gray-800 dark:text-white">
                R$ {Number(item.totalPrice).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Coupon Code */}
      <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <input
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-11 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-sm font-normal leading-normal"
          placeholder="Cupom de desconto"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button
          onClick={handleApplyCoupon}
          className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold min-w-0 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Aplicar
        </button>
      </div>

      {/* Cost Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 text-sm">
        <div className="flex justify-between">
          <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            R$ {subtotal.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 dark:text-gray-400">Frete</p>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {shipping > 0 ? `R$ ${shipping.toFixed(2)}` : 'A calcular'}
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-base font-bold text-gray-800 dark:text-white">Total</p>
        <p className="text-xl font-bold text-gray-800 dark:text-white">
          R$ {total.toFixed(2)}
        </p>
      </div>
    </>
  );
};

export default OrderSummary;
