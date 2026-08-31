import { Message } from 'discord.js';
import { Addon } from './Addon.js';

export interface MessageAnalyzer extends Addon {
  analyze: (message: Message) => Promise<void> | void;
}
