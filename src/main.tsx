import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados são considerados "frescos" antes de refetch automático
      staleTime: 1000 * 60 * 5, // 5 minutos
      // Evita refetch automático ao focar na janela (útil para evitar requisições desnecessárias)
      refetchOnWindowFocus: false,
      // Mantém refetch ao montar (primeira renderização)
      refetchOnMount: true,
      // Número de tentativas em caso de erro
      retry: 1,
      // Tempo de cache dos dados
      gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente cacheTime)
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
