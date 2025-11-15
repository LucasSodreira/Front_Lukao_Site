import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminDashboardService } from '@/services';
import { formatCurrency } from '@/utils';

const StatsCards: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminDashboardService.getOverview(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    {
      title: 'Vendas Totais',
      value: formatCurrency(Number(data.summary.totalRevenue)),
      change: `${data.summary.revenueGrowth > 0 ? '+' : ''}${data.summary.revenueGrowth}%`,
      color: data.summary.revenueGrowth >= 0 ? 'text-[#07883b]' : 'text-[#e73908]',
    },
    {
      title: 'Total de Pedidos',
      value: String(data.summary.totalOrders),
      change: `${data.summary.ordersGrowth > 0 ? '+' : ''}${data.summary.ordersGrowth}%`,
      color: data.summary.ordersGrowth >= 0 ? 'text-[#07883b]' : 'text-[#e73908]',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(Number(data.summary.averageTicket)),
      change: `${data.summary.totalOrders} pedidos`,
      color: 'text-gray-500',
    },
    {
      title: 'Clientes Ativos',
      value: String(data.summary.activeCustomers),
      change: `${data.summary.totalCustomers} total`,
      color: 'text-gray-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((c) => (
        <div key={c.title} className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-medium leading-normal">{c.title}</p>
          <p className="text-text-light-primary dark:text-text-dark-primary tracking-tight text-3xl font-bold leading-tight">{c.value}</p>
          <p className={`${c.color} text-sm font-medium leading-normal`}>{c.change}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
