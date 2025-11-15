/**
 * Funções de formatação
 */

/**
 * Formata um número como moeda brasileira (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro
 */
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("pt-BR", options || defaultOptions).format(
    dateObj
  );
};

/**
 * Formata uma data para formato curto (dd/MM/yyyy)
 */
export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formata uma data para formato longo (DD de MMMM de YYYY)
 */
export const formatDateLong = (date: string | Date): string => {
  return formatDate(date, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formata um número de telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
};

/**
 * Formata um CEP brasileiro
 */
export const formatZipCode = (zipCode: string): string => {
  const cleaned = zipCode.replace(/\D/g, "");

  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  return zipCode;
};

/**
 * Formata um CPF brasileiro
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return cpf;
};

/**
 * Formata um CNPJ brasileiro
 */
export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, "");

  if (cleaned.length === 14) {
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return cnpj;
};

/**
 * Formata um número para exibição
 */
export const formatNumber = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formata bytes para tamanho legível
 */
export const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * Trunca um texto com reticências
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
};
