export interface ApiResponse<T = any> {
  meta: {
    code: number;
    success: boolean;
    message: string;
  };
  data?: T;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}
