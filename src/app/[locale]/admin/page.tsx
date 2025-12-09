'use client';

import { useTranslations } from 'next-intl';

import {
  DashboardStatsCards,
  RecentBookings,
  RevenueChart,
  TopDestinationsChart,
  UpcomingDepartures,
} from '@/components/features/admin/dashboard';
import { Shell } from '@/components/shared/shell';

export default function Dashboard() {
  const t = useTranslations('admin.dashboard');

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-base text-muted-foreground">{t('welcome')}</p>
      </div>

      <Shell className="gap-6">
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('sections.key_metrics')}</h2>
          <DashboardStatsCards />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('sections.operations')}</h2>
          <UpcomingDepartures />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('sections.analytics')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueChart />
            <TopDestinationsChart />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('sections.recent_activity')}</h2>
          <RecentBookings />
        </section>
      </Shell>
    </div>
  );
}
