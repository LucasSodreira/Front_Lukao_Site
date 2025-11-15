import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import type { Product } from '@/types/domain/product';

const TopSelling: React.FC = () => {
  const { data = [], isLoading } = useQuery<Product[]>(
    { queryKey: ['top-selling-products'], queryFn: async () => (await catalogService.getProducts()) as Product[] },
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
      <h3 className="text-text-light-primary dark:text-text-dark-primary text-lg font-semibold leading-normal">Produtos Mais Vendidos</h3>

      {isLoading ? (
        <p className="text-text-light-secondary">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((product) => (
            <div key={product.id} className="flex items-center gap-4">
              <img className="w-14 h-14 rounded-lg object-cover" alt={product.title} src={(product.images && product.images[0]?.url) || 'https://via.placeholder.com/56'} />
              <div className="flex-1">
                <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-semibold">{product.title}</p>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs">{product.inventory ?? 0} vendidos</p>
              </div>
              <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-bold">R$ {product.price?.toLocaleString?.() ?? product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopSelling;
