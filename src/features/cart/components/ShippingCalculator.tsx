import { useState } from 'react';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  selected?: boolean;
}

interface ShippingCalculatorProps {
  onShippingChange?: (option: ShippingOption) => void;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ onShippingChange }) => {
  const [zipCode, setZipCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [selectedShipping, setSelectedShipping] = useState<string>('pac');
  const shippingOptions: ShippingOption[] = [
    { id: 'pac', name: 'PAC', description: '7 dias úteis', price: 15.0, selected: true },
    { id: 'sedex', name: 'Sedex', description: '3 dias úteis', price: 25.0 },
  ];

  const handleCalculateShipping = () => {
    // Simular cálculo de frete
    console.log('Calculando frete para CEP:', zipCode);
    // Aqui você pode fazer a integração com API de frete real
  };

  const handleApplyCoupon = () => {
    // Simular aplicação de cupom
    console.log('Aplicando cupom:', couponCode);
    // Aqui você pode fazer a integração com API de cupons
  };

  const handleShippingSelect = (optionId: string) => {
    setSelectedShipping(optionId);
    const option = shippingOptions.find((opt) => opt.id === optionId);
    if (option && onShippingChange) {
      onShippingChange(option);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="space-y-4">
        {/* Cupom de Desconto */}
        <div>
          <label
            className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2"
            htmlFor="coupon"
          >
            Cupom de Desconto
          </label>
          <div className="flex gap-2">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-11 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
              id="coupon"
              placeholder="Insira seu cupom"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              onClick={handleApplyCoupon}
              className="flex-shrink-0 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold tracking-wide min-w-0 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Calcular Frete */}
        <div className="!mt-6">
          <label
            className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2"
            htmlFor="shipping"
          >
            Calcular Frete
          </label>
          <div className="flex gap-2">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-11 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
              id="shipping"
              placeholder="Insira seu CEP"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={9}
            />
            <button
              onClick={handleCalculateShipping}
              className="flex-shrink-0 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold tracking-wide min-w-0 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Calcular
            </button>
          </div>
        </div>

        {/* Opções de Frete */}
        <div className="space-y-4 pt-2">
          {shippingOptions.map((option) => {
            const isSelected = selectedShipping === option.id;
            return (
              <div
                key={option.id}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  isSelected
                    ? 'border-2 border-primary bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                    : 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30'
                }`}
              >
                <input
                  className="form-radio h-5 w-5 text-primary focus:ring-primary/50 border-gray-400 dark:border-gray-500 bg-transparent dark:checked:bg-primary"
                  id={option.id}
                  name="shipping-option"
                  type="radio"
                  checked={isSelected}
                  onChange={() => handleShippingSelect(option.id)}
                />
                <label
                  className="flex justify-between items-center w-full cursor-pointer"
                  htmlFor={option.id}
                >
                  <span className="text-sm">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {option.name}
                    </span>
                    <br />
                    <span className="text-gray-500 dark:text-gray-400">
                      {option.description}
                    </span>
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white text-sm">
                    {option.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculator;
