import api from '@/core/api/api';
import { API } from '@/core/api/config';

import { ApiResponse } from '@/types/api.type';

export interface PaymentLinkResponse {
  checkoutUrl: string;
  orderCode: number | string; // Backend có thể trả về long
  qrCode?: string;
  paymentLinkId?: string;
}

export const paymentApi = {
  createPayment: async (bookingId: string): Promise<PaymentLinkResponse> => {
    try {
      const { data } = await api.post<ApiResponse<PaymentLinkResponse>>(API.PAYMENT.CREATE.replace('{id}', bookingId));
      console.log('Raw API response:', data);
      console.log('data.data:', data.data);
      console.log('data.data type:', typeof data.data);

      if (!data.data) {
        console.error('data.data is falsy:', data.data);
        throw new Error('Invalid response format');
      }
      return data.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Cannot create payment link');
    }
  },

  getPaymentLink: async (bookingId: string): Promise<PaymentLinkResponse> => {
    try {
      const { data } = await api.get<ApiResponse<PaymentLinkResponse>>(
        API.PAYMENT.GET_PAYMENT_LINK.replace('{id}', bookingId),
      );
      if (!data.data) {
        throw new Error('Invalid response format');
      }
      return data.data;
    } catch (error) {
      console.error('Error getting payment link:', error);
      throw new Error('Cannot get payment link');
    }
  },
};
