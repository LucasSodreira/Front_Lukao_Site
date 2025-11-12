import { useAuth } from '@/shared/hooks';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import { AddressList } from '@/features/profile/components';
import { Button } from '@/ui/Button';
import { logger } from '@/utils';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-gray-600 dark:text-gray-300">Você precisa estar logado para ver seu perfil</div>
        <Button onClick={() => window.location.href = '/login'}>
          Ir para Login
        </Button>
      </div>
    );
  }

  if (!user) {
    logger.error('Usuário não encontrado');
    return (
      <div className="text-center space-y-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <div className="text-gray-600 dark:text-gray-300">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Meu Perfil</h1>

      <Card>
        <CardBody>
          <CardTitle>Informações Pessoais</CardTitle>
          <div className="mt-2 grid gap-1 text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Nome:</span> {user.name}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Email:</span> {user.email}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Telefone:</span> {user.phone || 'Não informado'}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Função:</span> {user.role}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Status:</span> {user.status}</p>
          </div>
        </CardBody>
      </Card>

      <AddressList />
    </div>
  );
};

export default ProfilePage;
