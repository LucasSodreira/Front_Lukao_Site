import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/orders', icon: 'shopping_cart', label: 'Pedidos' },
    { path: '/admin/products', icon: 'package_2', label: 'Produtos' },
    { path: '/admin/customers', icon: 'group', label: 'Clientes' },
    { path: '/admin/payments', icon: 'payments', label: 'Pagamentos' },
    { path: '/admin/reviews', icon: 'star', label: 'Avaliações' },
    { path: '/admin/reports', icon: 'analytics', label: 'Relatórios' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  return (
    <aside className="flex w-64 flex-col bg-white dark:bg-gray-800 p-6 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/20 text-primary rounded-lg p-2">
          <span className="material-symbols-outlined text-xl">shield</span>
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-lg">Admin</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <p className="text-sm font-medium leading-normal">{item.label}</p>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-2 mt-4">
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="truncate">Adicionar Produto</span>
        </Link>

        <div className="border-t border-slate-200 dark:border-slate-800 my-2" />

        <NavLink
          to="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
          <p className="text-sm font-medium leading-normal">Configurações</p>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <p className="text-sm font-medium leading-normal">Sair</p>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
