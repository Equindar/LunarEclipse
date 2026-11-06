import type { Client } from 'discord.js';
import logger from '../utils/logger.js';

let isShuttingDown = false;

export async function shutdown(
  client: Client,
  reason: string,
): Promise<void> {
  if (isShuttingDown) {
    logger.warn('Shutdown läuft bereits.');
    return;
  }

  isShuttingDown = true;

  logger.info(`Bot wird heruntergefahren. Grund: ${reason}`);

  try {
    // Discord Gateway-Verbindung schließen
    client.destroy();

    logger.info('Discord-Client erfolgreich abgemeldet.');
  } catch (error) {
    logger.error('Fehler beim Abmelden des Discord-Clients:', error);
    throw error;
  }

  logger.info('Shutdown abgeschlossen.');
}
