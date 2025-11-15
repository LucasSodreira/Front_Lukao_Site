import { useAuth } from '@/shared/hooks';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';
import { ProfileLayout } from '@/features/profile/components';
import UserDataForm from '@/features/profile/components/UserDataForm';

const ProfileDataPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-gray-600 dark:text-gray-300">
          Você precisa estar logado para ver seu perfil
        </div>
        <Button onClick={() => window.location.href = '/login'}>
          Ir para Login
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <div className="text-gray-600 dark:text-gray-300">Carregando perfil...</div>
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
        <span className="text-gray-800 dark:text-white text-sm font-medium">Meus Dados</span>
      </div>

      <div className="mb-8">
        <h1 className="text-gray-800 dark:text-white text-3xl md:text-4xl font-black tracking-tighter">
          Meus Dados
        </h1>
      </div>

      <UserDataForm user={user} onSuccess={() => {
        // Reload user data from context
      }} />
    </ProfileLayout>
  );
};

export default ProfileDataPage;
