export interface Promotion {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  max_discount_amount: number;
  discount_percent: number;
  status?: string;
  type: string;
  code?: string;
  created_at?: string;
  updated_at?: string;
}
