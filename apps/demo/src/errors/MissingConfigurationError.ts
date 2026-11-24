import { AppError } from "./AppError.js";

export class MissingConfigurationError extends AppError {
  constructor(public readonly requiredConfiguration: string) {
    super(`Fehlende Konfiguration: ${requiredConfiguration}`);
  }
}
