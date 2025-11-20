'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSearchParams } from '@/utils';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useQueryConfig } from '@/hooks/use-query-config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/animate-ui/radix/tabs';

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
    <div className="w-full space-y-4">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <BookingFilters onFilterChange={handleFilterChange} showStatusFilter={activeTab === TABS.OTHERS} />
      <Tabs
        defaultValue={TABS.PENDING}
        className="w-full"
        onValueChange={value => setActiveTab(value as keyof typeof TABS)}
        value={activeTab}
      >
        <TabsList>
          <TabsTrigger value={TABS.PENDING}>{t('tabs.pending')}</TabsTrigger>
          <TabsTrigger value={TABS.OTHERS}>{t('tabs.other')}</TabsTrigger>
        </TabsList>
        <TabsContent value={TABS.PENDING}>
          <BookingPendingList />
        </TabsContent>
        <TabsContent value={TABS.OTHERS}>
          <BookingOtherList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
