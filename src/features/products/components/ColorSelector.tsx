import { memo } from 'react';
import type { Color } from '@/types';

interface ColorSelectorProps {
  colors: Color[];
  selected?: string;
  onSelect: (colorId: string) => void;
  disabled?: boolean;
}

const ColorSelector = memo(({ colors, selected, onSelect, disabled = false }: ColorSelectorProps) => {
  if (!colors || colors.length === 0) return null;

  return (
    <div>
      <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Cor
      </label>
      <div className="mt-3 flex flex-wrap gap-3">
        {colors.map((color) => {
          const hexCode = color.code?.startsWith('#') ? color.code : `#${color.code}`;
          const isSelected = selected === color.id;

          return (
            <button
              key={color.id}
              onClick={() => onSelect(color.id)}
              disabled={disabled}
              title={color.name}
              className={`
                relative group flex flex-col items-center gap-1.5
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div
                className={`
                  w-12 h-12 rounded-full border-4 transition-all
                  ${isSelected ? 'border-gray-800 dark:border-gray-100 ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
                `}
                style={{ backgroundColor: hexCode }}
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate max-w-[60px]">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

ColorSelector.displayName = 'ColorSelector';

export default ColorSelector;
