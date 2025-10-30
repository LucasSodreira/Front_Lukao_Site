import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Divisão de chunks por vendor e por feature
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('@stripe')) return 'vendor-stripe';
          if (id.includes('@apollo')) return 'vendor-apollo';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('lucide-react') || id.includes('tailwindcss')) {
            return 'vendor-ui';
          }
          
          // Feature chunks
          if (id.includes('src/features/auth')) return 'feature-auth';
          if (id.includes('src/features/products')) return 'feature-products';
          if (id.includes('src/features/cart')) return 'feature-cart';
          if (id.includes('src/features/checkout')) return 'feature-checkout';
          if (id.includes('src/features/orders')) return 'feature-orders';
          if (id.includes('src/features/profile')) return 'feature-profile';
          if (id.includes('src/features/home')) return 'feature-home';
          
          // Core chunks
          if (id.includes('src/core/context') || id.includes('src/core/providers')) {
            return 'core-context';
          }
          if (id.includes('src/shared/components') || id.includes('src/shared/hooks')) {
            return 'shared-components';
          }
          
          // GraphQL separado
          if (id.includes('src/graphql')) return 'graphql';
          
          // Types separado
          if (id.includes('src/types')) return 'types';
          
          // Utils separado
          if (id.includes('src/utils') || id.includes('src/lib')) return 'utils';
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'terser',
  },
})
