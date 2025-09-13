import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: unknown };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    // Pode enviar para um serviço de logging
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold text-red-600">Algo deu errado.</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Tente atualizar a página ou voltar mais tarde.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
