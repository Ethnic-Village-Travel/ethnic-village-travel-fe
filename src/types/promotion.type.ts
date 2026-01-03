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

export type PromotionValidateResponse = {
  id: string;
  name: string;
  discountPercent: number;
  maxDiscountAmount: number;
  status: PromotionStatus;
  errorCode: PromotionErrorCode;
}

export enum PromotionType {
  COUPON_CODE = 'COUPON_CODE',
  DIRECT_DISCOUNT = 'DIRECT_DISCOUNT',
}

export type Promotion = {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxDiscountAmount: number;
  discountPercent: number;
  status: PromotionStatus;
  type: PromotionType;
  code?: string;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
  tours?: { id: string; title: string }[]; // Tours this promotion applies to
}

export type PromotionCreateRequest = {
  name: string;
  description?: string;
  discountPercent: number;
  maxDiscountAmount: number;
  startDate: string; // ISO datetime string
  endDate: string; // ISO datetime string
  status: PromotionStatus;
  type: PromotionType;
  code?: string; // Required if type = COUPON_CODE
  usageLimit: number;
  tourIds?: string[]; // Empty = applies to all tours
}

export type PromotionUpdateRequest = {
  name: string;
  description?: string;
  discountPercent: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  usageLimit?: number;
  tourIds?: string[];
  // Note: type and code cannot be updated
}

export type PromotionAdminListRequest = {
  search?: string; // Search by name or code
  status?: PromotionStatus;
  type?: PromotionType;
  fromDate?: string; // ISO datetime string
  toDate?: string; // ISO datetime string
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export type PromotionListResponse = {
  content: Promotion[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
