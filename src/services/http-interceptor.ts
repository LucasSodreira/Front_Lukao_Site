/**
 * Interceptador HTTP para gerenciar tokens e refresh automático
 * Detecta quando um token expirou (401) e tenta renová-lo automaticamente
 */

import { authService } from "./auth.service";

// Fila de requisições pendentes durante o refresh
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscreve para ser notificado quando o refresh de token terminar
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * Notifica todos os subscribers que o token foi renovado
 */
function onRefreshed() {
  refreshSubscribers.forEach((callback) => callback(""));
  refreshSubscribers = [];
}

/**
 * Redefine o estado de refresh
 */
function resetRefreshState() {
  isRefreshing = false;
  refreshSubscribers = [];
}

/**
 * Interceptador para requisições HTTP
 * Trata erros 401 e tenta fazer refresh do token
 */
export async function fetchWithInterceptor(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    let response = await fetch(url, options);

    // Se receber 401 (token expirado), tenta fazer refresh
    if (response.status === 401) {
      // Se já está tentando fazer refresh, aguarda a conclusão
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            // Após o refresh, repete a requisição original
            resolve(fetch(url, options));
          });
        });
      }

      // Inicia o processo de refresh
      isRefreshing = true;

      try {
        const refreshed = await authService.refreshSession();

        if (refreshed) {
          onRefreshed();
          // Repete a requisição original com o novo token
          response = await fetch(url, options);
        } else {
          // Refresh falhou, usuário deve fazer login novamente
          resetRefreshState();
          // Deixa o 401 passar para que o componente trate o deslogamento
          return response;
        }
      } catch {
        resetRefreshState();
        return response;
      }
    }

    return response;
  } catch {
    throw new Error("Network error occurred");
  }
}

/**
 * Wrapper para fetch que automaticamente cuida de refresh de token
 * Use isso em vez de fetch() direto em requisições que precisam de autenticação
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetchWithInterceptor(url, {
    ...options,
    credentials: "include", // Sempre inclui cookies para token
  });
}
