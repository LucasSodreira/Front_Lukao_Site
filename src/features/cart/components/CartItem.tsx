import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const image = item.product.images?.[0]?.url || 'https://via.placeholder.com/120x120?text=Sem+Imagem';
  const priceBRL = Number(item.product.price || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const totalBRL = Number(item.totalPrice || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Produto no carrinho pode não ter todas as informações
  // Vamos usar valores padrão quando não disponível
  const brandName = 'Marca';
  const colorName = '';
  const sizeName = '';

  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Imagem do Produto */}
      <Link to={`/products/${item.product.id}`}>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-full sm:w-[120px] sm:h-[120px] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundImage: `url("${image}")` }}
          role="img"
          aria-label={item.product.title}
        />
      </Link>

      {/* Informações do Produto */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <Link to={`/products/${item.product.id}`}>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white pr-4 hover:text-primary transition-colors">
                {item.product.title}
              </h2>
            </Link>
            <p className="text-lg font-semibold text-gray-800 dark:text-white whitespace-nowrap">
              {totalBRL}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{brandName}</p>
          {(colorName || sizeName) && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {colorName && `Cor: ${colorName}`}
              {colorName && sizeName && ' | '}
              {sizeName && `Tamanho: ${sizeName}`}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Preço unitário: {priceBRL}
          </p>
        </div>

        {/* Controles de Quantidade e Remover */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-full py-1 px-2">
            <button
              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="text-xl font-medium flex h-7 w-7 items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Diminuir quantidade"
            >
              -
            </button>
            <span className="text-base font-medium w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= 999}
              className="text-xl font-medium flex h-7 w-7 items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
