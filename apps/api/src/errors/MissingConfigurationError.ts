import { ApiError } from "./ApiError.js";

export class MissingConfigurationError extends ApiError {
  constructor(public readonly requiredConfiguration: string) {
    super(`Fehlende Konfiguration: ${requiredConfiguration}`);
  }
}
