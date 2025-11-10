import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCreationForm from '../components/ProductCreationForm';
import type { Product } from '../../../types/domain/product';

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSuccess = (product: Product) => {
    setSuccessMessage(`✓ Produto "${product.title}" criado com sucesso!`);
    setErrorMessage('');

    // Redirecionar para o produto criado após 2 segundos
    setTimeout(() => {
      navigate(`/products/${product.id}`);
    }, 2000);
  };

  const handleError = (error: string) => {
    setErrorMessage(`✗ ${error}`);
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Criar Novo Produto
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Adicione um novo produto com variações de tamanho, cor e quantidade
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-700 dark:text-green-300 font-semibold text-center animate-pulse">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 font-semibold text-center">
            {errorMessage}
          </div>
        )}

        <ProductCreationForm
          onSuccess={handleSuccess}
          onError={handleError}
        />

        <div className="mt-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">💡 Dicas:</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Adicione múltiplas variações de um produto (ex: P, M, G em diferentes cores)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Cada combinação de tamanho + cor é uma variação diferente</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Defina a quantidade disponível para cada variação</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Um SKU único será gerado automaticamente para cada variação</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Você poderá editar o produto e suas variações depois</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
