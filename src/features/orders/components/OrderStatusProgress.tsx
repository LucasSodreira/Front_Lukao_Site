import { ORDER_STATUS, type OrderStatus } from '@/types/domain/order';

interface OrderStatusProgressProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

interface StatusStep {
  key: OrderStatus;
  label: string;
  date?: string;
}

export const OrderStatusProgress = ({ status, createdAt, updatedAt }: OrderStatusProgressProps) => {
  const steps: StatusStep[] = [
    { key: ORDER_STATUS.CREATED, label: 'Pedido Criado', date: createdAt },
    { key: ORDER_STATUS.PAID, label: 'Pagamento Aprovado' },
    { key: ORDER_STATUS.SHIPPED, label: 'Enviado' },
    { key: ORDER_STATUS.DELIVERED, label: 'Entregue' },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === status);
  const isCanceled = status === ORDER_STATUS.CANCELED;

  const getProgressPercentage = () => {
    if (isCanceled) return 0;
    return ((currentStepIndex + 1) / steps.length) * 100;
  };

  const getStepStatus = (index: number) => {
    if (isCanceled) return 'canceled';
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  const formatStepDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (isCanceled) {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
          <p className="text-base font-bold text-red-600 dark:text-red-400">
            Pedido Cancelado
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Cancelado em {formatStepDate(updatedAt)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <p className="text-base font-bold text-gray-800 dark:text-white">
          Status do Pedido:{' '}
          <span className="text-blue-600 dark:text-blue-400">
            {steps[currentStepIndex]?.label || 'Em processamento'}
          </span>
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Seu pedido está em andamento
        </p>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className="hidden sm:flex justify-between text-xs text-center font-medium">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          return (
            <div key={step.key} className="flex-1">
              <p className={`${
                stepStatus === 'completed' || stepStatus === 'current'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stepStatus === 'completed' ? formatStepDate(step.date) : 
                 stepStatus === 'current' ? formatStepDate(updatedAt) : ''}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="sm:hidden space-y-2">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                stepStatus === 'completed' || stepStatus === 'current'
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {stepStatus === 'completed' && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${
                  stepStatus === 'completed' || stepStatus === 'current'
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {step.label}
                </p>
                {(stepStatus === 'completed' || stepStatus === 'current') && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stepStatus === 'completed' ? formatStepDate(step.date) : formatStepDate(updatedAt)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
