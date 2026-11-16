import { AppError } from './AppError.js';

export class InvalidConfigurationError extends AppError {
  constructor(
    public readonly issues: string[],
  ) {
    super(`Ungültige Konfiguration: ${issues.join(', ')}`);
  }
}
