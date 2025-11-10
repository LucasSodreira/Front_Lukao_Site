import React, { useState, useMemo } from 'react';
import type { Product, ProductVariation } from '../../../types/domain/product';

interface VariationSelectorProps {
  product: Product;
  onSelect?: (variation: ProductVariation) => void;
  disabled?: boolean;
}

export const VariationSelector: React.FC<VariationSelectorProps> = ({
  product,
  onSelect,
  disabled = false,
}) => {
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);

  const variations = useMemo(() => {
    return product.variations || [];
  }, [product.variations]);

  const handleVariationSelect = (variation: ProductVariation) => {
    setSelectedVariation(variation.id);
    onSelect?.(variation);
  };

  if (!variations || variations.length === 0) {
    return null;
  }

  const selected = variations.find(v => v.id === selectedVariation);

  return (
    <div className="my-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Variações Disponíveis</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {variations.map((variation) => (
          <button
            key={variation.id}
            onClick={() => handleVariationSelect(variation)}
            disabled={disabled || variation.quantity === 0}
            className={`p-4 border-2 rounded-lg transition-all text-left ${
              selectedVariation === variation.id
                ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${
              variation.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
            } dark:bg-gray-900 bg-white`}
            title={variation.quantity === 0 ? 'Sem estoque' : 'Selecione esta variação'}
          >
            <div className="space-y-3">
              <div className="space-y-2">
                <span className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm font-semibold text-gray-900 dark:text-gray-200">
                  {variation.size?.name}
                  {variation.size?.code && ` (${variation.size.code})`}
                </span>
                
                <div className="flex items-center gap-2">
                  {variation.color?.hexCode && (
                    <div
                      className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                      style={{ backgroundColor: variation.color.hexCode }}
                      title={variation.color.name}
                    />
                  )}
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{variation.color?.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                {variation.quantity > 0 ? (
                  <>
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold">
                      {variation.quantity} em estoque
                    </span>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">{variation.sku}</p>
                  </>
                ) : (
                  <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs font-semibold">
                    Sem estoque
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 px-4 py-3 rounded mt-4">
          <p className="text-gray-900 dark:text-gray-100">
            <strong>Selecionado:</strong> {selected.size?.name} em {selected.color?.name}
            {selected.quantity > 0 && ` (${selected.quantity} disponíveis)`}
          </p>
        </div>
      )}
    </div>
  );
};

export default VariationSelector;
