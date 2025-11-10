/**
 * Funções utilitárias gerais
 * Funções comuns reutilizáveis em toda a aplicação
 */

export { logger } from './logger';
export { rateLimiter } from './rate-limiter';
export { ErrorHandler } from './error-handler';
export { InputValidator } from './validators/input-validator';
export { InputSanitizer } from './input-sanitizer';

/**
 * Aguarda um tempo determinado (em ms)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retorna um valor padrão se o valor for nulo ou indefinido
 */
export const defaultValue = <T>(value: T | null | undefined, defaultVal: T): T => {
  return value ?? defaultVal;
};

/**
 * Combina múltiplas classes (funcionalidade alternativa ao cn)
 */
export const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Filtra valores nulos/indefinidos de um array
 */
export const compact = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((item): item is T => item !== null && item !== undefined);
};

/**
 * Agrupa items por uma chave
 */
export const groupBy = <T>(items: T[], keyExtractor: (item: T) => string | number): Record<string | number, T[]> => {
  return items.reduce((acc, item) => {
    const key = keyExtractor(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string | number, T[]>);
};

/**
 * Remove duplicatas de um array
 */
export const unique = <T>(items: T[], keyExtractor?: (item: T) => string | number): T[] => {
  if (!keyExtractor) {
    return [...new Set(items)];
  }
  const seen = new Set();
  return items.filter(item => {
    const key = keyExtractor(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Verifica se dois valores são iguais (shallow comparison)
 */
export const shallowEqual = <T extends Record<string, unknown>>(obj1: T, obj2: T): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(key => obj1[key] === obj2[key]);
};

/**
 * Merge objects (shallow)
 */
export const merge = <T extends Record<string, unknown>>(
  ...objects: Array<Partial<T>>
): Partial<T> => {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {}) as Partial<T>;
};

/**
 * Tira espaços em branco de um objeto
 */
export const trimObject = <T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value.trim();
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);
};
