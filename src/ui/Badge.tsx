import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  primary: 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900',
  success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
};

export const Badge: React.FC<{
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}> = ({ variant = 'default', className = '', children }) => (
  <span className={[
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
    variants[variant],
    className,
  ].join(' ')}>
    {children}
  </span>
);

export default Badge;
