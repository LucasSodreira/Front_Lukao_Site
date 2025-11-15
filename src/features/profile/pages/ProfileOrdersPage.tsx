import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services';
import { ProfileLayout } from '@/features/profile/components';
import { formatDateLong, formatCurrency } from '@/utils';
import type { OrderStatus } from '@/types/domain/order';

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  CREATED: { label: 'Aguardando Pagamento', color: 'text-yellow-600 dark:text-yellow-400' },
  PAID: { label: 'Pago', color: 'text-blue-600 dark:text-blue-400' },
  SHIPPED: { label: 'Em trânsito', color: 'text-yellow-600 dark:text-yellow-400' },
  DELIVERED: { label: 'Entregue', color: 'text-green-600 dark:text-green-400' },
  CANCELED: { label: 'Cancelado', color: 'text-red-600 dark:text-red-400' }
};

const ProfileOrdersPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const pageSize = 10;

  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['myOrders', currentPage, pageSize],
    queryFn: () => orderService.getMyOrders({ page: currentPage, size: pageSize }),
  });

  const toNumber = (value: string | number) => (
    typeof value === 'string' ? parseFloat(value) : value
  );

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const filteredOrders = data?.orders.filter(order => {
    if (statusFilter && order.status !== statusFilter) return false;
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.items.some(item => 
        item.productTitle.toLowerCase().includes(searchLower)
      )
    );
  }) || [];

  // Agrupar pedidos por mês
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date = new Date(order.createdAt);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(order);
    return acc;
  }, {} as Record<string, typeof filteredOrders>);

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Carregando pedidos...</div>
        </div>
      </ProfileLayout>
    );
  }

  if (error) {
    return (
      <ProfileLayout>
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Erro ao carregar pedidos
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
        >
          Minha Conta
        </button>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
        <span className="text-gray-800 dark:text-white text-sm font-medium">Compras</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-gray-800 dark:text-white text-3xl md:text-4xl font-black tracking-tighter">
          Compras
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-8">
        <label className="relative w-full sm:w-auto sm:flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-symbols-outlined text-xl text-gray-500">search</span>
          </div>
          <input
            type="text"
            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-blue-600/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-600/50 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-10 pr-4 text-base font-normal leading-normal"
            placeholder="Busque por compra, marca e mais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 px-4 w-1/2 sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200 text-base font-medium"
          >
            <option value="">Todos os Status</option>
            <option value="CREATED">Aguardando Pagamento</option>
            <option value="PAID">Pago</option>
            <option value="SHIPPED">Em trânsito</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELED">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {searchTerm || statusFilter ? 'Nenhum pedido encontrado' : 'Nenhum pedido encontrado'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter ? 'Tente ajustar os filtros' : 'Você ainda não fez nenhum pedido.'}
          </p>
          {!searchTerm && !statusFilter && (
            <button 
              onClick={() => navigate('/products')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ir para loja
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedOrders).map(([monthYear, orders]) => (
            <div key={monthYear}>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 capitalize">
                {monthYear}
              </h3>
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusInfo = statusConfig[order.status];
                  const firstItem = order.items[0];
                  
                  return (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className={`text-sm font-bold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            Pedido #{order.id} - {formatDateLong(order.createdAt)}
                          </p>
                          <p className="text-gray-800 dark:text-white font-semibold">
                            {firstItem.productTitle}
                            {order.items.length > 1 && ` +${order.items.length - 1} ${order.items.length === 2 ? 'item' : 'itens'}`}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Total: {formatCurrency(toNumber(order.totalAmount))}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white px-6 text-base font-bold w-full hover:bg-blue-700 transition-colors"
                        >
                          Ver compra
                        </button>
                        {order.status === 'DELIVERED' && (
                          <button
                            className="flex h-12 items-center justify-center gap-x-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-6 text-base font-bold text-blue-600 dark:text-blue-400 w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            Comprar novamente
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white px-6 text-base font-bold w-full hover:bg-blue-700 transition-colors"
                          >
                            Acompanhar entrega
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <nav className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 sm:px-0 mt-8 pt-6">
          <div className="flex w-0 flex-1">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-base font-bold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
              Anterior
            </button>
          </div>
          
          <div className="hidden md:flex">
            {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
              const pageNum = i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                    currentPage === pageNum
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            {data.totalPages > 5 && (
              <>
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  ...
                </span>
                <button
                  onClick={() => setCurrentPage(data.totalPages - 1)}
                  className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {data.totalPages}
                </button>
              </>
            )}
          </div>
          
          <div className="flex w-0 flex-1 justify-end">
            <button
              onClick={handleNextPage}
              disabled={currentPage >= data.totalPages - 1}
              className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-base font-bold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <span className="material-symbols-outlined text-base ml-2">arrow_forward</span>
            </button>
          </div>
        </nav>
      )}
    </ProfileLayout>
  );
};

export default ProfileOrdersPage;
