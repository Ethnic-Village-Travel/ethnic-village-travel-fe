import { paymentApi } from '@/data/apis/payment.api';
import { useMutation, useQuery } from '@tanstack/react-query';

export function usePayment() {
  const createPaymentMutation = useMutation({
    mutationFn: (bookingId: string) => paymentApi.createPayment(bookingId),
    onError: error => {
      console.error('Payment creation failed:', error);
    },
  });

  return {
    createPayment: createPaymentMutation.mutateAsync,
    isCreatingPayment: createPaymentMutation.isPending,
    error: createPaymentMutation.error,
    reset: createPaymentMutation.reset,
  };
}

export function usePaymentLink(bookingId: string, enabled = true) {
  return useQuery({
    queryKey: ['payment-link', bookingId],
    queryFn: () => paymentApi.getPaymentLink(bookingId),
    enabled: enabled && !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
