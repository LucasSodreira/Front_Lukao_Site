import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Link HTTP para conectar com a API GraphQL
const httpLink = createHttpLink({
  uri: '/graphql',
  // Inclui cookies (ex.: anon_cart) nas requisições
  credentials: 'include',
});

// Link de autenticação para incluir o token JWT
const authLink = setContext((_, { headers }) => {
  // Pegar token do localStorage
  const token = localStorage.getItem('authToken');

  return {
    headers: {
      ...headers,
      // Só envia Authorization quando houver token
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Cliente Apollo
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        keyFields: ['id'],
        fields: {
          images: {
            // Evita warnings de perda de dados quando imagens vêm vazias em algumas queries
            merge(existing = [], incoming = []) {
              return incoming ?? existing ?? [];
            },
          },
        },
      },
      Cart: {
        keyFields: ['id'],
        fields: {
          items: {
            // Sempre sobrescreve itens do carrinho com o resultado mais recente
            merge: (_existing, incoming = []) => incoming,
          },
        },
      },
    },
  }),
});
