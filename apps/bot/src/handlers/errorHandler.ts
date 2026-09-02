import { Notifier } from '../types/Notifier.js';
import logger from '../utils/logger.js';

export class ErrorHandler {
  private notifiers: Notifier[];

  constructor(...notifiers: Notifier[]) {
    this.notifiers = notifiers;
  }

  attachNotifier = (notifier: Notifier) => {
    this.notifiers.push(notifier);
  }

  async initNotifiers(): Promise<void> {
    await Promise.all(
      this.notifiers.map((notifier) =>
        'init' in notifier && typeof notifier.init === 'function'
          ? (notifier.init as () => Promise<void>)().catch((error) =>
            logger.error(`Notifier "${notifier.name}" konnte nicht initialisiert werden:`, error),
          )
          : Promise.resolve(),
      ),
    );
  }

  async handle(error: unknown, context?: string): Promise<void> {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);

    for (const notifier of this.notifiers) {
      try {
        await notifier.notify(message, error);
      } catch (notifyError) {
        logger.error(`Fehler beim Senden der Fehlermeldung an ${notifier.constructor.name}:`, notifyError);
      }
    }

    logger.error(
      `${context ? context : ''}${message} \n${error instanceof Error ? error.stack : undefined}`,
    );
  }
}
