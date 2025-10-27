/**
 * Contexto de autenticação (separado por fast refresh)
 */

import { createContext } from 'react';
import type { AuthContextType } from '@/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
