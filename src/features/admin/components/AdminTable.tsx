import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string | number;
}

function AdminTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  keyExtractor,
}: AdminTableProps<T>) {
  const renderCell = (row: T, col: Column<T>) => {
    if (typeof col.accessor === 'function') {
      return col.accessor(row);
    }
    const value = row[col.accessor];
    return value !== null && value !== undefined ? String(value) : '—';
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors' : ''}`}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 ${col.className || ''}`}>
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;
