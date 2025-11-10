/**
 * Rate Limiter
 * Limita número de tentativas para prevenir ataques de força bruta
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitRecord> = new Map();

  /**
   * Verifica se a ação pode ser executada
   * @param key Identificador único (ex: 'login:user@email.com')
   * @param maxAttempts Número máximo de tentativas (padrão: 5)
   * @param windowMs Janela de tempo em milissegundos (padrão: 15 minutos)
   * @returns true se pode executar, false se excedeu o limite
   */
  canExecute(key: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      // Nova janela de tempo
      this.attempts.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (record.count >= maxAttempts) {
      // Limite excedido
      return false;
    }

    // Incrementar contador
    record.count++;
    return true;
  }

  /**
   * Obtém tempo restante até reset (em segundos)
   */
  getTimeUntilReset(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    
    const remaining = Math.max(0, record.resetTime - Date.now());
    return Math.ceil(remaining / 1000);
  }

  /**
   * Reseta contador para uma chave (chamado em caso de sucesso)
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Limpa todos os registros expirados
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
      }
    }
  }

  /**
   * Obtém informações sobre o rate limit de uma chave
   */
  getInfo(key: string): { count: number; timeUntilReset: number } | null {
    const record = this.attempts.get(key);
    if (!record) return null;

    return {
      count: record.count,
      timeUntilReset: this.getTimeUntilReset(key),
    };
  }
}

export const rateLimiter = new RateLimiter();

// Limpar registros expirados a cada 5 minutos
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);
