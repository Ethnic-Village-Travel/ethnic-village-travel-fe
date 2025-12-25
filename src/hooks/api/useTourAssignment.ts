import { tourAssignmentApi } from '@/data/apis/tour-assignment.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  AssignedAvailableDatesRequest,
  AssignmentHistoryRequest,
  CalendarAssignmentsRequest,
  SingleAssignmentRequest,
  TourAssignmentRequest,
  UpdateTourAvailableDateStatusRequest,
} from '@/types/tour-assignment.type';

export const useAssignTourEmployees = () => {
  return useMutation({
    mutationFn: (payload: TourAssignmentRequest) => tourAssignmentApi.assign(payload),
  });
};

export const useAssignSingleDate = () => {
  return useMutation({
    mutationFn: (payload: SingleAssignmentRequest) => tourAssignmentApi.assignSingleDate(payload),
  });
};

export const useTourAssignments = (payload: any) => {
  return useQuery({
    queryKey: ['tour-assignments', payload],
    queryFn: () => tourAssignmentApi.search(payload),
    enabled: !!payload,
  });
};

/**
 * Hook for fetching assigned available dates with role-based filtering
 * Tour Agency: only see their own assignments
 * Admin: see all assignments with optional filters
 */
export const useAssignedAvailableDates = (
  params: AssignedAvailableDatesRequest,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  },
) => {
  return useQuery({
    queryKey: ['assigned-available-dates', params],
    queryFn: () => tourAssignmentApi.getAssignedAvailableDates(params),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching calendar assignments for a date range
 * Used for calendar view display
 */
export const useCalendarAssignments = (
  params: CalendarAssignmentsRequest,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  },
) => {
  return useQuery({
    queryKey: ['calendar-assignments', params],
    queryFn: () => tourAssignmentApi.getCalendarAssignments(params),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching assignment history
 * Used to display timeline of assignment changes
 */
export const useAssignmentHistory = (
  params: AssignmentHistoryRequest,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  },
) => {
  return useQuery({
    queryKey: ['assignment-history', params],
    queryFn: () => tourAssignmentApi.getAssignmentHistory(params),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for updating tour available date status
 * Used by tour guides to update tour progress status
 */
export const useUpdateTourAvailableDateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTourAvailableDateStatusRequest) =>
      tourAssignmentApi.updateTourAvailableDateStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-available-dates'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-assignments'] });
    },
  });
};
