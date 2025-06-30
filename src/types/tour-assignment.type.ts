import type { EmployeeBasicResponse } from './employee.type';

export interface TourAssignmentRequest {
  assignments: {
    [availableDateId: string]: string[]; // employeeIds
  };
}

export interface TourAssignmentResponse {
  id: string;
  employee: EmployeeBasicResponse;
  tourAvailableDateId: string;
  assignedBy: string;
  assignedDate: string;
}
