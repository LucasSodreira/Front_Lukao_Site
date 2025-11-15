import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services';
import { Container } from '@/ui/Container';
import { Card, CardBody } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { OrderCard } from '../components';

const OrdersListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['myOrders', currentPage, pageSize],
    queryFn: () => orderService.getMyOrders({ page: currentPage, size: pageSize }),
  });

  const handleViewDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

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

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Carregando pedidos...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Erro ao carregar pedidos
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
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
        <h1 className="text-gray-800 dark:text-white text-3xl md:text-4xl font-black tracking-tighter">
          Compras
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-8">
        <label className="relative w-full sm:w-auto sm:flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <Input
            type="text"
            placeholder="Buscar por número do pedido ou produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </label>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select className="form-select rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-4 py-2">
            <option value="">Todos os Status</option>
            <option value="CREATED">Aguardando Pagamento</option>
            <option value="PAID">Pago</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELED">Cancelado</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {searchTerm ? 'Nenhum pedido encontrado com esse termo' : 'Nenhum pedido encontrado'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Tente buscar por outro termo' : 'Você ainda não fez nenhum pedido.'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => navigate('/products')}
                  className="mt-4"
                >
                  Ir para loja
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <nav className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 sm:px-0 mt-8 pt-6">
          <div className="flex w-0 flex-1">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              variant="secondary"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </Button>
          </div>
          
          <div className="hidden md:flex gap-2">
            {Array.from({ length: data.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <div className="flex w-0 flex-1 justify-end">
            <Button
              onClick={handleNextPage}
              disabled={currentPage >= data.totalPages - 1}
              variant="secondary"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </nav>
      )}
    </Container>
  );
};

export default OrdersListPage;
