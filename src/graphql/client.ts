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
  cache: new InMemoryCache(),
});
