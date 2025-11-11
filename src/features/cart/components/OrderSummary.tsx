interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  shipping,
  total,
  onCheckout,
  isLoading = false,
}) => {
  const formatPrice = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-gray-800 dark:text-white text-2xl font-bold tracking-tight pb-4 border-b border-gray-200 dark:border-gray-700">
        Resumo do Pedido
      </h2>

      <div className="space-y-3 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-base">
          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {formatPrice(subtotal)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-gray-500 dark:text-gray-400">Descontos</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              - {formatPrice(discount)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-base">
          <span className="text-gray-500 dark:text-gray-400">Frete</span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {formatPrice(shipping)}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-xl font-bold pt-4">
        <span className="text-gray-800 dark:text-white">Total</span>
        <span className="text-gray-800 dark:text-white">{formatPrice(total)}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={isLoading}
        className="mt-6 w-full flex items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold tracking-wide hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 dark:focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processando...' : 'Continuar a compra'}
        {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
      </button>
    </div>
  );
};

export default OrderSummary;
