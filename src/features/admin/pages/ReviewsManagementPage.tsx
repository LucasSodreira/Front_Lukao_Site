import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import AdminTable from '@/features/admin/components/AdminTable';
import type { Column } from '@/features/admin/components/AdminTable';
import AdminSearchBar from '@/features/admin/components/AdminSearchBar';
import { Badge } from '@/ui/Badge';
import { Container } from '@/ui/Container';

interface Review {
  id: string | number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ReviewsManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actioningReviewId, setActioningReviewId] = useState<string | number | null>(null);

  // Mock data - TODO: criar reviewService quando disponível
  const mockReviews: Review[] = [
    {
      id: 1,
      productName: 'Camiseta Premium',
      customerName: 'João Silva',
      rating: 5,
      comment: 'Produto excelente, muito bom mesmo! Recomendo.',
      createdAt: '2024-01-15',
      status: 'pending',
    },
    {
      id: 2,
      productName: 'Calça Jeans',
      customerName: 'Maria Santos',
      rating: 4,
      comment: 'Boa qualidade, mas o tamanho rodou um pouco ao lavar.',
      createdAt: '2024-01-14',
      status: 'approved',
    },
    {
      id: 3,
      productName: 'Jaqueta de Couro',
      customerName: 'Pedro Costa',
      rating: 2,
      comment: 'Não é o que esperava, costura solta em alguns lugares.',
      createdAt: '2024-01-13',
      status: 'pending',
    },
    {
      id: 4,
      productName: 'Tênis Esportivo',
      customerName: 'Ana Oliveira',
      rating: 3,
      comment: 'Confortável, mas o preço está um pouco alto.',
      createdAt: '2024-01-12',
      status: 'rejected',
    },
  ];

  const { data: reviews = mockReviews, isLoading } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: () => Promise.resolve(mockReviews),
  });

  const filtered = reviews.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      r.productName.toLowerCase().includes(term) ||
      r.customerName.toLowerCase().includes(term) ||
      r.comment.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Review['status']): 'success' | 'warning' | 'danger' => {
    const statusMap = {
      approved: 'success' as const,
      pending: 'warning' as const,
      rejected: 'danger' as const,
    };
    return statusMap[status];
  };

  const getStatusLabel = (status: Review['status']): string => {
    const labels = {
      approved: 'Aprovada',
      pending: 'Pendente',
      rejected: 'Rejeitada',
    };
    return labels[status];
  };

  const handleApprove = async (reviewId: string | number) => {
    setActioningReviewId(reviewId);
    // TODO: Integrar com reviewService.approveReview(reviewId)
    console.log('Aprovando avaliação:', reviewId);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setActioningReviewId(null);
  };

  const handleReject = async (reviewId: string | number) => {
    setActioningReviewId(reviewId);
    // TODO: Integrar com reviewService.rejectReview(reviewId)
    console.log('Rejeitando avaliação:', reviewId);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setActioningReviewId(null);
  };

  const columns: Column<Review>[] = [
    { header: 'Produto', accessor: 'productName' },
    { header: 'Cliente', accessor: 'customerName' },
    {
      header: 'Avaliação',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < row.rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
          <span className="ml-2 text-sm font-semibold">{row.rating}/5</span>
        </div>
      ),
    },
    {
      header: 'Comentário',
      accessor: (row) => (
        <div className="max-w-xs truncate text-sm text-gray-600" title={row.comment}>
          {row.comment}
        </div>
      ),
    },
    { header: 'Data', accessor: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={getStatusColor(row.status as Review['status'])}>
          {getStatusLabel(row.status as Review['status'])}
        </Badge>
      ),
    },
    {
      header: 'Ações',
      accessor: (row) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                disabled={actioningReviewId === row.id}
                className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
              >
                {actioningReviewId === row.id ? 'Processando...' : 'Aprovar'}
              </button>
              <button
                onClick={() => handleReject(row.id)}
                disabled={actioningReviewId === row.id}
                className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
              >
                {actioningReviewId === row.id ? 'Processando...' : 'Rejeitar'}
              </button>
            </>
          )}
          {row.status === 'approved' && (
            <button
              onClick={() => handleReject(row.id)}
              disabled={actioningReviewId === row.id}
              className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
            >
              {actioningReviewId === row.id ? 'Processando...' : 'Rejeitar'}
            </button>
          )}
          {row.status === 'rejected' && (
            <button
              onClick={() => handleApprove(row.id)}
              disabled={actioningReviewId === row.id}
              className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
            >
              {actioningReviewId === row.id ? 'Processando...' : 'Aprovar'}
            </button>
          )}
        </div>
      ),
    },
  ];

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Container>
          <Header />

          <div className="mb-6">
            <h1 className="text-3xl font-black">Gerenciamento de Avaliações</h1>
            <p className="text-sm text-gray-500">Aprovar, rejeitar e responder avaliações dos clientes.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <AdminSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por produto, cliente ou comentário..."
            showFilterButton={true}
            onFilter={() => console.log('TODO: Implementar filtros avançados')}
          />

          {/* Status Filter Chips */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Pendentes ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Aprovadas ({stats.approved})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Rejeitadas ({stats.rejected})
            </button>
          </div>

          <AdminTable
            data={filtered}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="Nenhuma avaliação encontrada"
            keyExtractor={(row) => String(row.id)}
          />
        </Container>
      </main>
    </div>
  );
};

export default ReviewsManagementPage;