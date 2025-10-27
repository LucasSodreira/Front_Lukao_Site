/**
 * Configurações de ambiente
 * Centraliza todas as variáveis de ambiente da aplicação
 */

export const environment = {
  production: import.meta.env.PROD,
  development: import.meta.env.DEV,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql',
  appName: 'Projeto Loja',
  version: '1.0.0',
} as const;

export type Environment = typeof environment;
