import { useContext } from 'react';
import { CheckoutContext } from './CheckoutContext';

export function useCheckoutState() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckoutState deve ser usado dentro de CheckoutProvider');
  }
  return context;
}
