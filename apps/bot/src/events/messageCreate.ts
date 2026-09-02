import { Events, Message } from 'discord.js';
import { Event } from '../types/Event.js';
import { AddonExecutionError } from '../errors/AddonExecutionError.js';

const event: Event<typeof Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(client, message: Message) {
    // Ignoriere Nachrichten von Bots
    if (message.author.bot) return;

    for (const analyzer of message.client.analyzers) {
      try {
        await analyzer.analyze(message);
      } catch (error) {
        await client.errorHandler.handle(
          new AddonExecutionError('Analyzer', analyzer.name, `Analyzer "${analyzer.name}" fehlgeschlagen`, error),
          'MessageCreate: ',
        );
      }
    }
  },
};

export default event;
