import type { Client } from 'discord.js';
import { shutdown } from '../lifecycle/shutdown.js';

export function registerProcessHandlers(client: Client): void {
  process.once('SIGINT', () => {
    shutdown(client, 'SIGINT').catch((error) => {
      console.error('Shutdown fehlgeschlagen:', error);
      process.exitCode = 1;
    });
  });

  process.once('SIGTERM', () => {
    shutdown(client, 'SIGTERM').catch((error) => {
      console.error('Shutdown fehlgeschlagen:', error);
      process.exitCode = 1;
    });
  });
}
