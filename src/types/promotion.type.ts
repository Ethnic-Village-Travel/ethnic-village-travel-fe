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
