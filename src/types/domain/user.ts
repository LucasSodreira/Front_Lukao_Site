/**
 * Tipos de domínio de Usuário
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}
