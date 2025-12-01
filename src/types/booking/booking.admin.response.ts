import { AdminBooking } from './booking.admin';

export interface TourBasicResponse {
  tourId: string;
  title: string;
}

export interface TourAvailableDateResponse {
  id: string;
  startDate: string;
  endDate: string;
  maxSlots: number;
  currentBookedSlots: number;
  status: string;
  tour: {
    id: string;
    title: string;
  };
}

export interface AdminBookingResponse {
  content: AdminBooking[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AdminBookingDetail {
  id: string;
  tourAvailableDate: {
    id: string;
    startDate: string;
    endDate: string;
  };
  bookerDetail: {
    name: string;
    email: string;
    phone: string;
  };
  status: string;
  totalPrice: number;
  discountAmountApplied: number;
  personCount: {
    adultCount: number;
    childCount: number;
  };
  paymentDate: string | null;
  paymentMethod: string | null;
  bookingDate: string;
}
