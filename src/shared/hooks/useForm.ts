/**
 * Hook para gerenciar estado com validação
 */

import { useState, useCallback } from 'react';

interface UseFormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
}

interface UseFormHandlers<T> {
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit?: (values: T) => Promise<void>
): [UseFormState<T>, UseFormHandlers<T>, (e: React.FormEvent) => Promise<void>] => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Erro ao submeter formulário:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, onSubmit]
  );

  const state: UseFormState<T> = { values, errors, touched, isSubmitting };
  const handlers: UseFormHandlers<T> = {
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    setIsSubmitting,
  };

  return [state, handlers, handleSubmit];
};
