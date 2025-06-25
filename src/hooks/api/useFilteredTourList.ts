import { FilterConfig, FILTERS } from '@/data/filters';
import { omitBy } from 'lodash';

import { TourListRequest } from '@/types/tour.type';

import { useQueryConfig } from '../use-query-config';
import { useEthnicList } from './useEthnic';
import { useLocationList } from './useLocation';
import { useTourList } from './useTour';

const getFilterValue = <T>(
  filterConfig: FilterConfig,
  value: string | undefined,
  typeCheck: (value: unknown) => value is T,
): T | undefined => {
  if (!value) return undefined;

  const filterItem = filterConfig.items.find(item => item.value === value);
  if (!filterItem?.apiValue) return undefined;

  return typeCheck(filterItem.apiValue) ? filterItem.apiValue : undefined;
};

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

export const useFilteredTourList = (pageSize: number = 12) => {
  const queryConfig = useQueryConfig();
  const { data: ethnicRes } = useEthnicList();
  const { data: locationRes } = useLocationList();

  const filterParams: TourListRequest = omitBy(
    {
      page: queryConfig.page || 0,
      size: pageSize,
      ethnicIds: getFilterIds(queryConfig.e, ethnicRes?.data, ethnic => ethnic.code),
      locationIds: getFilterIds(queryConfig.l, locationRes?.data, location => location.city),
      minPrice: queryConfig.min,
      maxPrice: queryConfig.max,
      onSale: queryConfig.p
        ? (Array.isArray(queryConfig.p) ? queryConfig.p : [queryConfig.p]).includes('on_sale')
        : false,
      rating: getFilterValue(FILTERS.rating, queryConfig.r, (value): value is number => typeof value === 'number'),
      minDuration: getFilterValue(
        FILTERS.duration,
        queryConfig.d,
        (value): value is { min: number; max?: number } => typeof value === 'object' && value !== null,
      )?.min,
      maxDuration: getFilterValue(
        FILTERS.duration,
        queryConfig.d,
        (value): value is { min: number; max?: number } => typeof value === 'object' && value !== null,
      )?.max,
      searchKey: queryConfig.search,
      date: queryConfig.date,
      order: queryConfig.order,
      sortBy: queryConfig.sort_by,
    },
    (v, k) => {
      return v === undefined || v === null || (Array.isArray(v) && v.length === 0);
    },
  );

  const { data: tourRes, isLoading } = useTourList(filterParams);

  return {
    tours: tourRes?.data?.content || [],
    totalPages: tourRes?.data?.totalPages || 0,
    isLoading,
  };
};
