import { Message } from 'discord.js';

export interface MessageAnalyzer {
  name: string;
  analyze: (message: Message) => Promise<void> | void;
}
