import { API } from '@/core/api';
import api from '@/core/api/api';

import { PromotionValidateResponse } from '@/types/promotion.type';

export const validatePromotion = async (code: string, tourId: string) => {
  const { data } = await api.get<PromotionValidateResponse>(API.PROMOTION.VALIDATE, {
    params: {
      code,
      tourId,
    },
  });
  return data;
};
