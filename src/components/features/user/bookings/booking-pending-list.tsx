import { useEffect, useMemo } from 'react';
import { BookingStatus } from '@/core/enum/booking.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useApiBookingList } from '@/hooks/api/useBooking';
import { useQueryConfig } from '@/hooks/use-query-config';
import PaginationClient from '@/components/shared/pagination-client';

import BookingCard from './booking-card';
import { TABS } from './booking-tab';

export default function BookingPendingList() {
  const t = useTranslations('personal.booking_pending_list');
  const queryConfig = useQueryConfig();
  const { setPendingPaymentBookingCount } = useUserStore();

  const request = useMemo(() => {
    return {
      bookingTab: TABS.PENDING,
      status: [BookingStatus.PENDING_PAYMENT],
      start_date: queryConfig.start_date,
      end_date: queryConfig.end_date,
      sortBy: queryConfig.sort_by || 'bookingDate',
      order: queryConfig.order || 'desc',
      page: queryConfig.page || 1,
      size: 10,
    };
  }, [queryConfig]);

  const { data, isLoading, isError } = useApiBookingList(request as BookingListRequest);

  useEffect(() => {
    if (data?.totalElements !== undefined) {
      setPendingPaymentBookingCount(data.totalElements);
    }
  }, [data?.totalElements, setPendingPaymentBookingCount]);

  if (isLoading) return <div className="flex items-center justify-center py-8">{t('loading')}</div>;
  if (isError) return <div className="flex items-center justify-center py-8 text-red-500">{t('error')}</div>;
  if (!data || data.content.length === 0)
    return <div className="flex items-center justify-center py-8 text-gray-500">{t('empty')}</div>;

  return (
    <div className="space-y-4">
      {data.content.map(booking => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
      {data.totalPages > 1 && (
        <div className="mt-4">
          <PaginationClient queryConfig={{ page: request.page }} pageSize={data.totalPages} />
        </div>
      )}
    </div>
  );
}
