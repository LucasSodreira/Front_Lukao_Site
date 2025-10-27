import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]',
  primary: 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
  // success/warning ainda usam paletas utilitárias enquanto não definimos tokens dedicados
  success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
  danger: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]'
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
