/**
 * Validador de Inputs
 * Valida e sanitiza entradas do usuário para prevenir ataques
 */

export class InputValidator {
  /**
   * Valida quantidade de produtos
   */
  static validateQuantity(quantity: number): boolean {
    return (
      Number.isInteger(quantity) &&
      quantity > 0 &&
      quantity <= 999 // Limite máximo
    );
  }

  /**
   * Valida ID de produto (UUID v4 format)
   */
  static validateProductId(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  /**
   * Valida string para prevenir injection
   */
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>"']/g, '') // Remove caracteres perigosos
      .trim()
      .substring(0, 1000); // Limite de tamanho
  }

  /**
   * Valida número de telefone (formato internacional)
   */
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
  }

  /**
   * Valida CEP brasileiro
   */
  static validateZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}-?\d{3}$/;
    return zipRegex.test(zipCode);
  }

  /**
   * Valida preço (número positivo com até 2 casas decimais)
   */
  static validatePrice(price: number): boolean {
    return (
      typeof price === 'number' &&
      price > 0 &&
      Number.isFinite(price) &&
      /^\d+(\.\d{1,2})?$/.test(price.toString())
    );
  }

  /**
   * Valida nome (mínimo 2 caracteres, apenas letras e espaços)
   */
  static validateName(name: string): boolean {
    const nameRegex = /^[a-záàâãéèêíïóôõöúçñ\s]{2,100}$/i;
    return nameRegex.test(name.trim());
  }

  /**
   * Valida campo obrigatório
   */
  static validateRequired(value: string | number | null | undefined): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  }

  /**
   * Sanitiza HTML para prevenir XSS
   */
  static sanitizeHtml(html: string): string {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  }

  /**
   * Valida URL
   */
  static validateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Valida número inteiro dentro de um range
   */
  static validateIntInRange(value: number, min: number, max: number): boolean {
    return Number.isInteger(value) && value >= min && value <= max;
  }
}
