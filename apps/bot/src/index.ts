import { ActivityType } from 'discord.js';
// import configuration from './config';
import dotenv from 'dotenv';
import { DiscordNotifier } from './addons/notifiers/DiscordNotifier.js';
import createClient, { updateActivity } from './client.js';
import { loadCommands } from './handlers/commandHandler.js';
import { ErrorHandler } from './handlers/errorHandler.js';
import { loadEvents } from './handlers/eventHandler.js';

// --- Init
dotenv.config();

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
  throw new Error('Missing enviroment variables');
}

const client = createClient();
updateActivity(client, 'LunarEclispe ruleZ', {
  name: 'Game',
  type: ActivityType.Custom,
});

// --- Error handling
export const errorHandler = new ErrorHandler(
  // Init Notifiers
  new DiscordNotifier(client, process.env.ERROR_CHANNEL_ID!),
);

(async () => {
  await loadEvents(client);
  await loadCommands(client);
  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    errorHandler.handle(error, 'Login fehlgeschlagen');
  }
})();

process.on('unhandledRejection', (reason, promise) => {
  errorHandler.handle(reason, 'Unhandled Rejection:');
});

process.on('uncaughtException', (error) => {
  errorHandler.handle(error, 'Uncaught Exception:');
  process.exit(1);
});
