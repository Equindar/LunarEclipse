import { Events, Message } from 'discord.js';
import { Event } from '../types/Event.js';
import { loadAnalyzers } from '../utils/analyzerLoader.js';
import logger from '../utils/logger.js';

const analyzers = loadAnalyzers();

const event: Event<typeof Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    // Ignoriere Nachrichten von Bots
    if (message.author.bot) return;

    for (const analyzer of await analyzers) {
      try {
        await analyzer.analyze(message);
      } catch (error) {
        logger.error(`Fehler im Analyzer "${analyzer.name}":`, error);
      }
    }
  },
};

export default event;
