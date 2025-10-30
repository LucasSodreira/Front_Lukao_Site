import { memo } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

interface ProductRatingBarProps {
  average?: number;
  count?: number;
  distribution?: Record<number, number>;
}

const ProductRatingBar = memo(({ average = 0, count = 0, distribution = {} }: ProductRatingBarProps) => {
  const getPercentage = (rating: number): number => {
    const count_for_rating = distribution[rating] || 0;
    return count > 0 ? Math.round((count_for_rating / count) * 100) : 0;
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-baseline gap-3">
        <div className="flex items-center">
          <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">{average.toFixed(1)}</span>
          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">de 5</span>
        </div>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${average > i ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            />
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Baseado em {count} {count === 1 ? 'avaliação' : 'avaliações'}
      </div>

      {count > 0 && (
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                {rating} <span className="text-xs">★</span>
              </span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${getPercentage(rating)}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {getPercentage(rating)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ProductRatingBar.displayName = 'ProductRatingBar';

export default ProductRatingBar;
