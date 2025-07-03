import { employeeApi } from '@/apis/employee.api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { EmployeeDateRangeRequest, AssignedEmployeesByDatesRequest } from '@/types/employee.type';

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
  });
};

export const useAssignedEmployeesByDates = (params?: AssignedEmployeesByDatesRequest) => {
  return useQuery({
    queryKey: ['assigned-employees-by-dates', params],
    queryFn: async () => {
      if (!params?.availableDateIds?.length) return { assignedEmployeesByDate: {} };
      const res = await employeeApi.getAssignedEmployeesByDates(params);
      return res.data || { assignedEmployeesByDate: {} };
    },
    enabled: !!params?.availableDateIds?.length,
  });
};

export const useAssignEmployees = () => {
  return useMutation({
    mutationFn: employeeApi.assignEmployees,
  });
};
