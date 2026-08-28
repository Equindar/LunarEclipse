import { BotError } from "./BotError.js";

export class EventLoadingError extends BotError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, /* isOperational */ false); // = Bug, nicht "erwartet"
  }
}
