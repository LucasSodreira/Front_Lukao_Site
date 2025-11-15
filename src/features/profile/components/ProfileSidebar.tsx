import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    { label: 'Meus Dados', icon: 'person', path: '/profile/data' },
    { label: 'Meus Pedidos', icon: 'receipt_long', path: '/profile/orders' },
    { label: 'Segurança', icon: 'shield', path: '/profile/security' },
    { label: 'Endereços', icon: 'location_on', path: '/profile/addresses' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <nav className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-4 mb-1">
          Minha Conta
        </h3>
        
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
              isActive(item.path)
                ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm font-medium">Sair</span>
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
