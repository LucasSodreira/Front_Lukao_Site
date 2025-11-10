/**
 * Manipulador de erros user-friendly
 * Converte erros técnicos em mensagens amigáveis
 */

export class ErrorHandler {
  /**
   * Converte erro para mensagem amigável
   */
  static getUserFriendlyMessage(error: Error | unknown): string {
    if (!(error instanceof Error)) {
      return 'Ocorreu um erro inesperado. Tente novamente.';
    }

    const message = error.message.toLowerCase();

    // Erros de rede
    if (message.includes('network') || message.includes('fetch')) {
      return 'Problema de conexão. Verifique sua internet e tente novamente.';
    }

    // Erros de timeout
    if (message.includes('timeout')) {
      return 'A operação demorou muito. Tente novamente.';
    }

    // Erros de autenticação
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Sessão expirada. Faça login novamente.';
    }

    if (message.includes('forbidden') || message.includes('403')) {
      return 'Você não tem permissão para realizar esta ação.';
    }

    // Erros de validação
    if (message.includes('validation') || message.includes('invalid')) {
      return 'Dados inválidos. Verifique as informações e tente novamente.';
    }

    // Erros de não encontrado
    if (message.includes('not found') || message.includes('404')) {
      return 'Informação não encontrada.';
    }

    // Erros de servidor
    if (message.includes('500') || message.includes('server error')) {
      return 'Erro no servidor. Tente novamente em alguns instantes.';
    }

    // Erro genérico
    return 'Ocorreu um erro. Tente novamente mais tarde.';
  }

  /**
   * Verifica se erro é de rede
   */
  static isNetworkError(error: Error | unknown): boolean {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return message.includes('network') || message.includes('fetch');
  }

  /**
   * Verifica se erro é de autenticação
   */
  static isAuthError(error: Error | unknown): boolean {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return message.includes('unauthorized') || 
           message.includes('401') ||
           message.includes('forbidden') ||
           message.includes('403');
  }
}
