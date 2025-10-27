import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries';
import type { User } from '../types';
import { Card, CardBody, CardTitle } from '../ui/Card';
import AddressList from '../components/AddressList';

interface MeQueryResult {
  me: User;
}

const Profile = () => {
  const { loading: userLoading, error: userError, data: userData } = useQuery<MeQueryResult>(GET_ME);

  if (userLoading) return <div className="text-gray-600 dark:text-gray-300">Carregando perfil...</div>;
  if (userError) return <div className="text-red-600">Erro ao carregar perfil: {userError.message}</div>;

  const user = userData?.me;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Meu Perfil</h1>

      <Card>
        <CardBody>
          <CardTitle>Informações Pessoais</CardTitle>
          <div className="mt-2 grid gap-1 text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Nome:</span> {user?.name}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Email:</span> {user?.email}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Telefone:</span> {user?.phone || 'Não informado'}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Função:</span> {user?.role}</p>
            <p><span className="font-medium text-gray-900 dark:text-gray-100">Status:</span> {user?.status}</p>
          </div>
        </CardBody>
      </Card>

      <AddressList />
    </div>
  );
};

export default Profile;
