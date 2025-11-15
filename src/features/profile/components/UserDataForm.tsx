import { useState, useEffect } from 'react';
import type { User } from '@/types/domain/user';
import type { UpdateUserRequest } from '@/services/user.service';
import { userService } from '@/services/user.service';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';

interface UserDataFormProps {
  user: User | null;
  onSuccess?: () => void;
}

const UserDataForm = ({ user, onSuccess }: UserDataFormProps) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await userService.updateProfile(formData);
      setSuccess(true);
      onSuccess?.();
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
            Perfil atualizado com sucesso!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
              htmlFor="nome"
            >
              Nome Completo
            </label>
            <Input
              id="nome"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
              htmlFor="birthDate"
            >
              Data de Nascimento
            </label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
            htmlFor="email"
          >
            E-mail
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu.email@exemplo.com"
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
            htmlFor="telefone"
          >
            Telefone
          </label>
          <Input
            id="telefone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 98765-4321"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-12 items-center justify-center gap-x-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 text-base font-bold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserDataForm;
