import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';
import { Card, CardBody } from '@/ui/Card';

export const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl text-yellow-600 mb-4">⚠</div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Pagamento Cancelado</h1>
        <p className="text-gray-600 dark:text-gray-300">Você cancelou o processo de pagamento.</p>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Nenhum valor foi cobrado. Você pode tentar novamente quando estiver pronto.
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>• Seu carrinho foi preservado</p>
            <p>• Você pode finalizara compra a qualquer momento</p>
            <p>• Seus itens continuam disponíveis</p>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => navigate('/cart')}>
          Voltar ao Carrinho
        </Button>
        <Button className="flex-1" onClick={() => navigate('/products')}>
          Continuar Comprando
        </Button>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;
