import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';

import type { ApiResponse } from '@/types/api.type';
import type { TourAssignmentRequest, TourAssignmentResponse } from '@/types/tour-assignment.type';

export const tourAssignmentApi = {
  assign: async (payload: TourAssignmentRequest): Promise<ApiResponse<TourAssignmentResponse[]>> => {
    const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.ASSIGN, payload);
    return data;
  },
  search: async (payload: any): Promise<ApiResponse<TourAssignmentResponse[]>> => {
    const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.SEARCH, payload);
    return data;
  },
};
