import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services';
import { formatCurrency, formatDate } from '@/utils';
import Sidebar from '@/features/admin/components/Sidebar';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useQuery({
    queryKey: ['adminOrder', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; icon: string; label: string }> = {
      PAID: { bg: 'bg-success/10', text: 'text-success', icon: 'paid', label: 'Pagamento Aprovado' },
      SHIPPED: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: 'local_shipping', label: 'Enviado' },
      DELIVERED: { bg: 'bg-success/10', text: 'text-success', icon: 'check_circle', label: 'Entregue' },
      CREATED: { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'schedule', label: 'Criado' },
      CANCELED: { bg: 'bg-danger/10', text: 'text-danger', icon: 'cancel', label: 'Cancelado' },
    };
    const item = config[status] || config.CREATED;
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${item.bg} ${item.text} ring-1 ring-inset ring-${item.text}/20`}>
        <span className="material-symbols-outlined text-base mr-1.5">{item.icon}</span>
        {item.label}
      </span>
    );
  };

  if (isLoading || !order) {
    return (
      <div className="flex h-screen bg-background-light dark:bg-background-dark">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detalhes do Pedido</h1>
          </div>
          <div className="flex items-center space-x-6">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <span className="material-symbols-outlined">wb_sunny</span>
            </button>
            <div className="relative">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-bold">Pedido #{order.id}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data: {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Cliente</h3>
                  <p className="font-medium">{order.shippingAddress?.street || 'N/A'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">N/A</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Endereço de Entrega</h3>
                  <p className="font-medium">{order.shippingAddress?.street}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Valor Total</h3>
                  <p className="font-bold text-2xl text-primary">{formatCurrency(Number(order.totalAmount || 0))}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-xl font-bold">Itens do Pedido</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Qtd
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                alt={item.productTitle}
                                className="h-12 w-12 rounded-md object-cover"
                                src={item.imageUrl || 'https://via.placeholder.com/48'}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">{item.productTitle}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">ID: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-4 text-center">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            {/* Shipping Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6">Status do Envio</h3>
              <div className="flex items-center justify-between space-x-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white mb-2">
                    <span className="material-symbols-outlined text-base">check</span>
                  </div>
                  <p className="text-xs text-gray-900 dark:text-white">Pedido</p>
                </div>
                <div className="flex-1 h-0.5 bg-primary"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white mb-2">
                    <span className="material-symbols-outlined text-base">check</span>
                  </div>
                  <p className="text-xs text-gray-900 dark:text-white">Empacotado</p>
                </div>
                <div className="flex-1 h-0.5 bg-primary"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white ring-4 ring-primary/20 mb-2">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                  </div>
                  <p className="text-xs text-primary font-bold">Enviado</p>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-2">
                    <span className="material-symbols-outlined text-base">home</span>
                  </div>
                  <p className="text-xs">Entregue</p>
                </div>
              </div>
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-500 dark:text-gray-400">Código de Rastreio:</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-1">1004152012012</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">Ações do Pedido</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                  Marcar como Enviado
                </button>
                <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <span className="material-symbols-outlined text-base">pin</span>
                  Atualizar Código de Rastreio
                </button>
                <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <span className="material-symbols-outlined text-base">task_alt</span>
                  Confirmar Entrega
                </button>
                <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                  <span className="material-symbols-outlined text-base">cancel</span>
                  Cancelar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailsPage;
