import { Collection } from 'discord.js';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import type { Command } from '../types/Command.js';
import { importModule } from '../utils/esm.js';
import logger from '../utils/logger.js';
import { fileURLToPath } from 'node:url';
import { CommandLoadingError } from '../errors/CommandLoadingError.js';

// Commands-Logger
const commandLogger = logger.child({ module: 'Commands' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCommandFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...getCommandFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}


export async function loadCommands(directory: string): Promise<Collection<string, Command>> {
  const commandsPath = path.join(__dirname, '..', directory);
  const commandFiles = getCommandFiles(commandsPath);
  const commands = new Collection<string, Command>();

  commandLogger.info('Slash Commands werden geladen...');

  try {
    for (const filePath of commandFiles) {
      const source = path.relative(commandsPath, filePath);
      let module: { default?: Command };

      try {
        module = (await importModule<{ default: Command }>(filePath));
      } catch (error) {
        throw new CommandLoadingError(`Fehler beim Laden des Commands (Quelle: ${source}): ${error}`);
      }

      const command = module.default;
      if (!command || !command?.data?.name || typeof command.execute !== 'function') {
        throw new CommandLoadingError(`Ungültiges Command: ${command?.data?.name || 'Unbekannt'} (Quelle: ${source})`);
      }

      if (commands.has(command.data.name)) {
        throw new CommandLoadingError(`Doppelte Command-Registrierung: ${command.data.name} (Quelle: ${source})`);
      }
      commands.set(command.data.name, command);
      commandLogger.debug(`Command geladen: ${command.data.name} (Quelle: ${path.relative(commandsPath, filePath)})`);
    }
    commandLogger.info(`${commands.size}/${commandFiles.length} Commands erfolgreich geladen`);
  } catch (error) {
    commandLogger.error('Laden fehlgeschlagen: ', error);
    commandLogger.warn(`${commands.size}/${commandFiles.length} Commands geladen`);
  }
  return commands;
}
