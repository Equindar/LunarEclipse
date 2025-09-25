import { Response } from 'express';
import { ApiResponse, ErrorResponseContract, SuccessResponseContract } from './apiResponses';

export class SuccessResponse<T> implements SuccessResponseContract<T> {
  constructor(
    public readonly apiVersion: string,
    public readonly data: T,
    public readonly statusCode = 200,
    public readonly success: true = true,
  ) {}

  send(res: Response): Response<ApiResponse<T>> {
    return res.status(this.statusCode).json(this);
  }
}

export class ErrorResponse implements ErrorResponseContract {
  constructor(
    public readonly apiVersion: string,
    public readonly errorMessage: string,
    public readonly statusCode = 400,
    public readonly success: false = false,
    public readonly data: null = null,
  ) {}

  send(res: Response): Response<ApiResponse<null>> {
    return res.status(this.statusCode).json(this);
  }
}
