import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import AdminTable from '@/features/admin/components/AdminTable';
import type { Column } from '@/features/admin/components/AdminTable';
import AdminSearchBar from '@/features/admin/components/AdminSearchBar';
import { catalogService } from '@/services';
import { Container } from '@/ui/Container';
import type { Product } from '@/types/domain/product';

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const { data = [], isLoading } = useQuery({ queryKey: ['adminProducts'], queryFn: () => catalogService.getProducts() });

  const filtered = data.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.title?.toLowerCase().includes(term);
  });

  const columns: Column<Product>[] = [
    { header: 'Produto', accessor: 'title' },
    { header: 'Preço', accessor: (row) => `R$ ${row.price}` },
    { header: 'Estoque', accessor: (row) => row.inventory ?? '—' },
    { header: 'Categoria', accessor: (row) => row.category?.name || '—' },
    {
      header: 'Ações',
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/${row.id}`);
            }}
            className="px-3 py-1 rounded bg-white border hover:bg-gray-50"
          >
            Editar
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8">
        <Container>
          <Header />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black">Gerenciamento de Produtos</h1>
              <p className="text-sm text-gray-500">Adicione, edite e gerencie o estoque dos seus produtos</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin/products/create')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Adicionar Produto
              </button>
              <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-white' : 'bg-white border'}`}>Grid</button>
              <button onClick={() => setView('table')} className={`p-2 rounded ${view === 'table' ? 'bg-primary text-white' : 'bg-white border'}`}>Tabela</button>
            </div>
          </div>

          <AdminSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar produtos por nome..."
            onFilter={() => console.log('TODO: Implementar filtros')}
            onExport={() => console.log('TODO: Implementar exportação')}
          />

          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading && (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
              {!isLoading && filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Nenhum produto encontrado
                </div>
              )}
              {!isLoading && filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/admin/products/${p.id}`)}
                  className="rounded-lg p-4 border bg-white hover:shadow-md cursor-pointer transition-shadow"
                >
                  <img src={(p.images && p.images[0]?.url) || 'https://via.placeholder.com/280'} className="w-full h-40 object-cover rounded" alt={p.title} />
                  <h3 className="mt-2 font-bold">{p.title}</h3>
                  <p className="text-sm text-gray-500">R$ {p.price}</p>
                  <p className="text-xs text-gray-400 mt-1">Estoque: {p.inventory ?? '—'}</p>
                </div>
              ))}
            </div>
          ) : (
            <AdminTable
              data={filtered}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="Nenhum produto encontrado"
              keyExtractor={(row) => String(row.id)}
              onRowClick={(row) => navigate(`/admin/products/${row.id}`)}
            />
          )}
        </Container>
      </main>
    </div>
  );
};

export default ProductManagementPage;