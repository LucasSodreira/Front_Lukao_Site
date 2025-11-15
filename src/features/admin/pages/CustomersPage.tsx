import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/features/admin/components/Sidebar';
import { adminCustomerService } from '@/services';
import { formatCurrency, formatDate } from '@/utils';

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['adminCustomers', page, pageSize, searchTerm],
    queryFn: () => adminCustomerService.listCustomers(page, pageSize, searchTerm),
  });

  // Cálculo de estatísticas básicas
  const stats = {
    totalCustomers: data?.totalCount || 0,
    newCustomers: data?.customers.filter(c => {
      if (!c.lastOrderAt) return false;
      const orderDate = new Date(c.lastOrderAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }).length || 0,
    avgSpent: data?.customers.length 
      ? data.customers.reduce((sum, c) => sum + Number(c.totalSpent), 0) / data.customers.length 
      : 0
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Page Heading */}
          <div>
            <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
              Gerenciamento de Clientes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
              <p className="text-base font-medium leading-normal text-slate-600 dark:text-slate-300">Total de Clientes</p>
              <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">
                {stats.totalCustomers.toLocaleString('pt-BR')}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">Clientes registrados</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
              <p className="text-base font-medium leading-normal text-slate-600 dark:text-slate-300">Novos Clientes (30 dias)</p>
              <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">
                {stats.newCustomers}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">Compraram recentemente</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
              <p className="text-base font-medium leading-normal text-slate-600 dark:text-slate-300">Gasto Médio por Cliente</p>
              <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">
                {formatCurrency(stats.avgSpent)}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal">Média de gastos</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-2">
                <label className="flex flex-col min-w-40 !h-10 w-full max-w-sm">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center justify-center pl-3">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                    </div>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 px-2 text-base font-normal leading-normal"
                      placeholder="Buscar cliente por nome ou e-mail..."
                    />
                  </div>
                </label>
                <button className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined">tune</span>
                  <span className="sr-only">Filtros Avançados</span>
                </button>
                <button className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined">download</span>
                  <span className="sr-only">Exportar Dados</span>
                </button>
              </div>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}>add</span>
                <span className="truncate">Adicionar Novo Cliente</span>
              </button>
            </div>

            {/* Customer Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-light dark:bg-background-dark text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium" scope="col">
                      <input 
                        className="form-checkbox rounded border-slate-400 dark:border-slate-600 bg-transparent dark:focus:ring-offset-background-dark focus:ring-primary text-primary" 
                        type="checkbox"
                      />
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">Nome</th>
                    <th className="px-6 py-4 font-medium" scope="col">E-mail</th>
                    <th className="px-6 py-4 font-medium" scope="col">Pedidos</th>
                    <th className="px-6 py-4 font-medium" scope="col">Total Gasto</th>
                    <th className="px-6 py-4 font-medium" scope="col">Último Pedido</th>
                    <th className="px-6 py-4 font-medium" scope="col">Status</th>
                    <th className="px-6 py-4 font-medium text-center" scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {isLoading && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                        Carregando clientes...
                      </td>
                    </tr>
                  )}

                  {!isLoading && data?.customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <input 
                          className="form-checkbox rounded border-slate-400 dark:border-slate-600 bg-transparent dark:focus:ring-offset-background-dark focus:ring-primary text-primary" 
                          type="checkbox"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-light dark:text-text-dark">{customer.name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.email}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.ordersCount}</td>
                      <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">
                        {formatCurrency(Number(customer.totalSpent))}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : 'Nenhum'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          customer.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!isLoading && data?.customers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                        Nenhum cliente encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 0 && (
              <div className="flex flex-wrap items-center justify-between p-4 gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Mostrando {page * pageSize + 1}-{Math.min((page + 1) * pageSize, data.totalCount)} de {data.totalCount} clientes
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="h-8 px-3 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  {/* Páginas visíveis */}
                  {Array.from({ length: Math.min(3, data.totalPages) }, (_, i) => {
                    const pageNum = i;
                    if (pageNum < data.totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`h-8 w-8 text-sm font-medium rounded-lg border transition-colors ${
                            page === pageNum
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {data.totalPages > 3 && (
                    <>
                      <span className="text-slate-500">...</span>
                      <button
                        onClick={() => setPage(data.totalPages - 1)}
                        className={`h-8 w-8 text-sm font-medium rounded-lg border transition-colors ${
                          page === data.totalPages - 1
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {data.totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                    disabled={page >= data.totalPages - 1}
                    className="h-8 px-3 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CustomersPage;
