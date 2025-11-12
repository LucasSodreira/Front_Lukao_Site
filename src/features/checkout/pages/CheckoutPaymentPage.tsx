import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutBreadcrumb } from '../components/CheckoutBreadcrumb';
import { CreditCardForm, type CreditCardData } from '../components/CreditCardForm';
import { useCheckoutState, useValidatePayment, useStripePayment } from '../hooks';
import { logger } from '@/utils';

export const CheckoutPaymentPage = () => {
  const navigate = useNavigate();
  const { shippingAddress, orderId, setPaymentInfo, setCurrentStep } = useCheckoutState();
  const { validatePayment } = useValidatePayment();
  const { createPaymentIntent, processPayment } = useStripePayment();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Carrinho será obtido do contexto ou estado (simplificado por enquanto)
  const cartLoading = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cart: any = null;

  // Garantir pré-condições: endereço e orderId
  useEffect(() => {
    if (!shippingAddress && !cartLoading) {
      navigate('/checkout/address');
    } else if (shippingAddress && !orderId && !cartLoading) {
      // Sem orderId (não criou pedido na revisão) volta para revisão
      navigate('/checkout/review');
    }
  }, [shippingAddress, orderId, cartLoading, navigate]);

  if (cartLoading || !cart) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Carregando...</h1>
        </div>
      </main>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subtotal = cart.items.reduce((sum: number, item: any) => sum + Number(item.totalPrice || 0), 0);
  const shipping = 20.0; // TODO: Calcular frete real do backend
  const total = subtotal + shipping;

  /**
   * Processa o pagamento com cartão de crédito via Stripe
   * 
   * Fluxo:
   * 1. Valida dados do cartão
   * 2. Cria intenção de pagamento no Stripe
   * 3. Processa o pagamento
   * 4. Se sucesso, navega para revisão
   */
  const handleCreditCardSubmit = async (cardData: CreditCardData) => {
    setIsProcessing(true);
    setValidationErrors({});

    try {

      // 1. Validar dados do cartão no backend
      const paymentValidation = await validatePayment({
        method: 'credit_card',
        ...cardData,
      });

      if (!paymentValidation.isValid) {
        const errors: Record<string, string> = {};
        paymentValidation.errors.forEach(error => {
          errors[error.field] = error.message;
        });
        setValidationErrors(errors);
        logger.warn('Validação de cartão falhou', { errors });
        setIsProcessing(false);
        return;
      }

      logger.info('Cartão validado com sucesso');

      // 2. Criar intenção de pagamento no Stripe usando orderId persistido
      if (!orderId) {
        setValidationErrors({ general: 'Pedido não encontrado. Volte para revisão.' });
        setIsProcessing(false);
        navigate('/checkout/review');
        return;
      }

      const intentResult = await createPaymentIntent(orderId);
      
      if (!intentResult.success) {
        setValidationErrors({
          general: intentResult.error || 'Falha ao criar intenção de pagamento',
        });
        logger.error('Erro ao criar intenção de pagamento', { error: intentResult.error });
        setIsProcessing(false);
        return;
      }

      // 3. Processar pagamento
    const paymentResult = await processPayment(orderId, intentResult.paymentIntentId || '');

      if (!paymentResult.success) {
        setValidationErrors({
          general: paymentResult.error || 'Falha ao processar pagamento',
        });
        logger.error('Erro ao processar pagamento', { error: paymentResult.error });
        setIsProcessing(false);
        return;
      }

      logger.info('Pagamento processado com sucesso', { 
        paymentIntentId: paymentResult.paymentIntentId,
        status: paymentResult.status 
      });

      // 4. Salvar dados do pagamento
      setPaymentInfo({
        method: 'credit_card',
        ...cardData,
      });
      
      // orderId já existente; resposta pode confirmar

  // Atualizar etapa atual para pagamento concluído antes de sucesso
  setCurrentStep('payment');
  // 5. Navegar para sucesso
      navigate('/checkout/success', {
        state: { orderId: paymentResult.orderId },
      });

    } catch (error) {
      logger.error('Erro durante processamento de pagamento', { error });
      setValidationErrors({
        general: 'Erro ao processar pagamento. Tente novamente.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Carrinho', path: '/cart' },
    { label: 'Endereço', path: '/checkout/address' },
    { label: 'Revisão', path: '/checkout/review' },
    { label: 'Pagamento', active: true },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:py-4">
      <CheckoutBreadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 mt-8">
        {/* Coluna Principal - Formulário de Pagamento */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-[#0e121b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Finalize seu Pagamento
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              Insira os dados do seu cartão para finalizar a compra
            </p>
          </div>

          {/* Aviso de processamento */}
          {isProcessing && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                  Processando seu pagamento... Por favor, aguarde.
                </p>
              </div>
            </div>
          )}

          {/* Formulário de Cartão de Crédito */}
          <div className="bg-white dark:bg-background-dark/80 p-6 md:p-8 rounded-xl shadow-sm border border-transparent dark:border-gray-800 mb-6">
            <CreditCardForm
              onSubmit={handleCreditCardSubmit}
              totalAmount={total}
              isLoading={isProcessing}
            />

            {/* Informação de segurança e bandeiras */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>Seus dados estão protegidos. Compra 100% segura.</span>
              </div>
              <div className="flex items-center gap-2">
                <img alt="Visa" className="h-6" src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" />
                <img alt="Mastercard" className="h-6" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" />
              </div>
            </div>

            {/* Erro de Validação */}
            {validationErrors.general && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm font-semibold">{validationErrors.general}</p>
              </div>
            )}
          </div>

          {/* Informação de Segurança */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 flex-shrink-0">verified_user</span>
            <div>
              <p className="text-green-700 dark:text-green-300 text-sm font-semibold">Compra 100% Segura</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Sua transação é processada com criptografia de ponta a ponta pelo Stripe, o maior processador de pagamentos do mundo.
              </p>
            </div>
          </div>

          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/checkout/review')}
            className="w-full mt-6 border-2 border-gray-300 dark:border-gray-600 text-[#0e121b] dark:text-white font-bold py-3 rounded-xl text-base hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          >
            Voltar para Revisão
          </button>
        </div>

        {/* Coluna Lateral - Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-background-dark/80 p-6 md:p-8 rounded-xl shadow-sm border border-transparent dark:border-gray-800 sticky top-28">
            <h2 className="text-2xl font-bold text-[#0e121b] dark:text-white mb-6">
              Resumo do Pagamento
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-[#0e121b] dark:text-white">
                  R$ {(subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frete</span>
                <span className="font-semibold text-[#0e121b] dark:text-white">
                  R$ {shipping.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-[#0e121b] dark:text-white">Total</span>
              <span className="text-3xl font-black text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <div className="text-center text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <p>Dúvidas sobre pagamento?</p>
              <a href="#" className="text-primary font-semibold hover:underline block">
                Entre em contato com nosso suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPaymentPage;
