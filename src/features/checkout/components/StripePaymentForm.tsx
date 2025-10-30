import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/ui/Button';
import { Card, CardBody } from '@/ui/Card';

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  orderId,
  amount,
  onSuccess,
  onError,
  isLoading = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      onError('Stripe não carregou corretamente');
    }
  }, [stripe, elements, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe não está carregado');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Elemento de cartão não encontrado');
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Confirmar pagamento com Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `Order ${orderId}`,
          },
        },
      });

      if (result.error) {
        setCardError(result.error.message || 'Erro ao processar pagamento');
        onError(result.error.message || 'Erro ao processar pagamento');
      } else if (result.paymentIntent) {
        if (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'processing') {
          onSuccess(result.paymentIntent.id);
        } else {
          setCardError(`Status de pagamento: ${result.paymentIntent.status}`);
          onError(`Pagamento com status: ${result.paymentIntent.status}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setCardError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Dados do Cartão de Crédito</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Elemento do Cartão */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                  invalid: {
                    color: '#dc2626',
                  },
                },
              }}
            />
          </div>

          {/* Erro */}
          {cardError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-700 dark:text-red-300">
              <p className="font-medium">❌ Erro no Pagamento</p>
              <p className="text-sm mt-1">{cardError}</p>
            </div>
          )}

          {/* Informações de Segurança */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-sm">
            <p className="text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <span>🔒</span>
              <span>
                Seu pagamento é seguro. Stripe é certificado PCI DSS Level 1. Seu cartão <strong>nunca</strong> é armazenado em nossos servidores.
              </span>
            </p>
          </div>

          {/* Resumo */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Valor a cobrar:</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ {amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={isProcessing || isLoading || !stripe || !elements}
            className="w-full h-12 text-lg font-semibold"
          >
            {isProcessing || isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando Pagamento...</span>
              </div>
            ) : (
              `Pagar R$ ${amount.toFixed(2)}`
            )}
          </Button>

          {/* Aviso de Cartões de Teste */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>💳 Para testes, use: <strong>4242 4242 4242 4242</strong></p>
            <p>Data: 12/99 | CVC: 123</p>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default StripePaymentForm;
