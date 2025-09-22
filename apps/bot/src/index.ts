import { loadEvents } from './handlers/eventHandler';
import { loadCommands } from './handlers/commandHandler';
import { ErrorHandler } from './handlers/errorHandler';
import { DiscordNotifier } from './addons/notifiers/DiscordNotifier';
import dotenv = require('dotenv');
import { logger } from './utils/logger';
import createClient from './client';

// --- Init
dotenv.config();
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error('Missing enviroment variables');
}

const client = createClient();

// --- Error handling
export const errorHandler = new ErrorHandler(
  // Init Notifiers
  new DiscordNotifier(client, process.env.ERROR_CHANNEL_ID!),
);

(async () => {
  await loadEvents(client);
  await loadCommands(client);
  try {
    await client.login(DISCORD_TOKEN);
  } catch (error) {
    logger.error("Login fehlgeschlagen: ", error);
  }
})();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
