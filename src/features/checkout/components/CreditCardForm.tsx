import { useState } from 'react';

export interface CreditCardData {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  installments: number;
  saveCard: boolean;
}

interface CreditCardFormProps {
  onSubmit: (data: CreditCardData) => void;
  totalAmount: number;
  isLoading?: boolean;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onSubmit,
  totalAmount,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreditCardData>({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    installments: 1,
    saveCard: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const installmentOptions = [
    { value: 1, label: `1x de R$ ${totalAmount.toFixed(2)} (sem juros)` },
    { value: 2, label: `2x de R$ ${(totalAmount / 2).toFixed(2)} (sem juros)` },
    { value: 3, label: `3x de R$ ${(totalAmount / 3).toFixed(2)} (sem juros)` },
    { value: 4, label: `4x de R$ ${(totalAmount / 4).toFixed(2)} (com juros)` },
  ];

  const inputClassName = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClassName = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
        Pague com cartão de crédito com aprovação imediata.
      </p>
        {/* Número do Cartão */}
        <div>
          <label className={labelClassName} htmlFor="cardNumber">
            Número do Cartão
          </label>
          <input
            className={inputClassName}
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            type="text"
            value={formData.cardNumber}
            onChange={(e) =>
              setFormData({ ...formData, cardNumber: e.target.value })
            }
            disabled={isLoading}
            required
          />
        </div>

        {/* Nome no Cartão */}
        <div>
          <label className={labelClassName} htmlFor="cardName">
            Nome impresso no cartão
          </label>
          <input
            className={inputClassName}
            id="cardName"
            placeholder="Seu nome completo"
            type="text"
            value={formData.cardName}
            onChange={(e) =>
              setFormData({ ...formData, cardName: e.target.value })
            }
            disabled={isLoading}
            required
          />
        </div>

        {/* Validade e CVV */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={labelClassName} htmlFor="cardExpiry">
              Validade (MM/AA)
            </label>
            <input
              className={inputClassName}
              id="cardExpiry"
              placeholder="MM/AA"
              type="text"
              value={formData.cardExpiry}
              onChange={(e) =>
                setFormData({ ...formData, cardExpiry: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="cardCvv">
              CVV
            </label>
            <input
              className={inputClassName}
              id="cardCvv"
              placeholder="123"
              type="text"
              maxLength={4}
              value={formData.cardCvv}
              onChange={(e) =>
                setFormData({ ...formData, cardCvv: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Parcelamento */}
        <div>
          <label className={labelClassName} htmlFor="installments">
            Parcelamento
          </label>
          <select
            className={inputClassName}
            id="installments"
            value={formData.installments}
            onChange={(e) =>
              setFormData({
                ...formData,
                installments: parseInt(e.target.value),
              })
            }
            disabled={isLoading}
          >
            {installmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Salvar Cartão */}
        <div className="flex items-center pt-2">
          <input
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="saveCard"
            type="checkbox"
            checked={formData.saveCard}
            onChange={(e) =>
              setFormData({ ...formData, saveCard: e.target.checked })
            }
            disabled={isLoading}
          />
          <label
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            htmlFor="saveCard"
          >
            Salvar cartão para compras futuras
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold text-base tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">credit_card</span>
                Finalizar compra
              </>
            )}
          </button>
        </div>
      </form>
  );
};
