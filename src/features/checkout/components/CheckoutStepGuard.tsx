import { Navigate } from 'react-router-dom';
import { useCheckoutState, type CheckoutStep } from '../hooks';

interface CheckoutStepGuardProps {
  step: CheckoutStep;
  children: React.ReactNode;
}

/**
 * Guard para proteger etapas individuais do checkout
 * Verifica se o usuário tem permissão para acessar uma etapa específica
 * 
 * Fluxo permitido:
 * - address: sempre permitido (primeira etapa)
 * - payment: requer endereço preenchido
 * - review: requer endereço + pagamento preenchidos
 */
export const CheckoutStepGuard = ({ step, children }: CheckoutStepGuardProps) => {
  const { canAccessStep } = useCheckoutState();

  if (!canAccessStep(step)) {
    // Se a etapa não é acessível, redireciona para a primeira etapa válida
    if (step === 'payment' || step === 'review') {
      return <Navigate to="/checkout/address" replace />;
    }
    // Se tentar acessar algo inválido, volta para o carrinho
    return <Navigate to="/cart" replace />;
  }

  return <>{children}</>;
};
