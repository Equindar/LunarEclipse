import { Events } from 'discord.js';
import { Event } from '../types/Event.js';

const event: Event<typeof Events.Error> = {
  name: Events.Error,
  once: false,
  execute(client, error: Error) {
    void client.errorHandler.handle(error, 'DiscordJS Framework Error');
  },
};

export default event;
