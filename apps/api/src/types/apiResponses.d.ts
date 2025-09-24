export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  apiVersion: string;
  data?: T;
  errorMessage?: string;
}

export interface SuccessResponseContract<T> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponseContract extends ApiResponse<null> {
  success: false;
  errorMessage: string;
}
