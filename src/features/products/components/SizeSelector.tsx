import { memo } from 'react';
import type { Size } from '@/types';

interface SizeSelectorProps {
  sizes: Size[];
  selected?: string;
  onSelect: (sizeId: string) => void;
  disabled?: boolean;
}

const SizeSelector = memo(({ sizes, selected, onSelect, disabled = false }: SizeSelectorProps) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div>
      <label htmlFor="size-select" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Tamanho
      </label>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelect(size.id)}
            disabled={disabled}
            className={`
              relative py-3 px-2 text-sm font-medium rounded-lg border-2 transition-all
              ${
                selected === size.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {size.code || size.name}
          </button>
        ))}
      </div>
    </div>
  );
});

SizeSelector.displayName = 'SizeSelector';

export default SizeSelector;
