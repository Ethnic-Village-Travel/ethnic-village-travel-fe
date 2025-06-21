import { isUndefined } from 'lodash';
import omitBy from 'lodash/omitBy';

import { OrderTourQueryConfig, QueryConfig } from '@/types/query.type';

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
      min: queryParams.min ? Number(queryParams.min) : 0,
      max: queryParams.max ? Number(queryParams.max) : 20000000,
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
      search: queryParams.search,
      date: queryParams.date,
    },
    isUndefined,
  );

  return queryConfig;
};

export const useOrderTourQueryConfig = () => {
  const queryParams: OrderTourQueryConfig = useQueryParams();

  const queryConfig: OrderTourQueryConfig = omitBy(
    {
      tour: queryParams.tour,
      availableDate: queryParams.availableDate,
      adult: queryParams.adult,
      child: queryParams.child,
    },
    (v, k) => {
      return v === undefined || v === null;
    },
  );

  return queryConfig;
};
