import { Events, Guild } from 'discord.js';
import { Event } from '../types/Event.js';
import logger from '../utils/logger.js';

const event: Event<typeof Events.GuildCreate> = {
  name: Events.GuildCreate,
  once: false,
  execute(guild: Guild) {
    logger.info(`Server '${guild.name}' (ID: ${guild.id}) beigetreten.`);
  },
};

export default event;
