import { BotError } from './BotError.js';

export class InvalidConfigurationError extends BotError {
  constructor(
    public readonly issues: string[],
  ) {
    super(`Ungültige Konfiguration: ${issues.join(', ')}`);
  }
}
