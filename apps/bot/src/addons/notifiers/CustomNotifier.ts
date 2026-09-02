import { Client } from 'discord.js';
import { Notifier, NotifierFactory } from '../../types/Notifier.js';

class CustomNotifier implements Notifier {
  name: string;

  constructor(client: Client) {
    this.name = 'CustomNotifier';
  }
  async notify(message: string, error?: unknown): Promise<void> {
    // Not Implemented: This is a placeholder for the custom notification logic.
  }
}


const createCustomNotifier: NotifierFactory = (client) =>
  new CustomNotifier(client);

export default createCustomNotifier;
