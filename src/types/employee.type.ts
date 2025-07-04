import type { PersonalBasicInfo } from './personal.type';

export interface EmployeeBasicResponse {
  id: string;
  email: string;
  description: string;
  isActive: boolean;
  personal?: PersonalBasicInfo;
}

export interface EmployeeSelectedResponse {
  id: string;
  email: string;
  personal?: {
    firstName: string;
    lastName: string;
  } | null;
}

export interface EmployeeDateRangeRequest {
  startDate: string;
  endDate: string;
}

export interface AssignedEmployeesByDatesRequest {
  availableDateIds: string[];
}

export interface AssignedEmployeesByDatesResponse {
  assignedEmployeesByDate: { [dateId: string]: EmployeeBasicResponse[] };
}
