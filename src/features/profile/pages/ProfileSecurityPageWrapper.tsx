import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';
import { Button } from '@/ui/Button';
import { ProfileLayout } from '@/features/profile/components';
import SecurityPage from './ProfileSecurityPage';

const SecurityPageWrapper = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-gray-600 dark:text-gray-300">
          Você precisa estar logado para acessar segurança
        </div>
        <Button onClick={() => window.location.href = '/login'}>
          Ir para Login
        </Button>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
        >
          Minha Conta
        </button>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
        >
          Meus Dados
        </button>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
        <span className="text-gray-800 dark:text-white text-sm font-medium">Segurança</span>
      </div>

      <div className="mb-8">
        <h1 className="text-gray-800 dark:text-white text-3xl md:text-4xl font-black tracking-tighter">
          Segurança
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie as configurações de segurança da sua conta.
        </p>
      </div>

      <SecurityPage />
    </ProfileLayout>
  );
};

export default SecurityPageWrapper;
