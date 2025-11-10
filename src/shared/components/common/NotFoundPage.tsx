/**
 * Página de erro 404 - Não encontrado
 */

import { Link } from 'react-router-dom';
import { Button } from '@/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-500">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
          Página não encontrada
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Voltar para Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary" size="lg">
              Ver Produtos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
