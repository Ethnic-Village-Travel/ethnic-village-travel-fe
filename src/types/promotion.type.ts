export enum PromotionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum PromotionErrorCode {
  PROMOTION_NOT_FOUND = 'PROMOTION_NOT_FOUND',
  PROMOTION_NOT_ACTIVE = 'PROMOTION_NOT_ACTIVE',
  PROMOTION_EXPIRED = 'PROMOTION_EXPIRED',
  PROMOTION_OUT_OF_STOCK = 'PROMOTION_OUT_OF_STOCK',
}

export interface PromotionValidateResponse {
  id: string;
  name: string;
  discountPercent: number;
  maxDiscountAmount: number;
  status: PromotionStatus;
  errorCode: PromotionErrorCode;
}

export interface Promotion {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxDiscountAmount: number;
  discountPercent: number;
  status?: string;
  type: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}
