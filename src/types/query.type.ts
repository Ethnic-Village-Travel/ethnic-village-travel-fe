export type QueryConfig = {
  page?: number;
  perPage?: number;
  limit?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string[];
  e?: string[];
  p?: string[];
  l?: string[];
  d?: string;
  r?: string;
  min?: number;
  max?: number;
};
