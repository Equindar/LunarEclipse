import { Response } from "express";

export interface NewApiResponse<T = unknown> extends Response {
  apiVersion: string,
  statusCode: number,
  success: boolean,
  data?: T,
  errorMessage?: string
}

// Standard ApiResponse
export default abstract class ApiResponse<T = unknown> {
  constructor(
    public readonly statusCode: number,
    public readonly success: boolean,
    public readonly apiVersion: string,
    public readonly data?: T,
    public readonly errorMessage?: string
  ) { }

  send(res: Response): Response {
    return res.status(this.statusCode).json(this);
  }
}

// Erfolg
export class SuccessResponse<T> extends ApiResponse<T> {
  constructor(apiVersion: string, data: T, statusCode = 200) {
    super(statusCode, true, apiVersion, data, undefined);
  }
}

// Fehler
export class ErrorResponse extends ApiResponse<null> {
  constructor(apiVersion: string, errorMessage: string, statusCode = 400) {
    super(statusCode, false, apiVersion, undefined, errorMessage);
  }
}

export class UnsupportedVersionResponse extends ErrorResponse {

}

