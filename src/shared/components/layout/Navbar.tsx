import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth, useTheme } from '@/shared/hooks';
import { useCartRest } from '@/features/cart/hooks/useCartRest';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCartRest();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between whitespace-nowrap">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-primary transition-colors">
              <div className="size-7 text-primary dark:text-white">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">THREADS</h1>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/products" className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Novidades
              </Link>
              <Link to="/products" className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Roupas
              </Link>
              <Link to="/products" className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Acessórios
              </Link>
              <a href="#" className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Marcas
              </a>
              <a href="#" className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Promoções
              </a>
            </nav>
          </div>

          {/* Right Section: Search, Buttons, Theme, Profile */}
          <div className="flex flex-1 justify-end items-center gap-4">
            {/* Search Bar */}
            <div className="hidden sm:flex relative items-center">
              <span className="material-symbols-outlined absolute left-3 text-gray-500 dark:text-gray-400 text-base">search</span>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-gray-800 h-10 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-10 pr-4 text-sm font-normal leading-normal"
                placeholder="Buscar"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Favorites Button */}
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 min-w-0 px-2.5 transition-colors" title="Favoritos">
                <span className="material-symbols-outlined text-base">favorite</span>
              </button>

              {/* Cart Button */}
              <Link to="/cart" className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 min-w-0 px-2.5 transition-colors" title="Carrinho">
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                {cart && cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[10px] leading-5 text-center font-bold">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 min-w-0 px-2.5 transition-colors"
              title={theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
              aria-label="Alternar tema"
            >
              <span className="material-symbols-outlined text-base">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Profile or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white min-w-0 px-3 transition-colors hover:bg-primary/90"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  title="Menu do usuário"
                >
                  <span className="material-symbols-outlined text-base">account_circle</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      {/* Informações do usuário */}
                      <div className="px-3 py-2 mb-1 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        <span className={`inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          user?.role === 'ADMIN'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {user?.role === 'ADMIN' ? 'Administrador' : 'Comprador'}
                        </span>
                      </div>

                      {/* Menu items */}
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">person</span>
                        Meu Perfil
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">shopping_bag</span>
                        Meus Pedidos
                      </Link>

                      <Link
                        to="/cart"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">shopping_cart</span>
                        Carrinho
                      </Link>

                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">store</span>
                          Painel Administrativo
                        </Link>
                      )}

                      <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 min-w-0 px-3 transition-colors text-sm font-medium">
                  Entrar
                </Link>
                <Link to="/register" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white hover:bg-primary/90 min-w-0 px-3 transition-colors text-sm font-medium">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
