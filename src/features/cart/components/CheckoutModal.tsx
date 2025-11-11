import { useState } from 'react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Card, CardBody } from '@/ui/Card';

interface CheckoutModalProps {
  isOpen: boolean;
  cartTotal: number;
  shippingCost: number;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  isLoading?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartTotal,
  shippingCost,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Nome obrigatório';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) newErrors.customerEmail = 'Email inválido';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Telefone obrigatório';
    if (!formData.street.trim()) newErrors.street = 'Rua obrigatória';
    if (!formData.city.trim()) newErrors.city = 'Cidade obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
    }
  };

  if (!isOpen) return null;

  const total = (Number(cartTotal) + Number(shippingCost)).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continuar a Compra</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resumo do Carrinho */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo do Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Frete:</span>
                  <span className="font-medium text-gray-900 dark:text-white">R$ {shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">R$ {total}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                error={errors.customerName}
                required
              />
              <Input
                label="Email"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                error={errors.customerEmail}
                required
              />
              <Input
                label="Telefone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                error={errors.customerPhone}
                required
              />
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço de Entrega</h3>
            <div className="space-y-4">
              <Input
                label="Rua e Número"
                name="street"
                value={formData.street}
                onChange={handleChange}
                error={errors.street}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Cidade"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  required
                />
                <Input
                  label="Estado"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  required
                  maxLength={2}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="CEP"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={errors.zipCode}
                  required
                />
                <Input
                  label="País"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações (opcional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Entregar após 18h, deixar com porteiro, etc."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 sticky bottom-0 bg-white dark:bg-gray-800 p-4 -m-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Processando...' : 'Continuar a Compra'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
