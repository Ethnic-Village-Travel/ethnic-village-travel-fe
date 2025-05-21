import { Ethnic } from './ethnic.types';
import { Location } from './location.type';
import { Promotion } from './promotion.type';
import { Rating } from './ratings.type';

export interface Tour {
  id: number;
  image_url: string;
  title: string;
  overview?: string;
  status?: string;
  max_slot?: number;
  days: string;
  pick_up_location?: any;
  adult_price?: number;
  child_price?: number;
  contacts?: any[];
  timeline?: any[];
  ethnics?: Ethnic[];
  locations?: Location[];
  rating?: Rating[];
  promotions?: Promotion[];
  published_at?: string;
  avalable_slots?: number;
  price: number;
}
