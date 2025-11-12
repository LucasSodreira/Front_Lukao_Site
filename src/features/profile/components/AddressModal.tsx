import { useState, useEffect } from 'react';
import { addressService } from '@/services';
import type { Address, CreateAddressInput } from '@/types';
import { Button } from '@/ui/Button';
import { logger } from '@/utils';
import Input from '@/ui/Input';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: Address;
}

const AddressModal = ({ isOpen, onClose, onSuccess, address }: AddressModalProps) => {
  const [formData, setFormData] = useState<CreateAddressInput>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    primary: false
  });

  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        primary: address.primary
      });
    } else {
      setFormData({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
        primary: false
      });
    }
    setFormError('');
  }, [address, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      setFormError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      if (address?.id) {
        await addressService.updateAddress(address.id, formData);
      } else {
        await addressService.createAddress(formData);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      logger.error('Erro ao salvar endereço:', err);
      setFormError('Erro ao salvar endereço. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {address ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Rua"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Ex: Rua das Flores"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cidade"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ex: São Paulo"
              required
            />
            <Input
              label="Estado"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Ex: SP"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CEP"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Ex: 01310-100"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                País
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="Brasil">Brasil</option>
                <option value="Portugal">Portugal</option>
                <option value="EUA">EUA</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="primary"
              checked={formData.primary}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 dark:text-gray-100"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Definir como endereço principal
              {!address && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (se selecionado, substituirá o endereço principal anterior)
                </span>
              )}
            </span>
          </label>

          {formError && <div className="text-sm text-red-600">{formError}</div>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              full
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              full
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
