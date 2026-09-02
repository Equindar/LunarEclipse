import createClient, { updateActivity } from './client.js';
import configuration from './config.js';
import { ActivityType } from 'discord.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents, registerEvents } from './handlers/eventHandler.js';
import { loadAnalyzers } from './utils/analyzerLoader.js';
import { createErrorHandler } from './handlers/createErrorHandler.js';


async function main() {
  // --- Init
  const client = createClient();
  if (!client) {
    console.error('Discord-Client konnte nicht erstellt werden');
    process.exit(1);
  }

  // --- Error handling
  client.errorHandler = await createErrorHandler(client);

  // --- Loading
  // Events
  let events;
  try {
    events = await loadEvents('./events');
  } catch (error) {
    client.errorHandler.handle(error, 'Fehler beim Laden der Events');
    process.exit(1);
  }
  // Commands
  client.commands = await loadCommands('./commands');
  // Analyzers
  client.analyzers = await loadAnalyzers((error) => {
    client.errorHandler.handle(error, 'Fehler beim Laden der Analyzer');
  });

  // --- Registration
  registerEvents(client, events);
  // --- Login
  try {
    await client.login(configuration.app.secret);
  } catch (error) {
    await client.errorHandler.handle(error, 'Login fehlgeschlagen');
  }

  await client.errorHandler.initNotifiers?.();

  try {
    updateActivity(client, 'LunarEclipse ruleZ', {
      name: 'Game',
      type: ActivityType.Custom,
    });
  } catch (error) {
    await client.errorHandler.handle(error, 'Aktualisierung der Aktivität fehlgeschlagen');
  }

  return client;

}

// Run the main function and handle unhandled rejections and uncaught exceptions
const clientPromise = main();

process.on('unhandledRejection', async (reason) => {
  const client = await clientPromise.catch(() => null);
  if (client?.errorHandler) {
    await client.errorHandler.handle(reason, 'Unhandled Rejection: ');
  } else {
    console.error('Unhandled Rejection (vor Main-Abschluss):', reason);
  }
});

process.on('uncaughtException', async (error) => {
  const client = await clientPromise.catch(() => null);
  if (client?.errorHandler) {
    await client.errorHandler.handle(error, 'Uncaught Exception: ');
  } else {
    console.error('Uncaught Exception (vor Main-Abschluss):', error);
  }
  process.exit(1);
});
