import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Container } from '@/ui/Container';

const ProductListPage = () => {
  const { data: products, isLoading, error } = useProducts();

  return (
    <Container>
      <div className="py-12 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Todos os Produtos</h1>
        
        {isLoading && <div className="text-center">Carregando produtos...</div>}
        {error && <div className="text-center text-red-500">Ocorreu um erro ao carregar os produtos.</div>}

        {products && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductListPage;
