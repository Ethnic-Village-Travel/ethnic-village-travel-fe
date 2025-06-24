import { API } from '@/core/api';
import api from '@/core/api/api';
import { PersonInfo } from '@/store/useBookingStore';

import { ApiResponse } from '@/types/api.type';
import {
  BookingConfirmRequest,
  BookingGetResponse,
  BookingStoreRequest,
  BookingStoreResponse,
  BookingUpdateRequest,
  BookingUpdateResponse,
  TourInfo,
} from '@/types/booking';

export const bookingApi = {
  get: async (id: string) => {
    try {
      const { data } = await api.get<ApiResponse<BookingGetResponse>>(API.BOOKING.GET.replace('{id}', id));

      return data;
    } catch {
      throw new Error('Failed to get booking');
    }
  },
  store: async (request: BookingStoreRequest) => {
    try {
      const { data } = await api.post<ApiResponse<BookingStoreResponse>>(API.BOOKING.STORE, request);

      return data;
    } catch {
      throw new Error('Failed to create booking');
    }
  },
  update: async (request: BookingUpdateRequest) => {
    try {
      const { data } = await api.post<ApiResponse<BookingUpdateResponse>>(API.BOOKING.UPDATE, request);

      return data;
    } catch {
      throw new Error('Failed to update booking');
    }
  },
  updateContact: async (id: string, contactInfo: { name: string; email: string; phone: string }) => {
    try {
      const { data } = await api.post<ApiResponse<any>>(API.BOOKING.UPDATE_CONTACT.replace('{id}', id), contactInfo);

      return data;
    } catch {
      throw new Error('Failed to update contact information');
    }
  },
  confirmBooking: async (id: string, request: BookingConfirmRequest) => {
    try {
      const res = await api.post<ApiResponse<void>>(API.BOOKING.CONFIRM.replace('{id}', id), request);

      return res;
    } catch {
      throw new Error('Failed to confirm booking');
    }
  },
};
