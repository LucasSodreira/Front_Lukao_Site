import { useQuery } from '@apollo/client/react';
import { GET_ME, GET_MY_ADDRESSES } from '../graphql/queries';
import type { User, Address } from '../types';
import { Card, CardBody, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

interface MeQueryResult {
  me: User;
}

interface AddressesQueryResult {
  myAddresses: Address[];
}

const Profile = () => {
  const { loading: userLoading, error: userError, data: userData } = useQuery<MeQueryResult>(GET_ME);
  const { loading: addressesLoading, error: addressesError, data: addressesData } = useQuery<AddressesQueryResult>(GET_MY_ADDRESSES);

  if (userLoading || addressesLoading) return <div className="text-gray-600 dark:text-gray-300">Carregando perfil...</div>;
  if (userError) return <div className="text-red-600">Erro ao carregar perfil: {userError.message}</div>;

  const user = userData?.me;
  const addresses = addressesData?.myAddresses || [];

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

      <Card>
        <CardBody>
          <CardTitle>Endereços</CardTitle>
          {addressesError && <p className="text-sm text-red-600">Erro ao carregar endereços: {addressesError.message}</p>}
          {addresses.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300">Nenhum endereço cadastrado</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardBody>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{address.street}, {address.city} - {address.state}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">CEP: {address.zipCode}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{address.country}</p>
                    {address.primary && <span className="inline-flex mt-2 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-0.5">Principal</span>}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-3">
            <Button variant="secondary">Adicionar Endereço</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
