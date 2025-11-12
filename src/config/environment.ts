/**
 * Configurações de ambiente
 * Centraliza todas as variáveis de ambiente da aplicação
 */

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const rawGraphql = import.meta.env.VITE_GRAPHQL_ENDPOINT as string | undefined;

// Importante: não usar || para permitir string vazia em produção (same-origin)
const apiUrl = rawApiUrl !== undefined ? String(rawApiUrl) : 'http://localhost:8080';
const graphqlEndpoint = rawGraphql !== undefined ? String(rawGraphql) : 'http://localhost:8080/graphql';

export const environment = {
  production: import.meta.env.PROD,
  development: import.meta.env.DEV,
  apiUrl,
  graphqlEndpoint,
  appName: 'Projeto Loja',
  version: '1.0.0',
} as const;

export type Environment = typeof environment;
