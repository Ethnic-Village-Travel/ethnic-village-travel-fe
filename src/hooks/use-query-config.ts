import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { OrderTourQueryConfig, QueryConfig } from '@/types/query.type';

import { useQueryParams } from './use-query-params';

export const useTourSearchQueryConfig = () => {
  const queryParams: QueryConfig = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 0,
      searchKey: queryParams.searchKey,
      e: queryParams.e || [],
      p: queryParams.p || [],
      l: queryParams.l || [],
      d: queryParams.d,
      r: queryParams.r,
      min: queryParams.min ? Number(queryParams.min) : undefined,
      max: queryParams.max ? Number(queryParams.max) : undefined,
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
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
    isUndefined,
  );

  return queryConfig;
};
