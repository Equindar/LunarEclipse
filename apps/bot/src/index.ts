import { ErrorHandler } from './handlers/errorHandler.js';
import configuration from './config.js';
import { DiscordNotifier } from './addons/notifiers/DiscordNotifier.js';
import createClient, { updateActivity } from './client.js';
import { ActivityType, Events } from 'discord.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents, registerEvents } from './handlers/eventHandler.js';

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
  let events;

  try {
    events = await loadEvents('./events');
  } catch (error) {
    errorHandler.handle(error, 'Fehler beim Laden der Events');
    process.exit(1);
  }

  registerEvents(client, events);
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
