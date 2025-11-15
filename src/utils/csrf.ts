/**
 * Utilitário para obter o CSRF token
 */

import { environment } from "@/config/environment";

/**
 * Obtém o token CSRF do cookie XSRF-TOKEN
 */
export const getCsrfToken = (): string | null => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

/**
 * Garante que o token CSRF existe, fazendo uma requisição se necessário
 */
export const ensureCsrfToken = async (): Promise<string | null> => {
  // Primeiro verifica se já existe
  let token = getCsrfToken();
  if (token) {
    return token;
  }

  // Se não existe, faz uma requisição GET para obter o token
  try {
    await fetch(`${environment.apiUrl}/api/csrf-token`, {
      method: "GET",
      credentials: "include",
    });

    // Tenta pegar o token novamente após a requisição
    token = getCsrfToken();
    return token;
  } catch (error) {
    console.error("Erro ao obter token CSRF:", error);
    return null;
  }
};

/**
 * Constrói headers incluindo CSRF token se disponível
 */
export const buildHeadersWithCsrf = async (
  additionalHeaders: Record<string, string> = {}
): Promise<HeadersInit> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  const csrfToken = await ensureCsrfToken();
  if (csrfToken) {
    headers["X-XSRF-TOKEN"] = csrfToken;
  }

  return headers;
};
