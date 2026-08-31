import { BotError } from './BotError.js';

export abstract class AddonError extends BotError {
  constructor(
    public readonly addonType: string,
    message: string,
    isOperational = true, // Addons sind standardmäßig NICHT fatal
  ) {
    super(message, isOperational);
  }
}
