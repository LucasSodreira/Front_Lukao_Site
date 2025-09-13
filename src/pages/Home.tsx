import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../ui/Button';
import { Card, CardBody, CardTitle } from '../ui/Card';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Moda & Acessórios com Estilo</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Descubra roupas e acessórios modernos, selecionados para você</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/products">
            <Button>Ver Produtos</Button>
          </Link>
          {!isAuthenticated && (
            <Link to="/register">
              <Button variant="secondary">Cadastrar-se</Button>
            </Link>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardBody>
            <CardTitle>🧥 Lançamentos de Moda</CardTitle>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Novidades semanais em camisas, calças, vestidos e mais</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle>💎 Acessórios Premium</CardTitle>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Relógios, óculos e joias para completar seu visual</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle>🚚 Entrega Rápida</CardTitle>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Receba em casa com todo cuidado e agilidade</p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
};

export default Home;
