import { API, API_ROOT } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

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
const API_URL = `${API_ROOT}/api/${API.LOCATION.GET_ALL}`;

export const locationApi = {
  getLocationAll: async (): Promise<LocationListResponse> => {
    const { data } = await api.get(`${API_URL}`);
    return data;
  },
};
