import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';

import type { ApiResponse } from '@/types/api.type';
import type {
  AssignedAvailableDateListResponse,
  AssignedAvailableDatesRequest,
  TourAssignmentRequest,
  TourAssignmentResponse,
} from '@/types/tour-assignment.type';

export const tourAssignmentApi = {
  assign: async (payload: TourAssignmentRequest): Promise<ApiResponse<TourAssignmentResponse[]>> => {
    const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.ASSIGN, payload);
    return data;
  },
  search: async (payload: any): Promise<ApiResponse<TourAssignmentResponse[]>> => {
    const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.SEARCH, payload);
    return data;
  },

  /**
   * Get assigned available dates with role-based filtering and pagination
   * Tour Agency: only see their own assignments
   * Admin: see all assignments with optional filters
   */
  getAssignedAvailableDates: async (
    payload: AssignedAvailableDatesRequest,
  ): Promise<ApiResponse<AssignedAvailableDateListResponse>> => {
    try {
      const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.ASSIGNED_AVAILABLE_DATES, payload);
      return data;
    } catch (error) {
      // Enhanced error handling for specific cases
      if (error instanceof Error) {
        throw new Error(`Failed to fetch assigned available dates: ${error.message}`);
      }
      throw new Error('Failed to fetch assigned available dates');
    }
  },
};
