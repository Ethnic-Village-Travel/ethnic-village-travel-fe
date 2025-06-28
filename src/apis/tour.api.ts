import { AdminAPI, API } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { ApiResponse } from '@/types/api.type';
import { Tour, TourAdminListRequest, TourListRequest, TourListResponse } from '@/types/tour.type';

export type TabType = 'popular' | 'outstanding' | 'best_price';

export const tourApi = {
  getTourList: async (params: TourListRequest): Promise<ApiResponse<TourListResponse>> => {
    try {
      const queryParams = {
        ...params,
        ethnicIds: params.ethnicIds?.join(','),
        locationIds: params.locationIds?.join(','),
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<TourListResponse>>(`${API.TOUR.SEARCH}?${queryString}`);

      return data;
    } catch {
      throw new Error('Failed to get tour list');
    }
  },

  getTourListByIds: async (ids: number[]): Promise<ApiResponse<Tour[]>> => {
    try {
      const { data } = await api.get<ApiResponse<Tour[]>>(`${API.TOUR.GET_BY_IDS}?ids=${ids.join(',')}`);
      return data;
    } catch {
      throw new Error('Failed to get tour list by ids');
    }
  },

  getTourDetail: async (slug: string): Promise<ApiResponse<Tour>> => {
    try {
      const { data } = await api.get<ApiResponse<Tour>>(`${API.TOUR.DETAIL}/${slug}`);
      return data;
    } catch {
      throw new Error('Failed to get tour detail');
    }
  },

  getFilteredTours: async (tabType: TabType = 'popular'): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get<ApiResponse<Tour[]>>(`${API.TOUR.FILTER_TAB}?tabType=${tabType}`);
    return response.data;
  },

  //-------------------------Admin------------------------------------------------

  getAdminTourList: async (params: TourAdminListRequest): Promise<ApiResponse<TourListResponse>> => {
    try {
      const queryParams = {
        ...params,
        ethnicIds: params.ethnicIds?.join(','),
        locationIds: params.locationIds?.join(','),
        status: params.status?.join(','),
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<TourListResponse>>(`${AdminAPI.TOUR.SEARCH}?${queryString}`);

      return data;
    } catch {
      throw new Error('Failed to get tour list');
    }
  },
};
