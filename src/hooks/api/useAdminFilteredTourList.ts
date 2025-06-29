import { omitBy } from 'lodash';

import { TourListRequest } from '@/types/tour.type';

import { useQueryConfig } from '../use-query-config';
import { useFetchEthnics, useFetchLocations } from './useMetaData';
import { useAdminTourList } from './useTour';

type EntityWithId = {
  id: number;
  code?: string;
  city?: string;
};

const getFilterIds = <T extends EntityWithId>(
  queryValue: string | string[] | undefined,
  entities: T[] | undefined,
  getMatchValue: (entity: T) => string,
): number[] => {
  if (!queryValue || !entities) return [];

  const values = Array.isArray(queryValue) ? queryValue : [queryValue];

  return Array.from(
    new Set(
      values.map(value => entities.find(e => getMatchValue(e) === value)?.id).filter((id): id is number => Boolean(id)),
    ),
  );
};

export const useAdminFilteredTourList = (pageSize: number = 12) => {
  const queryConfig = useQueryConfig();
  const { data: ethnics } = useFetchEthnics();
  const { data: locations } = useFetchLocations();

  const filterParams: TourListRequest = omitBy(
    {
      page: queryConfig.page || 0,
      size: pageSize,
      ethnicIds: getFilterIds(queryConfig.e, ethnics, ethnic => ethnic.code),
      locationIds: getFilterIds(queryConfig.l, locations, location => location.city),
      status: queryConfig.status,
      onSale: queryConfig.p
        ? (Array.isArray(queryConfig.p) ? queryConfig.p : [queryConfig.p]).includes('on_sale')
        : false,
      searchKey: queryConfig.search,
      order: queryConfig.order,
      sortBy: queryConfig.sort_by,
    },
    (v, k) => {
      return v === undefined || v === null || (Array.isArray(v) && v.length === 0);
    },
  );

  console.log('useFilteredTourList - queryConfig:', queryConfig);
  console.log('useFilteredTourList - filterParams:', filterParams);

  const { data: tourRes, isLoading } = useAdminTourList(filterParams);

  return {
    tours: tourRes?.data?.content || [],
    totalPages: tourRes?.data?.totalPages || 0,
    isLoading,
  };
};
