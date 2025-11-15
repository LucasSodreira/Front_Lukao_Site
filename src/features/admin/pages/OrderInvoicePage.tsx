import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import { orderService } from '@/services';
import { Container } from '@/ui/Container';
import { formatCurrency, formatDate } from '@/utils';

const OrderInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useQuery({
    queryKey: ['invoice', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 p-8">
          <Container>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 p-8">
          <Container>
            <div className="text-center py-12 text-gray-500">Fatura não encontrada</div>
          </Container>
        </main>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    // TODO: Integrar com backend para enviar fatura por email
    alert('Enviar fatura por email - implementar backend');
  };

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Container>
          <Header />

          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6 text-sm">
            <a href="/admin" className="text-gray-500 hover:text-primary">Dashboard</a>
            <span className="text-gray-500">/</span>
            <a href="/admin/orders" className="text-gray-500 hover:text-primary">Pedidos</a>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 dark:text-white">Fatura #{order.id}</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-black mb-2">Fatura #{order.id}</h1>
              <p className="text-gray-500">Data do pedido: {formatDate(order.createdAt)}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <span className="material-symbols-outlined">print</span>
                <span>Imprimir</span>
              </button>
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <span className="material-symbols-outlined">send</span>
                <span>Enviar Fatura</span>
              </button>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-4">Cliente</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500">Nome</p>
                  <p className="font-medium">{order.shippingAddress?.street || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">cliente@exemplo.com</p>
                </div>
                <div>
                  <p className="text-gray-500">Telefone</p>
                  <p className="font-medium">(11) 98765-4321</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-4">Endereço de Entrega</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>{order.shippingAddress?.zipCode}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-4">Resumo do Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID do Pedido</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Produto</th>
                    <th className="px-6 py-4 text-right font-semibold">Quantidade</th>
                    <th className="px-6 py-4 text-right font-semibold">Valor Unitário</th>
                    <th className="px-6 py-4 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4">{item.productTitle}</td>
                      <td className="px-6 py-4 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(Number(order.totalAmount || 0) * 0.9)}</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Frete</span>
                  <span>{formatCurrency(Number(order.totalAmount || 0) * 0.1)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-primary">{formatCurrency(Number(order.totalAmount || 0))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Obrigado pela sua compra!</strong> Esta fatura foi gerada automaticamente. Para dúvidas, entre em contato conosco.
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default OrderInvoicePage;
