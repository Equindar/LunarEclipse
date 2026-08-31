import { BotError } from "./BotError.js";

export class ChannelNotSendableError extends BotError {
  constructor(
    public readonly channelId: string,
    public readonly channelName?: string,
  ) {
    super(`Channel "${channelName ?? channelId}" ist nicht sendable`);
  }
}
