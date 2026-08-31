import { readdirSync } from 'node:fs';
import path from 'node:path';
import { AddonLoadingError } from '../errors/AddonLoadingError.js';
import type { Addon } from '../types/Addon.js';
import logger from '../utils/logger.js';
import { importModule } from '../utils/esm.js';

// Addon-Logger
const addonLogger = logger.child({ module: 'Addons' });

interface LoadAddonsOptions<T extends Addon> {
  addonType: string;
  directory: string;
  isValid: (value: unknown) => value is T;
  onLoadError?: (error: AddonLoadingError) => void | Promise<void>;
}

export async function loadAddons<T extends Addon>({
  addonType,
  directory,
  isValid,
  onLoadError,
}: LoadAddonsOptions<T>): Promise<T[]> {

  addonLogger.info(`${addonType}s werden geladen...`);

  const addons: T[] = [];
  const files = readdirSync(directory).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(directory, file);

    try {
      const module = await importModule<Record<string, unknown>>(filePath);
      for (const key in module) {
        const candidate = module[key];
        if (!isValid(candidate)) {
          addonLogger.debug(`Übersprungen: Export "${key}" in "${file}" ist kein gültiges ${addonType}.`);
          continue;
        }
        addons.push(candidate);
        addonLogger.debug(`${addonType} geladen: ${candidate.name}`);
      }
    } catch (error) {
      const loadingError = new AddonLoadingError(
        addonType,
        file,
        `${addonType}-Datei "${file}" konnte nicht geladen werden`,
        error,
      );
      if (onLoadError) {
        await onLoadError(loadingError);
      } else {
        addonLogger.warn(loadingError.message, error);
      }
      // bewusst kein throw: ein kaputtes Addon soll die anderen nicht verhindern
    }
  }

  addonLogger.info(`${addonType}s geladen: ${addons.length}/${files.length}`);
  return addons;
}
