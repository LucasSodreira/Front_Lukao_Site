import React from 'react';
import { Input as BaseInput } from '@/shared/components/ui/input';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || props.name || undefined;
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[color:var(--foreground)] opacity-90"
        >
          {label}
        </label>
      )}
      <BaseInput
        id={inputId}
        className={[
          error ? 'border-[color:var(--destructive)] focus:ring-[color:var(--destructive)]' : '',
          className,
        ].join(' ')}
        {...props}
      />
  {error && <p className="text-sm text-[color:var(--destructive)]">{error}</p>}
    </div>
  );
};

export default Input;
