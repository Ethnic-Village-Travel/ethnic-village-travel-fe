import { API, API_ROOT } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { ApiResponse } from '@/types/api.type';
import { Tour, TourListParams, TourListResponse } from '@/types/tour.type';

export const tourApi = {
  getTourList: async (params: TourListParams): Promise<ApiResponse<TourListResponse>> => {
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

  getTourDetail: async (slug: string): Promise<ApiResponse<Tour>> => {
    try {
      const { data } = await api.get<ApiResponse<Tour>>(`${API.TOUR.DETAIL}/${slug}`);
      return data;
    } catch {
      throw new Error('Failed to get tour list');
    }
  },
};
