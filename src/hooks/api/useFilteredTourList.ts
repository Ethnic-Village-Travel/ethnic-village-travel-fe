import { FilterConfig, FILTERS } from '@/data/filters';
import { toSnakeCase } from '@/utils';

import { Tour } from '@/types/tour.type';
import { SORT_OPTIONS } from '@/components/features/tour/header-section';

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

const calculateAverageRating = (tour: Tour): number => {
  if (!tour.reviews || tour.reviews.length === 0) return 0;

  const sum = tour.reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / tour.reviews.length;
};

const filterToursByRating = (tours: Tour[], minRating: number): Tour[] => {
  return tours.filter(tour => {
    const avgRating = calculateAverageRating(tour);
    return avgRating >= minRating;
  });
};

export const useFilteredTourList = (pageSize: number = 12) => {
  const queryConfig = useQueryConfig();
  const { data: ethnicRes } = useEthnicList();
  const { data: locationRes } = useLocationList();

  // Handle ethnic and location filters
  const ethnicIds = getFilterIds(queryConfig.e, ethnicRes?.data, ethnic => ethnic.code);

  const locationIds = getFilterIds(queryConfig.l, locationRes?.data, location => toSnakeCase(location.city));

  // Convert price values
  const minPrice = queryConfig.min ? Number(queryConfig.min) : undefined;
  const maxPrice = queryConfig.max ? Number(queryConfig.max) : undefined;

  // Handle popular filters (on_sale)
  const popularValues = queryConfig.p ? (Array.isArray(queryConfig.p) ? queryConfig.p : [queryConfig.p]) : [];
  const onSale = popularValues.includes('on_sale');

  // Handle duration filter
  const durationValue = getFilterValue(
    FILTERS.duration,
    queryConfig.d,
    (value): value is { min: number; max?: number } => typeof value === 'object' && value !== null,
  );
  const minDuration = durationValue?.min;
  const maxDuration = durationValue?.max;

  if (queryConfig.sort_by === SORT_OPTIONS.PRICE_ASC.sortBy) {
    queryConfig.sort_by = 'adultPrice';
  }

  // Handle rating filter
  const rating = getFilterValue(FILTERS.rating, queryConfig.r, (value): value is number => typeof value === 'number');

  // Get tour list with filters
  const { data: tourRes, isLoading } = useTourList({
    page: queryConfig.page || 0,
    size: pageSize,
    sortBy: queryConfig.sort_by,
    order: queryConfig.order || 'desc',
    ethnicIds,
    locationIds,
    minPrice,
    maxPrice,
    onSale,
    rating,
    minDuration,
    maxDuration,
  });

  return {
    tours: tourRes?.content || [],
    totalPages: tourRes?.totalPages || 0,
    isLoading,
  };
};
