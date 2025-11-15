import { useAuth } from '@/shared/hooks';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import { AddressList, ProfileLayout } from '@/features/profile/components';
import { Button } from '@/ui/Button';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    return (
      <div className="text-center space-y-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <div className="text-gray-600 dark:text-gray-300">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/profile/orders')}>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-sm">Meus Pedidos</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ver histórico de compras</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-sm">Endereços</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar endereços</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-sm">Configurações</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">Preferências da conta</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

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
    </ProfileLayout>
  );
};

export default ProfilePage;
