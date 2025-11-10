export interface SortOption {
  label: string;
  value: string;
}

interface SortButtonsProps {
  options: SortOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export const SortButtons: React.FC<SortButtonsProps> = ({ options, selected, onSelect }) => {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors text-sm font-medium ${
            selected === option.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortButtons;
