import { ErrorHandler } from './handlers/errorHandler.js';
import configuration from './config.js';
import { DiscordNotifier } from './addons/notifiers/DiscordNotifier.js';
import createClient, { updateActivity } from './client.js';
import { ActivityType } from 'discord.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';

// --- Init
const client = createClient();

// --- Error handling
export const errorHandler = new ErrorHandler();

if (!client) {
  errorHandler.handle(new Error('Discord-Client konnte nicht erstellt werden'));
  process.exit(1);
}

errorHandler.attachNotifier(new DiscordNotifier(client, process.env.ERROR_CHANNEL_ID!));

(async () => {
  await loadEvents(client);
  await loadCommands(client);
  try {
    await client.login(configuration.app.secret);
  } catch (error) {
    errorHandler.handle(error, 'Login fehlgeschlagen');
  }

  updateActivity(client, 'LunarEclipse ruleZ', {
    name: 'Game',
    type: ActivityType.Custom,
  });

})();

process.on('unhandledRejection', (reason, promise) => {
  errorHandler.handle(reason, 'Unhandled Rejection:');
});

process.on('uncaughtException', (error) => {
  errorHandler.handle(error, 'Uncaught Exception:');
  process.exit(1);
});
