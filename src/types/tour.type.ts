import { Ethnic } from './ethnic.type';
import { Location } from './location.type';
import { Promotion } from './promotion.type';
import { Review } from './review.type';

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
  timeline?: any[];
  ethnics?: Ethnic[];
  locations?: Location[];
  ratingCount?: number;
  avgRating?: number;
  reviews?: Review[];
  promotions?: Promotion[];
  publishedAt?: string;
  avalableSlots: number;
}
