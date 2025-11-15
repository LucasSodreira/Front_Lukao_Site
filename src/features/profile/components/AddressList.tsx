import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addressService } from '@/services';
import type { Address as AddressDTO } from '@/services/address.service';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import { Button } from '@/ui/Button';
import AddressModal from './AddressModal';

const AddressList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDTO | undefined>();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { data: addresses = [], isLoading, error, refetch } = useQuery<AddressDTO[]>({
    queryKey: ['myAddresses'],
    queryFn: addressService.getMyAddresses,
  });

  const handleAddNew = () => {
    setSelectedAddress(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (address: AddressDTO) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (deletingIds.has(id)) return; // Previne cliques múltiplos
    if (!confirm('Tem certeza que deseja deletar este endereço?')) return;

    // Marca como "deletando"
    setDeletingIds(prev => new Set(prev).add(id));

    try {
      await addressService.deleteAddress(id);

      
      // Aguardar um pouco antes de refazer a consulta
      await new Promise(resolve => setTimeout(resolve, 300));
      await refetch();
    } catch (err: unknown) {
      
      // Verificar se é um erro de integridade de dados
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      if (errorMessage.includes('sendo utilizado em pedidos') || 
          errorMessage.includes('DATA_INTEGRITY_ERROR') ||
          errorMessage.includes('foreign key constraint')) {
        alert(
          'Este endereço não pode ser deletado pois está sendo utilizado em pedidos existentes.\n\n' +
          'Para removê-lo, primeiro cancele ou atualize os pedidos relacionados.'
        );
      } else {
        alert(`Erro ao deletar endereço: ${errorMessage}`);
      }
    } finally {
      // Remove do set de "deletando"
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await addressService.setPrimaryAddress(id);
      refetch();
    } catch  {
      alert('Erro ao definir endereço principal');
    }
  };

  if (isLoading) return <div className="text-gray-600 dark:text-gray-300">Carregando endereços...</div>;

  return (
    <>
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Endereços</CardTitle>
            <Button onClick={handleAddNew} variant="secondary" className="text-sm">
              + Adicionar
            </Button>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">Erro ao carregar endereços</p>}

          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">Nenhum endereço cadastrado</p>
              <Button onClick={handleAddNew}>Adicionar Primeiro Endereço</Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="mb-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{address.street}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {address.city} - {address.state}, {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{address.country}</p>
                  </div>

                  {address.primary && (
                    <div className="inline-block mb-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-xs px-2 py-1">
                      Endereço Principal
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {!address.primary && (
                      <button
                        onClick={() => handleSetPrimary(address.id)}
                        className="flex-1 text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition"
                      >
                        Definir Principal
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex-1 text-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
                    >
                      Editar
                    </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                      disabled={deletingIds.has(address.id)}
                      className="flex-1 text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingIds.has(address.id) ? 'Deletando...' : 'Deletar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAddress(undefined);
        }}
        onSuccess={() => {
          refetch();
        }}
        address={selectedAddress}
      />
    </>
  );
};

export default AddressList;
