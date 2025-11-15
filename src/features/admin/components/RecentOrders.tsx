import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types/domain/order';

const RecentOrders: React.FC = () => {
  const { data, isLoading } = useQuery(
    { queryKey: ['recent-orders'], queryFn: () => orderService.getMyOrders({ size: 5 }) },
  );

  const orders: Order[] = (data as any)?.orders ?? [];

  return (
    <div className="mt-6 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
      <h3 className="text-text-light-primary dark:text-text-dark-primary text-lg font-semibold leading-normal mb-4">Últimos Pedidos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-light-secondary dark:text-text-dark-secondary uppercase">
            <tr>
              <th className="py-3 px-4">ID do Pedido</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="py-4 px-4">Carregando...</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border-light dark:border-border-dark">
                  <td className="py-4 px-4 font-medium text-text-light-primary dark:text-text-dark-primary">#{order.id}</td>
                  <td className="py-4 px-4">{order.shippingAddress?.street ?? '-'} </td>
                  <td className="py-4 px-4 text-text-light-secondary dark:text-text-dark-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">R$ {Number(order.totalAmount).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <span className="size-1.5 inline-block rounded-full bg-green-500"></span> {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
