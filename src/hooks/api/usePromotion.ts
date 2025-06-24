import { promotionApi } from '@/apis/promotion.api';
import { useMutation } from '@tanstack/react-query';

export const useApiValidatePromotion = () => {
  return useMutation({
    mutationFn: async ({ code, tourId }: { code: string; tourId: string }) => {
      const res = await promotionApi.validatePromotion(code, tourId);
      return res.data;
    },
  });
};
