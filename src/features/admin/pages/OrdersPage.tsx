import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import AdminSearchBar from '@/features/admin/components/AdminSearchBar';
import { orderService } from '@/services';
import { Container } from '@/ui/Container';
import { formatCurrency, formatDate } from '@/utils';
import Badge from '@/ui/Badge';

// small helper to map order status to human label (kept local to avoid import mismatch)
const formatOrderStatus = (status: string) => {
  const map: Record<string,string> = {
    CREATED: 'Aguardando',
    PAID: 'Pago',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELED: 'Cancelado'
  };
  return map[status] || status;
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', page, pageSize],
    queryFn: () => orderService.getMyOrders({ page, size: pageSize }),
  });

  const filtered = data?.orders.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.id.toString().includes(term) ||
      o.shippingAddress?.street?.toLowerCase()?.includes(term) ||
      o.items.some(i => i.productTitle.toLowerCase().includes(term))
    );
  }) ?? [];

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Container>
          <Header />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black">Pedidos</h1>
              <p className="text-sm text-gray-500">Visualize e gerencie todos os pedidos</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg">Adicionar Novo Pedido</button>
          </div>

          {data && data.totalPages > 1 && (
            <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6 pt-4">
              <div className="flex w-0 flex-1">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded bg-white border"
                >Anterior</button>
              </div>
              <div className="hidden md:flex gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`px-4 py-2 rounded ${page === i ? 'bg-primary text-white' : 'bg-white border'}`}
                  >{i + 1}</button>
                ))}
              </div>
              <div className="flex w-0 flex-1 justify-end">
                <button
                  onClick={() => setPage(p => Math.min((data.totalPages - 1), p + 1))}
                  disabled={page >= data.totalPages - 1}
                  className="px-4 py-2 rounded bg-white border"
                >Próximo</button>
              </div>
            </nav>
          )}

          <AdminSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por ID do pedido ou produto..."
            onFilter={() => console.log('TODO: Implementar filtros')}
            onExport={() => console.log('TODO: Implementar exportação')}
          />

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">ID Pedido</th>
                    <th className="px-6 py-3 text-left">Cliente</th>
                    <th className="px-6 py-3 text-left">Data</th>
                    <th className="px-6 py-3 text-left">Valor Total</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading && (
                    <tr>
                      <td colSpan={6} className="p-6">Carregando...</td>
                    </tr>
                  )}

                  {!isLoading && filtered.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">#{order.id}</td>
                      <td className="px-6 py-4">{order.shippingAddress?.street || order.shippingAddress?.city || '—'}</td>
                      <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">{formatCurrency(Number(order.totalAmount || 0))}</td>
                      <td className="px-6 py-4"> <Badge variant="success">{formatOrderStatus(order.status)}</Badge></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/admin/orders/${order.id}`)} className="p-2 rounded-full"> <span className="material-symbols-outlined">visibility</span></button>
                          <button className="p-2 rounded-full"> <span className="material-symbols-outlined">edit</span></button>
                          <button
                            className="p-2 rounded-full"
                            onClick={async () => {
                              if (!window.confirm('Deseja cancelar esse pedido?')) return;
                              try {
                                await orderService.cancelOrder(order.id);
                                // refetch by navigating same page (very simple)
                                window.location.reload();
                              } catch (err) {
                                console.error(err);
                                alert('Falha ao cancelar o pedido.');
                              }
                            }}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!isLoading && !filtered.length && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">Nenhum pedido encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default OrdersPage;