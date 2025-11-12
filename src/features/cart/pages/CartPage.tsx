import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartItem, OrderSummary, ShippingCalculator } from '../components';
import { logger, ErrorHandler, InputValidator } from '@/utils';
import { useCartRest } from '../hooks/useCartRest';

const DEFAULT_SHIPPING = 15.0;

export const CartPage = () => {
  const navigate = useNavigate();
  const [shippingCost, setShippingCost] = useState(DEFAULT_SHIPPING);
  const { cart, loading, error, updateQuantity, removeItem } = useCartRest();

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    logger.error('Erro ao carregar carrinho', { error });
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold">
            {ErrorHandler.getUserFriendlyMessage(new Error(error))}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800">
            <span className="material-symbols-outlined text-6xl text-gray-400">
              shopping_cart
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Adicione produtos para começar suas compras
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    // A rota /checkout já está protegida com PrivateRoute no App.tsx
    // Se o usuário não estiver logado, será redirecionado automaticamente para /login
    // Na página de checkout, o usuário escolherá/criará o endereço
    navigate('/checkout');
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (!InputValidator.validateProductId(productId)) {
      logger.error('ID de produto inválido', { productId });
      alert('Erro: ID de produto inválido');
      return;
    }

    if (!InputValidator.validateQuantity(newQuantity)) {
      alert('Quantidade inválida. Mínimo: 1, Máximo: 999');
      return;
    }
    updateQuantity(productId, newQuantity).catch(() => {
      alert('Falha ao atualizar item do carrinho');
    });
  };

  const handleRemoveItem = (productId: string) => {
    if (!InputValidator.validateProductId(productId)) {
      logger.error('ID de produto inválido', { productId });
      return;
    }

    removeItem(productId).catch(() => {
      alert('Falha ao remover item do carrinho');
    });
  };

  const subtotal = Number(cart.total) || 0;
  const discount = 0; // Pode ser calculado com cupons
  const total = subtotal - discount + shippingCost;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8">
      {/* Cabeçalho */}
      <div className="mb-10">
        <h1 className="text-gray-800 dark:text-white text-4xl md:text-5xl font-bold">
          Carrinho de Compras
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Você tem {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'} no seu carrinho.
        </p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Lista de Itens */}
        <div className="lg:col-span-8 space-y-6">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}

          {/* Link para continuar comprando */}
          <div className="pt-4 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary dark:text-blue-400 font-semibold text-sm hover:underline"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Continuar comprando
            </Link>
          </div>
        </div>

        {/* Sidebar - Resumo e Opções */}
        <aside className="lg:col-span-4 w-full lg:sticky lg:top-28 space-y-6">
          {/* Resumo do Pedido */}
          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            shipping={shippingCost}
            total={total}
            onCheckout={handleCheckout}
          />

          {/* Calculadora de Frete e Cupom */}
          <ShippingCalculator
            onShippingChange={(option: { id: string; name: string; description: string; price: number }) => 
              setShippingCost(option.price)
            }
          />
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
