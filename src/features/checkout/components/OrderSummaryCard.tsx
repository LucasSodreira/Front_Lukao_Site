import { useState } from 'react';

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    images?: Array<{
      url: string;
    }>;
  };
  quantity: number;
  totalPrice: number;
}

interface OrderSummaryCardProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  onCheckout?: () => void;
  onApplyCoupon?: (code: string) => void;
  checkoutButtonText?: string;
  showCoupon?: boolean;
  isLoading?: boolean;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  subtotal,
  shipping,
  discount = 0,
  total,
  onCheckout,
  onApplyCoupon,
  checkoutButtonText = 'Continuar a compra',
  showCoupon = true,
  isLoading = false,
}) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim() && onApplyCoupon) {
      onApplyCoupon(couponCode);
      setCouponCode('');
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark/80 p-6 rounded-xl shadow-sm border border-transparent dark:border-gray-800 sticky top-24">
      <h3 className="text-xl font-bold text-[#0e121b] dark:text-white mb-6">
        Resumo da Compra
      </h3>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => {
          const imageUrl =
            item.product.images && item.product.images.length > 0
              ? item.product.images[0].url
              : 'https://via.placeholder.com/64';

          return (
            <div key={item.id} className="flex items-start gap-4">
              <img
                className="h-16 w-16 rounded-lg object-cover"
                alt={item.product.title}
                src={imageUrl}
              />
              <div className="flex-1">
                <p className="font-medium text-[#212529] dark:text-gray-300">
                  {item.product.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Qtd: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-[#212529] dark:text-gray-300">
                R$ {Number(item.totalPrice).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#CED4DA] dark:border-gray-700 my-6"></div>

      {/* Cost Summary */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Frete</span>
          <span>R$ {shipping.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Desconto</span>
            <span>- R$ {discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#CED4DA] dark:border-gray-700 my-6"></div>

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold text-[#0e121b] dark:text-white">
        <span>Total</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

      {/* Coupon */}
      {showCoupon && (
        <div className="mt-6">
          <label
            className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400"
            htmlFor="coupon"
          >
            Cupom de Desconto
          </label>
          <div className="flex gap-2">
            <input
              className="flex-grow rounded-lg border-[#CED4DA] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary text-sm"
              id="coupon"
              placeholder="INSIRA SEU CUPOM"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 rounded-lg bg-gray-600 dark:bg-gray-700 text-white font-bold text-sm hover:opacity-90"
              disabled={!couponCode.trim()}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <button
          onClick={onCheckout}
          disabled={isLoading}
          className="mt-8 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processando...' : checkoutButtonText}
        </button>
      )}

      {/* Security Badge */}
      <div className="flex justify-center items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-4">
        <span className="material-symbols-outlined text-sm">verified_user</span>
        <span>Compra 100% segura</span>
      </div>
    </div>
  );
};
