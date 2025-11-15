import React from 'react';

export interface AdminSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  onFilter?: () => void;
  onExport?: () => void;
  showFilterButton?: boolean;
  showExportButton?: boolean;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Buscar...',
  onFilter,
  onExport,
  showFilterButton = true,
  showExportButton = true,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <label className="relative w-full sm:w-auto sm:flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="form-input pl-10 w-full rounded-lg h-12 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
        />
      </label>

      <div className="flex items-center gap-2">
        {showFilterButton && (
          <button
            onClick={onFilter}
            className="flex items-center justify-center gap-2 rounded-lg px-4 h-12 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined">filter_list</span>
            <span className="text-sm font-medium">Filtros</span>
          </button>
        )}

        {showExportButton && (
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 rounded-lg px-4 h-12 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined">download</span>
            <span className="text-sm font-medium">Exportar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSearchBar;
