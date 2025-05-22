import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { QueryConfig } from '@/types/query.type';

import { useQueryParams } from './use-query-params';

export const useQueryConfig = () => {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      // limit: queryParams.limit || '10',
      // sort_by: queryParams.sort_by || 'createdAt',
      // order: queryParams.order || 'desc',
      // search: queryParams.search,
    },
    isUndefined,
  );

  return queryConfig;
};
