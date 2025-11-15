import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
}

const Container: React.FC<ContainerProps> = ({ children, className = '', maxWidth = '7xl' }) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
