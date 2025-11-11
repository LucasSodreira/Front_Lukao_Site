interface PaymentMethodTabsProps {
  selected: 'credit_card' | 'pix' | 'boleto';
  onChange: (method: 'credit_card' | 'pix' | 'boleto') => void;
}

export const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({
  selected,
  onChange,
}) => {
  const methods = [
    { id: 'credit_card' as const, label: 'Cartão de Crédito' },
    { id: 'pix' as const, label: 'Pix' },
    { id: 'boleto' as const, label: 'Boleto Bancário' },
  ];

  return (
    <div className="flex h-12 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 p-1.5">
      {methods.map((method) => (
        <label
          key={method.id}
          className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 has-[:checked]:bg-white has-[:checked]:dark:bg-background-dark has-[:checked]:shadow-md has-[:checked]:text-primary text-[#4e6797] dark:text-gray-400 text-sm font-bold"
        >
          <span className="truncate">{method.label}</span>
          <input
            className="invisible w-0"
            name="payment-method"
            type="radio"
            value={method.id}
            checked={selected === method.id}
            onChange={() => onChange(method.id)}
          />
        </label>
      ))}
    </div>
  );
};
