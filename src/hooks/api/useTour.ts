import { TabType, tourApi } from '@/apis/tour.api';
import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@/types/api.type';
import { Tour, TourAdminListRequest, TourListRequest } from '@/types/tour.type';

export const TOUR_QUERY_KEY = {
  LIST: 'tour-list',
  ADMIN_LIST: 'admin-tour-list',
  DETAIL: 'tour-detail',
};

export const useTourList = (params: TourListRequest) => {
  return useQuery({
    queryKey: [TOUR_QUERY_KEY.LIST, params],
    queryFn: () => tourApi.getTourList(params),
  });
};

export const useTourListByIds = (ids: number[]) => {
  return useQuery({
    queryKey: [TOUR_QUERY_KEY.LIST, ids],
    queryFn: async () => {
      if (ids.length === 0) return [];

      const response = await tourApi.getTourListByIds(ids);

      if (!response.data) {
        throw new Error('Failed to get tour list');
      }

      return response.data;
    },
  });
};

export const useTourDetail = (slug: string) => {
  return useQuery<ApiResponse<Tour>>({
    queryKey: [TOUR_QUERY_KEY.DETAIL, slug],
    queryFn: () => tourApi.getTourDetail(slug),
    enabled: !!slug,
  });
};

export const useFilteredTours = (tabType: TabType) => {
  return useQuery({
    queryKey: ['filtered-tours', tabType],
    queryFn: () => tourApi.getFilteredTours(tabType),
  });
};

//-------------------------ADMIN--------------------------------
export const useAdminTourList = (params: TourAdminListRequest) => {
  return useQuery({
    queryKey: [TOUR_QUERY_KEY.ADMIN_LIST, params],
    queryFn: () => tourApi.getAdminTourList(params),
  });
};
