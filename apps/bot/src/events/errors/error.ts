import { Events } from 'discord.js';
import { Event } from '../../types/Event';

const event: Event<typeof Events.Error> = {
  name: Events.Error,
  once: false,
  execute(error: Error) {
    console.error('DiscordJS Framework Error:', error);
  },
};

export default event;
