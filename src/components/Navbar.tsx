import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <Container className="flex h-16 items-center justify-between">
  <Link to="/" className="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <span className="text-xl">Moda & Acessórios</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/products" className="hidden sm:inline-flex text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Produtos
          </Link>
          <Link to="/cart" className="hidden sm:inline-flex text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Carrinho
          </Link>
          <button
            aria-label="Alternar tema"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
          >
            {theme === 'dark' ? (
              // Sun icon
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
              </svg>
            ) : (
              // Moon icon
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">Olá, {user?.name?.split(' ')[0]}</span>
              <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Perfil
              </Link>
              <Button variant="secondary" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Entrar
              </Link>
              <Link to="/register">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
