import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { QueryConfig } from '@/types/query.type';

import { useQueryParams } from './use-query-params';

export const useQueryConfig = () => {
  const queryParams: QueryConfig = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 0,
      status: queryParams.status || [],
      e: queryParams.e || [],
      p: queryParams.p || [],
      l: queryParams.l || [],
      d: queryParams.d,
      r: queryParams.r,
      min: queryParams.min ? Number(queryParams.min) : undefined,
      max: queryParams.max ? Number(queryParams.max) : undefined,
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
      search: queryParams.search,
      // perPage: queryParams.perPage || 10,
      // limit: queryParams.limit || '10',
    },
    isUndefined,
  );

  return queryConfig;
};
