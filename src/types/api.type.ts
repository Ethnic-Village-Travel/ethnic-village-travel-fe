export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

// export type UnwrapApiResponse<T> = T extends ApiResponse<infer U> ? U : T;
// export type UnwrapNestedData<T> = T extends { data: infer U } ? U : T;
