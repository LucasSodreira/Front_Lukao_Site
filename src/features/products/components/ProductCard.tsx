import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import { Button } from '@/ui/Button';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url || '/placeholder.jpg';
  const isNumericId = product.id && /^\d+$/.test(String(product.id));
  const detailsHref = isNumericId ? `/products/${product.id}` : undefined;
  const priceBRL = Number(product.price || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-900/30">
        {detailsHref ? (
          <Link to={detailsHref} className="absolute inset-0">
            <img
              src={image}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        ) : (
          <img
            src={image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <CardBody className="flex flex-1 flex-col">
        <CardTitle className="line-clamp-2 min-h-[3rem]">{product.title}</CardTitle>
        {product.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{priceBRL}</span>
          {detailsHref ? (
            <Link to={detailsHref}>
              <Button variant="secondary">Ver detalhes</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              Indisponível
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
