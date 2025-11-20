import api from '@/data/apis/axios';
import { API } from '@/data/apis/define';

import { ApiResponse } from '@/types/api.type';
import { PromotionValidateResponse } from '@/types/promotion.type';

export const promotionApi = {
  validatePromotion: async (code: string, tourId: string) => {
    const response = await api.get<ApiResponse<PromotionValidateResponse>>(API.PROMOTION.VALIDATE, {
      params: {
        code,
        tourId,
      },
    });
    return response.data;
  },
};
