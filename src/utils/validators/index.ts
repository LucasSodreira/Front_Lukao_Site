/**
 * Validadores de email e senha
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string, minLength = 6): boolean => {
  return password.length >= minLength;
};

export const validateZipCode = (zipCode: string, country = 'Brasil'): boolean => {
  if (country === 'Brasil') {
    const brazilianZipRegex = /^\d{5}-?\d{3}$/;
    return brazilianZipRegex.test(zipCode);
  }
  return zipCode.length > 0;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateAddress = (street: string, city: string, state: string): boolean => {
  return street.length > 0 && city.length > 0 && state.length > 0;
};

export const validateRequired = (value: string | number | undefined | null): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
};
