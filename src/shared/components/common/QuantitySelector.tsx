interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-normal text-gray-800 dark:text-white mb-2">
        Quantidade
      </label>
      <div className="flex items-stretch h-10 rounded-lg border border-gray-200 dark:border-gray-700 w-32">
        <button
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="flex items-center justify-center w-10 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
          aria-label="Diminuir quantidade"
        >
          <span className="material-symbols-outlined text-base">remove</span>
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          className="flex-1 text-center border-none bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="flex items-center justify-center w-10 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
          aria-label="Aumentar quantidade"
        >
          <span className="material-symbols-outlined text-base">add</span>
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
