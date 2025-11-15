import type { Order } from '@/types/domain/order';
import { formatCurrency } from '@/utils';
import { Button } from '@/ui/Button';

interface OrderSummaryProps {
  order: Order;
  onRequestHelp?: () => void;
}

export const OrderSummary = ({ order, onRequestHelp }: OrderSummaryProps) => {
  const toNumber = (value: string | number) => (
    typeof value === 'string' ? parseFloat(value) : value
  );

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + toNumber(item.totalPrice), 0);
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm sticky top-28">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        Resumo do Pedido
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white">
            {formatCurrency(calculateSubtotal())}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Frete</span>
          <span className="text-gray-900 dark:text-white">
            {formatCurrency(toNumber(order.shippingCost))}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Desconto</span>
          <span className="text-gray-900 dark:text-white">R$ 0,00</span>
        </div>
      </div>
      
      <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-4">
        <span className="text-gray-800 dark:text-white">Total</span>
        <span className="text-gray-800 dark:text-white">
          {formatCurrency(toNumber(order.totalAmount))}
        </span>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="font-bold text-gray-800 dark:text-white mb-3">
          Endereço de Entrega
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p>CEP: {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>
      
      {onRequestHelp && (
        <Button
          onClick={onRequestHelp}
          variant="secondary"
          className="w-full"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Solicitar Ajuda
        </Button>
      )}
    </div>
  );
};
