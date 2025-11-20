import api from '@/data/apis/axios';
import { API } from '@/data/apis/define';

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

export const ethnicApi = {
  getEthnicAll: async (): Promise<EthnicListResponse> => {
    const { data } = await api.get(API.ETHNIC.GET_ALL);
    return data;
  },
};
