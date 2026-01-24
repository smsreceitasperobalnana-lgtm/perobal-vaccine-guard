import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { TemperatureWidget } from '@/components/dashboard/TemperatureWidget';
import { LotStatusTable } from '@/components/dashboard/LotStatusTable';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { mockLots, mockApplications, mockDashboardStats } from '@/data/mockData';
import { Package, Syringe, AlertTriangle, Calendar, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const lotsNeedingAttention = mockLots.filter(
    (lot) => lot.status === 'critical' || lot.status === 'low'
  );

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Sistema de Gestão de Imunobiológicos - UBS Centro"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Doses Disponíveis"
            value={mockDashboardStats.availableDoses}
            subtitle={`${mockDashboardStats.totalLots} lotes ativos`}
            icon={<Package className="h-6 w-6" />}
          />
          <StatCard
            title="Aplicações Hoje"
            value={mockDashboardStats.applicationsToday}
            icon={<Syringe className="h-6 w-6" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Vencendo em 30 dias"
            value={mockDashboardStats.expiringIn30Days}
            subtitle="Lotes próximos ao vencimento"
            icon={<Calendar className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Estoque Crítico"
            value={mockDashboardStats.criticalStock}
            subtitle="Requer ação imediata"
            icon={<ShieldAlert className="h-6 w-6" />}
            variant="danger"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Temperature Widget and Quick Actions */}
          <div className="space-y-6">
            <TemperatureWidget
              temperature={mockDashboardStats.lastTemperature}
              status={mockDashboardStats.temperatureStatus}
              lastUpdate="08:00"
            />
            <QuickActions />
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <RecentApplications applications={mockApplications} />
          </div>
        </div>

        {/* Lots Table */}
        {lotsNeedingAttention.length > 0 && (
          <LotStatusTable lots={lotsNeedingAttention} />
        )}
      </div>
    </MainLayout>
  );
}
