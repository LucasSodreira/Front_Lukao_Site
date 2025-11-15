import React from 'react';
import ThemeToggle from '@/shared/components/ThemeToggle';

export interface HeaderProps {
  title?: string;
  description?: string;
  showDateFilter?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Dashboard Geral',
  description = 'Visão geral de desempenho do seu e-commerce.',
  showDateFilter = true,
  showNotifications = true,
  showSearch = false,
  searchValue = '',
  onSearchChange,
}) => {
  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {showDateFilter && (
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">calendar_today</span>
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Últimos 30 dias</span>
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">expand_more</span>
          </button>
        )}

        {showNotifications && (
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative">
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        )}

        {showSearch && (
          <label className="flex flex-col min-w-40 !h-10 w-full max-w-sm">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary">
              <div className="text-slate-500 dark:text-slate-400 flex items-center justify-center pl-3">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
              </div>
              <input
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 px-2 text-base font-normal leading-normal"
                placeholder="Buscar cliente por nome ou e-mail..."
              />
            </div>
          </label>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
