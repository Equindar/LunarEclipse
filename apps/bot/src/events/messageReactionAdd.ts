import { Events, MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { Event } from '../types/Event';
import { errorHandler } from '../index';
import { logger } from '../utils/logger';

const event: Event<typeof Events.MessageReactionAdd> = {
  name: Events.MessageReactionAdd,
  once: false,
  async execute(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ): Promise<void> {
    // ignore Bot Reactions
    if (user.bot) return;

    try {
      if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        await reaction.fetch();
      }
      if (reaction.emoji.name === '💩') {
        logger.debug('💩 reaction detected');
      }
    } catch (error) {
      await errorHandler.handle(error, 'Fehler in MessageReactionAdd');
    }
  },
};

export default event;
