import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { environment } from '@/config/environment';

const httpLink = createHttpLink({
  uri: environment.graphqlEndpoint,
  // Inclui cookies (ex.: anon_cart, access_token) nas requisições
  credentials: 'include',
});

// Timeout link - cancela requisições após 30 segundos
const timeoutLink = new ApolloLink((operation, forward) => {
  const timeout = 30000; // 30 segundos

  return new Observable((observer) => {
    const timer = setTimeout(() => {
      observer.error(new Error('Request timeout - A requisição demorou muito tempo'));
    }, timeout);

    const subscription = forward(operation).subscribe({
      next: (result) => {
        clearTimeout(timer);
        observer.next(result);
      },
      error: (error) => {
        clearTimeout(timer);
        observer.error(error);
      },
      complete: () => {
        clearTimeout(timer);
        observer.complete();
      },
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  });
});

// Error link - trata erros globalmente (temporariamente desabilitado)
// const errorLink = onErrorLink((errorResp) => {
//   const { graphQLErrors, networkError, operation } = errorResp;
//   
//   if (graphQLErrors && graphQLErrors.length > 0) {
//     graphQLErrors.forEach((error: unknown) => {
//       if (error && typeof error === 'object' && 'message' in error) {
//         logger.error('GraphQL error', {
//           message: (error as { message: string }).message || 'Unknown error',
//           operation: operation.operationName,
//         });
//       }
//     });
//   }

//   if (networkError) {
//     logger.error('Network error', {
//       message: networkError.message || 'Unknown network error',
//       operation: operation.operationName,
//     });
//   }
// });

// Link de autenticação para incluir o token JWT e CSRF
const authLink = setContext((_, { headers }) => {
  // Adiciona token CSRF do cookie para proteção
  const csrfToken = getCookie('XSRF-TOKEN');

  return {
    headers: {
      ...headers,
      ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
    },
  };
});

/**
 * Extrai valor de um cookie pelo nome
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Cliente Apollo
export const client = new ApolloClient({
  link: ApolloLink.from([timeoutLink, authLink, httpLink]),
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
          variations: {
            // Evita warnings de perda de dados quando variations vêm vazias/nulas em algumas queries
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
