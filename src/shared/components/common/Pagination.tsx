interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostra todas as páginas se houver poucas
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostra primeiras páginas, reticências e última
      for (let i = 0; i < Math.min(maxVisible - 1, totalPages); i++) {
        pages.push(i);
      }
      if (totalPages > maxVisible) {
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${index}`} className="text-gray-500 dark:text-gray-400">
            ...
          </span>
        );
      }

      const pageNum = page as number;
      return (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors ${
            currentPage === pageNum
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {pageNum + 1}
        </button>
      );
    });
  };

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Próxima página"
        >
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
