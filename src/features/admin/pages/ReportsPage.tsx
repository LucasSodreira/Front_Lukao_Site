import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import { Container } from '@/ui/Container';

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: number;
  name: string;
  sold: number;
  revenue: number;
}

interface CustomerMetric {
  label: string;
  value: number;
  change: number;
}

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock data - TODO: criar serviço de relatórios quando disponível
  const mockSalesData: SalesData[] = [
    { month: 'Janeiro', revenue: 15000, orders: 45 },
    { month: 'Fevereiro', revenue: 18000, orders: 52 },
    { month: 'Março', revenue: 21000, orders: 61 },
    { month: 'Abril', revenue: 19500, orders: 55 },
    { month: 'Maio', revenue: 24000, orders: 68 },
    { month: 'Junho', revenue: 26500, orders: 75 },
  ];

  const mockTopProducts: TopProduct[] = [
    { id: 1, name: 'Camiseta Premium', sold: 156, revenue: 4680 },
    { id: 2, name: 'Calça Jeans', sold: 124, revenue: 3720 },
    { id: 3, name: 'Jaqueta de Couro', sold: 87, revenue: 6090 },
    { id: 4, name: 'Tênis Esportivo', sold: 142, revenue: 4844 },
    { id: 5, name: 'Blusa Social', sold: 98, revenue: 2940 },
  ];

  const mockCustomerMetrics: CustomerMetric[] = [
    { label: 'Novos Clientes', value: 234, change: 12 },
    { label: 'Clientes Ativos', value: 1456, change: 8 },
    { label: 'Taxa de Retenção', value: 87, change: 3 },
    { label: 'Ticket Médio', value: 350, change: -2 },
  ];

  const { data: salesData = mockSalesData } = useQuery({
    queryKey: ['adminReportsSales', dateRange],
    queryFn: () => Promise.resolve(mockSalesData),
  });

  const { data: topProducts = mockTopProducts } = useQuery({
    queryKey: ['adminReportsTopProducts'],
    queryFn: () => Promise.resolve(mockTopProducts),
  });

  const { data: customerMetrics = mockCustomerMetrics } = useQuery({
    queryKey: ['adminReportsCustomers'],
    queryFn: () => Promise.resolve(mockCustomerMetrics),
  });

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calcula maxRevenue para escala do gráfico
  const maxRevenue = Math.max(...salesData.map((item) => item.revenue));

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Container>
          <Header />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">Relatórios</h1>
              <p className="text-sm text-gray-500">Análise de vendas, clientes e produtos.</p>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    dateRange === range
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'week' ? 'Semana' : range === 'month' ? 'Mês' : 'Ano'}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500 mb-2">Receita Total</p>
              <p className="text-3xl font-bold">R$ {(totalRevenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-green-600 mt-1">+12% vs período anterior</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500 mb-2">Total de Pedidos</p>
              <p className="text-3xl font-bold">{totalOrders}</p>
              <p className="text-xs text-green-600 mt-1">+8% vs período anterior</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500 mb-2">Ticket Médio</p>
              <p className="text-3xl font-bold">R$ {averageOrderValue.toFixed(0)}</p>
              <p className="text-xs text-red-600 mt-1">-2% vs período anterior</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500 mb-2">Taxa de Conversão</p>
              <p className="text-3xl font-bold">3.2%</p>
              <p className="text-xs text-green-600 mt-1">+0.5% vs período anterior</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg border p-6">
              <h2 className="text-lg font-bold mb-4">Receita por Mês</h2>
              <div className="space-y-2">
                {salesData.map((item) => (
                  <div key={item.month}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.month}</span>
                      <span className="text-sm font-semibold">R$ {item.revenue.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all"
                        style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Metrics */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-bold mb-4">Métricas de Clientes</h2>
              <div className="space-y-4">
                {customerMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <span
                        className={`text-xs font-semibold ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                    <p className="text-lg font-bold">{metric.value.toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-4">Produtos Mais Vendidos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-700">Produto</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Unidades</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Receita</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">% do Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topProducts.map((product) => {
                    const totalProductRevenue = topProducts.reduce((sum, p) => sum + p.revenue, 0);
                    const percentage = ((product.revenue / totalProductRevenue) * 100).toFixed(1);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{product.sold}</td>
                        <td className="px-4 py-3 text-right font-semibold">R$ {product.revenue.toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Section */}
          <div className="mt-6 flex gap-3">
            <button className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium">
              Exportar Relatório
            </button>
            <button className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium">
              Agendar Envio
            </button>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default ReportsPage;