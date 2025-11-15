/**
 * Formatadores de valores para exibição
 */

export const formatCurrency = (
  value: number | string,
  locale = "pt-BR",
  currency = "BRL"
): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return numValue.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
};

export const formatDate = (date: string | Date, locale = "pt-BR"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

export const formatDateTime = (
  date: string | Date,
  locale = "pt-BR"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
};

export const formatZipCode = (zipCode: string): string => {
  const clean = zipCode.replace(/\D/g, "");
  if (clean.length === 8) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return zipCode;
};

export const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
};

export const truncateText = (text: string, maxLength = 100): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Pendente",
    PROCESSING: "Processando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    RETURNED: "Devolvido",
  };
  return statusMap[status] || status;
};
