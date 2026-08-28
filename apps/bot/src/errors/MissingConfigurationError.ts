import { BotError } from "./BotError.js";

export class MissingConfigurationError extends BotError {
  constructor(public readonly requiredConfiguration: string) {
    super(`Fehlende Konfiguration: ${requiredConfiguration}`);
  }
}
