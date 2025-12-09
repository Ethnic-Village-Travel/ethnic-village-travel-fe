'use client';

import { Suspense } from 'react';
import { Calendar, DollarSign, MapPin, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from '@/components/shared/shell';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp
              className={`h-3 w-3 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            />
            <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}
              {trend.value}% so với tháng trước
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
};

function DashboardStats() {
  const t = useTranslations('admin.dashboard.stats');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title={t('total_tours')}
        value={0}
        description="Tổng số tour trong hệ thống"
        icon={MapPin}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title={t('total_bookings')}
        value={0}
        description="Tổng số đặt chỗ đã nhận"
        icon={ShoppingCart}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title={t('total_revenue')}
        value="0 ₫"
        description="Doanh thu trong tháng này"
        icon={DollarSign}
        trend={{ value: 15, isPositive: true }}
      />
      <StatCard
        title={t('pending_bookings')}
        value={0}
        description="Cần xem xét và xác nhận"
        icon={Calendar}
      />
      <StatCard
        title={t('active_tours')}
        value={0}
        description="Tour đang được thực hiện"
        icon={TrendingUp}
      />
      <StatCard
        title={t('total_users')}
        value={0}
        description="Người dùng đã đăng ký"
        icon={Users}
        trend={{ value: 5, isPositive: true }}
      />
    </div>
  );
}

export default function Dashboard() {
  const t = useTranslations('admin.dashboard');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-base text-muted-foreground">{t('welcome')}</p>
      </div>

      <Shell className="gap-6">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">{t('overview')}</h2>
          <Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <StatCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <DashboardStats />
          </Suspense>
        </div>
      </Shell>
    </div>
  );
}
