import { API, API_ROOT } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { Ethnic } from '@/types/ethnic.type';

export interface EthnicListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface EthnicListResponse {
  data: Ethnic[];
}
const API_URL = `${API_ROOT}/api/${API.ETHNIC.GET_ALL}`;

export const ethnicApi = {
  getEthnicAll: async (): Promise<EthnicListResponse> => {
    const { data } = await api.get(`${API_URL}`);
    return data;
  },
};
