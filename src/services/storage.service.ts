/**
 * Serviço de storage local
 * Gerencia dados persistidos no localStorage
 */

import { STORAGE_KEYS } from '@/constants';

class StorageService {
  /**
   * Define um valor no localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }

  /**
   * Obtém um valor do localStorage
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Erro ao recuperar ${key} do localStorage:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove um item do localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error);
    }
  }

  /**
   * Limpa todo o localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  }

  /**
   * Obtém todas as preferências de usuário
   */
  getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES, {});
  }

  /**
   * Salva preferências de usuário
   */
  setUserPreferences(preferences: Record<string, unknown>): void {
    this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  /**
   * Obtém o tema salvo
   */
  getTheme(): string | null {
    return this.getItem<string>(STORAGE_KEYS.THEME);
  }

  /**
   * Salva o tema
   */
  setTheme(theme: string): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Obtém o idioma salvo
   */
  getLanguage(): string | null {
    return this.getItem<string>(STORAGE_KEYS.LANGUAGE);
  }

  /**
   * Salva o idioma
   */
  setLanguage(language: string): void {
    this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }
}

export const storageService = new StorageService();
