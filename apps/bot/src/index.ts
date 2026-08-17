
// import logger from './utils/logger';
import { ActivityType } from 'discord.js';
// import configuration from './config';
import dotenv from 'dotenv';
import { DiscordNotifier } from './addons/notifiers/DiscordNotifier.js';
import createClient, { updateActivity } from './client.js';
import { loadCommands } from './handlers/commandHandler.js';
import { ErrorHandler } from './handlers/errorHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import logger from './utils/logger.js';

// --- Init
dotenv.config();

logger.info("Ich bin am Leben.");

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
  throw new Error('Missing enviroment variables');
}

const client = createClient();
updateActivity(client, "LunarEclispe ruleZ",
  {
    name: 'Game',
    type: ActivityType.Custom
  }
);

// --- Error handling
export const errorHandler = new ErrorHandler(
  // Init Notifiers
  new DiscordNotifier(client, process.env.ERROR_CHANNEL_ID!),
);

(async () => {
  await loadEvents(client);
  // await loadCommands(client);
  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.error('Login fehlgeschlagen: ', error);
  }
})();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
