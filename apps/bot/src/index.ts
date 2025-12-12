import { loadEvents } from './handlers/eventHandler';
import { loadCommands } from './handlers/commandHandler';
import { ErrorHandler } from './handlers/errorHandler';
import { DiscordNotifier } from './addons/notifiers/DiscordNotifier';
import createClient, { updateActivity } from './client';
import logger from './utils/logger';
import { ActivityType } from 'discord.js';
import path = require('path');
import Configuration from './config';

// --- Init
const cfg = new Configuration(
  // Backup der Konfiguration
  path.resolve(process.cwd(), './data/config_backup.json'),
  // Zusätzliche Konfiguration (neben .env Datei)
  path.resolve(process.cwd(), './config.json')
);
const client = createClient();

// --- Error handling
export const errorHandler = new ErrorHandler(
  // Init Notifiers
  new DiscordNotifier(client, process.env.ERROR_CHANNEL_ID!),
);

(async () => {



  try {
    cfg.init();
  } catch (err) {
    logger.error('Initialisierung der Konfiguration fehlgeschlagen:', err);
    process.exit(1);
  }

  await cfg.load();

  await loadEvents(client);
  await loadCommands(client);

  updateActivity(client,
    {
      name: "LunarEclispe ruleZ",
      type: ActivityType.Custom
    }
  );

  try {
    await client.login(cfg.get<string>('app.token'));
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
