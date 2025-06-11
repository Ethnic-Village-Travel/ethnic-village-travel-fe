export type QueryConfig = {
  page?: number;
  perPage?: number;
  status?: string[];
  ethnics?: string[];
  limit?: string;
  sort_by?: 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
};
