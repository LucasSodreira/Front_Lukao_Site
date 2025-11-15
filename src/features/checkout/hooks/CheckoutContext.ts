import { createContext } from 'react';

export interface ShippingAddress {
  email: string;
  fullName: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'pix' | 'boleto';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  installments?: number;
  saveCard?: boolean;
  paymentIntentId?: string;
}

export type CheckoutStep = 'address' | 'review' | 'payment' | null;

export interface CheckoutContextType {
  shippingAddress: ShippingAddress | null;
  selectedAddressId: string | null;
  paymentInfo: PaymentInfo | null;
  orderId: string | null;
  currentStep: CheckoutStep;
  setShippingAddress: (address: ShippingAddress) => void;
  setSelectedAddressId: (id: string | null) => void;
  setPaymentInfo: (payment: PaymentInfo) => void;
  setOrderId: (id: string) => void;
  setCurrentStep: (step: CheckoutStep) => void;
  canAccessStep: (step: CheckoutStep) => boolean;
  clearCheckout: () => void;
  resetCheckout: () => void;
}

export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);
