/**
 * Serviço de autenticação
 * Gerencia tokens, autenticação e chamadas à API REST
 */

import { environment } from "@/config/environment";

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
  tokenType: string;
  expiresIn: number;
  httpOnlyCookies: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
}

class AuthService {
  private baseUrl = `${environment.apiUrl}/api/auth`;

  /**
   * Obtém o token CSRF do cookie
   */
  private getCsrfToken(): string | null {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? match[1] : null;
  }

  /**
   * Garante que o token CSRF existe, fazendo uma requisição se necessário
   */
  private async ensureCsrfToken(): Promise<void> {
    if (this.getCsrfToken()) {
      return; // Já tem o token
    }

    // Faz uma requisição GET para obter o token CSRF
    try {
      await fetch(`${environment.apiUrl}/api/csrf-token`, {
        method: "GET",
        credentials: "include",
      });
    } catch {
      // Ignora erros aqui; o token pode não ser necessário
    }
  }

  /**
   * Constrói os headers incluindo CSRF token se disponível
   */
  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const csrfToken = this.getCsrfToken();
    if (csrfToken) {
      headers["X-XSRF-TOKEN"] = csrfToken;
    }
    return headers;
  }

  /**
   * Realiza login com email e senha
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await this.ensureCsrfToken();
    const response = await fetch(`${this.baseUrl}/signin`, {
      method: "POST",
      headers: this.buildHeaders(),
      credentials: "include",
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
    await this.ensureCsrfToken();
    const response = await fetch(`${this.baseUrl}/signup`, {
      method: "POST",
      headers: this.buildHeaders(),
      credentials: "include",
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
  async getMe(): Promise<UserResponse> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
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
      method: "POST",
      headers: this.buildHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`);
    }
  }

  async refreshSession(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: "POST",
        headers: this.buildHeaders(),
        credentials: "include",
        body: JSON.stringify({}),
      });

      // Se o refresh falhar, limpa os cookies inválidos
      if (!response.ok) {
        this.clearAuthCookies();
        return false;
      }

      return true;
    } catch {
      // Falha ao renovar sessão (esperado após reinício do backend)
      this.clearAuthCookies();
      return false;
    }
  }

  /**
   * Limpa os cookies de autenticação do lado do cliente
   * Útil quando os tokens são inválidos
   */
  private clearAuthCookies(): void {
    const cookiesToClear = ["access_token", "refresh_token"];
    cookiesToClear.forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `${name}=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    });
  }
}

export const authService = new AuthService();
