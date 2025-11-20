import api from '@/data/apis/axios';
import { AdminAPI } from '@/data/apis/define';

import { ApiResponse } from '@/types/api.type';
import { ServiceInfoBasic } from '@/types/service-info.type';

export const getAllServiceInfo = async (): Promise<ApiResponse<ServiceInfoBasic[]>> => {
  try {
    const { data } = await api.get<ApiResponse<ServiceInfoBasic[]>>(AdminAPI.SERVICE_INFO.ALL);

    return data;
  } catch {
    throw new Error('Failed to get service');
  }
};
