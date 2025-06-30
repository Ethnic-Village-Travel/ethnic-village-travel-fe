import { useMemo } from 'react';
import { BookingStatus } from '@/constants/enum/booking.enum';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useApiBookingList } from '@/hooks/api/useBooking';
import { useQueryConfig } from '@/hooks/use-query-config';
import PaginationClient from '@/components/shared/pagination-client';

import BookingCard from './booking-card';

const BOOKING_STATUS = Object.values(BookingStatus).filter(status => status !== BookingStatus.PENDING_PAYMENT);

export default function BookingOtherList() {
  const t = useTranslations('personal.booking_other_list');
  const queryConfig = useQueryConfig();

  const request = useMemo(() => {
    return {
      status: queryConfig.status?.length ? queryConfig.status : BOOKING_STATUS,
      start_date: queryConfig.start_date,
      end_date: queryConfig.end_date,
      sortBy: queryConfig.sort_by || 'bookingDate',
      order: queryConfig.order || 'desc',
      page: queryConfig.page || 1,
      size: 3,
    };
  }, [queryConfig]);

  const { data, isLoading, isError } = useApiBookingList(request as BookingListRequest);

  if (isLoading) return <div className="flex items-center justify-center py-8">{t('loading')}</div>;
  if (isError) return <div className="flex items-center justify-center py-8 text-red-500">{t('error')}</div>;
  if (!data || data.content.length === 0)
    return <div className="flex items-center justify-center py-8 text-gray-500">{t('empty')}</div>;

  return (
    <>
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
    </>
  );
}
