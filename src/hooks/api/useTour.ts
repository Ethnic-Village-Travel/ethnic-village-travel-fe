import { tourApi, TourListParams } from '@/apis/tour.api';
import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@/types/api.type';
import { Tour } from '@/types/tour.type';

export const TOUR_QUERY_KEY = {
  LIST: 'tour-list',
  DETAIL: 'tour-detail',
};

export const useTourList = (params: TourListParams) => {
  return useQuery({
    queryKey: [TOUR_QUERY_KEY.LIST, params],
    queryFn: () => tourApi.getTourList(params),
  });
};

export const useTourDetail = (slug: string) => {
  return useQuery<ApiResponse<Tour>>({
    queryKey: [TOUR_QUERY_KEY.DETAIL, slug],
    queryFn: () => tourApi.getTourDetail(slug),
    enabled: !!slug,
  });
};
