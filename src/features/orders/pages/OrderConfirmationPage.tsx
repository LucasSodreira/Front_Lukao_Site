import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Copy, ArrowRight } from 'lucide-react';
import type { GuestOrder } from '@/types/domain';

interface LocationState {
  order?: GuestOrder;
  paymentIntentId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState<GuestOrder | null>(null);

  const state = location.state as LocationState | undefined;

  useEffect(() => {
    // Get order from location state or from URL if coming directly
    if (state?.order) {
      setOrder(state.order);
    } else if (!orderId) {
      // Redirect to home if no order data
      navigate('/');
    }
  }, [state, orderId, navigate]);

  const handleCopyTrackingToken = () => {
    if (order?.trackingToken) {
      navigator.clipboard.writeText(order.trackingToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    if (order) {
      navigate(`/order-tracking/${order.id}/${order.trackingToken}`);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin">
            <CheckCircle className="w-12 h-12 text-gray-400" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando confirmação...</p>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.totalPrice, 0);
  const shipping = order.shippingCost || 0;
  const total = order.totalAmount || (subtotal + shipping);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Success Animation */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Obrigado pela sua compra. Seu pedido foi processado com sucesso.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Order Info */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Informações do Pedido
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Número do Pedido</p>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    #{order.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Pagamento Confirmado
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Data</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'Hoje'}
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Info */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Informações de Entrega
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium text-gray-900 dark:text-white">{state?.customerName}</p>
                <p>{state?.customerEmail}</p>
                <p>{state?.customerPhone}</p>
                <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  {state?.shippingAddress?.street}
                  <br />
                  {state?.shippingAddress?.city}, {state?.shippingAddress?.state}{' '}
                  {state?.shippingAddress?.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {/* Items List */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Itens do Pedido
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.product.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    R$ {item.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {/* Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Frete</span>
              <span>R$ {shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tracking Token */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3">
            Token de Rastreamento
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
            Guarde este token para rastrear seu pedido sem fazer login:
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-sm font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded border border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white break-all">
              {order.trackingToken}
            </code>
            <button
              onClick={handleCopyTrackingToken}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
              title="Copiar token"
            >
              <Copy className={`w-5 h-5 ${copied ? 'text-green-600' : 'text-blue-600'}`} />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              Token copiado para a área de transferência!
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleTrackOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Rastrear Pedido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleContinueShopping}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Continuar Comprando</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Email Notification Info */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Um e-mail de confirmação foi enviado para <span className="font-medium">{state?.customerEmail}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
