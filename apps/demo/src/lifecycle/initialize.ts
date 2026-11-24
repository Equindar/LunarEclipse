
import type { Hono } from 'hono';
import { AppEnv } from '../app.js';
import { logI18n } from '../utils/logI18n.js';

export interface ApplicationDependencies {
  configuration: typeof import('../config/index.js')['default'];
  logger: typeof import('../utils/logger.js')['default'];
}

export interface InitializedApplication extends ApplicationDependencies {
  app: Hono<AppEnv>;
}

// --- Singleton-Pattern
// Gespeichertes Initialize-Promise
let initialization: Promise<InitializedApplication> | undefined;

export function initialize(): Promise<InitializedApplication> {
  initialization ??= init();

  return initialization;
}


async function init(): Promise<InitializedApplication> {
  // 1. Konfiguration laden und validieren
  const { default: configuration } =
    await import('../config/index.js');

  // 2. Logger initialisieren
  const { default: logger } =
    await import('../utils/logger.js');

  logI18n(logger);
  logger.info('Initializing application...');

  // 3. Weitere Infrastruktur initialisieren
  // Beispiel:
  // const { default: database } =
  //   await import('@lunareclipse/database');
  //
  // await database.checkConnection();

  // 4. Hono-App erstellen
  const { createApp } = await import('../app.js');

  const app = createApp({
    configuration,
    logger,
  });

  logger.info('Application initialized');

  return {
    app,
    configuration,
    logger,
  };
}
