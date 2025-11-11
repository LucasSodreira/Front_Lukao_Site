import { useState, type ReactNode, useCallback, useEffect } from 'react';
import { 
  STORAGE_KEYS, 
  loadFromStorage, 
  saveToStorage, 
  isCheckoutExpired, 
  clearCheckoutStorage 
} from './checkoutStorage';
import { 
  CheckoutContext, 
  type CheckoutContextType, 
  type CheckoutStep,
  type ShippingAddress,
  type PaymentInfo
} from './CheckoutContext';

interface CheckoutProviderProps {
  children: ReactNode;
}

export function CheckoutProvider({ children }: CheckoutProviderProps) {
  // Inicializar estado a partir do sessionStorage
  const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(() => {
    if (isCheckoutExpired()) {
      clearCheckoutStorage();
      return null;
    }
    return loadFromStorage<ShippingAddress | null>(STORAGE_KEYS.SHIPPING, null);
  });

  const [selectedAddressId, setSelectedAddressIdState] = useState<string | null>(() => {
    if (isCheckoutExpired()) {
      clearCheckoutStorage();
      return null;
    }
    return loadFromStorage<string | null>(STORAGE_KEYS.ADDRESS_ID, null);
  });

  const [paymentInfo, setPaymentInfoState] = useState<PaymentInfo | null>(() => {
    if (isCheckoutExpired()) {
      clearCheckoutStorage();
      return null;
    }
    return loadFromStorage<PaymentInfo | null>(STORAGE_KEYS.PAYMENT, null);
  });

  const [orderId, setOrderIdState] = useState<string | null>(() => {
    if (isCheckoutExpired()) {
      clearCheckoutStorage();
      return null;
    }
    return loadFromStorage<string | null>(STORAGE_KEYS.ORDER_ID, null);
  });

  const [currentStep, setCurrentStepState] = useState<CheckoutStep>(() => {
    if (isCheckoutExpired()) {
      clearCheckoutStorage();
      return null;
    }
    return loadFromStorage<CheckoutStep>(STORAGE_KEYS.STEP, null);
  });

  // Atualizar timestamp quando o checkout começar
  useEffect(() => {
    if (shippingAddress || paymentInfo || currentStep) {
      saveToStorage(STORAGE_KEYS.TIMESTAMP, Date.now());
    }
  }, [shippingAddress, paymentInfo, currentStep]);

  // Funções para atualizar estado e persistir no sessionStorage
  const setShippingAddress = useCallback((address: ShippingAddress) => {
    setShippingAddressState(address);
    saveToStorage(STORAGE_KEYS.SHIPPING, address);
    saveToStorage(STORAGE_KEYS.TIMESTAMP, Date.now());
  }, []);

  const setSelectedAddressId = useCallback((id: string | null) => {
    setSelectedAddressIdState(id);
    if (id) {
      saveToStorage(STORAGE_KEYS.ADDRESS_ID, id);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADDRESS_ID);
    }
    saveToStorage(STORAGE_KEYS.TIMESTAMP, Date.now());
  }, []);

  const setPaymentInfo = useCallback((payment: PaymentInfo) => {
    setPaymentInfoState(payment);
    saveToStorage(STORAGE_KEYS.PAYMENT, payment);
    saveToStorage(STORAGE_KEYS.TIMESTAMP, Date.now());
  }, []);

  const setOrderId = useCallback((id: string) => {
    setOrderIdState(id);
    saveToStorage(STORAGE_KEYS.ORDER_ID, id);
    saveToStorage(STORAGE_KEYS.TIMESTAMP, Date.now());
  }, []);

  const setCurrentStep = useCallback((step: CheckoutStep) => {
    setCurrentStepState(step);
    if (step) {
      saveToStorage(STORAGE_KEYS.STEP, step);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.STEP);
    }
    saveToStorage(STORAGE_KEYS.TIMESTAMP, Date.now());
  }, []);

  // Verificar se pode acessar uma etapa específica
  const canAccessStep = useCallback((step: CheckoutStep): boolean => {
    if (!step) return true;

    switch (step) {
      case 'address':
        return true; // Sempre pode acessar a primeira etapa
      case 'review':
        return !!shippingAddress; // Precisa ter endereço para acessar revisão
      case 'payment':
        return !!shippingAddress && !!paymentInfo; // Precisa ter endereço e dados da revisão para pagamento
      default:
        return false;
    }
  }, [shippingAddress, paymentInfo]);

  // Limpar dados de checkout (chamado após sucesso)
  const clearCheckout = useCallback(() => {
    setShippingAddressState(null);
    setSelectedAddressIdState(null);
    setPaymentInfoState(null);
    setOrderIdState(null);
    setCurrentStepState(null);

    clearCheckoutStorage();
  }, []);

  // Resetar checkout (mantém dados mas limpa etapa - para navegação)
  const resetCheckout = useCallback(() => {
    setCurrentStepState(null);
    sessionStorage.removeItem(STORAGE_KEYS.STEP);
  }, []);

  const value: CheckoutContextType = {
    shippingAddress,
    selectedAddressId,
    paymentInfo,
    orderId,
    currentStep,
    setShippingAddress,
    setSelectedAddressId,
    setPaymentInfo,
    setOrderId,
    setCurrentStep,
    canAccessStep,
    clearCheckout,
    resetCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}
