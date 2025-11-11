import type { FC } from 'react';

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

export const ShippingFormFields: FC<ShippingFormFieldsProps> = ({
  data,
  onChange,
  errors = {},
  isLoading = false,
}) => {
  // Classe completa com TODAS as propriedades essenciais do Tailwind
  const inputClassName = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-base font-normal leading-normal placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900";
  const labelClassName = "text-gray-800 dark:text-gray-300 text-sm font-medium leading-normal pb-2";

  return (
    <div className="flex flex-col gap-6 p-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Contato</h3>

      {/* TextField: Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="flex flex-col w-full">
          <p className={labelClassName}>Email</p>
          <input
            id="email"
            name="email"
            className={inputClassName}
            placeholder="Digite seu email"
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
        </label>
      </div>

      <h3 className="text-lg font-bold text-[#111318] dark:text-white pt-4">
        Endereço de Entrega
      </h3>

      {/* TextField: Full Name */}
      <div className="flex flex-col">
        <label htmlFor="fullName" className="flex flex-col w-full">
          <p className={labelClassName}>Nome Completo</p>
          <input
            id="fullName"
            name="fullName"
            className={inputClassName}
            placeholder="Seu nome completo"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            disabled={isLoading}
            autoComplete="name"
          />
          {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TextField: CEP */}
        <div className="flex flex-col md:col-span-1">
          <label htmlFor="cep" className="flex flex-col w-full">
            <p className={labelClassName}>CEP</p>
            <input
              id="cep"
              name="cep"
              className={inputClassName}
              placeholder="00000-000"
              type="text"
              value={data.cep}
              onChange={(e) => onChange('cep', e.target.value)}
              disabled={isLoading}
              autoComplete="postal-code"
            />
            {errors.cep && <span className="text-red-500 text-xs mt-1">{errors.cep}</span>}
          </label>
        </div>

        {/* TextField: Street */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="street" className="flex flex-col w-full">
            <p className={labelClassName}>Rua / Avenida</p>
            <input
              id="street"
              name="street"
              className={inputClassName}
              placeholder="Nome da sua rua"
              type="text"
              value={data.street}
              onChange={(e) => onChange('street', e.target.value)}
              disabled={isLoading}
              autoComplete="street-address"
            />
            {errors.street && <span className="text-red-500 text-xs mt-1">{errors.street}</span>}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TextField: Number */}
        <div className="flex flex-col">
          <label htmlFor="number" className="flex flex-col w-full">
            <p className={labelClassName}>Número</p>
            <input
              id="number"
              name="number"
              className={inputClassName}
              placeholder="Ex: 123"
              type="text"
              value={data.number}
              onChange={(e) => onChange('number', e.target.value)}
              disabled={isLoading}
            />
            {errors.number && <span className="text-red-500 text-xs mt-1">{errors.number}</span>}
          </label>
        </div>

        {/* TextField: Complement */}
        <div className="flex flex-col">
          <label htmlFor="complement" className="flex flex-col w-full">
            <p className={labelClassName}>Complemento</p>
            <input
              id="complement"
              name="complement"
              className={inputClassName}
              placeholder="Apto, Bloco, etc."
              type="text"
              value={data.complement}
              onChange={(e) => onChange('complement', e.target.value)}
              disabled={isLoading}
              autoComplete="address-line2"
            />
            {errors.complement && <span className="text-red-500 text-xs mt-1">{errors.complement}</span>}
          </label>
        </div>

        {/* TextField: Neighborhood */}
        <div className="flex flex-col">
          <label htmlFor="neighborhood" className="flex flex-col w-full">
            <p className={labelClassName}>Bairro</p>
            <input
              id="neighborhood"
              name="neighborhood"
              className={inputClassName}
              placeholder="Seu bairro"
              type="text"
              value={data.neighborhood}
              onChange={(e) => onChange('neighborhood', e.target.value)}
              disabled={isLoading}
            />
            {errors.neighborhood && <span className="text-red-500 text-xs mt-1">{errors.neighborhood}</span>}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TextField: City */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="city" className="flex flex-col w-full">
            <p className={labelClassName}>Cidade</p>
            <input
              id="city"
              name="city"
              className={inputClassName}
              placeholder="Sua cidade"
              type="text"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              disabled={isLoading}
              autoComplete="address-level2"
            />
            {errors.city && <span className="text-red-500 text-xs mt-1">{errors.city}</span>}
          </label>
        </div>

        {/* TextField: State */}
        <div className="flex flex-col">
          <label htmlFor="state" className="flex flex-col w-full">
            <p className={labelClassName}>Estado</p>
            <input
              id="state"
              name="state"
              className={inputClassName}
              placeholder="UF"
              type="text"
              value={data.state}
              onChange={(e) => onChange('state', e.target.value)}
              disabled={isLoading}
              autoComplete="address-level1"
            />
            {errors.state && <span className="text-red-500 text-xs mt-1">{errors.state}</span>}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingFormFields;
