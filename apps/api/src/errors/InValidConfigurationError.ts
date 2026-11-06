import { ApiError } from './ApiError.js';

export class InvalidConfigurationError extends ApiError {
  constructor(
    public readonly issues: string[],
  ) {
    super(`Ungültige Konfiguration: ${issues.join(', ')}`);
  }
}
