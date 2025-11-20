import api from '@/data/apis/axios';
import { API } from '@/data/apis/define';

import { Location } from '@/types/location.type';

export interface LocationListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface LocationListResponse {
  data: Location[];
}

export const locationApi = {
  getLocationAll: async (): Promise<LocationListResponse> => {
    const { data } = await api.get(API.LOCATION.GET_ALL);
    return data;
  },
};
