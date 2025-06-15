import { API, API_ROOT } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { Tour } from '@/types/tour.type';

export interface TourListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  ethnicIds: number[] | undefined;
  locationIds: number[] | undefined;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  rating?: number;
  minDuration?: number;
  maxDuration?: number;
}

export interface TourListResponse {
  content: Tour[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
const API_URL = `${API_ROOT}/api/${API.TOUR.SEARCH}`;

export const tourApi = {
  getTourList: async (params: TourListParams): Promise<TourListResponse> => {
    const queryParams = {
      ...params,
      ethnicIds: params.ethnicIds?.join(','),
      locationIds: params.locationIds?.join(','),
    };

    const queryString = encodeQueryData(queryParams);
    const { data } = await api.get(`${API_URL}?${queryString}`);
    return data.data;
  },
};
