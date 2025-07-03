import { TourStatus } from '@/constants/enum/tour.enum';

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

export interface TourAvailableDateInfo {
  id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  bookedSlots: number;
  maxSlots: number;
}

export interface TourBasicInfo {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  status: TourStatus;
  duration: number;
}

export interface AssignedAvailableDateResponse {
  assignmentId: string;
  assignedDate: string; // ISO date string
  assignedBy: string;

  // Tour Available Date Information
  tourAvailableDate: TourAvailableDateInfo;

  // Tour Information
  tour: TourBasicInfo;

  // Employee Information (only visible to Admin)
  assignedEmployee?: EmployeeBasicResponse;
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
