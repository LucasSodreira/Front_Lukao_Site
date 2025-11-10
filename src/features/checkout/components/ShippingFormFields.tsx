import type { FC } from 'react';
import { useCallback } from 'react';
import { Input } from '@/ui/Input';

export interface ShippingFormData {
  email: string;
  fullName: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ShippingFormFieldsProps {
  data: ShippingFormData;
  onChange: (field: keyof ShippingFormData, value: string) => void;
  errors?: Partial<Record<keyof ShippingFormData, string>>;
  isLoading?: boolean;
}

const FIELD_CONFIG: Array<{
  field: keyof ShippingFormData;
  label: string;
  placeholder: string;
  type?: string;
  gridCol?: number;
  gridColMd?: number;
  section?: string;
}> = [
  {
    field: 'email',
    label: 'Email',
    placeholder: 'Digite seu email',
    type: 'email',
    section: 'Contato',
  },
  {
    field: 'fullName',
    label: 'Nome Completo',
    placeholder: 'Seu nome completo',
    section: 'Endereço de Entrega',
  },
  {
    field: 'cep',
    label: 'CEP',
    placeholder: '00000-000',
    gridColMd: 1,
  },
  {
    field: 'street',
    label: 'Rua / Avenida',
    placeholder: 'Nome da sua rua',
    gridColMd: 2,
  },
  {
    field: 'number',
    label: 'Número',
    placeholder: 'Ex: 123',
  },
  {
    field: 'complement',
    label: 'Complemento',
    placeholder: 'Apto, Bloco, etc.',
  },
  {
    field: 'neighborhood',
    label: 'Bairro',
    placeholder: 'Seu bairro',
  },
  {
    field: 'city',
    label: 'Cidade',
    placeholder: 'Sua cidade',
    gridColMd: 2,
  },
  {
    field: 'state',
    label: 'Estado',
    placeholder: 'UF',
  },
];

export const ShippingFormFields: FC<ShippingFormFieldsProps> = ({
  data,
  onChange,
  errors = {},
  isLoading = false,
}) => {
  const handleChange = useCallback(
    (field: keyof ShippingFormData, value: string) => {
      onChange(field, value);
    },
    [onChange]
  );

  const renderField = (config: typeof FIELD_CONFIG[0]) => {
    const error = errors[config.field];

    return (
      <div key={config.field} className="flex flex-col">
        <label className="flex flex-col w-full">
          <p className="text-gray-800 dark:text-gray-300 text-sm font-medium leading-normal pb-2">
            {config.label}
          </p>
          <Input
            type={config.type || 'text'}
            placeholder={config.placeholder}
            value={data[config.field]}
            onChange={(e) => handleChange(config.field, e.target.value)}
            disabled={isLoading}
            className={error ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </label>
      </div>
    );
  };

  const contactSection = FIELD_CONFIG.filter((f) => f.section === 'Contato');
  const shippingSection = FIELD_CONFIG.filter((f) => f.section === 'Endereço de Entrega');
  const otherFields = FIELD_CONFIG.filter((f) => !f.section);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Seção: Contato */}
      <>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Contato</h3>
        <div className="grid grid-cols-1 gap-4">
          {contactSection.map((field) => renderField(field))}
        </div>
      </>

      {/* Seção: Endereço de Entrega */}
      <>
        <h3 className="text-lg font-bold text-[#111318] dark:text-white pt-4">Endereço de Entrega</h3>
        <div className="grid grid-cols-1 gap-4">
          {shippingSection.map((field) => renderField(field))}
        </div>
      </>

      {/* Outros Campos */}
      <div className="space-y-4">
        {otherFields.map((field, idx) => {
          if (field.gridCol === 1 && otherFields[idx + 1]?.gridColMd === 2) {
            return (
              <div key={`row-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField(field)}
                {renderField(otherFields[idx + 1])}
              </div>
            );
          }
          if (field.gridCol === 1 || (idx > 0 && otherFields[idx - 1]?.gridCol === 1)) {
            return null;
          }
          return (
            <div key={`field-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderField(field)}
              {otherFields[idx + 1] && !otherFields[idx + 1].gridCol && renderField(otherFields[idx + 1])}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingFormFields;
