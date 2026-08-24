import { Notifier } from '../types/Notifier.js';
import logger from '../utils/logger.js';

export class ErrorHandler {
  private notifiers: Notifier[];

  constructor() {
    this.notifiers = [];
  }

  attachNotifier = (notifier: Notifier) => {
    this.notifiers.push(notifier);
  }

  async handle(error: unknown, context?: string): Promise<void> {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    for (const notifier of this.notifiers) {
      await notifier.notify(message, error);
    }

    logger.error(
      `${context ? context : ''}${message} \n${error instanceof Error ? error.stack : undefined}`,
    );
  }
}
