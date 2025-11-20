import api from '@/data/apis/axios';
import { AdminAPI } from '@/data/apis/define';

import { ApiResponse } from '@/types/api.type';
import {
  AssignedEmployeesByDatesRequest,
  AssignedEmployeesByDatesResponse,
  EmployeeBasicResponse,
  EmployeeDateRangeRequest,
} from '@/types/employee.type';

export const employeeApi = {
  getAvailableEmployees: async (
    tourAvailableDateId: string,
  ): Promise<ApiResponse<{ [dateId: string]: EmployeeBasicResponse[] }>> => {
    const { data } = await api.post(AdminAPI.EMPLOYEE.AVAILABLE, { tourAvailableDateId });
    return data;
  },
  getAvailableEmployeesByDateRange: async (
    params: EmployeeDateRangeRequest,
  ): Promise<ApiResponse<EmployeeBasicResponse[]>> => {
    const { data } = await api.post(AdminAPI.EMPLOYEE.AVAILABLE_BY_DATE_RANGE, params);
    return data;
  },
  getAssignedEmployeesByDates: async (
    params: AssignedEmployeesByDatesRequest,
  ): Promise<ApiResponse<AssignedEmployeesByDatesResponse>> => {
    const { data } = await api.post(AdminAPI.EMPLOYEE.ASSIGNED_BY_DATES, params);
    return data;
  },
  assignEmployees: async (
    assignments: { tourAvailableDateId: string; employeeIds: string[] }[],
  ): Promise<ApiResponse<any>> => {
    // TODO: implement API assign logic
    return { success: true } as any;
  },
};
