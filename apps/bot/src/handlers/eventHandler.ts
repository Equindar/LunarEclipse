import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Event } from '../types/Event.js';
import { DirectoryChannel, type Client } from 'discord.js';
import logger from '../utils/logger.js';
import { importModule } from '../utils/esm.js';
import { EventLoadingError } from '../errors/EventLoadingError.js';
import { EventExecutionError } from '../errors/EventExecutionError.js';
import { errorHandler } from '../index.js';
import { kMaxLength } from 'node:buffer';

// Module-Logger
const eventLogger = logger.child({ module: 'Events' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEventFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...getEventFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

export async function loadEvents(directory: string): Promise<Event<any>[]> {
  const eventsPath = path.join(__dirname, '..', directory);
  const eventFiles = getEventFiles(eventsPath);
  const events: Event<any>[] = [];
  const loaded = new Set<string>();

  eventLogger.info('Events werden geladen...');

  try {
    for (const filePath of eventFiles) {
      const source = path.relative(eventsPath, filePath);
      let module: { default?: Event<any> };

      try {
        module = (await importModule<{ default: Event<any> }>(filePath));
      } catch (error) {
        throw new EventLoadingError(`Fehler beim Laden des Events (Quelle: ${source}): ${error}`);
      }

      const event = module.default;
      if (!event || !event?.name || typeof event.execute !== 'function') {
        throw new EventLoadingError(`Ungültiges Event: ${event?.name || 'Unbekannt'} (Quelle: ${source})`);
      }

      if (loaded.has(event.name)) {
        throw new EventLoadingError(`Doppelte Event-Registrierung: ${event.name} (Quelle: ${source})`);
      }
      loaded.add(event.name);
      events.push(event);

      eventLogger.debug(`Event geladen: ${event.name} (Quelle: ${path.relative(eventsPath, filePath)})`);
    }
    eventLogger.info(`${loaded.size}/${eventFiles.length} Events erfolgreich geladen`);
  } catch (error) {
    eventLogger.error('Laden fehlgeschlagen: ', error);
    eventLogger.warn(`${loaded.size}/${eventFiles.length} Events geladen`);
  }
  return events;
}

export function registerEvents(client: Client, events: Event<any>[]): void {
  for (const event of events) {
    const wrapped = async (...args: unknown[]) => {
      try {
        await event.execute(...args);
      } catch (error) {
        const wrappedError =
          error instanceof EventExecutionError
            ? error
            : new EventExecutionError(event.name, `Ausführung von "${event.name}" fehlgeschlagen`, error);

        await errorHandler.handle(wrappedError, `Event "${event.name}": `);
      }
    };

    client[event.once ? "once" : "on"](event.name, wrapped);
  }
}
