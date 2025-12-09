import { employeeApi } from '@/data/apis/employee.api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { AssignedEmployeesByDatesRequest, EmployeeDateRangeRequest } from '@/types/employee.type';

export const useAvailableEmployees = (availableDateId?: string) => {
  return useQuery({
    queryKey: ['available-employees', availableDateId],
    queryFn: async () => {
      if (!availableDateId) return [];
      const res = await employeeApi.getAvailableEmployees(availableDateId);
      return res.data || [];
    },
    enabled: !!availableDateId,
  });
};

export const useAvailableEmployeesByDateRange = (params?: EmployeeDateRangeRequest) => {
  return useQuery({
    queryKey: ['available-employees-by-date-range', params],
    queryFn: async () => {
      if (!params?.startDate || !params?.endDate) return [];
      const res = await employeeApi.getAvailableEmployeesByDateRange(params);
      return res.data || [];
    },
    enabled: !!params?.startDate && !!params?.endDate,
    staleTime: 0, // Always consider data stale - refetch when needed
    gcTime: 0, // Don't cache at all (garbage collect immediately)
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
  });
};

export const useAssignedEmployeesByDates = (
  params?: AssignedEmployeesByDatesRequest,
  options?: { enabled?: boolean; staleTime?: number; refetchOnMount?: boolean },
) => {
  return useQuery({
    queryKey: ['assigned-employees-by-dates', params],
    queryFn: async () => {
      if (!params?.availableDateIds?.length) return { assignedEmployeesByDate: {} };
      const res = await employeeApi.getAssignedEmployeesByDates(params);
      return res.data || { assignedEmployeesByDate: {} };
    },
    enabled: options?.enabled ?? !!params?.availableDateIds?.length,
    staleTime: options?.staleTime ?? 0,
    refetchOnMount: options?.refetchOnMount ?? true,
  });
};

export const useAssignEmployees = () => {
  return useMutation({
    mutationFn: employeeApi.assignEmployees,
  });
};

export const useActiveEmployees = () => {
  return useQuery({
    queryKey: ['active-employees'],
    queryFn: async () => {
      const res = await employeeApi.getActiveEmployees();
      return res.data || [];
    },
  });
};
