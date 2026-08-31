import { BotError } from "./BotError.js";

export class CommandLoadingError extends BotError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, /* isOperational */ false); // = Bug, nicht "erwartet"
  }
}
