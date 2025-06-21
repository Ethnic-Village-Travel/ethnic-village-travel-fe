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
  maxSlot: number;
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
  avalableSlots: number;
}

export interface TourAvailableDate {
  id: number;
  startDate: string;
  endDate: string;
  availableSlots: number;
}

export interface TourTimeLine {
  day: number;
  activities: {
    time: string;
    description: string;
  }[];
}

export interface TourListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  ethnicIds: number[] | undefined;
  locationIds: number[] | undefined;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  rating?: number;
  minDuration?: number;
  maxDuration?: number;
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
