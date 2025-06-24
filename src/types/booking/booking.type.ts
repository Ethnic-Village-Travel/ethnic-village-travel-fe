import { Ethnic } from '../ethnic.type';
import { Location } from '../location.type';
import { Promotion } from '../promotion.type';
import { Review } from '../review.type';

export interface TourInfo {
  id: string;
  title: string;
  imageUrl: string;
  duration: number;
  adultPrice: number;
  childPrice: number;
  pickUpLocation: Location;
  promotions?: Promotion[];
  ethnics?: Ethnic[];
  locations?: Location[];
  reviews?: Review[];
}
