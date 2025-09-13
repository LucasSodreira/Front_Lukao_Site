import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Link HTTP para conectar com a API GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

// Link de autenticação para incluir o token JWT
const authLink = setContext((_, { headers }) => {
  // Pegar token do localStorage
  const token = localStorage.getItem('authToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Cliente Apollo
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    // Configurações para resolver possíveis problemas de cache
    resultCaching: false,
  }),
  // Configurações adicionais para debugging
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first' as const,
      errorPolicy: 'all' as const,
    },
    query: {
      fetchPolicy: 'cache-first' as const,
      errorPolicy: 'all' as const,
    },
    mutate: {
      errorPolicy: 'all' as const,
    },
  },
});
