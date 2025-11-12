/**
 * Serviço de autenticação
 * Gerencia tokens, autenticação e chamadas à API REST
 */

import { STORAGE_KEYS } from '@/constants';
import { environment } from '@/config/environment';

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private baseUrl = `${environment.apiUrl}/api/auth`;

  /**
   * Realiza login com email e senha
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Realiza signup
   */
  async signup(data: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Signup failed: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Obtém dados do usuário autenticado
   */
  async getMe(token: string): Promise<UserResponse> {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Get user failed: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Realiza logout
   */
  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`);
    }
  }

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
