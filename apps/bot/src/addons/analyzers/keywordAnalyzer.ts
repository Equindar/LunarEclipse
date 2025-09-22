import { MessageAnalyzer } from '../../types/MessageAnalyzer';
import { logger } from '../../utils/logger';

const keywords: string[] = ['hilfe', 'admin', 'server', 'offline'];

export const keywordAnalyzer: MessageAnalyzer = {
  name: 'keywordAnalyzer',
  analyze(message) {
    keywords.forEach((item) => {
      if (message.content.toLowerCase().includes(item)) {
        logger.debug(
          `Keyword '${item}' erkannt in Server "${message.guild?.name}" (${message.guildId}) von User ${message.author.tag}`,
        );
      }
    });
  },
};
