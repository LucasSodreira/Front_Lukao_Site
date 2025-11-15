import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/features/admin/components/Sidebar';
import { adminCustomerService } from '@/services';
import { formatCurrency, formatDate } from '@/utils';

const EditCustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);
  
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => adminCustomerService.getCustomer(customerId),
    enabled: !!customerId,
  });

  const [formData, setFormData] = useState({
    name: 'Jorge Amado',
    email: 'jorge.amado@email.com',
    phone: '(71) 99999-8888',
    cpf: '123.456.789-00',
    isActive: true,
    zipCode: '41820-021',
    street: 'Avenida Tancredo Neves',
    number: '123',
    complement: 'Apto 404',
    neighborhood: 'Caminho das Árvores',
    city: 'Salvador',
    state: 'BA',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar salvamento via API
    console.log('salvando', formData);
  };

  const handleCancel = () => {
    navigate('/admin/customers');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-row bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2">
            <a className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary" href="/admin">
              Dashboard
            </a>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">/</span>
            <a className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary" href="/admin/customers">
              Clientes
            </a>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">/</span>
            <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Editar Cliente</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-72 flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Jorge+Amado&background=195de6&color=fff")' }}></div>
                <div>
                  <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Editar Cliente: {formData.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                    Altere as informações do perfil, endereço e consulte o histórico de compras.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 text-slate-800 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <span className="truncate">Cancelar</span>
              </button>
              <button
                type="submit"
                form="customer-form"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
              >
                <span className="truncate">Salvar Alterações</span>
              </button>
            </div>
          </div>

          <form id="customer-form" onSubmit={handleSave} className="flex flex-col gap-8">
            {/* Dados Pessoais */}
            <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Dados Pessoais</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  Informações básicas e de contato do cliente.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Nome Completo</p>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">E-mail</p>
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Telefone</p>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">CPF</p>
                  <input
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">Status da Conta</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Controle se o cliente pode fazer login.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:bg-slate-700 dark:border-slate-600 dark:peer-focus:ring-primary/80"></div>
                  <span className="ms-3 text-sm font-medium text-slate-900 dark:text-slate-300">Ativo</span>
                </label>
              </div>
            </div>

            {/* Endereço Principal */}
            <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Endereço Principal</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  Endereço de entrega principal do cliente.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <label className="flex flex-col min-w-40 flex-1 sm:col-span-2 lg:col-span-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">CEP</p>
                  <input
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1 sm:col-span-2">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Rua</p>
                  <input
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Número</p>
                  <input
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Complemento</p>
                  <input
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Bairro</p>
                  <input
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Cidade</p>
                  <input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Estado</p>
                  <input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white focus:border-primary h-11 placeholder:text-slate-400 p-3 text-base font-normal leading-normal dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary"
                  />
                </label>
              </div>
            </div>

            {/* Segurança */}
            <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Segurança</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  Gerencie as opções de segurança da conta do cliente.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">Redefinição de Senha</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Um e-mail será enviado ao cliente com instruções para criar uma nova senha.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent text-primary text-sm font-bold leading-normal tracking-[0.015em] gap-2 border border-primary hover:bg-primary/10"
                >
                  <span className="material-symbols-outlined">lock_reset</span>
                  <span className="truncate">Redefinir Senha</span>
                </button>
              </div>
            </div>

            {/* Histórico do Cliente */}
            <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Histórico do Cliente</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  Resumo de compras e lista de pedidos realizados.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl">payments</span>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Total Gasto</p>
                    <p className="text-slate-900 dark:text-white text-xl font-bold">{customer?.totalSpent ? formatCurrency(customer.totalSpent) : 'R$ 0,00'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl">shopping_cart</span>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Total de Pedidos</p>
                    <p className="text-slate-900 dark:text-white text-xl font-bold">{customer?.ordersCount || 0}</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-3" scope="col">ID do Pedido</th>
                      <th className="px-6 py-3" scope="col">Data</th>
                      <th className="px-6 py-3" scope="col">Status</th>
                      <th className="px-6 py-3 text-right" scope="col">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-white">#3058</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">15 de Jun, 2024</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          Entregue
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300">R$ 299,90</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditCustomerPage;
