import React from 'react';

export interface AdminFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  accept?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  helpText?: string;
}

export interface AdminFormProps {
  fields: AdminFormField[];
  values: Record<string, unknown>;
  errors?: Record<string, string>;
  onChange: (name: string, value: unknown) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const AdminForm: React.FC<AdminFormProps> = ({
  fields,
  values,
  errors = {},
  onChange,
  onSubmit,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  onCancel,
  isSubmitting = false,
}) => {
  const renderField = (field: AdminFormField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required,
      disabled: field.disabled || isSubmitting,
      className: `form-input flex w-full resize-none rounded-lg text-gray-900 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
        errors[field.name] 
          ? 'border-red-500 dark:border-red-500' 
          : 'border-gray-300 dark:border-gray-700'
      } bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-sm font-normal leading-normal transition-colors`,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 4}
            value={String(values[field.name] || '')}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${commonProps.className} py-3`}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={String(values[field.name] || '')}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`${commonProps.className} h-12`}
          >
            <option value="">Selecione...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            {...commonProps}
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const files = e.target.files;
              onChange(field.name, files?.[0] || null);
            }}
            className={`${commonProps.className} py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90`}
          />
        );

      case 'checkbox':
        return (
          <input
            {...commonProps}
            type="checkbox"
            checked={Boolean(values[field.name])}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="h-5 w-5 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-primary/50"
          />
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            value={String(values[field.name] || '')}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${commonProps.className} h-12`}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            value={String(values[field.name] || '')}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${commonProps.className} h-12`}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div 
            key={field.name} 
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          >
            <label
              htmlFor={field.name}
              className="block text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {field.helpText && (
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                {field.helpText}
              </p>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 px-6 h-10 text-sm font-semibold text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center rounded-lg bg-primary px-6 h-10 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Salvando...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;
