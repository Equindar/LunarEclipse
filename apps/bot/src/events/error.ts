import { Events } from 'discord.js';
import { Event } from '../types/Event.js';
import { errorHandler } from '../index.js';

const event: Event<typeof Events.Error> = {
  name: Events.Error,
  once: false,
  execute(error: Error) {
    void errorHandler.handle(error, 'DiscordJS Framework Error');
  },
};

export default event;
