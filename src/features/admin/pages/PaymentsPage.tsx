import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/features/admin/components/Sidebar';
import { adminOrderService } from '@/services';
import { formatCurrency, formatDate } from '@/utils';
import type { Transaction } from '@/services/admin-order.service';

const PaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'CREATED' | 'PAID' | 'CANCELED'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'credit_card' | 'pix' | 'boleto'>('all');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['adminTransactions', page, pageSize, searchTerm, statusFilter],
    queryFn: () => adminOrderService.listTransactions(
      page,
      pageSize,
      searchTerm,
      statusFilter === 'all' ? undefined : statusFilter
    ),
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      PAID: { bg: 'bg-success/10', text: 'text-success', label: 'Pago' },
      CREATED: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pendente' },
      CANCELED: { bg: 'bg-danger/10', text: 'text-danger', label: 'Reembolsado' },
      SHIPPED: { bg: 'bg-success/10', text: 'text-success', label: 'Pago' },
      DELIVERED: { bg: 'bg-success/10', text: 'text-success', label: 'Pago' },
    };
    const config = statusMap[status] || statusMap.CREATED;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentMethod = (method: string) => {
    const methodMap: Record<string, { icon: string; label: string }> = {
      credit_card: { icon: 'credit_card', label: 'Cartão' },
      pix: { icon: 'photos', label: 'Pix' },
      boleto: { icon: 'receipt_long', label: 'Boleto' },
    };
    const config = methodMap[method] || { icon: 'credit_card', label: method };
    return (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-lg text-gray-500">{config.icon}</span>
        <span className="text-[#718096] dark:text-gray-400">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-col">
              <h1 className="text-[#1A202C] dark:text-white text-3xl font-black leading-tight tracking-tight">Pagamentos</h1>
              <p className="text-[#718096] dark:text-gray-400 text-base font-normal leading-normal mt-1">
                Monitore e gerencie todas as transações financeiras.
              </p>
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
              <span className="material-symbols-outlined text-base">download</span>
              <span className="truncate">Exportar Relatório</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-[#E2E8F0] dark:border-gray-700">
              <p className="text-[#1A202C] dark:text-gray-300 text-base font-medium leading-normal">Total Recebido (Hoje)</p>
              <p className="text-[#1A202C] dark:text-white tracking-light text-3xl font-bold leading-tight">
                {data?.totalPaid ? formatCurrency(Number(data.totalPaid)) : 'R$ 0,00'}
              </p>
              <p className="text-success text-sm font-medium leading-normal mt-1">
                {data?.transactions.length || 0} transações
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-[#E2E8F0] dark:border-gray-700">
              <p className="text-[#1A202C] dark:text-gray-300 text-base font-medium leading-normal">Pagamentos Pendentes</p>
              <p className="text-[#1A202C] dark:text-white tracking-light text-3xl font-bold leading-tight">
                {data?.pending || 0}
              </p>
              <p className="text-success text-sm font-medium leading-normal mt-1">Aguardando processamento</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-[#E2E8F0] dark:border-gray-700">
              <p className="text-[#1A202C] dark:text-gray-300 text-base font-medium leading-normal">Total Reembolsado (Mês)</p>
              <p className="text-[#1A202C] dark:text-white tracking-light text-3xl font-bold leading-tight">
                {data?.failed || 0}
              </p>
              <p className="text-danger text-sm font-medium leading-normal mt-1">Requerem atenção</p>
            </div>
          </div>

          {/* Toolbar and Table Section */}
          <div className="bg-white dark:bg-background-dark border border-[#E2E8F0] dark:border-gray-700 rounded-xl">
            {/* SearchBar & Filters */}
            <div className="p-4 border-b border-[#E2E8F0] dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="flex flex-col w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                      <div className="text-[#718096] flex bg-background-light dark:bg-gray-800 items-center justify-center pl-3 rounded-l-lg border-y border-l border-[#E2E8F0] dark:border-gray-700">
                        <span className="material-symbols-outlined text-lg">search</span>
                      </div>
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1A202C] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#E2E8F0] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:border-primary/50 h-full placeholder:text-[#718096] dark:placeholder:text-gray-500 px-3 border-l-0 text-sm font-normal leading-normal"
                        placeholder="Pesquisar por ID, cliente..."
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="form-select w-full h-10 rounded-lg text-sm text-[#1A202C] dark:text-white bg-background-light dark:bg-gray-800 border-[#E2E8F0] dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  >
                    <option value="all">Status: Todos</option>
                    <option value="PAID">Pago</option>
                    <option value="CREATED">Pendente</option>
                    <option value="CANCELED">Reembolsado</option>
                  </select>
                </div>
                <div>
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value as any)}
                    className="form-select w-full h-10 rounded-lg text-sm text-[#1A202C] dark:text-white bg-background-light dark:bg-gray-800 border-[#E2E8F0] dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  >
                    <option value="all">Método: Todos</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="pix">Pix</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setMethodFilter('all');
                  }}
                  className="flex items-center justify-center h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-[#718096] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#718096] dark:text-gray-400 uppercase bg-background-light dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 font-medium" scope="col">ID do Pedido</th>
                    <th className="px-6 py-3 font-medium" scope="col">Cliente</th>
                    <th className="px-6 py-3 font-medium" scope="col">Data</th>
                    <th className="px-6 py-3 font-medium text-right" scope="col">Valor</th>
                    <th className="px-6 py-3 font-medium" scope="col">Método</th>
                    <th className="px-6 py-3 font-medium" scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-[#718096] dark:text-gray-400">
                        Carregando transações...
                      </td>
                    </tr>
                  )}

                  {!isLoading && data?.transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-[#E2E8F0] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    >
                      <td className="px-6 py-4 font-bold text-primary">#{transaction.orderId}</td>
                      <td className="px-6 py-4 font-medium text-[#1A202C] dark:text-white">{transaction.customer}</td>
                      <td className="px-6 py-4 text-[#718096] dark:text-gray-400">{formatDate(transaction.date)}</td>
                      <td className="px-6 py-4 font-medium text-right text-[#1A202C] dark:text-white">
                        {formatCurrency(Number(transaction.amount))}
                      </td>
                      <td className="px-6 py-4">{getPaymentMethod(transaction.method)}</td>
                      <td className="px-6 py-4">{getStatusBadge(transaction.status)}</td>
                    </tr>
                  ))}

                  {!isLoading && data?.transactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-[#718096] dark:text-gray-400">
                        Nenhuma transação encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 0 && (
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-[#718096] dark:text-gray-400">
                  Exibindo {page * pageSize + 1}-{Math.min((page + 1) * pageSize, data.transactions.length)} de {data.transactions.length}
                </span>
                <div className="inline-flex items-center -space-x-px">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex items-center justify-center px-3 h-8 text-[#718096] dark:text-gray-400 bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button className="flex items-center justify-center px-3 h-8 text-primary bg-primary/10 border border-[#E2E8F0] dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    {page + 1}
                  </button>
                  {data.totalPages > 1 && page < data.totalPages - 1 && (
                    <button
                      onClick={() => setPage(page + 1)}
                      className="flex items-center justify-center px-3 h-8 text-[#718096] dark:text-gray-400 bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {page + 2}
                    </button>
                  )}
                  {data.totalPages > 2 && page < data.totalPages - 2 && (
                    <button
                      onClick={() => setPage(page + 2)}
                      className="flex items-center justify-center px-3 h-8 text-[#718096] dark:text-gray-400 bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {page + 3}
                    </button>
                  )}
                  <button
                    onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                    disabled={page >= data.totalPages - 1}
                    className="flex items-center justify-center px-3 h-8 text-[#718096] dark:text-gray-400 bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentsPage;
