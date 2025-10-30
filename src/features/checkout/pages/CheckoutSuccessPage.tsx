import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';
import { Card, CardBody } from '@/ui/Card';

export const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simular confirmação do pagamento
    // Em produção, você pode chamar um endpoint para confirmar via webhook
    if (sessionId) {
      setConfirmed(true);
    }
  }, [sessionId]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl text-green-600 mb-4">✓</div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Pagamento Confirmado!</h1>
        <p className="text-gray-600 dark:text-gray-300">Obrigado pela sua compra.</p>
      </div>

      {confirmed && (
        <Card>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Seu pagamento foi processado com sucesso!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Session ID: {sessionId}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => navigate('/orders')}>
          Ver Meus Pedidos
        </Button>
        <Button className="flex-1" onClick={() => navigate('/products')}>
          Continuar Comprando
        </Button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
        Um e-mail de confirmação foi enviado para seu endereço de e-mail.
      </p>
    </div>
  );
};

export default CheckoutSuccessPage;
