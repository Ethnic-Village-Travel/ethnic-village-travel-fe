import { BookingStatus, PaymentMethod, PaymentStatus } from '@/constants/enum/booking.enum';
import { PersonInfo } from '@/store/useBookingStore';

import { TourInfo } from './booking.type';

export interface BookingStoreRequest {
  tourSlug: string;
  availableDateId: string;
  adultCount: number;
  childCount: number;
}

export interface BookingUpdateRequest {
  id: string;
  tourSlug: string;
  availableDateId: number;
  adultCount: number;
  childCount: number;
  totalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: BookingStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  contactInformation?: any;
  guestInformation?: any;
  additionalInformation?: any;
}

export interface BookingConfirmRequest {
  promotionId?: string;
  discountAmountApplied?: number;
  guestInformation?: PersonInfo;
  additionalInformation?: string;
  totalPrice: number;
  tourData: TourInfo;
}
