import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { ShippingFormFields, type ShippingFormData } from './ShippingFormFields';
import { Button } from '@/ui/Button';

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  initialData?: Partial<ShippingFormData>;
}

const INITIAL_STATE: ShippingFormData = {
  email: '',
  fullName: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

const VALIDATORS: Record<keyof ShippingFormData, (value: string) => string | null> = {
  email: (value) => {
    if (!value.trim()) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
    return null;
  },
  fullName: (value) => {
    if (!value.trim()) return 'Nome completo é obrigatório';
    if (value.trim().split(' ').length < 2) return 'Digite seu nome completo';
    return null;
  },
  cep: (value) => {
    if (!value.trim()) return 'CEP é obrigatório';
    if (!/^\d{5}-?\d{3}$/.test(value)) return 'CEP inválido';
    return null;
  },
  street: (value) => (!value.trim() ? 'Rua é obrigatória' : null),
  number: (value) => (!value.trim() ? 'Número é obrigatório' : null),
  complement: () => null,
  neighborhood: (value) => (!value.trim() ? 'Bairro é obrigatório' : null),
  city: (value) => (!value.trim() ? 'Cidade é obrigatória' : null),
  state: (value) => {
    if (!value.trim()) return 'Estado é obrigatório';
    if (value.trim().length !== 2) return 'Estado deve ser UF';
    return null;
  },
};

export const ShippingForm: FC<ShippingFormProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<ShippingFormData>({
    ...INITIAL_STATE,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = useCallback((field: keyof ShippingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};

    (Object.keys(VALIDATORS) as Array<keyof ShippingFormData>).forEach((field) => {
      const validator = VALIDATORS[field];
      const error = validator(formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      if (!validateForm()) {
        setSubmitError('Por favor, corrija os erros no formulário');
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar formulário';
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit, validateForm]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Barra de Progresso */}
      <div className="flex flex-col gap-3 p-4 mb-8">
        <div className="flex gap-6 justify-between text-sm font-medium text-gray-800 dark:text-gray-300">
          <p className="text-primary dark:text-primary/80 font-bold">1. Envio</p>
          <p className="text-gray-400 dark:text-gray-500">2. Pagamento</p>
          <p className="text-gray-400 dark:text-gray-500">3. Revisão</p>
        </div>
        <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-1.5">
          <div className="h-1.5 rounded-full bg-primary" style={{ width: '33%' }}></div>
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-wrap justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-gray-800 dark:text-white text-3xl font-bold leading-tight tracking-tight">
          Informações de Envio
        </p>
      </div>

      {/* Helper Text */}
      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pb-3 pt-4 px-4">
        Já tem uma conta?{' '}
        <a className="text-primary underline" href="/login">
          Faça login
        </a>{' '}
        para um checkout mais rápido.
      </p>

      {/* Erro Global */}
      {submitError && (
        <div className="mx-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{submitError}</p>
        </div>
      )}

      {/* Campos do Formulário */}
      <ShippingFormFields
        data={formData}
        onChange={handleFieldChange}
        errors={errors}
        isLoading={isSubmitting || isLoading}
      />

      {/* Botões de Ação */}
      <div className="flex items-center justify-between mt-8 px-4 pb-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting || isLoading}
          className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary/90 hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao carrinho
        </button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex items-center gap-2"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Processando...
            </>
          ) : (
            'Continuar para Pagamento'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ShippingForm;
