import { Link } from 'react-router-dom';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const image = product.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=Sem+Imagem';
  const priceBRL = Number(product.price || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const brandName = typeof product.brand === 'object' && product.brand && 'name' in product.brand 
    ? product.brand.name 
    : 'Marca';

  return (
    <div className="flex flex-col gap-3 group">
      <Link to={`/products/${product.id}`}>
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105 bg-gray-200 dark:bg-gray-700"
          style={{ backgroundImage: `url("${image}")` }}
          role="img"
          aria-label={product.title}
        />
      </Link>
      <div className="flex flex-col">
        <p className="text-xs font-normal text-gray-500 dark:text-gray-400">{brandName}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-base font-bold text-gray-900 dark:text-white mt-1">{priceBRL}</p>
      </div>
    </div>
  );
};

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Produtos Relacionados
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
