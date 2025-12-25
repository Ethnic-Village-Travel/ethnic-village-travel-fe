import { TourAvailableDateStatus, TourStatus } from '@/core/enum/tour.enum';

import type { EmployeeBasicResponse } from './employee.type';
import { Location } from './location.type';
import { TourAvailableDate } from './tour.type';

export type TourAssignmentRequest = {
  assignments: {
    [availableDateId: string]: string; // Single guideId per date
  };
};

export type TourAssignmentResponse = {
  id: string;
  guide: EmployeeBasicResponse;
  tourAvailableDateId: string;
  assignedBy: string;
};

export type SingleAssignmentRequest = {
  tourAvailableDateId: string;
  guideId: string;
};

// New types for Assigned Available Dates feature
export type AssignedAvailableDatesRequest = {
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
};

export type TourBasicInfo = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  status: TourStatus;
  duration: number;
  pickUpLocation?: Location;
};

export type AssignedAvailableDateResponse = {
  assignmentId: string;
  assignedBy: string;
  assignedDate?: string;

  // Tour Available Date Information
  tourAvailableDate: TourAvailableDate;

  // Tour Information
  tour: TourBasicInfo;

  // Guide Information (only visible to Admin)
  guide?: EmployeeBasicResponse;
};

export type AssignedAvailableDateListResponse = {
  content: AssignedAvailableDateResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number
  first: boolean;
  last: boolean;
  numberOfElements: number;
};

// Calendar View Types
export type CalendarAssignmentsRequest = {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  tourId?: string; // Optional filter by tour
};

export type CalendarAssignmentResponse = {
  assignmentId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  assignedDate?: string; // ISO datetime string
  assignedBy?: string;

  tourId: string;
  tourTitle: string;
  tourSlug: string;
  tourImageUrl?: string;
  tourStatus: string;
  tourDuration: number;

  status: string;
  maxSlots: number;
  bookedSlots: number;

  guideId: string;
  guideName: string;
  guideEmail: string;
};

// Assignment History Types
export type AssignmentHistoryRequest = {
  assignmentId?: string;
  tourAvailableDateId?: string;
  guideId?: string;
};

export type AssignmentHistoryResponse = {
  id: string;
  assignmentId: string;
  tourAvailableDateId: string;

  previousGuide?: EmployeeBasicResponse;
  newGuide?: EmployeeBasicResponse;

  changedByEmail?: string;
  changedByName?: string;

  changeReason?: string;
  previousStatus?: string;
  newStatus?: string;

  createdAt: string; // ISO datetime string
};

// Tour Status Update Types
export type UpdateTourAvailableDateStatusRequest = {
  tourAvailableDateId: string;
  status: TourAvailableDateStatus;
};

export type TourAvailableDateStatusUpdateResponse = {
  tourAvailableDateId: string;
  previousStatus: TourAvailableDateStatus;
  newStatus: TourAvailableDateStatus;
  updatedAt: string;
};
