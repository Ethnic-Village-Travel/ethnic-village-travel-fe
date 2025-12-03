import { TourAvailableDateStatus, TourStatus } from '@/core/enum/tour.enum';

import { Ethnic } from './ethnic.type';
import { Location } from './location.type';
import { Promotion } from './promotion.type';
import { Review } from './review.type';
import { TourServiceInfo } from './service-info.type';

export interface Tour {
  id?: number;
  tourId?: string;
  imageUrl: string;
  title: string;
  slug?: string;
  overview?: string;
  status?: string;
  duration?: number;
  pickUpLocation?: Location;
  adultPrice?: number;
  childPrice?: number;
  contacts?: any[];
  timeline?: TourTimeLine[];
  ethnics?: Ethnic[];
  locations?: Location[];
  services?: TourServiceInfo[];
  ratingCount?: number;
  avgRating?: number;
  reviews?: Review[];
  promotions?: Promotion[];
  availableDates?: TourAvailableDate[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TourAvailableDate {
  id: number;
  startDate: string;
  endDate: string;
  maxSlots: number;
  status: TourAvailableDateStatus;
  bookedPersonCounts: {
    adult: number;
    child: number;
  }[];
}

export interface TourTimeLine {
  day: number;
  activities: {
    time: string;
    description: string;
  }[];
}

export interface TourListRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  ethnicIds?: number[];
  locationIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  rating?: number;
  minDuration?: number;
  maxDuration?: number;
}

export interface TourAdminListRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  ethnicIds?: number[];
  locationIds?: number[];
  onSale?: boolean;
  status?: TourStatus[];
  searchKey?: string;
}

export interface TourListResponse {
  content: Tour[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type TourCreateRequest = {
  title: string;
  imageUrl: string;
  overview?: string;
  status?: string; // TourStatus, dùng string cho linh hoạt
  duration: number;
  pickUpLocationId: string;
  adultPrice: number;
  childPrice: number;
  contacts: any; // JsonNode, dùng any hoặc object tuỳ UI
  timeline: any; // JsonNode, dùng any hoặc object tuỳ UI
  availableSlots?: any;
  ethnicIds?: string[];
  locationIds?: string[];
  tagIds?: string[];
  tourIncludedServices?: string[];
  tourExcludedServices?: string[];
  availableDates?: {
    startDate: Date; // ISO date string
    endDate: Date; // Calculated from startDate + duration
    maxSlots: number;
    employeeIds?: string[]; // NEW: Employee IDs for assignment
  }[];
  publishedDate: Date;
};

export type TourResponse = Tour;
