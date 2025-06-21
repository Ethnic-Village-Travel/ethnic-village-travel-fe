export type QueryConfig = Partial<{
  page: number;
  perPage: number;
  limit: string;
  sort_by: string;
  order: 'asc' | 'desc';
  searchKey: string;
  status: string[];
  e: string[];
  p: string[];
  l: string[];
  d: string;
  r: string;
  min: number;
  max: number;
}>;

export type OrderTourQueryConfig = Partial<{
  tour: string;
  availableDate: number;
  adult: number;
  child: number;
}>;
