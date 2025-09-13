import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const base = 'inline-flex items-center justify-center font-medium rounded-lg transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950';

const variants: Record<Variant, string> = {
  primary: 'bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white',
  secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  full,
  className = '',
  children,
  ...props
}) => {
  const width = full ? 'w-full' : '';
  return (
    <button className={[base, variants[variant], sizes[size], width, className].join(' ')} {...props}>
      {children}
    </button>
  );
};

export default Button;
