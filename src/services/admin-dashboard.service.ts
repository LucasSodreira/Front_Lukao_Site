import { authenticatedFetch } from './http-interceptor';

export interface DashboardSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  monthlyOrders: number;
  ordersGrowth: number;
  averageTicket: number;
  totalCustomers: number;
  activeCustomers: number;
  pendingOrders: number;
}

export interface SalesPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: number;
  title: string;
  unitsSold: number;
  revenue: number;
  imageUrl?: string;
}

export interface RecentOrder {
  id: number;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  addressSummary: string;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  salesTrend: SalesPoint[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

class AdminDashboardService {
  private readonly baseUrl = '/api/admin/dashboard';

  async getOverview(): Promise<DashboardOverview> {
    const response = await authenticatedFetch(this.baseUrl);
    if (!response.ok) throw new Error('Erro ao buscar dashboard');
    return response.json();
  }
}

export const adminDashboardService = new AdminDashboardService();
