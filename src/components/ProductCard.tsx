import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { Card, CardBody, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url || '/placeholder.jpg';
  const isNumericId = product.id && /^\d+$/.test(String(product.id));
  const detailsHref = isNumericId ? `/products/${product.id}` : undefined;
  return (
    <Card className="overflow-hidden">
      {detailsHref ? (
        <Link to={detailsHref}>
        <img
          src={image}
          alt={product.title}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
        </Link>
      ) : (
        <img
          src={image}
          alt={product.title}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      )}
      <CardBody>
        <CardTitle className="line-clamp-1">{product.title}</CardTitle>
        {product.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">R$ {product.price.toFixed(2)}</span>
          {detailsHref ? (
            <Link to={detailsHref}>
              <Button variant="secondary">Ver detalhes</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>Indisponível</Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
