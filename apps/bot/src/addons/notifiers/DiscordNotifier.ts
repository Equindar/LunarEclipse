import { Client, TextChannel } from 'discord.js';
import { Notifier } from '../../types/Notifier';

export class DiscordNotifier implements Notifier {
  private client: Client;
  private channelId: string;

  constructor(client: Client, channelId: string) {
    this.client = client;
    this.channelId = channelId;
  }

  async notify(message: string, error?: unknown): Promise<void> {
    const channel = await this.client.channels.fetch(this.channelId);
    if (!channel || !channel.isTextBased()) return;

    const errorMessage =
      error instanceof Error
        ? `${message}\n\`\`\`${error.message}\n${error.stack}\`\`\``
        : `${message}\n\`\`\`${String(error)}\`\`\``;

    (channel as TextChannel).send(errorMessage).catch(console.error);
  }
}
