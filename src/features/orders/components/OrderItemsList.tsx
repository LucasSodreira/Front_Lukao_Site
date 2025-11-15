import type { OrderItem } from '@/types/domain/order';
import { formatCurrency } from '@/utils';

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  const toNumber = (value: string | number) => (
    typeof value === 'string' ? parseFloat(value) : value
  );

  return (
    <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-gray-800 dark:text-white text-xl font-bold px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-700">
        Itens do Pedido ({items.length})
      </h2>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {item.productTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {item.product.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Quantidade: <span className="font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Preço unitário: <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(toNumber(item.productPrice))}
                  </span>
                </span>
              </div>
            </div>
            
            <div className="flex-shrink-0 text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(toNumber(item.totalPrice))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
