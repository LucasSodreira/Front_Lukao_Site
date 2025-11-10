/**
 * Serviço de Logging
 * Gerencia logs da aplicação de forma segura
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!this.isDevelopment && level !== 'error') {
      return; // Não loga em produção exceto erros críticos
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, data);
        break;
      case 'info':
        console.info(prefix, message, data);
        break;
      case 'warn':
        console.warn(prefix, message, data);
        break;
      case 'error':
        console.error(prefix, message, data);
        // Em produção, enviar para serviço de monitoramento
        if (!this.isDevelopment) {
          this.sendToMonitoring(message, data);
        }
        break;
    }
  }

  private sendToMonitoring(_message: string, _data?: unknown) {
    // TODO: Integrar com Sentry, LogRocket, etc.
    // Exemplo:
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     message, 
    //     data, 
    //     timestamp: Date.now(),
    //     userAgent: navigator.userAgent 
    //   }),
    // }).catch(() => {
    //   // Silenciar erro de logging para não criar loop
    // });
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }
}

export const logger = new Logger();
