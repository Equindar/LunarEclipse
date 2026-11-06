import { Client } from 'discord.js';
import path from 'node:path';
import type { NotifierFactory } from '../types/Notifier.js';
import { dirnameFromMeta } from '../utils/esm.js';
import { loadAddons } from './addonHandler.js';
import { ErrorHandler } from './errorHandler.js';

const __dirname = dirnameFromMeta(import.meta.url);

export async function createErrorHandler(client: Client): Promise<ErrorHandler> {
  const factories = await loadAddons<NotifierFactory>({
    addonType: 'Notifier',
    directory: path.join(__dirname, '..', 'addons', 'notifiers'),
    isValid: (value): value is NotifierFactory => typeof value === 'function',
    onLoadError: (error) => console.error(error.message, error.cause),
  });

  const notifiers = factories.map((factory) => factory(client));

  return new ErrorHandler(...notifiers);
}
