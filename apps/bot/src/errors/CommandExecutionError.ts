import { BotError } from "./BotError.js";

export class CommandExecutionError extends BotError {
  constructor(
    public readonly commandName: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
  }
}
