import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: catalogService.getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => catalogService.getProductById(id),
    enabled: !!id,
  });
};
