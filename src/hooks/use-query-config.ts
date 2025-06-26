import { isUndefined } from 'lodash';
import omitBy from 'lodash/omitBy';

import { BookingQueryConfig, OrderTourQueryConfig, QueryConfig } from '@/types/query.type';

import { useQueryParams } from './use-query-params';

export const useQueryConfig = () => {
  const queryParams = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 0,
      status: queryParams.status?.split(',') || [],
      e: queryParams.e?.split(',') || [],
      p: queryParams.p?.split(',') || [],
      l: queryParams.l?.split(',') || [],
      d: queryParams.d,
      r: queryParams.r,
      min: queryParams.min,
      max: queryParams.max,
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
      search: queryParams.search,
      date: queryParams.date,
      start_date: queryParams.start_date,
      end_date: queryParams.end_date,
    },
    isUndefined,
  );

  return queryConfig;
};

export const useBookingQueryConfig = () => {
  const queryParams = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      status: queryParams.status?.split(',') || [],
      e: queryParams.e?.split(',') || [],
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
      search: queryParams.search,
      start_date: queryParams.start_date,
      end_date: queryParams.end_date,
    },
    isUndefined,
  );

  return queryConfig;
};
