import { BookingStatus } from '@/core/enum/booking.enum';
import { bookingAdminApi } from '@/data/apis/booking.admin.api';
import { useQuery } from '@tanstack/react-query';
import { omitBy } from 'lodash';

import { AdminBookingListRequest } from '@/types/booking/booking.admin';

import { useAdminBookingQueryConfig } from '../use-query-config';

export const useAdminFilteredBookingList = (pageSize: number = 10) => {
  const queryConfig = useAdminBookingQueryConfig();

  const filterParams: AdminBookingListRequest = omitBy(
    {
      page: queryConfig.page ? Number(queryConfig.page) - 1 : 0,
      size: pageSize,
      tourId: queryConfig.tourId,
      tourAvailableDateIds: queryConfig.tourAvailableDateIds,
      status: queryConfig.status as BookingStatus[],
      fromDate: queryConfig.start_date,
      toDate: queryConfig.end_date,
      sortBy: queryConfig.sort_by,
      order: queryConfig.order as 'asc' | 'desc',
    },
    v => {
      return v === undefined || v === null || (Array.isArray(v) && v.length === 0);
    },
  );

  console.log('useAdminFilteredBookingList - queryConfig:', queryConfig);
  console.log('useAdminFilteredBookingList - filterParams:', filterParams);

  const {
    data: bookingRes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-bookings', filterParams],
    queryFn: () => bookingAdminApi.getAdminBookingList(filterParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  return {
    bookings: bookingRes?.data?.content || [],
    totalPages: bookingRes?.data?.totalPages || 0,
    totalElements: bookingRes?.data?.totalElements || 0,
    isLoading,
    error: error?.message || null,
  };
};
