'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSearchParams } from '@/utils';
import { Receipt, Clock, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useQueryConfig } from '@/hooks/use-query-config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix/tabs';

import BookingFilters from './booking-filters';
import BookingOtherList from './booking-other-list';
import BookingPendingList from './booking-pending-list';

export const TABS = {
  PENDING: 'PENDING',
  OTHERS: 'OTHERS',
} as const;

export default function BookingTabContent() {
  const t = useTranslations('personal.transaction');
  const router = useRouter();
  const queryConfig = useQueryConfig();
  const [activeTab, setActiveTab] = useState<keyof typeof TABS>(TABS.PENDING);

  useEffect(() => {
    if (queryConfig.page === 0) return;

    const query = createSearchParams({
      ...queryConfig,
      page: 1,
    });

    router.replace(`?${query.toString()}`);
  }, [activeTab]);

  const handleFilterChange = (filters: Partial<BookingListRequest>) => {
    const newParams: Record<string, string> = {};

    if (filters.startDate) {
      newParams['start_date'] = filters.startDate.toString();
    }
    if (filters.endDate) {
      newParams['end_date'] = filters.endDate.toString();
    }
    if (!filters.startDate && !filters.endDate) {
      newParams['status'] = filters.status && filters.status.length > 0 ? filters.status.join(',') : '';
    }

    const query = createSearchParams({
      ...queryConfig,
      ...newParams,
      page: 1,
    });

    router.push(`?${query.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Main Content */}
      <div className="relative mx-auto max-w-5xl space-y-4">
        {/* Header Section */}
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Receipt className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">
              {t('title')}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('description') || 'Manage your tour bookings'}
            </p>
          </div>
        </header>

        {/* Filters Section */}
        <BookingFilters onFilterChange={handleFilterChange} showStatusFilter={activeTab === TABS.OTHERS} />

        {/* Tabs Section */}
        <Tabs
          defaultValue={TABS.PENDING}
          className="w-full"
          onValueChange={value => setActiveTab(value as keyof typeof TABS)}
          value={activeTab}
        >
          <TabsList className="mb-4 inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
            {/* Pending Tab */}
            <TabsTrigger
              value={TABS.PENDING}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground"
            >
              <Clock className="h-4 w-4" />
              <span>{t('tabs.pending')}</span>
            </TabsTrigger>

            {/* Others Tab */}
            <TabsTrigger
              value={TABS.OTHERS}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('tabs.other')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={TABS.PENDING} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <BookingPendingList />
          </TabsContent>

          <TabsContent value={TABS.OTHERS} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <BookingOtherList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
