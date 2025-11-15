import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=Sem+Imagem';
  const isNumericId = product.id && /^\d+$/.test(String(product.id));
  const detailsHref = isNumericId ? `/products/${product.id}` : undefined;
  const priceBRL = Number(product.price || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
  
  const brandName = typeof product.brand === 'object' && product.brand && 'name' in product.brand 
    ? product.brand.name 
    : 'Marca';

  return (
    <div className="group flex flex-col gap-3 relative">
      <Link to={detailsHref || '#'}>
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url("${image}")` }}
            role="img"
            aria-label={product.title}
          />
          <button
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-gray-800 dark:text-white hover:text-primary hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Adicionar aos favoritos"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implementar lógica de favoritos
            }}
          >
            <span className="material-symbols-outlined text-lg">favorite</span>
          </button>
        </div>
      </Link>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-normal text-gray-500 dark:text-gray-400 truncate">{brandName}</p>
        <Link to={detailsHref || '#'} className="hover:underline">
          <h3 className="text-base font-bold leading-normal text-gray-900 dark:text-white line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-800 dark:text-white text-base font-semibold leading-normal mt-1">
          {priceBRL}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
