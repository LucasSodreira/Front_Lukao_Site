import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { ShippingFormFields, type ShippingFormData } from './ShippingFormFields';

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
      {/* Erro Global */}
      {submitError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
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

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting || isLoading}
          className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary/90 hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao carrinho
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-wide min-w-0 px-8 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? 'Processando...' : 'Ir para Revisão'}
        </button>
      </div>
    </form>
  );
};
