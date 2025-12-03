import { TourStatus } from '@/core/enum/tour.enum';

import type { EmployeeBasicResponse } from './employee.type';
import { Location } from './location.type';
import { TourAvailableDate } from './tour.type';

export interface TourAssignmentRequest {
  assignments: {
    [availableDateId: string]: string; // Single guideId per date
  };
}

export interface TourAssignmentResponse {
  id: string;
  guide: EmployeeBasicResponse;
  tourAvailableDateId: string;
  assignedBy: string;
}

// New types for Assigned Available Dates feature
export interface AssignedAvailableDatesRequest {
  page: number;
  size: number;
  sortBy: string;
  order: 'asc' | 'desc';

  // Common filters (Tour Agency + Admin)
  tourStatus?: TourStatus[];
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
  tourId?: string;
  searchKey?: string; // Search by tour title

  // Admin-only filters
  employeeIds?: string[]; // Filter by specific employees (Admin only)
}

export interface TourBasicInfo {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  status: TourStatus;
  duration: number;
  pickUpLocation?: Location;
}

export interface AssignedAvailableDateResponse {
  assignmentId: string;
  assignedBy: string;

  // Tour Available Date Information
  tourAvailableDate: TourAvailableDate;

  // Tour Information
  tour: TourBasicInfo;

  // Guide Information (only visible to Admin)
  guide?: EmployeeBasicResponse;
}

export interface AssignedAvailableDateListResponse {
  content: AssignedAvailableDateResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
