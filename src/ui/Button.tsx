import React from 'react';
import { Button as BaseButton } from '../components/ui/button';

type LegacyVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type LegacySize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LegacyVariant;
  size?: LegacySize;
  full?: boolean;
}

const mapVariant = (v: LegacyVariant | undefined): 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' => {
  switch (v) {
    case 'secondary':
      return 'secondary';
    case 'danger':
      return 'destructive';
    case 'ghost':
      return 'ghost';
    case 'primary':
    default:
      return 'default';
  }
};

const mapSize = (s: LegacySize | undefined): 'default' | 'sm' | 'lg' | 'icon' => {
  switch (s) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    case 'md':
    default:
      return 'default';
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  full,
  className = '',
  children,
  ...props
}) => {
  return (
    <BaseButton
      variant={mapVariant(variant)}
      size={mapSize(size)}
      className={[full ? 'w-full' : '', className].join(' ')}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

export default Button;
