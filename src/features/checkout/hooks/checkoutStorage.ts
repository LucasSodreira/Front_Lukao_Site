// Chaves do sessionStorage
export const STORAGE_KEYS = {
  SHIPPING: 'checkout_shipping',
  ADDRESS_ID: 'checkout_address_id',
  PAYMENT: 'checkout_payment',
  ORDER_ID: 'checkout_order_id',
  STEP: 'checkout_step',
  TIMESTAMP: 'checkout_timestamp',
} as const;

// Expiração de 1 hora em milissegundos
export const CHECKOUT_EXPIRATION = 60 * 60 * 1000;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Falha ao salvar, ignora
  }
}

export function isCheckoutExpired(): boolean {
  const timestamp = sessionStorage.getItem(STORAGE_KEYS.TIMESTAMP);
  if (!timestamp) return false;

  const elapsed = Date.now() - parseInt(timestamp);
  return elapsed > CHECKOUT_EXPIRATION;
}

export function clearCheckoutStorage(): void {
  sessionStorage.removeItem(STORAGE_KEYS.SHIPPING);
  sessionStorage.removeItem(STORAGE_KEYS.ADDRESS_ID);
  sessionStorage.removeItem(STORAGE_KEYS.PAYMENT);
  sessionStorage.removeItem(STORAGE_KEYS.ORDER_ID);
  sessionStorage.removeItem(STORAGE_KEYS.STEP);
  sessionStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
}
