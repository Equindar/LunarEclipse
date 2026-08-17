import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import type { Client } from "discord.js";
import type { Event } from "../types/Event.js";
import { dirnameFromMeta, importModule } from "../utils/esm.js";
import logger from "../utils/logger.js";

const __dirname = dirnameFromMeta(import.meta.url);

function getEventFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      // Rekursiver Aufruf für Unterordner
      files.push(...getEventFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function loadEvents(client: Client) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = getEventFiles(eventsPath);

  try {
    logger.info("Events werden geladen...");
    for (const filePath of eventFiles) {
      const event = (await importModule<{ default: Event<any> }>(filePath)).default;
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      logger.debug(
        `Event geladen: ${event.name} (Quelle: ${path.relative(eventsPath, filePath)})`
      );
    }
    logger.info("Events erfolgreich geladen.");
  } catch (error) {
    logger.error("Laden (Events): fehlgeschlagen: ", error);
  }
}
