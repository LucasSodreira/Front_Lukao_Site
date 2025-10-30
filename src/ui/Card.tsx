import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div
    className={[
      'bg-[color:var(--card)] rounded-[var(--radius)] border border-[color:var(--border)] shadow-sm',
      className,
    ].join(' ')}
    {...props}
  />
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={[ 'p-4 sm:p-6', className ].join(' ')} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', ...props }) => (
  <h3 className={[ 'text-lg font-semibold tracking-tight text-[color:var(--foreground)]', className ].join(' ')} {...props} />
);

export default Card;
