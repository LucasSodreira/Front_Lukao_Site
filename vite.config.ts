import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { routeGuardPlugin } from './vite-plugins/route-guard'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// ============================================================================
// PATHS E ALIASES
// ============================================================================

const paths = {
  main: path.resolve(rootDir, 'index.html'),
  src: path.resolve(rootDir, './src'),
}

const aliases = {
  '@': paths.src,
  '@client': path.resolve(rootDir, './src/client'),
  '@admin': path.resolve(rootDir, './src/admin'),
  '@shared': path.resolve(rootDir, './src/shared'),
}

// ============================================================================
// CHUNK SPLITTING STRATEGY
// ============================================================================

const manualChunks = (id: string) => {
  // Vendors - React e dependências
  if (id.includes('node_modules/react') || 
      id.includes('node_modules/react-dom') || 
      id.includes('node_modules/react-router-dom')) {
    return 'vendor-react'
  }

  // Vendors - Bibliotecas específicas
  if (id.includes('@stripe')) return 'vendor-stripe'
  if (id.includes('@tanstack/react-query')) return 'vendor-query'
  if (id.includes('lucide-react') || id.includes('tailwindcss')) return 'vendor-ui'

  // Features - Cliente (Loja)
  if (id.includes('src/features/auth')) return 'feature-auth'
  if (id.includes('src/features/products')) return 'feature-products'
  if (id.includes('src/features/cart')) return 'feature-cart'
  if (id.includes('src/features/checkout')) return 'feature-checkout'
  if (id.includes('src/features/orders')) return 'feature-orders'
  if (id.includes('src/features/profile')) return 'feature-profile'
  if (id.includes('src/features/home')) return 'feature-home'

  // Features - Admin (Dashboard)
  if (id.includes('src/features/admin')) return 'feature-admin'

  // Core - Contextos e providers
  if (id.includes('src/core/context') || id.includes('src/core/providers')) {
    return 'core-context'
  }

  // Compartilhado
  if (id.includes('src/shared/components') || id.includes('src/shared/hooks')) {
    return 'shared-lib'
  }

  // Utilitários
  if (id.includes('src/utils') || id.includes('src/lib')) return 'utils'
  if (id.includes('src/types')) return 'types'
}

// ============================================================================
// CONFIGURAÇÃO VITE
// ============================================================================

export default defineConfig({
  // ---- Plugins ----
  plugins: [
    react(), 
    tailwind(),
    routeGuardPlugin({
      adminRoutes: ['/admin']
    })
  ],

  // ---- Resolução de Módulos ----
  resolve: {
    alias: aliases,
  },

  // ---- Servidor Dev ----
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ---- Build ----
  build: {
    rollupOptions: {
      // Entrada única
      input: paths.main,
      
      output: {
        // Divisão de chunks otimizada
        manualChunks,
        
        // Estrutura de output
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (name && /\.(gif|jpe?g|png|svg)$/.test(name)) {
            return 'images/[name]-[hash][extname]'
          } else if (name && /\.css$/.test(name)) {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },

    // Configurações de build
    chunkSizeWarningLimit: 600,
    minify: 'terser',
    sourcemap: false,
    // Reporta o tamanho comprimido de todos os arquivos
    reportCompressedSize: true,
  },
})
