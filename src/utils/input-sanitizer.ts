/**
 * Utilitários de sanitização de inputs
 * Previne injeção de código e XSS
 */

/**
 * Sanitiza string removendo caracteres perigosos
 */
export class InputSanitizer {
  /**
   * Remove tags HTML e caracteres especiais
   */
  static sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  /**
   * Sanitiza input para uso em URLs
   */
  static sanitizeURL(input: string): string {
    try {
      const url = new URL(input);
      // Apenas permite http e https
      if (!["http:", "https:"].includes(url.protocol)) {
        return "";
      }
      return url.toString();
    } catch {
      return "";
    }
  }

  /**
   * Remove espaços em branco excessivos
   */
  static normalizeWhitespace(input: string): string {
    return input.trim().replace(/\s+/g, " ");
  }

  /**
   * Sanitiza texto simples (remove tags mas preserva acentos)
   */
  static sanitizeText(input: string): string {
    return input
      .replace(/<[^>]*>/g, "") // Remove tags HTML
      .replace(/[<>"']/g, "") // Remove caracteres perigosos
      .trim();
  }

  /**
   * Sanitiza número de telefone
   */
  static sanitizePhone(input: string): string {
    return input.replace(/[^\d+\-() ]/g, "");
  }

  /**
   * Sanitiza email
   */
  static sanitizeEmail(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, "");
  }

  /**
   * Limita tamanho de string
   */
  static limitLength(input: string, maxLength: number): string {
    return input.substring(0, maxLength);
  }

  /**
   * Sanitização completa para inputs de formulário
   */
  static sanitizeFormInput(input: string, maxLength = 1000): string {
    return this.limitLength(
      this.normalizeWhitespace(this.sanitizeText(input)),
      maxLength
    );
  }
}
