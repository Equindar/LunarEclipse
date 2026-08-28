import { BotError } from "./BotError.js";

export class EventExecutionError extends BotError {
  constructor(
    public readonly eventName: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
  }
}
