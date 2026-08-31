// types/discord.d.ts
import { Collection } from 'discord.js';
import type { Command } from './Command.js';
import type { MessageAnalyzer } from './MessageAnalyzer.js';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    analyzers: MessageAnalyzer[];
  }
}
