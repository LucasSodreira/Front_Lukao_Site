/**
 * Tipos de domínio de Checkout
 */

export interface GuestAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GuestOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  trackingToken: string;
  items: Array<{
    product: {
      title: string;
    };
    quantity: number;
    totalPrice: number;
  }>;
  createdAt?: string;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
}

export interface StripePaymentResponse {
  success: boolean;
  message: string;
  orderId: string;
  paymentIntentId: string;
  status: string;
  amount: number;
}

export interface CheckoutState {
  step: 'address' | 'payment' | 'confirmation';
  order: GuestOrder | null;
  paymentIntent: PaymentIntentResponse | null;
  loading: boolean;
  error: string | null;
}

export interface CheckoutContextType {
  state: CheckoutState;
  setOrder: (order: GuestOrder) => void;
  setPaymentIntent: (intent: PaymentIntentResponse) => void;
  setStep: (step: CheckoutState['step']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
