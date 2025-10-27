/**
 * Configuração do cliente Apollo
 * Centraliza toda a configuração do GraphQL
 */

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { environment } from '@/config';
import { STORAGE_KEYS } from '@/constants';

const httpLink = createHttpLink({
  uri: environment.graphqlEndpoint,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          keyFields: ['id'],
          fields: {
            images: {
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
              merge: (_existing, incoming = []) => incoming,
            },
          },
        },
      },
    }),
  });
};
