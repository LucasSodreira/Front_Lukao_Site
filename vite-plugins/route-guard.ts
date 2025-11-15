import type { Plugin, ViteDevServer } from 'vite';

interface RouteGuardOptions {
  /**
   * Cookie name para verificar autenticação (opcional, não usado em dev)
   */
  authCookieName?: string;
  /**
   * Rotas protegidas que requerem autenticação admin
   */
  adminRoutes?: string[];
}

/**
 * Plugin Vite para proteção de rotas em desenvolvimento
 * 
 * Este plugin adiciona middleware ao servidor dev para:
 * - Adicionar headers de segurança para rotas admin
 * - Log de acesso a rotas protegidas durante desenvolvimento
 * 
 * Nota: A proteção real de autenticação/role é feita pelo AdminRoute component
 */
export function routeGuardPlugin(options: RouteGuardOptions = {}): Plugin {
  const {
    adminRoutes = ['/admin/dashboard', '/admin/create-account', '/admin/customers', '/admin/orders'],
  } = options;

  return {
    name: 'vite-route-guard',
    
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        
        // Ignora assets estáticos e internos do Vite
        if (
          url.includes('/@') ||           // Vite internal
          url.includes('/node_modules/') ||
          url.includes('/src/') ||         // Source files
          url.includes('?') ||             // Query params (HMR, etc)
          /\.(js|ts|tsx|jsx|css|json|svg|png|jpg|jpeg|gif|woff2?|ttf|eot)$/.test(url)
        ) {
          return next();
        }

        // Verifica se é rota admin
        const isAdminRoute = adminRoutes.some(route => url.startsWith(route));
        
        if (isAdminRoute) {
          // Em desenvolvimento, apenas adiciona headers de segurança
          // A proteção real de autenticação/role é feita pelo AdminRoute component
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          

        }

        next();
      });
    }
  };
}
