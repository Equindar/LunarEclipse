import type { Client } from 'discord.js';
import { BotError } from '../errors/BotError.js';
import { registerProcessHandlers } from '../handlers/processHandlers.js';


async function main() {
  let client: Client | undefined;

  try {
    // --- Configuration
    const { default: configuration } = await import('../config/index.js');

    // --- Dependencies
    const [
      { default: createClient, updateActivity },
      { loadCommands },
      { createErrorHandler },
      { loadEvents, registerEvents },
      { loadAnalyzers },
    ] = await Promise.all([
      import('../client.js'),
      import('../handlers/commandHandler.js'),
      import('../handlers/createErrorHandler.js'),
      import('../handlers/eventHandler.js'),
      import('../utils/analyzerLoader.js'),
    ]);

    const { ActivityType } = await import('discord.js');

    // --- Init
    client = createClient();
    registerProcessHandlers(client);
    client.errorHandler = await createErrorHandler(client);

    // --- Loading
    let events;

    try {
      events = await loadEvents('./events');
    } catch (error) {
      await client.errorHandler.handle(
        error,
        'Fehler beim Laden der Events'
      );
      throw error;
    }

    client.commands = await loadCommands('./commands');

    client.analyzers = await loadAnalyzers((error) => {
      client?.errorHandler?.handle(
        error,
        'Fehler beim Laden der Analyzer'
      );
    });

    // --- Registration
    registerEvents(client, events);

    // --- Login
    await client.login(configuration.app.secret);

    await client.errorHandler.initNotifiers?.();

    // --- Activity
    updateActivity(client, 'LunarEclipse ruleZ', {
      name: 'Game',
      type: ActivityType.Custom,
    });

    return client;

  } catch (error) {
    if (client?.errorHandler) {
      await client.errorHandler.handle(
        error,
        'Fehler beim Starten des DiscordBots'
      );
    } else if (error instanceof BotError) {
      console.error(`[Startup Error] ${error.message}`);

      if ('issues' in error && Array.isArray(error.issues)) {
        for (const issue of error.issues) {
          console.error(`- ${issue}`);
        }
      }
    } else {
      console.error('[Unexpected Startup Error]', error);
    }

    process.exit(1);
  }
}

// --- Process Error Handling
const clientPromise = main();

process.on('unhandledRejection', async (reason) => {
  const client = await clientPromise.catch(() => null);

  if (client?.errorHandler) {
    await client.errorHandler.handle(
      reason,
      'Unhandled Rejection: '
    );
  } else {
    console.error('Unhandled Rejection:', reason);
  }
});

process.on('uncaughtException', async (error) => {
  const client = await clientPromise.catch(() => null);

  if (client?.errorHandler) {
    await client.errorHandler.handle(
      error,
      'Uncaught Exception: '
    );
  } else {
    console.error('Uncaught Exception:', error);
  }

  process.exit(1);
});
