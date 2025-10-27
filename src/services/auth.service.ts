/**
 * Serviço de autenticação
 * Gerencia tokens e autenticação do usuário
 */

import { STORAGE_KEYS } from '@/constants';

export interface TokenData {
  token: string;
  expiresIn: number;
}

class AuthService {
  /**
   * Salva o token de acesso
   */
  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Obtem o token de acesso
   */
  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Salva o token de refresh
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Obtem o token de refresh
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Limpa todos os tokens
   */
  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Verifica se o token está próximo de expirar (menos de 5 minutos)
   */
  isTokenExpiring(expiresIn: number): boolean {
    const fiveMinutesInSeconds = 5 * 60;
    return expiresIn < fiveMinutesInSeconds;
  }
}

export const authService = new AuthService();
