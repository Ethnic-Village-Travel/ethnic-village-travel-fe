import type { PersonalBasicInfo } from './personal.type';

export interface EmployeeBasicResponse {
  id: string;
  email: string;
  description: string;
  isActive: boolean;
  personal?: PersonalBasicInfo;
}

export interface EmployeeAdmin {
  id: string;
  email: string;
  personal?: {
    id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    phoneNumber?: string;
    avatar?: string;
    address?: string;
    dateOfBirth?: string;
  };
  description?: string;
  hiredDate?: string;
  isActive: boolean;
  roles: { id: string; name: string; description?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  hiredDate?: string;
  isActive?: boolean;
  password?: string;
}

export interface CreateEmployeeRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  hiredDate?: string;
  roleId?: string;
}

export interface EmployeeFilters {
  search?: string;
  isActive?: boolean;
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
