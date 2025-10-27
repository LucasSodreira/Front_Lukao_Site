import React from 'react';

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={[ 'w-full mx-auto max-w-8xl px-4 sm:px-6 lg:px-8', className ].join(' ')} {...props} />
);

export default Container;
