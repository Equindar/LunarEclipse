import { Client, Events } from 'discord.js';
import { Event } from '../types/Event';
import { logger } from "../utils/logger";
import { startServerStatusWatcher } from '../utils/serverStatusWatcher';

const event: Event<typeof Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    logger.info(`Client '${client.user?.tag}' eingeloggt.`);

    logger.debug('Client-Cache (Server):');
    client.guilds.cache.forEach((guild) => {
      logger.debug(`- ${guild.name} (ID: ${guild.id})`);
    });

    startServerStatusWatcher(client);
  },
};

export default event;
