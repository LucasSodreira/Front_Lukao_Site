import React from 'react';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import StatsCards from '@/features/admin/components/StatsCards';
import ChartArea from '@/features/admin/components/ChartArea';
import TopSelling from '@/features/admin/components/TopSelling';
import RecentOrders from '@/features/admin/components/RecentOrders';

const DashboardPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Header />
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartArea />
            </div>
            <TopSelling />
          </div>

          <RecentOrders />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
