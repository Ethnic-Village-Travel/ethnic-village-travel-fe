import { TourStatus } from '@/constants/enum/tour.enum';

import { Ethnic } from './ethnic.type';
import { Location } from './location.type';
import { Promotion } from './promotion.type';
import { Review } from './review.type';
import { TourService } from './service,type';

export interface Tour {
  id: number;
  imageUrl: string;
  title: string;
  slug: string;
  overview?: string;
  status?: string;
  duration: number;
  pickUpLocation?: Location;
  adultPrice?: number;
  childPrice?: number;
  contacts?: any[];
  timeline?: TourTimeLine[];
  ethnics?: Ethnic[];
  locations?: Location[];
  services?: TourService[];
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
  bookedSlots: number;
  maxSlots: number;
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
