import { MessageAnalyzer } from '../../types/MessageAnalyzer';
import { logger } from '../../utils/logger';

const urlPrefix = /http:\/\/test/;
const shareRegex = /\/share\/([A-Za-z0-9_-]+)/;

export const shareAnalyzer: MessageAnalyzer = {
  name: 'shareAnalyzer',
  analyze(message) {
    const match = message.content.match(new RegExp(urlPrefix.source + shareRegex.source));
    if (match) {
      const shareId = match[1];
      logger.debug(
        `Share-Link gefunden in Guild "${message.guild?.name}" (${message.guildId}): ID = ${shareId}`,
      );
    }
  },
};
