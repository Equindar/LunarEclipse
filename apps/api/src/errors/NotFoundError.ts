import { ApiError } from "./ApiError.js";

export class NotFoundError extends ApiError {
  constructor(public readonly resource: string) {
    super(`Ressource nicht gefunden: ${resource}`);
  }
}
