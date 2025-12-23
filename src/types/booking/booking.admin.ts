import { BookingStatus } from '@/core/enum/booking.enum';
import { TourAvailableDateStatus } from '@/core/enum/tour.enum';

export interface AdminBookingListRequest {
  tourId?: string;
  tourAvailableDateIds?: string[];
  status?: BookingStatus[];
  fromDate?: string; // yyyy-MM-dd format
  toDate?: string; // yyyy-MM-dd format
  page: number; // 0-based pagination
  size: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface BookingFilters {
  tourId?: string;
  tourAvailableDateIds?: string[];
  status?: BookingStatus[];
  fromDate?: string;
  toDate?: string;
}

export interface AdminBooking {
  bookingId: string;
  bookerDetail: {
    email: string;
    name: string;
    phone: string;
  };
  bookingDate: string;
  status: BookingStatus;
  totalPrice: number;
  discountAmountApplied?: number;
  bookingStatus: string;
  createdAt: string;
  tourAvailableDate: {
    id: string;
    startDate: string;
    endDate: string;
    status: TourAvailableDateStatus;
    maxSlots: number;
  };
  personCount: {
    adult: number;
    child: number;
  };
  tour: {
    id: string;
    title: string;
  };
}
